<template>
  <HomePanel
    title="热门品牌"
    sub-title="国际经典 品质保证"
  >
    <template v-slot:right>
      <a
        href="javascript:;"
        class="iconfont icon-angle-left prev"
        :class="{disabled: index === 0}"
        @click="toggle(-1)"
      ></a>
      <a
        href="javascript:;"
        class="iconfont icon-angle-right next"
        :class="{disabled: index === 1}"
        @click="toggle(1)"
      ></a>
    </template>
    <div
      class="box"
      ref="box"
    >
      <Transition name="fade">
        <ul
          class="list"
          v-if="brands && brands.length"
          :style="{transform: `translateX(${-index * 1240}px)`}"
        >
          <li
            v-for="brand in brands"
            :key="brand.id"
          >
            <RouterLink to="/">
              <img
                :src="brand.picture"
                alt=""
              >
            </RouterLink>
          </li>
        </ul>
        <HomeBrandsSkeleton v-else />
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { ref } from 'vue'
import { findBrand } from '@/api/home'
import HomePanel from './home-panel'
import HomeBrandsSkeleton from './home-brands-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeBrand',
  components: { HomePanel, HomeBrandsSkeleton },
  setup () {
    // 1. 接口 + 数据
    // 2. 渲染
    // 3. 改造为骨架屏
    // 4. 改造为懒加载 注意懒加载的实现方式
    // const brands = ref(null)
    // findBrand().then(data => {
    //   brands.value = data.result
    //   console.log(data)
    // })
    const { result: brands, target: box } = useLazyData(() => findBrand(10))

    // 点击切换
    const index = ref(0) // index专门用来控制ul的切换
    const toggle = (step) => {
      // 使用一个中间变量 控制ul
      const newValue = index.value + step
      if (newValue > 1 || newValue < 0) return
      index.value = newValue
    }
    return {
      brands,
      box,
      toggle,
      index
    }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
