import { request } from '@/utils/request.ts'
import type { ManagerOrder, StatItem, StoreData } from '@/types/Home'

/**
 * 后台首页--平台数据统计
 * /adminHomeTotal/platformGet
 */
export const platformTotalDataGet = () => {
  return request<StatItem[]>({
    method: 'GET',
    url: '/adminHomeTotal/platformGet'
  })
}

/**
 * 获取门店数据
 * /adminHomeTotal/storeData
 */
export const storeDataGetApi = () => {
  return request<StoreData[]>({
    method: 'GET',
    url: '/adminHomeTotal/storeData'
  })
}

/**
 * 获取前5的店长进货单
 * /adminHomeTotal/managerOrder
 */
export const managerOrderDataGet = () => {
  return request<ManagerOrder[]>({
    method: 'GET',
    url: '/adminHomeTotal/managerOrder'
  })
}
