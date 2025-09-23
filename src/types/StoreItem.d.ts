// 门店表类型
export type StoreItem = {
  /** 门店ID */
  _id?: string
  /**  门店短id--用于生成收款码 */
  storeId?: string
  /** 当前门店logo */
  storeLogo: string
  /** 门店名称 */
  name: string
  /** 门店地址 */
  address: string
  /** 当前门店收款码 */
  qrCodeUrl: string
  /** 门店店长ID（收款负责人） */
  managerId?: string
  /** 店长姓名*/
  managerName: string
  /** 上级门店ID，可选，用于管理层级关系 */
  parentStoreId?: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 可拓展字段，比如门店电话、营业状态等 */
  phone: string
  /** 门店状态 */
  status?: 'active' | 'inactive'
}

// 带页码类型
export type pagesStoreResult = {
  /** 用户列表 */
  list: StoreItem[]
  /** 总数 */
  total: number
  /** 当前页 */
  num: number
  /** 每页条数 */
  size: number
}
