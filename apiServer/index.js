global.config = require('../config')
global.log = require('../modules/log')
global.mq = 0
const Koa = require('koa'),
    app = new Koa(),
    router = require('koa-router')(),
    cors = require('koa2-cors'),
    serve = require('koa-static'),
    bodyParser = require('koa-bodyparser-base'),
    colors = require('colors-console'),
    check = require('./common/check'),
    koaBody = require('koa-body')

//版本查询
router.get('/version',  require('./api/version'))
router.get('/hls',  require('./api/hls'))
router.post('/upload',  require('./api/upload'))
router.get('/recording',  require('./api/recording'))

app.use(cors())
app.use(bodyParser())
app.use(serve(global.config.mediaDisk))
app.use(check)
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200000*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(global.config.apiServer.port, () => {
    let content = "API服务已启动,端口是:" + global.config.apiServer.port
    global.log('SYSTEM', content)
    console.log(colors(['green'],'[√]' + content))
})
