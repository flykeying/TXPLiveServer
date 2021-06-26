# TXPPullServer 流媒体服务器

> 原名：流媒体拉流服务器，随着各位支持的深入，增加了很多功能。现在已经不单单是推流服务器了，同时兼备了推拉流的业务

主要功能

 - 直播推拉流
    + 推拉流服务
    + 加密推流
    + 视频录制功能
 - 为媒体文件转码成M3U8格式文件实现拉流服务，通过以下三种生成方式生成M3U8文件：
    + 服务器本地路径转码
    + URL下载转码
    + multipart/form-data方式上传转码


> 系统只支持转成m3u8格式，m3u8格式适合android和ios播放，rmtp部分手机机型播放有限制



## 系统服务依赖
- [ffmpeg](https://github.com/FFmpeg/FFmpeg)

## 安装

```shell
npm install
//配置 config.js
node test.js //检查配置
```

## 测试
> npm run test


## 启动
> npm start //运行api服务
> npm run live  //运行推拉流服务器，如不需要推拉流服务可不运行


## 设置

- ./config.js 全局配置
- ./apiServer/fillterRouter 配置不需要token验证的过滤路由地址（如不修改接口无需改变）

## API列表

> ./流媒体拉流服务器POSTMAN测试（可导入）是一个postman文件，可导入，内部有所有接口测试数据

### 请求

POST请求，为JSON体

### 返回
```json
{
    "code": "200",
    "data": {}, //返回值
    "msg": "code == 200 ? null : 错误提示"
}
```

### 错误code码
错误码 | 意义
---|---
200 | 正确
444 | 密钥错误，配置 ./config apiServer.publicKey 注意！！ 是数组
500 | 程序错误
40500 | 程序错误
40501 | 系统仅支持MP4格式
40502 | 回调地址必须为URL
40503 | 硬盘文件不存在
40504 | 下载错误或文件不存在，无法创建任务
40505 | 系统仅支持m3u8格式
40506 | 房间名称必须存在
40507 | 必须规定直播结束时间

- GET /version 获取服务器版本号
- GET /hls
    + @way disk=硬盘转存 | url 网络地址转存
    + @uri 资源位置，对应@way的方式
    + @cover 数组，截取封面
    + @callback 格式化m3u8任务完成后，回调地址，例如：http://localhost/version?id=12

- POST /update multipart/form-data方式上传
    + @file 资源位置
    + @cover 数组，截取封面
    + @callback 格式化m3u8任务完成后，回调地址，例如：http://localhost/version?id=12


```json
{
    "code": "200",
    "data": {
        "liveAddress": "http://127.0.0.1:8080/2021/06/23/16244291330001079509548/162442913300010795095480.m3u8",
        "hdAddress": "http://127.0.0.1:8080/2021/06/23/16244291330001079509548/162442913300010795095481.m3u8",
        "cover": [
            "http://127.0.0.1:8080/2021/06/23/16244291330001079509548/881045828.jpg",
            "http://127.0.0.1:8080/2021/06/23/16244291330001079509548/262820368.jpg"
        ]
    },
    "msg": null
}
```


## 2.0版本集成了推拉流服务器

启动方式：
```shell
npm run live
```

相关配置
```json
//推流服务器相关配置
    live:{
        //拉流服务端口地址 推流上来后，通过这个接口拉流 例如 http://192.168.1.179:8000/live/自己定义的密钥 可获取到直播流 m3u8地址
        port:8000,
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
    }
```

通过API进行推流录制
- GET /recording 
    + @m3u8 录制的地址
    + @callback 录制完成后的回调地址

录制完成后，会像回调地址GET发送相关录制的文件URI位置

```JSON
 {
  //回调中你自定义的所有数据
  id: '1', 
  //服务器硬盘地址
  diskuri: '/Users/wos/Desktop/live-server/mediaDisk/2021/06/26/162467712400085134759/162467712400085134759.mp4',
  //网络MP4地址
  neturi: 'http://127.0.0.1:8080/2021/06/26/162467712400085134759/162467712400085134759.mp4',
  //时间戳
  t: '1624677138000'
}
```

> 录制并不生成M3U8文件，用户可根据回调自行判断是否生成m3u8文件或封面

## 推流加密
> 2.0版本推拉流地址是公开的，其他用户可以通过拉流地址计算推流地址，在2.1版本中加入推拉流鉴权的功能

如需开启推流加密，配置config.js中 live.secret = true
- GET /liveSign
    + @endTimestamp 结束直播的时间戳，注意不是毫秒级时间戳！！！
    + @roomName 房间名称

入参：
```url
http://localhost:8080/liveSign?endTimestamp=1624701820&roomName=wos
```
出参
```json
{
    "code": "200",
    "data": {
        "sign": "1624701820-81be5df8e39a40a0602490e74cb3d517"
    },
    "msg": null
}
```
推流地址就是
```json
rtmp://ip:1935/live/wos?sign=1624701820-81be5df8e39a40a0602490e74cb3d517
```



## 推拉流服务器相关的API

- 获取服务器资源 http://localhost:8000/api/server
- 推流状况 http://localhost:8000/api/streams
- 大屏数据展示 http://localhost:8000/admin/

如需关闭大屏数据展示接口，请使用nginx反向代理8000后，自定义过滤
```nginx
location ~ / {
    if ( $query_string ~* ^(.*)?s=/admin ){
        return 555;
    }
}
...
```
