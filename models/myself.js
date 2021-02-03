const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  content: String,
  contentHtml: String
})

module.exports = mongoose.model('tb_myself', schema)