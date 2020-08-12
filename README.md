# r_repo_updater

For launch need to execute follow command:

`GIT_USER=<bb_user> GIT_PASS=<bb_app_password> npm run start -- <bb_repo> <package> <version>`

Where
* bb_user - name of bitbucket user with access to target repository
* bb_app_password - application password which can be configured in user profile settings
* bb_repo - bitbucket repo in follow format 'bitbucket.org/<workspace>/<repo_name>.git'
* package - just name of the target npm package
* version - new version of target package

# Known isssues

1. Need to create folder called 'repos' in project root
2. Git config should be configured globally