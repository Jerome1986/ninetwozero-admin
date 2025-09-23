import { useCommissionStore } from '@/stores'
import { computed, ref } from 'vue'
import type { StoreOrderFlow } from '@/types/Settlement'
import { checkParentStoreApi, filterFlowApi } from '@/api/settlement.ts'

// 定义store
const commissionStore = useCommissionStore()

// 流水列表
const flowList = ref<StoreOrderFlow[]>([])
const incomeFLow = ref<StoreOrderFlow[]>([])
const expenseFlow = ref<StoreOrderFlow[]>([])

// 收入总和和支出总和
const incomeTotal = computed(() => {
  return incomeFLow.value.reduce((sum, item) => sum + item.amount, 0)
})
const expenseTotal = computed(() => {
  return expenseFlow.value.reduce((sum, item) => sum + item.amount, 0)
})

// 根据条件筛选门店流水
const flowTotal = ref<number>(0)
const filterFlow = async (storeId: string, range: string, year?: number, month?: number) => {
  const res = await filterFlowApi(storeId, range, year, month)
  console.log('筛选结果', res)
  flowList.value = res.data.flowList
  flowTotal.value = res.data.totalAmount
  console.log('收入合计', flowTotal.value)
  incomeFLow.value = flowList.value.filter((flow) => flow.type === 'income')
  expenseFlow.value = flowList.value.filter((flow) => flow.type === 'expense')
}

// 查询当前门店是否有上级，用于计算门店实际收益
const firstStoreId = ref<string | null>(null)
const secondStoreId = ref<string | null>(null)

const checkParent = async (storeId: string) => {
  const res = await checkParentStoreApi(storeId)
  console.log('checkParent', res)
  firstStoreId.value = res.data.firstStoreId
  secondStoreId.value = res.data.secondStoreId
}

// 计算总收益
export const totalRevenue = async (storeId: string, year: number, month: number) => {
  console.log('参数', storeId, year, month)
  await filterFlow(storeId, 'month', year, month)
  await checkParent(storeId)
  await commissionStore.commissionGet()
  const income = incomeTotal.value
  const expense = expenseTotal.value

  console.log('佣金', commissionStore.commission.platformRate)
  const platformRate = commissionStore.commission.platformRate ?? 0
  const level1Rate = commissionStore.commission.level1Rate ?? 0
  const level2Rate = commissionStore.commission.level2Rate ?? 0

  if (income <= 0) return 0

  // 平台佣金
  const platformFee = income * platformRate

  // 上下级佣金
  let upstreamFee = 0
  if (firstStoreId.value) upstreamFee += income * level1Rate
  if (secondStoreId.value) upstreamFee += income * level2Rate

  // 总收益
  const net = income - platformFee - upstreamFee - expense
  console.log('总收益', net)
  // 保留两位小数
  return Math.round(net * 100) / 100
}
