Velocity集成解决方案设计文档
=========================

针对服务端为JAVA + Velocity的环境，大部分设计借鉴了[fis-plus](https://github.com/fex-team/fis-plus)（针对php+smarty3）的实现思路。

## 目标

同[fis-plus](https://github.com/fex-team/fis-plus)一样，我们的目标是提出一种开发方案，提高开发人员生产力，同时自动解决产品性能问题。

目标细分。

* **模块化机制（widget）**

  提供一种能抽离出子内容便于代码公用的机制。
* **控制css头部输出，js页尾输出**

  提供一种js/css能就近添加，但是能保证css头部输出和js底部输出的机制。

## 实现


## 与后端整合

