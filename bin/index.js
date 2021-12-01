#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const semver = require('semver');
const requiredNodeVersion = require('../package.json').engines.node;
const packageVersion = require('../package.json').version;


//检查node版本
function checkNodeVersion(wanted, cliName) {
    if (!semver.satisfies(process.versions.node, wanted)) {
        console.log(chalk.red(`
            You are using Node@${ process.version },
            but this version of ${ cliName } require Node@${ wanted },
            Please upgrade your Node version;
        `))
        process.exit(0);
    }
}

checkNodeVersion(requiredNodeVersion, 'vue-easy-cli');

//定义指令

//查看版本
program
    .version(packageVersion, '-v,--version')
    .usage('<command> [options]');

//查看所有模板
program
    .command('list')
    .description('list all template')
    .alias('l')
    .action(() => {
        require('../lib/list.js')()
    })

//使用模板初始化项目
program
    .command('create')
    .description('create a new project from a template')
    .alias('c')
    .action(() => {
        require('../lib/create.js')()
    })


program
    .parse(process.argv);
