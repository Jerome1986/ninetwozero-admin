// 性别转换
export const formatGender = (gender: number) => {
  switch (gender) {
    case 1:
      return '男'
    case 2:
      return '女'
    default:
      return '未知'
  }
}

// 角色转换
export const formatRole = (role: string, vipLevel: number = 0): string => {
  const vipMap: Record<number, string> = {
    1: '基础会员',
    2: '高级会员',
    3: '至尊会员'
  }

  if (role === 'user') return '普通用户'
  if (role === 'vip') return vipMap[vipLevel] || '会员'
  if (role === 'manager') return '店长'
  if (role === 'admin') return '管理员'

  return '未知角色'
}

// 用户订单状态转换
export const formatOrderState = (state: string) => {
  switch (state) {
    case 'PENDING':
      return '待支付'
    case 'PAID':
      return '已支付'
    case 'CANCELLED':
      return '已取消'
    case 'REFUNDED':
      return '已退款'
    default:
      return '全部'
  }
}
