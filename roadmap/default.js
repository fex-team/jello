module.exports = [
    {
        reg: /^\/components\/(.*\.(js|css))$/i,
        isMod: true,
        release: '${statics}/components/$1'
    },

    {
        reg: /^\/widget\/(.*\.(?:vm|jsp|html))$/i,
        isMod: true,
        url: '/widget/$1',
        release: '${templates}/widget/$1'
    },

    {
        reg: /^\/page\/(.+\.(?:vm|jsp|html))$/i,
        isMod: true,
        url: '/page/$1',
        release: '/${templates}/page/$1',
        extras: {
            isPage: true
        }
    },

    // 页面级 js
    // 设置 page/**.js 为 isMod 可以自动包装成 amd
    {
        reg: /^\/page\/(.*\.js)$/i,
        isMod: true,
        release: '${statics}/page/$1'
    },

    // widget 级 js/css
    {
        reg: /^\/widget\/(.*\.(js|css))$/i,
        isMod: true,
        release: '${statics}/widget/$1'
    },

    // 文件名以 _ 下划线打头的，最终都不 release
    // 也不优化，因为这类文件都只会被内嵌的。
    {
        reg: '**/_*.*',
        release: false,
        useAMD: false,
        useOptimizer: false
    },

    {
        reg: /^\/(static)\/(.*)/i,
        release: '${statics}/$2'
    },

    // 允许用户自己扩展预览环境。
    {
        reg: /^\/(WEB-INF)\/(.*)/i,
        release: 'WEB-INF/$2'
    },

    {
        reg: /^\/(test)\/(.*)/i,
        isMod: false,
        release: '/$1/$2'
    },

    {
        reg: 'server.conf',
        release: '/WEB-INF/server.conf'
    },

    {
        reg: "**.sh",
        release: false
    },

    {
        reg: 'map.json',
        release: '/WEB-INF/config/map.json'
    },

    {
        reg: 'fis.properties',
        release: '/WEB-INF/fis.properties'
    },

    {
        reg: 'VM_global_library.vm',
        release: '/${templates}/VM_global_library.vm'
    },

    {
        reg: /^.+$/,
        release: '${statics}$&'
    }
];
