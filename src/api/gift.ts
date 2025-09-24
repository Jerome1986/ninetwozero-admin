import { request } from '@/utils/request'
import type { GiftItemPageResult } from '@/types/GiftItems'

/**
 * 管理员获取礼品列表
 * /gift/adminGet
 * @param pageNum - 页码
 * @param pageSize - 每页条数
 * @returns
 */
export const giftListAdminGetApi = (pageNum: number, pageSize: number) => {
  return request<GiftItemPageResult>({
    method: 'GET',
    url: '/gift/adminGet',
    params: { pageNum, pageSize }
  })
}
