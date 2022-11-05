<template>
  <!--
   1. 如果没有传递 parentPath 那么二级类目是不能够点击的 | 传递了是可以点击的
   2. 如果parentPath和parentName都没有，那么就只有 首页 > 分类 (且后面这个分类是都不能够点击的)
   3. 这个组件的缺陷是：
   -->
  <div class='xtx-bread'>
    <!-- 一级name -->
    <div class="xtx-bread-item">
      <RouterLink to="/">首页</RouterLink>
    </div>
    <!-- 第一个小斜杠 -->
    <i class="iconfont icon-angle-right"></i>
    <!-- 二级面包屑 -->
    <div
      class="xtx-bread-item"
      v-if="parentName"
    >
      <RouterLink
        :to="`/category/${parentPath}`"
        v-if="parentPath"
      >{{parentName}}</RouterLink>
      <span v-else>{{parentName}}</span>
    </div>
    <!-- 第二个小斜杠 -->
    <i
      v-if="parentName"
      class="iconfont icon-angle-right"
    ></i>
    <!-- 第三个name -->
    <div class="xtx-bread-item">
      <span>
        <slot></slot>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XtxBread',
  props: {
    parentPath: {
      type: String,
      default: ''
    },
    parentName: {
      type: String,
      default: ''
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
