<template>
	<view class="account-list-box">
		<u-cell-group :border="border">
			<view class="panel-main">
				<u-cell-item v-if="list.model.mobile == ''" title="手机号" value="未绑定" @click="openPage('bindMobile/bindMobile')" :border-bottom="borderBottom"></u-cell-item>
				<u-cell-item v-if="list.model.mobile != ''" title="手机号" :value="list.model.mobile" @click="mobileAction" :border-bottom="borderBottom"></u-cell-item>
<!-- 				<u-cell-item v-if="list.model.email == ''" title="邮箱" value="未绑定" @click="openPage('bindEmail/bindEmail')" :border-bottom="borderBottom"></u-cell-item>
				<u-cell-item v-if="list.model.email != ''" title="邮箱" :value="list.model.email" @click="emailAction" :border-bottom="borderBottom"></u-cell-item> -->
				<u-cell-item v-if="list.model.weixin == ''" title="微信账号" value="未绑定"  :border-bottom="borderBottom"></u-cell-item>
				<u-cell-item v-if="list.model.weixin != ''" title="微信账号" :value="list.model.weixin" @click="weixinAction" :border-bottom="borderBottom"></u-cell-item>
<!-- 				<u-cell-item v-if="list.model.weibo == ''" title="微博账号" value="未绑定" @click="openPage('bindWeibo/bindWeibo')" :border-bottom="borderBottom"></u-cell-item>
				<u-cell-item v-if="list.model.weibo != ''" title="微博账号" :value="list.model.weibo" @click="weiboAction" :border-bottom="borderBottom"></u-cell-item>
				<u-cell-item v-if="list.model.qq == ''" title="QQ 账号" value="未绑定" @click="openPage('bindQq/bindQq')" :border-bottom="borderBottom"></u-cell-item>
				<u-cell-item v-if="list.model.qq != ''" title="QQ 账号" :value="list.model.qq" @click="qqAction" :border-bottom="borderBottom"></u-cell-item>
				<u-cell-item v-if="list.model.taobao == ''" title="淘宝账号" value="未绑定" @click="openPage('bindTaobao/bindTaobao')" :border-bottom="borderBottom"></u-cell-item>
				<u-cell-item v-if="list.model.taobao != ''" title="淘宝账号" :value="list.model.taobao" @click="taobaoAction" :border-bottom="borderBottom"></u-cell-item>
				<u-cell-item
					v-if="list.model.alipay == ''"
					title="支付宝账号"
					value="未绑定"
					@click="openPage('bindAlipay/bindAlipay')"
					:border-bottom="borderBottom"
				></u-cell-item>
				<u-cell-item v-if="list.model.alipay != ''" title="支付宝账号" :value="list.model.alipay" @click="alipayAction" :border-bottom="borderBottom"></u-cell-item>
				<u-cell-item @click="seted" :border-bottom="borderBottom"></u-cell-item> -->
			</view>
		</u-cell-group>
		<u-action-sheet v-model="select.mobile.show" :list="select.mobile.list" :tips="select.mobile.tips" @click="mobileClick"></u-action-sheet>
<!-- 		<u-action-sheet v-model="select.email.show" :list="select.email.list" :tips="select.email.tips" @click="emailClick"></u-action-sheet> -->
		<u-action-sheet v-model="select.weixin.show" :list="select.weixin.list" :tips="select.weixin.tips" @click="weixinClick"></u-action-sheet>
<!-- 		<u-action-sheet v-model="select.weibo.show" :list="select.weibo.list" :tips="select.weibo.tips" @click="weiboClick"></u-action-sheet>
		<u-action-sheet v-model="select.qq.show" :list="select.qq.list" :tips="select.qq.tips" @click="qqClick"></u-action-sheet>
		<u-action-sheet v-model="select.taobao.show" :list="select.taobao.list" :tips="select.taobao.tips" @click="taobaoClick"></u-action-sheet>
		<u-action-sheet v-model="select.alipay.show" :list="select.alipay.list" :tips="select.alipay.tips" @click="alipayClick"></u-action-sheet> -->
	</view>
</template>

<script>

export default {
	name: 'account-bind',
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
		},
		user:{}
	},
	data() {
		return {
			list: {
				model: {
					/* 手机号 */
					mobile: '',
					/* 邮箱 */
					email: '',
					/* 微信账号 */
					weixin: '',
					/* 微博账号 */
					weibo: '',
					/* QQ账号 */
					qq: '',
					/* 淘宝账号 */
					taobao: '',
					/* 支付宝账号 */
					alipay: ''
				}
			},
			select: {
				mobile: {
					show: false,
					tips: {
						text: '手机号',
						fontSize: 24
					},
					list: [
						{
							text: '换绑',
							fontSize: 28
						},
						{
							text: '解绑',
							fontSize: 28
						}
					]
				},
				email: {
					show: false,
					tips: {
						text: '邮箱',
						fontSize: 24
					},
					list: [
						{
							text: '换绑',
							fontSize: 28
						},
						{
							text: '解绑',
							fontSize: 28
						}
					]
				},
				weixin: {
					show: false,
					tips: {
						text: '微信账号',
						fontSize: 24
					},
					list: [
						{
							text: '换绑',
							fontSize: 28
						},
						{
							text: '解绑',
							fontSize: 28
						}
					]
				},
				weibo: {
					show: false,
					tips: {
						text: '微博账号',
						fontSize: 24
					},
					list: [
						{
							text: '换绑',
							fontSize: 28
						},
						{
							text: '解绑',
							fontSize: 28
						}
					]
				},
				qq: {
					show: false,
					tips: {
						text: 'QQ 账号',
						fontSize: 24
					},
					list: [
						{
							text: '换绑',
							fontSize: 28
						},
						{
							text: '解绑',
							fontSize: 28
						}
					]
				},
				taobao: {
					show: false,
					tips: {
						text: '淘宝账号',
						fontSize: 24
					},
					list: [
						{
							text: '换绑',
							fontSize: 28
						},
						{
							text: '解绑',
							fontSize: 28
						}
					]
				},
				alipay: {
					show: false,
					tips: {
						text: '支付宝账号',
						fontSize: 24
					},
					list: [
						{
							text: '换绑',
							fontSize: 28
						},
						{
							text: '解绑',
							fontSize: 28
						}
					]
				}
			}
		};
	},
	mounted() {
		console.log('user====',this.user.userInfo.is_mobile);
		if (this.user.userInfo.is_mobile==1){
			this.list.model.mobile = this.user.userInfo.mobile;
		}
	},
	methods: {
		openPage(path) {
			this.$Router.push({
				path: '/pages/account/' + path
			});
		},
		mobileAction() {
			this.select.mobile.show = true;
		},
		mobileClick(index) {
			if (index == 0) {
this.$Router.push({
				path: '/pages/account/updateMobile/updateMobile'
				});
			}
			if (index == 1) {
this.$Router.push({
				path: '/pages/account/unbindMobile/unbindMobile'
				});
			}
		},
		emailAction() {
			this.select.email.show = true;
		},
		emailClick(index) {
			if (index == 0) {
this.$Router.push({
				path: '/pages/account/updateEmail/updateEmail'
				});
			}
			if (index == 1) {
this.$Router.push({
				path: '/pages/account/unbindEmail/unbindEmail'
				});
			}
		},
		weixinAction() {
			this.select.weixin.show = true;
		},
		weixinClick(index) {
			if (index == 0) {
this.$Router.push({
				path: '/pages/account/updateWeixin/updateWeixin'
				});
			}
			if (index == 1) {
this.$Router.push({
				path: '/pages/account/unbindWeixin/unbindWeixin'
				});
			}
		},
		weiboAction() {
			this.select.weibo.show = true;
		},
		weiboClick(index) {
			if (index == 0) {
this.$Router.push({
				path: '/pages/account/updateWeibo/updateWeibo'
				});
			}
			if (index == 1) {
this.$Router.push({
				path: '/pages/account/unbindWeibo/unbindWeibo'
				});
			}
		},
		qqAction() {
			this.select.qq.show = true;
		},
		qqClick(index) {
			if (index == 0) {
this.$Router.push({
				path: '/pages/account/updateQq/updateQq'
				});
			}
			if (index == 1) {
this.$Router.push({
				path: '/pages/account/unbindQq/unbindQq'
				});
			}
		},
		taobaoAction() {
			this.select.taobao.show = true;
		},
		taobaoClick(index) {
			if (index == 0) {
this.$Router.push({
				path: '/pages/account/updateTaobao/updateTaobao'
				});
			}
			if (index == 1) {
this.$Router.push({
				path: '/pages/account/unbindTaobao/unbindTaobao'
				});
			}
		},
		alipayAction() {
			this.select.alipay.show = true;
		},
		alipayClick(index) {
			if (index == 0) {
this.$Router.push({
				path: '/pages/account/updateAlipay/updateAlipay'
				});
			}
			if (index == 1) {
this.$Router.push({
				path: '/pages/account/unbindAlipay/unbindAlipay'
				});
			}
		},
		seted() {
			this.list.model.mobile = '130****9351';
			this.list.model.email = 'test@163.com';
			this.list.model.weixin = '青松';
			this.list.model.weibo = '青松';
			this.list.model.qq = '青松';
			this.list.model.taobao = '青松';
			this.list.model.alipay = '青松';
		}
	}
};
</script>

<style lang="scss" scoped>
.account-list-box {
	.panel-main {
		padding: 10rpx 0;
	}
	.btn-line {
		margin: 0 32rpx;
	}
}
</style>
