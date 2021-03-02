const { CODE_SUCCESS, CODE_ERROR } = require('../utils/constant');

class Result {
  constructor(data, msg = '操作成功', options) {
    this.data = null
    if (arguments.length === 0) {
      this.msg = '操作成功'
    } else if (arguments.length === 1) {
      this.msg = data
    } else {
      this.data = data
      this.msg = msg
      if (options) {
        this.options = options
      }
    }
  }

  //生成返回给前端的完整数据，包括对象
  createResult () {
    if (!this.code) {
      this.code = CODE_SUCCESS
    }
    //base是一个返回给前端的一个对象，
    //base中有code、msg
    let base = {
      code: this.code,
      msg: this.msg
    }

    //如果调用Result传过来data，那么就给base添加data属性
    if (this.data) {
      base.data = this.data
    }

    //如果有options对象，那么就利用扩展运算符，将options对象中的属性添加给base
    if (this.options) {
      base = { ...base, ...this.options }
    }
    return base
  }

  json (res) {
    res.json(this.createResult())
  }

  success (res) {
    this.code = CODE_SUCCESS
    this.json(res)
  }

  fail (res) {
    this.code = CODE_ERROR
    this.json(res)
  }
}

module.exports = Result;
