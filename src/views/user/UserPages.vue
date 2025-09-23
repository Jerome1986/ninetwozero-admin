<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { UserItem } from '@/types/UserItem'
import { delUserApi, searchUserApi, userGetApi } from '@/api/user.ts'
import { useUserStore } from '@/stores'
import { formatGender, formatRole } from '@/utils/mapping.ts'
import { formatTimestamp } from '@/utils/formatTimestamp.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserChannel from '@/views/vip/components/UserChannel.vue'
import type { JelUserChannel } from '@/types/components'

// 定义 store
const userStore = useUserStore()

// 非会员用户
const userList = ref<UserItem[]>([])
const loading = ref(true)

// 获取组件
const dialog = ref<JelUserChannel>()

// 获取非会员用户
const userListGet = async (token: string, pageNum: number = 1, pageSize: number = 10) => {
  loading.value = true
  const res = await userGetApi(token, pageNum, pageSize, 'user')
  console.log('返回', res)
  userList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 编辑用户信息
const onEditChannel = (row: UserItem) => {
  console.log('onEditChannel', row)
  dialog.value?.open(row)
}

// 处理子组件提交成功后刷新
const handleSuccess = async () => {
  console.log('父success')
  await userListGet(userStore.token, params.value.pagesNum, params.value.pagesSize)
}

// 处理删除
const onDelChannel = (row: UserItem) => {
  console.log('删除', row)
  ElMessageBox.confirm('你确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger' // Element 内置类
  })
    .then(async () => {
      // todo 发起请求
      const deleteRes = await delUserApi(userStore.token, row._id)
      console.log('删除结果', deleteRes)
      if (deleteRes.code === 200) {
        // todo 成功重新渲染
        await userListGet(userStore.token, params.value.pagesNum, params.value.pagesSize)
        ElMessage.success('删除成功')
      } else {
        ElMessage.error('删除失败')
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
  const res = await searchUserApi(userStore.token, searchValue.value, 'user')
  userList.value = res.data
  total.value = res.data.length
}

// 分页参数
const params = ref({
  pagesNum: 1,
  pagesSize: 10
})

// 总条数
const total = ref(0)

// 处理每页条数改变
const handleSizeChange = (val: number) => {
  params.value.pagesSize = val
  // 重新获取数据
  userListGet(userStore.token, params.value.pagesNum, params.value.pagesSize)
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  params.value.pagesNum = val
  // 重新获取数据
  userListGet(userStore.token, params.value.pagesNum, params.value.pagesSize)
}

// 页面加载完毕
onMounted(() => userListGet(userStore.token, params.value.pagesNum, params.value.pagesSize))
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="用户列表">
    <div class="header">
      <!--   搜索   -->
      <div class="search">
        <el-input
          v-model="searchValue"
          style="width: 240px; margin-right: 8px"
          placeholder="根据手机号或邀请码搜索"
          clearable
          @clear="userListGet(userStore.token)"
        />
        <el-button type="danger" @click="searchMaterialGet">查询</el-button>
      </div>
    </div>
    <el-table :data="userList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column label="角色" align="center" prop="role">
        <template #default="{ row }">
          {{ formatRole(row.role) }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="gender" width="60">
        <template #default="{ row }">
          {{ formatGender(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="mobile"></el-table-column>
      <el-table-column label="头像" align="center" prop="avatarUrl">
        <template #default="{ row }">
          <img
            style="width: 50px; height: 50px; border-radius: 50%"
            :src="row.avatarUrl"
            alt="avatar"
          />
        </template>
      </el-table-column>
      <el-table-column label="邀请码" align="center" prop="referralCode"></el-table-column>
      <el-table-column label="上级" align="center" prop="inviterCode">
        <template #default="{ row }">
          {{ row.inviterCode ? row.inviterCode : '无' }}
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="registerTime" width="160">
        <template #default="{ row }">
          {{ formatTimestamp(row.registerTime, 2) }}
        </template>
      </el-table-column>
      <el-table-column label="账号状态" align="center" prop="status">
        <template #default="{ row }">
          {{ row.status === 'active' ? '正常' : '禁用' }}
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
        v-model:current-page="params.pagesNum"
        v-model:page-size="params.pagesSize"
        :page-sizes="[1, 10, 30, 50, 100]"
        layout="jumper,total, sizes, prev, pager, next "
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </PageContainer>
  <!-- 编辑组件 -->
  <UserChannel ref="dialog" @success="handleSuccess"></UserChannel>
</template>

<style scoped lang="scss">
.page-container {
  .header {
    margin-bottom: 16px;
    width: 100%;
    color: $jel-font-title;

    .search {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
