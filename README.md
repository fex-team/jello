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

通过添加以下几种`directives`来实现。

1. html

  代替`<html>`标签，设置页面运行的前端框架，以及控制整体页面输出。

  语法: `#html ( [$framework[, $attrs]] )body #end`

  ```velocity

  #html( "fis-site:static/js/mod.js" )
  ...
  body content.
  ...
  #end
  ```
2. head

  代替`<head>`标签，控制CSS资源加载输出。

  语法: `#html body #end`

  ```velocity
  #head
  <meta charset="utf-8"/>
  #end
  ```
3. body

  代替`<body>`标签，控制JS资源加载输出。

  语法: `#body body #end`

  ```velocity
  #html ("home:static/lib/mod.js")
    #head
    <meta charset="utf-8"/>
    #end

    #body
        ...
    #end
  #end
  ```
4. script

  代替`<script>`标签，收集使用JS组件的代码块，控制输出至页面底部。

  语法: `#script body #end`

  ```velocity
  #html ("home:static/lib/mod.js")
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

## 与后端整合

