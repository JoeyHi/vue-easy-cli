const request = require('request');
const chalk = require('chalk');
const { error } = require('./utils/logger');
const { logWithSpinner, stopSpinner } = require('./utils/spinner');
const {url} = require('./config/templateGItRepo.json');
module.exports = () => {
    logWithSpinner('searching template...');
    request(
        {
            url,
            headers: {
                'User-Agent': 'vue-easy-cli'
            }
        },
        (err, res, body) => {
            stopSpinner();
            if (err) {
                error('listing failed...');
                error(err);
                process.exit(1);
            }
            const requestBody = JSON.parse(body);
            if (Array.isArray(requestBody)) {
                console.log(chalk.green('Template List: '));
                requestBody.forEach(repo => {
                    console.log(` ${ chalk.yellow('★') } ${ chalk.blue(repo.name) } - ${ repo.description }`)
                })
            } else {
                error(requestBody.message)
            }
        }
    )
}