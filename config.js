const path = require('path')

function main(){
    const result = {
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
            domain : 'http://127.0.0.1:8080',
            // domain:`http://${this}:${this}`,
            //四种画面品质，系统选择 baseline | extended | main | high
            liveAddress:"baseline", //流畅选择
            hdAddress:"main" //高清选择
        },
        //推流服务器相关配置
        live:{
            //拉流服务端口地址 推流上来后，通过这个接口拉流 例如 http://192.168.1.179:8000/live/自己定义的密钥 可获取到直播流 m3u8地址
            port:8000,
            //是否开启加密推流
            secret:false,
            privateKey:"EKSXVqWOvMQ3C3T1",
            //直播缓存地址
            mediaroot:path.resolve(__dirname,'./live/media/'),
            //推流服务器配置
            rtmp:{
                port: 1935, //推流推这个端口！！ rtmp://192.168.1.179:1935/live/自己定义的密钥
                chunk_size: 60000,
                gop_cache: true,
                ping: 60,
                ping_timeout: 30
            }
        },

        //日志存储位置
        logDir: path.resolve(__dirname,'./logs'),
    }
    return result
}

module.exports = main()
