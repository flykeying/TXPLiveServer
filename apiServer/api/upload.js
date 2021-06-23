const fs = require('fs'),
      {getDirectoryName,gm3u8} = require("./hls/common")

// 上传单个文件转M3U8
async function main(ctx, next) {

    const file = ctx.request.files.file; // 获取上传文件
    const query = ctx.request.body

    //判断文件是否为MP4
    let tmp = file.name.split('.')
    let suffix = tmp[tmp.length-1]
    if(suffix !== 'mp4'){
        returnErr(ctx, '系统仅支持MP4格式',40501)
        return false
    }

    let filesArr = getDirectoryName()
    //1 - 创建目录
    fs.mkdirSync(filesArr.file,{
        recursive: true
    })

    //2 - 上传
    const reader = fs.createReadStream(file.path)
    let filePath = `${filesArr.file}/${filesArr.fileName}.mp4`
    const upStream = fs.createWriteStream(filePath)
    reader.pipe(upStream)

    //上传错误
    reader.on('error', async (err) => {
        returnErr(ctx, '系统仅支持MP4格式',40504)
        return false
    })

    //3- 判断是否生成封面文件

    let cover = []
    let coverImage = []
    if (query.cover !== ''){
        let coverArray = query.cover.split(',')
        for (let i in coverArray){
            let filename = parseInt(Math.random()*(999999999+100000000),10) + '.jpg'
            let coverFileName = global.config.mediaServer.domain + filesArr.rfile + filename
            cover.push(coverFileName)
            let localName = filesArr.file + filename
            coverImage.push({
                filePath:filesArr.file + filesArr.fileName + '.mp4',
                savePath:localName,
                second:coverArray[i]
            })
        }
    }

    //4 - 异步生成

    reader.on('close', async (err) => {
        //生成流畅hls
        gm3u8(
            global.config.mediaServer.liveAddress,
            filesArr.file + filesArr.fileName + '.mp4',
            filesArr.file + filesArr.fileName + '0.m3u8',
            query.callback
        )

        //生成高清hls
        gm3u8(
            global.config.mediaServer.hdAddress,
            filesArr.file + filesArr.fileName + '.mp4',
            filesArr.file + filesArr.fileName + '1.m3u8',
            query.callback,
            coverImage
        )
    })


    ctx.status = 200
    ctx.body = {
        "code": "200",
        "data": {
            liveAddress:global.config.mediaServer.domain + filesArr.rfile + filesArr.fileName + '0.m3u8',
            hdAddress:global.config.mediaServer.domain + filesArr.rfile + filesArr.fileName + '1.m3u8',
            cover:cover
        },
        "msg": '上传成功'
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
