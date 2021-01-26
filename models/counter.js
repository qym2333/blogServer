/** 
 * 用于创建自增id
 */
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String, //表名
    sequence: Number //序列
});

module.exports = mongoose.model('tb_counter', schema);