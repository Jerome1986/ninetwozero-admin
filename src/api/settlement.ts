import { request } from '@/utils/request.ts'
import type {
  CheckStoreParentResult,
  filterFlow,
  inviterStoreItem,
  SettlementPageResult,
  StoreOrderFinished
} from '@/types/Settlement'
import type { addResult, updateResult } from '@/types/Gobal'

/**
 * 获取各门店经营数据
 * /settlement/get
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
    url: '/settlement/get',
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

/**
 * 计算当前订单的结算金额
 * /settlement/upRealIncome
 * @param storeId
 * @param year
 * @param month
 * @param realIncome
 */
export const updateSettlementRealIncomeApi = (
  storeId: string,
  year: number,
  month: number,
  realIncome: number
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/settlement/upRealIncome',
    data: { storeId, year, month, realIncome }
  })
}

/**
 * 管理员结算当月账单
 * /settlement/finish
 * @param storeId - 当前门店ID
 * @param year - 当前年份
 * @param month - 当前月份
 * @param status - 当前账单状态
 */
export const settlementFinishApi = (
  storeId: string,
  year: number,
  month: number,
  status: 'pending' | 'finished'
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/settlement/finish',
    data: { storeId, year, month, status }
  })
}
