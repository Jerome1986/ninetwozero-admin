<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { phoneTypeItem } from '@/types/CateItem'
import { usePhoneBrandStore } from '@/stores'
import { phoneModelAddApi, phoneModelUpdateApi } from '@/api/cate.ts'

// 定义store
const phoneBrandStore = usePhoneBrandStore()

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('编辑用户')

// 弹窗表单
const formModel = ref<phoneTypeItem>({
  _id: '',
  cover: '',
  name: '',
  parent_id: '',
  parent_name: ''
})

// 选择分类时，联动写入 parent_name
const onCateChange = (val: string) => {
  const found = phoneBrandStore.brandList.find((item) => item._id === val)
  formModel.value.parent_name = found?.name || ''
}

// 打开弹窗
const open = (row: phoneTypeItem) => {
  dialogVisible.value = true
  // 编辑
  if (row._id) {
    dialogTitle.value = '编辑'
    formModel.value = { ...row }
  } else {
    //   新增
    dialogTitle.value = '新增'
    formModel.value = row
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
  // todo 提交之前先验证
  // 更新
  if (formModel.value._id) {
    try {
      console.log('提交', formModel.value._id, formModel.value.name)
      const upRes = await phoneModelUpdateApi(
        formModel.value._id,
        formModel.value.name,
        formModel.value.parent_id,
        formModel.value.parent_name
      )
      console.log('更新结果', upRes)
      ElMessage.success('更新成功')
    } catch (error) {
      console.error('error', error)
    }
  } else {
    try {
      //  新增
      const addReS = await phoneModelAddApi(
        formModel.value.name,
        formModel.value.parent_id,
        formModel.value.parent_name
      )
      console.log('新增成功', addReS)
      ElMessage.success('新增成功')
    } catch (error) {
      console.error('error', error)
    }
  }
  // 通知父组件刷新&&关闭弹窗
  dialogVisible.value = false
  emits('success')
}

// 正确注册生命周期钩子：组件挂载时拉取分类
onMounted(() => {
  // 获取手机品牌
  phoneBrandStore.brandListGet(undefined, undefined, true)
})
</script>

<template>
  <div class="proChannel">
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
      <el-form ref="formRef" :model="formModel" label-width="100px" style="padding-right: 30px">
        <!-- 分类名称 -->
        <el-form-item label="型号名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入型号名称"></el-input>
        </el-form-item>
        <!-- 分类名称 -->
        <el-form-item label="所属品牌" prop="parent_id">
          <el-select
            v-model="formModel.parent_id"
            placeholder="请选择所属手机品牌"
            style="width: 240px"
            @change="onCateChange"
          >
            <el-option
              v-for="item in phoneBrandStore.brandList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
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
