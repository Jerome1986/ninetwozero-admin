<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import type { ProductItem } from '@/types/CateItem'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { JelPhoneMoChannel } from '@/types/components'
import PhoneMoChannel from '@/views/productPage/phoneMo/components/PhoneMoChannel.vue'
import { usePhoneBrandStore, usePhoneTypeStore } from '@/stores'
import { productsDeleteApi, productSearchApi, productsGetApi } from '@/api/product.ts'

// 定义store
const phoneBrandStore = usePhoneBrandStore()
const phoneTypeStore = usePhoneTypeStore()
const brandActiveIndex = ref<number | null>(null)
const typeActiveIndex = ref<number | null>(null)
const brandCurrentId = ref('')
const typeCurrentId = ref('')
// 处理手机品牌改变
const handleChangeBrand = (brandId: string, index: number) => {
  brandActiveIndex.value = index
  brandCurrentId.value = brandId
  // 获取手机型号
  phoneTypeStore.phoneTypeListGet(brandId)
  // 重置参数
  params.value.pageNum = 1
  params.value.pageSize = 10
  typeActiveIndex.value = null
  typeCurrentId.value = ''
  // 获取产品
  productListGet(
    brandCurrentId.value,
    typeCurrentId.value,
    params.value.pageNum,
    params.value.pageSize
  )
}

// 根据货号或商品名称搜索
const searchValue = ref('')
const searchMaterialGet = async () => {
  console.log('搜索', searchValue.value)
  const res = await productSearchApi(searchValue.value, params.value.pageNum, params.value.pageSize)
  console.log(res)
  productList.value = res.data.list
  total.value = res.data.total
  // 搜索的时候重置分类和分页
  brandActiveIndex.value = null
  typeActiveIndex.value = null
  brandCurrentId.value = ''
  typeCurrentId.value = ''
  params.value.pageNum = 1
}

// 处理手机型号改变
const handleChangeType = (typeId: string, index: number) => {
  typeActiveIndex.value = index
  typeCurrentId.value = typeId
  // 重置页码
  params.value.pageNum = 1
  params.value.pageSize = 10
  // 获取产品
  productListGet(
    brandCurrentId.value,
    typeCurrentId.value,
    params.value.pageNum,
    params.value.pageSize
  )
}

// 加载
const loading = ref(false)
// 获取产品列表函数
const total = ref(0)
const productList = ref<ProductItem[]>([])
const productListGet = async (
  brandId: string,
  typeId: string,
  pageNum: number,
  pageSize: number
) => {
  loading.value = true
  const res = await productsGetApi(brandId, typeId, pageNum, pageSize)
  console.log('产品结果', res.data, brandId, typeId)
  productList.value = res.data.list
  total.value = res.data.total
  loading.value = false
}

// 获取子组件
const dialog = ref<JelPhoneMoChannel>()

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
  productListGet(
    brandCurrentId.value,
    typeCurrentId.value,
    params.value.pageNum,
    params.value.pageSize
  )
}

// 处理页码改变
const handleCurrentChange = (val: number) => {
  params.value.pageNum = val
  // 重新获取数据
  productListGet(
    brandCurrentId.value,
    typeCurrentId.value,
    params.value.pageNum,
    params.value.pageSize
  )
}

// 添加
const onAddChannel = () => {
  dialog.value?.open({
    name: '',
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
}

// 编辑
const onEditChannel = (row: ProductItem) => {
  dialog.value?.open(row)
}

// 删除
const onDelChannel = (row: ProductItem) => {
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
        const delRes = await productsDeleteApi(row._id)
        console.log('删除结果', delRes)
        // 重新获取数据
        await productListGet(
          brandCurrentId.value,
          typeCurrentId.value,
          params.value.pageNum,
          params.value.pageSize
        )
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
  productListGet(
    brandCurrentId.value,
    typeCurrentId.value,
    params.value.pageNum,
    params.value.pageSize
  )
}

onMounted(() => {
  phoneBrandStore.brandListGet(undefined, undefined, true)
  productListGet(
    brandCurrentId.value,
    typeCurrentId.value,
    params.value.pageNum,
    params.value.pageSize
  )
})
</script>

<template>
  <!-- 非会员用户 -->
  <PageContainer title="手机膜设置">
    <div class="header">
      <!--   搜索   -->
      <div class="search">
        <el-input
          v-model="searchValue"
          style="width: 240px; margin-right: 8px"
          placeholder="根据货号或者商品名称搜索"
          clearable
        />
        <el-button type="danger" @click="searchMaterialGet">查询</el-button>
      </div>
    </div>
    <template #extra>
      <el-button type="danger" @click="onAddChannel">添加产品</el-button>
    </template>
    <div class="list">
      品牌：
      <div
        class="item"
        v-for="(brand, index) in phoneBrandStore.brandList"
        :key="brand._id"
        :class="{ brandActiveItem: brandActiveIndex === index }"
        @click="handleChangeBrand(brand._id as string, index)"
      >
        {{ brand.name }}
      </div>
    </div>
    <div class="list" v-if="brandCurrentId">
      型号：
      <div
        class="item"
        v-for="(type, index) in phoneTypeStore.phoneTypeList"
        :key="type._id"
        :class="{ typeActiveItem: typeActiveIndex === index }"
        @click="handleChangeType(type._id as string, index)"
      >
        {{ type.name }}
      </div>
    </div>
    <el-table :data="productList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" align="center" width="60" type="index"></el-table-column>
      <el-table-column
        label="商品名称"
        align="center"
        prop="name"
        min-width="120"
      ></el-table-column>
      <el-table-column label="货号" align="center" prop="skuNo" min-width="80"></el-table-column>
      <el-table-column label="规格" align="center" prop="skuList" min-width="200">
        <template #default="{ row }">
          <div
            class="sku"
            style="display: flex; align-items: center; justify-content: center; gap: 4px"
          >
            <div v-for="(sku, index) in row.skuList" :key="index">{{ sku.name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品描述" align="center" prop="dec" min-width="200"></el-table-column>
      <el-table-column label="商品原价" align="center" prop="originalPrice" width="100">
        <template #default="{ row }">
          {{ Number(row.originalPrice).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="当前售价" align="center" prop="currentPrice" width="100">
        <template #default="{ row }">
          {{ Number(row.currentPrice).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="封面图" align="center" prop="cover" width="100">
        <template #default="{ row }">
          <img style="width: 50px; height: 50px; border-radius: 4px" :src="row.cover" alt="cover" />
        </template>
      </el-table-column>
      <el-table-column label="详情图" align="center" prop="proImages" min-width="200">
        <template #default="{ row }">
          <img
            style="width: 50px; height: 50px; border-radius: 4px"
            v-for="item in row.proImages"
            :key="item"
            :src="item"
            alt="detaillPic"
          />
        </template>
      </el-table-column>
      <el-table-column label="浏览量" align="center" prop="lookNum" width="100"></el-table-column>
      <el-table-column label="所属型号" align="center" prop="model" width="140"></el-table-column>
      <el-table-column label="所属品牌" align="center" prop="brand" width="140"></el-table-column>
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
  <PhoneMoChannel ref="dialog" @success="handleSuccess"></PhoneMoChannel>
</template>

<style scoped lang="scss">
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

.list {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: $jel-font-title;
  cursor: pointer;
}

.item {
  padding: 4px 8px;
  width: fit-content;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.brandActiveItem {
  padding: 4px 8px;
  width: fit-content;
  border: 1px solid $jel-brandColor;
  border-radius: 8px;
}

.typeActiveItem {
  padding: 4px 8px;
  width: fit-content;
  border: 1px solid #f56c6c;
  border-radius: 8px;
}
</style>
