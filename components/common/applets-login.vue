<template>
	<view>
		<!-- 登录弹窗 -->
		<view class="loginMask" v-if="user.loginPopupShow" @click="closePopup"></view>
		<view class="loginPopup" v-if="user.loginPopupShow">
			<view class="loginBox">
				<image class="logo" src="../../static/logo.png"></image>
				<view class="platformName">登录弹窗</view>
				<view class="description">fasdfsfasdf</view>
			</view>
			<button type="primary" hover-class="active" open-type="getUserInfo" @getuserinfo="onAuthorization">授权登录</button>
		</view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
// #ifdef MP-WEIXIN
import { getUserInfo } from '@/plugins/applogin.js';
// #endif
let clear;
export default {
	data() {
		return {
		};
	},
	computed: {
		...mapState(['user'])
	},
	methods: {
		...mapMutations(['setLoginPopupShow']),
		//授权登录
		onAuthorization: function(e) {
			if (e.detail.errMsg == 'getUserInfo:ok') {
				console.log(e);
				var userInfo = e.detail;
				this.setLoginPopupShow(false);
				getUserInfo(userInfo, 'authorized');
			}
		},
		closeLogin() {
			if (this.user.loginPopupShow && this.user.tokenInfo) {
				this.setLoginPopupShow(false);
			}
		},
		//关闭弹窗
		closePopup() {
			this.setLoginPopupShow(false);
		}
	}
};
</script>

<style lang="scss" scoped>

.loginMask {
	position: fixed;
	top: 0upx;
	left: 0upx;
	right: 0upx;
	bottom: 0upx;
	background-color: rgba(0, 0, 0, 0.4);
	z-index: 10;
}
.loginPopup {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	width: 500upx;
	background-color: #fff;
	border-radius: 20upx;
	overflow: hidden;
	z-index: 11;

	.loginBox {
		padding: 30upx 15upx 40upx 15upx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.logo {
			width: 160upx;
			height: 160upx;
			border-radius: 20%;
		}

		.platformName {
			font-size: 24upx;
			color: #999;
			margin-top: 10upx;
		}

		.description {
			margin-top: 15upx;
			font-size: 30upx;
			color: #333;
		}
	}

	button {
		border-radius: 0upx;
		background-color: #FF9900;
	}
	.active {
		background-color: #FF9900;
		opacity: 0.8;
	}
}
</style>
