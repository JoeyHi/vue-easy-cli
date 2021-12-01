const { execSync } = require('child_process');
const semver = require('semver');
const inquirer = require('inquirer');
const { error } = require('../lib/utils/logger');
const { info } = require('../lib/utils/logger');

const currentVersion = require('../package.json').version;

const release = async () => {
    info(`Current vue-easy-cli version is ${ currentVersion }`);
    const releaseActions = ['patch', 'minor', 'major'];
    const versions = {};
    releaseActions.map(r => (versions[r] = semver.inc(currentVersion, r)));
    const releaseChoices = releaseActions.map(r => ({
        name: `${ r } (${ versions[r] })`,
        value: r
    }))

    const { release } = await inquirer.prompt([
        {
            name: 'release',
            message: 'Select a release type',
            type: 'list',
            choices: [...releaseChoices]
        }
    ])

    const version = versions[release];

    const { yes } = await inquirer.prompt([
        {
            name: 'yes',
            message: `Confirm releasing ${version}`,
            type: 'confirm'
        }
    ])
    if (yes) {
        execSync(`standard-version -r ${ release }`, {
            stdio: 'inherit'
        })
    }
}

release().catch(err => {
    error(err);
    process.exit(1);
})