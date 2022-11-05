## 1. 功能

- 页面滚动到指定区域，再去调用接口，加载数据。目的是，减少首页加载的压力，第一次见进入页面不要加载特别多的数据，特别是图片很多的时候

## 2. 使用场景

- 一般是页面很长，图片很多的时候。



使用方式

1. 引入方法
2. 传入接口，调用方法。接口处数据
3. 数据给到页面。target绑定对应dom容器， 一般是父盒子。goods是修改后的名字，给到容器

```js
import { useLazyData } from '@/hooks'
const { result: goods, target } = useLazyData(findNew)
```



## 3. 方法设计

`骨架屏和组件懒加载的区别`:

1.组件懒加载是指 移动到了可视区域 才加载数据

2.骨架屏是指，请求已经发送了，数据没有加载响应回来时，就要出现骨架屏 这里是灰色的，加上vue特有的动画，就是特效了

>`组件数据懒加载的关键步骤`:
>
>1. 使用vueuse里面的方法`useIntersectionObserver`
>
>2. 这个方法里面能够解构出一个stop方法，能够停止监听dom容器。
>
>3. 方法的参数1是监听的dom容器，能够返回出去。在外层方法里面记得ref声明。组件里面接受后，绑定到dom元素上，就能够监听到指定的dom `记得绑定dom元素 一定外面套一层div 然后是Transition 然后是ul`直接给到ul是无法显示，因为ul是有数据，容器才会出现。没出现，监听的结果是没有进入可视区。
>
>  ```vue
>  <div style="position: relative; height: 426px" ref="target">
>    <Transition name="fade">
>      <ul v-if="list.length"  class="goods-list" >
>  ```
>
>4. 参数2是回调函数，回调函数的参数1是数组，里面是对象，有`isIntersecting`,是布尔值 是否进入可视区。回调函数的参数2是监听的dom元素。
>
>5. 逻辑是，如果进入可视区。就停止监听，并且调用接口，获取数据，获取的数据返回【外面记得ref声明】
>
>6. 在组件里面使用。引入`useLazyData`方法，传入接口，解构出容器和数据。进行渲染，绑定容器。测试就是进入查看，是否进入可视区，才出现的接口调用。

```js
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
export const useLazyData = (apiFn) => {
  // dom容器
  const target = ref(null)
  // 存储数据
  const result = ref(null)
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observeElement) => {
      if (isIntersecting) {
        // 停止监听
        stop()
        // 调用接口 拿数据
        try {
          apiFn().then((data) => {
            result.value = data.result
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  )
  return {
    result,
    target
  }
}
```

