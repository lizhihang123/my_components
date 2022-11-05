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
      if (i < items.length - 1) {
        DynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
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
