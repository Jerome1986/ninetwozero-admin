<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import type { UserItem } from '@/types/UserItem'
import { updateUserApi } from '@/api/user.ts'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('编辑用户')

// 表单引用与数据模型
const formRef = ref<FormInstance>()
type UserFormModel = Pick<
  UserItem,
  '_id' | 'mobile' | 'gender' | 'role' | 'referralCode' | 'inviterCode' | 'status'
>

// 弹窗表单
const formModel = ref<UserFormModel>({
  _id: '',
  mobile: '',
  gender: 1,
  role: 'user',
  referralCode: '',
  inviterCode: '',
  status: 'active'
})

// 打开弹窗
const open = (row: UserItem) => {
  dialogVisible.value = true
  // 回显
  formModel.value = {
    _id: row._id,
    mobile: row.mobile,
    gender: row.gender,
    role: row.role,
    referralCode: row.referralCode,
    inviterCode: row.inviterCode,
    status: row.status
  }
}

// 暴露方法
defineExpose({
  open
})

// 提交事件
const emits = defineEmits(['success'])

// 提交
const onSubmit = async () => {
  console.log('提交用户：', formModel.value)
  // 更新用户信息
  try {
    const res = await updateUserApi(
      userStore.token,
      formModel.value._id,
      formModel.value.gender,
      formModel.value.role,
      formModel.value.inviterCode,
      formModel.value.status
    )
    console.log('结果', res)
    if (res.code === 200) {
      ElMessage.success('更新成功')
    } else {
      ElMessage.error('更新失败')
    }
  } catch (error) {
    console.error('更新失败', error)
  }
  // 通知父组件刷新&&关闭弹窗
  dialogVisible.value = false
  emits('success')
}
</script>

<template>
  <div class="proChannel">
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
      <el-form ref="formRef" :model="formModel" label-width="100px" style="padding-right: 30px">
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="formModel.mobile"
            placeholder="请输入手机号"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <!-- 性别 -->
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formModel.gender" placeholder="请选择性别" style="width: 240px">
            <el-option :value="1" label="男" />
            <el-option :value="2" label="女" />
          </el-select>
        </el-form-item>

        <!-- 角色 -->
        <el-form-item label="角色" prop="role">
          <el-select v-model="formModel.role" placeholder="请选择角色" style="width: 240px">
            <el-option value="user" label="普通用户" />
            <el-option value="vip" label="会员" />
          </el-select>
        </el-form-item>

        <!-- 邀请码/上级邀请码 -->
        <el-form-item label="邀请码" prop="referralCode">
          <el-input
            v-model="formModel.referralCode"
            placeholder="请输入邀请码"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级邀请码" prop="inviterCode">
          <el-input v-model="formModel.inviterCode" placeholder="请输入上级邀请码"></el-input>
        </el-form-item>

        <!-- 账号状态 -->
        <el-form-item label="账号状态" prop="status">
          <el-select v-model="formModel.status" placeholder="请选择账号状态" style="width: 240px">
            <el-option value="active" label="正常" />
            <el-option value="inactive" label="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="danger" @click="onSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.proChannel {
  .upload-container {
    display: flex;
    align-items: center;
    gap: 16px;

    :deep(.el-upload--picture-card) {
      width: 120px;
      height: 120px;
      line-height: 120px;
    }

    .el-button {
      height: 40px;
      margin-top: 40px; // 垂直居中对齐
      padding: 0 20px;
      font-size: 14px;
    }
  }

  :deep(.el-upload) {
    .el-button {
      margin-right: 12px;
    }
  }

  :deep(.el-upload__tip) {
    margin-top: 8px;
    color: #909399;
    font-size: 13px;
  }
}
</style>
