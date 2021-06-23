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


        //2- 判断是否生成封面文件
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

        //3 - 下载文件
        let result = await download(query.uri, filesArr.file + filesArr.fileName + '.mp4', query, filesArr, coverImage)

        if (result){
            resolve({
                liveAddress:global.config.mediaServer.domain + filesArr.rfile + filesArr.fileName + '0.m3u8',
                hdAddress:global.config.mediaServer.domain + filesArr.rfile + filesArr.fileName + '1.m3u8',
                cover:cover
            })
        }else{
            reject('下载错误或文件不存在，无法创建任务', 40504)
        }

    })
}

module.exports = urlToHLS
