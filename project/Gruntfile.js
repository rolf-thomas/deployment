module.exports = function(grunt) {

	package = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// Deployment
		rsync: {
			options: {
				args: ["-avz","--exclude-from='intern/deploy/rsync-excludes.txt'"],
				ssh: true,
				recursive: true,
				dryRun: false,
			},
			live: {
				options: {
					src: ".",
					dest: package.deployment.live.path,
					host: package.deployment.live.host,
					delete: true,
				}
			}
		},
		shell: {
			options: {
				stderr: false,
			},
			before_live_deploy: {
				command: [].join('&&'),
			},
			after_live_deploy: {
				command: [
					package.deployment.live.send_notification ? 'curl -s -F "token='+package.deployment.live.notification_token+'" -F "user='+package.deployment.live.notification_user+'" -F "title=Deployment" -F "message='+package.name+'/'+package.version+' was deployed '+(package.url?package.url:'')+'" https://api.pushover.net/1/messages.json > /dev/null' : '',
				].join('&&')
			},
		},
		// Deployment END
	});


	grunt.loadNpmTasks('grunt-rsync');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('deploy:live', ['shell:before_live_deploy','rsync:live','shell:after_live_deploy']);
	grunt.registerTask('deploy', ['deploy:live']);

};