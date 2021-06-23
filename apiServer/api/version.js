async function main(ctx, next) {
    const query = ctx.query
    console.log(query)

    ctx.status = 200
    ctx.body = {
        "code": "200",
        "data": {
            "version":"1.0.0",
            "versionCode":10000
        },
        "msg": null
    }
}

module.exports = main
