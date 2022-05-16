<template>
	<qs-page>
		<!-- #ifndef H5 -->
		<view class="ns">我的余额</view>
		<!-- #endif -->
		<view class="flexView">
			<view class="scrollView">
				<view class="head-read">
					<view class="flex">
						<image class="read-img" src="userData.headimgurl" mode="aspectFill" />
						<view class="flex-box">
							<view class="flex-box-text">姓名：</view>
							<view class="flex-box-text">手机号：</view>
						</view>
						<view class="arrow arrow-one" @click="showModal = true"><span>名词解释</span></view>
					</view>
				</view>
				<view class="white-box">
					<view class="tx">
						<view class="tx-grid">
							<view class="tx-grid-text">
								<view class="title">可提现余额</view>
								<view class="money">
									<text></text>
									<text class="money-b">元</text>
								</view>
							</view>
						</view>
						<view class="tx-grid" @click="navTo('/pages/withdraw/index')"><span class="tx-grid-comm-sign">立即提现</span></view>
					</view>
					<view class="palace palace-one">
						<view class="palace-grid">
							<view class="palace-grid-text">
								<view class="palace-grid-text-data">
									<text></text>
									<text class="palace-grid-text-data-b">元</text>
								</view>
								<view class="palace-grid-text-name">即将到账</view>
							</view>
						</view>
						<view class="palace-grid">
							<view class="palace-grid-text">
								<view class="palace-grid-text-data">
									<text></text>
									<text class="palace-grid-text-data-b">元</text>
								</view>
								<view class="palace-grid-text-name">累计到账</view>
							</view>
						</view>
						<view class="palace-grid">
							<view class="palace-grid-text">
								<view class="palace-grid-text-data">
									<text></text>
									<text class="palace-grid-text-data-b">元</text>
								</view>
								<view class="palace-grid-text-name">累计提现</view>
							</view>
						</view>
					</view>
				</view>
				<view class="top">
					<tui-tabs
						:tabs="tabs"
						:height="88"
						:currentTab="currentTab"
						:sliderWidth="150"
						:sliderHeight="60"
						bottom="50%"
						color="#888"
						selectedColor="#fff"
						sliderBgColor="#ff8a4a"
						@change="changeTab"
					></tui-tabs>
				</view>
				<view class="list-view">
					<view class="list-item" v-for="(item, index) in list" :key="index" hover-class="hover" :hover-stay-time="150" bindtap="detail">
						<view class="content-box">
							<view class="des-box">
								<view class="tit">{{ currentTab == 3 ? '流水号：' + item.extract_no : '订单号：' + item.order_no }}</view>
								<view v-if="currentTab == 3" class="source" :style="{ color: item.status == 1 ? '#4caf50' : item.status == 2 ? '#ff1e0f' : '#00b7ff' }">
									提现{{ item.status == 1 ? '成功' : item.status == 2 ? '失败' : '处理中' }}
								</view>
								<view class="time">{{ item.create_time }}</view>
							</view>
						</view>
						<view class="money" :class="{ less: is_withdraw }">{{ is_withdraw ? '-' : '+' }}{{ currentTab == 3 ? item.real_money : item.money }}</view>
					</view>
				</view>
				<view class="tip">仅显示近半年内的收支记录</view>
			</view>
<!-- 			<view class="cu-modal" :class="showModal ? 'show' : ''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">名词解释</view>
						<view class="action" @tap="showModal = false"><text class="cuIcon-close text-red"></text></view>
					</view>
					<view class="padding-xl" style="text-align: left;">
						<view>
							<text class="text-red">可提现余额：</text>
							<text>当前您可以提现的金额</text>
						</view>
						<view class="margin-top-sm">
							<text class="text-red">即将到账：</text>
							<text>交易中的金额，交易成功后可提现</text>
						</view>
						<view class="margin-top-sm">
							<text class="text-red">累计到账：</text>
							<text>累计交易成功的金额</text>
						</view>
						<view class="margin-top-sm">
							<text class="text-red">累计提现：</text>
							<text>累计提现成功的金额</text>
						</view>
						<view class="margin-top-sm"><text class="text-red">*注：所有金额币种均为人民币，单位为元，符号￥</text></view>
					</view>
					<view class="cu-bar bg-white justify-end">
						<view class="action"><button class="cu-btn bg-green margin-left" @tap="showModal = false">我已知晓</button></view>
					</view>
				</view>
			</view> -->
		</view>
	</qs-page>
</template>

<script>

export default {

	data() {
		return {
			is_withdraw: false,
			list: [],
			userData: {},
			showModal: false,
			date: 'incomeMonth',
			currentTab: 0,
			tabs: [
				{
					name: '本月收入'
				},
				{
					name: '今日收入'
				},
				{
					name: '昨日收入'
				},
				{
					name: '提现记录'
				}
			]
		};
	},
	onLoad() {

	},
	methods: {
		async loadData() {
			this.userData = '';
			this.list = '';
		},
		async getFundList() {
			if (this.currentTab == 3) {
				
			} else {
				
			}
		},
		changeTab(e) {
			this.currentTab = e.index;
			this.list = [];
			if (this.currentTab == 3) {
				this.is_withdraw = true;
			} else if (this.currentTab == 0) {
				this.date = 'incomeMonth';
				this.is_withdraw = false;
			} else if (this.currentTab == 1) {
				this.date = 'incomeToday';
				this.is_withdraw = false;
			} else if (this.currentTab == 2) {
				this.date = 'incomeYesterday';
				this.is_withdraw = false;
			}
			this.$api.loading(true);
			this.getFundList();
			setTimeout(() => {
				this.$api.loading(false);
			}, 500);
		},
		navTo(url) {
			uni.navigateTo({
				url
			});
		}
	},
	onPullDownRefresh() {
		this.loadData();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 500);
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #fff;
}
.ns {
	width: 100%;
	height: 60px;
	text-align: center;
	line-height: 200rpx;
	color: white;
	font-size: 34rpx;
	font-weight: bold;
	background: linear-gradient(to right, #ff8440, #ff1e0f);
}
.top {
	margin-top: 20rpx;
}
.flexView {
	width: 100%;
	height: 100%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	.scrollView {
		width: 100%;
		height: 100%;
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
		padding-bottom: 116rpx;
		.head-read {
			background: linear-gradient(to right, #ff8440, #ff1e0f);
			background-color: #ff8440;
			padding-bottom: 100rpx;
			.flex {
				display: flex;
				align-items: center;
				padding: 50rpx;
				position: relative;
				.read-img {
					width: 120rpx;
					height: 120rpx;
					border-radius: 100%;
					overflow: hidden;
					margin-right: 20rpx;
					border: 4rpx solid rgba(255, 255, 255, 0.3);
				}
				.flex-box {
					flex: 1;
					min-width: 0;
					font-size: 26rpx;
					color: #333;
					&-text {
						margin: 10rpx 0;
						color: #f5f5f5;
						font-weight: normal;
					}
				}
				.arrow {
					position: relative;
					padding-right: 30rpx;
					span {
						font-size: 28rpx;
						color: white;
					}
					&:after {
						content: ' ';
						display: inline-block;
						height: 12rpx;
						width: 12rpx;
						border-width: 4rpx 4rpx 0 0;
						border-color: #848484;
						border-style: solid;
						transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
						position: relative;
						top: -4rpx;
						position: absolute;
						top: 50%;
						margin-top: -8rpx;
						right: 4rpx;
						border-radius: 2rpx;
					}
				}
				.arrow-one:after {
					border-color: white;
					margin-top: -6rpx;
				}
			}
		}
		.white-box {
			width: 94%;
			background: white;
			border-radius: 10rpx;
			margin: -120rpx auto 20rpx;
			box-shadow: 0 6rpx 20rpx #e7e7e7;
			.tx {
				padding-top: 26rpx;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				align-content: center;
				&-grid {
					box-sizing: border-box;
					&:first-child {
						margin-left: 40rpx;
					}
					&-comm-sign {
						display: block;
						border-radius: 40rpx 0 0 40rpx;
						font-size: 26rpx;
						padding: 16rpx 44rpx;
						background: linear-gradient(to right, #fef082, #ffc551);
						background-color: #fef082;
						color: #cf4400;
					}
					&-text {
						display: block;
						color: #333;
						font-size: 26rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						.title {
							font-size: 26rpx;
							font-weight: normal;
							color: #ff6423;
						}
						.money {
							font-size: 60rpx;
							color: #ff6423;
							letter-spacing: 2rpx;
							margin-bottom: 10rpx;
							&-b {
								font-size: 28rpx;
							}
						}
					}
				}
			}
			.palace {
				padding-bottom: 20rpx;
				overflow: hidden;
				display: flex;
				justify-content: center;
				&-grid {
					flex: 1;
					position: relative;
					box-sizing: border-box;
					&:not(:last-child) {
						&:after {
							width: 1rpx;
							height: 80rpx;
							background: #fddece;
							content: ' ';
							display: inline-block;
							position: absolute;
							top: 0;
							right: 0;
						}
					}
					&-text {
						display: block;
						text-align: center;
						color: #333;
						font-size: 32rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						&-name {
							font-size: 26rpx;
							font-weight: normal;
							color: #ff8a4a;
						}
						&-data {
							font-size: 32rpx;
							color: #ff8a4a;
							letter-spacing: 2rpx;
							margin-bottom: 5rpx;
							&-b {
								font-size: 20rpx;
							}
						}
					}
				}
			}
		}
	}
}
.list-view {
	position: relative;
	width: 100%;
	overflow: hidden;
}

.list-item {
	width: 100%;
	padding: 30rpx 28rpx;
	box-sizing: border-box;
	background: #fff;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	border-bottom: 1rpx solid #eaeef1;
}

.item-last::after {
	left: 0 !important;
}

.content-box {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.des-box {
	min-height: 80rpx;
	padding-left: 28rpx;
	box-sizing: border-box;
	vertical-align: top;
	color: #333;
	font-size: 24rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.tit {
	font-size: 32rpx;
	max-width: 420rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.source {
	margin: 12rpx 0;
}
.time {
	color: #888;
}

.money {
	font-size: 38rpx;
	font-weight: 500;
	color: #ff1e0f;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-left: 20rpx;
}

.less {
	color: #4caf50 !important;
}
.tip {
	margin-top: 50rpx;
	display: flex;
	justify-content: center;
	align-content: center;
	font-size: 24rpx;
	color: #888;
}
</style>
