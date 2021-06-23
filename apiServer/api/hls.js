const diskToHLS = require('./hls/diskToHLS'),
      urlToHLS = require('./hls/urlToHLS'),
      {isUrl} = require("./hls/common")


async function main(ctx, next) {
    const query = ctx.query

    //检测URI资源
    if (query.uri === undefined) {
        returnErr(ctx)
        return false
    }

    //判断文件是否为MP4
    let tmp = query.uri.split('.')
    let suffix = tmp[tmp.length-1]
    if(suffix !== 'mp4'){
        returnErr(ctx, '系统仅支持MP4格式',40501)
        return false
    }

    //检测回调地址
    if (query.callback !== ''){
        if(!isUrl(query.callback)){
            returnErr(ctx, '回调地址必须为URL',40502)
            return false
        }
    }
    if (query.way === 'disk') { //入参是硬盘地址
        console.log("disk")
       await diskToHLS(ctx)
                .then( res => {
                    returnRight(ctx, res)
                })
                .catch( err =>{
                    returnErr(ctx, err.msg, err.code)
                })
        return false
    } else
    if (query.way === 'url') { //入参是网络地址
        await urlToHLS(ctx)
                .then( res => {
                    returnRight(ctx, res)
                })
                .catch( err =>{
                    returnErr(ctx, err.msg, err.code)
                })
        return false
    } else {
        returnErr(ctx)
        return false
    }
}



//正常返回
function returnRight(ctx, result){
    ctx.status = 200
    ctx.body = {
        "code": "200",
        "data": result,
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
