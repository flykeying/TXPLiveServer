/***
 * 延时函数
 * @param time 毫秒
 * @returns {Promise<unknown>}
 * 用法介绍
    router.get('/api/version', async function (ctx, next) {
        await modules.delay(5000)
    ctx.body = require('./api/version/')
    })
 */
function delay(time) {
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
            resolve()
        }, time)
    })
}
module.exports = delay