<template>
	<view>
		<swiper class="guide_pages_swiper" v-if="user.bidPopupShow">
			<swiper-item>
				<view class="guide_pages_bg3">
				<u-gap height="50"></u-gap>

				<u-picker mode="region" ref="uPicker" v-model="show"  :defaultRegion="defaultRegion" @confirm="confirm" /></u-picker>
				  <view class="u-padding-20 ">
					  <text class="u-font-40">请选择您居住小区</text>
					  <text class="u-p-l-20" @tap="closeinit()">【关闭浮窗】</text>
				  </view>
				  <view class="">
					<view class="base-panel-box u-margin-20">
					  <view class="htitle">
						<text class="u-font-sm" @tap="showRegionPicker">
							按地区选择[{{region}}]
						</text>
						<view class="right u-font-xs"  @click="$tools.routerTo('/pages/exbusiness/create/protocol','')">创建新小区</view>
					  </view>
					  <scroll-view scroll-y="true" style="height: 800rpx; background: #FFFFFF; border-radius: 20rpx;padding-bottom: 20rpx;">
					  <view class="item" v-for="(item, index) in xiaoqulist" :key="index">
						<u-row gutter="0" justify="space-between">
						  <u-col span="12">
							<view class="demo-layout bg-purple-light" @click="gotopage(item)">
							   {{ item.area_name }} {{ item.villagename }}
							  </view>
						  </u-col>
						</u-row>
					  </view>
					  </scroll-view>
					</view>
				  </view>

			</view>
			</swiper-item>
		</swiper>
		
		<swiper class="guide_pages_swiper" v-if="user.roomPopupShow">
			
			<swiper-item>
				<view class="guide_pages_bg2">
				<u-gap height="50"></u-gap>
				  <view class="u-padding-20">
					  <h3>请选择房号</h3>
					  <view class=" u-font-xs u-type-info-dark">1,如未绑定房号并通过认证，大部份功能将受到限制。</view>
					  <view class=" u-font-xs u-type-info-dark">2,房号一经选择，将记录为1次数</view>
					  <view class=" u-font-xs u-type-info-dark">3,选择不可超过<text style="color: red;">5</text>房号/次数（所有小区累加）</view>
					  <view class=" u-font-xs u-type-info-dark">4,请勿随意绑定房号，被已认证业主踢出将减少一次选择</view>
					  </view>
				  <view class="">
					<view class="base-panel-box u-margin-20">
					  <view class="htitle">
						<text class="u-font-sm">我的房号</text>
						<view class="right u-font-xs" @click="tiaogo()">游客，跳过>></view>
					  </view>
					  <view  v-if="roomlist.length>0">
					  <view class="item" v-for="(item, index) in roomlist" :key="index">
						<u-row gutter="0" justify="space-between">
						  <u-col span="12">
							<view class="demo-layout bg-purple-light" @click="gotoroom(item)">
							{{ item.building }}{{ item.roomnumber }}
							  </view>
						  </u-col>
						</u-row>
					  </view>
					  </view>
					  <view class="item" v-else>
						  <view>暂无房间，请添加新房号</view>
					  </view>
					</view>
				  </view>
				  
					<u-gap height="20" bgColor="#425066"></u-gap>
				  
				  <u-popup v-model="showpop" mode="bottom">
					<view class="base-panel-box u-margin-20 ">
					  <view class="htitle">
						<text class="u-font-sm">添加您在 {{user.wareRoom.villagename}} 的房产</text>
					  </view>
					  <view class="item" >
						<!-- <shelfgrid @eventChange="gridSelected"></shelfgrid> -->
						
						<u-form>
							<u-form-item class="form-item" label="幢/期" label-position="left" label-width="80">
								<u-input placeholder="可选填" type="text" v-model="building"/>
							</u-form-item>
							<u-form-item class="form-item" label="房号" label-position="left" label-width="80">
								<u-input placeholder="请填写房号" type="text" v-model="roomnumber"/>
							</u-form-item>
						</u-form>
						
						
						<u-gap height="20"></u-gap>
						<u-button type="error" @click="bindroomsubmit">确认</u-button>
						<u-gap height="60"></u-gap>
					  </view>
					  
					</view>

				</u-popup>
				
				<view class="u-margin-20 ">
					<u-button type="success" @click="showpop = true">添加房号</u-button>
				</view>


			</view>
			</swiper-item>
		</swiper>
	</view>
	
	
	
	
</template>

<script>
// #ifdef MP-WEIXIN
import { onLogin } from "@/plugins/applogin";
// #endif
	import shelfgrid from "@/components/shelfgrid.vue";
    import {mapState,mapMutations} from 'vuex';
	export default {
	  components: {
		shelfgrid
	  },
		data() {
			return {
				defaultRegion: ['广东省', '深圳市', '宝安区'],
				region:'广东-珠海-香洲',
				showpop:false,
				addressData:[],
				screenHeight: 667,
				show: false,
				xiaoqulist:[],
				roomlist:[],
				building:'',
				roomnumber:'',
				basebusinessInfo:[],
				bid:'',
				shelfgridcode:''
			};
		},
		created() {
				// let data = {
				// 	bid:'',
				// };
				// this.$store.commit("setbasebusinessID",data);
				// 	let item={
						
				// 	};
				// 	this.$store.commit("setwareRoom",item);
				//uni.setStorageSync('wareRoom','');
				//this.$store.commit('OUT_LOGIN');

				uni.$on("changeDorm",(e)=>{
					this.xiaoqulist=e
				})
				if (this.user.bidPopupShow==true){
					//this.xiaoqu_list(); 
				}
				// uni.$on("changeDormroom",(e)=>{
				// 	this.roomlist=e
				// })

				if (this.user.location.locale==1){
					this.region=this.user.location.province+'-'+this.user.location.city+'-'+this.user.location.township;
					this.defaultRegion=this.region.split('-');
				}

				let routes = getCurrentPages();
				 let curRoute = routes[routes.length - 1].route
				//console.log('route',curRoute)
				if (curRoute== 'pages/exbusiness/create/protocol'||curRoute=='pages/exbusiness/create/addcompany') {
					this.setBidPopupShow(false);
				}else{
					if(this.$store.state.user.bid == ''){
						//this.setBidPopupShow(true);
					}
				}
			
            let systemInfo = uni.getSystemInfoSync();
            this.screenHeight = systemInfo.screenHeight;
		
		},
	computed: {
		...mapState(["user"]),
	},
		methods:{
			...mapMutations(['setBidPopupShow','setroomPopupShow']),
		showRegionPicker(e) {
			this.show = true;	
		},
		closeinit(){
			this.setBidPopupShow(false);
		},
		confirm(e) {
			this.region = e.province.label + '-' + e.city.label + '-' + e.area.label;
			this.addressData.province_name=e.province.label;
			this.addressData.city_name=e.city.label;
			this.addressData.area_name=e.area.label;
			this.xiaoqu_list()
			//console.log(this.addressData)
		},
		gotopage(village){
				//与历史选择不同，就清掉原来的roomid
				// if (this.wareRoom.village_id!=id){
				// 	uni.setStorageSync('wareRoom','');
				// }
				let data = {
					village_id:village.village_id,
					addr_id:'',
					villagename:village.villagename,
					roomnumber:'',
					verifytitle:'',
					is_verify:0,
				};
				this.$store.commit("setwareRoom",data);
					this.setroomPopupShow(true);
					this.setBidPopupShow(false);
					this.$api("shelf.userroomlist", {
						village_id:village.village_id,
						find_users_id:this.user.userInfo.users_id
					}).then((res) => {
						console.log(res)
						if (res.code == 200) {
							this.roomlist=res.data.roomlist
						}
					}).catch((e) => {});
			},
			gotoroom(item){

				this.$store.commit("setwareRoom",item);
				this.setroomPopupShow(false);
				this.hasLogin=this.$store.getters.loginFlag;

			},
			tiaogo(){
			this.setroomPopupShow(false);
					let item={
						businessname:'',
						aliasname:'游客',
						verifytitle:'',
						is_verify:0,
					};
				this.$store.commit("setwareRoom",item);
				this.hasLogin=this.$store.getters.loginFlag;

			},
			bindroomsubmit(){
					this.$api("shelf.bindroom", {
						village_id:this.user.wareRoom.village_id,
						building:this.building,
						roomnumber:this.roomnumber
					}).then((res) => {
						console.log(res)
						if (res.code == 200) {
							this.$store.commit("setwareRoom",res.data);
							this.showpop=false;
							this.setroomPopupShow(false);
						}
					}).catch((e) => {});
			},
		gridSelected(res) {
			
		},
			xiaoqu_list(){
					this.$api("village.list", {
						location:this.user.location,
						area_name:this.addressData.area_name
					}).then((res) => {
						console.log(res)
						if (res.code == 200) {
							this.xiaoqulist=res.data.list
						}
					}).catch((e) => {});
			},


		}
	}
</script>

<style lang="scss">

.guide_pages_swiper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color:#fff;
    z-index: 999;
	image {
		width: 100vw;
		height: 100vh;
	}
    .guide_pages_bg3 {
        width: 100vw;
        height: 100vh;
        background-color: #004FE9;
		background-size: 100% auto;
        color: #FFF;
    }
    .guide_pages_bg2 {
        width: 100vw;
        height: 100vh;
        background-color: #2C405A;
		background-size: 100% auto;
        color: #FFF;
    }

}
</style>
