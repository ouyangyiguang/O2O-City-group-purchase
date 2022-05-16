<template>
	<view class="container">
		<u-navbar :is-back="true" title="订单列表"  :border-bottom="false" :custom-back="BackPage" title-color="#000000"  back-icon-color="#000000">
		</u-navbar>
		<u-empty text="空空如也"  mode="data"  :show="orders.length === 0"  v-if="loadstatus == false" ></u-empty>
		
		<view class="orders-list d-flex flex-column w-100" style="padding: 20rpx; padding-bottom: 0;">
			<view class="order-item" v-for="(item, index) in orders" :key="index" style="margin-bottom: 30rpx;">
				<view @tap="detail(item.order_code)">
				<list-cell :hover="false">
					<view class="w-100 d-flex align-items-center">
						<view class="flex-fill d-flex flex-column">
							<view class="font-size-lg text-color-base" style="margin-bottom: 20rpx;">
								{{ item.shopinfo.name }}
							</view>
							<view class="font-size-sm text-color-assist">订单编号：{{ item.order_code }}</view>
						</view>
						<view class="font-size-lg text-color-primary">
							{{ item.order_status_txt }}
						</view>
					</view>
				</list-cell>
				<list-cell :hover="false">
					<view class="w-100 d-flex flex-column">
						<view class="w-100 text-color-base" style="margin-bottom: 20rpx;">
							{{ orderGoodsName(item.order_detailed) }}
						</view>
						<view class="d-flex justify-content-between align-items-center" style="margin-bottom: 30rpx;">
							<view class="font-size-sm text-color-assist">
								{{ $tools.formatTime(item.add_time) }}
							</view>
							<view class="d-flex font-size-sm text-color-base align-items-center">
								<view style="margin-right: 10rpx;">实付</view>
								<view class="font-size-lg">￥{{ item.order_amount }}</view>
							</view>
						</view>

					</view>
				</list-cell>
				</view>
				<list-cell :hover="false" last>

							<view style="margin-right: 10rpx;" v-if="item.order_status==2||item.order_status==3">
								<button type="primary" plain size="mini">查看物流</button>
							</view>
							<view style="margin-right: 10rpx;" v-if="item.order_status==0">
								<button type="primary" plain size="mini" @click="deleteOrder(item.order_id)">删除</button>
							</view>
							<view style="margin-right: 10rpx;">
								<button type="primary" plain size="mini" @tap="detail(item.order_code)">查看详细</button>
							</view>

				</list-cell>
			</view>
        <view v-if="orders.length > 0">
          <u-loadmore :status="loadStatus" @loadmore="getOrders"></u-loadmore>
        </view>
		</view>
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell'
	
	export default {
		components: {
			listCell
		},
		data() {
			return {
				page: 1,
				pageSize: 5,
				orders: [],
				loadstatus:false
			}
		},
		computed: {
			orderGoodsName() {
				return (order_detailed) => {
					let arr = []
					order_detailed.forEach(order_detailed => arr.push(order_detailed.product_name + '*' + order_detailed.num))
					return arr.join('，')
				}
			}
		},
		async onLoad() {
			await this.getOrders(false)
		},
		async onReachBottom() {
			await this.getOrders(false)
		},
		async onPullDownRefresh() {
			await this.getOrders(true)
		},
		methods: {
			async getOrders(isRefresh = false) {
				let orders = await this.getOrderList();
			},
		BackPage(){
			//this.$tools.routerTo("/pages/my/my",{},'');
			uni.reLaunch({
				url: '/pages/my/my'
			})
		},
		deleteOrder(id){
				this.$api('order.order_del', {
					order_id:id
				}).then(res => {
					if (res.code==200){
						this.page=1;
						this.orders=[];
						this.getOrderList();
					}else{
						this.$tools.msg(res.msg)
					}
				}).catch((e)=>{});
		},
		// 页面数据
		getOrderList() {
				this.loadstatus=true;
                return new Promise((resolve, reject) => { 
                    this.$api('order.order_list', {
						p:this.page,
						limit:10,
						idx:''
					}).then(res => {
						if (res.code == 200) {
							console.log(res)
						  if (res.data.count > 0) {
							let list = res.data.list;
							if (this.page <= res.data.pages) {
							  for (let i = 0; i < list.length; i++) {
								this.orders.push(list[i]);
							  }
							  if (this.page == res.data.pages) {
								this.loadStatus = "nomore";
							  }
							  this.page += 1;
							} else {
							  this.loadStatus = "nomore";
							}
						  } else {
							this.orders = [];
							this.loadStatus = "nomore";
						  }
						}
						this.loadstatus = false;
                    }).catch((e)=>{});
                })
			
		},
			detail(order_code) {
								  this.$Router.push({
									path: "/pages/order/detail",
									query: {
										orderNo:order_code
									},
								  });
			},
			review(order) {
				const date = order.completed_time.split(' ')[0]
				uni.navigateTo({
					url: '/pages/review/review?storename=' + order.store.name + '&typeCate=' + order.typeCate + '&date=' + date
				})
			},
			goToInvoice() {
				uni.navigateTo({
					url: '/pages/invoice/invoice'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page,body{
		height: 100%;
		background-color: #F1F8FA;
	}
	.container {
		background-color: #F1F8FA;
	}
	@import '~@/pages/shop/menu.scss';
</style>
