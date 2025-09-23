<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { PhoneBrand } from '@/types/CateItem'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { JelBrandChannel } from '@/types/components'
import { usePhoneBrandStore, usePhoneTypeStore } from '@/stores'
import PhoneTypeChannel from '@/views/productPage/phoneType/components/PhoneTypeChannel.vue'
import { phoneModelDeleteApi } from '@/api/cate.ts'

// 定义store
const phoneBrandStore = usePhoneBrandStore()
const phoneTypeStore = usePhoneTypeStore()

// 品牌分类下标
const activeIndex = ref<number | null>(null)
const currentBrandId = ref('')
// 处理品牌选择
const handleChangeBrand = (brandId: string, index: number): void => {
  console.log('changeBrand', brandId)
  activeIndex.value = index
  // 重置页码
  params.value.pageNum = 1
  params.value.pageSize = 10
  //   根据品牌id获取对应的型号
  currentBrandId.value = brandId
  phoneTypeStore.phoneTypeListGet(currentBrandId.value)
}

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
  phoneTypeStore.phoneTypeListGet(currentBrandId.value, params.value.pageNum, params.value.pageSize)
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  params.value.pageNum = val
  // 重新获取数据
  phoneTypeStore.phoneTypeListGet(currentBrandId.value, params.value.pageNum, params.value.pageSize)
}

// 获取手机型号列表

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
        const delRes = await phoneModelDeleteApi(row._id)
        console.log('删除结果', delRes)
        // 重新获取数据
        await phoneTypeStore.phoneTypeListGet(currentBrandId.value)
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
  phoneTypeStore.phoneTypeListGet(currentBrandId.value)
}

onMounted(() => {
  // 获取手机品牌
  phoneBrandStore.brandListGet(undefined, undefined, true)
  // 获取手机型号
  phoneTypeStore.phoneTypeListGet()
})
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="手机型号">
    <template #extra>
      <div class="header">
        <div class="tab">
          <div
            class="modelItem"
            v-for="(item, index) in phoneBrandStore.brandList"
            :key="item._id"
            :class="{ modelActive: activeIndex === index }"
            @click="handleChangeBrand(item._id as string, index)"
          >
            {{ item.name }}
          </div>
        </div>
        <el-button type="danger" @click="onAddChannel">添加型号</el-button>
      </div>
    </template>
    <el-table
      :data="phoneTypeStore.phoneTypeList"
      style="width: 100%"
      v-loading="phoneTypeStore.loading"
    >
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="手机型号" align="center" prop="name"></el-table-column>
      <el-table-column label="所属品牌" align="center" prop="parent_name"></el-table-column>
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
        :total="phoneTypeStore.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </PageContainer>
  <!-- 弹窗 -->
  <PhoneTypeChannel ref="dialog" @success="handleSuccess"></PhoneTypeChannel>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 80vw;
  font-size: 14px;
  /*上级分类列表*/
  .tab {
    display: flex;
    align-items: center;
    gap: 16px;

    .modelItem {
      padding: 4px 8px;
      border-radius: 8px;
      border: 1px solid #ccc;
      cursor: pointer;
    }

    .modelActive {
      border-radius: 8px;
      border: 1px solid $jel-brandColor;
      cursor: pointer;
    }
  }
}
</style>
