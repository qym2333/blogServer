module.exports = (app, plugin, model, config) => {
    const express = require('express');
    const router = express.Router();
    const moment = require('moment');
    const mongoose = require('mongoose');
    const {
        Envelope,
        Counter
    } = model;
    const {
        getPage,
        requestResult
    } = plugin;

    /** 
     * 获取信列表
     */
    router.get('/envelope', async (req, res) => {
        //获取前100封信
        // const data = await Envelope.find({}).sort({
        //     time: -1
        // }).limit(100);
        //格式化数据中的时间
        // data.forEach(item => item._doc['time'] = dateFormat(item.time));
        const page = req.query.page || 1; //页码
        const size = req.query.count || 8; //每页数量
        const data = await getPage(Envelope, page, size);
        new requestResult(data, '获取信封列表成功！').success(res)
    });

    /** 
     * 写一封信
     */
    router.post('/envelope', async (req, res) => {
        // 自定义id
        const envelopeId = await Counter.findOneAndUpdate({
            name: 'envelopeId'
        }, {
            $inc: {
                'sequence': 1
            }
        }, {
            new: true
        });
        const envelopeInfo = {
            ...req.body
        };
        if (envelopeId) {
            envelopeInfo.id = envelopeId.sequence;
        } else {
            /**
             * 第一次发表文章
             * 创建自增id字段
             */
            const seqData = {
                name: 'envelopeId',
                sequence: 10001
            }
            const seq = await Counter.create(seqData);
            envelopeInfo.id = seq.sequence;
        }
        try {
            const result = await Envelope.create(envelopeInfo);
            new requestResult(result, '发布成功！').success(res)
        } catch (err) {
            new requestResult(null, '发布失败！', err).fail(res)
        }
    });

    /** 
     * 根据id编辑
     */
    router.put('/envelope/:id', async (req, res) => {
        //查找并更新数据
        const data = await Envelope.findOneAndUpdate({
            id: req.params.id
        }, req.body, (err, doc) => {
            if (err) new requestResult(null, '更新失败', err).fail(res)
            return doc;
        });
        new requestResult(data, '修改成功！').success(res)
    });
    /** 
     * 根据id获得指定信
     */
    router.get('/envelope/:id', async (req, res) => {
        const data = await Envelope.find({
            id: req.params.id
        });
        // data._doc['time'] = dateFormat(data.time);
        new requestResult(data, '获取成功！').success(res)
    });
    /** 
     * 删除
     */
    // router.delete('/envelope/:id', async (req, res) => {
    // var id = Envelope.Types.ObjectId(req.params.id);
    // await Envelope.findByIdAndDelete(req.params.id, req.body)
    // res.send(requestResult('删除成功', 0, data))
    // });
    router.delete('/envelope/del/:id', async (req, res) => {
        const data = await Envelope.findOneAndUpdate({
            id: req.params.id
        }, {
            deleted: true
        }, (err, doc) => {
            return doc;
        });
        new requestResult(data, '删除成功！').success(res)
    })
    app.use('/admin/api', router);
}