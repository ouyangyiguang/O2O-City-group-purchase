<template>
	<view>
		<public-module></public-module>
		<view class="u-text-center piaofu"><u-loading :show="loadstatus"></u-loading></view>
        <u-empty text="没有数据" mode="data" :show="flow_list.length === 0" v-if="loadstatus==false"></u-empty>
	
		<view  class="u-p-t-10" v-if="flow_list.length>0">

				<view v-for="(item, index) in flow_list" :key="index">
					<view class="news">
						<view class=""  @click="$Router.push({path: '/pages/shop/index',query: { id: item.id, shop_id: item.shop_id },}) ">
							<view class="title u-type-primary-dark" v-if="item.title!=''">{{item.title}}</view>
							<view class="newspic" :style="'background:url('+item.cover+') no-repeat bottom center;background-size: cover;'"></view>
							<view class="u-font-lg font-weight-bold u-m-t-10 u-type-error-dark">{{item.name}}</view>
							<view class="u-font-sm u-type-info-dark">{{item.address}}</view>
						</view>
					</view>
					<view class="b-b  u-m-t-4 u-m-b-10"></view>
				</view> 


		<u-loadmore  :status="loadStatus" @loadmore="getflowlist"></u-loadmore>
		</view>
	
		
	</view>
</template>

<script>

export default {

	data() {
		return {
			flow_list:[],
			loadStatus: 'loadmore',
			loadstatus:false,
			page:1,
			tid:98,
		};
	},
	 onLoad(){
       this.getflowlist();
	},
	onReachBottom() {
		this.loadStatus = 'loading';
		setTimeout(() => {
			this.loadStatus = 'loadmore';
			this.getflowlist();
		}, 0);
	},
	methods: {
		getflowlist(){
                return new Promise((resolve, reject) => {
					this.loadstatus=true;
                    this.$api('shop.shop_list', {
						page:this.page,
						limit:10
					}).then(res => {
						console.log(res)
						if (res.code == 200) {
						  if (res.data.count > 0) {
							let list = res.data.list;
							if (this.page <= res.data.pages) {
							  for (let i = 0; i < list.length; i++) {
								this.flow_list.push(list[i]);
							  }
							  if (this.page == res.data.pages) {
								this.loadStatus = "nomore";
							  }
							  this.page += 1;
							} else {
							  this.loadStatus = "nomore";
							}
						  } else {
							this.flow_list = [];
							this.loadStatus = "nomore";
						  }
						}
						this.loadstatus = false;
                    }).catch((e)=>{
                        resolve(false);
                    });
                })
		},
	},
};
</script>

<style lang="scss" scoped>
	.u-load-more-wrap{
		padding: 50rpx;
	}
	
	.u-card-wrap { 
		background-color: $u-bg-color;
		padding: 1px;
	}
	
	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;
	}
		
	.u-body-item image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-right: 12rpx;
		margin-top:12rpx;
	}
	
	.news{
		border: solid 0px #EAEEF1;
		border-radius: 0rpx;
		padding: 20rpx;
		.newspic{
			width: 100%;
			height:380rpx;
			border-radius: 12rpx;
		}
		.title{
			padding-bottom: 10rpx;
			font-weight: bold; font-style: normal;
			font-size: 30rpx;
		}
	}
	
</style>
