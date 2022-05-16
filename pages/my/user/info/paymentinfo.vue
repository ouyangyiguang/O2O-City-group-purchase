<template>
  <view>
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
        <u-form-item
          class="form-item"
          label="微信号"
          :label-position="form.labelPosition"
        >
          <u-input v-model="wechatID" placeholder="请填写微信号" type="text" />
        </u-form-item>
        <u-form-item
          class="form-item"
          label="支付宝帐号"
          :label-position="form.labelPosition"
        >
          <u-input
            v-model="alipayID"
            placeholder="请填写支付宝帐号"
            type="text"
          />
        </u-form-item>
        <u-form-item
          class="form-item"
          label="银行信息(请填写与实名认证一致的卡号信息)"
          :label-position="form.labelPosition"
        >
          <u-input
            v-model="bankName"
            placeholder="请填写银行名称"
            type="text"
          />
          <text slot="right" style="font-size: 22rpx"
            >收款人：{{ user.userInfo.realname }}</text
          >
        </u-form-item>
        <u-form-item class="form-item">
          <u-input
            v-model="bankHang"
            placeholder="请填写银行开户行"
            type="text"
          />
        </u-form-item>
        <u-form-item class="form-item">
          <u-input
            v-model="bankAccount"
            placeholder="请填写银行帐号"
            type="text"
          />
        </u-form-item>
      </u-form>

      <u-button type="primary" @click="submit">确认设置</u-button>
    </view>

    <u-gap height="40"></u-gap>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      loadstatus: false,
      loadstxt: "loadstxt",
      title: "收款信息",
      desc: "请正确填写以下收款信息",
      form: {
        errorType: ["message"],
        labelPosition: "top",
      },
      input: {},
      wechatID: "",
      alipayID: "",
      bankName: "",
      bankHang: "",
      bankAccount: "",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad() {
    this.wechatID = this.user.userInfo.wechatID;
    this.alipayID = this.user.userInfo.alipayID;
    this.bankName = this.user.userInfo.bankName;
    this.bankHang = this.user.userInfo.bankHang;
    this.bankAccount = this.user.userInfo.bankAccount;
  },
  methods: {
    submit() {
      this.loadstatus = true;
      this.loadstxt = "数据更新中";
      return new Promise((resolve, reject) => {
        this.$api("user.userlist_edit", {
          wechatID: this.wechatID,
          alipayID: this.alipayID,
          bankName: this.bankName,
          bankHang: this.bankHang,
          bankAccount: this.bankAccount,
        })
          .then((res) => {
            if (res.code == 200) {
              //this.$store.commit('USER_INFO',res.data);
              this.$store.dispatch("getUserInfo");
              uni.navigateBack(1);
              //this.$tools.routerTo('/pages/my/user/user')
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
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>

<style lang="scss" scoped>
.account-form-box {
  padding: 0 32rpx;
}
</style>
