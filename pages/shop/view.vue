<template>
	<view class="page">
	<public-module></public-module>
	<ourLoading isFullScreen :active="loadstatus"/>
	<view class="u-content">
		<view>{{shopinfo.name}}</view>
		<view>{{shopinfo.address}}</view>
		<u-parse :html="content" :selectable="true"></u-parse>
	</view>
	
	</view>
</template>

<script>

export default {

	data() {
		return {
			content:'',
			shopinfo:[],
			loadstatus:false,
		};
	},
  onLoad(options) {
	let query = JSON.parse(decodeURIComponent(options.query));
    let id = query.id;
	//uni.setNavigationBarTitle({title});
    this.articleview(id);
	},

	methods: {
		articleview(id){
			this.loadstatus=true;
                return new Promise((resolve, reject) => {
                    this.$api('archives.shop_view', {
						shop_id:id
					}).then(res => {
						if (res.code==200){
							this.shopinfo=res.data;
							this.content=res.data.content
						}
						this.loadstatus=false;
                    }).catch((e)=>{
                        resolve(false);
                    });
                })
		},
	},
};
</script>

<style lang="scss" scoped>
    .u-content{
		padding: 30rpx;
		color: $u-content-color;
		font-size: 32rpx;
		line-height: 1.8;
		
		// 标签形式无效
		p {
			color: $u-tips-color;
		}
	}
</style>
