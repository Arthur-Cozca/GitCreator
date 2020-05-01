// installed modules
const CLI = require('clui');
const fs = require('fs');
const git = require('simple-git/promise')();
const Spinner = CLI.Spinner;
const touch = require("touch");
const _ = require('lodash');

// local files
const inquirer = require('./inquirer');
const gh = require('./github');

module.exports = {
    createRemoteRepo: async () => {
        const github = gh.getInstance();
        const answers = await inquirer.repoDetails();

        const data = {
            name: answers.name,
            description: answers.description,
            private: (answers.visibility === 'private')
        };

        const status = new CLI.Spinner('Creating the link between GitHub and GitCreator, please wait...');
        status.start();

        try {
            const response = await github.repos.createForAuthenticatedUser(data);
            return response.data.ssh_url;
        } finally {
            status.stop();
        }
    },

    createGitignore: async () => {
        const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');

        if (filelist.length) {
            const answers = await inquirer.ignoreFiles(filelist);

            if (answers.ignore.length) {
                fs.writeFileSync( '.gitignore', answers.ignore.join( '\n' ) );
            } else {
                touch( '.gitignore' );
            }
        } else {
            touch('.gitignore');
        }
    },

    setupRepo: async (url) => {
        const status = new CLI.Spinner('Initializing the local directory and pushing it to GitHub');
        status.start();

        try {
            git.init()
                .then(git.add('.gitignore'))
                .then(git.add('./*'))
                .then(git.commit('Default Commit | GitCreator'))
                .then(git.addRemote('origin', url))
                .then(git.push('origin', 'master'));
        } finally {
            status.stop();
        }
    },


};
