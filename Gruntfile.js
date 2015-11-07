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
                    port: 8008
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
                files: [{
                    cwd: 'gallery/',
                    src: ['index.html'],
                    dest: 'docroot/',
                    expand: true
                }]
            },
            test: {
                files: [{
                    cwd: 'test/',
                    src: ['**/*.html'],
                    dest: 'docroot/test/',
                    expand: true
                }]
            }
        },

        stylus: {
            options: {
                "include css": true,
                compress: false,
                use: [
                    function() {
                        return require('autoprefixer-stylus')('last 2 versions', 'ie 8', 'ie 9', 'ie 10');
                    }
                ]
            },
            gallery: {
                src: 'gallery/gallery.styl',
                dest: 'docroot/gallery.css'
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

            testFiles: {
                files: ['test/**/*.html', 'test/**/*.json'],
                tasks: ['html']
            },

            stylus: {
                files: ['**/*.styl'],
                tasks: ['stylus']
            }
        }
    };

    grunt.registerMultiTask('html', 'Render HTML with nunjucks using sibling JSON as context', function() {
        var tests = grunt.file.expand('test/**/*.html');
        var globalContext = {
            tests: tests
        };

        this.files.forEach( function(fileObject) {
            var totalRenderedHtml = '';

            fileObject.src.forEach(function(fileToRender) {
                var pathToContext = fileToRender.replace('html', 'json');
                var doesHtmlHaveContext = grunt.file.exists(pathToContext);
                var renderedHtml;
                var fileContext = {};

                if (doesHtmlHaveContext)
                    fileContext = Object.assign({}, globalContext, grunt.file.readJSON(pathToContext));
                else
                    fileContext = globalContext;

                renderedHtml = nunjucks.render(fileToRender, fileContext);

                totalRenderedHtml += renderedHtml;
            });

            grunt.file.write(fileObject.dest, totalRenderedHtml);
        });
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
