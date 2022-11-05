const directives = (app) => {
  app.directive('lazyload', {
    mounted(el, binding) {
      // 创建observer对象
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        // 解构出 isIntersecting参数 如果是true -》表示在可视范围
        if (isIntersecting) {
          // 停止监听dom
          observer.unobserve(el)
          // 给el 也就是绑定这个属性的dom 添加 onerror这个事件 然后给他的src属性添加图片
          el.onerror = function () {
            el.src = defaultImage
          }
          // 给el的src赋值 binding.value就是 v-lazyload=""绑定的值
          el.src = binding.value
        }
      })
      observer.observe(el)
    }
  })
}
export default {
  install(app) {
    directives(app)
  }
}
