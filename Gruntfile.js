module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        stageDir: 'stage',

        copy: {
            ckeditor: {
                files: [
                    {expand: true, cwd: 'bower_components/ckeditor-dev', src: '**/*', dest: '<%= stageDir %>'}
                ]
            },

            bootstrapck: {
                files: [
                    {expand: true, cwd: 'bower_components/bootstrapck4-skin/skins/bootstrapck', src: '**/*', dest: '<%= stageDir %>/skins/bootstrapck'}
                ]
            }
        },

        shell: {
            test: {
                command: 'java -jar lib/ckbuilder/2.0.1/ckbuilder.jar --build stage/ dist/ --overwrite --no-zip --no-tar',
                stderr: false
            }
        },

        clean: {
            stage: ['stage']
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('stage', 'copy');
    grunt.registerTask('build', 'shell');
};
