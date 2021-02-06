module.exports = (app, plugin, model, config) => {
  const express = require('express');
  const router = express.Router();

  const { Comment, Counter, Article } = model
  const { email, getPage, requestResult } = plugin

  // 获取评论列表
  router.get('/comment', async (req, res) => {
    const page = req.query.page || 1;
    const size = req.query.count || 10;

    const data = await getPage(Comment, page, size)
    res.send(requestResult('', 0, data))
  })

  // 删除评论
  router.delete('/comment', async (req, res) => {
    const id = req.body.id;
    const total = [
      new Promise((resolve, reject) => {
        Comment.deleteOne({ id }, (err, doc) => doc ? resolve(doc) : reject())
      })
    ]
    // 删除所有子评论
    if (!req.body.parent_id) {
      total.push(new Promise((resolve, reject) => {
        Comment.deleteMany({ parent_id: id }, (err, doc) => doc ? resolve(doc) : reject())
      }))
    }
    Promise.all(total).then(resolve => {
      res.send(requestResult('删除成功', 0, resolve[0]))
    }).catch(err => {
      res.send(requestResult('删除失败', 1, err))
    })
  })
  // Reply
  router.post('/comment', async (req, res) => {
    const commentCount = await Counter.findOneAndUpdate({
      name: 'comment'
    }, {
      $inc: { 'count': 1 }
    }, {
      new: true
    })

    // 添加评论id
    req.body.data.id = commentCount.count;
    const result = await Comment.create(req.body.data)

    res.send(requestResult('', 0, result))

    // 邮件信息
    if (req.body.email.comment) {
      const articleData = await Article.findOne({ id: req.body.data.topic_id })
      const data = {
        title: articleData.title,
        url: req.body.email.web_address + '/' + req.body.data.topic_id,
        name: req.body.data.reply_name,
        email: req.body.data.reply_email
      }
      // 发送邮件
      email(3, data, req.body.email)
    }
  })

  // 一键已读
  router.post('/comment_read', async (req, res) => {
    const comment = await Comment.updateMany({
      status: 1
    }, {
      $set: { status: 2 }
    }, {
      multi: true
    }, (err, doc) => {
      return doc;
    })
  })
  app.use('/admin/api', router)
}