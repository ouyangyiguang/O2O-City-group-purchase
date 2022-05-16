<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus" :text="loadstxt"/>
    <view class="u-padding-20" v-if="!hasLogin">
      <u-empty text="请先登陆" mode="permission"></u-empty>
    </view>

    <view class="u-padding-20" v-else>
      <u-empty text="没有数据"
        mode="data"
        :show="flow_list.length === 0"
        v-if="loadstatus == false"></u-empty>
      <view class="u-p-t-10" v-if="flow_list.length > 0">
        <view v-for="(item, index) in flow_list"
          :key="index"
          class="base-panel-box u-m-b-30">
          <view class="htitle">
            <i><u-icon name="user" custom-prefix="customicon" size="30"></u-icon></i>
            <view class="right u-font-xs">时间</view>
          </view>
          <view class="item" style="height: 320rpx">
            <u-row gutter="16" justify="space-between">
              <u-col span="6">总资产</u-col>
              <u-col span="6">投资本金</u-col>
              <u-col span="6" style="font-size: 40rpx"></u-col>
              <u-col span="6">累积收益</u-col>
            </u-row>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>


<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      flow_list: [],
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      loadstxt: "loading...",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad(options) {
    let query;
    if (options.query) {
      query = JSON.parse(options.query);
    }
    this.hasLogin = this.$store.getters.loginFlag;
    //this.getpagecontrac();
  },

  methods: {
    getpagecontrac() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.loadstxt = "加载矿机中";

        this.$api("mining.contrac_list", {})
          .then((res) => {
            console.log(res);
            if (res.Code == 1) {
              this.flow_list = res.Data.ItemList;
            }
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
<style lang="scss" scoped>
</style>
