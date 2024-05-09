const {process} = require("grunt/lib/grunt/config");
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-screeps')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-file-append')

    let currentdate = new Date();
    let branch = process.env.branch || "master"
    let email = process.env.email || ""
    let token = process.env.token || ""

    // Output the current date and branch.
    grunt.log.subhead('Task Start: ' + currentdate.toLocaleString())

    grunt.log.writeln('Branch: ' + branch)

    grunt.initConfig({
        screeps: {
            options: {
                email: email,
                token: token,
                branch: branch,
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

    grunt.registerTask('default', ['clean', 'copy:screeps', 'file_append:versioning', 'screeps']);
}