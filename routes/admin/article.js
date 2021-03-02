module.exports = (app, plugin, model, config) => {
    const express = require('express');
    const router = express.Router();
    const {
        Article,
        Counter
    } = model;

    const {
        getPage,
        requestResult
    } = plugin

    /** 
     * 获取文章列表
     */
    router.get('/article', async (req, res) => {
        const page = req.query.page || 1; //页码
        const size = req.query.count || 5; //每页数量

        const { data } = await getPage(Article, page, size);
        new requestResult(data, '获取文章列表成功！').success(res)
    });

    /**  
     * 根据id获取文章
     */
    router.get('/article/:id', async (req, res) => {
        const data = await Article.find({
            id: req.params.id
        });
        if (data.length > 0) {
            new requestResult(data, '获取成功！').success(res)
        }
        else {
            new requestResult('获取失败！').fail(res)
        }
    });
    /**
     * 发布文章
     */
    router.post('/article', async (req, res) => {
        /**
         * 获取计数器,自增
         */
        const articleId = await Counter.findOneAndUpdate({
            name: 'articleId'
        }, {
            $inc: {
                'sequence': 1
            }
        }, {
            new: true
        });

        // let result = null;
        //上传的文章信息
        const articleInfo = {
            ...req.body,
        }
        if (articleId) {
            // 自定义id
            // req.body.data.id = articleId.sequence;
            articleInfo.id = articleId.sequence;
            // result = await Article.create(articleInfo)
        } else {
            /**
             * 第一次发表文章
             * 创建自增id字段
             */
            const seqData = {
                name: 'articleId',
                sequence: 10001
            }
            const seq = await Counter.create(seqData);
            articleInfo.id = seq.sequence;
            // result = await Article.create(articleInfo)
        }
        try {
            const result = await Article.create(articleInfo)
            new requestResult(result, '发布文章成功').success(res)
        } catch (err) {
            new requestResult(null, '发布文章失败', err).fail(res)
        }
        // TODO：发送通知 Subscribe

    });
    /** 
     *更新文章 
     */
    router.put('/article/:id', async (req, res) => {
        // const articleInfo = {
        //     ...req.body
        // }
        // console.log(articleInfo);

        const data = await Article.findOneAndUpdate({
            id: req.params.id
        },
            req.body, (err, doc) => {
                return doc;
            });
        res.send(requestResult('更新成功', 0, data));
        // res.send(req.body)
    });
    /** 
     * 删除文章
     */
    router.delete('/article/:id', async (req, res) => {
        // const data = await Article.findOneAndUpdate({
        //     id: req.params.id
        // }, {
        //     deleted: true
        // }, (err, doc) => {
        //     return doc;
        // });
        await Article.findOneAndRemove({
            id: req.params.id
        }, function (err, doc) {
            if (err) {
                return
            };
            res.send(requestResult('删除成功！', 0, doc));
        })

    });
    app.use('/admin/api', router);
}