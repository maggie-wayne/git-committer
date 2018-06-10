:slot_machine: git-committer
====  

A node.js script to generate a git commit commit record.

一个用来生成 git commit 提交记录的 node.js 脚本

用来填满 github 绿色小方块(或者其他用途).

Before
![before](./imgs/before.png)

After :sparkles: :sparkles: :sparkles:
![after](./imgs/after.png)

![smaile](./imgs/smile.gif)

# Usage

脚本仅用来提交 commit, 需要自行初始化 git 仓库并配置。

1. `cd <you project directory>`
1. `npm install git-committer -g`
3. `git-committer <option>`

# Option
- `-h  --help                   查看帮助信息. output usage information`
- `-V, --version                查看版本. output the version number`

- `-s  --start      <date>      git commit 的开始日期.  The commits start date.`
- `-e  --end        [date]      git commit 的结束日期.  The commits end date`
- `-t  --days       [days]      从开始日期到结束日期的总天数.  The total number of days from the start date to the end date.`
- `-r  --random     <range>    每天提交次数的随机范围.  A random range of daily commit.`
- `-W  --weekend                跳过周末.   Skip the weekend.`
- `-H  --holiday                跳过节假日.  Skip the holiday.`
- `-c  --country    [country]    国家用来判断节日.  Country used to judge whether it is a holiday.`

`-s <date>` 与 `-e <date>` 或 `-t <days>` 计算 commit 日期， `-s` 与 `-t` 参数选填其一。

`-W -H` 对范围内的日期进行筛选，  `-H` 需要 `-c <country>` 用来判断是否为节日， [支持的国家](https://www.npmjs.com/package/date-holidays#supported-countries-states-regions)。

`-r` 每天提交次数的随机范围， 例如： `1-3`、`2-5`。

# License
MIT