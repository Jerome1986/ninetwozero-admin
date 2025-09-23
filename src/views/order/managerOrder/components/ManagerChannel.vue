<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { ManagerOrderItem } from '@/types/OrderItem'
import { managerOrderInfoUpdateApi } from '@/api/order.ts'

// 对话框可见与标题
const dialog = ref(false)
const dialogTitle = ref('编辑订单')

// 表单引用
const formRef = ref<FormInstance>()

// 默认表单数据
const defaultForm: ManagerOrderItem = {
  outTradeNo: '',
  storeId: '',
  managerId: '',
  product: [],
  total: 0,
  applicant: { name: '', shop: '', mobile: '' },
  state: '备货中'
}

// 弹窗表单
const formModel = ref<ManagerOrderItem>({ ...defaultForm })

// 打开弹窗
const open = (row: ManagerOrderItem) => {
  dialog.value = true
  dialogTitle.value = '编辑订单'
  // 回显，带默认兜底，避免缺字段
  formModel.value = {
    ...defaultForm,
    ...row,
    applicant: { ...defaultForm.applicant, ...(row.applicant || {}) }
  }
}

// 暴露方法
defineExpose({
  open
})

// 提交事件
const emits = defineEmits(['success'])

// 提交（结构占位）
const onSubmit = async () => {
  console.log('提交订单：', formModel.value)
  // todo 更新订单接口
  if (formModel.value._id && formModel.value.state) {
    const upRes = await managerOrderInfoUpdateApi(
      formModel.value._id,
      formModel.value.state,
      formModel.value.total
    )
    console.log('更新结果', upRes)
    ElMessage.success('更新成功')
  }

  dialog.value = false
  emits('success')
}
</script>

<template>
  <div class="proChannel">
    <el-dialog v-model="dialog" :title="dialogTitle" width="60%">
      <el-form ref="formRef" :model="formModel" label-width="120px" style="padding-right: 30px">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="订单编号" prop="outTradeNo">
              <el-input v-model="formModel.outTradeNo" placeholder="订单编号" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单状态" prop="state">
              <el-select v-model="formModel.state" placeholder="请选择订单状态" style="width: 100%">
                <el-option label="备货中" value="备货中" />
                <el-option label="待取货" value="待取货" />
                <el-option label="已完成" value="已完成" />
                <el-option label="已取消" value="已取消" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="总价/总数" prop="total">
              <el-input-number v-model="formModel.total" :min="0" :step="1" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider>联系人信息</el-divider>
        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item label="姓名" prop="applicant.name">
              <el-input v-model="formModel.applicant.name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="门店" prop="applicant.shop">
              <el-input v-model="formModel.applicant.shop" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话" prop="applicant.mobile">
              <el-input v-model="formModel.applicant.mobile" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog = false">取消</el-button>
          <el-button type="danger" @click="onSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
