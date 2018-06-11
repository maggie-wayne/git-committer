const program = require('commander')
const chalk = require('chalk')
const { isDateStr } = require('./utils')

module.exports = () => {
    program
        .version(require('../package').version)
        .usage('<startDate> <[endDate] [total]> <randomRange> [options]')
        .description('一个用来生成 git commit 的 node.js 脚本. \n  A node.js script to generate git commit.')
        .option('-c, --country <country>', '国家用来判断节日.  Country used to judge whether it is a holiday.')
        .option('-W, --weekend', '跳过周末.  Ignore weekend days.')
        .option('-H, --holiday', '跳过节日.  Ignore the holidays.')
    
    program.on('--help', () => {
        console.log()
        console.log('  Examples:')
        console.log('  ')
        console.log(chalk.gray('  Use end date'))
        console.log('  git-committer 2017-01-01 2017-12-31 1-3')
        console.log(chalk.gray('  Use total days'))
        console.log('  git-committer 2017-01-01 365 1-3')
        console.log(chalk.gray('  Ignore weekend days.'))
        console.log('  git-committer 2017-01-01 365 1-3 -W')
        console.log(chalk.gray('  Ignore the holidays.'))
        console.log('  git-committer 2017-01-01 365 1-3 -H -c CN')
    })
    
    /**
     * Help.
     */
    function help () {
        program.parse(process.argv)
        if (program.args.length < 3) return program.help()
    }
    help()

    // format
    let [start, end, random] = program.args
    let { weekend, holiday, country } = program
    let total = !isDateStr(end) && end

    end = isDateStr(end) && new Date(end)
    start = start && new Date(start)
    random = random && random.split('-').map(x => +x)

    if (!start) {
        throw new Error('Start date is a must.')
    }
    if (!end && !total) {
        throw new Error('End date or total must have one.')
    }
    if (end && total) {
        throw new Error('End date and total can only have one.')
    }
    if (holiday && !country) {
        throw new Error('Country mush have.')
    }
    if (
        !Array.isArray(random) || 
        (Array.isArray(random) && random.length !== 2)
    ) {
        throw new Error('Wrong commit random range.')
    } 

    return {
        start,
        end,
        total,
        random,
        country,
        skipWeekend: weekend,
        skipHoliday: holiday
    }
}