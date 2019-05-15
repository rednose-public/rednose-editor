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
            },

            plugins: {
                files: [
                    {expand: true, cwd: 'src/plugins', src: '**/*', dest: '<%= stageDir %>/plugins'}
                ]
            },

            config: {
                files: [
                    {expand: true, cwd: 'src', src: 'config.js', dest: '<%= stageDir %>'}
                ]
            }
        },

        shell: {
            test: {
                command: 'java -jar lib/ckbuilder/2.0.1/ckbuilder.jar --build stage/ dist --skip-omitted-in-build-config --overwrite --no-zip --no-tar',
                stderr: false
            }
        },

        clean: {
            stage: ['stage']
        },

        watch: {
            src: {
                files: ['src/**/*.*'],
                tasks: ['copy:config', 'copy:plugins']
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('stage', ['clean', 'copy']);
    grunt.registerTask('build', ['stage', 'shell']);
    grunt.registerTask('start', ['stage', 'watch']);
};
