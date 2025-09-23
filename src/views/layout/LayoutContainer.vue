<script setup lang="ts">
import {
  Box,
  CaretBottom,
  Cellphone,
  Coin,
  Collection,
  Crop,
  EditPen,
  Iphone,
  Medal,
  MessageBox,
  Monitor,
  PictureRounded,
  PieChart,
  Star,
  SwitchButton,
  User,
  VideoCamera
} from '@element-plus/icons-vue'

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const loginOut = () => {
  console.log('退出登录')
}
</script>

<template>
  <!-- 单一容器：左侧 Aside + 右侧内容容器（Header/Main/Footer） -->
  <el-container class="layoutContainer">
    <el-aside width="180px" style="background-color: #ffffff; border-right: 2px solid #f1f1f1">
      <div class="logo">
        <img class="logoPic" src="@/assets/images/logo.png" alt="logo" />
        <p style="color: #d62731">管理系统</p>
      </div>
      <el-menu
        active-text-color="#d62731"
        background-color="#ffffff"
        class="el-menu-vertical-demo"
        :default-active="$route.path"
        text-color="#333"
        :router="true"
        @select="handleSelect"
      >
        <!-- 首页 -->
        <el-menu-item index="/home">
          <el-icon>
            <Monitor />
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <!--门店管理-->
        <el-menu-item index="/store">
          <el-icon>
            <VideoCamera />
          </el-icon>
          <span>门店管理</span>
        </el-menu-item>
        <el-menu-item index="/type">
          <el-icon>
            <Box />
          </el-icon>
          <span>类型管理</span>
        </el-menu-item>
        <!--用户管理-->
        <el-menu-item index="/user">
          <el-icon>
            <User />
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <!--会员管理-->
        <el-menu-item index="/vip">
          <el-icon>
            <Medal />
          </el-icon>
          <span>会员管理</span>
        </el-menu-item>
        <!--分类管理-->
        <el-sub-menu index="/product">
          <template #title>
            <el-icon>
              <MessageBox />
            </el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/product/brand">
            <el-icon>
              <Iphone />
            </el-icon>
            <span>手机品牌</span>
          </el-menu-item>
          <el-menu-item index="/product/type">
            <el-icon>
              <Cellphone />
            </el-icon>
            <span>手机型号</span>
          </el-menu-item>
          <el-menu-item index="/product/mo">
            <el-icon>
              <PictureRounded />
            </el-icon>
            <span>手机膜</span>
          </el-menu-item>
        </el-sub-menu>
        <!--办理会员-->
        <el-menu-item index="/vipPro">
          <el-icon>
            <Star />
          </el-icon>
          <span>会员产品</span>
        </el-menu-item>
        <!--订单管理-->
        <el-sub-menu index="/order">
          <template #title>
            <el-icon>
              <Collection />
            </el-icon>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/order/vipOrder">
            <el-icon>
              <Cellphone />
            </el-icon>
            <span>会员订单</span>
          </el-menu-item>
          <el-menu-item index="/order/managerOrder">
            <el-icon>
              <Cellphone />
            </el-icon>
            <span>店长订单</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 佣金设置 -->
        <el-menu-item index="/commission">
          <el-icon>
            <Coin />
          </el-icon>
          <span>佣金设置</span>
        </el-menu-item>
        <!--  结算管理  settlement-->
        <el-menu-item index="/settlement">
          <el-icon>
            <PieChart />
          </el-icon>
          <span>结算管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容容器 -->
    <el-container class="contentContainer">
      <el-header>
        <div class="header-left">早安，今天又是充满活力的一天</div>
        <el-dropdown placement="bottom-end">
          <span class="el-dropdown__box">
            <el-avatar />
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item @click="loginOut" command="logout" :icon="SwitchButton"
                >退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layoutContainer {
  height: 100vh;
  color: #ffffff;
  background-color: $jel-backGroudColor;
}

/* 右侧内容容器：列布局 + 自身滚动，让 Header sticky 生效 */
.contentContainer {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: auto;
}

.logo {
  padding: 0 4px;
  display: flex;
  align-items: center;
  font-size: 20px;

  .logoPic {
    margin-right: 10px;
    width: fit-content;
    height: 50px;
    border-radius: 50%;
  }
}

.el-menu-vertical-demo {
  border: none;
}

.el-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $jel-font-title;
  padding: 0 12px;

  .header-left {
    font-size: 20px;
    color: $jel-font-dec2;
  }

  .el-dropdown__box {
    display: flex;
    align-items: center;

    .el-icon {
      color: $jel-font-dec2;
      margin-left: 10px;
    }

    &:active,
    &:focus {
      outline: none;
    }
  }
}

.el-main {
  flex: 1;
  overflow: auto;
}
</style>
