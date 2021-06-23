/**
 * 检测服务器环境
 */
const colors = require('colors-console'),
      config = require('./config'),
      fs = require("fs"),
      log = require('./modules/log/index')

function checkServerStatus(){
    //检测日志目录是否存在
    fs.exists(config.logDir, function(exists){
        if(!exists){ //目录不存在，创建
            console.log(colors(['red'], '[×]日志目录不存在'), config.logDir)
            fs.mkdirSync(config.logDir)
            console.log(colors(['green'], '[√]成功创建日志目录'), config.logDir)
            log('SYSTEM','成功创建日志目录：' + config.mediaDisk)
        } else {
            console.log(colors(['green'], '[√]日志目录已存在'), config.logDir)
        }
    })

    //检测流媒体目录是否存在
    fs.exists(config.mediaDisk, function(exists){
        if(!exists){//目录不存在，创建
            console.log(colors(['red'], '[×]流媒体资源目录不存在'), config.mediaDisk)
            fs.mkdirSync(config.mediaDisk)
            console.log(colors(['green'], '[√]成功创建流媒体资源目录'), config.mediaDisk)
            log('SYSTEM','成功创建目录：' + config.mediaDisk)
        } else {
            console.log(colors(['green'], '[√]流媒体资源目录已存在'), config.mediaDisk)
        }
    })
}


checkServerStatus()
