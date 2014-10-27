module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        shell: {
            test: {
                command: 'java -jar lib/ckbuilder/2.0.1/ckbuilder.jar --build bower_components/ckeditor-dev/ dist/ --overwrite --no-zip --no-tar',
                stderr: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('build', 'shell');
};
