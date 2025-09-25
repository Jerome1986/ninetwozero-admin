import { request } from '@/utils/request'
import type { GiftItemPageResult } from '@/types/GiftItems'
import type { addResult, delResult, updateResult } from '@/types/Gobal'

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

/**
 * 添加礼品
 * /gift/add
 * @param cover - 封面图
 * @param name - 礼品名称
 * @param dec - 备注描述
 * @param lookNum - 阅读量
 * @param originalPrice - 原价
 * @param currentPrice - 当前售价
 * @param giftImages - 详情图
 * @param parent_id - 父级ID
 * @param parent_name - 父级名称
 */
export const giftListAddApi = (
  cover: string,
  name: string,
  dec: string,
  lookNum: number,
  originalPrice: number,
  currentPrice: number,
  giftImages: string[],
  parent_id: string,
  parent_name: string
) => {
  return request<addResult>({
    method: 'POST',
    url: '/gift/add',
    data: {
      cover,
      name,
      dec,
      lookNum,
      originalPrice,
      currentPrice,
      giftImages,
      parent_id,
      parent_name
    }
  })
}

/**
 * 更新礼品信息
 * /gift/update
 * @param giftId - 礼品ID
 * @param cover - 封面图
 * @param name - 礼品名称
 * @param dec - 礼品描述
 * @param lookNum - 阅读量
 * @param originalPrice - 原价
 * @param currentPrice - 当前售价
 * @param giftImages - 详情图
 * @param parent_id - 父级ID
 * @param parent_name - 父级名称
 */
export const giftListUpdateApi = (
  giftId: string,
  cover: string,
  name: string,
  dec: string,
  lookNum: number,
  originalPrice: number,
  currentPrice: number,
  giftImages: string[],
  parent_id: string,
  parent_name: string
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/gift/update',
    data: {
      giftId,
      cover,
      name,
      dec,
      lookNum,
      originalPrice,
      currentPrice,
      giftImages,
      parent_id,
      parent_name
    }
  })
}

/**
 * 删除礼品
 * /gift/del
 * @param giftId - 礼品ID
 */
export const giftListDeleteApi = (giftId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/gift/del',
    data: { giftId }
  })
}
