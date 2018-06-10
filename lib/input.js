var program = require('commander');

module.exports = () => {
    program
    .version('0.0.1')
    .description('一个用来生成 git commit 的 node.js 脚本. \n A node.js script to generate git commit.')
    .option('-s, --start <date>', 'git commit 的开始日期.  The commits start date.')
    .option('-e, --end <date>', 'git commit 的结束日期.  The commits end date')
    .option('-t --total <number>', '从开始日期到结束日期的总天数.  The total number of days from the start date to the end date.')
    .option('-r, --random <string>', '每天提交次数的随机范围.  A random range of daily commit.')
    .option('-c, --country <string>', '国家用来判断节日.  Country used to judge whether it is a holiday.')
    .option('-W --weekend', '跳过.  Skip the weekend.')
    .option('-H --holiday', '每天提交次数的随机范围.  Skip the holiday.')
    .parse(process.argv);

  let { start, end, total, random, weekend, holiday, country } = program

  start = start && new Date(start)
  end = end && new Date(end)
  total = total && +total
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
  if (
    Object.prototype.toString.call(start) === '[object Date]' &&
    (end && Object.prototype.toString.call(end) === '[object Date]') &&
    Object.prototype.toString.call(total) === '[object Number]' &&
    Object.prototype.toString.call(isWeekend) === '[object Boolean]' &&
    Object.prototype.toString.call(isHoliday) === '[object Boolean]'
  ) {
    throw new Error('Type error')
  }

  return {
    start,
    end,
    total,
    random,
    country,
    isWeekend: weekend,
    isHoliday: holiday
  }
}