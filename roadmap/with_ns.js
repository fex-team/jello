module.exports = [
    {
        reg: /^\/components\/(.*\.(js|css))$/i,
        isMod: true,
        release: '${statics}/${namespace}/components/$1'
    },

    {
        reg: /^\/widget\/(.*\.(?:vm|jsp|html))$/i,
        isMod: true,
        url: '/${namespace}/widget/$1',
        release: '${templates}/${namespace}/widget/$1'
    },

    {
        reg: /^\/page\/(.+\.(?:vm|jsp|html))$/i,
        isMod: true,
        url: '/${namespace}/page/$1',
        release: '/${templates}/${namespace}/page/$1',
        extras: {
            isPage: true
        }
    },

    // 页面级 js
    // 设置 page/**.js 为 isMod 可以自动包装成 amd
    {
        reg: /^\/page\/(.*\.js)$/i,
        isMod: true,
        release: '${statics}/${namespace}/page/$1'
    },

    // widget 级 js/css
    {
        reg: /^\/widget\/(.*\.(js|css))$/i,
        isMod: true,
        release: '${statics}/${namespace}/widget/$1'
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
        release: '${statics}/${namespace}/$2'
    },

    // 允许用户自己扩展预览环境。
    {
        reg: /^\/(WEB-INF)\/(.*)/i,
        release: 'WEB-INF/$2'
    },

    {
        reg: /^\/(test)\/(.*)/i,
        isMod: false,
        release: '/$1/${namespace}/$2'
    },

    {
        reg: 'server.conf',
        release: '/WEB-INF/server${namespace}.conf'
    },

    {
        reg: "**.sh",
        release: false
    },

    {
        reg: '${namespace}-map.json',
        release: '/WEB-INF/config/${namespace}-map.json'
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
        release: '${statics}/${namespace}$&'
    }
];
