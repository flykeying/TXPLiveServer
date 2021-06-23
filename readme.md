# 流媒体拉流服务器(NODE版)

流媒体拉流服务器，支持媒体格式化.用于上传MP4视频后，转码成m3u8（高清或标清），返回拉流地址，可以通过拉流播放

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
    + @callback 格式化m3u8任务完成后，回调地址，例如：http://localhost/version?id=12


### 授权

商业授权，请联系作者 flykeying@126.com
