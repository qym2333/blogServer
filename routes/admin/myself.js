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
      new requestResult(result, '编辑成功！').success(res)
    } else {
      const result = await Myself.create(req.body)
      new requestResult(result, '编辑成功！').success(res)
    }
  })

  // 获取个人简介
  router.get('/myself', async (req, res) => {
    const result = await Myself.findOne()
    new requestResult(result, '编辑成功！').success(res)
  })

  app.use('/admin/api', router)
}
