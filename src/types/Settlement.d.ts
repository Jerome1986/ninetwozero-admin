export type SettlementItem = {
  /** 数据库id */
  _id: string
  /** 门店id */
  storeId: string
  /** 门店名 */
  storeName: string
  /** 店长名称 */
  managerName: string
  /** 门店电话 */
  storeMobile: string
  /** 门店订单数 */
  orderNum: number
  /** 门店营业额 */
  storeIncome: number
  /** 门店进货支出 */
  storeExpense: number
  /** 实际收益 = 营业额 -（营业额 * 平台佣金 + 营业额 * 一级佣金 + 营业额 * 二级佣金）- 进货支出  */
  realIncome: number
  /** 是否显示--便于计算实际收益，方便传row */
  isLook?: boolean
  /** 结算状态 */
  status?: 'pending' | 'finished'
  /** 创建时间 */
  createdAt?: Date
  /** 更新时间 */
  updatedAt?: Date
}

// 分页返回结果
export type SettlementPageResult = {
  list: SettlementItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/**
 * 查询该门店是否有上级返回类型
 */
export type CheckStoreParentResult = {
  /** 直属上级的门店id */
  firstStoreId: string | null
  /** 上级的上级的门店id */
  secondStoreId: string | null
}

/**
 * 佣金流水返回类型
 */

export type CommissionTask = {
  /** 佣金表唯一id标识 */
  _id: string
  /** 对应的交易订单号 */
  outTradeNo: string
  /** 发生交易的门店id */
  storeId: string
  /** 交易金额 */
  amount: number
  /** 对应产品描述 */
  description: string
  /** 佣金结算状态 */
  status: 'pending' | 'completed'
  /** 订单创建时间 */
  createdAt: Date
}

/**
 * 通用查询门店下级类型
 */
export type inviterStoreItem = {
  /** 一级门店列表 */
  firstStore: StoreItem[]
  /** 所有一级门店的流水 */
  firstFlow: CommissionTask[]
  /** 二级门店列表 */
  subStore: StoreItem[]
  /** 所有二级门店的流水 */
  subFlow: CommissionTask[]
}

/**
 * 根据条件筛选门店流水返回明细和总和
 */

export type filterFlow = {
  /** 筛选范围  */
  range: 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'month'
  /** 开始时间 */
  start: Date
  /** 结束时间 */
  end: Date
  /** 流水明细 */
  flowList: StoreOrderFlow[]
  /** 流水总和 */
  totalAmount: number
}

/**
 * 门店流水记录类型
 */
export type StoreOrderFlow = {
  /** MongoDB 主键ID */
  _id: string
  /** 门店ID */
  storeId: string
  /** 商户订单号，对应门店订单 */
  outTradeNo: string
  /** 微信支付交易号 */
  transactionId: string
  /** 收支类型：income = 收入, expense = 支出 */
  type: 'income' | 'expense'
  /** 金额，单位分，正数表示金额大小，方向由 type 决定 */
  amount: number
  /** 本次账单说明：贴膜等 */
  description: string
  /** 流水创建时间 */
  createdAt: Date
}

/**
 * 门店已结算订单返回类型
 */
export type StoreOrderFinished = {
  /** 店长姓名 */
  managerName: string

  /** 订单编号 */
  orderNum: number

  /** 订单状态 */
  status?: 'pending' | 'finished'

  /** 门店支出 */
  storeExpense: number

  /** 门店 ID */
  storeId: string

  /** 门店收入 */
  storeIncome: number

  /** 门店联系电话 */
  storeMobile: string

  /** 门店名称 */
  storeName: string

  /** 月份 */
  month: number

  /** 年份 */
  year: number
}
