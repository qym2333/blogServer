/**
 * 分页
 * @param {*} db 
 * @param {Number} page 
 * @param {Number} size  
 */

const dateFormat = require('./dateFormat');

async function getPage(db, page, size) {
    const result = await Promise.all([
        db.countDocuments(),
        db.find({
            deleted: false
        }).sort({
            createTime: -1
        }).limit(Number(size)).skip(Number(size) * (page - 1))
    ]);

    result[1].forEach(item => item._doc['time'] = dateFormat(item.time))
    console.log(result);
    return {
        total: result[1].length,
        data: result[1],
        page: Number(page)
    };
}

module.exports = getPage;