const package = require('../../package')
function main(ctx, next) {
    const query = ctx.query
    console.log(query)

    ctx.status = 200
    ctx.body = {
        "code": "200",
        "data": {
            "version":package.version
        },
        "msg": null
    }
}

module.exports = main
