<template>
  <view>
    <view class="cu-card case isCard">
      <view class="cu-item shadow">
        <view class="image">
          <image :src="orderinfo.walletaddress_qrcode" mode="widthFix"></image>
        </view>
        <view class="cu-list padding">
          <view>请在30分钟内转帐到此钱包</view>
          <view class="cu-item"
            >充币数:{{ orderinfo.totalamount }}
            {{ orderinfo.unit }}(请一定按此数量充币)</view
          >
          <view class="cu-item">
            <view class="content flex-sub">
              <view class="text-grey"
                >钱包地址：{{ orderinfo.walletaddress }}</view
              >
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="flex flex-direction padding" v-show="orderinfo.status != 1">
      <button class="cu-btn bg-blue margin-tb-sm lg" @tap="dodel()">
        取消本次充币
      </button>
    </view>
    <view class="padding-sm" v-show="orderinfo.status == 1">
      <view class="bg-gradual-blue padding radius text-center shadow-blur">
        <view class="text-lg">OK</view>
        <view class="margin-top-sm text-Abc">本次交易已完成</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      orderinfo: {},
      delcoinid: "",
    };
  },
  async onLoad(options) {
    const userinfo = uni.getStorageSync("userInfo");
    if (userinfo && userinfo.token) {
      this.login(userinfo);
      this.$store.dispatch("resetuserinfo");
    }
    this.delcoinid = options.coinorderid;
    this.app.get({
      url: this.serverAddress + "/index.php?m=vueapi&c=wallet&a=getcoinorder",
      method: "GET",
      data: {
        uid: this.userInfo.users_id,
        token: this.userInfo.token,
        orderid: options.coinorderid,
      },
      success: (res) => {
        this.orderinfo = res.order;
        console.log(this.orderinfo);
      },
      errmsg: (res) => {},
    });

    //this.shouinfo=this.userInfo.balance[options.coinid];
    //console.log(this.shouinfo)
  },
  computed: {
    ...mapState(["serverAddress", "userInfo"]),
  },
  methods: {
    ...mapMutations(["login"]),
    dodel() {
      this.app.get({
        url: this.serverAddress + "/index.php?m=vueapi&c=wallet&a=delcoinorder",
        method: "GET",
        data: {
          uid: this.userInfo.users_id,
          token: this.userInfo.token,
          orderid: this.delcoinid,
        },
        success: (res) => {
          this.$api.msg(res.msg);
          this.app.navTo("/pages/assets/details", {
            coinid: this.orderinfo.cointype,
          });
        },
        errmsg: (res) => {},
      });
    },
  },
};
</script>
<style lang="scss">
</style>
