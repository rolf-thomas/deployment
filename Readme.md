# Automated deploy with git-hook, npm, grunt and rsync

## User workflow

Git-push to $target_branch (e.g. master) results in automatic deployment and push notification. Yikes!

## Requirements

- **Git-server**
	- unix/linux/OSX
	- possible to git-push/publish
	- bare git repository (without the actual code)
	- user on the git-server with ssh-key
	- ssh-key copied to target-server (added to .ssh/authorized_keys)
	- copy hooks/post-receive bash-script to /example.git/hooks and make it executable (chmod +x post-receive)
	- copy hooks/config to /example.git/hooks/ and put in your details
  - manuel test: execute `hooks/post-receive` in git-folder (/example.git)
- **Target-server**
	- passwordless ssh access from git-server (e.g. user "ssh deploy@targetserver")
	- target folder should be owned by deploy-user (group maybe www)
- **Project**
	- have a look at package.json and Gruntfile.js and add your configuration
	- copy intern/deploy/rsync-excludes.txt and add files not to be deployed

## Technical workflow

When the $deploy_branch (e.g. master) is pushed the following is triggered:

- hooks/post-receive ist executed
- a temporary folder is created (/tmp/repository_name/deploy_branch)
- the deploy_branch is cloned in that folder
- npm/grunt/deploy is started - or - rsync directly to the target (uncomment section)
	- change folder to temporary folder
	- `npm install` to load devDependencies
	- `npm run grunt -- deploy` to start the deployment
	- (optional) push notification via http://pushover.net if enabled and configured
- (optional) delete temp folder/clone (uncomment) - I leave it as is for now, because otherwise with every push to the deployment branch npm downloads the complete devDependencies. I find that unnecessary.

## Final words

- Use at own risk
- Test before it's to late
	- grunt: set rsync.options.dryRun to true
	- plain rsync: add option --dry-run

## Credits

Partly inspired by [Gist](https://gist.github.com/geekforbrains/2727108) from [Gavin Vickery](https://github.com/geekforbrains).
