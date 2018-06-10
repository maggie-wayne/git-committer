const fs = require('fs')
const { exec } = require('child_process')
const moment = require('moment')
const { promiseify } = require('./utils')

/**
 * 验证命令输出中有无指定字符串
 * Verify the stdout string
 * @param {string} cmd 
 * @param {string} str 
 */
const validateStdoutHasStr = async (cmd, str) => (
    await promiseify(exec)(cmd)
        .then(
            stdout => stdout.indexOf(str) !== -1
        )
)

/**
 * 验证当前仓库状态
 * Verify the repository status
 */
const repoValidator = async () => {
    let result = true
    const step = [
        {
            cmd: 'git status',
            str: 'Not a git repository',
            msg: 'Current directory not found git repository.'
        },
        {
            cmd: 'git status',
            str: 'git add',
            msg: 'There are uncommitted changes.'
        },
        {
            cmd: 'git status',
            str: 'git rm',
            msg: 'There are uncommitted changes.'
        }
    ]
    
    for (let i = 0; i < step.length; i++) {
        const temp = step[i]
        const tempResult = await validateStdoutHasStr(temp.cmd, temp.str)
        if (tempResult) {
            console.warn(temp.msg)
            return false
        }
    }

    return result
}


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
const commitOnce = async (timestamps) => {
    const dateString = moment(timestamps).format('YYYY-MM-DD HH:mm:ss')

    await appendLog(dateString + '\n')
    await promiseify(exec)('git add .')
    await promiseify(exec)(`git commit -a -m "${dateString}" --date="${dateString}"`)
    console.log(`commit ${dateString}`)
}

module.exports = {
    commitOnce,
    repoValidator
}