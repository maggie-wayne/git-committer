const fs = require('fs')
const { exec } = require('child_process')

const Holidays  = require('date-holidays')
const inquirer = require('inquirer')
const moment = require('moment')

const hd = new Holidays()

/**
 * 生成指定范围内的随机整数
 * @param {array} range
 * @example range [1, 10]
 */
const randomInteger = range => {
    if (
        !Array.isArray(range) || 
        (Array.isArray(range) && range.length !== 2)
    ) {
        throw new Error('Wrong commit range.')
    }  

    const [min, max] = range
    return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 初始化一个指定长度指定间隔的数组
 * Initialize array with step
 * @param {number} len 
 * @param {number} start 
 * @param {number} step 
 */
const initializeArrayWithStep = (len, start = 0, step = 1) => Array.from({ length: len }).map((v, i) => i * step + start)

/**
 * 生成提交日期
 * Generate commit date
 * @param {object} options 
 */
const generateDateRange = options => {
    let { start, end, count, country, isWeekend, isHoliday, commitCountRange } = options

    if (!start) {
        throw new Error('Start date is a must.')
    }
    if (!end && !count) {
        throw new Error('End date or count must have one.')
    }
    if (end && count) {
        throw new Error('End date and count can only have one.')
    }  
    if (
        Object.prototype.toString.call(start) === '[object Date]' &&
        (end && Object.prototype.toString.call(end) === '[object Date]') &&
        Object.prototype.toString.call(count) === '[object Number]' &&
        Object.prototype.toString.call(isWeekend) === '[object Boolean]' &&
        Object.prototype.toString.call(isHoliday) === '[object Boolean]'
    ) {
        throw new Error('Type error')
    }

    const oneDayTimestamps = 24 * 60 * 60 * 1000

    // Calculate the number of days
    if (end) {
        count = (end.getTime() - start.getTime()) / oneDayTimestamps
    }

    // inital holiday
    if (isHoliday && country) {
        hd.init(country)
    }

    // Total days generated
    const dateList = initializeArrayWithStep(
        count,
        start.getTime(),
        oneDayTimestamps
    )
    
    // filter valid date
    .filter(date => {
        date = new Date(date)

        // check weekend
        if (isWeekend) {
            const day = date.getDay()
            if (day === 0 || day === 6) {
                return false
            }
        }

        // check holiday
        if (isHoliday && country) {
            if (hd.isHoliday(date)) {
                return false
            }
        }
        return true
    })
    
    // generae finally commit date list by commitCountRange
    .map(timeStamps => {
        let periodList = []
        const commitCount = randomInteger(commitCountRange)
        const maxTimeStamps = moment(timeStamps).hours(23).minutes(59).seconds(59).valueOf()

        for (let i = 0; i < commitCount; i++) {
            periodList.push(
                randomInteger([timeStamps, maxTimeStamps])
            )
        }
        return periodList.sort()
    })

    // unfold 2D array
    return [].concat(...dateList)
}

/**
 * node 风格回调形式的异步函数转 promise
 * node style callback async function to promise
 * @param {function} fn 
 */
const promiseify = fn => (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, ...res) => {
        if (err) {
            console.error(res[0])
            reject(err)
        }
        else resolve(...res)
    })
})

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

/**
 * options question
 */
const questions = [
    {
        type: 'input',
        name: 'start',
        message: "Enter the commits start date. e.g: 1970-01-01\n",
        default: '1970-01-01'
    },
    {
        type: 'confirm',
        name: 'useEndDate',
        message: "Use end date ?\n",
        default: false
    },
    {
        type: 'input',
        name: 'end',
        message: "Enter the commits end date. e.g: 2012-12-21\n",
        when: answers => answers.useEndDate,
        default: '2012-12-21'
    },
    {
      type: 'input',
      name: 'count',
      message: 'Enter the commit days.\n',
      filter: Number,
      when: answers => !answers.useEndDate,
      default: 365
    },
    {
      type: 'input',
      name: 'commitCountRange',
      message: 'Enter the daily commit count range. e.g: 1-3\n',
      default: '1-3'
    },
    {
        type: 'confirm',
        name: 'isWeekend',
        message: "Rest on weekends ?\n",
        default: true
    },
    {
        type: 'confirm',
        name: 'isHoliday',
        message: "Rest on holiday ?\n",
        default: true
    }
]

const ask = async () => {
    const options = await inquirer.prompt(questions)
    const { commitCountRange, start, end, useEndDate } = options

    // formate options
    options.step = 1
    options.commitCountRange = commitCountRange.split('-').map(x => +x)
    options.start = new Date(start)
    useEndDate && (options.end = new Date(end))
    delete options.useEndDate

    return options
}

/**
 * main
 */  
const run = async () => {
    if (!await repoValidator()) return

    const options = await ask()
    const dateList = generateDateRange(options)
    const len = dateList.length

    for (let i = 0; i < len; i++) {
        const date = dateList[i]
        await commitOnce(date)
    }
}

run()