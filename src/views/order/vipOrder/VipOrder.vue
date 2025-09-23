<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { VipOrderItem } from '@/types/OrderItem'
import { vipOrderDeleteApi, vipOrderGetApi, vipOrderSearchApi } from '@/api/order.ts'
import { useUserStore } from '@/stores'
import { formatTimestamp } from '@/utils/formatTimestamp.ts'
import { formatOrderState } from '@/utils/mapping.ts'

// 定义store
const userStore = useUserStore()

// 加载
const loading = ref(true)
// 获取订单列表
const vipOrderList = ref<VipOrderItem[]>([])
const vipOrderListGet = async (token: string, pageNum: number, pageSize: number) => {
  loading.value = true
  const res = await vipOrderGetApi(token, pageNum, pageSize)
  console.log('订单', res)
  vipOrderList.value = res.data.list
  total.value = res.data.total
  loading.value = false
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
  vipOrderListGet(userStore.token, params.value.pageNum, params.value.pageSize)
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  params.value.pageNum = val
  // 重新获取数据
  vipOrderListGet(userStore.token, params.value.pageNum, params.value.pageSize)
}

// 删除
const onDelChannel = (row: VipOrderItem) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      if (row._id) {
        const delRes = await vipOrderDeleteApi(userStore.token, row._id)
        console.log('删除结果', delRes)
        await vipOrderListGet(userStore.token, params.value.pageNum, params.value.pageSize)
        ElMessage.success('删除成功')
      }
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
    })
}

// 处理搜索
const searchValue = ref('')
const searchMaterialGet = async () => {
  // 每次搜索，强制重置分页到第一页
  params.value.pageNum = 1

  const res = await vipOrderSearchApi(
    searchValue.value,
    params.value.pageNum,
    params.value.pageSize
  )
  console.log('搜索返回', res)
  vipOrderList.value = res.data.list
  total.value = res.data.total
}

onMounted(() => vipOrderListGet(userStore.token, params.value.pageNum, params.value.pageSize))
</script>

<template>
  <!-- 会员订单 -->
  <PageContainer title="会员订单">
    <div class="header">
      <div class="tips">
        提示：
        <p>会员订单和微信商户订单互通，不建议删除操作，以免财务不好对账</p>
      </div>
      <!--   搜索   -->
      <div class="right">
        <div class="search">
          <el-input
            v-model="searchValue"
            style="width: 240px; margin-right: 8px"
            placeholder="根据会员电话搜索会员订单"
            clearable
            @clear="vipOrderListGet(userStore.token, params.pageNum, params.pageSize)"
          />
          <el-button type="danger" @click="searchMaterialGet">查询</el-button>
        </div>
      </div>
    </div>
    <el-table :data="vipOrderList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column
        label="订单号"
        align="center"
        prop="orderNo"
        min-width="210"
      ></el-table-column>
      <el-table-column
        label="会员电话"
        align="center"
        prop="userMobile"
        width="160"
      ></el-table-column>
      <el-table-column label="会员等级" align="center" prop="vipLevel" width="80"></el-table-column>
      <el-table-column
        label="等级名称"
        align="center"
        prop="vipLevelText"
        min-width="120"
      ></el-table-column>
      <el-table-column label="金额(元)" align="center" prop="amount" width="100"></el-table-column>
      <el-table-column label="折扣" align="center" prop="discount" width="80"></el-table-column>
      <el-table-column
        label="赠送次数"
        align="center"
        prop="giftCount"
        width="80"
      ></el-table-column>
      <el-table-column label="有效期" align="center" prop="term" width="100"></el-table-column>
      <el-table-column label="订单状态" align="center" prop="status" width="120">
        <template #default="{ row }">
          {{ formatOrderState(row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt" min-width="160">
        <template #default="{ row }">
          {{ formatTimestamp(row.createdAt, 2) }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updatedAt" min-width="160">
        <template #default="{ row }">
          {{ row.updatedAt ? formatTimestamp(row.updatedAt, 2) : '无更新' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="{ row }">
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
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

    .tips {
      font-size: 14px;
      color: $jel-brandColor;
    }

    .right {
      display: flex;
      gap: 16px;
    }
  }
}
</style>
