<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { GiftItems } from '@/types/GiftItems'
import { giftListAdminGetApi } from '@/api/gift'
import type { JelGiftChannel } from '@/types/components'
import GiftChannel from '@/views/giftPages/components/GiftChannel.vue'

// 加载
const loading = ref(false)
// 获取产品列表函数
const total = ref(0)
const giftList = ref<GiftItems[]>([])
const giftListGet = async (pageNum: number, pageSize: number) => {
  loading.value = true
  const res = await giftListAdminGetApi(pageNum, pageSize)
  console.log('礼品', res)
  giftList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 获取子组件
const dialog = ref<JelGiftChannel>()

// 分页
const params = ref({
  pageNum: 1,
  pageSize: 10
})

// 处理每页条数改变
const handleSizeChange = (val: number) => {
  params.value.pageSize = val
  // 重置到第 1 页，避免当前页超出最大页数后数据为空
  params.value.pageNum = 1
  // 重新获取数据
  giftListGet(params.value.pageNum, params.value.pageSize)
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  params.value.pageNum = val
  // 重新获取数据
  giftListGet(params.value.pageNum, params.value.pageSize)
}

// 添加
const onAddChannel = () => {
  dialog.value?.open({
    cover: '',
    name: '',
    dec: '',
    lookNum: 0,
    originalPrice: 0,
    currentPrice: 0,
    giftImages: [],
    parent_id: '',
    parent_name: ''
  })
}

// 编辑
const onEditChannel = (row: GiftItems) => {
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: GiftItems) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      // 删除逻辑
      if (row._id) {
        console.log('删除结果')
        // 重新获取数据

        ElMessage.success('删除成功')
      }
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
      ElMessage.error(err)
    })
}

// 处理子组件操作成功
const handleSuccess = () => {
  console.log('成功')
}

onMounted(() => {
  giftListGet(params.value.pageNum, params.value.pageSize)
})
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="礼品管理">
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加礼品</el-button>
    </template>

    <el-table :data="giftList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column
        label="礼品名称"
        align="center"
        prop="name"
        min-width="120"
      ></el-table-column>

      <el-table-column label="商品描述" align="center" prop="dec" min-width="200"></el-table-column>
      <el-table-column label="商品原价" align="center" prop="originalPrice" width="100">
        <template #default="{ row }">
          {{ Number(row.originalPrice).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="当前售价" align="center" prop="currentPrice" width="100">
        <template #default="{ row }">
          {{ Number(row.currentPrice).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="封面图" align="center" prop="cover" width="100">
        <template #default="{ row }">
          <img style="width: 50px; height: 50px; border-radius: 4px" :src="row.cover" alt="cover" />
        </template>
      </el-table-column>
      <el-table-column label="详情图" align="center" prop="proImages" min-width="200">
        <template #default="{ row }">
          <img
            style="width: 50px; height: 50px; border-radius: 4px"
            v-for="item in row.proImages"
            :key="item"
            :src="item"
            alt="detaillPic"
          />
        </template>
      </el-table-column>
      <el-table-column label="浏览量" align="center" prop="lookNum" width="100"></el-table-column>
      <el-table-column
        label="所属分类"
        align="center"
        prop="parent_name"
        width="80"
      ></el-table-column>
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
  <GiftChannel ref="dialog" @success="handleSuccess"></GiftChannel>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: $jel-font-title;
  cursor: pointer;
}

.item {
  padding: 4px 8px;
  width: fit-content;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.brandActiveItem {
  padding: 4px 8px;
  width: fit-content;
  border: 1px solid $jel-brandColor;
  border-radius: 8px;
}

.typeActiveItem {
  padding: 4px 8px;
  width: fit-content;
  border: 1px solid #f56c6c;
  border-radius: 8px;
}
</style>
