<template>
	<view class="container" style="padding:20rpx;">
		<u-navbar :is-back="true" title="我的订单"  :border-bottom="false" :custom-back="BackPage" title-color="#000000"  back-icon-color="#000000">
		</u-navbar>
		<view style="padding-bottom: 100rpx;">
			<view class="bg-white">
				<view class="section">
					<!-- store info begin -->
					<list-cell :hover="false" v-if="order_info.shopinfo.orderType=='takein'">
						<view class="w-100 d-flex align-items-center">
							<view class="d-flex flex-column">
								<view class="w-100 font-size-lg text-color-base text-truncate u-m-b-10">{{order_info.shopinfo.name}}</view>
								<view class="w-100 d-flex align-items-center overflow-hidden">
									<view class="font-size-sm text-color-assist">{{order_info.shopinfo.address}}</view>
								</view>
							</view>
						</view>
					</list-cell>
					<list-cell :hover="false" v-else>
						<view class="w-100 d-flex align-items-center">
							<view class="d-flex flex-column w-60">
								<view class="w-100 font-size-lg text-color-base text-truncate u-m-b-10">单号：{{order_info.order_code}}</view>
								<view class="w-100 d-flex align-items-center overflow-hidden">
									<view class="font-size-sm text-color-assist">下单时间：{{ $tools.formatTime(order_info.add_time) }}</view>
								</view>
							</view>
							<view class="d-flex justify-content-end align-items-center w-40">
								<text>{{order_info.pay_status_title}}</text>
								<text class="u-p-l-20">{{order_info.shipping_status_title}}</text>
							</view>
						</view>
					</list-cell>
					<!-- store info end -->
					<!-- goods begin -->
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column position-relative" style="margin-bottom: -40rpx;">
							<view class="w-100 d-flex align-items-center u-m-b-40" v-for="(good, index) in order_info.order_detailed" :key="index">
								<view class="d-flex flex-column w-60 overflow-hidden">
									<view class="u-font-lg text-color-base u-m-b-10 text-truncate">{{ good.product_name }}</view>
									<view class="u-font-sm text-color-assist text-truncate"><!--规格--></view>
								</view>
								<view class="d-flex w-40 align-items-center justify-content-between u-p-l-30">
									<view class="font-size-base text-color-base">x{{ good.num }}</view>
									<view class="font-size-base text-color-base font-weight-bold">￥{{ good.product_price }}</view>
								</view>
							</view>
						</view>
					</list-cell>
					<!-- goods end -->
				</view>
				<view class="section">
					<!-- payment and amount begin -->
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column">
							<view class="pay-cell">
								<view>支付方式</view>
								<view class="font-weight-bold">
									<text v-if="order_info.paybalance>0">余额支付</text>
									<text v-if="order_info.wxpayamount>0">微信支付</text>
								</view>
							</view>
							<view class="pay-cell">
								<view>金额总计</view>
								<view class="font-weight-bold">￥{{order_info.order_total_amount}}</view>
							</view>
						</view>
					</list-cell>
					<!-- payment and amount end -->
				</view>
				<view class="section" v-if="order_info.shopinfo.orderType=='takein'">
					<!-- order info begin -->
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column">
							<view class="pay-cell">
								<view>下单时间</view>
								<view class="font-weight-bold">{{ $tools.formatTime(order_info.add_time) }}</view>
							</view>
							<view class="pay-cell">
								<view>订单号</view>
								<view class="font-weight-bold">{{order_info.order_code}}</view>
							</view>
						</view>
					</list-cell>
					<!-- order info end -->
				</view>
				<!-- order other info begin -->

				<list-cell last>
					<view  class="w-100 d-flex flex-column">
						<view class="pay-cell">
							<view>备注</view>
							<view class="font-weight-bold">
							 {{ order_info.postscript }}
							</view>
						</view>
					</view>
				</list-cell>


				<view last v-if="order_info.shopinfo.orderType=='takein'" class="u-p-l-30 u-p-r-30">
					<view>二维码券</view>
					<view v-for="(ticket, index) in order_info.ticket" :key="index">
						{{ticket.title}}
						<view class="ticket">
							<image mode="widthFix" :src="'data:image/png;base64,'+ticket.img.replace(/[\r\n]/g,'')" class="img"></image>
							<view :class="ticket.status==0?'ticketdisabled':''">
								<text class="txt" v-if="ticket.status==0">已使用</text>
							</view>
						</view>
					</view>
				</view>
				
	
				<!-- order other info end -->
			</view>
			<view class="position-relative w-100">
				<image src="/static/images/bottom.png" mode="widthFix" class="w-100"></image>
<!-- 				<view class="invote-box">
					<view class="font-size-base text-color-primary" @tap="goToInvoice">去开发票</view>
					<image src="/static/images/right.png"></image>
				</view> -->
			</view>
			<u-gap height="80"></u-gap>
			
		</view>
		<view class="btn-box">
			<!--view class="item"  v-if="order_info.order_status==1||order_info.order_status==2||order_info.order_status==3"><button type="primary">查看物流</button></view-->
			<!-- <view class="item"><button type="primary" plain @tap="review">去评价</button></view> -->
			<view class="item"><button type="primary" @tap="BackPage">返回</button></view>
		</view>
	</view>
</template>

<script>

import listCell from '@/components/list-cell/list-cell';

export default {
	components: {
		listCell
	},
	data() {
		return {

				orderNo:'',
				order_info:{
					order_detailed:[],
					shopinfo:{
						name:'',
						address:''
					}
				}

		};
	},
  onLoad(options) {
	let query = JSON.parse(decodeURIComponent(options.query));
    this.orderNo = query.orderNo;
	this.orderview(this.orderNo)
	},
	methods: {
		BackPage(){
			uni.reLaunch({
				url: '/pages/order/order'
			})
		},
		review() {
			const date = this.order.completed_time.split(' ')[0]
			uni.navigateTo({
				url: '/pages/my/my?storename=' + this.order.store.name + '&typeCate=' + this.order.typeCate + '&date=' + date
			})
		},
		goToInvoice() {
			uni.navigateTo({
				url: '/pages/my/my'
			})
		},
    orderview() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("order.order_view", {
          orderNo: this.orderNo,
        }).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.order_info = res.data;
            }
            this.loadstatus = false;
          }).catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },
	}
};
</script>

<style lang="scss" scoped>
@mixin arch {
	content: "";
	position: absolute;
	background-color: #F1F8FA;
	width: 30rpx;
	height: 30rpx;
	bottom: -15rpx;
	z-index: 10;
	border-radius: 100%;
}
page,body{
	height: 100%;
	background-color: #F1F8FA;
}
	.container {
		padding: 20rpx;
		background-color: #F1F8FA;
	}
.section {
	position: relative;
	
	&::before {
		@include arch;
		left: -15rpx;
	}
	
	&::after {
		@include arch;
		right: -15rpx;
	}
}

.pay-cell {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	color: #5A5B5C;
	margin-bottom: 40rpx;

	&:nth-last-child(1) {
		margin-bottom: 0;
	}
}

.invote-box {
	position: absolute;
	width: 100%;
	left: 0;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	
	image {
		width: 30rpx;
		height: 30rpx;
	}
}

.btn-box {
	background-color: #ffffff;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 170rpx;
	box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.1);
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	z-index: 11;
	padding-bottom: 50rpx;
	
	.item {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 10rpx;
		flex: 1;
		flex-shrink: 0;
		
		button {
			width: 100%;
			border-radius: 50rem !important;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
		}
	}
}

.ticket{
	position: relative;
	.img{width: 100%;}
	.ticketdisabled{
		width: 100%;
		height: 100%;
		position: absolute;
		top:0px;left:0px;
		background:rgba(0,0,0,0.6);
		
		.txt{
			position: absolute;
			top:45%;
			margin: auto;
			text-align: center;
			width: 100%;
			color: #D12E32;
			font-size: 50rpx;
			background: #F1F1F1;
			height: 100rpx;
			line-height: 100rpx;
		}
	}
}

@import '~@/pages/shop/menu.scss';


</style>
