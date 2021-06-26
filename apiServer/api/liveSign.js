const md5 = require('md5')
function main(ctx, next) {
    const query = ctx.query
    if (query.roomName === ''){
        returnErr(ctx, '房间名称必须存在', 40506)
        return false
    }
    if (query.endTimestamp === ''){
        returnErr(ctx, '必须规定直播结束时间', 40507)
        return false
    }
    let sign = md5(`${query.roomName}-${query.endTimestamp}-${global.config.live.privateKey}`)
    ctx.status = 200
    ctx.body = {
        "code": "200",
        "data": {
            "sign":`${query.endTimestamp}-${sign}`
        },
        "msg": null
    }
}

//参数错误
function returnErr(ctx, msg = '参数错误',code = 40500){
    ctx.status = 500
    ctx.body = {
        "code": code,
        "data": {},
        "msg": msg
    }
}

module.exports = main
