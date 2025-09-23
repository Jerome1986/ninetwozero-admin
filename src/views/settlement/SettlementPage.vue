<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { settlementGetApi } from '@/api/settlement.ts'
import type { SettlementItem } from '@/types/Settlement'
import { ElMessage } from 'element-plus'
import { type MonthItem, monthList } from '@/views/settlement/config.ts'
import { totalRevenue } from '@/composables/settlement.ts'

// 加载
const loading = ref(true)
// 月份表激活下标
const monthActiveIndex = ref(new Date().getMonth())
// 当前所选择的月份
const currentMonth = ref(new Date().getMonth() + 1)
const currentYear = ref(new Date().getFullYear())
// 改变月份筛选
const handleChangeMonth = (monthItem: MonthItem, index: number) => {
  monthActiveIndex.value = index
  console.log(monthItem)
  currentMonth.value = monthItem.value
  settlementGet(params.value.pageNum, params.value.pageSize, currentYear.value, currentMonth.value)
}

// 获取订单列表
const settlementList = ref<SettlementItem[]>([])
const settlementGet = async (pageNum: number, pageSize: number, year: number, month: number) => {
  loading.value = true
  const res = await settlementGetApi(pageNum, pageSize, year, month)
  settlementList.value = res.data.list
  console.log(res.data.list)
  total.value = res.data.total
  loading.value = false
}

// 查看收益
const handleReal = async (row: SettlementItem) => {
  const res = await totalRevenue(row.storeId, currentYear.value, currentMonth.value)
  console.log('tasks', res)
  // 找到对应的 item
  const target = settlementList.value.find((item) => item.storeId === row.storeId)
  if (target) {
    target.realIncome = res
    target.isLook = true // 单独改这一行
  }
}

// 分页
const params = ref({
  pageNum: 1,
  pageSize: 10
})

// 总条数
const total = ref(0)

// 处理每页条数改变
const handleSizeChange = (val: number) => {
  params.value.pageSize = val
  // 重置到第 1 页，避免当前页超出最大页数后数据为空
  params.value.pageNum = 1
  // 重新获取数据
  settlementGet(params.value.pageNum, params.value.pageSize, currentYear.value, currentMonth.value)
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  params.value.pageNum = val
  // 重新获取数据
  settlementGet(params.value.pageNum, params.value.pageSize, currentYear.value, currentMonth.value)
}

// 处理结算
const submit = (row: SettlementItem) => {
  console.log('submit', row)
  ElMessage.success('结算成功')
}

onMounted(() => {
  settlementGet(params.value.pageNum, params.value.pageSize, currentYear.value, currentMonth.value)
})
</script>

<template>
  <!-- 会员订单 -->
  <PageContainer title="会员订单">
    <div class="header">
      <div class="month">
        <div
          class="monthItem"
          v-for="(item, index) in monthList"
          :key="item.value"
          :class="{ monthItemActive: monthActiveIndex === index }"
          @click="handleChangeMonth(item, index)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <el-table :data="settlementList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column
        label="门店名称"
        align="center"
        prop="storeName"
        min-width="120"
      ></el-table-column>
      <el-table-column
        label="店长名称"
        align="center"
        prop="managerName"
        min-width="120"
      ></el-table-column>
      <el-table-column
        label="门店电话"
        align="center"
        prop="storeMobile"
        min-width="120"
      ></el-table-column>
      <el-table-column label="订单数" align="center" prop="orderNum" width="120"></el-table-column>
      <el-table-column label="结算状态" align="center" prop="status" width="120"></el-table-column>
      <el-table-column label="营业额(元)" align="center" prop="storeIncome" min-width="80">
        <template #default="{ row }">
          {{ row.storeIncome?.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="进货支出(元)" align="center" prop="storeExpense" min-width="80">
        <template #default="{ row }">
          {{ row.storeExpense?.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="实际收益(元)" align="center" prop="realIncome" min-width="80">
        <template #default="{ row }">
          <span v-if="!row.isLook">***</span>
          <span v-else>{{ row.realIncome }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="120">
        <template #default="{ row }">
          <el-button type="primary" @click="handleReal(row)" v-if="!row.isLook">查看</el-button>
          <el-button type="success" @click="row.isLook = false" v-else>隐藏</el-button>
          <el-button type="danger" @click="submit(row)">结算</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 页码 -->
    <div style="margin-top: 20px">
      <el-pagination
        style="margin-top: 20px; justify-content: flex-end"
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[1, 10, 30, 50, 100]"
        layout="jumper,total, sizes, prev, pager, next "
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </PageContainer>
</template>

<style scoped lang="scss">
.page-container {
  .header {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    color: $jel-font-title;

    .month {
      display: flex;
      align-items: center;
      gap: 16px;

      .monthItem {
        padding: 4px 8px;
        font-size: 14px;
        background-color: $jel-font-dec;
        color: #ffffff;
        border-radius: 4px;
        cursor: pointer;
      }

      .monthItemActive {
        background-color: $jel-brandColor;
      }
    }
  }
}
</style>
