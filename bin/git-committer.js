#!/usr/bin/env node 
const input = require('../lib/input')
const { commitOnce, repoValidator } = require('../lib/committer')
const generateDateRange = require('../lib/generateDate')

/**
 * main
 */  
const run = async () => {
    // if (!await repoValidator()) return

    const options = input()
    console.log(options)
    const dateList = generateDateRange(options)
    const len = dateList.length

    for (let i = 0; i < len; i++) {
        const date = dateList[i]
        await commitOnce(date)
    }
}

run()