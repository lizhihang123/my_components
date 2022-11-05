## 骨架屏

## 1.使用场景

以下两幅图，展示了骨架屏，使用的场景，就是在数据加载不及时，为了避免白屏的情况，使用骨架屏

![image-20221105101955969](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105101955969.png)

![image-20221105102034905](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105102034905.png)

除此以外，我们可以创建一个组件，再去对 xtx-skeleton.vue 组件单独的进行封装, 比如 home-skeleton.vue 这个组件的使用

比如下图，传入我们需要的宽度和高度

![image-20221105130046941](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105130046941.png)

## 2.组件设计

1. 组件需要暴露宽度 高度 背景颜色三个变量，同时还需要一个变量，animated 来控制是否显示动画，因为添加了一个动画。

2. 骨架屏的结构如下。大盒子有宽高和一个伪元素，伪元素有动画。小盒子是背景的颜色

```vue
  <div
    class="xtx-skeleton"
    :class="{shan: animated}"
    :style="{width, height}"
  >
    <!-- 1 盒子-->
    <div
      class="block"
      :style="{backgroundColor: bg}"
    ></div>
    <!-- 2 闪效果 xtx-skeleton 伪元素 --->
  </div>
```

伪元素的动画的样式

```diff
.shan {
  &::after {
    content: "";
    position: absolute;
+animation: shan 1.5s ease 0s infinite;
    top: 0;
    width: 50%;
    height: 100%;
+    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
+    transform: skewX(-45deg); // 这个样式能够将一个盒子进行扭曲
  }
}
+ 让矩形进行位移
@keyframes shan {
  0% {
    left: -100%;
  }
  100% {
    left: 120%;
  }
}
```

## 3.组件使用

- 明确需要 v-if 和 v-else 配合
- 可能要传递多个这样的组件

```diff
+<template v-if="lis.children">
  <RouterLink
    :to="`/category/sub/${sub.id}`"
    v-for="sub in lis.children"
    :key="sub.id"
  >
    {{sub.name}}
  </RouterLink>
</template>
<!-- 骨架屏组件 -->
+<template v-else>
+  <xtx-skeleton
+    :animated="true"
    width="54px"
    height="18px"
    style="margin-right: 5px;"
    bg="rgba(255,255,255, 0.2)"
  />
  <xtx-skeleton
    :animated="true"
    width="54px"
    height="18px"
    bg="rgba(255,255,255, 0.2)"
  />
</template>
```
