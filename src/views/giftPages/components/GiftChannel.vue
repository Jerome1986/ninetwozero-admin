<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage, genFileId, type UploadInstance, type UploadRawFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { GiftItems } from '@/types/GiftItems'
import { useCateStore } from '@/stores/modules/cate'
import { giftListAddApi, giftListUpdateApi } from '@/api/gift.ts'

// 定义store
const cateStore = useCateStore()

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('编辑用户')

// 弹窗表单
const formModel = ref<GiftItems>({
  cover: '',
  name: '',
  dec: '',
  lookNum: 0,
  originalPrice: 0,
  currentPrice: 0,
  giftImages: [],
  parent_id: '',
  parent_name: ''
})

// 获取上传组件
const uploadCover = ref<UploadInstance>()

// 上传 - 封面
const coverFileList = ref<UploadUserFile[]>([])
const handleCoverSuccess: UploadProps['onSuccess'] = (response) => {
  console.log('上传成功返回', response)
  // 拿到返回的url
  formModel.value.cover = response
}
//  覆盖上一张图
const handleCoverExceed: UploadProps['onExceed'] = (files) => {
  console.log('覆盖上一张图', files)
  uploadCover.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadCover.value!.handleStart(file)
  uploadCover.value!.submit()
}
// 移除图片
const handleCoverRemove: UploadProps['onRemove'] = () => {
  formModel.value.cover = ''
  coverFileList.value = []
}

// 上传 - 详情图
const detailFileList = ref<UploadUserFile[]>([])
const handleDetailCardPreview = () => {
  console.log('预览详情图')
}
const handleDetailSuccess: UploadProps['onSuccess'] = (response) => {
  console.log('上传详情成功返回', response)
  // 拿到返回的url追加到素组
  formModel.value.giftImages?.push(response)
}
const handleDetailRemove: UploadProps['onRemove'] = (uploadFile) => {
  console.log('删除', uploadFile.response)
  // 过滤掉删除的链接
  formModel.value.giftImages = formModel.value.giftImages?.filter(
    (url: string) => url !== uploadFile.response
  )
  console.log('删除后的数组', formModel.value.giftImages)
}

// 打开弹窗
const open = async (row: GiftItems) => {
  console.log('打开弹窗', row)
  dialogVisible.value = true
  if (row._id) {
    dialogTitle.value = '编辑'
    formModel.value = { ...row }
  } else {
    dialogTitle.value = '新增'
    formModel.value = row
  }
  // 同步文件列表
  coverFileList.value = formModel.value.cover ? [{ name: 'cover', url: formModel.value.cover }] : []
  if (formModel.value.giftImages?.length) {
    detailFileList.value = formModel.value.giftImages.map((u) => ({ name: u, url: u }))
  }
}

// 选择父级
const onParentChange = (val: string) => {
  console.log(val)
  // 将父级ID和父级名称同步到表单
  cateStore.cateList.forEach((item) => {
    if (item._id === val) {
      formModel.value.parent_id = val
      formModel.value.parent_name = item.name
    }
  })
  console.log('选择后的表单', formModel.value)
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
  if (formModel.value._id) {
    try {
      console.log('提交', formModel.value)
      const upRes = await giftListUpdateApi(
        formModel.value._id,
        formModel.value.cover,
        formModel.value.name,
        formModel.value.dec,
        formModel.value.lookNum,
        formModel.value.originalPrice,
        formModel.value.currentPrice,
        formModel.value.giftImages || [],
        formModel.value.parent_id,
        formModel.value.parent_name
      )
      console.log('更新', upRes)
      ElMessage.success('更新成功')
    } catch (error) {
      console.error('error', error)
    }
  } else {
    try {
      console.log('新增', formModel.value)
      // 请求新增接口
      const addRes = await giftListAddApi(
        formModel.value.cover,
        formModel.value.name,
        formModel.value.dec,
        formModel.value.lookNum,
        formModel.value.originalPrice,
        formModel.value.currentPrice,
        formModel.value.giftImages || [],
        formModel.value.parent_id,
        formModel.value.parent_name
      )
      console.log('新增成功', addRes)
      ElMessage.success('新增成功')
    } catch (error) {
      console.error('error', error)
    }
  }
  dialogVisible.value = false
  emits('success')
}

onMounted(async () => cateStore.cateListGet())
</script>

<template>
  <div class="proChannel">
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
      <el-form ref="formRef" :model="formModel" label-width="100px" style="padding-right: 30px">
        <!-- 商品名称 -->
        <el-form-item label="名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入名称"></el-input>
        </el-form-item>

        <!-- 商品描述 -->
        <el-form-item label="描述" prop="dec">
          <el-input
            v-model="formModel.dec"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
        <!-- 价格 -->
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="原价" prop="originalPrice">
              <el-input-number v-model="formModel.originalPrice" :min="0" :step="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现价" prop="currentPrice">
              <el-input-number v-model="formModel.currentPrice" :min="0" :step="1" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 封面上传 -->
        <el-form-item label="封面图" prop="cover">
          <el-upload
            ref="uploadCover"
            action="https://h91gpva7y7.gzg.sealos.run/upload/images"
            list-type="picture-card"
            :limit="1"
            :file-list="coverFileList"
            :on-success="handleCoverSuccess"
            :on-remove="handleCoverRemove"
            :on-exceed="handleCoverExceed"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <!-- 详情图上传 -->
        <el-form-item label="详情图" prop="proImages">
          <el-upload
            v-model:file-list="detailFileList"
            action="https://h91gpva7y7.gzg.sealos.run/upload/images"
            list-type="picture-card"
            :on-success="handleDetailSuccess"
            :on-preview="handleDetailCardPreview"
            :on-remove="handleDetailRemove"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <!-- 浏览量 -->
        <el-form-item label="浏览量" prop="lookNum">
          <el-input-number v-model="formModel.lookNum" :min="0" :step="1" />
        </el-form-item>
        <!-- 选择所属分类 -->
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="分类" prop="modelId">
              <el-select
                v-model="formModel.parent_id"
                placeholder="请选择所属分类"
                style="width: 100%"
                @change="onParentChange"
              >
                <el-option
                  v-for="item in cateStore.cateList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                />
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

<style scoped lang="scss">
.proChannel {
  :deep(.el-upload--picture-card) {
    width: 120px;
    height: 120px;
    line-height: 120px;
  }
}

/* 紧凑的 SKU 表格样式 */
.sku-section {
  margin-top: 8px;

  :deep(.sku-table) {
    width: 100% !important;
  }

  :deep(.el-table .cell) {
    padding: 6px 8px;
  }

  :deep(.el-input__wrapper) {
    padding: 0 8px;
  }

  :deep(.el-input-number) {
    width: 100px;
  }

  /* 缩小规格封面卡片尺寸，避免占位过大 */
  :deep(.el-table .el-upload--picture-card) {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }

  /* 规格名称输入：去掉外边框，突出占位提示，并居中 */
  :deep(.sku-name-input .el-input__wrapper) {
    box-shadow: none !important;
    background-color: transparent;
    padding-left: 0;
  }

  :deep(.sku-name-input .el-input__inner) {
    text-align: center;
  }
}
</style>
