module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-screeps')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-file-append')
    grunt.loadNpmTasks('grunt-env')

    let currentdate = new Date();


    // Output the current date and branch.
    grunt.log.subhead('Task Start: ' + currentdate.toLocaleString())


    grunt.initConfig({
        env: {
            misaki: {
                TOKEN: '',
                BRANCH: '',
                EMAIL: '',
            }
        },
        screeps: {
            options: {
                email: '<%= EMAIL %>',
                token: '<%= TOKEN %>',
                branch: '<%= BRANCH %>',
            },
            dist: {
                src: ['dist/*.js']
            }
        },

        clean: {
            'dist': ['dist']
        },

        copy: {
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        // Change the path name utilize underscores for folders
                        return dest + src.replace(/\//g, '_');
                    }
                }],
                options: {
                    process: function (content, srcpath) {
                        const requirePattern = /require\(["'](\.\/)([^"']+)["']\);/g;

                        content = content.replace(requirePattern, function (match, p1, p2) {
                            // 将路径中除了第一个 ./ 之外的所有 / 替换为 _
                            const transformedPath = p2.replace(/\//g, function (match, offset) {
                                if (offset === 0) {
                                    return match;
                                } else {
                                    return '_';
                                }
                            });

                            return `require("${p1}${transformedPath}");`;
                        })
                        return content
                    },
                }
            }
        },

        // Add version variable using current timestamp.
        file_append: {
            versioning: {
                files: [
                    {
                        append: "\nglobal.SCRIPT_VERSION = " + currentdate.getTime() + "\n",
                        input: 'dist/version.js',
                    }
                ]
            }
        },

    });

    grunt.registerTask('set-env', function () {
        grunt.config('BRANCH', process.env.branch);
        grunt.config('EMAIL', process.env.email);
        grunt.config('TOKEN', process.env.token);
    })


    grunt.registerTask('default', ['clean', 'env:misaki', 'set-env', 'copy:screeps', 'file_append:versioning', 'screeps', 'clean']);
}