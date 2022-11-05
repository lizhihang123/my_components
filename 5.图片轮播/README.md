## 1.使用场景

以下两个组件都有涉及，图片的切换，所以我才把它们放到一起。

xtx-carousel.vue

- 一般是这种大的banner图

![image-20221105132621249](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105132621249.png)



home-brands

- 点击按钮，才进行切换。小的商品/品牌区块

![image-20221105132638681](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105132638681.png)



## 2.轮播图的切换

### 2.1 轮播图的基本布局后续渲染

**布局的思路：**

1. 轮播图的图片是ul>li
2. 左右按钮是a标签里面有i标签，i标签是专门的箭头
3. 下面的白色小圆点span进行遍历，其实也可以是ol>li



**一些布局的问题：**

1. &-body是什么意思?

```less
.carousel {
	&-body {
	}
}

等同于 .carousel-body
&-item等同于 .carousel-item
```



2. fade类干嘛用的?

>用于显示当前的轮播图

```
  &.fade {
    opacity: 1;
    z-index: 1;
  }
```

3. 轮播图布局后续出现的问题

`左侧按钮无法调整到中间来，下面的小点点无法移动轮播图的中间。注意不是整个大图的中间，而是右侧部分的中间`。需要深度作用域，:deep(类名)

![image-20221103194411866](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221103194411866.png)

```less
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  .xtx-carousel {
    ::v-deep .carousel-btn.prev {
    left: 270px;
    }
    ::v-deep .carousel-indicator {
    padding-left: 250px;
    }
  }
}
现在要用 :deep(.类名)
```

4. 获取banner接口设置，数据给一个slider，传入到xtx-carousel组件中

组件里面的props数据别渲染错了。如果写default: [] `会报错`,数组必须写() => []

```js
    slider: {
      type: Array,
      default: () => []
    }
```

5. 注意逻辑，声明一个数据fade，控制默认显示哪个轮播图。动态class这里设置 index === fade而不是 item.id === fade

```js
    const fade = ref(1)
    return { fade }
```

```vue
  <li class="carousel-item"
  v-for="(item, index) in slider"
  :key="index"
  :class="{fade: index === fade}"
  >
```



### 2.2 轮播图的功能点

1. **自动播放**：组件使用者可以决定，轮播图是否自动播放，是的话就传入animated,那么就可以自动播放。
2. **自动播放鼠标经过**：如果有自动轮播。假设鼠标进入了，就暂停自动轮播。假设鼠标离开了，就开启自动轮播。
3. **小圆点切换：**指示器切换，点击小点点能够切换
4. **左右切换**: 点击左右按钮，能够切换
5. **销毁组件**：能够清理定时器



### `2.3 自动播放功能`

>总结自动播放功能的要点：
>
>1. 设置定时器 还要注意一开始就关闭定时器
>
>2. 注意越界问题 fade变量不能超过轮播图的数量
>
>3. 注意侦听器的写法，可能原本有轮播图的内容，突然没了；也可能没有轮播图的内容，突然有了。所以是有轮播图的内容，再去调用自动播放的函数。
>
>4. 注意可能是静态的图片地址，因此一开始就要侦听

```js
// 1. 自动播放功能
    let timer = null
    const autoPlayFn = () => {
      // 1.1 一上来 清除定时器 防止重复开启
      clearInterval(timer)
      timer = setInterval(() => {
        // 让默认显示的图片能够++
        fade.value++
        // 1.2 为什么这里要写props.slider.length 而不是直接slider.length
        // setup函数的形参是props 如果这里不写props.slider.length 就会报错 setup函数里面不能直接访问props里面的变量
        if (fade.value > props.slider.length) {
          fade.value = 0
        } // props.duration是多久切换一次定时器
      }, props.duration)
    }
    // 1.3 何时调用自动播放函数?
    // 注意侦听 有slider数据时并且有自动播放的数据传入时，才开启自动播放
    // 非常要注意 这里侦听器的写法 第一个参数 返回要监听的值 第二个参数是新的值。两个都是回调函数
    watch(() => props.slider, (newVal) => {
      // newVal是监听到的改变的数据
      if (newVal.length && props.autoPlay) {
        // 默认显示第一张图片
        fade.value = 0
        autoPlayFn()
      }
    },
    {
      immediate: true // 图片数据可能是静态的，因此一上来就要开始侦听。页面一有这个数据就要开始侦听
    }
    )
    return { fade }
```



### `2.4 鼠标进入，关闭自动播放；鼠标离开，开启自动播放`

1. fade.value **>=** props.slider.length是对的， fade.value **>** props.slider.length是错的,长度依然不能取到

```js
        if (fade.value >= props.slider.length) {
```

2. stop方法清除定时器，就能够停止自动播放；start方法开始定时器，判断有数据，并且autoPlay是true。
3. 注意**越界**问题，fade.value >= props.slider.length是 **>=**

```js
    // 2.鼠标进入，关闭自动播放；鼠标离开，开启自动播放
    const stop = () => {
      clearInterval(timer)
    }
    const start = () => {
      if (props.slider && props.slider.length && props.autoPlay) {
        if (fade.value >= props.slider.length) {
          fade.value = 0
        }
        if (fade.value < 0) {
          fade.value = props.slider.length - 1
        }
        autoPlayFn()
      }
    }
```

不加括号也是可以使用的

```js
  @mouseenter="stop()"
  @mouseleave="start()"
```



1.能获取到event对象

```vue
<div
class='xtx-carousel'
ref="Carousel"
@mouseenter="stop"
@mouseleave="start"
>
---
// 鼠标经过 轮播图停止自动播放
const stop = (e) => {
console.log(e) // 有e
if (timer) {
clearInterval(timer)
}
}
```

2.获取不到event对象的情况。给stop()加括号，那么下面就获取不到event了

```vue
<div
class='xtx-carousel'
ref="Carousel"
@mouseenter="stop()"
@mouseleave="start"
>
```

3.传递参数时，可以手动加event

vue3里面注意是，

```js
@mouseenter="stop(123,$event)" 加了$event后面才能打印的到
```





### `2.5 点击小点点能够切换`

```diff
    <div class="carousel-indicator">
      <span
        v-for="(item, i) in sliders"
        :key="item.id"
+        :class="{active: index === i }"
+        @click="index = i"
      ></span>
```

1. 我们直接修改index的值就好。在ul>li里面的li，动态class控制fade类名，而让index的值等于i，就可以修改轮播图，也可以修改小圆点的高亮的指向
2. 再次强调 fade.value = index这里是会报错的 **template模板里面 index.value是错误的**。只有在setup函数里面要这样做。return出来以后就直接可以赋值了。在模板里面是响应式的改，在setup里面是另一种更改方式



### `2.6 点击左右按钮 能够切换 `

1. 左右切换，这里采用了，先不直接修改fade.value, 而是先有一个新的值，再去判断是否越界，越界就return，而index的值没有发生变化
2. 越界记得**return**

```diff
// toggle切换轮播图
const toggle = (step) => {
  if (step >= 0 && index.value >= props.sliders.length - 1) {
+    index.value = 0
    return
  }
  if (step < 0 && index.value <= 0) {
    // 必须是等于props.sliders.length - 1而不是length
+    index.value = props.sliders.length - 1
    return
  }
+  index.value += step
}
```





### `2.7 销毁组件`

```js
// 5. 销毁组件时 清除定时器
onMounted(() => {
  clearInterval(timer)
})
```





轮播图小结：

1. 轮播图有自动播放，鼠标经过停止自动播放、离开开始自动播放的功能，左右切换，点击小圆点切换，四个
2. 自动播放，需要封装一个autoPlayFn方法，这个方法，一开始先清除定时器，然后去监听轮播图的图片的数据是否响应，有了的话，就去调用start方法，start方法，会去累加一个变量index，这个变量一累加，图片就会移动。采用的是opacity透明度结合transition,而不是移动。
3. 鼠标经过和离开，依靠的是mouseenter和mouseleave两个事件
4. 点击小圆点切换，是修改当前的index变量为小圆点的索引





## 3. 商品banner的切换

**最关键的一句代码**

- 通过transform的translateX来进行左右切换，移动的宽度就是ul自身的宽度，注意`translateX(${-index * 1240}px)`}`这里的写法

```diff
<ul
  class="list"
  v-if="brands && brands.length"
+  :style="{transform: `translateX(${-index * 1240}px)`}"
>
```



**使用一个按钮，共用toggle函数**

```js
const index = ref(0) // index专门用来控制ul的切换
const toggle = (step) => {
  // 使用一个中间变量 控制ul
  const newValue = index.value + step
  if (newValue > 1 || newValue < 0) return
  index.value = newValue
}
```



**右上角的按钮，点击右键时，toggle(1)点击左边是，左键（-1）。**

![image-20221105133124356](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105133124356.png)



更好的一个操作是，我们观察右上角，点击右键时，右键紧接着就就会变成灰色，点击左键时，左键接着就会变成灰色

```diff
<template v-slot:right>
  <a
    href="javascript:;"
    class="iconfont icon-angle-left prev"
+    :class="{disabled: index === 0}"
    @click="toggle(-1)"
  ></a>
  <a
    href="javascript:;"
    class="iconfont icon-angle-right next"
+    :class="{disabled: index === 1}"
    @click="toggle(1)"
  ></a>
</template>
```



**这里和轮播图的区别是什么呢？**

banner的位移是通过transform,而轮播图的位移是通过opacity结合动画来控制，如下代码。添加了fade类，那么opacity就会从0变成1

```diff
&-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
+      opacity: 0;
+      transition: opacity 0.5s linear;
      &.fade {
+        opacity: 1;
        z-index: 1;
      }
```

