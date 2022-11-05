<template>
  <div
    class='xtx-carousel'
    ref="Carousel"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, i) in sliders"
        :key="item.id"
        :class="{fade: index === i}"
      >
        <RouterLink :to="item.hrefUrl">
          <img
            :src="item.imgUrl"
            alt=""
          >
        </RouterLink>
      </li>
    </ul>
    <a
      href="javascript:;"
      class="carousel-btn prev"
      @click="toggle(-1)"
    >
      <i class="iconfont icon-angle-left"></i>
    </a>
    <a
      href="javascript:;"
      class="carousel-btn next"
      @click="toggle(1)"
    ><i class="iconfont icon-angle-right"></i></a>
    <div class="carousel-indicator">
      <span
        v-for="(item, i) in sliders"
        :key="item.id"
        :class="{active: index === i }"
        @click="index = i"
      ></span>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 持续时间
    duration: {
      type: Number,
      default: 1000
    }
  },
  setup (props) {
    const Carousel = ref(null)
    // 渲染结构
    // 1. 默认显示哪张图片呢？
    const index = ref(0)
    // 2. 自动播放
    let timer = null
    const autoPlayFn = () => {
      // 事先判断鼠标是否在可视区域里面
      clearInterval(timer)
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }
    // 监听sliders有无数据+autoPlay是否是true 判断是否调用autoPlay
    watch(() => props.sliders, (newVal) => {
      if (newVal && newVal.length && props.autoPlay) {
        index.value = 0
        autoPlayFn()
      }
    }, {
      immediate: true
    })
    // 鼠标经过 轮播图停止自动播放
    const stop = (a, e) => {
      console.log(a, e)
      if (timer) {
        clearInterval(timer)
      }
    }
    // 鼠标离开 开始自动播放
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }
    // toggle切换轮播图
    const toggle = (step) => {
      if (step >= 0 && index.value >= props.sliders.length - 1) {
        index.value = 0
        return
      }
      if (step < 0 && index.value <= 0) {
        // 必须是等于props.sliders.length - 1而不是length
        index.value = props.sliders.length - 1
        return
      }
      index.value += step
    }

    // 节流的函数
    // 尝试把throttle里面返回的函数抽离成单独的函数，-> 有朋友建议这么做，这样每次返回的都是同一个函数，但是俺不理解，为啥要这样去做
    // function throttle (func, delay, step) {
    //   // step是点击按钮 切换一张轮播图 取值 1/-1
    //   // timer变量在外面声明
    //   let timer
    //   return function () {
    //     const context = this
    //     // 节流的关键 如果timer变量还有值 说明时间还没有到
    //     if (timer) {
    //       return
    //     }
    //     timer = setTimeout(function () {
    //     // debugger
    //       func.call(context, step)
    //       timer = null
    //     }, delay)
    //   }
    // }
    return {
      index,
      start,
      stop,
      toggle,
      Carousel
    }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
.xtx-carousel {
  :deep(.carousel-btn.prev) {
    left: 270px;
  }
  :deep(.carousel-indicator) {
    padding-left: 250px;
  }
}
</style>
