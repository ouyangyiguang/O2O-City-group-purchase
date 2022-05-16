<template>
  <view>
    <!--不要公共模块-->
    <!--isFullScreen 可以实其全屏显示-->
	<ourLoading isFullScreen :active="loadstatus" :text="loadstxt" color="#63E5CB" textColor="#63E5CB"/>
    <view style="text-align: center">
      <u-gap height="180"></u-gap>
      <image
        src="/static/logo.png"
        mode="aspectFit"
        style="width: 260rpx; height: 140rpx"
      ></image>
    </view>
    <view class="account-form-box">
      <u-form :model="model" ref="uForm" :errorType="form.errorType">
        <u-form-item
          class="form-item"
          label="用户名"
          prop="username"
          :label-position="form.labelPosition"
        >
          <u-input v-model="model.username"
			placeholder="请填写用户名"
            type="text"/>
        </u-form-item>
        <u-form-item
          class="form-item"
          label="密码"
          prop="password"
          :label-position="form.labelPosition">
          <u-input
            v-model="model.password"
            placeholder="请填写密码"
            type="password"/>
        </u-form-item>
      </u-form>

      <u-gap height="40"></u-gap>

      <u-button type="primary" @click="submit">登陆</u-button>

      <u-gap height="40"></u-gap>

      <view class="u-flex u-p-l-20 u-p-r-20">
        <!-- <view class="u-flex-1 u-text-left" @click="$tools.routerTo('/pages/account/login/sms-login')">验证码登陆</view> -->
        <view class="u-flex-1 u-text-center" @click="$tools.routerTo('/pages/account/register/username-register')">注册</view>
        <!-- <view class="u-flex-1 u-text-right" @click="$tools.routerTo('/pages/account/findPassword/mobile-findPassword')">忘记密码</view> -->
      </view>
    </view>

    <u-gap height="40"></u-gap>
  </view>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
export default {
  data() {
    return {
      loadstatus: false,
	  loadstxt:'loading',
      form: {
        errorType: ["message"],
        labelPosition: "top",
      },
      model: {
        /* 账号 */
        username: "",
        /* 密码 */
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["change", "blur"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"],
          },
          {
            min: 6,
            max: 20,
            message: '密码长度在6到20个字符',
            trigger: ["change", "blur"],
          },
          {
            pattern: /^[0-9a-zA-Z]*$/g,
            transform(value) {
              return String(value);
            },
            message: '密码为字母或数字',
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  computed: {
  	...mapState(['user'])
  },
  onLoad(){
	console.log(this.user)  
  },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          this.loadstatus = true;
          this.$store.commit("OUT_LOGIN");
          setTimeout(() => {
            return new Promise((resolve, reject) => {
              this.$api("user.login", {
                logintype: "login_by_username", //login_by_mobile
                username: this.model.username,
                password: this.model.password,
				bid:this.user.bid
              })
                .then((res) => {
                  if(res.code==200){
					  this.$store.commit("USER_INFO", res.data);
					  this.$store.commit("TOKEN_INFO", res.data.member_token);
					  uni.setStorageSync("fromLogin", ""); //要跳转到的页面
					  this.$store.dispatch(
						"setTokenAndBack",
						res.data.member_token
					  );
				let bussiness = {
					bid:res.data.bid,
				};
				this.$store.commit("setbasebusinessID",bussiness);
				
					  resolve(true);
				  }
                  this.loadstatus = false;
                })
                .catch((e) => {
                  this.loadstatus = false;
                  console.log(e);
                  resolve(false);
                });
            });
          }, 1);
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
