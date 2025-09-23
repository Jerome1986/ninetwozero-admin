<script setup lang="ts">
import { computed } from 'vue'
import type { ManagerOrderItem } from '@/types/OrderItem'

const props = defineProps<{
  currentRow: ManagerOrderItem | null
}>()

const emits = defineEmits(['shipping'])

// 汇总：总金额与总件数
const totalQuantity = computed(() => {
  if (!props.currentRow?.product) return 0
  return props.currentRow.product.reduce((sum, brand) => {
    return (
      sum +
      brand.models.reduce((ms, model) => {
        return ms + model.items.reduce((is, item) => is + (item.quantity || 0), 0)
      }, 0)
    )
  }, 0)
})

const totalAmount = computed(() => {
  if (!props.currentRow?.product) return 0
  return props.currentRow.product.reduce((sum, brand) => {
    return (
      sum +
      brand.models.reduce((ms, model) => {
        return (
          ms +
          model.items.reduce((is, item) => is + (item.unitPrice || 0) * (item.quantity || 0), 0)
        )
      }, 0)
    )
  }, 0)
})

// 处理发货
const handleShipping = () => {
  emits('shipping', props.currentRow?._id)
}
</script>

<template>
  <div class="cart-drawer">
    <template v-if="currentRow && currentRow.product && currentRow.product.length">
      <div class="brand" v-for="(brand, bIdx) in currentRow.product" :key="bIdx">
        <div class="brand-title">品牌：{{ brand.brand }}</div>
        <div class="models">
          <div class="model" v-for="(model, mIdx) in brand.models" :key="mIdx">
            <div class="model-title">型号：{{ model.model }}</div>
            <el-table
              :data="model.items"
              size="small"
              border
              style="width: 100%; margin-bottom: 12px"
            >
              <el-table-column label="图片" width="80" align="center">
                <template #default="{ row }">
                  <img
                    :src="row.imageUrl"
                    alt="img"
                    style="width: 48px; height: 48px; border-radius: 4px"
                  />
                </template>
              </el-table-column>
              <el-table-column label="名称" prop="name" min-width="140" />
              <el-table-column label="描述" prop="description" min-width="180" />
              <el-table-column label="单价" width="90" align="center">
                <template #default="{ row }">{{ row.unitPrice }}</template>
              </el-table-column>
              <el-table-column label="数量" width="80" align="center" prop="quantity" />
              <el-table-column label="SKU" min-width="140">
                <template #default="{ row }">
                  <span>{{ row.selectSku?.name || '-' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <el-empty description="无商品数据" />
    </template>

    <div class="summary-row">
      <div class="summary-item">
        <span class="summary-label">总件数：</span>
        <span class="summary-value">{{ totalQuantity }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">总金额：</span>
        <span class="summary-value">{{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>

    <div class="drawer-footer">
      <el-button
        class="ship-btn"
        @click="handleShipping"
        :disabled="currentRow?.state !== '备货中'"
        :class="{ disabledShipBtn: currentRow?.state !== '备货中' }"
        >发货
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-drawer {
  padding: 12px;
}

.brand-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.model-title {
  margin: 8px 0;
  color: #666;
}

.summary-row {
  margin-top: 4px;
  padding: 8px 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;

  .summary-item {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .summary-label {
    color: #666;
    font-size: 13px;
  }

  .summary-value {
    color: $jel-brandColor;
    font-weight: 600;
  }
}

.drawer-footer {
  margin-top: 0;
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;

  .ship-btn {
    background-color: $jel-brandColor;
    border-color: $jel-brandColor;
    color: #fff;
  }

  .disabledShipBtn {
    background-color: $jel-border;
    border-color: $jel-border;
    color: #fff;
  }
}
</style>
