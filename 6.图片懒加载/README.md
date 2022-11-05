## 图片懒加载

## 1.使用场景

​	滚动到指定的页面，再去加载对应的图片。接口已经调用了，但是没有立马进行图片的赋值。这样即使接口的数据响应的不及时，也没有关系。

​	和数据懒加载的不同点，数据懒加载是滚动到指定的页面，再去发起请求，调用接口。而图片懒加载，是接口一开始就会去调用，赋值是 滚动到指定页面再去赋值。



## 2.封装

- 核心是使用，`IntersectionObserver`这个API，判断是否进入可视区
- el在这里就是img标签，给谁添加v-lazyload，那么谁就是el,img自带的事件有onerror事件和src属性

```diff
const directives = (app) => {
  app.directive('lazyload', {
    mounted(el, binding) {
      // 创建observer对象
+      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        // 解构出 isIntersecting参数 如果是true -》表示在可视范围
        if (isIntersecting) {
          // 停止监听dom
          observer.unobserve(el)
          // 给el 也就是绑定这个属性的dom 添加 onerror这个事件 然后给他的src属性添加图片
          el.onerror = function () {
            el.src = defaultImage
          }
          // 给el的src赋值 binding.value就是 v-lazyload=""绑定的值
          el.src = binding.value
        }
      })
      observer.observe(el)
    }
  })
}
export default {
  install(app) {
    directives(app)
  }
}

```



vue2和vue3封装自定义指令的区别是什么：

vue3是这样的,里面有install方法， 传入app实例

```js
export default {
  install(app) {
    directives(app)
  }
}
```



vue2是这样的

```js
// register
是传入一个Vue实例,也是install方法
// Register a global custom directive called `v-focus`
Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element 自动聚焦
    el.focus()
  }
})
```



## 3.使用

```diff
<img
+v-lazyload="good.picture"
alt=""
/>
```

