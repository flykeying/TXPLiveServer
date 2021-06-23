const fetch = require("node-fetch"),
        fs = require("fs"),
        progressStream = require('progress-stream')
        colors = require('colors-console'),
        {gm3u8} = require("./common")
/**
 * 下载文件
 * @param fileURL 下载地址
 * @param fileSavePath 保存地址
 * @returns {Promise<true/false>}
 */
function download(fileURL, fileSavePath, query, filesArr, coverImage){
    let tmpFileSavePath = fileSavePath + ".tmp"
    return new Promise((resolve, reject) => {
        //创建写入流
        const fileStream = fs.createWriteStream(tmpFileSavePath).on('error', function (err) {
            reject(false)
        }).on('ready', function () {
            console.log("开始下载:", fileURL)
        }).on('finish', function () {
            //下载完成后重命名文件
            fs.renameSync(tmpFileSavePath, fileSavePath)
            global.log('Download',  fileSavePath)
            console.log(colors(['green'], '[√]下载完成'), fileSavePath)

            //3 - 异步生成
            //生成流畅hls
            gm3u8(
                global.config.mediaServer.liveAddress,
                fileSavePath,
                filesArr.file + filesArr.fileName + '0.m3u8',
                query.callback
            )
            //生成高清hls
            gm3u8(
                global.config.mediaServer.hdAddress,
                fileSavePath,
                filesArr.file + filesArr.fileName + '1.m3u8',
                query.callback,
                coverImage
            )
        })

        //请求文件
        fetch(fileURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/octet-stream' },
            // timeout: 100,
        }).then(res => {
            //创建进度
            let str = progressStream({
                length: res.headers.get("content-length"),
                time: 100 /* ms */
            })
            // 下载进度
            str.on('progress', function (progressData) {
                let percentage = Math.round(progressData.percentage)
                if (percentage>0){
                    resolve(true)
                }
                console.log(colors(['white','blue'], `[${percentage}%]`), fileURL)
            })
            res.body.pipe(str).pipe(fileStream)
        }).catch(e => {
            reject(false)
            console.log(colors(['red'], '[×]下载失败'), fileURL)
            global.log('Download ERROR', fileURL)
        });
    })
}


module.exports = download



