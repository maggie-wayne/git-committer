:slot_machine: node-committer
====  

A node.js script to green all github activity blocks.

一个用来生成 git commit 提交记录的 node.js 脚本，用来填满 github 绿色小方块。

Before
![before](./imgs/before.png)

After :sparkles: :sparkles: :sparkles:
![after](./imgs/after.png)

![smaile](./imgs/smile.gif)

# Usage

You need to delete the `.git` directory before generating the commit.

在生成 commit 之前需要删除 `.git` 目录。

1. `git clone https://github.com/zowiegong/node-committer.git`
2. `rm -fr .git`
3. `git init && git add . && git commit -m 'init'`
4. `npm install && node main.js`
