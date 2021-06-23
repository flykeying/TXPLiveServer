const config = require('../../config')
const filter = require('../fillterRuoter')
async function check(ctx, next) {
    let urlTmp = ctx.request.url
    let urlArr = urlTmp.split("?")
    let url = urlArr[0]
    let token = ctx.request.headers["token"]

    if (filter.indexOf(url) > -1){
        global.log("[API]",`[√]${getUserIp(ctx.req)} ::> ${url}`)
        await next()
    }else{
        if(config.apiServer.publicKey.indexOf(token) === -1){
            global.log("[API]",`[×]密钥访问错误，${getUserIp(ctx.req)} ::> ${url}`)
            //未开发 如果访问超过10次，屏蔽IP
            ctx.status = 200
            ctx.body = {
                "code": 444,
                "data": {},
                "msg":"密钥错误"
            }
        }else{
            global.log("[API]",`[√]，${getUserIp(ctx.req)} ::> ${url}`)
            await next()
        }


    }
}

//获取访问用户的IP
const getUserIp = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}
module.exports = check

