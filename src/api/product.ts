import { request } from '@/utils/request.ts'
import type { PageProductResult, ProductItem } from '@/types/CateItem'
import type { addResult, delResult, updateResult } from '@/types/Gobal'
import type { VipProductItem } from '@/types/VipProduct'

/**
 * 管理员根据品牌和型号获取手机膜
 * /product/adminGet
 * @param brandId - 手机品牌id
 * @param typeId - 手机型号id
 * @param pageNum - 页码
 * @param pageSize - 每页条数
 */
export const productsGetApi = (
  brandId?: string,
  typeId?: string,
  pageNum?: number,
  pageSize?: number
) => {
  return request<PageProductResult>({
    method: 'GET',
    url: '/product/adminGet',
    params: { brandId, typeId, pageNum, pageSize }
  })
}

/**
 * 管理员新增商品
 * /product/add
 * @param product - 手机膜商品类型 不带_id
 */
export const productsAddApi = (product: ProductItem) => {
  return request<addResult>({
    method: 'POST',
    url: '/product/add',
    data: { product }
  })
}

/**
 * 管理员根据商品id更新商品信息
 * /product/update
 * @param updateData - 手机膜商品类型 带_id
 */
export const productsUpdateApi = (updateData: ProductItem) => {
  return request<updateResult>({
    method: 'POST',
    url: '/product/update',
    data: { updateData }
  })
}

/**
 * 管理员删除指定商品
 * /product/adminDel
 * @param productId - 商品id
 */
export const productsDeleteApi = (productId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/product/adminDel',
    data: { productId }
  })
}

/**
 * 管理员获取vip产品
 * /vip/get
 */
export const vipProductGet = () => {
  return request<VipProductItem[]>({
    method: 'GET',
    url: '/vip/get'
  })
}

/**
 * 管理员添加会产产品
 * /vip/add
 * @param level - 会员等级
 * @param levelText - 会员等级说明
 * @param discount - 折扣
 * @param price - 价格
 * @param gift - 赠送贴膜的次数
 * @param term - 有效期
 */
export const vipProductAddApi = (
  level: number,
  levelText: string,
  discount: number,
  price: number,
  gift: number,
  term: string
) => {
  return request({
    method: 'POST',
    url: '/vip/add',
    data: { level, levelText, discount, price, gift, term }
  })
}

/**
 * 管理员根据id更新会员产品
 * /vip/adminUpdate
 * @param vipProId - 会员产品id
 * @param level - 会员等级
 * @param levelText - 会员等级说明
 * @param discount - 折扣
 * @param price - 会员价格
 * @param gift - 赠送的贴膜次数
 * @param term - 会员期限
 */
export const vipProductUpdateApi = (
  vipProId: string,
  level: number,
  levelText: string,
  discount: number,
  price: number,
  gift: number,
  term: string
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/vip/adminUpdate',
    data: { vipProId, level, levelText, discount, price, gift, term }
  })
}

/**
 * 管理员根据ID删除会员产品
 * /vip/adminDel
 * @param vipProId - 会员产品ID
 */
export const vipProductDeleteApi = (vipProId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/vip/adminDel',
    data: { vipProId }
  })
}
