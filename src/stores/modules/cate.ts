import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CateItem } from '@/types/CateItem'
import { cateGetApi } from '@/api/cate'

export const useCateStore = defineStore('cate', () => {
  const loading = ref(true)
  // 获取分类
  const cateList = ref<CateItem[]>([])
  const cateListGet = async () => {
    loading.value = true
    const res = await cateGetApi()
    cateList.value = res.data
    loading.value = false
  }

  return {
    loading,
    cateList,
    cateListGet
  }
})
