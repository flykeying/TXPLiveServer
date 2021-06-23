const fs = require("fs"),
    {getDirectoryName,gm3u8} = require("./common")
function diskToHLS (ctx){
    const query = ctx.query
    return new Promise((resolve, reject) => {
        fs.exists(query.uri, function(exists){
            if (!exists){ //文件不存在
                reject({
                    msg:"硬盘文件不存在",
                    code:"40503"
                })
            }else{
                let filesArr = getDirectoryName()
                //1 - 创建目录
                fs.mkdirSync(filesArr.file,{
                    recursive: true
                })

                //2 - 复制文件
                fs.copyFileSync(query.uri, filesArr.file + filesArr.fileName + '.mp4')

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


                resolve({
                    liveAddress:global.config.mediaServer.domain + filesArr.rfile + filesArr.fileName + '0.m3u8',
                    hdAddress:global.config.mediaServer.domain + filesArr.rfile + filesArr.fileName + '1.m3u8',
                    cover:cover
                })
            }
        })
    })
}


module.exports = diskToHLS
