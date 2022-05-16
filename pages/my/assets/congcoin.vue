<template>
  <account-page :title="title" :desc="desc">
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
    <view class="account-form-box">
      <u-form ref="uForm" :errorType="form.errorType">
        <coinselect
          @eventChange="coinChange"
          :forminfo="form"
          :exclude_id="1"
          :default_id="default_id"
        ></coinselect>
      </u-form>
      <u-tabs
        :list="walletlist"
        :is-scroll="false"
        :current="current"
        @change="change"
        bg-color="#15161A"
        active-color="#63E5CB"
        inactive-color="#ffffff"
      ></u-tabs>
      <view>
        <view class="Rechargebox" @click="clipboardcopy">
          <view class="u-text-center"><image :src="showwallet.qrcCode" /></view>
          <view class="wallet">{{ showwallet.account }}</view>
          <view class="u-text-center">复制钱包地址</view>
        </view>

        <view class="u-text-center">{{ auto_discover_status }}</view>
      </view>
    </view>

    <u-gap height="40"></u-gap>
  </account-page>
</template>

<script>
import coinselect from "@/components/coinselect.vue";
import { mapState, mapMutations } from "vuex";
import clipboard from "@/components/ican-clipBoard.js";
export default {
  components: {
    coinselect,
  },
  data() {
    return {
      loadstatus: false,
      loadstxt: "loadstxt",
      title: "收款",
      desc: "金额过少将不会上帐。12次网络确认后到帐。",
      form: {
        errorType: ["message"],
        labelPosition: "left",
        labelwidth: "150",
      },
      coin_info: [],
      default_id: 2,
      coinclassid: "",
      walletlist: [],
      showwallet: "",
      current: 0,
      auto_discover_status: "",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad(option) {
    if (option.query) {
      let query = JSON.parse(option.query);
      this.default_id = query.selectcoinid;
    }
    setTimeout(() => {
      this.getCoin();
    }, 1000);
  },
  methods: {
    clipboardcopy() {
      let that = this;
      uni.setClipboardData({
        data: that.showwallet.account,
        success: function (data) {
          that.$u.toast("钱包地址复制成功");
        },
        fail: function (err) {},
        complete: function (res) {},
      });
    },
    coinChange(data) {
      this.coinclassid = data.value;
      this.getCoin();
    },
    change(index) {
      this.showwallet = this.walletlist[index];
      this.current = index;
      this.autodiscover(this.showwallet.account);
    },
    autodiscover(wallet) {
      if (wallet == "") return;
      this.auto_discover_status = "充值检测中...";
      this.$api("assets.autodiscover", {
        walletaddress: wallet,
      })
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.auto_discover_status = res.data.msg;
          } else {
            this.auto_discover_status = "";
          }
        })
        .catch((e) => {});
    },
    getCoin() {
      this.$api("assets.coin_detail", {
        coinclass: this.coinclassid,
      })
        .then((res) => {
          if (res.code == 200) {
            this.walletlist = [];
            this.coin_info = res.data;

            for (let i = 0; i < this.coin_info.wallet.length; i++) {
              this.walletlist.push({
                name: this.coin_info.wallet[i].type,
                qrcCode: this.coin_info.wallet[i].qrcCode,
                account: this.coin_info.wallet[i].account,
              });
            }
            this.showwallet = this.walletlist[0];
            this.autodiscover(this.showwallet.account);
          }
        })
        .catch((e) => {});
    },
  },
};
</script>

<style lang="scss">
.account-form-box {
  padding: 0 32rpx;
}
.Rechargebox {
  background: $u-cell-hover;
  padding: 30rpx;
  border-radius: 20rpx;
  margin-top: 20rpx;
  .wallet {
    padding: 10rpx;
    text-align: center;
  }
  image {
    width: 500rpx;
    height: 500rpx;
    margin: auto;
  }
}
</style>
