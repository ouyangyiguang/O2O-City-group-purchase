<template>
  <account-page :title="title" :desc="desc">
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus"/>
    <view class="account-form-box">
      <u-form ref="uForm" :errorType="form.errorType">
        <coinselect @eventChange="coinChange" :forminfo="form" :exclude_id="0" :default_id="default_id"></coinselect>
        <u-form-item class="form-item" :label="$t('assets.quantityavailable')" :label-position="form.labelPosition" :label-width="form.labelwidth">
          <u-input placeholder=""  type="text"
            :value="coin_info.balance_available + ' ' + coin_info.unit"
            :disabled="true" />
        </u-form-item>

        <u-form-item
          class="form-item"
          :label="$t('assets.withdrawalnum')"
          prop="nums"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth">
          <u-input v-model="nums"
            :placeholder="$t('usercenter.pls_required') + $t('assets.withdrawalnum')"
            type="text"
            @input="jsrealnums()"/>
        </u-form-item>
        <u-form-item class="form-item" label="系统手续费"  :label-position="form.labelPosition" :label-width="form.labelwidth">
          <u-input  placeholder="" :value="coin_info.tibi_sys_shouxufei * 10 + '%'" :disabled="true" type="text"/>
          <text slot="right" style="font-size: 22rpx">{{
            coin_info.tibi_msg
          }}</text>
        </u-form-item>
        <u-form-item
          class="form-item"
          label="转帐手续费"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth">
          <u-input
            placeholder=""
            :value="tibi_shouxufei + coin_info.unit"
            :disabled="true"
            type="text"/>
          <text slot="right" style="font-size: 22rpx">转帐手续费</text>
        </u-form-item>
		
        <u-form-item class="form-item"
          :label="$t('assets.fullname')"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth">
          <u-input v-model="user.userInfo.realname" placeholder="实名认证后显示名字" type="text" :disabled="true"/>
        </u-form-item>
		
				<view class="u-p-t-10">
					<u-row gutter="0" justify="space-between">
						<u-col span="2"><view>微信</view></u-col>
						<u-col span="8"><view v-if="user.userInfo.wechatID!=''">{{user.userInfo.wechatID}}</view><view v-else>未设置</view></u-col>
						<u-col span="2"><u-switch v-model="is_wx" size="30"></u-switch></u-col>
						</u-col>
					</u-row>
				</view>
				<view class="u-p-t-10">
					<u-row gutter="0" justify="space-between">
						<u-col span="2"><view>支付宝</view></u-col>
						<u-col span="8"><view v-if="user.userInfo.alipayID!=''">{{user.userInfo.alipayID}}</view><view v-else>未设置</view></u-col>
						<u-col span="2"><u-switch v-model="is_al"  size="30"></u-switch></u-col>
						</u-col>
					</u-row>
				</view>
				<view class="u-p-t-10"> 
					<u-row gutter="0" justify="space-between">
						<u-col span="2"><view v-if="user.userInfo.bankAccount!=''">{{user.userInfo.bankName}}</view><view v-else>收款银行</view></u-col>
						<u-col span="8"><view v-if="user.userInfo.bankAccount!=''">{{user.userInfo.bankAccount}}</view><view v-else>未设置</view></u-col>
						<u-col span="2"><u-switch v-model="is_bnk"  size="30"></u-switch></u-col>
						</u-col>
					</u-row>
				</view>
        <u-form-item class="form-item"
          :label="$t('assets.transfertruenum')"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth">
          <u-input
            v-model="realnums"
            placeholder=""
            type="text"
            :disabled="true"
          />
        </u-form-item>
      </u-form>

      <u-gap height="40"></u-gap>

      <u-button type="primary" @click="submit">{{$t('submit')}}</u-button>
    </view>

    <u-gap height="40"></u-gap>
  </account-page>
</template>

<script>
import coinselect from "@/components/coinselect.vue";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    coinselect,
  },
  data() {
    return {
      loadstatus: false,
      loadstxt: "loadstxt",
      title: this.$t('assets.withdrawal'),
      desc: this.$t('assets.withdrawaldesc'),
      default_id: 1,
      form: {
        errorType: ["message"],
        labelPosition: "left",
        labelwidth: "160",
      },
      coin_info: {
        balance_available: "",
        unit: "",
        tibi_shouxufei: "",
        wallet: [],
      },
      tibi_shouxufei: "",
      coinclass: "",
      nums: "",
      realnums: "0",
      walletaddress: "",
      rules: {
        nums: [
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              if (this.nums == "") {
                callback(new Error("请输入数量"));
              } else {
                if (this.nums <= this.coin_info.balance_available) {
                  callback();
                } else {
                  callback(new Error("可用余额不足"));
                }
              }
            },
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ],
        walletaddress: [
          {
            required: true,
            message: "请填写收款地址",
            trigger: ["change", "blur"],
          },
        ],
      },
      radiovalue: "",
	  bankname:'',
      is_wx: true,
      is_al: true,
      is_bnk: true,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad(option) {
    if (option.query) {
      let query = JSON.parse(option.query);
      this.default_id = 1;
    }
    if (this.user.userInfo.wechatID == "" || this.user.userInfo.wechatID == null) this.is_wx = false;
    if (this.user.userInfo.alipayID == "" || this.user.userInfo.alipayID == null) this.is_al = false;
    if (this.user.userInfo.bankAccount == "" || this.user.userInfo.bankAccount == null) this.is_bnk = false;
    uni.setNavigationBarTitle({
      title: this.$t('assets.withdrawal'),
    });
  },
  methods: {
    jsrealnums() {
      if (this.nums > this.coin_info.balance_available) {
        this.realnums = 0;
      } else {
        this.realnums = (
          this.nums -
          this.tibi_shouxufei -
          this.nums * this.coin_info.tibi_sys_shouxufei
        ).toFixed(4);
      }
    },
    radioGroupChange(e) {
      console.log(e);
      this.radiovalue = e;
      for (let i = 0; i < this.coin_info.wallet.length; i++) {
        if (this.coin_info.wallet[i].type == e) {
          this.tibi_shouxufei = (this.coin_info.wallet[i].tibi_shouxufei*1).toFixed(2);
        }
      }
    },
    coinChange(data) {
      this.coinclass = data.value;
      this.$api("assets.coin_detail", {
        coinclass: data.value,
      }).then((res) => {
		  //console.log(res)
          if (res.code == 200) {
            this.coin_info = res.data;
            this.tibi_shouxufei = (res.data.tibi_shouxufei*1).toFixed(2);
            this.radiovalue = res.data.type;
          }
        })
        .catch((e) => {});
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
		  if (this.user.userInfo.is_realname==0){
			  this.$tools.msg("请先实名认证");return;
		  }
		  if(this.user.userInfo.wechatID == null && this.user.userInfo.alipayID == null && this.user.userInfo.bankAccount==null){
			  this.$tools.msg("请先完善支付帐号");return;
		  }
		  if(this.is_wx== false && this.is_al == false && this.is_bnk==false){
			  this.$tools.msg("请至少选择一个提现方式");return;
		  }
		  if (this.is_wx==true && this.user.userInfo.wechatID == null){
			  this.$tools.msg("您选择提现到微信，但微信未完善");return;
		  }
		  if (this.is_al==true && this.user.userInfo.alipayID == null){
			  this.$tools.msg("您选择提现到支付宝，但支付宝未完善");return;
		  }
		  if (this.is_bnk==true && this.user.userInfo.bankAccount == null){
			  this.$tools.msg("您选择提现到银行，但银行未完善");return;
		  }
        if (valid) {
          this.loadstatus = true;
          this.loadstxt = "数据更新中";
          return new Promise((resolve, reject) => {
            this.$api("assets.ti_bi", {
              coinclass: this.coinclass,
              //wallettype: '',
              nums: this.nums,
			  is_wx: this.is_wx,
			  is_al: this.is_al,
			  is_bnk: this.is_bnk,
              walletaddress: this.bankname+' '+this.walletaddress+' '+this.user.userInfo.realname,
            }).then((res) => {
                this.loadstatus = false;
                console.log("edit", res);
                if (res.code == 200) {
                  this.$router.push({
                    path: "/pages/my/success",
                    query: {
                      title: "提现成功",
                      msg: res.msg,
                    },
                  });
                } else {
                  this.$tools.msg(res.msg);
                }
              }).catch((e) => {
                this.loadstatus = false;
                resolve(false);
              });
          });
        } else {
          console.log("验证失败");
        }
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
