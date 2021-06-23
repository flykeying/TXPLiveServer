const fs = require("fs"),
	  path = require('path'),
	  config = require('../../config')

module.exports = (logtype, content) => {
	let date = new Date()
	let month = date.getMonth()+1
	if (month<9) {month = '0' + month}
	let day = date.getDate()
	if (day<9) {day = '0' + day}

	let fileName = `${date.getFullYear()}${month}${day}`
	let time = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
	let log = `[${logtype}] ${time} ${content} \n`

	fs.appendFile( config.logDir + `/${fileName}.log`, log, function(){});
}
