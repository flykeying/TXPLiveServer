const ffmpeg = require('fluent-ffmpeg'),
    { spawn } = require('child_process'),
    request = require('request'),
    colors = require('colors-console')
/**
 * 生成m3u8文件
 * @quality 画质npm
 * @fileName MP4文件绝对地址
 * @m3u8FileName m3u8 存储的位置
 * @callback 回调地址
 */
function gm3u8(quality, fileName, m3u8FileName, callback){
    if (global.mq >= global.config.taskCount){ //查看任务进程
        setTimeout( ()=>{
            gm3u8(quality, fileName, m3u8FileName, callback)
            console.log(colors(['red'], '[×]M3U8转码进程队列已满，等待中...'))
        },10000)
        return false
    }else{
        global.mq++
        //ffmpeg -i *.mp4 -profile:v baseline -level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls *.m3u8
        let option = [
            '-i', fileName,
            '-profile:v', quality,
            '-level', '3.0',
            '-start_number', '0',
            '-hls_time', '10',
            '-hls_list_size', '0',
            '-f', 'hls', m3u8FileName
        ]
        const spawnObj = spawn(global.config.ffmpeg, option, {encoding: 'utf-8'});

        spawnObj.on('exit', (code) => {
            global.mq--
            global.log('[HLS-NEW]',m3u8FileName)
            console.log(colors(['green'], '[√]生成新的HLS'), global.mq + '/' + global.config.taskCount, m3u8FileName)
            request(callback + "&quality=" + quality + "&t=" + Date.parse(new Date()))
        })
    }
}

function getDirectoryName() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()+1
    if (month<9) {month = '0' + month}
    let day = date.getDate()
    if (day<9) {day = '0' + day}
    let timestamp = Date.parse(date)
    let num = parseInt(Math.random()*(999999999+100000000),10);
    let fileName = timestamp.toString() + num
    return {
        rfile:`/${year.toString()}/${month.toString()}/${day.toString()}/${fileName}/`, //相对地址,用于域名
        file:`${global.config.mediaDisk}/${year.toString()}/${month.toString()}/${day.toString()}/${fileName}/`, //绝对地址，用于命令行
        fileName:fileName //文件名 不包括后缀名
    }
}

//判断是否为URL
function isUrl(str) {
    let v = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
    return v.test(str);
}

module.exports = {
    gm3u8,
    getDirectoryName,
    isUrl
}
