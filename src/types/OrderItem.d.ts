/**
 * vip订单数据类型
 */
import type { ShoppingCart } from '@/types/ManagerCartItem'

export type VipOrderItem = {
  /** vip订单数据库id-唯一标识*/
  _id?: string
  /** 自己平台的订单号 */
  orderNo: string
  /** 订单唯一标识（可用后端生成，格式可自定义，如 WX + 时间戳 + 随机数）*/
  out_trade_no?: string
  /** 用户唯一标识（购买该会员的用户） */
  userId: string
  /** 用户电话 */
  userMobile: string
  /** 购买的会员等级 ID，对应 VipItem._id */
  vipId: string
  /** 会员等级 */
  vipLevel: number
  /** 购买的会员等级名称，用于前端展示 */
  vipLevelText: string
  /** 支付金额（单位：元，等于 VipItem.price） */
  amount: number
  /** 会员折扣（取自 VipItem.discount） */
  discount: number
  /** 赠送的贴膜次数（取自 VipItem.gift） */
  giftCount: number
  /** 会员有效期（取自 VipItem.term，用于说明会员期限） */
  term: string
  /** 会员有效期（支付成功后-会员的到期时间） */
  expirationTime?: string
  /** 订单状态 */
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'
  /** 微信支付返回的 prepay_id，用于前端调起支付 */
  prepayId?: string
  /** 微信支付交易号，支付成功后回填 */
  transactionId?: string
  /** 支付时间（ISO 8601 格式），支付成功后回填 */
  paidAt?: string
  /** 创建订单时间（ISO 8601 格式） */
  createdAt: string
  /** 更新时间（ISO 8601 格式，用于记录订单状态更新） */
  updatedAt: string
}

/**
 * vip订单带分页返回类型 (搜索返回通用)
 */

export type VipOrderPageResult = {
  /** vip订单类型 */
  list: VipOrderItem[]
  /** 总数据条数 */
  total: number
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 总页数 */
  total_page: number
}

/**
 * 店长订单类型
 */

export type ManagerOrderItem = {
  /** 订单列表id */
  _id?: string
  /** 订单编号 */
  outTradeNo?: string
  /** 门店id */
  storeId?: string
  /** 店长id */
  managerId?: string
  /**  已选择的商品 */
  product: ShoppingCart
  /**  总价或总数，看你的业务逻辑 */
  total: number
  /**  订单联系人信息 */
  applicant: Applicant
  /** 订单状态  -- 备货中  待取货  已完成  已取消  */
  state?: '备货中' | '待取货' | '已完成' | '已取消'
  /** 下单时间 */
  creatAt?: Date
  /** 更新时间 */
  updateAt?: Date
}

/**
 * 联系人信息
 */
export type Applicant = {
  /** 下单人姓名 */
  name?: string
  /** 下单人所归属门店 */
  shop?: string
  /** 下单人电话 */
  mobile?: string
}

/**
 * 搜索带分页返回订单类型
 */
export type SearchManagerOrderPageResult = {
  /** 返回的订单列表 */
  list: ManagerOrderItem[]
  /** 总条数 */
  total: number
  /** 当前页码 */
  pageNum: number
  /** 当前页条数 */
  pageSize: number
  /** 总页数 */
  total_page: number
}
