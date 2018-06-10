

/**
 * 生成指定范围内的随机整数
 * @param {array} range
 * @example range [1, 10]
 */
module.exports.randomInteger = range => {
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
module.exports.initializeArrayWithStep = (len, start = 0, step = 1) => Array.from({ length: len }).map((v, i) => i * step + start)



/**
 * node 风格回调形式的异步函数转 promise
 * node style callback async function to promise
 * @param {function} fn 
 */
module.exports.promiseify = fn => (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, ...res) => {
        if (err) {
            console.error(res[0])
            reject(err)
        }
        else resolve(...res)
    })
})