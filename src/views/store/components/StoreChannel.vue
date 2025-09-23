<script setup lang="ts">
import { ref } from 'vue'
import type { StoreItem } from '@/types/StoreItem'
import { ElMessage } from 'element-plus'
import { storeAddApi, storeUpdateApi } from '@/api/store.ts'
import { validateForm } from '@/utils/validateStoreForm.ts'

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('编辑门店')

// 弹窗表单
type StoreFormModel = Pick<
  StoreItem,
  '_id' | 'storeId' | 'managerId' | 'name' | 'address' | 'managerName' | 'phone' | 'status'
>
const formModel = ref<StoreFormModel>({
  _id: '',
  storeId: '',
  managerId: '',
  name: '',
  address: '',
  managerName: '',
  phone: '',
  status: 'active'
})

// 打开弹窗
const open = (row: Partial<StoreItem> = {}) => {
  dialogVisible.value = true
  if (row._id) {
    dialogTitle.value = '编辑门店'
    formModel.value = {
      _id: row._id,
      storeId: row.storeId || '',
      managerId: row.managerId || '',
      name: row.name || '',
      address: row.address || '',
      managerName: row.managerName || '',
      phone: row.phone || '',
      status: row.status || 'active'
    }
  } else {
    dialogTitle.value = '新增门店'
    console.log('新增', formModel.value)
    formModel.value = {
      _id: '',
      name: '',
      address: '',
      managerName: '',
      phone: '',
      status: 'active'
    }
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
  console.log('提交门店：', formModel.value)
  // 更新
  if (formModel.value._id && formModel.value.storeId && formModel.value.managerId) {
    try {
      //  调用更新接口
      const updateRes = await storeUpdateApi(
        formModel.value.storeId,
        formModel.value.managerId,
        formModel.value.name,
        formModel.value.address,
        formModel.value.managerName,
        formModel.value.phone,
        formModel.value.status || 'active'
      )
      console.log('更新结果', updateRes)
      ElMessage.success('更新成功')
    } catch (error) {
      console.error('error', error)
    }
  } else {
    try {
      // 添加前先校验
      const check = validateForm(formModel.value)
      if (!check.valid) {
        ElMessage.error(check.message)
        return
      }

      //  调用新增接口
      const res = await storeAddApi(
        formModel.value.name,
        formModel.value.address,
        formModel.value.managerName,
        formModel.value.phone,
        formModel.value.status || 'active'
      )
      console.log('新增结果', res)
      ElMessage.success('新增成功')
    } catch (error) {
      console.error('error', error)
    }
  }
  // 通知父组件刷新&&关闭弹窗
  dialogVisible.value = false
  emits('success')
}
</script>

<template>
  <div class="proChannel">
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
      <el-form ref="formRef" :model="formModel" label-width="120px" style="padding-right: 30px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="门店名称" prop="name">
              <el-input v-model="formModel.name" placeholder="请输入门店名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店长姓名" prop="managerName">
              <el-input v-model="formModel.managerName" placeholder="请输入店长姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="门店电话" prop="phone">
              <el-input v-model="formModel.phone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="门店地址" prop="address">
          <el-input v-model="formModel.address" placeholder="请输入门店地址"></el-input>
        </el-form-item>

        <el-form-item label="门店状态" prop="status">
          <el-select v-model="formModel.status" placeholder="请选择门店状态" style="width: 240px">
            <el-option value="active" label="启用" />
            <el-option value="inactive" label="停用" />
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
  :deep(.el-upload--picture-card) {
    width: 120px;
    height: 120px;
    line-height: 120px;
  }
}
</style>
