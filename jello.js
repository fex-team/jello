var fis = module.exports = require('fis');

// 让 jello 打头的先加载。
fis.require.prefixes.unshift('jello');

fis.cli.name = 'jello';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');
fis.cli.help.commands = [ 'release', 'server' ];

fis.config.merge({
    namespace: '',
    statics: '/static',
    templates: '/WEB-INF/views',

    server: {
        clean: {
            exclude: "WEB-INF/lib/**,WEB-INF/web.xml,WEB-INF/tools.xml,WEB-INF/velocity.properties,WEB-INF/views/index.vm"
        }
    },

    modules: {

        parser: {
            less: 'less',
            sass: 'sass',
            scss: 'scss',
            tmpl: 'bdtmpl',
            po: 'po'
        },

        preprocessor: {
            vm: 'components, extlang',
            html: 'components',
            js: 'components',
            css: 'components'
        },

        postprocessor: {
            vm: 'require-async',
            js: 'jswrapper, require-async'
        },

        prepackager: 'derived',

        packager: 'depscombine'
    },

    roadmap: {
        ext: {
            less: 'css',
            sass: 'css',
            scss: 'css',
            tmpl: 'js',
            po: 'json'
        },

        path: [/*后续填充*/]
    },

    settings: {
        postprocessor: {
            jswrapper: {
                type: 'amd'
            }
        }
    }
});

// 当 fis release 的时候才填充 roadmap.path
fis.release = (function(origin) {
    return function() {
        var paths = fis.config.get('roadmap.path', []);
        var defaultPaths = fis.config.get('namespace') ? require('./roadmap/with_ns.js') : require('./roadmap/default.js');

        paths.push.apply(paths, defaultPaths);

        fis.release = origin;
        return origin.apply(this, arguments);
    };
})(fis.release);

