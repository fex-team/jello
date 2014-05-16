##介绍
**jello** : 服务端为JAVA + Velocity 的前端集成解决方案。发音为：['dʒeləu]

##功能概述

* 扩展[fis](https://github.com/fex-team/fis)，实现服务端为JAVA + Velocity 的前端集成解决方案。
* 内置tomcat服务器，完美支持java+velocity后端环境
* 扩展velocity插件，实现继承机制以及静态资源管理系统
* 本地json&jsp数据模拟，简化本地开发流程
* 实现[fis](https://github.com/fex-team/fis)其他所有前端开发功能

## 安装
* 安装 [nodejs&npm](http://nodejs.org/)
* 安装 [java](http://java.com/zh_CN/)
* 安装jello & lights

   ```bash
    npm install lights -g
    npm install jello -g
    jello -v
   ```

##快速上手
* 下载 [jello-demo](http://lightjs.duapp.com/)

    ```bash
     lights install jello-demo
    ```
* 编译预览

    ```bash
     cd jello-demo
     jello release
     jello server start
    ```
* 预览： localhost:8080/example/page/index

## jello 命令
> 三条命令满足所有开发需求

```bash
     jello --help

     Usage: jello <command>

     Commands:

        release     build and deploy your project
        install     install components and demos
        server      launch a embeded tomcat server

     Options:

        -h, --help     output usage information
        -v, --version  output the version number
        --no-color     disable colored output
```

* 具体命令使用请参考 [fis-plus](http://fis.baidu.com/)

##插件实现

jello扩展以下 **html**,**head**,**body**,**script**,**style**,**require**,**uri**, **widget**插件，实现组件化以及 [静态资源管理系统](https://github.com/fex-team/fis/wiki/%E5%9F%BA%E4%BA%8Emap.json%E7%9A%84%E5%89%8D%E5%90%8E%E7%AB%AF%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1%E6%8C%87%E5%AF%BC)。

需要创建以下几种`directives`。widget用来实现模块化。script、style、require、widget等用来收集js/css内容，通过head/body来控制js/css输出位置。

### **html**

  代替`<html>`标签，设置页面运行的前端框架，以及控制整体页面输出。

  语法: `#html ( [$framework[, $attrs]] )body #end`

  ```velocity

  #html( "fis-site:static/js/mod.js" )
  ...
  body content.
  ...
  #end
  ```
### **head**

  代替`<head>`标签，控制CSS资源加载输出。

  语法: `#html([$attrs]) body #end`

  ```velocity
  #head()
  <meta charset="utf-8"/>
  #end
  ```
### **body**

  代替`<body>`标签，控制JS资源加载输出。

  语法: `#body([$attrs]) body #end`

  ```velocity
  #html("home:static/lib/mod.js")
    #head()
    <meta charset="utf-8"/>
    #end

    #body()
        ...
    #end
  #end
  ```
### **script**

  代替`<script>`标签，收集使用JS组件的代码块，控制输出至页面底部。

  语法: `#script([$attrs]) body #end`

  ```velocity
  #html("home:static/lib/mod.js")
    #head()
    <meta charset="utf-8"/>

      ## 通过script插件收集加载组件化JS代码
      #script()
      require.async("home:static/ui/B/B.js");

      console.log('here');
      #end
    #end

    #body()
        ...
    #end
  #end
  ```
* 注意：script标签暂时不支持内部有#end标签嵌套

### **style**

  代替`<style>`标签，收集使用CSS组件的代码块，控制输出至页面头部。

  语法: `#style([$attrs]) body #end`

  ```velocity
  #html("home:static/lib/mod.js")
    #head
    <meta charset="utf-8"/>

      #style()
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
* 注意：style标签暂时不支持内部有#end标签嵌套

### **require**

  通过静态资源管理框架加载静态资源。

  语法: `#require( $uri )`

  ```velocity
  #html("home:static/lib/mod.js")
    #head()
    <meta charset="utf-8"/>

      ## 通过script插件收集加载组件化JS代码
      #script()
      require.async("home:static/ui/B/B.js");

      console.log('here');
      #end
    #end

    #body()
      #require("home:static/index/index.css")
    #end
  #end
  ```
### **widget**

 调用模板组件，渲染输出模板片段。

 语法: `#widget( $uri )`

 ```velocity
  #html("home:static/lib/mod.js")
    #head()
    <meta charset="utf-8"/>

      ## 通过script插件收集加载组件化JS代码
      #script()
      require.async("home:static/ui/B/B.js");

      console.log('here');
      #end
    #end

    #body()
      #require("home:static/index/index.css")
      #widget("home:widget/A/A.tpl")
    #end
  #end
  ```
### **uri**

  定位线上资源，允许跨模块(project)。

 语法: `#uri( $uri )`

 ```velocity
  #html("home:static/lib/mod.js")
    #head()
    <meta charset="utf-8"/>
    #end

    #body()
        #uri("home:static/css/bootstrap.css")
    #end
  #end
  ```

## 模板继承机制(layout)

提供类似 smarty 的模板集成机制

1. layout.vm

  ```velocity
  <!DOCTYPE html>
    #html("example:static/js/mod.js")

    #head()
      <meta charset="utf-8"/>
      <meta content="" name="description">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Demo</title>
      #require("example:static/css/bootstrap.css")
      #require("example:static/css/bootstrap-theme.css")
      #require("example:static/js/jquery-1.10.2.js")
      #require("example:static/js/bootstrap.js")
    #end ## end head

  #body()
  <div id="wrapper">
    #block("body_content")
        This is body.
    #end
  </div>
  #end ## end body

  #require("example:page/layout.vm")
  #end ## end html
  ```
2. index.vm

  ```velocity
  #extends("layout.vm")

  #block("body_content")
  <h1>Hello Demo</h1>

      #widget("example:widget/header/header.vm")

      #script()
      // var widgetA = require("example:widget/widgetA/widgetA.js");

      require.async("example:widget/widgetB/widgetB.js", function(api) {
      api.sayHelloWorld();
      });
      #end ## end script
  #end ## end block

  #require("example:page/index.vm")
  #end
  ```

##配置
参考[fis配置](http://fis.baidu.com/)

##更多资料

* [fis](https://github.com/fex-team/fis)
* [fis-plus](https://github.com/fex-team/fis-plus)
* [gois](https://github.com/xiangshouding/gois)
* [spmx](https://github.com/fouber/spmx/)
* [phiz](https://github.com/fouber/phiz/)