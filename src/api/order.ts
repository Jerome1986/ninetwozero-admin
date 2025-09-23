import { request } from '@/utils/request.ts'
import type { SearchManagerOrderPageResult, VipOrderPageResult } from '@/types/OrderItem'
import type { managerOrderPageResult } from '@/types/ManagerCartItem'
import type { delResult, updateResult } from '@/types/Gobal'

/**
 * 管理员获取所有会员订单
 * /vipOrder/adminGet
 * @param token - 管理员凭证
 * @param pageNum - 页码
 * @param pageSize - 每页条数
 */
export const vipOrderGetApi = (token: string, pageNum: number, pageSize: number) => {
  return request<VipOrderPageResult>({
    url: '/vipOrder/adminGet',
    method: 'GET',
    params: { pageNum, pageSize }
  })
}

/**
 * 管理员根据订单id删除会员订单
 * /vipOrder/adminDel
 * @param token - 管理员凭证
 * @param vipOrderId - 会员订单id
 */
export const vipOrderDeleteApi = (token: string, vipOrderId: string) => {
  return request({
    url: '/vipOrder/adminDel',
    method: 'POST',
    headers: {
      Authorization: 'Bearer' + token
    },
    data: { vipOrderId }
  })
}

/**
 * 管理员根据用户电话搜索会员订单
 * /vipOrder/search
 * @param userMobile - 用户电话
 * @param pageNum - 页码
 * @param pageSize - 每页条数
 */
export const vipOrderSearchApi = (userMobile: string, pageNum = 1, pageSize = 10) => {
  return request<VipOrderPageResult>({
    url: '/vipOrder/search',
    method: 'POST',
    data: { userMobile, pageNum, pageSize }
  })
}

// -------------------  店长 -------------------

/**
 * 管理员获取店长订单
 * /managerOrder/adminGet
 * @param token - 管理员凭证
 * @param pageNum - 页码
 * @param pageSize - 每页条数
 */
export const managerOrderGetApi = (token: string, pageNum: number, pageSize: number) => {
  return request<managerOrderPageResult>({
    method: 'GET',
    url: '/managerOrder/adminGet',
    headers: {
      Authorization: 'Bearer' + token
    },
    params: { pageNum, pageSize }
  })
}

/**
 * 管理员备货完成更新订单状态为发货
 * /managerOrder/updateShipping
 * @param orderId - 更新订单的ID
 */
export const managerOrderShippingApi = (orderId: string) => {
  return request<updateResult>({
    method: 'POST',
    url: '/managerOrder/updateShipping',
    data: { orderId }
  })
}

/**
 * 管理员更新店长订单信息
 * /managerOrder/updateOrderInfo
 * @param orderId - 订单ID
 * @param state - 订单状态
 * @param total - 订单总价
 */
export const managerOrderInfoUpdateApi = (orderId: string, state: string, total: number) => {
  return request<updateResult>({
    method: 'POST',
    url: '/managerOrder/updateOrderInfo',
    data: { orderId, state, total }
  })
}

/**
 * 管理员删除订单
 * /managerOrder/adminDel
 * @param orderId - 订单ID
 */
export const managerOrderDelApi = (orderId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/managerOrder/adminDel',
    data: { orderId }
  })
}

/**
 * 根据订单电话搜索订单
 * /managerOrder/search
 * @param storeMobile - 门店电话
 * @param pageNum - 当前页
 * @param pageSize - 每页条数
 */
export const managerOrderSearchApi = (storeMobile: string, pageNum: number, pageSize: number) => {
  return request<SearchManagerOrderPageResult>({
    method: 'POST',
    url: '/managerOrder/search',
    data: { storeMobile, pageNum, pageSize }
  })
}
