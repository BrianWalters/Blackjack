module.exports = function ( grunt ) {

    require('load-grunt-tasks')(grunt);
    var fs = require('fs');
    var nunjucks = require('nunjucks');
    nunjucks.configure({ autoescape: true });

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
            gallery: {
                files: [{
                    cwd: 'gallery/',
                    src: ['*.png'],
                    dest: 'docroot/',
                    expand: true
                }]
            },
            test: {
                files: [{
                    cwd: 'test/',
                    src: '**/*.html',
                    dest: 'docroot/test/',
                    expand: true
                }]
            },
            sampleConfig: {
                options: {
                    process: function (content, srcpath) {
                        content = content.replace(/[ ]{4}/g, "");
                        content = content.replace(/(unless)(.+)(\n)/g, "");
                        return content;
                    }
                },
                src: 'source/blackjack-defaults.styl',
                dest: 'sample-config.styl'
            }
        },

        'gh-pages': {
            gallery: {
                options: {
                    base: 'docroot'
                },
                src: ['**/*']
            }
        },

        html: {
            gallery: {
                cwd: 'gallery/',
                src: ['index.html'],
                dest: 'docroot/',
                expand: true
            },
            test: {
                cwd: 'test/',
                src: ['**/*.html'],
                dest: 'docroot/test/',
                expand: true
            }
        },

        stylus: {
            options: {
                "include css": true,
                use: [
                    function() {
                        return require('autoprefixer-stylus')('last 2 versions', 'ie 8', 'ie 9', 'ie 10');
                    }
                ]
            },
            gallery: {
                src: 'gallery/gallery.styl',
                dest: 'docroot/gallery.css',
                options: {
                    compress: false
                }
            },
            blank: {
                src: 'blank/blanked-config.styl',
                dest: 'blank/blank-config.css'
            },
            test: {
                cwd: 'test/',
                src: ['**/*.styl'],
                dest: 'docroot/test/',
                filter: 'isFile',
                ext: '.css',
                expand: true
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

    grunt.registerMultiTask('html', 'Render HTML with nunjucks', function() {
        console.log(this.data);
        var tests = fs.readdirSync('test/');
        var context = {
            tests: tests
        };
    });

    grunt.initConfig( task_config );

    grunt.registerTask( 'build', [
        'clean',
        'stylus',
        'copy',
        'html'
    ]);

    grunt.registerTask( 'serve', [
        'build',
        'connect:serve',
        'watch'
    ]);

    grunt.registerTask( 'publish', 'Publishes the gh-pages branch', [
        'build',
        'gh-pages'
    ]);

    grunt.registerTask( 'sample', 'Rebuilds the sample config', [
        'copy:sampleConfig'
    ]);

    grunt.registerTask('default', ['build']);
};
