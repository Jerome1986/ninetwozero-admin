<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { StoreItem } from '@/types/StoreItem'
import { storeDeleteApi, storeGetApi } from '@/api/store.ts'
import { useUserStore } from '@/stores'
import { formatTimestamp } from '@/utils/formatTimestamp.ts'
import StoreChannel from '@/views/store/components/StoreChannel.vue'
import type { JelStoreChannel } from '@/types/components'
import { ElMessage, ElMessageBox } from 'element-plus'

// 组件
const dialog = ref<JelStoreChannel>()

// 定义store
const userStore = useUserStore()

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
  storeListGet(userStore.token, params.value.pageNum, params.value.pageSize)
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  params.value.pageNum = val
  // 重新获取数据
  storeListGet(userStore.token, params.value.pageNum, params.value.pageSize)
}

// 获取门店列表
const storeList = ref<StoreItem[]>([])
const loading = ref(false)
const storeListGet = async (token: string, pageNum: number = 1, pageSize: number = 10) => {
  loading.value = true
  const res = await storeGetApi(token, pageNum, pageSize)
  loading.value = false

  // 更新数据与总数
  storeList.value = res.data.list
  total.value = res.data.total
}

// 添加
const onAddChannel = () => {
  console.log('onAddChannel')
  dialog.value?.open({})
}

// 编辑
const onEditChannel = (row: StoreItem) => {
  console.log('onEditChannel', row)
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: StoreItem) => {
  console.log('onDelChannel', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      const res = await storeDeleteApi(userStore.token, row.storeId!, row.managerId!)
      if (res.code === 200) {
        await storeListGet(userStore.token, params.value.pageNum, params.value.pageSize)
        ElMessage.success('删除成功')
      }
    })
    .catch((err) => {
      // catch error
      console.error('异常错误', err)
    })
}

// 搜索
const searchValue = ref('')
// 点击搜索
const searchMaterialGet = () => {
  console.log('searchMaterialGet')
}

// 处理子组件成功
const handleSuccess = () => {
  console.log('handleSuccess')
  storeListGet(userStore.token, params.value.pageNum, params.value.pageSize)
}

onMounted(() => storeListGet(userStore.token))
</script>

<template>
  <PageContainer title="门店管理">
    <div class="header">
      <div class="tips">
        提示：
        <p>绑定店长：将用户的注册/登录时授权的电话，填入"门店电话"即可与当前门店绑定</p>
        <p>上级门店：该店长登录时的邀请人，如果邀请人不为店长，则该门店无上级门店</p>
        <p>更新门店信息时，更新门店电话即更换店长</p>
      </div>
      <!--   搜索   -->
      <div class="right">
        <div class="search">
          <el-input
            v-model="searchValue"
            style="width: 240px; margin-right: 8px"
            placeholder="根据门店id或门店电话搜索"
            clearable
          />
          <el-button type="danger" @click="searchMaterialGet">查询</el-button>
        </div>
        <el-button type="danger" @click="onAddChannel">添加门店</el-button>
      </div>
    </div>
    <el-table :data="storeList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="门店id" align="center" prop="storeId"></el-table-column>
      <el-table-column label="门店logo" align="center" prop="storeLogo">
        <template #default="{ row }">
          <img
            style="width: 50px; height: 50px; border-radius: 50%"
            :src="(row as StoreItem).storeLogo"
            alt="logo"
          />
        </template>
      </el-table-column>
      <el-table-column label="门店名称" align="center" prop="name"></el-table-column>
      <el-table-column label="门店地址" align="center" prop="address"></el-table-column>
      <el-table-column label="店长" align="center" prop="managerName"></el-table-column>
      <el-table-column label="上级门店" align="center" prop="parentStoreId"></el-table-column>
      <el-table-column label="门店电话" align="center" prop="phone"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt">
        <template #default="{ row }">
          {{ formatTimestamp(row.createdAt, 2) }}
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
  <StoreChannel ref="dialog" @success="handleSuccess"></StoreChannel>
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
