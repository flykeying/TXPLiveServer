const { spawn } = require('child_process'),
      {getDirectoryName} = require("./hls/common"),
      fs = require('fs'),
      request = require('request')

function main(ctx, next) {
    const query = ctx.query

    let filesArr = getDirectoryName()
    //1 - 创建目录
    fs.mkdirSync(filesArr.file,{
        recursive: true
    })

    //ffmpeg -i http://localhost:8000/live/wos/index.m3u8 -c copy ./out.mp4

    //2 - 录制
    let diskuri = `${filesArr.file}${filesArr.fileName}.mp4` //硬盘地址
    let neturi = `${global.config.mediaServer.domain}${filesArr.rfile}${filesArr.fileName}.mp4` //网络地址

    let option = [
        '-i', query.m3u8,
        '-c', 'copy',
        diskuri
    ]
    const spawnObj = spawn(global.config.ffmpeg, option, {encoding: 'utf-8'})
    console.log(colors(['green'], '开始录制'), query.m3u8)
    global.log('录制文件', query.m3u8)

    spawnObj.on('exit', (code) => {
        console.log(colors(['green'], '[√]录制完成'), query.m3u8)
        global.log('录制完成', diskuri)
        request(query.callback + "&diskuri=" + diskuri + "&neturi=" + neturi + "&t=" + Date.parse(new Date()))
    })

    ctx.status = 200
    ctx.body = {
        "code": "200",
        "data": {
            result:true
        },
        "msg": '开始录制'
    }
}

module.exports = main
