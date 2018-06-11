const moment = require('moment')
const Holidays  = require('date-holidays')
const { initializeArrayWithStep, randomInteger } = require('./utils')

const hd = new Holidays()

/**
 * 生成提交日期
 * Generate commit date
 * @param {object} options 
 */
module.exports = options => {
    let { start, end, total, country, skipWeekend, skipHoliday, random } = options

    const oneDayTimestamps = 24 * 60 * 60 * 1000

    // Calculate the number of days
    if (end) {
        total = (end.getTime() - start.getTime()) / oneDayTimestamps + 1
    }

    // inital holiday
    if (skipHoliday && country) {
        hd.init(country)
    }

    // Total days generated
    const dateList = initializeArrayWithStep(
        total,
        start.getTime(),
        oneDayTimestamps
    )
    
    // filter valid date
    .filter(date => {
        date = new Date(date)

        // check weekend
        if (skipWeekend) {
            const day = date.getDay()
            if (day === 0 || day === 6) {
                return false
            }
        }

        // check holiday
        if (skipHoliday && country) {
            if (hd.isHoliday(date)) {
                return false
            }
        }
        return true
    })
    
    // generae finally commit date list by random
    .map(timeStamps => {
        let periodList = []
        const commitCount = randomInteger(random)
        const maxTimeStamps = timeStamps + oneDayTimestamps - 1
        
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