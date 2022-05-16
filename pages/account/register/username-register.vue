<template>
	<account-page :title="title" :desc="desc">
		<public-module></public-module>
		<view class="account-form-box">
			<u-form :model="model" ref="uForm" :errorType="form.errorType">
				<u-form-item class="form-item" label="用户名" prop="username" :label-position="form.labelPosition">
					<u-input v-model="model.username" placeholder="请输入用户名" type="text" />
				</u-form-item>
				<u-form-item class="form-item" label="密码" prop="password" :label-position="form.labelPosition">
					<u-input v-model="model.password" placeholder="密码长度在6到20个字符" type="password" />
				</u-form-item>
				<u-form-item class="form-item" label="确认密码" prop="confirmPassword" :label-position="form.labelPosition">
					<u-input v-model="model.confirmPassword" placeholder="请再次输入确认密码" type="password" />
				</u-form-item>
				<u-form-item class="form-item" label="推荐码" :label-position="form.labelPosition">
					<u-input v-model="model.parentcode" placeholder="请输入推荐码" type="text" />
					<text slot="right" style="font-size: 22rpx;">默认推荐码：{{user.basebusinessInfo.salt}}</text>
				</u-form-item>
			</u-form>

			<u-gap height="40"></u-gap>

			<u-button type="primary" @click="submit">注册</u-button>

			<u-gap height="40"></u-gap>

			<view class="u-flex u-row-between">
				<!--view @click="$tools.routerTo('/pages/account/register/mobile-register')">手机号注册</view-->
				<view @click="$tools.routerTo('/pages/account/login/pwd-login')">登陆</view>
			</view>
		</view>

		<u-gap height="40"></u-gap>
	</account-page>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
export default {
	data() {
		return {
			title: "注册",
			desc: '',
			codeTips: '',
			form: {
				errorType: ['message'],
				labelPosition: 'top'
			},
			model: {
				/* 邮箱 */
				username: '',
				/* 密码 */
				password: '',
				/* 确认密码 */
				confirmPassword: '',
				parentcode:''
			},
			rules: {
				 username: [
					{
						required: true,
						message: "请输入用户名",
						trigger: ['change', 'blur']
					},
				],
				password: [
					{
						required: true,
						message: "请输入密码",
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
						message: '两次输入的密码不一样',
						trigger: ['change', 'blur']
					}
				],
			},
			parentcode:''
		};
	},
	computed: {
		...mapState(['user'])
	},
	onLoad(options) {
		console.log(this.user);
		let query=this.user.chatScenesInfo.query;
		if (query == null || query=="" || query==undefined){}else{
			let querys=JSON.parse(query);
			this.model.parentcode=querys.s	
		}
		// if (options.query!=''){
		// 	let query=JSON.parse(options.query);
		// 	this.model.parentcode=query.s
		// 	}
		// if(options.q){
		//   let q = decodeURIComponent(options.q);
		//   this.model.parentcode = this.tools.getQueryString(q, 's');
		// }

		}, 
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {

                return new Promise((resolve, reject) => {
                    this.$api('user.register', {
						method:'reg_of_username',//reg_of_username //reg_of_mobile
						username:this.model.username,
						password:this.model.password,
						parentcode:this.model.parentcode,
						bid:this.user.bid
					}).then(res => {
						console.log(res);
						if (res.code==200){
							this.$store.commit('USER_INFO',res.data);
							this.$store.commit('TOKEN_INFO',res.data.member_token);
							uni.setStorageSync('fromLogin','');//要跳转到的页面
							this.$store.dispatch('setTokenAndBack',res.data.member_token);
							resolve(true);
						}
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
