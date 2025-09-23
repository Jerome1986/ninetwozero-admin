// 首页--平台统计类型
export type StatItem = {
  key: 'users' | 'stores' | 'revenue' | 'profit'
  label: string
  value: number
}

// 首页--门店统计类型
export type StoreData = {
  /** 门店名 */
  name: string
  /** 门店营业额 */
  revenue: number
  /** 门店订单数 */
  orders: number
}

// 首页--店长进货订单类型
export type ManagerOrder = {
  /** 订单号 */
  outTradeNo: string
  /** 申请人名字 */
  applicantName: string
  /** 订单金额或数量 */
  total: number
  /** 订单状态，例如 "已完成" */
  state: '备货中' | '待取货' | '已完成' | '已取消'
  /** 创建时间（ISO 时间字符串） */
  creatAt: string
}
