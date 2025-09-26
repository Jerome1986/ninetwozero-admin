// 分类类型
export type CateItem = {
  /** 唯一标识 */
  _id: string
  /** 分类名称 */
  name: string
  /** 排序 */
  sort?: number
}

// 手机品牌类型
export type PhoneBrand = {
  /** mongoDb的唯一id */
  _id?: string
  /** 品牌名称 */
  name: string
  /** 所属分类的id */
  parent_id: string
  /** 所属分类的名称 */
  parent_name: string
}

// 品牌带分页类型
export type PagesBrandResult = {
  /** 品牌列表 */
  list: PhoneBrand[]
  /** 总数据条数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 总页数 */
  total_page: number
}

/**
 * 手机品牌型号类型
 */

export type phoneTypeItem = {
  /** 唯一标识 */
  _id?: string
  /** 封面图 */
  cover: string
  /**手机品牌名称 */
  name: string
  /**所属手机品牌的id */
  parent_id: string
  /** 所属手机品牌的id */
  parent_name: string
}

// 手机型号带分页类型
export type PageModelResult = {
  /** 手机型号列表 */
  list: phoneTypeItem[]
  /** 总数据条数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 总页数 */
  total_page: number
}

// 手机膜类型
export type ProductItem = {
  /** 商品ID（MongoDB 自动生成的唯一标识） */
  _id?: string
  /** 商品名称 */
  name: string
  /** 商品货号-非唯一 */
  skuNo?: string
  /** 商品描述（简要说明） */
  dec: string
  /** 商品原价（未打折前价格，单位：元） */
  originalPrice: number
  /** 当前售价（促销/实际出售价格，单位：元） */
  currentPrice: number
  /** 商品封面图 URL */
  cover: string
  /** 商品详情图片 URL 数组 */
  proImages: string[]
  /** 浏览量（用于排序和热度统计） */
  lookNum: number
  /** 型号 (例如 16max / mate60 pro) */
  modelId: string
  /** 品牌 (例如 iPhone / 华为) */
  brandId: string
  /** 品牌名 */
  brand: string
  /** 型号名 */
  model: string
  /** sku */
  skuList: SkuItem[]
}

// 手机膜带分页类型
export type PageProductResult = {
  /** 手机型号列表 */
  list: ProductItem[]
  /** 总数据条数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 总页数 */
  total_page: number
}

// 手机膜sku类型
export type SkuItem = {
  /** SKU名称 */
  name: string
  /** 封面 */
  cover: string
  /** 当前SKU对应的价格 */
  price: number
  /** 库存 */
  stock: number
}

// 手机膜搜索返回类型
export type ProductSearchResult = {
  list: ProductItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
