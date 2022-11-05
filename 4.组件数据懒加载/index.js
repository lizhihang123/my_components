import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
export const useLazyData = (apiFn) => {
  // dom容器
  const target = ref(null)
  // 存储数据
  const result = ref(null)
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observeElement) => {
      if (isIntersecting) {
        // 停止监听
        stop()
        // 调用接口 拿数据
        try {
          apiFn().then((data) => {
            result.value = data.result
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  )
  return {
    result,
    target
  }
}
