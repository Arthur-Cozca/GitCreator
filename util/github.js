// installed modules
const CLI = require('clui');
const configstore = require('configstore');
const { Octokit } = require('@octokit/rest')
const spinner = CLI.Spinner;
const { createBasicAuth } = require("@octokit/auth-basic");

// local files
const inquirer = require('./inquirer');
const pkg = require('../package.json');

const conf = new configstore(pkg.name);

let octokit;

module.exports = {
    getInstance: () => {
        return octokit;
    },

    getStoredGithubToken: () => {
        return conf.get('github.token');
    },

    getPersonalAccesToken: async () => {
        const credentials = await inquirer.gitCredentials();
        const status = new CLI.Spinner('Authentication process in progress, please wait ...');

        status.start();

        const auth = createBasicAuth({
            username: credentials.username,
            password: credentials.password,
            async on2Fa() {

            },
            token: {
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'GitCreator, the best tools to create github repository with a single command'
            }
        });

        try {
            const res = await auth();

            if(res.token) {
                conf.set('github.token', res.token);
                return res.token;
            } else {
                throw new Error("Error: GitHub token was not found");
            }
        } finally {
            status.stop();
        }
    },

    async on2Fa() {
        status.stop();
        const res = await inquirer.getTwoFactorAuthenticationCode();
        status.start();
        return res.twoFactorAuthenticationCode;
    },

    githubAuth: (token) => {
        octokit = new Octokit({
            auth: token
        });
    },

};
