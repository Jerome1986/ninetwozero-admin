<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ManagerOrderItem } from '@/types/OrderItem'
import { useUserStore } from '@/stores'
import { formatTimestamp } from '@/utils/formatTimestamp.ts'
import {
  managerOrderDelApi,
  managerOrderGetApi,
  managerOrderSearchApi,
  managerOrderShippingApi
} from '@/api/order.ts'
import ManagerChannel from '@/views/order/managerOrder/components/ManagerChannel.vue'
import ProductDetailChannel from '@/views/order/managerOrder/components/ProductDetailChannel.vue'

// 定义组件
const dialog = ref()

// 定义store
const userStore = useUserStore()

// 加载
const loading = ref(false)
// 获取订单列表
const managerOrderList = ref<ManagerOrderItem[]>([])
const managerOrderListGet = async (token: string, pageNum: number, pageSize: number) => {
  loading.value = true
  const res = await managerOrderGetApi(token, pageNum, pageSize)
  console.log('店长订单', res)
  managerOrderList.value = res.data.list
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
  managerOrderListGet(userStore.token, params.value.pageNum, params.value.pageSize)
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  params.value.pageNum = val
  // 重新获取数据
  managerOrderListGet(userStore.token, params.value.pageNum, params.value.pageSize)
}

// 编辑用户信息
const onEditChannel = (row: ManagerOrderItem) => {
  console.log('onEditChannel', row)
  dialog.value?.open(row)
}

// 处理子组件提交成功后刷新
const handleSuccess = () => {
  console.log('onSuccess')
  managerOrderListGet(userStore.token, params.value.pageNum, params.value.pageSize)
}

// 右侧弹框
const drawer = ref(false)
// 查看订单里的商品，并发货
const currentRow = ref<ManagerOrderItem | null>(null)
const handleDetail = (row: ManagerOrderItem) => {
  console.log('onDetail', row.product)
  currentRow.value = row
  drawer.value = true
}

// 处理子组件的发货
const handleShipping = async (orderId: string) => {
  console.log('handleShipping', orderId)
  const res = await managerOrderShippingApi(orderId)
  console.log('res', res)
  if (res.code === 200) ElMessage.success(res.message)
  // 重置页码并重新获取数据,关闭弹窗
  params.value.pageNum = 1
  await managerOrderListGet(userStore.token, params.value.pageNum, params.value.pageSize)
  drawer.value = false
}

// 删除
const onDelChannel = (row: ManagerOrderItem) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      if (row._id) {
        //  处理删除
        const delRes = await managerOrderDelApi(row._id)
        console.log('删除结果', delRes)
        ElMessage.success('删除成功')
        await managerOrderListGet(userStore.token, params.value.pageNum, params.value.pageSize)
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

  // todo 处理店长订单搜索
  const searchRes = await managerOrderSearchApi(
    searchValue.value,
    params.value.pageNum,
    params.value.pageSize
  )
  managerOrderList.value = searchRes.data.list
  console.log('搜索返回', searchRes)
}

onMounted(() => managerOrderListGet(userStore.token, params.value.pageNum, params.value.pageSize))
</script>

<template>
  <!-- 会员订单 -->
  <PageContainer title="店长订单">
    <div class="header">
      <div class="tips">
        提示：
        <p>订单金额请勿随意修改，以免成本、佣金出现误差</p>
      </div>
      <!--   搜索   -->
      <div class="right">
        <div class="search">
          <el-input
            v-model="searchValue"
            style="width: 240px; margin-right: 8px"
            placeholder="根据店长电话搜索店长订单"
            clearable
            @clear="managerOrderListGet(userStore.token, params.pageNum, params.pageSize)"
          />
          <el-button type="danger" @click="searchMaterialGet">查询</el-button>
        </div>
      </div>
    </div>
    <el-table :data="managerOrderList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column
        label="订单号"
        align="center"
        prop="outTradeNo"
        min-width="120"
      ></el-table-column>
      <el-table-column label="门店ID" align="center" prop="storeId" width="120"></el-table-column>
      <el-table-column label="订单商品" align="center" prop="product" min-width="80">
        <template #default="{ row }">
          <div style="color: #d62731; cursor: pointer" @click="handleDetail(row)">查看详情</div>
        </template>
      </el-table-column>
      <el-table-column label="下单人" align="center" prop="applicant" width="80">
        <template #default="{ row }">
          {{ row.applicant.name }}
        </template>
      </el-table-column>
      <el-table-column label="下单门店" align="center" prop="applicant" width="160">
        <template #default="{ row }">
          {{ row.applicant.shop }}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="applicant" width="120">
        <template #default="{ row }">
          {{ row.applicant.mobile }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单总额"
        sortable
        align="center"
        prop="total"
        width="120"
      ></el-table-column>
      <el-table-column label="订单状态" align="center" prop="state" width="120"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="creatAt" min-width="120">
        <template #default="{ row }">
          {{ formatTimestamp(row.creatAt, 2) }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" sortable align="center" prop="updateAt" min-width="120">
        <template #default="{ row }">
          {{ formatTimestamp(row.updateAt, 2) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="160">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
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
  <!-- 弹窗 -->
  <ManagerChannel ref="dialog" @success="handleSuccess"></ManagerChannel>
  <!-- 右侧弹框 -->
  <el-drawer v-model="drawer" title="订单商品明细" :with-header="true" size="40%">
    <ProductDetailChannel
      :current-row="currentRow"
      @shipping="handleShipping"
    ></ProductDetailChannel>
  </el-drawer>
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
