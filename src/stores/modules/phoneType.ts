import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { phoneTypeItem } from '@/types/CateItem'
import { phoneModelGetApi } from '@/api/cate.ts'

export const usePhoneTypeStore = defineStore('phoneType', () => {
  // 加载
  const loading = ref(false)
  //手机型号列表
  const phoneTypeList = ref<phoneTypeItem[]>([])
  // 总条数
  const total = ref(0)
  // 获取手机型号
  const phoneTypeListGet = async (
    parent_id?: string,
    pageNum: number = 1,
    pageSize: number = 10,
    pageType = false
  ) => {
    console.log(parent_id, pageNum, pageSize)
    loading.value = true
    const res = await phoneModelGetApi(parent_id, pageNum, pageSize, pageType)
    console.log('请求结果', res)
    phoneTypeList.value = res.data.list
    total.value = res.data.total
    loading.value = false
  }

  // 重置列表
  const setPhoneTypeList = () => {
    phoneTypeList.value = []
  }

  return {
    loading,
    phoneTypeList,
    phoneTypeListGet,
    total,
    setPhoneTypeList
  }
})
