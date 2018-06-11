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

脚本仅用来 commit, git 仓库需要自行配置。

1. `cd <you project directory>`
1. `npm install git-committer -g`
3. `git-committer <startDate> <[endDate] [total]> <randomRange> [options]`

# Examples
- Use end date
    - `git-committer 2017-01-01 2017-12-31 1-3`
- Use total days
    - `git-committer 2017-01-01 365 1-3`
- Ignore weekend days.
    - `git-committer 2017-01-01 365 1-3 -W`
- Ignore the holidays.
    - `git-committer 2017-01-01 365 1-3 -H -c CN`

# Options
- `-W  --weekend 跳过周末. Ignore weekend days.`
- `-H  --holiday 跳过节假日. Ignore the holidays.`
- `-c  --country <country> 国家用来判断节日. Country used to judge whether it is a holiday.`

`-H` 需要 `-c <country>` 判断是否为节日，[支持的国家](https://www.npmjs.com/package/date-holidays#supported-countries-states-regions)。

# License
MIT