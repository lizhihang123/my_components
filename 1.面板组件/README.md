## 面板组件

1. 该组件，需要暴露 title和 subTitle两个变量。

2. 该组件适合的场景是，上面标题，下面商品的布局。
3. 组件的结构分为上下两个部分。上面的部分是header，下面的部分是默认的插槽

![image-20221105100940755](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105100940755.png)

比如下面的场景和上面的是类似的

![image-20221105101325840](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105101325840.png)

4. header里面的“查看更多”采用的是具名插槽。为什么这里用插槽呢？因为并不是所有使用这个组件的用户都需要这个“查看全部”

```diff
<template>
  <div class="home-panel">
    <div class="container">
      <div class="head">
        <!-- 标题和副标题 -->
        <h3>{{ title }}<small>{{ subTitle }}</small></h3>
+        <slot name="right" />
      </div>
      <!-- 正文内容 全部用插槽来做 -->
+      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePanel',
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    }
  }
}
</script>
```

