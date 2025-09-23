import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PhoneBrand } from '@/types/CateItem'
import { phoneBrandGetApi, phoneBrandPageGetApi } from '@/api/cate.ts'

// 手机品牌store
export const usePhoneBrandStore = defineStore('phone', () => {
  // 加载
  const loading = ref<boolean>(true)
  // 手机品牌列表
  const brandList = ref<PhoneBrand[]>([])
  // 总条数
  const total = ref(0)
  // 获取手机品牌
  const brandListGet = async (pageNum: number = 1, pageSize: number = 10, pageType = false) => {
    loading.value = true
    console.log(pageNum, pageSize, pageType)
    // 如果 pageType 为 true ，则请求全部 - 不带分页
    if (pageType) {
      const res = await phoneBrandGetApi(pageType)
      brandList.value = res.data
    } else {
      // 带分页
      const res = await phoneBrandPageGetApi(pageNum, pageSize, pageType)
      brandList.value = res.data.list
      total.value = res.data.total
    }

    loading.value = false
  }

  return {
    loading,
    brandList,
    brandListGet,
    total
  }
})
