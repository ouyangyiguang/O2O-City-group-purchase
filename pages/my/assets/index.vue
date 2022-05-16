<template>
  <view class="u-padding-20">
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading
      isFullScreen
      :active="loadstatus"
      :text="loadstxt"
      color="#63E5CB"
      textColor="#63E5CB"
    />
    <view v-if="!hasLogin">
      <u-empty text="请先登陆" mode="permission"></u-empty>
    </view>
    <view class="wallet-panel-box u-m-b-30">
      <view class="bg">
        <view class="wdzc">
          <u-row gutter="0" justify="center">
            <u-col span="7"> 我的资产 </u-col>
            <u-col span="5" text-align="right">
              <u-icon name="yonghuxinxi" custom-prefix="customicon" size="30"></u-icon>
              <text class="u-font-sm">资产安全保障中</text>
            </u-col>
          </u-row>
		  <u-gap height="20"></u-gap>
          <u-row gutter="0" justify="center">
            <u-col span="12">
              <h3> {{ coin_list.totalassets }} CNY</h3>
            </u-col>
          </u-row>
        </view>
		<!--<view class="wdcz">
          <u-row gutter="16" justify="center">
            <u-col span="4" text-align="center"  @click="$tools.routerTo('/pages/my/assets/congcoin')"> 收款</u-col>
            <u-col span="4" text-align="center" @click="$tools.routerTo('/pages/my/assets/zhuancoin_1')">转帐</u-col>
            <u-col span="4" text-align="center" @click="$tools.routerTo('/pages/my/assets/ticoin')">提币</u-col>
          </u-row>
        </view> -->
      </view>
    </view>

    <view class="base-panel-box">
      <view class="htitle">
        <view>
          <i
            ><u-icon
              name="yonghuxinxi"
              custom-prefix="customicon"
              size="30"
            ></u-icon
          ></i>
          我的资产
        </view>
      </view>
      <view class="item" v-for="(item, index) in coin_list.list" :key="index" @click=" $Router.push({path: '/pages/my/assets/flowlist',query: { id: item.id, name: item.name },}) ">
        <u-row gutter="0" justify="space-between">
          <u-col span="2">
            <image :src="item.icons"
              mode="aspectFill"
              style="width: 100rpx; height: 100rpx"/>
          </u-col>
          <u-col span="8">
            <view class="demo-layout bg-purple-light">
              <h4>{{ item.name }}</h4>
              <text>{{ item.balance_total }} {{ item.unit }}</text>
            </view>
          </u-col>
          <u-col span="2" text-align="right">
            <u-icon name="arrow-right" color="#969799" size="28"></u-icon>
          </u-col>
        </u-row>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      title: {
        "font-size": "38rpx",
      },
      coin_list: {},
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      loadstxt: "loading...",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  async onLoad() {
    this.hasLogin = this.$store.getters.loginFlag;
    let flag = await this.getcoin();
  },
  methods: {
    getcoin() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("assets.coin_list", {})
          .then((res) => {
            if (res.code == 200) {
              this.coin_list = res.data;
            }
            resolve(true);
            this.loadstatus = false;
          })
          .catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },
  },
};
</script>

<style lang="scss">
.wallet-panel-box {
  background: linear-gradient(109.34deg, #1589d9 6.3%, #62d8e6 99.92%);
  color: #ffffff;
  border-radius: 20rpx;
  .bg {
    height: 160rpx;
    background: url(@/static/boxbg.png) no-repeat top right;
    background-size: auto 100%;
    -o-background-size: auto 100%;
    -webkit-background-size: auto 100%;
    background-position: right 0rpx;
    .wdzc {
      padding: 30rpx 30rpx 20rpx 30rpx;
      border-bottom: 0px solid rgba(255, 255, 255, 0.2);
    }
    .wdcz {
      padding-top: 14rpx;
    }
  }
}
</style>
