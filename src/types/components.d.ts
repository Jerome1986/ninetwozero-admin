import PageContainer from '@/components/PageContainer.vue'
import UserChannel from '@/views/user/components/UserChannel.vue'
import CateChannel from '@/views/cate/components/CateChannel.vue'
import StoreChannel from '@/views/store/components/StoreChannel.vue'
import BrandChannel from '@/views/productPage/phoneBrand/conponents/BrandChannel.vue'
import PhoneMoChannel from '@/views/productPage/phoneMo/components/PhoneMoChannel.vue'
import VipProductChannel from '@/views/vipProduct/components/VipProductChannel.vue'
import VipOrderChannel from '@/views/order/vipOrder/components/VipOrderChannel.vue'
import GiftChannel from '@/views/giftPages/components/GiftChannel.vue'

declare module 'vue' {
  export interface GlobalComponents {
    PageContainer: typeof PageContainer
    UserChannel: typeof UserChannel
    CateChannel: typeof CateChannel
    StoreChannel: typeof StoreChannel
    BrandChannel: typeof BrandChannel
    PhoneMoChannel: typeof PhoneMoChannel
    VipProductChannel: typeof VipProductChannel
    VipOrderChannel: typeof VipOrderChannel
    GiftChannel: typeof GiftChannel
  }
}

export type JelPageContainerInstance = InstanceType<typeof PageContainer>
export type JelUserChannel = InstanceType<typeof UserChannel>
export type JelCateChannel = InstanceType<typeof CateChannel>
export type JelStoreChannel = InstanceType<typeof StoreChannel>
export type JelBrandChannel = InstanceType<typeof BrandChannel>
export type JelPhoneMoChannel = InstanceType<typeof PhoneMoChannel>
export type JelVipProductChannel = InstanceType<typeof VipProductChannel>
export type JelVipOrderChannel = InstanceType<typeof VipOrderChannel>
export type JelGiftChannel = InstanceType<typeof GiftChannel>
