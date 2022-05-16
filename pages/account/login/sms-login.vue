<template>
	<account-page :title="title" :desc="desc" default_id="0086">
		<view class="account-form-box">
			<u-form :model="model" ref="uForm" :errorType="form.errorType">
				<countryCode @eventChange="countryChange"></countryCode>
				<u-form-item class="form-item" :label="this.$t('mobile')" prop="mobile" :label-position="form.labelPosition">
					<u-input v-model="model.mobile" :placeholder="this.$t('usercenter.pls_required')+this.$t('mobile')" type="text" />
				</u-form-item>
				<u-form-item class="form-item" :label="this.$t('loginpage.smscode')" prop="verifyCode" :label-position="form.labelPosition">
					<u-input v-model="model.verifyCode" :placeholder="this.$t('usercenter.pls_required')+this.$t('loginpage.smscode')" type="number" />
					<u-button slot="right" type="success" size="mini" @click="getCode">{{ codeTips }}</u-button>
				</u-form-item>
			</u-form>
		
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		
			<u-gap height="40"></u-gap>
		
			<u-button type="primary" @click="submit">{{$t("login")}}</u-button>
		
			<u-gap height="40"></u-gap>
		
			<view class="u-flex">
				<view class="u-flex-1 u-text-left" @click="$tools.routerTo('/pages/account/login/pwd-login')">{{$t("loginpage.pwdlogin")}}</view>
				<view class="u-flex-1 u-text-center" @click="$tools.routerTo('/pages/account/register/username-register')">{{$t("reg")}}</view>
				<view class="u-flex-1 u-text-right" @click="$tools.routerTo('/pages/account/findPassword/mobile-findPassword')">{{$t("loginpage.forgotpwd")}}</view>
			</view>
		</view>

		<u-gap height="40"></u-gap>
	</account-page>
</template>

<script>
import countryCode from '@/components/countrycode.vue'
export default {
	data() {
		return {
			title: this.$t('loginpage.vercodelogin'),
			desc: '',
			codeTips: '',
			form: {
				errorType: ['message'],
				labelPosition: 'top'
			},
			model: {
				/* 手机号 */
				mobile: '',
				/* 验证码 */
				verifyCode: '',
				mobicountry:''
			},
			rules: {
				mobile: [
					{
						required: true,
						message: this.$t('usercenter.pls_required')+this.$t('mobile'),
						trigger: ['change', 'blur']
					}
				],
				verifyCode: [
					{
						required: true,
						message: this.$t('usercenter.pls_required')+this.$t('loginpage.smscode'),
						trigger: ['change', 'blur']
					},
					{
						type: 'number',
						message: this.$t('loginpage.verifcodemustnum'),
						trigger: ['change', 'blur']
					},
					{
						len: 4,
						message: this.$t('loginpage.verifcode4len'),
						trigger: ['change','blur']
					}
				]
			}
		};
	},
	components: {
		countryCode
	},
	methods: {
		countryChange(data){
			this.model.mobicountry=data.value;
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					return new Promise((resolve, reject) => {
                    this.$api('user.login', {
						logintype:'login_by_mobile',//login_by_mobile
						mobile:this.model.mobile,
						mobicode:this.model.mobicountry,
						smsverify:this.model.verifyCode,
					}).then(res => {
                        if (res.code==200){
							this.$store.commit('USER_INFO',res.data);
							this.$store.commit('TOKEN_INFO',res.data.access_token);
							uni.setStorageSync('fromLogin','');//要跳转到的页面
							this.$store.dispatch('setTokenAndBack',res.data.access_token);
							resolve(true);
						}
                    }).catch((e)=>{
                        resolve(false);
                    });
					})
				} else {
					console.log('验证失败');
				}
			});
		},
		codeChange(text) {
			this.codeTips = text;
		},
		// 获取验证码
		getCode() {
			if (this.$refs.uCode.canGetCode) {
				uni.showLoading({
					title: this.$t('loginpage.verifloading'),
					mask: true
				});
                return new Promise((resolve, reject) => {
                    this.$api('user.getsmscode', {
						scenetype:'0',//0为要检查是否存在
						mobile:this.model.mobile,
						mobicode:this.model.mobicountry,
					}).then(res => {
						console.log(res)
						if (res.code==200){
							setTimeout(() => {
								uni.hideLoading();
								// 这里此提示会被this.start()方法中的提示覆盖
								this.$u.toast(this.$t('loginpage.verifsendok'));
								// 通知验证码组件内部开始倒计时
								this.$refs.uCode.start();
							}, 500);
							resolve(true);
						}
                    }).catch((e)=>{
						console.log(e);
                        resolve(false);
                    });
                })


			} else {
				this.$u.toast(this.$t('loginpage.verifsendagain'));
			}
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	}
};
</script>

<style lang="scss" scoped>
.account-form-box {
	padding: 0 32rpx;
}
</style>
