const fs = require('fs')
const { exec } = require('child_process')
const moment = require('moment')
const { promiseify } = require('./utils')

/**
 * 向日志文件添加一条记录
 * Append a record to log file
 * @param {string} logStr 
 */
const appendLog = async logStr => promiseify(fs.appendFile)('commit.log', logStr, {encoding: 'utf8'})

/**
 * 提交一次 commit
 * Commit a record
 * @param {number} timestamps 
 */
module.exports.commitOnce = async (timestamps) => {
    const dateString = moment(timestamps).format('YYYY-MM-DD HH:mm:ss')

    await appendLog(dateString + '\n')
    await promiseify(exec)('git add .')
    await promiseify(exec)(`git commit -a -m "${dateString}" --date="${dateString}"`)
    console.log(`commited by ${dateString}.`)
}