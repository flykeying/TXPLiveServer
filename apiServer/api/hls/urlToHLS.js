const fs = require("fs"),
    {getDirectoryName} = require("./common"),
    download = require('./download')


function urlToHLS (ctx){
    return new Promise(async (resolve, reject) => {
        const query = ctx.query
        let filesArr = getDirectoryName()

        //1 - 创建目录
        fs.mkdirSync(filesArr.file,{
            recursive: true
        })
        //2 - 下载文件
        let result = await download(query.uri, filesArr.file + filesArr.fileName + '.mp4', query, filesArr)
        if (result){
            resolve({
                liveAddress:global.config.mediaServer.domain + filesArr.rfile + filesArr.fileName + '0.m3u8',
                hdAddress:global.config.mediaServer.domain + filesArr.rfile + filesArr.fileName + '1.m3u8',
            })
        }else{
            reject('下载错误或文件不存在，无法创建任务', 40504)
        }

    })
}

module.exports = urlToHLS
