<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
	<u-tabbar v-model="navcurrent" :list="navlist" :mid-button="true" :before-switch="beforeSwitch" class="nav"></u-tabbar>
		<u-dropdown :border-bottom="true">
			<u-dropdown-item v-model="cate" title="分类" :options="cate_one"  @change="cate_dropchange"></u-dropdown-item>
			<u-dropdown-item v-model="sort" title="排序" :options="sort_options" @change="sort_dropchange"></u-dropdown-item>
		</u-dropdown>
		
	<view class="">
		
		<u-empty text="空空如也"  mode="data"  :show="flow_list.length === 0"  v-if="loadstatus == false" ></u-empty>
		  <view class="" v-if="flow_list.length > 0">
			<view class="base-tonglan-box">
					<view class="item" v-for="(item, index) in flow_list" :key="index">
						 <view class="u-type-primary-dark"> {{ item.name }}</view>
						 <view v-if="item.price>0"> 价格：<text class="u-type-error">{{ item.price }}</text></view>
						 <view>
							<u-row gutter="0" justify="space-between">
								<u-col span="12" >
									<view class="u-line-2" @click="$Router.push({path: '/pages/info/view', query: {id: item.content_id}})">
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
			<view v-if="flow_list.length > 0">
			  <u-loadmore :status="loadStatus" @loadmore="getflowlist"></u-loadmore>
			</view>
		  </view>
		</view>
    </view>
	
	
	
	
  </view>
</template>


<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      flow_list: [],
	  page:1,
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      loadstxt: "loading...",
				cate: 0,
				sort: 1,
				sort_options: [{
						label: '默认排序',
						value: '',
					},
					{
						label: '距离优先',
						value: 'distance',
					},
					{
						label: '热门优先',
						value: 'hits',
					}
				],
				cate_one: [],
				navlist: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '返回首页',
						count: 0,
						isDot: true,
						customIcon: false,
					},
					{
						iconPath: "https://cdn.uviewui.com/uview/common/min_button.png",
						selectedIconPath: "https://cdn.uviewui.com/uview/common/min_button_select.png",
						text: '我要发布',
						midButton: true,
						customIcon: false,
					},
					{
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的发布',
						count: '',
						isDot: false,
						customIcon: false,
					},
				],
				navcurrent: 0,
				sort_field:''
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  async onLoad(options) {

	if (options.query!==undefined){
		let query = JSON.parse(decodeURIComponent(options.query));
		this.cate = query.id;
	}

    this.hasLogin = this.$store.getters.loginFlag;
	let update_time=this.user.siteInfo.update_time*1000
	this.cate_one=[];
	let all={
		label:'全部',
		value:0
	}
	this.cate_one.push(all);
	if (update_time==0||(Date.now()-update_time>100000)){
		let siteinfo=await this.$store.dispatch("getsiteInfo");
		if (siteinfo){
			let list = this.user.siteInfo.info_cate;
			let option;
			for (let i = 0; i < list.length; i++) {
			  option = {
				  label:list[i].category_name,
				  value:list[i].category_id
			  }
			  this.cate_one.push(option);
			}
		}
	}else{
		let list = this.user.siteInfo.info_cate;
		let option;
		for (let i = 0; i < list.length; i++) {
		  option = {
			  label:list[i].category_name,
			  value:list[i].category_id
		  }
		  this.cate_one.push(option);
		}
	}
	this.getflowlist()
  },
	onReachBottom() {
		this.loadStatus = 'loading';
		setTimeout(() => {
			this.getflowlist();
			this.loadStatus = 'loadmore';
		}, 50);
	},
	onPullDownRefresh() {
			this.flow_list = [];
			this.page=1;
			this.getflowlist();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 50);
	},
  methods: {
    chatTo(users_id) {
	  if (this.hasLogin==false){this.$u.toast("请先登陆");return;}
	  if(users_id==this.user.userInfo.users_id){this.$u.toast("不可自说自话哦。");return;}
      let room_id = users_id + this.user.userInfo.users_id;
      this.$Router.push({
        path: "/pages/chat/chat",
        query: { messageId: room_id,roomname:''}
      });
    },
	cate_dropchange(e){
		this.cate=e
		this.page=1
		this.getflowlist()
	},
	sort_dropchange(e){
		this.sort_field=e
		this.page=1
		this.getflowlist()
	},
	  	beforeSwitch(index) {
	  		if (index==2){
					this.$Router.push({
						path:'/pages/info/myfabu',
						query:{}
					})
			}
	  		if (index==1){
					this.$Router.push({
						path:'/pages/info/fabu',
						query:{}
					})
			}
	  		if (index==0){
				//uni.navigateBack()
					// this.$Router.push({
					// 	path:'/pages/index/index',
					// 	query:{
					// 		time:Date.now()
					// 	}
					// })
					  uni.switchTab({
						  url: `/pages/index/index`,    //要跳转的路径
						   success: function (e) {
							   
						   }
					  })
			}
	  	},

    getflowlist() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("info.list", {
          page: this.page,
          limit: 10,
		  location:this.user.location,
		  category_id:this.cate,
		  sort_field:this.sort_field,
		  sort_value:'',
        }).then((res) => {
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
			this.navlist[2].count=res.data.mycount
			this.loadstatus = false;
          }).catch((e) => {this.loadstatus = false;resolve(false);});
      });
    },
  },
};
</script>
<style lang="scss" scoped>
	.nav{
		position:fixed;bottom: 0rpx; width: 100%;z-index: 1000000;
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
