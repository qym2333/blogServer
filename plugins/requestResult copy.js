/**
 * 请求结果
 * @param {All} data 数据/信息
 * @param {Number} status 状态码 0:成功/1:失败
 */
function requestResult(message, status = 1, data = '') {
    if (status == 0) {
        // 成功
        return {
            status,
            message,
            data
        }
    } else {
        // 失败
        return {
            status,
            message: message,
        }
    }
}

module.exports = requestResult;