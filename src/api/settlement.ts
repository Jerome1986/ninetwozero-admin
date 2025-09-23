import { request } from '@/utils/request.ts'
import type {
  CheckStoreParentResult,
  filterFlow,
  inviterStoreItem,
  SettlementPageResult
} from '@/types/Settlement'

/**
 * 获取各门店经营数据
 * /settlement
 * @param pageNum - 页码 默认：1
 * @param pageSize - 当前条数 默认：10
 * @param year - 年份
 * @param month - 月
 */
export const settlementGetApi = (
  pageNum: number,
  pageSize: number,
  year: number,
  month: number
) => {
  return request<SettlementPageResult>({
    method: 'GET',
    url: '/settlement',
    params: { pageNum, pageSize, year, month }
  })
}

/**
 * 查询该门店是否有上级-用于佣金计算
 * /store/checkParent
 * @param {string} storeId - 当前门店id
 */

export const checkParentStoreApi = (storeId: string) => {
  return request<CheckStoreParentResult>({
    method: 'POST',
    url: '/store/checkParent',
    data: { storeId }
  })
}

/**
 * 获取当前用户下级门店
 * /business/get
 * @param {string} storeId - 当前用户绑定的门店id
 */

export const businessListApi = (storeId: string) => {
  return request<inviterStoreItem>({
    method: 'GET',
    url: '/business/get',
    params: { storeId }
  })
}

/**
 * 根据指定日期筛选门店流水
 * /store/RangeType
 */

export const filterFlowApi = (
  storeId: string,
  range: string,
  year: number = 0,
  month: number = 0
) => {
  return request<filterFlow>({
    method: 'GET',
    url: '/store/RangeType',
    params: { storeId, range, year, month }
  })
}
