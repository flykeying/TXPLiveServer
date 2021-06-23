# 流媒体拉流服务器(NODE版)

流媒体拉流服务器，支持媒体格式化.用于上传MP4视频后，转码成m3u8（高清或标清），返回拉流地址，可以通过拉流播放

三种生成方式
- 服务器本地路径转码
- URL下载转码
- multipart/form-data方式上传转码

> 系统只支持转成m3u8格式，m3u8格式适合android和ios播放，rmtp只能在android播放

## 系统依赖
- [ffmpeg](https://github.com/FFmpeg/FFmpeg)

## 安装
> npm install

## 启动
> npm start

## 测试
> npm run test

## 设置

- ./config.js 全局配置
- ./apiServer/fillterRouter 配置不需要token验证的过滤路由地址

## API列表

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
