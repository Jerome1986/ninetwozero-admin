<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { vipProductDeleteApi, vipProductGet } from '@/api/product.ts'
import type { VipProductItem } from '@/types/VipProduct'
import type { JelVipProductChannel } from '@/types/components'
import VipProductChannel from '@/views/vipProduct/components/VipProductChannel.vue'
// 获取子组件
const dialog = ref<JelVipProductChannel>()
// 加载
const loading = ref(false)
// 获取分类
const vipProList = ref<VipProductItem[]>([])
const vipProListGet = async () => {
  loading.value = true
  const res = await vipProductGet()
  vipProList.value = res.data
  console.log('获取结果', res)
  loading.value = false
}

// 添加
const onAddChannel = (row: VipProductItem) => {
  console.log('onAddChannel', row)
  dialog.value?.open({})
}

// 编辑
const onEditChannel = (row: VipProductItem) => {
  console.log('onEditChannel', row)
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: VipProductItem) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      const delRes = await vipProductDeleteApi(row._id)
      console.log('删除成功', delRes)
      await vipProListGet()
      ElMessage.success('删除成功')
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
    })
}

// 处理子组件操作成功
const handleSuccess = () => {
  console.log('成功')
  vipProListGet()
}

onMounted(() => vipProListGet())
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="会员产品">
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加产品</el-button>
    </template>
    <el-table :data="vipProList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="会员等级" align="center" prop="level"></el-table-column>
      <el-table-column label="会员说明" align="center" prop="levelText"></el-table-column>
      <el-table-column label="折扣" align="center" prop="discount"></el-table-column>
      <el-table-column label="价格" align="center" prop="price">
        <template #default="{ row }">
          {{ Number(row.price).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="赠送次数" align="center" prop="gift"></el-table-column>
      <el-table-column label="有效期" align="center" prop="term"></el-table-column>
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
  </PageContainer>
  <!-- 弹窗 -->
  <VipProductChannel ref="dialog" @success="handleSuccess"></VipProductChannel>
</template>

<style scoped lang="scss"></style>
