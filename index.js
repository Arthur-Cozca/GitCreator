#!/usr/bin/env node

// GitCreator @author: Arthur Servantie


// Installed modules
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

// created modules
const files = require('./util/files');
const inquirer = require('./util/inquirer');
const git = require('./util/github');
const repo = require('./util/repo');

// We clear the terminal
clear();

// We create the GitCreator title by using Figlet
console.log(chalk.blueBright(figlet.textSync('GitCreator', { horizontalLayout: 'full'})));

// We check to see if the .git directory exists.
if(files.directoryExists(".git")){
    console.log(chalk.red("Error, an .git repository already exists"));
    process.exit();
}

const getGithubToken = async () => {
    // Fetch token from the config store import
    let token = git.getStoredGithubToken();
    if(token) {
        return token;
    }

    // If no token found, it use credentials
    token = await git.getPersonalAccesToken();

    return token;
};


// Create function to run the git client
const run = async () => {
    try {

        const token = await getGithubToken();
        git.githubAuth(token);

        // Create remote repository
        const url = await repo.createRemoteRepo();

        // Create .gitignore file
        await repo.createGitignore();

        // Set up local repository and push to remote
        await repo.setupRepo(url);

        console.log(chalk.green('Success !'));
    } catch(err) {
        if (err) {
            switch (err.status) {
                case 401:
                    console.log(chalk.red('Error : invalid credentials or token'));
                    break;
                case 422:
                    console.log(chalk.red('Error : There is already a remote for this repository'));
                    break;
                default:
                    console.log(chalk.red(err));
            }
        }
    }
};

// we run the client
run();
