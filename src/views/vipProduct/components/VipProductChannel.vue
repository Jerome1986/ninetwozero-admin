<script setup lang="ts">
import { ref } from 'vue'
import type { VipProductItem } from '@/types/VipProduct'
import { ElMessage } from 'element-plus'
import { vipProductAddApi, vipProductUpdateApi } from '@/api/product.ts'

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('编辑会员产品')

// 弹窗表单
const formModel = ref<VipProductItem>({
  _id: '',
  level: 1,
  levelText: '',
  discount: 10,
  price: 0,
  gift: 0,
  term: ''
})

// 打开弹窗
const open = (row: Partial<VipProductItem>) => {
  dialogVisible.value = true
  if (row._id) {
    dialogTitle.value = '编辑会员产品'
    formModel.value = {
      _id: row._id,
      level: row.level ?? 1,
      levelText: row.levelText ?? '',
      discount: row.discount ?? 10,
      price: row.price ?? 0,
      gift: row.gift ?? 0,
      term: row.term ?? ''
    }
  } else {
    dialogTitle.value = '新增会员产品'
    formModel.value = {
      _id: '',
      level: 1,
      levelText: '',
      discount: 10,
      price: 0,
      gift: 0,
      term: ''
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
  console.log('提交会员产品：', formModel.value)
  try {
    if (formModel.value._id) {
      const upRes = await vipProductUpdateApi(
        formModel.value._id,
        formModel.value.level,
        formModel.value.levelText,
        formModel.value.discount,
        formModel.value.price,
        formModel.value.gift,
        formModel.value.term
      )
      console.log('更新结果', upRes)
      ElMessage.success('更新成功')
    } else {
      const addRes = await vipProductAddApi(
        formModel.value.level,
        formModel.value.levelText,
        formModel.value.discount,
        formModel.value.price,
        formModel.value.gift,
        formModel.value.term
      )
      console.log('新增结果', addRes)
      ElMessage.success('新增成功')
    }
  } catch (error) {
    console.error('error', error)
  }
  dialogVisible.value = false
  emits('success')
}
</script>

<template>
  <div class="proChannel">
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
      <el-form ref="formRef" :model="formModel" label-width="120px" style="padding-right: 30px">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="会员等级" prop="level">
              <el-input-number v-model="formModel.level" :min="1" :step="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等级名称" prop="levelText">
              <el-input v-model="formModel.levelText" placeholder="如：至尊会员"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="会员折扣" prop="discount">
              <el-input-number v-model="formModel.discount" :min="0" :max="10" :step="0.1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格(元)" prop="price">
              <el-input-number v-model="formModel.price" :min="0" :step="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="赠送次数" prop="gift">
              <el-input-number v-model="formModel.gift" :min="0" :step="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期" prop="term">
              <el-select v-model="formModel.term" placeholder="请选择有效期">
                <el-option label="一年" value="一年" />
                <el-option label="半年" value="半年" />
                <el-option label="永久" value="永久" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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

<style scoped lang="scss"></style>
