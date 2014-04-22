Velocity集成解决方案设计文档
=========================

针对服务端为JAVA + Velocity的环境，大部分设计借鉴了[fis-plus](https://github.com/fex-team/fis-plus)（针对php+smarty3）的实现思路。

## 目标

同[fis-plus](https://github.com/fex-team/fis-plus)一样，我们的目标是提出一种开发方案，提高开发人员生产力，同时自动解决产品性能问题。

细分：

* **模块化机制（widget）**

  提供一种能抽离出子内容便于代码公用的机制。
* **控制css头部输出，js页尾输出**

  提供一种js/css能就近添加，但是能保证css头部输出和js底部输出的机制。
* **资源定位**

  提供便利的资源引入功能。

## 实现

需要创建以下几种`directives`。widget用来实现模块化。script、style、require、widget等用来收集js/css内容，通过head/body来控制js/css输出位置。

1. **html**

  代替`<html>`标签，设置页面运行的前端框架，以及控制整体页面输出。

  语法: `#html ( [$framework[, $attrs]] )body #end`

  ```velocity

  #html( "fis-site:static/js/mod.js" )
  ...
  body content.
  ...
  #end
  ```
1. **head**

  代替`<head>`标签，控制CSS资源加载输出。

  语法: `#html([$attrs]) body #end`

  ```velocity
  #head
  <meta charset="utf-8"/>
  #end
  ```
1. **body**

  代替`<body>`标签，控制JS资源加载输出。

  语法: `#body([$attrs]) body #end`

  ```velocity
  #html("home:static/lib/mod.js")
    #head
    <meta charset="utf-8"/>
    #end

    #body
        ...
    #end
  #end
  ```
1. **script**

  代替`<script>`标签，收集使用JS组件的代码块，控制输出至页面底部。

  语法: `#script([$attrs]) body #end`

  ```velocity
  #html("home:static/lib/mod.js")
    #head
    <meta charset="utf-8"/>

      ## 通过script插件收集加载组件化JS代码
      #script
      require.async("home:static/ui/B/B.js");

      console.log('here');
      #end
    #end

    #body
        ...
    #end
  #end
  ```
1. **style**

  代替`<style>`标签，收集使用CSS组件的代码块，控制输出至页面头部。

  语法: `#style([$attrs]) body #end`

  ```velocity
  #html("home:static/lib/mod.js")
    #head
    <meta charset="utf-8"/>

      #style
      @import url(xxx.css);

      body {
          color: #fff;
      }
      #end
    #end

    #body
        ...
    #end
  #end
  ```
1. **require**

  通过静态资源管理框架加载静态资源。

  语法: `#require( $uri )`

  ```velocity
  #html("home:static/lib/mod.js")
    #head
    <meta charset="utf-8"/>

      ## 通过script插件收集加载组件化JS代码
      #script
      require.async("home:static/ui/B/B.js");

      console.log('here');
      #end
    #end

    #body
      #require("home:static/index/index.css")
    #end
  #end
  ```
1. **widget**

 调用模板组件，渲染输出模板片段。

 语法: `#widget( $uri )`

 ```velocity
  #html("home:static/lib/mod.js")
    #head
    <meta charset="utf-8"/>

      ## 通过script插件收集加载组件化JS代码
      #script
      require.async("home:static/ui/B/B.js");

      console.log('here');
      #end
    #end

    #body
      #require("home:static/index/index.css")
      #widget("home:widget/A/A.tpl")
    #end
  #end
  ```
1. **uri**

  定位线上资源，允许跨模块(project)。

 语法: `#uri( $uri )`

 ```velocity
  #html("home:static/lib/mod.js")
    #head
    <meta charset="utf-8"/>
    #end

    #body
        #uri("home:static/css/bootstrap.css")
    #end
  #end
  ```

## layout机制

fis-plus因为是使用smarty，模板引擎支持模板继承。所以可以创建一个公用的layout.tpl，其他页面tpl直接扩展layout.tpl。

velocity不支持此功能。目前采用的方案暂定为。将所有layout放到layout目录，page中可以通过`#set( $layout="print.vm")`来指定layout。
目前只支持内容区填充，不支持block区域填充。

```
├── layout
│   ├── default.vm
│   └── print.vm
├── page
│   ├── index.vm
└   └── detail.vm
```

## 数据源
page/xxx.vm 的数据源通过test/page/xxx.(json|jsp)提供。

## 页面模拟
test/xxx.(jsp|json)

同样，通过`server.conf`来配置。[快速通道](http://fis.baidu.com/userdoc/fis/%E6%9C%AC%E5%9C%B0%E6%A8%A1%E6%8B%9F%E8%AF%B7%E6%B1%82%E8%BD%AC%E5%8F%91%E5%8A%9F%E8%83%BD)

## 源目录与输出目录规则

几个需要保持不变的目录。

1. WEB-INFO
2. page
3. test
4. widget

## 与后端整合
提供fis-velocity-tools.jar，rd将起加入classpath即可。

设置velocity properties，将所有directive添加上。

```
userdirective=com.baidu.fis.tools.velocity.directive.Html,com.baidu.fis.tools.velocity.directive.Head...
```

