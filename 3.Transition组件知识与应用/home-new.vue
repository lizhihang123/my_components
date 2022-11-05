<template>
  <div class="home-new">
    <HomePanel
      title="新鲜好物"
      sub-title="新鲜出炉 品质靠谱"
    >
      <!-- 面板内容
      默认插槽直接传进来就好了
       -->
      <template #right>
        <XtxMore path="/" />
      </template>
      <div
        style="position: relative;height: 406px;"
        ref="target"
      >
        <Transition name="fade">
          <ul
            class="goods-list"
            v-if="goods && goods.length"
          >
            <li
              v-for="good in goods"
              :key="good.id"
            >
              <!-- 这里缺少了to属性 -->
              <RouterLink :to="`/product/${good.id}`">
                <img
                  alt=""
                  v-lazyload="good.picture"
                >
                <p class="name ellipsis">{{good.name}}</p>
                <p class="price">&yen;{{good.price}}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton
            v-else
            bg="#f0f9f4"
          />
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>
<script>
import HomePanel from './home-panel'
import { findNew } from '@/api/home'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeleton },
  setup () {
    const { result: goods, target } = useLazyData(findNew)
    // const goods = ref([])
    // const target = ref(null)
    // const { stop } = useIntersectionObserver(
    //   target,
    //   ([{ isIntersecting }], observeElement) => {
    //     // 打印的频率是什么:进入页面打印一次 + 可视区打印一次 + 离开可视区打印一次
    //     // res是数组，里面是一个对象，对象里面有一个属性是isIntersecting能够判断是否进入了可视区
    //     console.log(observeElement)
    //     if (isIntersecting) {
    //       // 进入可视区 停止监听 + 调用接口 拿到数据
    //       stop()
    //       findNew().then(data => {
    //         goods.value = data.result
    //       })
    //     }
    //   }
    // )
    return {
      goods,
      target
    }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
