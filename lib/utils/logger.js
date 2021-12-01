const chalk = require('chalk');
const readline = require('readline');
const EventEmitter = require('events');
const padStart = String.prototype.padStart;

const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${ msg } `);

const format = (label, msg) => {
    return msg.split('\n').map((line, i) => {
        return i === 0
            ? `${ label } ${ line }`
            : padStart(line, chalk.reset(label).length); // 对齐
    }).join('\n');
};

exports.events = new EventEmitter();

exports.clearConsole = title => {
    if (process.stdout.isTTY) {
        // 判断是否在终端环境
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        // 在终端移动光标到标准输出流的起始坐标位置, 然后清除给定的TTY流
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        if (title) {
            console.log(title);
        }
    }
};

exports.warn = (msg, tag = null) => {
    console.warn(
        format(
            chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''),
            chalk.yellow(msg)
        )
    );
};

exports.error = (msg, tag = null) => {

    console.error(
        format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg))
    );
    if (msg instanceof Error) {
        console.error(msg.stack);
    }
};


exports.info = (msg, tag = null) => {
    console.log(
        format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), chalk.blue(msg))
    );
};

exports.success = (msg, tag = null) => {
    console.log(
        format(chalk.bgGreen.black(' SUCCESS ') + (tag ? chalkTag(tag) : ''), chalk.green(msg))
    );
};