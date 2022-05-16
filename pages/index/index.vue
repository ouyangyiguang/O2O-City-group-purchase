<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="carousel">
		  <u-swiper :list="initdata.Slide" :height="350" :borderRadius="0"></u-swiper>
		</view>

	<u-grid :col="4" :border="true">
		<u-grid-item  v-for="(cate, index) in cate_list" :key="index"
		 @click="$Router.push({path: '/pages/info/index',query: { id: cate.category_id },}) ">
			<u-icon :name="cate.icon" size="50" custom-prefix="customicon" :color="cate.style"></u-icon>
			<view class="grid-text" :style="'color:'+cate.style">{{cate.category_name}}</view>
		</u-grid-item>
		<u-grid-item 
		 @click="$Router.push({path: '/pages/info/index',query: { id: '' },}) ">
			<u-icon name="fenlei"  size="50" custom-prefix="customicon" color="#FAB6B6"></u-icon>
			<view class="grid-text" style="color:#FAB6B6">查看全部</view>
		</u-grid-item>
	</u-grid>
	<u-gap height="16" bg-color="#f3f4f6"></u-gap>

   
		<view class="htitle u-p-l-20 u-p-t-10">
			最新便民信息
		</view>
		<view class="b-b"></view>
		
		<view class="base-tonglan-box">
				<view class="item" v-for="(item, index) in flow_list" :key="index">
					 <view class="u-type-primary-dark"> {{ item.name }}</view>
					 <view v-if="item.price>0"> 价格：
						<text class="u-type-error" v-if="item.price==0||item.price==''||item.price==null">无</text>
						<text class="u-type-error" v-else>{{ item.price }}</text>
					 </view>
					 <view>
						<u-row gutter="0" justify="space-between">
							<u-col span="12" >
								<view @click="$Router.push({path: '/pages/info/view', query: {id: item.content_id}})">
									<text :style="'color:'+item.category_style">【{{ item.category_name }}】</text>{{ item.content }}
								</view>
							</u-col>
						</u-row>
					 
					 </view>
						 <view class="u-type-info">
							{{ item.hits }}人次浏览、 {{ item.update_time }} 更新
							<text class="float_right">距离:{{item.distance}}</text>
						 </view>

					<u-tag text="联系TA" shape="circle"  @tap="chatTo(item.users_id)" class="flexright"/>
					<!-- <u-icon name="weixin1"  custom-prefix="customicon" size="45" :custom-style="{ padding: '16rpx' }"></u-icon> -->
			   </view>
		</view>

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
import { MAPKEY } from "@/env";
import qqmapsdk from "@/plugins/qqmap-wx-jssdk.min.js"
export default {
	data(){
		return {
			cate_list:[],
			hasLogin:false,
			loadStatus: 'loadmore',
			loadstatus:false,
			loadstxt:'loading...',
			initdata: {
			  Slide: ["https://i.yodin.com/storage/ad.jpg?2"],
			},
			flow_list:[],
			page:1
		};
	},
	computed: {
	  ...mapState(['user']),
	},
	async onLoad() {
	if (this.user.wareRoom.villagename){
		uni.setNavigationBarTitle({
		  title: this.user.wareRoom.villagename,
		});
	}
		// #ifdef MP-WEIXIN
		this.getRegeo()
		// #endif
	this.getflowlist()
		this.hasLogin=this.$store.getters.loginFlag;
		if (!this.hasLogin&&this.user.bid>0){
			// #ifdef MP-WEIXIN
		    // 第一个参数强制登录，尝试登录
		    // try 为尝试登录，当第一次登录，没有用户登录权限的时候不弹出登录框
		    // judge 询问登录，当第一次登录，没有用户登录权限的时候先弹出提示是否要去登录
			onLogin("judge",() => {
				console.log("-登录-");
			});
			// #endif
		}
		
		
	//this.$store.commit("setsiteInfo",'');
	//uni.setStorageSync('siteInfo','');
	let update_time=this.user.siteInfo.update_time*1000

	if (update_time==0||(Date.now()-update_time>10000000)){
		let siteinfo=await this.$store.dispatch("getsiteInfo");
		if (siteinfo){
			this.cate_list=this.user.siteInfo.info_cate
		}
	}else{
		this.cate_list=this.user.siteInfo.info_cate
	}
		
	},
	onPullDownRefresh() {
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 50);
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

	onPullDownRefresh() {
			this.flow_list = [];
			this.page=1;
			this.getflowlist();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 50);
	},
	methods:{
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
						
				
					_this.$api("village.apitb", {
						city:res.result.address_component.city,
						lat:res.result.location.lat,
						lng:res.result.location.lng,
						key:MAPKEY
					}).then((res) => {
						console.log(res)
					}).catch((e) => {
						console.log(e)
					});
				
				
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
    chatTo(users_id) {
	  if (this.hasLogin==false){this.$u.toast("请先登陆");return;}
	  if(users_id==this.user.userInfo.users_id){this.$u.toast("不可自说自话哦。");return;}
      let room_id = users_id + this.user.userInfo.users_id;
      this.$Router.push({
        path: "/pages/chat/chat",
        query: { messageId: room_id,roomname:''}
      });
    },
    getflowlist() {
        this.$api("info.list", {
          page: this.page,
          limit: 10,
		  location:this.user.location,
		  category_id:'',
		  sort_field:'',
		  sort_value:'',
        }).then((res) => {
            if (res.code == 200) {
                this.flow_list = res.data.list;
			}
          }).catch((e) => {});
	}
	}
	
};
</script>
<style lang="scss" scoped>
 .u-icon{
	 font-size: 50rpx;
 }
.carousel {

}
	.flexright{
		position:absolute;
		width: 140rpx;
		background: $u-bg-color;
		right: 20rpx;
		top:20rpx;
		text-align: center;
	}
</style>
