<template>
	<account-page :title="title" :desc="desc">
		<view class="account-form-box">
			<u-form :model="model" ref="uForm" :errorType="form.errorType">
                <countryCode @eventChange="countryChange"></countryCode>
				<u-form-item class="form-item" label="手机号" prop="mobile" :label-position="form.labelPosition">
					<u-input v-model="model.mobile" placeholder="您的常用手机号" type="text" />
				</u-form-item>
				<u-form-item class="form-item" label="短信验证码" prop="verifyCode" :label-position="form.labelPosition">
					<u-input v-model="model.verifyCode" placeholder="请输入验证码" type="number" />
					<u-button slot="right" type="success" size="mini" @click="getCode">{{ codeTips }}</u-button>
				</u-form-item>
				<u-form-item class="form-item" label="密码" prop="password" :label-position="form.labelPosition">
					<u-input v-model="model.password" placeholder="6-20位的数字和字母" type="password" />
				</u-form-item>
				<u-form-item class="form-item" label="确认密码" prop="confirmPassword" :label-position="form.labelPosition">
					<u-input v-model="model.confirmPassword" placeholder="请再次输入密码" type="password" />
				</u-form-item>
				<u-form-item class="form-item" label="邀请码" :label-position="form.labelPosition">
					<u-input v-model="model.parentcode" placeholder="推荐人邀请码,可选填" type="text" />
				</u-form-item>
			</u-form>
			<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>

			<u-gap height="40"></u-gap>

			<u-button type="primary" @click="submit">立即提交</u-button>

			<u-gap height="40"></u-gap>

			<view class="u-flex u-row-between">
				<view @click="$tools.routerTo('/pages/account/register/username-register')">帐号注册</view>
				<view @click="$tools.routerTo('/pages/account/login/pwd-login')">登录</view>
			</view>
		</view>

		<u-gap height="40"></u-gap>
	</account-page>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import countryCode from '@/components/countrycode.vue'
export default {
	data() {
		return {

			title: '手机号注册',
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
				/* 密码 */
				password: '',
				/* 确认密码 */
				confirmPassword: ''
			},
			rules: {
				mobile: [
					{
						required: true,
						message: '请输入手机号',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: '手机号格式不正确',
						trigger: ['change', 'blur']
					}
				],
				verifyCode: [
					{
						required: true,
						message: '请输入验证码',
						trigger: ['change', 'blur']
					},
					{
						type: 'number',
						message: '验证码只能为数字',
						trigger: ['change', 'blur']
					},
					{
						len: 4,
						message: '验证码长度为4位数字',
						trigger: ['change', 'blur']
					}
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur']
					},
					{
						min: 6,
						max: 20,
						message: '密码长度在6到20个字符',
						trigger: ['change', 'blur']
					},
					{
						pattern: /^[0-9a-zA-Z]*$/g,
						transform(value) {
							return String(value);
						},
						message: '密码为字母或数字',
						trigger: ['change', 'blur']
					}
				],
				confirmPassword: [
					{
						required: true,
						message: '请再次输入密码',
						trigger: ['change', 'blur']
					},
					{
						validator: (rule, value, callback) => {
							return value === this.model.password;
						},
						message: '两次输入的密码不相等',
						trigger: ['change', 'blur']
					}
				]
			}
		};
	},
	components: {
		countryCode
	},
	computed: {
		...mapState(['user'])
	},
	onLoad(options) {
		let query=this.user.chatScenesInfo.query;
		if (query == null || query=="" || query==undefined){}else{
			let querys=JSON.parse(query);
			this.model.parentcode=querys.s	
		}
	}, 
	methods: {
		countryChange(data){
			console.log(data);
		},
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
                return new Promise((resolve, reject) => {
                    this.$api('user.register', {
						method:'reg_of_mobile',//reg_of_username //reg_of_mobile
						mobile:this.model.mobile,
						password:this.model.password,
						parentcode:this.model.parentcode,
						smsverify:this.model.verifyCode
					}).then(res => {
						 if(res.code==200){
							this.$store.commit('USER_INFO',res.data);
							this.$store.commit('TOKEN_INFO',res.data.access_token);
							uni.setStorageSync('fromLogin','');//要跳转到的页面
							this.$store.dispatch('setTokenAndBack',res.data.access_token);
						}
                        resolve(true);
                    }).catch((e)=>{
						console.log(e);
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
					title: '正在获取验证码',
					mask: true
				});
                return new Promise((resolve, reject) => {
                    this.$api('user.getsmscode', {
						scenetype:'2',//
						mobile:this.model.mobile,
						password:this.model.password,
						parentcode:this.parentcode,
					}).then(res => {
						console.log(res);
						if (res.code==200){
							setTimeout(() => {
								uni.hideLoading();
								// 这里此提示会被this.start()方法中的提示覆盖
								this.$u.toast('验证码已发送');
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
				return;
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码',
					mask: true
				});
				setTimeout(() => {
					uni.hideLoading();
					// 这里此提示会被this.start()方法中的提示覆盖
					this.$u.toast('验证码已发送');
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}, 2000);
			} else {
				this.$u.toast('倒计时结束后再发送');
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
