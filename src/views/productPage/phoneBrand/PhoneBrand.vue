<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { PhoneBrand } from '@/types/CateItem'
import { ElMessage, ElMessageBox } from 'element-plus'
import { phoneBrandDeleteApi } from '@/api/cate.ts'
import BrandChannel from '@/views/productPage/phoneBrand/conponents/BrandChannel.vue'
import type { JelBrandChannel } from '@/types/components'
import { usePhoneBrandStore } from '@/stores/modules/phoneBrand.ts'

// 定义store
const phoneStore = usePhoneBrandStore()

// 获取子组件
const dialog = ref<JelBrandChannel>()

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
  phoneStore.brandListGet(params.value.pageNum, params.value.pageSize)
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  params.value.pageNum = val
  // 重新获取数据
  phoneStore.brandListGet(params.value.pageNum, params.value.pageSize)
}

// 添加
const onAddChannel = () => {
  dialog.value?.open({
    name: '',
    parent_id: '',
    parent_name: ''
  })
}

// 编辑
const onEditChannel = (row: PhoneBrand) => {
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: PhoneBrand) => {
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
        const delRes = await phoneBrandDeleteApi(row._id)
        console.log('删除结果', delRes)
        // 重新获取数据
        await phoneStore.brandListGet()
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
  // 操作成功后重新获取数据
  phoneStore.brandListGet()
}

onMounted(() => phoneStore.brandListGet())
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="品牌设置">
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加品牌</el-button>
    </template>
    <el-table :data="phoneStore.brandList" style="width: 100%" v-loading="phoneStore.loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="品牌名称" align="center" prop="name"></el-table-column>
      <el-table-column label="所属分类" align="center" prop="parent_name"></el-table-column>
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
        :total="phoneStore.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </PageContainer>
  <!-- 弹窗 -->
  <BrandChannel ref="dialog" @success="handleSuccess"></BrandChannel>
</template>

<style scoped lang="scss"></style>
