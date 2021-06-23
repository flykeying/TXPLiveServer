const path = require('path')

function main(){
    const dev = {
        //指明FFmpeg位置
        ffmpeg : '/usr/local/bin/ffmpeg',

        //流媒体存储的位置
        mediaDisk : path.resolve(__dirname,'./mediaDisk'),

        //视频转码最大任务数，建议真实服务器上用top测试
        taskCount:5,

        //api服务器地址
        apiServer: {
            ip: '127.0.0.1',
            port : '8080',
            publicKey:["EKSXVqWOvMQ3C3T1"] //用于鉴权,支持多用户使用
        },
        //流媒体服务器地址，仅支持m3u8
        mediaServer:{
            //使用正式的域名，如果用域名访问请指向 dev.mediaDisk 根目录
            // domain : 'http://127.0.0.1:8080',
            domain:`http://${dev.apiServer.ip}:${dev.apiServer.port}`,

            //四种画面品质，系统选择 baseline | extended | main | high
            liveAddress:"baseline", //流畅选择
            hdAddress:"main" //高清选择
        },

        //日志存储位置
        logDir: path.resolve(__dirname,'./logs'),
    }
    return dev
}

module.exports = main
