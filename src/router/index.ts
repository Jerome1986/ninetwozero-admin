import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

// createRouter 创建路由实例，===> new VueRouter()
// 1. history模式: createWebHistory()   http://xxx/user
// 2. hash模式: createWebHashHistory()  http://xxx/#/user

// vite 的配置 import.meta.env.BASE_URL 是路由的基准地址，默认是 ’/‘
// https://vitejs.dev/guide/build.html#public-base-path

// 如果将来你部署的域名路径是：http://xxx/my-path/user
// vite.config.ts  添加配置  base: my-path，路由这就会加上 my-path 前缀了

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      children: [
        { path: '/home', component: () => import('@/views/home/HomePage.vue') },
        { path: '/store', component: () => import('@/views/store/StoreManager.vue') },
        {
          path: '/type',
          component: () => import('@/views/type/TypeSet.vue')
        },
        { path: '/user', component: () => import('@/views/user/UserPages.vue') },
        {
          path: '/vip',
          component: () => import('@/views/vip/VipPages.vue')
        },
        {
          path: '/product',
          component: () => import('@/views/productPage/ProductPage.vue'),
          children: [
            {
              path: '/product/brand',
              component: () => import('@/views/productPage/phoneBrand/PhoneBrand.vue')
            },
            {
              path: '/product/type',
              component: () => import('@/views/productPage/phoneType/PhoneType.vue')
            },
            {
              path: '/product/mo',
              component: () => import('@/views/productPage/phoneMo/PhoneMo.vue')
            },
            {
              path: '/settlement',
              component: () => import('@/views/settlement/SettlementPage.vue')
            }
          ]
        },
        { path: '/vipPro', component: () => import('@/views/vipProduct/VipProduct.vue') },
        {
          path: '/order',
          component: () => import('@/views/order/Order.vue'),
          children: [
            {
              path: '/order/vipOrder',
              component: () => import('@/views/order/vipOrder/VipOrder.vue')
            },
            {
              path: '/order/managerOrder',
              component: () => import('@/views/order/managerOrder/ManagerOrder.vue')
            }
          ]
        },
        {
          path: '/commission',
          component: () => import('@/views/commission/CommissionSetting.vue')
        }
      ]
    },
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }
  ]
})

// 全局路由守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  const remainingMs = userStore.expiresAt - Date.now() // 毫秒数

  if ((!userStore.token || remainingMs <= 0) && to.path !== '/login') {
    return '/login'
  }
})

export default router
