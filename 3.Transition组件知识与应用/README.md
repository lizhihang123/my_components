## Transition组件

1.vue 有个组件 Transition，内置的，这个组件内部包裹的元素可以实现动画

2.如何实现呢？内部的组件自动添加如下类名。显示或者是创建元素都叫做进入的状态，单单是进入的状态就有三个类名，离开的状态也有三个类名。给不同阶段的类名添加不同的样式，就能够实现动画。

3.如果使用了两个 Transition 组件，那么就用假设`name: h`给其中一个区分开来。同时原本的类名写法 v-enter 也要变成`h-enter`

4.动画和骨架屏结合时，骨架屏元素有时要加绝对定位 父亲盒子要加相对定位

```less
// 1. 进入(显示, 创建)
// 进入前 v-enter(vue3.0 v-enter-from)
// 进入中 v-enter-active
// 进入后 v-enter-to

// 2. 离开 (隐藏, 移除)
// 离开前 v-leave(vue3.0 v-leave-to)
// 离开中 v-leave-active
// 离开后 v-leave-to
```

如下写法，注意 vue3 和 vue2 的区别。区别在于 vue3 的`进入前`要增加一个 from

下面是 vue2 的写法

```less
.v-enter {
  opacity: 0;
}
.v-enter-active {
  transition: all 0.3s;
}
.v-enter-to {
  opacity: 1;
}

.v-leave {
  opacity: 1;
}
.v-leave-active {
  transition: all 1s;
}
.v-leave-to {
  opacity: 0;
}
/*如果组件增加了name属性 = 'good'*/
.good-enter {
  height: 0;
}
.good-enter-active {
  transition: all 0.3s;
}
.good-enter-to {
  height: 100px;
}

.good-leave {
  height: 100px;
}
.good-leave-active {
  transition: all 1s;
}
.good-leave-to {
  height: 0;
}
```

```diff
+  <Transition>
    <div class="test" v-show="show"></div>
  </Transition>
+ <Transition name="good">
    <div class="test" v-show="show"></div>
  </Transition>
+  <button  @click="show = false">点击离开</button>
    <button  @click="show = true">点击显示</button>
```

动画知识点：

### **Transition组件**

1.可以在任意的组件使用，无需注册

2.可以设置进入和离开的动画

- v-if

- v-show

- 动态组件<component />

  **vue**

```vue
<button @click="show = !show">Toggle</button>
<Transition>
  <p v-if="show">hello</p>
</Transition>
```

**css**

```vue
/* 下面我们会解释这些 class 是做什么的 */ 
.v-enter-active, .v-leave-active {
	transition: opacity 0.5s ease; 
} 
.v-enter-from, .v-leave-to 
{ 
	opacity: 0; 
}
```

4.注意点：

- Transition 里面必须只有一个根元素
- Vue 会自动检测目标元素是否应用了 CSS 过渡或者动画，如果是，则一些 CSS 的过渡 class 会在恰当时候被触发
- 如果有 JS 钩子，在恰当的时候也会被调用
- 如果 css 和 JS 都没有，dom 的插入和删除操作会在浏览器动画的下一帧执行

### 基于 CSS 的过渡效果

<img src="https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221024154054637.png" alt="image-20221024154054637" style="zoom:50%;" />

1.v-enter-from: 元素插入前添加~，元素插入成功下一秒立马移除

2.v-enter-active: 动画的生效啦~，元素被插入之前添加，过渡或者动画走完了，就移除

3.v-enter-to: 动画结束啦~, 动画插入完成下一帧被添加(v-enter-from 正好移除)

4.v-leave-from:动画离开过渡起始效果~，下一帧立即清除

5.v-leave-active:动画离开过渡效果触发啦~，离开动画执行完毕立即清除

6.v-leave-to: 离开动画的结束啦~

**命名**

```vue
<Transition name="fade"></Transition>

fade-enter-from 全部改成
```

css 的 transition 可以设置 过渡曲线，过渡的时间

**进入和离开的过渡可以设置为不同**

```css
.v-enter-active {
  transition: all 0.3s ease-out;
}
.v-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.v-enter-from,
.v-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

原生的 css 动画和 transition 的实现基本差不多，区别是：

后者是在元素插入后的下一帧移除

动画是在一个 animationed 触发后再移除





### 组件使用

1. 项目目录下面的 home-new和home-hot使用了Transition组件，

2. 结合了骨架屏来使用，搭配v-if和v-else;到底是v-if更好一些还是v-show更好一些呢？各有利弊

![image-20221105130740177](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105130740177.png)
