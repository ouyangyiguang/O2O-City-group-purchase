<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<init-pages></init-pages>
			<!-- 用户 -->
			<view class="mytoptonglan">
				<view class="bg u-p-l-40 u-p-r-40">
				<!-- 未登录 -->
				<view v-if="!hasLogin" class="u-flex"  @click="onJudgeLogin('account/login/pwd-login')">
					<view class="u-m-r-20"><u-avatar size="120"></u-avatar></view>
					<view class="u-flex-1"><view class="u-font-lg">登陆 / 注册</view></view>
					<view><u-icon name="arrow-right" color="#969799" size="28"></u-icon></view>
				</view>
				<!-- 已登录 -->
				<view v-if="hasLogin" class="u-flex">
					<view class="u-m-r-20"><u-avatar :src="user.userInfo.avatar" mode="circle" size="120"></u-avatar></view>
					<view class="u-flex-1">

					<view class="xiaoqubox">
						<view class="xq"  @click="reset_village()">
							<text v-if="user.wareRoom.villagename==''||user.wareRoom.villagename==null">请选择您的小区</text>
							<text v-else>{{user.wareRoom.villagename}}</text>
							<u-icon name="xiangyoujiantou u-m-r-20" custom-prefix="customicon" class="float_right"></u-icon>
						</view>
						<view class="fh" @click="reset_room()">
							
							<text v-if="user.wareRoom.addr_id==''||user.wareRoom.addr_id==null">请选择您的房号</text>
							<text v-else>{{user.wareRoom.building}} {{user.wareRoom.roomnumber}} {{user.wareRoom.verifytitle}} </text>
							<u-icon name="xiangyoujiantou u-m-r-20" custom-prefix="customicon" class="float_right"></u-icon>
							
						</view>
					</view>
					
					</view>
				</view>
				</view>
			</view>


			<!-- 其它 -->
			<view class="mybasebox">
				 <button class="u-m-l-20 u-m-r-20" v-if="show_bing_mobile!=1" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定手机号码</button> 
				<u-cell-group :border="myinfo.border">
					<view class="panel-main">
						<u-cell-item
							:title="user.userInfo.level_name==null?'会员服务':user.userInfo.level_name" @click="onJudgeLogin('my/user/levelcente')"
							:border-bottom="myinfo.borderBottom"
							:border-top="false"
							icon="liebiaoye-VIPjiaobiao"
							:value="user.userInfo.maturity_date"
							custom-prefix="customicon"
							:icon-style="{color:'#1296db'}"
						></u-cell-item>
						<u-cell-item
							title="用户信息" @click="onJudgeLogin('my/user/user')"
							:border-bottom="myinfo.borderBottom"
							:border-top="false"
							icon="yonghuxinxi"
							custom-prefix="customicon"
							:icon-style="{color:'#1296db'}"
						></u-cell-item>
						<u-cell-item
							title="邻里管家" @click="$tools.routerTo('/pages/housekeeper/index')"
							:border-bottom="myinfo.borderBottom"
							:border-top="false"
							icon="shouye2"
							custom-prefix="customicon"
							:icon-style="{color:'#13227a'}"
						></u-cell-item>
						<u-cell-item
							title="我的钱包" @click="$tools.routerTo('/pages/my/assets/index')"
							:border-bottom="myinfo.borderBottom"
							:border-top="false"
							icon="bankcard"
							custom-prefix="customicon"
							:icon-style="{color:'#f4ea2a'}"
						></u-cell-item>
						
						<u-cell-item
							title="我的订单" @click="$tools.routerTo('/pages/order/order')"
							:border-bottom="myinfo.borderBottom"
							:border-top="false"
							icon="haiwaigongyingshangdingdan"
							custom-prefix="customicon"
						></u-cell-item>
						
						<u-cell-item
							title="我的圈子" @click="$tools.routerTo('/pages/my/team/index','')"
							:border-bottom="myinfo.borderBottom"
							:border-top="false"
							icon="caifuguanlizhuanjiatuandui"
							custom-prefix="customicon"
							:icon-style="{color:'#1296db'}"
						></u-cell-item>


						<u-cell-item
							title="设置" @click="$tools.routerTo('/pages/my/setting/setting','')"
							:border-bottom="myinfo.borderBottom"
							icon="shezhi"
							custom-prefix="customicon"
							:icon-style="{color:'#d4237a'}"
						></u-cell-item>
					</view>
				</u-cell-group>
			</view>

			<!-- <u-gap height="20" bg-color="#16116B"></u-gap> -->
			<view class="u-padding-20 u-m-t-30">
			<u-alert-tips :show="tipsshow" type="error" @close="tipsshow = false" description="关注公众号,及时收取通知信息." :close-able="true" @click="gotogzh()"></u-alert-tips>
			</view>

			
		</view>

</template>

<script>
import initPages  from "@/components/init-pages.vue"
// #ifdef MP-WEIXIN
import { onLogin } from "@/plugins/applogin";
// #endif
import {mapState,mapMutations} from 'vuex';
import { MAPKEY } from "@/env";
import qqmapsdk from "@/plugins/qqmap-wx-jssdk.min.js"
export default {
	components:{
		initPages
	},
	data() {
		return {
			hasLogin:false,
			langboxStatus:false,
			customStyle: {
				border:'0rpx',
				color:'#ffffff'
			},
			myinfo: {
				border: false,
				borderBottom: true,
			},
			show_bing_mobile:1,
			code:'',
				msgnum:'',
				offset:[10,5],//消息数字角标位置
			amapPlugin: null,  
			tipsshow:true,
			reserr:''
		};
	},
	computed: {
	  ...mapState(['user']),
	},
	onShow() {
		this.hasLogin=this.$store.getters.loginFlag;
		console.log(this.user)
		if (this.hasLogin){
			this.$store.dispatch("getUserInfo");
			// #ifdef MP-WEIXIN
			if (this.user.userInfo.is_mobile==0){
				this.show_bing_mobile=0
				this.wxlogin()
			}
			// #endif
		}else{
		}
	},
    onLoad() {
		// #ifdef MP-WEIXIN
		this.getRegeo()
		// #endif
    }, 
	methods: {
		...mapMutations(['setBidPopupShow','setroomPopupShow']),
		gotogzh(){
				console.log("goto..")
		},
        getRegeo() {
			let _this=this;
				uni.getLocation({
				    type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				    success: function (res) {
						//this.longitude=res.longitude;
						//this.latitude=res.latitude;
						let localedata={
							locale:1,
							lat:res.latitude,
							lng:res.longitude,
							township:''
						}
						_this.$store.commit("setLocation",localedata);
		console.log(MAPKEY)
		const QQMapWX = new qqmapsdk({
		            //填写自己申请的Key
			        key: MAPKEY   
			    });
		// 解析地址
		QQMapWX.reverseGeocoder({
			location: {
				latitude: res.latitude,
				longitude: res.longitude
			},
			success: (res) => {
				//console.log(res)
						let localedata={
							locale:1,
							lat:res.result.location.lat,
							lng:res.result.location.lng,
							country:res.result.address_component.nation,
							province:res.result.address_component.province,
							city:res.result.address_component.city,
							district:res.result.address_component.district,
							township:res.result.address_component.street
						}
						_this.$store.commit("setLocation",localedata);
			},
			fail: function(res) {
				//console.log(res)
				//_this.reserr=res.message
				uni.showToast({
					title: '定位失败',
					duration: 2000,
					icon: "none",
				})
			},
		})
						
						
						
				    }
				})
			
			
        },
getPhoneNumber(e) {
  if (!e.target.iv) {
    uni.showModal({
      content: '获取手机号失败！',
      showCancel: false
    })
    return;
  }
  uni.checkSession({
    success: _ => {
		this.bingmobile(this.code,e.target.iv,e.target.encryptedData)
    },
    fail: res => {

		let _this=this
		uni.login({
			provider: 'weixin',
			success: function(loginRes) {
				console.log(loginRes)
				if (loginRes.errMsg == 'login:ok') {
					_this.code = loginRes.code;
					_this.bingmobile(_this.code,e.target.iv,e.target.encryptedData)
				}
			}
		});
    }
  })
},
wxlogin(){
		let _this=this
		uni.login({
			provider: 'weixin',
			success: function(loginRes) {
				console.log(loginRes)
				if (loginRes.errMsg == 'login:ok') {
					_this.code = loginRes.code;
				}
			}
		});	
},
		bingmobile(code,ivdata,encrypdata){
					this.$api("user.getminimobi", {
						code:code,
						iv:ivdata,
						encrypdata:encrypdata
					}).then((res) => {
						console.log(res)
						if (res.code==200){
							this.show_bing_mobile=1
							this.$store.commit("USER_INFO", res.data);
						}
					}).catch((e) => {});
		},
		reset_village(){
			this.$api("village.list", {
				location:this.user.location,
			}).then((res) => {
				if (res.code == 200) {
					uni.$emit("changeDorm",res.data.list)
					this.setBidPopupShow(true);
				}
			}).catch((e) => {});
		},
		reset_room(){
			if(this.user.bid == ''){
				this.reset_village();return;
			}
			this.$api("shelf.userroomlist", {
				bid:this.user.bid
			}).then((res) => {
				if (res.code == 200) {
					uni.$emit("changeDormroom",res.data.roomlist)
					this.setroomPopupShow(true);
				}
			}).catch((e) => {});
		},

		onJudgeLogin(url) {
			this.judgeLogin(() => {
				//用户已登录，接下来可以处理用户的功能了
				if (url!=''){
					this.$Router.push({path: '/pages/'+url});
				}
			}, "judge"); // judge:（默认值） 如果未登录询问是否登录  force：未登录直接强制登录
		},

	},

};
</script>
<style lang="scss">

	.selectlanguage{
		margin: 40rpx 40rpx 40rpx 40rpx;
	}
	 .selectlanguage view{
		 height: 80rpx;
		 width: 600rpx;
		 line-height: 80rpx;
		 color: #ffffff;
		 background: $u-type-primary;
		 text-align: center;
		 border-radius: 10rpx;
		 margin-bottom: 20rpx;
	 }
	.membercode{
		border-radius: 30rpx;
		height: 50rpx;line-height: 50rpx;
		background: #F29100;
		margin-bottom: 20rpx;
		text-align: center;
	}
	.xiaoqubox{
		
		.xq{
			background: #A0CFFF;
			text-align: center;
			border-radius: 18rpx;
			height: 80rpx;line-height: 80rpx;
			margin-bottom: 20rpx;
		}
		.fh{
			background: #52C41A;
			text-align: center; 

			border-radius: 18rpx;
			height: 80rpx;line-height: 80rpx;

		}
	}

	
</style>
