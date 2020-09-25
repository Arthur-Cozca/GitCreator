const inquirer = require('inquirer');
const files = require('./files');

module.exports = {

    gitCredentials: () => {
        const credentials_question = [{name: 'username', type: 'input', message: 'To continue please enter your GitHub credentials [email or username] : ', validate: function(value){
            if(value.length){
                return true;
            } else {
                return 'Error, Please enter your Github credentials [email or username] : ';
            }
            }}, {name: 'password', type: 'password', message: 'Now, please enter your GitHub passwords to start the git process : ', validate: function(value){
                if(value.length){
                    return true;
                } else {
                    return 'Please, enter your GitHub passwords : ';
                }
            }}];
        return inquirer.prompt(credentials_question);
    },
    // If the user have 2fa on his account, we ask him his authentication code
    getTwoFactorAuthenticationCode: () => {
        return inquirer.prompt({
            name: 'twoFactorAuthenticationCode',
            type: 'input',
            message: 'You have a 2fa on your account, please enter your authentication code : ',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your authentication code.';
                }
            }
        });
    },

    repoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));

        const repoQuestions = [
            {
                type: 'input',
                name: 'name',
                message: 'Please enter a name for your future repository : ',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: function( value ) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Error : Please enter a name for your future repository : ';
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                default: argv._[1] || null,
                message: 'This function is optional, would you like to add a description to your repository : '
            },
            {
                type: 'list',
                name: 'visibility',
                message: 'Would you like to let this repo private or public, default : public',
                choices: [ 'public', 'private' ],
                default: 'public'
            }
        ];
        return inquirer.prompt(repoQuestions);
    },

    ignoreFiles: (filelist) => {
        const questions = [
            {
                type: 'checkbox',
                name: 'ignore',
                message: 'Which files or Folder would you like to not upload on GitHub :',
                choices: filelist,
                default: ['node_modules', 'bower_components']
            }
        ];
        return inquirer.prompt(questions);
    },


};
