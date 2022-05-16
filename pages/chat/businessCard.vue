<template>
	<view>
		<view class="userinfo">
			<image :src="userCard.avatar" @tap="previewImg(userCard.avatar)" class="img"></image>
			<view class="userinfo-desc">
				<view class="userinfo-desc-name">{{userCard.username}}</view>
				<view class="userinfo-desc-gray">实名认证：{{userCard.realname}}</view>
				<view class="userinfo-desc-gray">昵称：{{userCard.nickname}}</view>
				<view class="userinfo-desc-gray">微信：{{userCard.wechatID}}</view>
				<view class="userinfo-desc-gray">手机：{{userCard.mobile}}</view>
			</view>
		</view>
		<view  class="perch"></view>
<!-- 		<u-cell-group >
			<u-cell-item title="朋友圈" label="模拟数据暂不支持查看好友朋友圈" hover-class="none" :title-style="{ marginLeft: '10rpx' }"></u-cell-item>
			<u-cell-item title="更多信息" :title-style="{ marginLeft: '10rpx' }"></u-cell-item>
		</u-cell-group> -->
		<view class="" v-if="!isItMe">
			<view  class="perch"></view>
			<u-cell-group >
				<u-cell-item title="发消息" :arrow="false" :center="true" :title-style="{ marginLeft: '10rpx' }" @click="linkToChat">
					<u-icon slot="icon" name="chat" color="#36648B" size="32"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		
      <view style="width: 100%; margin: 10rpx auto 20rpx auto">
        <u-tabs
          :list="tabslist"
          :is-scroll="false"
          inactive-color="#cccccc"
          active-color="#63E5CB"
          :current="tabscurrent"
          @change="change"
        ></u-tabs>
      </view>
		
      <view v-if="tabscurrent == 0">
			  <u-empty text="没有数据" mode="data" :show="flow_list.length === 0" v-if="loadstatus == false"></u-empty>
			  <view  v-if="flow_list.length > 0">
				<view class="base-panel-box u-m-b-30">
				  <view class="item" v-for="(item, index) in flow_list" :key="index">
					<u-row gutter="0" justify="space-between">
					  <u-col span="12">
								 <view> {{ item.name }}</view>
								 <view>
									<u-row gutter="0" justify="space-between">
										<u-col span="12" >
											<view @click="$Router.push({path: '/pages/info/view', query: {id: item.content_id}})">
												<text :style="'color:'+item.category_style">【{{ item.category_name }}】</text>{{ item.content }}
											</view>
										</u-col>
									</u-row>
								 </view>
					  </u-col >
					  </u-row>
					  <u-gap height="10"></u-gap>
						 <view class="u-type-info">
							{{ item.hits }}人次浏览、 {{ item.update_time }} 更新
							<text class="float_right">距离:{{item.distance}}</text>
						 </view>

				  </view>
				</view>
			  </view>
      </view>
	  
	  <view  v-if="tabscurrent == 1">
		  <u-empty text="无绑定记录" mode="data" :show="xiaoqu_list.length === 0" v-if="loadstatus == false"></u-empty>
		  <view class="u-p-l-20 u-p-r-20" v-if="xiaoqu_list.length > 0">
			<view v-for="(item, index) in xiaoqu_list" :key="index" class="base-panel-box u-m-b-30" :class="item.status==0?'disabled':''">
			  <view class="htitle">
				{{item.businessname}} {{item.aliasname}}
				<view class="right u-font-xs">【{{item.verifytitle}}】</view>
			  </view>
			  <view class="item" v-if="item.status==1">
				<u-row gutter="16" justify="space-between">
				  <u-col span="12">{{item.regionname}}</u-col>
				</u-row>
			  </view>
			  <view class="item" v-else>
				  已移除。
			  </view>
			</view>
		  </view>
	  </view>
		
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	export default {
		data() {
			return {
				userCard:{
					avatar:''
				},
				isItMe:false,
				userId:'',
				positionmarker:'',
				loadstatus:false,
      page: 1,
	  flow_list:[],
	  xiaoqu_list:[],
      tabscurrent: 0,
      tabslist: [
        {
          name: "便民信息",
        },
        {
          name: "绑定小区",
        },
      ],
      tabactivestyle: {},
			}
		},
	computed: {
		...mapState(['user'])
	},
methods: {
    change(index) {
      this.tabscurrent = index;
      this.page = 1;
      this.flow_list = [];
      this.xiaoqu_list = [];
      if (index == 0) {
		this.get_info();
      }
      if (index == 1) {
        this.get_houseroom();
      }
    },
	get_info(){
		this.loadstatus=true;
        this.$api("info.list", {
          page: this.page,
          limit: 10,
          see_users_id: this.user.userInfo.users_id,
		}).then((res) => {
            if (res.code == 200) {
              this.flow_list = res.data.list;
            }
			this.loadstatus=false
          }).catch((e) => {});
	},
	get_houseroom(){
		this.loadstatus=true;
        this.$api("shelf.userroomlist", {
			p:1,
			limit:20,
			find_users_id:this.user.userInfo.users_id
		}).then((res) => {
            if (res.code == 200) {
              this.xiaoqu_list = res.data.roomlist;
            }
			this.loadstatus=false
          }).catch((e) => {});
	},
			linkToChat(){		
				let roomid=this.userId+this.user.userInfo.users_id
				// this.$api('chat.create_roomgroup', {
				// 	roomnumber:roomid,
				// 	form_uid:this.userId,
				// 	positionmarker:this.positionmarker
				// }).then(res => {
				// 	console.log(res)
				// 	}).catch((e)=>{});
				this.$Router.push({
					path: '/pages/chat/chat',
					query: { messageId: roomid,roomname:''}
				});
			},
			previewImg(urls){
				uni.previewImage({urls:[urls]})
			},
			get_userinfo(uid){
			  this.$api("user.clientuserinfo", {
				client_usersid: uid,
			  }).then((res) => {
				  console.log(res)
				  if (res.code == 200) {
					this.userCard=res.data.clientuserinfo
				  }
				}).catch((e) => {});
			}
		},
		onLoad(option) {
			let query = JSON.parse(decodeURIComponent(option.query));
			this.userId=query.usersid;
			this.positionmarker=query.positionmarker;
			if(this.userId == this.user.userInfo.users_id){
				this.userInfo = this.user.userInfo;
				this.isItMe = true;
			}
			this.get_userinfo(this.userId)
			this.get_info();
			//this.userInfo = this.firendList.filter(item=>item.userId == userId)[0];
		}
	}
</script>

<style scoped lang="scss">
	.perch{
		height: 10rpx;
	}
.userinfo{
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	padding: 20rpx 30rpx 40rpx 40rpx;
	background-color: #FFFFFF;
	.img{
		display: block;
		width: 110rpx;
		height: 110rpx;
		border-radius: 10rpx;
	}
	&-desc{
		padding-left: 30rpx;
		&-name{
			font-weight: bold;
			font-size: 36rpx;
			transform: translateY(-10rpx);
		}
		&-gray{
			color: $u-tips-color;
			font-size: 29rpx;
		}
	}
}
</style>
