jello ['dʒeləu]
============================

针对服务端为 JAVA + Velocity 的前端集成解决方案。

为优化前端开发而生，提供前后端开发分离、自动性能优化、模块化开发机制等功能。

## 目录
* [前后端分离](#前后端分离)
* [自动性能优化](#自动性能优化)
* [模板继承机制](#模板继承机制)
* [模块化开发](#模块化开发)
* [简化环境安装](#简化环境安装)
* [如何使用](#如何使用)
  * [安装](#安装)
  * [快速上手](#快速上手)
  * [jello 命令](#jello 命令)
  * [模板继承](#模板继承)
  * [模板数据绑定](#模板继承)
  * [页面模拟](#页面模拟)
  * [插件说明](#插件说明)
  * [配置](#配置)
  * [更多资料](#更多资料)

## 前后端分离

基于 velocity 模板引擎实现前后端分离，让前端攻城师更专注于 JS、CSS、VM(velocity 模板文件) 文件编写。
我们提供一种简单的机制，模拟线上环境，让你轻松的预览线上效果。

比如：创建一个 vm velocity 模板文件后，基于我们的工具，你可以直接预览此模板文件的内容，
在相应的目录创建一个同名 json 文件，按与后端开发人员约定好的数据格式，
在此 json 文件中添加测试数据便能自动与模板变量绑定上。

使用此机制可以让前端开发流程与后端开发完全分离，后端开发人员只需关心渲染哪个模板文件和添加相应的模板数据。

## 自动性能优化

我们基于 [velocity](http://velocity.apache.org) 开发了些扩展标签 (directive)，如：html、head、body、script、style、widget...
如果你采用我们提供的标签 (directive) 组织代码，无论按什么顺序组织，我们可以保证所有 css 内容集中在头部输出，所有的 js 集中在底部输出，以达到一个性能优化的效果。

另外结合自动打包配置，可以让多个 js/css 资源合并成一个文件，更大程度的优化性能。

## 模板继承机制
扩展 velocity 实现类 smarty 的模板继承功能，让模板能够得到更充分的复用。

将多个页面间相同的部分提取到一个 layout.vm 文件里面，每个页面只需填充自己独有的内容。

更多细节查看[模板继承](#模板继承)。

## 模块化开发
提供 html、css、js 模块化机制，包括 widget 组件化与 js amd 加载机制，让内容更好的拆分与复用。

## 简化环境安装

内嵌 j2ee 开发服务器，你无需再折腾 j2ee 环境搭建。直接通过 `jello server start` 就能开起服务，预览页面。

## 如何使用

### 安装
* 安装 [nodejs&npm](http://nodejs.org/)
* 安装 [java](http://java.com/zh_CN/)
* 安装jello & lights

   ```bash
    npm install lights -g
    npm install jello -g
    jello -v
   ```

### 快速上手
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

### jello 命令
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

### 模板继承

提供类似 smarty 的模板集成机制, 被继承的模板中的所有 block 标签都可以被覆盖。

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



### 模板数据绑定

每个 page 目录下的模板页面都会自动绑定上 test 目录下同名的 json 数据，同时还支持添加同名 jsp 脚本动态添加。

1. test/page/index.json

  ```json
  {
      "title": "This will be override in index.jsp.",
      "subtitle": "This is subtitle."
  }
  ```
2. test/page/index.jsp

  ```jsp
  <%@ page import="org.apache.velocity.context.Context" %><%

      Context context = (Context)request.getAttribute("context");


      context.put("title", "Welcome to jello.");
  %>
  ```
3. page/index.vm

  ```velocity
  <h1>$title</h1>
  <h2>$subtitle</h2>
  ```
4. 输出结果

  ```html
  <h1>Welcome to jello.</h1>
  <h2>This is subtitle.</h2>
  ```

### 页面模拟

通过创建 vm 文件可以创建页面，但是访问路径是固定的 ${项目名称}/page/${页面路径}，此路径与线上地址不一致怎么办？

可以通过添加 `server.conf` 文件，如下面的栗子，当请求 /testpage 的时候，实际上渲染的是 example/page/testpage 页面

```
rewrite ^\/testpage /example/page/testpage
```

处理 page  下的 vm 文件，还可重定向 test 的各种 json 文件和 jsp 文件。如

```
rewrite ^\/ajaxHander /test/page/ajaxHandler.jsp

rewrite ^\/somejsonfile /test/page/data.json
```

`server.conf` 支持 rewrite, redirect 两种指令。



### 插件说明
基于 velocity 扩展了以下标签 (directive)。

#### **html**

  代替`<html>`标签，设置页面运行的前端框架，以及控制整体页面输出。

  语法: `#html([$framework[, $attrs]])body #end`

  ```velocity

  #html("fis-site:static/js/mod.js", "lang", "zh")
  ...
  body content.
  ...
  #end
  ```

  **输出**

  ```html
  <html lang="zh">
  ...
  body content
  ...
  </html>
  ```
#### **head**

  代替`<head>`标签，控制CSS资源加载输出。

  语法: `#head([$attrs]) body #end`

  ```velocity
  #head()
  <meta charset="utf-8"/>
  #end
  ```
#### **body**

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
#### **script**

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

#### **style**

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

#### **require**

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
#### **widget**

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
#### **uri**

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

### 配置
参考[fis配置](http://fis.baidu.com/)

## 更多资料

* [fis](https://github.com/fex-team/fis)
* [fis-plus](https://github.com/fex-team/fis-plus)
* [gois](https://github.com/xiangshouding/gois)
* [spmx](https://github.com/fouber/spmx/)
* [phiz](https://github.com/fouber/phiz/)
