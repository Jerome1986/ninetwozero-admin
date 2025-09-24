<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue'
import { Cellphone, Plus, Shop } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { managerOrderDataGet, platformTotalDataGet, storeDataGetApi } from '@/api/home'
import type { ManagerOrder, StatItem, StoreData } from '@/types/Home'
import { formatTimestamp } from '@/utils/formatTimestamp'
import { useRouter } from 'vue-router'

/**
 * 首页顶端统计卡片数据（仅结构演示）
 * - totalUsers: 合计用户数
 * - totalStores: 合计门店数
 * - totalRevenue: 总营业额（¥）
 * - totalProfit: 总收益（¥）
 */
const stats = ref<StatItem[]>([])
const statsGet = async () => {
  const res = await platformTotalDataGet()
  stats.value = res.data
}

/** 最近订单表格数据 */
const recentOrders = ref<ManagerOrder[]>([])
const recentOrderGet = async () => {
  const res = await managerOrderDataGet()
  recentOrders.value = res.data
}

/**
 * Top 门店示例数据：用于右侧列表与运营趋势柱形图
 * - name: 门店名称
 * - revenue: 门店营业额（¥）
 * - orders: 门店订单量（单）
 */
const topStores = ref<StoreData[]>([])
const topStoresGet = async () => {
  const res = await storeDataGetApi()
  topStores.value = res.data
  // 数据到达后刷新柱形图
  updateTrendChart()
}

/** 供柱形图使用的精简数据映射（仅保留 name 与 orders） */
const storeOrders = computed(() => topStores.value.map((s) => ({ name: s.name, orders: s.orders })))

/**
 * ECharts：运营趋势（基础柱形图）
 * - trendRef: 图表容器引用
 * - trendChart: 图表实例（在挂载时创建，卸载时销毁）
 * - xAxisData: X 轴为门店名称
 * - barData: 柱形数据为门店订单量
 */
const trendRef = ref<HTMLDivElement | null>(null)
let trendChart: echarts.ECharts | null = null
const xAxisData = computed(() => storeOrders.value.map((s) => s.name))
const barData = computed(() => storeOrders.value.map((s) => s.orders))

/** 初始化柱形图并设置基础 option */
const initTrendChart = () => {
  if (!trendRef.value) return
  trendChart = echarts.init(trendRef.value)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: xAxisData.value },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: barData.value,
        barMaxWidth: 30,
        itemStyle: { color: '#409EFF' }
      }
    ]
  })
}

/** 根据最新数据更新柱形图（不重新初始化） */
const updateTrendChart = () => {
  if (!trendChart) return
  trendChart.setOption({
    xAxis: { data: xAxisData.value },
    series: [{ type: 'bar', data: barData.value }]
  })
}

/** 窗口尺寸变化时自适应重绘 */
const handleResize = () => trendChart?.resize()

/** 组件挂载：初始化图表与绑定 resize 事件 */
onMounted(() => {
  initTrendChart()
  window.addEventListener('resize', handleResize)
  Promise.all([
    // 平台数据获取
    statsGet(),
    //   门店数据
    topStoresGet(),
    // 进货单数据
    recentOrderGet()
  ])
})

// 监听门店数据映射，数据变化后刷新图表
watch(storeOrders, () => updateTrendChart())

/** 组件卸载：移除事件并销毁图表实例，释放内存 */
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
})

/** 快捷操作按钮配置（仅结构，用于展示 UI） */
const quickActions = shallowRef([
  { label: '新增商品', icon: Plus },
  { label: '新增门店', icon: Shop },
  { label: '进货单处理', icon: Cellphone }
])
// 获取路由
const router = useRouter()
// 处理快捷跳转
const handleRouter = (val: string) => {
  switch (val) {
    case '新增商品':
      router.push('/product/mo')
      break
    case '新增门店':
      router.push('/store')
      break
    case '进货单处理':
      router.push('/order/managerOrder')
      break
    default:
      return '跳转错误'
  }
}
</script>

<template>
  <PageContainer title="首页概览">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col v-for="s in stats" :key="s.key" :xs="24" :sm="12" :md="12" :lg="6">
        <el-card shadow="never" class="stat-card">
          <div class="card-content">
            <div class="left">
              <div class="label">{{ s.label }}</div>
              <div class="value">
                <template v-if="s.key === 'users' || s.key === 'stores'">{{ s.value }}</template>
                <template v-else
                  >{{ Number(s.value).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}
                </template>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中间主体：左侧趋势+最近订单，右侧Top门店+快捷操作 -->
    <el-row :gutter="16" class="main-row">
      <el-col :xs="24" :md="16">
        <el-card shadow="never" class="block-card">
          <div class="block-title">运营趋势</div>
          <div ref="trendRef" class="chart"></div>
        </el-card>

        <el-card shadow="never" class="block-card">
          <div class="block-title">最近进货订单</div>
          <el-table :data="recentOrders" size="small" border style="width: 100%">
            <el-table-column label="订单号" prop="outTradeNo" min-width="120" align="center" />
            <el-table-column label="用户" prop="applicantName" width="100" align="center" />
            <el-table-column label="金额(¥)" width="110" align="center">
              <template #default="{ row }">{{ row.total.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag
                  :type="
                    row.state === '已完成' ? 'success' : row.state === '待取货' ? 'warning' : 'info'
                  "
                >
                  {{ row.state }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="时间" prop="creatAt" min-width="120" align="center">
              <template #default="{ row }">
                {{ formatTimestamp(row.creatAt, 2) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="8">
        <el-card shadow="never" class="block-card">
          <div class="block-title">Top 门店</div>
          <div class="store-list">
            <div v-for="s in topStores" :key="s.name" class="store-item">
              <div class="s-name">{{ s.name }}</div>
              <div class="s-meta">
                <span class="s-revenue">¥ {{ s.revenue.toLocaleString('zh-CN') }}</span>
                <span class="s-orders">{{ s.orders }} 单</span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="block-card">
          <div class="block-title">快捷操作</div>
          <div class="actions">
            <el-button
              v-for="a in quickActions"
              :key="a.label"
              class="action-btn"
              type="primary"
              plain
              @click="handleRouter(a.label)"
            >
              <el-icon>
                <component :is="a.icon" />
              </el-icon>
              <span>{{ a.label }}</span>
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<style scoped lang="scss">
.stats-row {
  margin-top: 4px;
}

.stat-card {
  position: relative;
  overflow: hidden;
  border: none;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background-color: $jel-brandColor;
  }
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 13px;
  color: #909399;
}

.value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 40px;
  height: 40px;
  color: $jel-brandColor;
}

.main-row {
  margin-top: 16px;
}

.block-card {
  border: none;
  margin-bottom: 16px;
}

.block-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  position: relative;
  padding-left: 10px;
}

.block-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 14px;
  background-color: $jel-brandColor;
  border-radius: 2px;
}

.chart {
  width: 100%;
  height: 320px;
}

.store-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.store-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.s-name {
  color: #303133;
}

.s-meta {
  display: flex;
  gap: 10px;
  color: #606266;
}

.s-revenue {
  color: $jel-brandColor;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-color: $jel-brandColor;
  color: $jel-brandColor;
}
</style>
