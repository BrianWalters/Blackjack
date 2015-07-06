module.exports = function ( grunt ) {

    require('load-grunt-tasks')(grunt);

    var task_config = {

        clean: {
            docroot: 'docroot'
        },

        connect: {
            options: {
                hostname: 'localhost',
                base: 'docroot/',
                livereload: 35729
            },

            serve: {
                options: {
                    open: 'http://localhost:8008',
                    port: 8008,
                    middleware: function (connect, options) {
                        var optBase = (typeof options.base === 'string') ? [options.base] : options.base;
                        return [require('connect-modrewrite')(['!(\\..+)$ / [L]'])].concat(
                            optBase.map(function(path){ return connect.static(path); }));
                    }
                }
            }
        },

        copy: {
            docroot: {
                files: [{
                    cwd: 'gallery/',
                    src: ['index.html'],
                    dest: 'docroot/',
                    expand: true
                }]
            }
        },

        stylus: {
            options: {
                "include css": true
            },
            gallery: {
                src: 'gallery/gallery.styl',
                dest: 'docroot/gallery.css',
                options: {
                    compress: false
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },

            filesChangedApp: {
                files: ['gallery/index.html'],
                tasks: ['copy']
            },

            stylus: {
                files: ['**/*.styl'],
                tasks: ['stylus']
            }
        }
    };

    grunt.initConfig( task_config );

    grunt.registerTask( 'build', [
        'clean',
        'stylus',
        'copy'
    ]);

    grunt.registerTask( 'serve', [
        'build',
        'connect:serve',
        'watch'
    ]);
};
