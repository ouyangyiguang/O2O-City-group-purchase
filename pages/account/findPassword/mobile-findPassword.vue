<template>
	<account-page :title="title" :desc="desc">
		<view class="account-form-box">
			<u-form :model="model" ref="uForm" :errorType="form.errorType">
				<countryCode @eventChange="countryChange"></countryCode>
				<u-form-item class="form-item" :label="this.$t('mobile')" prop="mobile" :label-position="form.labelPosition">
					<u-input v-model="model.mobile" :placeholder="this.$t('usercenter.pls_required')+this.$t('mobile')" type="text" />
				</u-form-item>
				<u-form-item class="form-item" :label="this.$t('smscode')" prop="verifyCode" :label-position="form.labelPosition">
					<u-input v-model="model.verifyCode" :placeholder="this.$t('usercenter.pls_required')+this.$t('loginpage.smscode')" type="number" />
					<u-button slot="right" type="success" size="mini" @click="getCode">{{ codeTips }}</u-button>
				</u-form-item>
				<u-form-item class="form-item" :label="this.$t('loginpage.newpwd')" prop="newPassword" :label-position="form.labelPosition">
					<u-input v-model="model.newPassword" :placeholder="this.$t('usercenter.pls_required')+this.$t('loginpage.newPassword')" type="password" />
				</u-form-item>
				<u-form-item class="form-item" :label="this.$t('loginpage.confirmpwd')" prop="confirmPassword" :label-position="form.labelPosition">
					<u-input v-model="model.confirmPassword" :placeholder="this.$t('usercenter.pls_required')+this.$t('loginpage.confirmpwd')" type="password" />
				</u-form-item>
			</u-form>
		
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		
			<u-gap height="40"></u-gap>
		
			<u-button type="primary" @click="submit">{{$t("submit")}}</u-button>
		
			<u-gap height="40"></u-gap>
		
			<view class="u-flex u-row-between">
				<!-- <view @click="openPage('findPassword/email-findPassword')">邮箱找回密码</view> -->
				<!-- <view @click="openPage('login/login')">登录</view> -->
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
			title: this.$t('loginpage.mobilefindpwd'),
			desc: '',
			codeTips:'',
			form: {
				errorType: ['message'],
				labelPosition: 'top'
			},
			model: {
				/* 手机号 */
				mobile: '',
				/* 验证码 */
				verifyCode: '',
				/* 新密码 */
				newPassword: '',
				/* 确认密码 */
				confirmPassword: '',
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
						trigger: ['change', 'blur']
					}
				],
				newPassword: [
					{
						required: true,
						message: this.$t('usercenter.pls_required')+this.$t('loginpage.newpwd'),
						trigger: ['change', 'blur']
					},
					{
						min: 6,
						max: 20,
						message: this.$t('loginpage.passwordlength'),
						trigger: ['change', 'blur']
					},
					{
						pattern: /^[0-9a-zA-Z]*$/g,
						transform(value) {
							return String(value);
						},
						message: this.$t('loginpage.passwordverifstr'),
						trigger: ['change', 'blur']
					}
				],
				confirmPassword: [
					{
						required: true,
						message: this.$t('loginpage.againpwd'),
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							return value === this.model.newPassword;
						},
						message: this.$t('loginpage.inconsistentpasswords'),
						trigger: ['change', 'blur']
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
		openPage(path) {
			this.$Router.push({
				path: '/pages/account/' + path
			});
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					return this.$u.toast('验证通过');
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
				// 模拟向后端请求验证码
				uni.showLoading({
					title: this.$t('loginpage.verifloading'),
					mask: true
				});
				setTimeout(() => {
					uni.hideLoading();
					// 这里此提示会被this.start()方法中的提示覆盖
					this.$u.toast(this.$t('loginpage.verifsendok'));
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}, 2000);
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
