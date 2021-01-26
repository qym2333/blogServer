/* 
 * 信封 时光机
 */
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    content: String,
    contentHtml: String,
    deleted: {
        type: Boolean,
        default: false
    },
    createTime: {
        type: Date,
        default: Date.now
    }, //创建时间
    updateTime: {
        type: Date,
        default: Date.now
    }, //更新时间
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})

module.exports = mongoose.model('tb_envelope', schema)