module.exports = (app, plugin, model, config) => {
  const express = require('express');
  const router = express.Router();

  const { Myself } = model
  const { requestResult } = plugin

  // 提交个人简介
  router.post('/myself', async (req, res) => {
    const _id = req.body.id
    if (req.body.id) {
      const result = await Myself.findByIdAndUpdate(
        _id, req.body, (err, doc) => {
          return doc
        })
      res.send(requestResult('编辑成功', 0, result))
    } else {
      const result = await Myself.create(req.body)
      res.send(requestResult('提交成功', 0, result))
    }
  })

  // 获取个人简介
  router.get('/myself', async (req, res) => {
    const result = await Myself.findOne()
    res.send(requestResult('获取成功', 0, result))
  })

  app.use('/admin/api', router)
}
