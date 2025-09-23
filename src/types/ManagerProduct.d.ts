// 商品信息接口
export type ProductItem = {
  /** 商品ID（MongoDB 自动生成的唯一标识） */
  _id: string
  /** 商品名称 */
  name: string
  /** 商品货号 */
  skuNo: string
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
  /** 文件属性 */
  skuFileList?: SkuFileItem[]
}

// 后端上传时的sku文件类型
export type SkuFileItem = {
  /** 文件名 */
  name: string
  /** 文件上传状态 */
  status: string
  /** 文件id */
  uid: string
  /** 文件路径 */
  url: string
}
