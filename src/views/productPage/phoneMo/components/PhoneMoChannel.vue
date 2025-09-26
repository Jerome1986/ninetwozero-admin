<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage, genFileId, type UploadInstance, type UploadRawFile } from 'element-plus'
import type { ProductItem, SkuItem } from '@/types/CateItem'
import { usePhoneBrandStore, usePhoneTypeStore } from '@/stores'
import { Plus } from '@element-plus/icons-vue'
import { productsAddApi, productsUpdateApi } from '@/api/product.ts'

// 定义store
const phoneBrandStore = usePhoneBrandStore()
const phoneTypeStore = usePhoneTypeStore()

// 对话框可见与标题
const dialogVisible = ref(false)
const dialogTitle = ref('编辑用户')

// 弹窗表单
const formModel = ref<ProductItem>({
  _id: '',
  name: '',
  skuNo: '',
  dec: '',
  originalPrice: 0,
  currentPrice: 0,
  cover: '',
  proImages: [],
  lookNum: 0,
  modelId: '',
  brandId: '',
  brand: '',
  model: '',
  skuList: []
})

// 新增Sku
const skuList = ref<(SkuItem & { skuFileList?: UploadUserFile[] })[]>([])
const addSku = () => {
  skuList.value.push({ name: '', cover: '', price: 0, stock: 0, skuFileList: [] })
}
const skuFileList = ref<UploadUserFile[]>([])
// 从Sku数组移除
const removeSku = (index: number) => {
  skuList.value.splice(index, 1)
}
//  Sku封面覆盖上一张图
const uploadCoverSku = ref<UploadInstance>()
const handleCoverSkuExceed: UploadProps['onExceed'] = (files) => {
  console.log('覆盖上一张图', files)
  uploadCoverSku.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadCoverSku.value!.handleStart(file)
  uploadCoverSku.value!.submit()
}

// 品牌id
const brandCurrentId = ref('')
// 选择品牌/型号时写入名称
const onBrandChange = (val: string) => {
  brandCurrentId.value = val
  const foundB = phoneBrandStore.brandList.find((b) => b._id === val)
  formModel.value.brand = foundB?.name || ''
  phoneTypeStore.phoneTypeListGet(brandCurrentId.value, undefined, undefined, true)
  // 切换时重置下级手机型号列表
  phoneTypeStore.setPhoneTypeList()
  formModel.value.modelId = ''
}
// 型号发生改变时
const onModelChange = (val: string) => {
  const found = phoneTypeStore.phoneTypeList.find((m) => m._id === val)
  formModel.value.model = found?.name || ''
}

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
  formModel.value.proImages.push(response)
}
const handleDetailRemove: UploadProps['onRemove'] = (uploadFile) => {
  console.log('删除', uploadFile)
  // 过滤掉删除的链接
  formModel.value.proImages = formModel.value.proImages.filter(
    (url: string) => url !== uploadFile.url
  )
  console.log('删除后的数组', formModel.value.proImages)
}

// 打开弹窗
const open = (row: ProductItem) => {
  console.log('打开弹窗', row)
  dialogVisible.value = true
  if (row._id) {
    dialogTitle.value = '编辑'
    formModel.value = { ...row }
    // 编辑时获取行内sku的cover用于回显
    skuList.value = (row.skuList || []).map((s: SkuItem) => ({
      ...s,
      skuFileList: s.cover ? [{ name: 'skuCover', url: s.cover }] : []
    }))

    //  编辑点开的时候需要获取对应的手机型号
    phoneTypeStore.phoneTypeListGet(row.brandId, undefined, undefined, true)
  } else {
    dialogTitle.value = '新增'
    formModel.value = row
    skuList.value = []
  }
  // 同步文件列表
  coverFileList.value = formModel.value.cover ? [{ name: 'cover', url: formModel.value.cover }] : []
  detailFileList.value = formModel.value.proImages.map((u) => ({ name: u, url: u }))
  skuFileList.value = skuList.value.flatMap((s) => s.skuFileList || [])
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
      console.log('提交', formModel.value, 'sku', skuList)
      formModel.value.skuList = skuList.value
      const upRes = await productsUpdateApi(formModel.value)
      console.log('更新结果', upRes)
      ElMessage.success('更新成功')
    } catch (error) {
      console.error('error', error)
    }
  } else {
    try {
      console.log('新增', formModel.value)
      // 新增前，追加本地的sku数据
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      formModel.value.skuList = skuList.value.map(({ skuFileList, ...rest }) => rest)
      const addRes = await productsAddApi(formModel.value)
      console.log('新增成功', addRes)
      ElMessage.success('新增成功')
    } catch (error) {
      console.error('error', error)
    }
  }
  dialogVisible.value = false
  emits('success')
}

onMounted(async () => {
  await phoneBrandStore.brandListGet()
})
</script>

<template>
  <div class="proChannel">
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
      <el-form ref="formRef" :model="formModel" label-width="100px" style="padding-right: 30px">
        <!-- 商品名称 -->
        <el-form-item label="名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <!-- 商品货号 -->
        <el-form-item label="货号" prop="name">
          <el-input v-model="formModel.skuNo" placeholder="请输入货号"></el-input>
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
            :data="{ folder: formModel.model }"
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
            :data="{ folder: formModel.model }"
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
        <!-- 品牌/型号 下拉 -->
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="品牌" prop="brandId">
              <el-select
                v-model="formModel.brandId"
                placeholder="请选择品牌"
                style="width: 100%"
                @change="onBrandChange"
              >
                <el-option
                  v-for="item in phoneBrandStore.brandList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="modelId">
              <el-select
                v-model="formModel.modelId"
                placeholder="请选择型号"
                style="width: 100%"
                @change="onModelChange"
              >
                <el-option
                  v-for="item in phoneTypeStore.phoneTypeList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 规格 SKU -->
        <el-divider>规格 SKU</el-divider>
        <div class="sku-section">
          <el-button type="primary" plain size="small" @click="addSku">新增规格</el-button>
          <el-table :data="skuList" class="sku-table" border style="width: 100%; margin-top: 12px">
            <el-table-column label="规格名称" width="160" align="center">
              <template #default="{ row }">
                <el-input
                  v-model="row.name"
                  placeholder="请输入规格名称"
                  class="sku-name-input"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="封面图" width="200" align="center">
              <template #default="{ row }">
                <el-upload
                  ref="uploadCoverSku"
                  action="https://h91gpva7y7.gzg.sealos.run/upload/images"
                  v-model:file-list="row.skuFileList"
                  list-type="picture-card"
                  :limit="1"
                  :data="{ folder: formModel.model }"
                  :on-success="
                    (resp: any) => {
                      const url = resp?.url ?? resp
                      row.cover = url
                      row.skuFileList = url ? [{ name: 'skuCover', url }] : []
                    }
                  "
                  :on-exceed="handleCoverSkuExceed"
                  :on-remove="() => ((row.cover = ''), (row.skuFileList = []))"
                >
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column label="价格(元)" width="120" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.price" :min="0" :step="1" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="库存" width="120" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.stock" :min="0" :step="1" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button type="danger" link size="small" @click="removeSku(scope.$index)"
                  >移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
