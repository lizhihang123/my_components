## 面包屑组件

## 1.初级版本

## 设计

假设有 首页 > 居家 > 杯具

1. 暴露parentPath和parentName两个变量

2. 一个div和一个i标签，有多少个类目，就要手写多少个，非常不灵活。最后一个假设没有 > 箭头，就要手动不写

```js
  <div class='xtx-bread'>
    <div class="xtx-bread-item">
      <RouterLink to="/">首页</RouterLink>
    </div>
    <i class="iconfont icon-angle-right"></i>
    <!-- parentName - 是父级的类名 -->
    <!-- parentPath - 父级 点进去 能够跳转到哪一级路由 如果没有 说明没有子路由 -->
    一级类目
    <div class="xtx-bread-item" v-if="parentName">
      <RouterLink v-if="parentPath" :to="parentPath">{{parentName}}</RouterLink>
      <span v-else>{{parentName}}</span>
    </div>
    <i v-if="parentPath" class="iconfont icon-angle-right"></i>
   二级类目
    <div class="xtx-bread-item" v-if="parentName">
      <span><slot /></span>
    </div>
  </div>
```

## 使用

```vue
<XtxBread
  parentName="百度"
  parentPath="www.baidu.com"
>
  我是谁？
</XtxBread>
```

![image-20221105141959000](https://typora-1309613071.cos.ap-shanghai.myqcloud.com/typora/image-20221105141959000.png)



## 2.过渡版本

## 设计

xtx-bread 搭配 xtx-bread-item

1.xtx-bread 搭配 xtx-bread-item 也很不灵活

xtx-bread-item

```vue
<template>
  <div class='xtx-bread-item'>
    <RouterLink
      v-if="parentPath"
      :to="to"
    >
      <slot />
    </RouterLink>
    <span v-else>
      <slot />
    </span>
    <i class="iconfont icon-angle-right"></i>
  </div>
</template>
```



xtx-bread 

```vue
<template>
  <div class='xtx-bread'>
    <slot />
  </div>
</template>
```



## 使用

```vue
<XtxBread>
	<XtxBreadItem>首页</XtxBreadItem>
    <XtxBreadItem to="/path/123">居家</XtxBreadItem>
</XtxBread>
```



## 3.高级

## 设计

1.利用vue3的render函数，同时vue3里面直接提供了h函数

2.通过h函数渲染标签，render函数把标签渲染到dom上

3.可以利用js，动态控制最后一个>不显示，nice

XtxBread

```diff
<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render () {
    // 1. 获取所有的插槽
    // 2. 创建数组存放所有的插槽
    // 3. 如果是i < items.length - 1那么就放入一个 > 箭头 再次调用一个h函数
    // 4. 最终返回一个h函数的调用 创建一个div 里面的内容是所有的DynamicItems。把i标签交给render函数 里面动态的控制
    const items = this.$slots.default()
    const DynamicItems = []
    for (let i = 0; i < items.length; i++) {
      DynamicItems.push(items[i])
      // 这里的代码很关键，最后一个类目没有 > 也就是说 首页 > 居家 > 桌子 而不是 首页 > 居家 > 桌子 >
+      if (i < items.length - 1) {
+        DynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    }
    return h('div', { class: 'xtx-bread' }, DynamicItems)
  }
}
</script>

<style lang='less'>
// 去除 scoped 属性，目的：然样式作用到xtx-bread-item组件
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  // ul li:last-child {}
  // 先找到父元素，找到所有的子元素，找到最后一个，判断是不是LI，是就是选中，不是就是无效选择器
  // ul li:last-of-type {}
  // 先找到父元素，找到所有的类型为li的元素，选中最后一个
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
    // 样式的方式，不合理
    // &:last-child {
    //   display: none;
    // }
  }
}
</style>
```





XtxBreadItem

```vue
<template>
  <div class='xtx-bread-item'>
    <RouterLink
      v-if="parentPath"
      :to="to"
    >
      <slot />
    </RouterLink>
    <span v-else>
      <slot />
    </span>
  </div>
</template>

<script>
export default {
  name: 'XtxBreadItem',
  props: {
    to: {
      type: [String, Object]
    }
  }
}
</script>

<style scoped lang='less'>
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
```



## 使用