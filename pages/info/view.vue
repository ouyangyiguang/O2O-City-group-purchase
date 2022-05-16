<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
	<ourLoading isFullScreen :active="loadstatus"/>
		<view class="carousel" v-if="slide.length > 0">
		  <u-swiper :list="slide" :height="350" :borderRadius="0"></u-swiper>
		</view>
		
		<view class="htitle u-p-l-10 u-p-t-10">
			<text :style="'color:'+item.category_style">【{{ item.category_name }}】</text>
		</view>
		<view class="b-b"></view>
		
		<view class="base-tonglan-box">
				<view class="item">
					 <view class="u-type-primary-dark"> {{ item.name }}</view>
					 <view> 价格：
						<text class="u-type-error" v-if="item.price==0||item.price==''||item.price==null">无</text>
						<text class="u-type-error" v-else>{{ item.price }}</text>
					 </view>
					 <view>
						<u-row gutter="0" justify="space-between">
							<u-col span="12" >
								<view>
									<u-parse :html="item.content"></u-parse>
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
		<u-gap height="16" bg-color="#f3f4f6"></u-gap>

    <view class="u-padding-20">

      <view class="base-panel-box">
        <view class="htitle">
          <i style="float:left;margin-right:24rpx;">
			  <u-avatar :src="item.userCardInfo.avatar" mode="circle" size="55"></u-avatar>
		  </i>
		  发布人名片
		  <text class="right" @tap="linkToBusinessCard(item.userCardInfo.users_id)">查看详细</text>
        </view>
        <view class="item">

				<u-row gutter="16">
					<u-col span="3">用户/昵称:</u-col>
					<u-col span="9">{{item.userCardInfo.username}} {{item.userCardInfo.nickname}}</u-col>
				</u-row>

        </view>
        <view class="item">
				<u-row gutter="16">
					<u-col span="3">手机:</u-col>
					<u-col span="9">{{item.userCardInfo.mobile}}</u-col>
				</u-row>
        </view>

      </view>
    </view>
	<u-gap height="16" bg-color="#f3f4f6"></u-gap>
	<u-gap height="90"></u-gap>
	
  </view>
</template>


<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      item: {
		  userCardInfo:{
			  avatar:''
		  }
	  },
	  slide:[],
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      loadstxt: "loading...",
	  id:''
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad(options) {
	let query = JSON.parse(decodeURIComponent(options.query));
    this.id = query.id;
    this.hasLogin = this.$store.getters.loginFlag;
    this.getpagecontrac();
  },
onShareAppMessage: function (res) {
	if (res.from === 'button') {}
	let data = {id:this.id,s:this.user.userInfo.salt,b:this.user.bid}
		return {
			title: this.item.name+' 邻邻社',
			path: '/pages/info/view?query='+encodeURIComponent(JSON.stringify(data)),
			success: function(res) {},
			fail: function(res) {}
		}
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
		linkToBusinessCard(uid) {
			this.$Router.push({
				path: '/pages/chat/businessCard',
				query: { usersid:uid}
			});
		},
    getpagecontrac() {
		this.loadstatus = true;
		this.$api("info.info", {
				content_id:this.id,
				location:this.user.location,
			}).then((res) => {
			    if (res.code == 200) {
					this.slide=[];
					this.item=res.data
					let imglist = res.data.img;
					 for (let i = 0; i < imglist.length; i++) {
						this.slide.push(imglist[i].pic);
					}
			    }
				this.loadstatus = false;
			  }).catch((e) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
	.flexright{
		position:absolute;
		width: 140rpx;
		background: $u-bg-color;
		right: 20rpx;
		top:40rpx;
		text-align: center;
	}
</style>
