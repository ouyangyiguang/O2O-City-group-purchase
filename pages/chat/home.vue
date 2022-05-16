<template>
	<view>

		<view class="u-text-center piaofu"><u-loading :show="loadstatus"></u-loading></view>
	<view class="u-padding-20">
		<u-search placeholder="搜索" v-model="searchkeyword"></u-search>
	</view>
	<view class="content">		
	<u-empty text="选择小区后自动加入小区群" mode="data" :show="nodata" v-if="loadstatus == false" ></u-empty>
			<view class="item"  v-for="(item, index) in flow_list" hover-class="message-hover-class" @tap="linkTo(item)"> <!---->
				<image mode="aspectFill" :src="item.roomimg" />
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<view class="right u-border-bottom title-wrap">
					<view class="right_top">
						<view class="right_top_name u-line-1">{{ item.roomname }}</view>
						<view class="right_top_time ">{{ item.last_time }}</view>
					</view>
					<view class="right_btm ">
						<view class="u-line-1">{{item.businessname}}</view>
						<view class="">{{item.readstatus}}</view>
					</view>
				</view>
			</view>
        <view v-if="flow_list.length > 0">
          <u-loadmore :status="loadStatus" @loadmore="get_chatlist"></u-loadmore>
        </view>

	</view>
	</view>
</template>

<script>

import socket from '@/plugins/socket.js';
import {mapState,mapMutations} from 'vuex';
export default {

	data() {
		return {
			flow_list: [],
			loadstatus:false,
			searchkeyword:'',
			page: 1,
			nodata:true
		};
	},
		computed: {
		  ...mapState(['user']),
		},
	onLoad() {
	  this.page=1;
	  this.flow_list = [];
	  this.get_chatlist()
	},
  onPullDownRefresh() {
	  this.page=1;
	  this.flow_list = [];
      this.get_chatlist();
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 500);
  },
	methods: {
		get_chatlist(){
		this.$api('chat.room', {
			village_id:this.user.wareRoom.village_id,
			users_id:this.user.userInfo.users_id
		}).then(res => {
			console.log(res)
            if (res.code == 200) {
              if (res.data.count > 0) {
				  this.nodata=false
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
			this.loadstatus = false;
		}).catch((e)=>{});
		},
		//跳转
		linkTo(item) {
			// if(item.zhu_uid==this.user.userInfo.users_id){
			// 	return this.$tools.msg('不可自说自话');
			// }
			this.$Router.push({
				path: '/pages/chat/chat',
				query: {
					messageId:item.room_id,
					}
			});
		},
	},
	
};
</script>

<style lang="scss" scoped>
.content {
	.item {
		width: 100%;
		display: flex;
		align-items: center;
		// padding: 20rpx;
		image {
			width: 76rpx;
			height: 76rpx;
			margin: 20rpx;
			border-radius: 12rpx;
			flex: 0 0 76rpx;
		}
		.right {
			overflow: hidden;
			flex: 1 0;
			padding: 20rpx 20rpx 20rpx 0;
			&_top {
				display: flex;
				justify-content: space-between;
				&_name {
					font-size: 28rpx;
					color: $u-main-color;
					flex: 0 0 350rpx;
					overflow: hidden;
				}
				&_time {
					font-size: 22rpx;
					color: $u-tips-color;
				}
			}
			&_btm {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 22rpx;
				color: $u-tips-color;
				padding-top: 10rpx;
			}
		}
	}
	.bg_view {
		background-color: #fafafa;
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		padding: 0 30rpx; 
	}
}
</style>
