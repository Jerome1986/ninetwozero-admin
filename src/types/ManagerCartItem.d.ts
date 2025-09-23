import type { ManagerOrderItem } from '@/types/OrderItem'

/** 单个商品 */
export type CartItem = {
  /** 商品唯一ID */
  id: string
  /** 是否选中 */
  selected: boolean
  /** 商品图片 */
  imageUrl: string
  /** 商品名称 */
  name: string
  /** 商品描述 */
  description: string
  /** 单价 */
  unitPrice: number
  /** 数量 */
  quantity: number
  /** sku */
  selectSku: SkuItem
}

/** 型号购物车 */
export type ModelCart = {
  /** 型号 (例如 16max / mate60 pro) */
  model: string
  /** 该型号下的商品 */
  items: CartItem[]
}

/** 品牌购物车 */
export type BrandCart = {
  /** 品牌 (例如 iPhone / 华为) */
  brand: string
  /** 该品牌下的所有型号 */
  models: ModelCart[]
}

/** 整体购物车 */
export type ShoppingCart = BrandCart[]

export type managerOrderPageResult = {
  list: ManagerOrderItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
