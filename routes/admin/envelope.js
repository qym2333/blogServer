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
        const size = req.query.count || 50; //每页数量
        const data = await getPage(Envelope, page, size);

        res.send(requestResult('获取信封列表成功！', 0, data))
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
        let result = null;
        const envelopeInfo = {
            ...req.body
        };
        if (envelopeId) {
            envelopeInfo.id = envelopeId.sequence;
            result = await Envelope.create(envelopeInfo);
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
            result = await Envelope.create(envelopeInfo);
        }
        res.send(requestResult('发布成功！', 0, result))
    });

    /** 
     * 根据id编辑
     */
    router.put('/envelope/:id', async (req, res) => {
        //查找并更新数据
        const data = await Envelope.findByIdAndUpdate(req.params.id, req.body, {}, (err, doc) => {
            if (err) return res.send(err.message);
            return doc;
        });
        res.send({
            status: 0,
            message: '修改成功！',
            data: data
        });
    });
    /** 
     * 根据id获得指定信
     */
    router.get('/envelope/:id', async (req, res) => {
        const data = await Envelope.findById(req.params.id, req.body);
        // data._doc['time'] = dateFormat(data.time);
        res.send(data);
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
        res.send(requestResult('删除成功', 0, data))
    })
    app.use('/admin/api', router);
}