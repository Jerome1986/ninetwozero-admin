/** 礼品数据类型 */
export type GiftItems = {
  /** mongodb唯一标识 */
  _id?: string
  /** 封面图 */
  cover: string
  /** 礼品名称 */
  name: string
  /** 礼品描述 */
  dec: string
  /** 阅读量 */
  lookNum: number
  /** 原价 */
  originalPrice: number
  /** 当前售价 */
  currentPrice: number
  /** 详情图 */
  giftImages?: string[]
  /** 所属父级ID */
  parent_id: string
  /** 所属父级名称 */
  parent_name: string
  /** 创建时间 */
  createdAt?: Date
  /** 更新时间 */
  updatedAt?: Date
}

/** 礼品类型带分页 */
export type GiftItemPageResult = {
  list: GiftItems[]
  total: number
  pageNum: number
  pageSize: number
  totalPages: number
}
