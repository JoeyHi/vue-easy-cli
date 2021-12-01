const { stopSpinner, logWithSpinner } = require('./utils/spinner');
const { error, info } = require('./utils/logger');
const inquirer = require('inquirer');
const request = require('request');
const download = require('download-git-repo')
const path = require('path');
const fs = require('fs');
const { url } = require('./config/templateGItRepo.json');

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
                let tplNames = [];
                requestBody.forEach(repo => {
                    tplNames.push(repo.name)
                })
                let promptList = [
                    {
                        type: 'list',
                        message: 'Choose a template',
                        name: 'tplNames',
                        choices: tplNames
                    },
                    {
                        type: 'input',
                        message: 'Input your projectName',
                        name: 'projectName',
                        validate(val) {
                            return val === '' ? 'projectName cannot be empty!' : true;
                        }
                    }
                ]

                inquirer.prompt(promptList).then(answers => {
                    let ind = requestBody.find((ele) => answers.tplNames === ele.name);
                    let gitUrl = `${ ind.full_name }#${ ind.default_branch }`;
                    let defaultUrl = '.';
                    let projectUrl = `${ defaultUrl }/${ answers.projectName }`;

                    const targetDir = path.resolve(process.cwd(), projectUrl);
                    if (fs.existsSync(targetDir)) {
                        error(`${ answers.projectName } is already exist`);
                        process.exit(1);
                    }
                    logWithSpinner('start download template and making your project...');
                    download(gitUrl, projectUrl, (err) => {
                        stopSpinner();
                        if (err) {
                            error('template download failed');
                            error(err);
                            process.exit(1);
                        }
                        info(`${ answers.projectName } is created!`);
                        info(`cd ${ answers.projectName } && npm install`);
                    })
                })
            } else {
                error(requestBody.message);
            }
        }
    )
}