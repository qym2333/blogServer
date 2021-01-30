module.exports = (app, plugin, model, config) => {
    const express = require('express');
    const router = express.Router();

    const {
        Info
    } = model

    const {
        requestResult
    } = plugin

    const fs = require('fs');
    const multer = require('multer');

    /**
     * 指定文件名和路径
     */
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const name = file.mimetype.includes('image') ? 'image' : 'music';
            cb(null, `./uploads/${name}`)
        },
        filename: (req, file, cb) => {
            const temp = file.originalname.split('.');
            const lastName = '.' + temp.pop();
            const fileName = Date.now() + lastName;
            cb(null, fileName)
        }
    })
    const upload = multer({
        storage
    })
    //上传文件
    router.post('/upload', upload.single('file'), async (req, res, next) => {
        if (!req.file) {
            return res.send(requestResult('文件不存在！'))
        }
        const filePath = (req.file.path).replace(/\\/g, '\/');
        const data = {
            url: `/${filePath}`,
            message: '上传成功'
        }
        res.send(requestResult('上传成功', 0, data))
    })
    //删除文件
    router.delete('/upload', async (req, res, next) => {
        const localFile = `./${req.body.url}`;
        fs.unlinkSync(localFile);
        res.json({
            status: 0,
            msg: '删除成功'
        })
    })
    app.use('/admin/api', router)
}