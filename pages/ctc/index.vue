<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<u-navbar :is-back="false" title="任务接单" :background="background" :border-bottom="false">
			<!-- <view class="slot-wrap">aaaa</view> -->
		</u-navbar>
		<!--isFullScreen 可以实其全屏显示-->
		<!-- <ourLoading isFullScreen :active="loadstatus" :text="loadstxt"/> -->
		<view class="u-text-center piaofu"><u-loading :show="loadstatus"></u-loading></view>
		<view class="topfixbar">
			<u-gap height="10"></u-gap>
			<u-row gutter="0" justify="space-between">
				<u-col span="4" style="font-family: 黑体;">
					<u-tabs name="cate_name" :list="cateList" :is-scroll="false" :current="currentTab" @change="changeTab"
					 bg-color="#63E5CB"
					 inactive-color	="#ffffff"
					 :active-item-style="tabsstyle"
					 :show-bar="false"
					 active-color="#ffffff"></u-tabs>
				</u-col>
				<u-col span="5" @click="$tools.routerTo('/pages/ctc/myorder')" text-align="right">
					<view class="u-text-right" style="position: relative;">
						<u-icon name="liebiao-" custom-prefix="customicon" size="30"></u-icon>我的订单
						<u-badge type="error" :count="myordernum" :offset="[1,-30]"></u-badge>
					</view>
					
				</u-col>
				<u-col span="3" @click="$tools.routerTo('/pages/ctc/publish')">
					<view class="u-text-center">
						<u-icon name="Rectangle" custom-prefix="customicon" size="30"></u-icon>快捷发布
					</view>
				</u-col>
			</u-row>
			
		</view>

		<view class="mybasebox u-p-l-10 u-p-r-10">
				<u-tabs class="tabscoinstyle" name="cate_name" :list="needsType" :is-scroll="false" :current="currentCoinTab" @change="changeCoinTab" 
				 bg-color="#ffffff"
				 inactive-color	="#000000"
				 font-size="30"
				 :bold="false"
				 height="60"
				 active-color="#52D3FF"></u-tabs>
				 
			<view class=" u-m-l-20 u-m-r-20 u-m-t-20" v-if="currentCoinTab==0">
				<u-alert-tips type="warning" :description="jdrinfo"></u-alert-tips>
			</view>
			<u-empty text="暂时什么需求都没有" class="u-m-t-80" mode="data" :show="flow_list.length === 0" v-if="loadstatus==false"></u-empty>
			<view  class="u-p-t-10" v-if="flow_list.length>0">
				<view class="base-tonglan-box" >
					<view class="item " v-for="(item, index) in flow_list" :key="index" >
						<u-row gutter="0" justify="space-between">
							<u-col span="7" >
								<view>{{item.needstypename}}</view>
							</u-col>
							<u-col span="5" text-align="right">
								<view class="u-font-xs">距离：{{item.distance}}</view>
							</u-col>
						</u-row>
						<u-row gutter="0" justify="space-between">
							<u-col span="9" >
								<view class="u-font-36">
									 {{item.needsitemname}}<text v-if="item.needs_num>1"> x {{item.needs_num}}</text>
								</view>
							</u-col>
							<u-col span="3" text-align="right">
								<text class="u-font-36 price" v-if="item.totalamount>0">¥ {{item.totalamount}}</text>
								<text class="u-font-36 price" v-else></text>
							</u-col>
						</u-row>
						<u-row gutter="0" justify="space-between">
							<u-col span="1" >
								<image mode="scaleToFill" :src="item.avatar" class="avatar"></image>
							</u-col>
							<u-col span="7">
								<view class="u-font-xs">{{item.nickname}}</view>
							</u-col>
							<u-col span="4" text-align="right">
								<view>
								<u-button size="medium"  v-if="item.needs_num>0" :hairLine="false" type="primary" @click="iwantbuy_pops(item.id)">接单</u-button>
								<u-button size="medium" v-else :hairLine="false" type="info" >已抢</u-button>
								</view>
							</u-col>
						</u-row>
					</view>
					
				</view>
			</view>
					<view v-if="flow_list.length>0">
						<u-loadmore :status="loadStatus" @loadmore="get_page"></u-loadmore>
					</view>
			
		</view>

		<u-popup v-model="iwantbuy_show" mode="bottom">
			<view class="pops">
				<view class="title">
					<u-row gutter="0" justify="space-between">
					  <u-col span="6" text-align="left">
						  <text class="u-font-40">{{buy_item.needstypename}} </text>
						  <text class="u-p-l-20">{{buy_item.needsitemname}}</text>
					  </u-col>
					  <u-col span="6" text-align="right">
						  <text  @click="$Router.push({path: '/pages/ctc/viewdetails',query: { adid: buy_item.id },}) ">查看详细>></text>
					  </u-col>
					</u-row>
				</view>

				<view class="u-p-l-20 u-p-r-20">
					<u-form class="u-m-b-20 numinput">
						<u-form-item class="form-item" label="服务地址:" label-position="left" label-width="160">
						  <view>接单后显示完整联系信息</view>
						</u-form-item>
<!-- 						<u-form-item class="form-item" label="我的地址:" label-position="left" label-width="160">
						  <view>{{user.wareRoom.businessname}}{{user.wareRoom.aliasname}}(显示在服务卡上)</view>
						</u-form-item> -->
						<u-form-item class="form-item" label="数量:" label-position="left" label-width="80">
						  <u-number-box v-model="jd_nums" @change="valChange" :min="1" :max="parseInt(onebuynum)" :disabled-input="true"></u-number-box>
						   <text class="u-p-l-20">每单数量上限：{{buy_item.jd1num}}{{buy_item.unit}}</text>
						</u-form-item>
						<u-form-item class="form-item" label="接单保证金:" label-position="left" label-width="170">
						  <view>
							  {{(buy_item.needs_price*jd_nums+buy_item.needs_prize*jd_nums)}}*30%=
							  {{((buy_item.needs_price*jd_nums+buy_item.needs_prize*jd_nums)*0.3).toFixed(2)}}元 (结单后退还)
						  </view>
						</u-form-item>
					<u-gap height="10"></u-gap>
						<u-row gutter="0" justify="space-between">
							<u-col span="6" >
								<view>
									<text class="u-font-xs">可赚:</text>
									<text class="u-font-40">{{buy_item.needs_price*jd_nums}}</text>
									<text class="u-font-xs">元</text>
								</view>
							</u-col>
							<u-col span="6" >
								<view v-if="buy_item.needs_prize>0">
									<text class="u-font-xs">打偿:</text>
									<text class="u-font-40">{{buy_item.needs_prize*jd_nums}}</text>
									<text class="u-font-xs">元</text>
								</view>
							</u-col>
						</u-row>

					</u-form>
					<u-gap height="30"></u-gap>
						<u-row gutter="0" justify="space-between" style="width:100%;">
							<!--<u-col span="2" >
 								<u-button type="">
									<u-count-down :timestamp="timestamp" :show-seconds="true" @end="iwantbuy_show = false;"></u-count-down>
								</u-button> 
							</u-col>-->
							<u-col span="12" >
								<u-button type="primary" @click="confirmorder()">接单并支付保证金</u-button>
							</u-col>
						</u-row>
				</view>

			</view>
		</u-popup>
			
	</view>
</template>


<script>
// #ifdef MP-WEIXIN
import { onLogin } from "@/plugins/applogin";
// #endif
// #ifdef H5
import { wxPublicPay } from "@/plugins/html5Utils";
// #endif
import socket from "@/plugins/socket";
import {mapState,mapMutations} from 'vuex';
// #ifdef MP-WEIXIN
import { setPay, setPayAssign } from "@/plugins/wxutils";
// #endif
export default {
	data(){
		return {
			flow_list:[],
			hasLogin:false,
			loadStatus: 'loadmore',
			loadstatus:false,
			loadstxt:'loading...',
			background: {backgroundColor: '#63E5CB',},
			cateList:[{
					id:1,
					name:'我要服务'
				}],
			needsType:[],
				tabsstyle:{
					fontSize:'40rpx'
				},
			currentTab:0,
			currentCoinTab:0,
			needs_typeid:1, //2 usdt
			page:1,
			iwantbuy_show:false,
			timestamp:60,
			buy_item:{
				address:{
					regionname:'',
					businessname:'',
					aliasname:''
				}
			},
			jd_nums:1,
			input_nums:0,
			onebuynum:1,
			jdrinfo:'',
			myordernum:''
		};
	},
	computed: {
	  ...mapState(['user']),
	},
	async onLoad() {
		this.hasLogin=this.$store.getters.loginFlag;
		this.jdrinfo="地址标签："+this.user.wareRoom.businessname
		if (this.user.wareRoom.is_verify==0){
			this.jdrinfo=this.jdrinfo+"【未审核】。为提升交易双方信任，请尽快完成审核。"
		}else{
			this.jdrinfo=this.jdrinfo+"，展示状态为："+this.user.wareRoom.verifytitle
		}
		
	let update_time=this.user.siteInfo.update_time*1000
	if (update_time==0||(Date.now()-update_time>10000000)){
		let siteinfo=await this.$store.dispatch("getsiteInfo");
		if (siteinfo){
			this.needsType=this.user.siteInfo.needs_cate
		}
	}else{
		this.needsType=this.user.siteInfo.needs_cate
	}
	
		this.get_page();
		if (!this.hasLogin){
			// #ifdef MP-WEIXIN
			onLogin("judge",() => {
				console.log("-登录-");
			});
			// #endif
		}
	},
	onReachBottom() {
		this.loadStatus = 'loading';
		setTimeout(() => {
			this.get_page();
			this.loadStatus = 'loadmore';
		}, 50);
	},
	onPullDownRefresh() {
			this.flow_list = [];
			this.page=1;
			this.get_page();

		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 500);
			
		},
onShareAppMessage: function (res) {
	if (res.from === 'button') {}
	let data = {s:this.user.userInfo.salt,b:this.user.bid}
		return {
			title: '邻邻社',
			path: '/pages/index/index?query='+encodeURIComponent(JSON.stringify(data)),
			success: function(res) {},
			fail: function(res) {}
		}
},
	methods: {
		...mapMutations(['setBidPopupShow','setroomPopupShow','setLoginPopupShow']),
		onAppletsLogin() {
		  // 第一个参数强制登录，尝试登录
		  // try 为尝试登录，当第一次登录，没有用户登录权限的时候不弹出登录框
		  // judge 询问登录，当第一次登录，没有用户登录权限的时候先弹出提示是否要去登录
		  onLogin("judge", () => {
			console.log("登录成功");
		  });
		},
		changeTab(e) {
			this.currentCoinTab=0;
			this.currentTab=e;
			this.flow_list = [];
			this.page=1;
			this.get_page();
		},
		changeCoinTab(e){
			this.currentCoinTab=e;
			this.flow_list = [];
			this.page=1;
			this.get_page();
		},
		valChange(e){
			if (e){
				
			}
		},
		iwantbuy_pops(itemid){
			// if(this.user.bid == ''){
			// 	this.setBidPopupShow(true);return;
			// }
			if (this.user.wareRoom.addr_id==''){
				//this.setroomPopupShow(true);return;
				this.setBidPopupShow(true);return;
			}
			this.$api('ctc.adrefresh', {
				adid:itemid,
			}).then(res => {
				if (res.code==200){
					if (res.data.needs_num<=0){
						this.$u.toast("此单已被抢，请刷新重新加载任务");
					}else{
						this.buy_item=res.data;
						this.iwantbuy_show=true;
						if (this.buy_item.jd1num<this.buy_item.needs_num){
							this.onebuynum=this.buy_item.jd1num
						}else{
							this.onebuynum=this.buy_item.needs_num
						}
					}
				}
			}).catch((e)=>{
				resolve(false);
			});
		},

		get_page(){
			console.log(this.user.location)
                return new Promise((resolve, reject) => {
					this.loadstatus=true;
					this.loadstxt="加载中";
                    this.$api('ctc.adlist', {
						page:this.page,
						limit:10,
						needstype:this.currentCoinTab,
						location:this.user.location,
					}).then(res => {
						console.log(res)
						if (res.code==200){
							this.myordernum=res.data.myordernum
							if (res.data.count>0){
							let list=res.data.list;
								if (this.page<=res.data.pages){
									for (let i = 0; i < list.length; i++) {
										this.flow_list.push(list[i]);
									}
									if (this.page==res.data.pages){this.loadStatus = 'nomore';}
									this.page+=1;
								}else{
									this.loadStatus = 'nomore';
								}
							}else{
								this.flow_list=[];
								this.loadStatus = 'nomore';
							}
							this.loadstatus=false;
						}
                    }).catch((e)=>{
						this.loadstatus=false;
                        resolve(false);
                    });
                })
		},
		confirmorder(){

                return new Promise((resolve, reject) => {
					this.loadstatus=true;
                    this.$api('ctc.confirmbuyorder', {
						adid:this.buy_item.id,
						jiedan_addr_id: this.user.wareRoom.addr_id,
						nums:this.jd_nums,
						location:this.user.location
					}).then(res => {
						console.log(res)
						if (res.code==200){
							
							//this.iwantbuy_show=false;
			  if (res.data.needpay==1){
				// #ifdef MP-WEIXIN
					this.onAppWxPay(res.data.paydata)
				// #endif
				// #ifdef H5
							//  this.$Router.push({
							// 	path:'/pages/ctc/myorder',
							// 	query:{
							// 		recordid:res.data.recordid,
							// 	}
							// })
					this.$tools.routerTo("/pages/ctc/myorder",{recordid: res.data.recordid},'');
				//#endif
			  }
			  if (res.data.payok==200){
					this.$tools.routerTo("/pages/ctc/myorder",{recordid: res.data.recordid},'');
			  }
							
							
						}else{
							this.$u.toast(res.msg);
						}
						this.loadstatus=false;
                    }).catch((e)=>{
						this.loadstatus=false;
                        resolve(false);
                    });
                })
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
              title: "支付失败，",
              icon: "none",
            });
          }
			this.$tools.routerTo("/pages/ctc/myorder",{},'');
        }
      );
    },
		
	},
};
</script>
<style lang="scss" scoped>
.price{
	color: $u-type-primary-disabled;
}
.topfixbar{
	background: $u-type-primary;
	color:#FFFFFF;
	top:70rpx;
	height: 120rpx;
	line-height: 68rpx;
	width: 100%;
	z-index: 1;
}
.tabscoinstyle{
	padding:0rpx;
	width: 96%;
	margin: auto;
}
.avatar{
	width: 50rpx;height: 50rpx;
	display:inline-block;vertical-align: middle;
	margin-right: 10rpx;
	border-radius: 100%;
}

.pops{
	background: #FFFFFF;
	height: 800rpx;
	.title{
		background: $u-type-primary-light;
		padding: 20rpx 30rpx;
	}
}

</style>
