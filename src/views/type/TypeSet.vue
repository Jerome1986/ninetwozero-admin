<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { cateDeleteApi } from '@/api/cate.ts'
import type { CateItem } from '@/types/CateItem'
import CateChannel from '@/views/type/components/CateChannel.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { JelCateChannel } from '@/types/components'
import { useCateStore } from '@/stores/modules/cate'

// 定义store
const cateStore = useCateStore()
// 获取子组件
const dialog = ref<JelCateChannel>()
// 加载
const loading = ref(true)

// 添加
const onAddChannel = (row: CateItem) => {
  console.log('onAddChannel', row)
  dialog.value.open({})
}

// 编辑
const onEditChannel = (row: CateItem) => {
  console.log('onEditChannel', row)
  dialog.value.open(row)
}

// 删除
const onDelChannel = (row: CateItem) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      const res = await cateDeleteApi(row._id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await cateStore.cateListGet()
      }
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
    })
}

// 处理子组件操作成功
const handleSuccess = () => {
  cateStore.cateListGet()
}

onMounted(() => cateStore.cateListGet())
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="类型设置">
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加类型</el-button>
    </template>
    <el-table :data="cateStore.cateList" style="width: 100%" v-loading="cateStore.loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="分类名称" align="center" prop="name"></el-table-column>
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
  <CateChannel ref="dialog" @success="handleSuccess"></CateChannel>
</template>

<style scoped lang="scss"></style>
