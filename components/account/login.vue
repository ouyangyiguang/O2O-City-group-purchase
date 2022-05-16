<template>
	<view class="account-list-box">
		<u-cell-group :border="border">
			<view class="panel-main">
				<u-cell-item
					:title="item.title"
					:value="item.value"
					@click="$tools.routerTo(item.path)"
					:border-bottom="borderBottom"
					v-for="(item, index) in cells"
					:key="index"
				></u-cell-item>
			</view>
		</u-cell-group>
			<u-gap height="40"></u-gap>

			<view class="u-flex account-reg">
				<view class="u-flex-1 u-text-left" @click="$tools.routerTo('/pages/account/register/register')">注册</view>
				<view class="u-flex-1 u-text-right" @click="$tools.routerTo('/pages/account/findPassword/findPassword')">忘记密码</view>
			</view>
	</view>
</template>

<script>
export default {
	name: 'login',
	props: {
		// 是否显示边框
		border: {
			type: Boolean,
			default: false
		},
		// 是否显示内边框
		borderBottom: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			cells: [
				{
					title: '账号密码登录',
					value: '',
					path: '/pages/account/login/pwd-login'
				},
				{
					title: '短信验证码登录',
					value: '',
					path: '/pages/account/login/sms-login'
				}
			]
		};
	},
	methods: {

	}
};
</script>

<style lang="scss" scoped>
.account-list-box {
	.panel-main {
		padding: 10rpx 0;
	}
	.account-reg{
		padding: 0rpx 32rpx;
	}
}
</style>
