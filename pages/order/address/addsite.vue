<template>
	<view class="u-padding-20">
			<u-form class="u-m-b-20 numinput">
				<u-form-item class="form-item" label="收货人" label-position="left" label-width="160">
					<u-input v-model="addressData.consignee" placeholder="请填写收货人姓名"/>
				</u-form-item>
				<u-form-item class="form-item" label="手机号码" label-position="left" label-width="160">
					<u-input v-model="addressData.mobile" placeholder="请填写收货人手机号"/>
				</u-form-item>
				<u-form-item class="form-item" label="所在地区" label-position="left" label-width="160">
					<input disabled type="text" :value="input" placeholder-class="line" placeholder="省市区县、乡镇等"  @tap="showRegionPicker"/>
				</u-form-item>
				<u-form-item class="form-item" label="详细地址" label-position="left" label-width="160">
					<u-input v-model="addressData.address" placeholder="街道、楼牌等"/>
				</u-form-item>
				<u-form-item class="form-item" label="是否默认" label-position="left" label-width="160">
					<!-- <switch color="red"  @change="setDefault" :checked="addressData.is_default" /> -->
					<u-switch v-model="addressData.is_default" active-color="red" inactive-color="#eee" ></u-switch>
					<text slot="right" style="font-size: 22rpx;color: #007AFF; padding-right: 20rpx;">提醒：每次下单会默认推荐该地址</text>
				</u-form-item>
			</u-form>

			<!-- <view class="site-clipboard">
				<textarea placeholder-class="line" value="" placeholder="粘贴文本,可自动识别姓名和地址等" />
				<view class="clipboard">
					地址粘贴板
					<u-icon name="arrow-down" class="icon" :size="20"></u-icon>
				</view>
			</view> -->

		<u-gap height="30"></u-gap>
		<u-button type="primary" @click="submit">确认设置</u-button>

		<u-picker mode="region" ref="uPicker" v-model="show"  :defaultRegion="defaultRegion" @confirm="confirm" /></u-picker>
	</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			input:'',
			defaultRegion: ['广东省', '深圳市', '宝安区'],
			addressData:{
				province_name:'',
				city_name:'',
				area_name:'',
				is_default:false,
				consignee:'',
				mobile:'',
				address:'',
				addr_id:''
			}

		};
	},

	onLoad(option) {
		let title = "新增收货地址";
        let query=JSON.parse(option.query);
		if (query.type === "edit") {
			this.addressData=query.item;
			this.input=query.item.province_name+'-'+query.item.city_name+'-'+query.item.area_name;
			this.defaultRegion=this.input.split('-');
			title="编辑收货地址";
			if (this.addressData.is_default == 1){this.addressData.is_default=true;}else{this.addressData.is_default=false;}
		}
		this.manageType=query.type;

    uni.setNavigationBarTitle({
      title
    });

	},
	methods: {

		showRegionPicker(e) {
			this.show = true;	
		},
		confirm(e) {
			this.input = e.province.label + '-' + e.city.label + '-' + e.area.label;
			this.addressData.province_name=e.province.label;
			this.addressData.city_name=e.city.label;
			this.addressData.area_name=e.area.label;
		},
		submit(){
			this.$api('order.address_add', {
				province_name:this.addressData.province_name,
				city_name:this.addressData.city_name,
				area_name:this.addressData.area_name,
				consignee:this.addressData.consignee,
				mobile:this.addressData.mobile,
				address:this.addressData.address,
				is_default:this.addressData.is_default,
				addr_id:this.addressData.addr_id
			}).then(res => {
				if (res.code==200){
							this.$tools.msg(
								`地址${this.manageType == "edit" ? "修改" : "添加"}成功`
							  );
							setTimeout(() => {
								uni.navigateBack(1);
							}, 400);
				}
			}).catch((e)=>{
			});
		}
	}
};
</script>

<style lang="scss" scoped>
/deep/ .line {

}
.wrap {

	.top {
		border-top: solid 2rpx $u-border-color;
		padding: 22rpx;
		.item {
			display: flex;
			font-size: 32rpx;
			line-height: 100rpx;
			align-items: center;
			border-bottom: solid 2rpx $u-border-color;
			.left {
				width: 180rpx;
			}
			input {
				text-align: left;
			}
		}
		
		.address {
			padding: 20rpx 0;
			textarea {
				// width: 100%;
				height: 150rpx;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
		}
		.site-clipboard {
			padding-right: 40rpx;
			textarea {
				// width: 100%;
				height: 150rpx;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
			.clipboard {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				color: $u-tips-color;
				height: 80rpx;
				.icon {
					margin-top: 6rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	.bottom {
		margin-top: 20rpx;
		padding: 40rpx;
		padding-right: 0;
		font-size: 28rpx;
		.tag {
			display: flex;
			.left {
				width: 160rpx;
			}
			.right {
				display: flex;
				flex-wrap: wrap;
				.tags {
					width: 140rpx;
					padding: 16rpx 8rpx;
					border: solid 2rpx $u-border-color;
					text-align: center;
					border-radius: 50rpx;
					margin: 0 10rpx 20rpx;
					display: flex;
					font-size: 28rpx;
					align-items: center;
					justify-content: center;
					color: $u-content-color;
					line-height: 1;
				}
				.plus {
					//padding: 10rpx 0;
				}
			}
		}
		.default {
			margin-top: 50rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: solid 2rpx $u-border-color;
			line-height: 64rpx;
			.tips {
				font-size: 24rpx;
			}
			.right {
			}
		}
	}
}
</style>
