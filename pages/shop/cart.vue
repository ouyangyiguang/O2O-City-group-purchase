<template>
	<view class="container u-padding-20">
		<view style="margin-bottom: 130rpx;">
			<view class="u-m-b-20" v-if="shopinfo.orderType == 'takein'">
				<view class="base-panel-box u-m-b-20 u-type-success-light-bg">
					<view class="item_single">购买成功后二维码券将自动发送在您的订单中</view>
				</view>
			</view>
	
				<view class="base-panel-box u-m-b-20 u-type-success-light-bg" v-else>
					<view v-if="address_is_empty === true" class="item_single">
						<navigator url="/pages/order/address/index?source=1">
							<view v-if="user.wareRoom.aliasname==''||user.wareRoom.aliasname==null">选择地址</view>
							<view v-else>
								{{user.wareRoom.businessname}} {{user.wareRoom.aliasname}} 
							</view>
						</navigator>
					</view>
					<view class="item_single" v-else>
						<navigator url="/pages/order/address/index?source=1" >{{ addressData.address }} </navigator>
					</view>
				</view>

			
        <view class="base-panel-box u-m-b-20">
          <view class="htitle">
            <view class="u-font-sm">fdsafdsf</view>
          </view>
          <view class="item" v-for="(item, index) in cart" :key="index">
            <u-row gutter="0" justify="space-between">
              <u-col span="8">
                {{ item.name }}
              </u-col>
			  <u-col span="1" text-align="center">x{{ item.number }}</u-col>
			  <u-col span="3" text-align="right" class="u-font-lg">￥{{ item.price }}</u-col>
            </u-row>
            <u-row gutter="0" justify="space-between" v-if="item.price!=0||item.props_text!=''||item.props_text!=null">
              <u-col span="12">
                {{ item.props_text }}
              </u-col>
            </u-row>
          </view>
          <view class="item">
            <u-row gutter="0" justify="space-between">
			  <u-col span="12" text-align="right">
				  总计￥{{ total }},实付 <text class="u-font-weight-bold u-font-xl">￥{{ amount }}</text>
			  </u-col>
            </u-row>
          </view>
        </view>


			
			
			
			<!-- 购物车列表 begin -->

<!-- 					<template v-if="shopinfo.orderType == 'takeout'">
						<list-cell last v-if="shopinfo.packing_fee > 0">
							<view class="w-100 d-flex font-size-base align-items-center justify-content-between">
								<view>快递费</view>
								<view>￥{{ parseFloat(shopinfo.packing_fee) }}</view>
							</view>
						</list-cell>
						<list-cell last v-if="shopinfo.delivery_cost > 0">
							<view class="w-100 d-flex font-size-base align-items-center justify-content-between">
								<view>配送费</view>
								<view>￥{{ parseFloat(shopinfo.delivery_cost) }}</view>
							</view>
						</list-cell>
					</template> -->

<!-- 				<list-cell arrow @click="goToPackages">
					<view class="flex-fill d-flex justify-content-between align-items-center">
						<view class="text-color-base">奈雪券</view>
						<view class="text-color-primary">超值购买优惠券大礼包</view>
					</view>
				</list-cell>
				<list-cell arrow>
					<view class="flex-fill d-flex justify-content-between align-items-center">
						<view class="text-color-base">礼品卡</view>
						<view class="text-color-primary">请选择</view>
					</view>
				</list-cell> -->

		
			<!-- 购物车列表 end -->
<!-- 			<view class="d-flex align-items-center justify-content-start font-size-sm text-color-warning" 
				style="padding: 20rpx 0;">
				<u-icon name="photo" class="line-height-100"></u-icon>
				<view>优惠券不与满赠、满减活动共享</view>
			</view> -->
			<!-- 支付方式 begin -->
			
        <view class="base-panel-box u-m-b-20">
          <view class="htitle">
            <view>支付方式</view>
          </view>
          <view class="item">
            <u-row gutter="0" justify="space-between">
              <u-col span="11">
                <u-icon name="renminbi4" custom-prefix="customicon" size="35"></u-icon>
				<text>余额支付（余额￥{{(user.userInfo.coinlist[0].balance_available*1).toFixed(2)}}）</text>
				<text class="font-size-sm" v-if="amount>user.userInfo.coinlist[0].balance_available">余额不足</text>
              </u-col>
			  <u-col span="1" text-align="right">
				<text v-if="amount>user.userInfo.coinlist[0].balance_available">
					<u-icon name="weixuanzhong" custom-prefix="customicon" size="36"></u-icon>
				</text>
				<text v-else>
					<u-icon name="checkmark-circle-fill" class="line-height-100 checkbox"></u-icon>
				</text>
			  </u-col>
            </u-row>
          </view>
          <view class="item">
            <u-row gutter="0" justify="space-between">
              <u-col span="11">
                <u-icon name="weixin-fill" class="line-height-100 payment-icon" color="#7EB73A"></u-icon>
				<text>微信支付</text>
				<text class="font-size-sm" v-if="amount>user.userInfo.coinlist[0].balance_available">余额不足</text>
              </u-col>
			  <u-col span="1" text-align="right">
				<text v-if="amount<user.userInfo.coinlist[0].balance_available">
					<u-icon name="weixuanzhong" custom-prefix="customicon" size="30"></u-icon>
				</text>
				<text v-else>
					<u-icon name="checkmark-circle-fill" class="line-height-100 checkbox"></u-icon>
				</text>
			  </u-col>
            </u-row>
          </view>
        </view>
			
			
			<!-- 支付方式 end -->
			<!-- 备注 begin -->
			<list-cell last>
				<view class="d-flex flex-fill align-items-center justify-content-between overflow-hidden">
					<view class="flex-shrink-0 u-m-r-30">备注</view>
					<view class="text-color-primary flex-fill  text-right">
						<u-input v-model="postscript" placeholder="请填写备注"/>
					</view>
				</view>
			</list-cell>
			<!-- 备注 end -->
		</view>
		<!-- 付款栏 begin -->
		<view class="w-100 pay-box position-fixed fixed-bottom d-flex align-items-center justify-content-between bg-white">
			<view class="font-size-sm" style="margin-left: 20rpx;">合计：</view>
			<view class="font-size-lg flex-fill">￥{{ amount }}</view>
			<view class="bg-primary h-100 d-flex align-items-center just-content-center text-color-white font-size-base"
				style="padding: 0 60rpx;" @tap="submit">
				付款
			</view>
		</view>
		<!-- 付款栏 end -->
		<modal :show="ensureAddressModalVisible" custom :mask-closable="false" radius="20" width="90%">
			<view class="modal-content">
				<view class="d-flex justify-content-end">
					<image src="/static/images/menu/close.png" style="width: 40rpx; height: 40rpx;" @tap="ensureAddressModalVisible=false"></image>
				</view>
				<view class="d-flex just-content-center align-items-center" style="margin-bottom: 40px;">
					<view class="font-size-extra-lg text-color-base">请再次确认下单地址</view>
				</view>
				<view class="d-flex font-size-base text-color-base font-weight-bold align-items-center justify-content-between u-m-b-20">
					<view>			{{ addressData.province_name }}
									{{ addressData.city_name}}
									{{ addressData.district_name }}</view>
					<view>{{ addressData.mobile }}</view>
				</view>
				<view class="d-flex font-size-sm text-color-assist align-items-center justify-content-between u-m-b-40">
					<view>{{ addressData.address }} {{ user.userInfo.mobile }}</view>
					<button type="primary" size="mini" plain class="change-address-btn">修改地址</button>
				</view>
				<button type="primary" class="pay_btn" size="mini" @tap="pay">确认并付款</button>
			</view>
		</modal>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import { setPay, setPayAssign } from "@/plugins/wxutils";
	import listCell from '@/components/list-cell/list-cell'
	import modal from '@/components/modal/modal'
	
	export default {
		components: {
			listCell,
			modal
		},
		data() {
			return {
				hasLogin:false,
				cart: [],
				form: {
					remark: ''
				},
				ensureAddressModalVisible: false,
				address_is_empty:true,
				addressData: [],
				sendname:'',
				addr_id:'',
				shopinfo:[],
				address:{},
				postscript:''
			}
		},
  watch: {
    //显示空白页
    addressData(e) {
      let empty = e == undefined || e.length <= 0 ? true : false;
      if (this.address_is_empty !== empty) {
        this.address_is_empty = empty;
      }
	  if (empty == false){
		  if (e.positionmarker==null){
			  this.addr_id=e.addr_id
			  this.sendname=''
		  }else{
			  this.addr_id=''
			  this.sendname=e.positionmarker
		  }
	  }
    },
  },
		computed: {
			...mapState(["user"]),
			total() {
				return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
			},
			amount() {
				return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
			}
		},
		onLoad(option) {
		this.loadstatus=true;
		let query = JSON.parse(decodeURIComponent(option.query));
		this.shop_id=query.shop_id;
		this.get_shopinfo(this.shop_id)
			//const {remark} = option
			this.cart = uni.getStorageSync('cart')
			if (this.cart.length<=0){
				this.$tools.routerTo("/pages/shop/shop",{},'');
			}
			//remark && this.$set(this.form, 'remark', remark)
			
		this.$api("order.address_list", {}).then((res) => {
			if (res.code == 200) {
			  if (Array.isArray(res.data)) {
				this.address_is_empty = false;
				this.addressData = res.data[0];
			  }
			}
		  }).catch((e) => {});
		this.sendname=this.user.wareRoom.positionmarker;
		this.hasLogin=this.$store.getters.loginFlag;
		if (this.hasLogin){this.$store.dispatch("getUserInfo");}
		  
		
		  
		},
		methods: {
		get_shopinfo(id){
			this.$api('archives.shop_view', {
				shop_id:id
			}).then(res => {
				console.log(res)
				if (res.code==200){
					this.shopinfo=res.data
				}
			}).catch((e)=>{});
		},
			goToRemark() {
				uni.navigateTo({
					url: '/pages/shop/remark?remark=' + this.form.remark
				})
			},

			submit() {
				if(this.shopinfo.orderType == 'takeout') {
					  if (this.sendname==''&&this.addr_id==''&&this.addr_id==0){
						  this.$u.toast("必须选择地址");return;
					  }
					this.ensureAddressModalVisible = true
				} else {
					this.pay()
				}
			},
			pay() {
				//uni.showLoading({title: '加载中'})
				this.ensureAddressModalVisible=false;
        this.loadstatus = true;
        this.$api("shop.order_save", {
          createmode: "car",
          addrid: this.addr_id,
		  sendname:this.sendname,
          cart: this.cart,
		  shop_id:this.shop_id,
		  postscript:this.postscript
        }).then((res) => {

            if (res.code == 200) {

				this.$api("order.order_pay", {
				  order_id: res.data.order_id,
				  use_ticket_id: '',
				  use_coininfo_id: 1,
				}).then((res2) => {
					console.log('res2',res2);
					uni.removeStorageSync('cart')
					if (res2.data.needpay == 1) {
					  
						// #ifdef MP-WEIXIN
							this.onAppWxPay(res2.data.paydata)
						// #endif
						// #ifdef H5
							this.$u.toast("调起支付失败，请在小程序内支付。");
						//#endif
						
					}else{

						 if(res2.data.payok=200){
								this.$tools.routerTo("/pages/order/detail",{orderNo: res2.data.orderNo},'');
								// uni.reLaunch({
								// 	url: '/pages/order/detail'
								// })
						   }
					 }

				  }).catch((e) => {});

            }
            this.loadstatus = false;
          }).catch((e) => {
            this.loadstatus = false;
          });
				//order = Object.assign(order, {status: 1})
				// this.SET_ORDER(order)
				// uni.removeStorageSync('cart')
				// uni.reLaunch({
				// 	url: '/pages/take-foods/take-foods'
				// })
				uni.hideLoading()
			},
			onAppWxPay(paydata) {

			  setPay({
				  type: paydata.onlinepay_type, // APP微信支付=wxpay，APP支付宝支付=alipay，微信小程序支付=smallPay
				  price: paydata.price, // 价格，
				  title: paydata.title, // 标题
				  orderNo: paydata.orderNo, // 订单编号
				  table:paydata.table
				},(res) => {
				  // 小程序支付的回调
				  if (res.success) {
					uni.showToast({
					  title: "支付成功",
					  icon: "none",
					});
				  } else {
					uni.showToast({
					  title: "支付失败，" + res.data,
					  icon: "none",
					});
				  }
				  
				  this.$tools.routerTo("/pages/order/detail",{orderNo: paydata.orderNo},'');
				  
				}
			  );
			},
		}
	}
</script>

<style lang="scss" scoped>

page {
	height: 100%;
}


	
	.payment {
		margin-bottom: 30rpx;
		
		.disabled {
			color: #878889
		}
		
		.payment-icon {
			font-size: 44rpx; 
			margin-right: 10rpx;
		}
		
		.checkbox {
			font-size: 36rpx;
			margin-left: 10rpx;
		}
		
		.checked {
			color: #ADB838;
		}
	}
	
	.pay-box {
		box-shadow: 0 0 20rpx rgba(0, 0, 0, .1);
		height: 170rpx;
	}
	
	.modal-content {
		.change-address-btn {
			line-height: 2;
			padding: 0 1em;
		}
		.pay_btn {
			width: 100%;
			border-radius: 50rem !important;
			line-height: 3;
		}
	}

	@import '~@/pages/shop/menu.scss';
</style>
