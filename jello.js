var fis = module.exports = require('fis');

// 让 jello 打头的先加载。
fis.require.prefixes.unshift('jello');

fis.cli.name = 'jello';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

fis.config.merge({
    statics: '/static',

    server: {
        clean: {
            exclude: "WEB-INF/lib/**,WEB-INF/web.xml,WEB-INF/velocity.properties,index.vm"
        }
    },

    modules: {

        parser: {
            less: 'less',
            sass: 'sass',
            scss: 'sass',
            tmpl: 'bdtmpl',
            po: 'po'
        },

        preprocessor: {
            vm: 'extlang'
        },

        postprocessor: {
            vm: 'require-async',
            js: 'jswrapper, require-async'
        }
    },

    roadmap: {
        ext: {
            less: 'css',
            sass: 'css',
            scss: 'css',
            tmpl: 'js',
            po: 'json'
        },

        path: [

            {
                reg: /\/lang\/([^\/]+)\.po/i,
                release: '/WEB-INF/config/lang/${namespace}.$1.po'
            },

            {
                reg: /^\/widget\/(.*\.vm)$/i,
                isMod: true,
                release: '/templates/${namespace}/widget/$1'
            },

            {
                reg: /^\/widget\/(.*\.(js|css))$/i,
                isMod: true,
                release: '${statics}/${namespace}/widget/$1'
            },

            {
                reg: /^\/page\/(.+\.vm)$/i,
                isMod: true,
                release: '/templates/${namespace}/page/$1',
                extras: {
                    isPage: true
                }
            },

            {
                reg: /^\/(static)\/(.*)/i,
                release: '${statics}/${namespace}/$2'
            },

            {
                reg: /^\/(WEB-INF)\/(.*)/i,
                release: 'WEB-INF/$2'
            },

            {
                reg: /^\/(config|test)\/(.*)/i,
                isMod: false,
                release: '/$1/${namespace}/$2'
            },

            {
                reg: 'server.conf',
                release: '/WEB-INF/server.conf'
            },

            {
                reg: "build.sh",
                release: false
            },

            {
                reg: '${namespace}-map.json',
                release: '/WEB-INF/config/${namespace}-map.json'
            },

            {
                reg: /^.+$/,
                release: '${statics}/${namespace}$&'
            }
        ]
    },

    settings: {
        postprocessor: {
            jswrapper: {
                type: 'amd'
            }
        }
    }
});