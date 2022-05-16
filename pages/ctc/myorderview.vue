<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
		<u-navbar :is-back="true" :title="order_info.needstypename"  :border-bottom="false" :custom-back="BackPage" title-color="#000000"  back-icon-color="#000000">
			<!-- <view class="slot-wrap">aaaa</view> -->
		</u-navbar>
    <ourLoading isFullScreen :active="loadstatus"/>
    <view class="u-padding-20" v-if="!hasLogin">
      <u-empty text="请先登陆" mode="permission"></u-empty>
    </view>

    <view class="u-padding-20" v-else>
      <u-empty text="没有数据" mode="data" :show="order_info.length === 0" v-if="loadstatus == false"></u-empty>
		
      <u-gap height="30"></u-gap>
      <view class="u-text-center">
		<view class="u-padding-20 u-font-40">{{order_info.needsitemname}}</view>
        <h1 class="u-padding-35"><text class="u-font-sm">已预付</text>{{ order_info.cost }}<text class="u-font-sm">元</text></h1>
        <text v-if="order_info.buyer_zt == '1'">
			任务完成剩余时间：{{(timestamp/60).toFixed(0)}}分钟
			<!-- <u-count-down v-if="order_info.buyer_zt == '1'" :timestamp="timestamp" :show-seconds="true" @end="autocancelorder('-1', '-1', '')"></u-count-down> -->
		</text>
        
        <view class="u-margin-30 u-font-32"><h3>{{ order_info.showzt }} </h3></view>
      </view>
		
<view v-if="order_info.selluid==user.userInfo.users_id">
	<!--业主方-->
      <view class="base-panel-box">
        <view class="htitle">
          接单人信息
        </view>
        <view class="item">
          <view>接单人地址：</view>
		  <view> {{ order_info.buyfulladress }} </view>
        </view>
		<view class="item">接单手机： {{ order_info.buymobile }} </view>
		<view class="item" @tap="chatTo(order_info)">在线联系：点击聊天</view>
		<view class="item" v-if="order_info.jiddan_bond_paystatus==1">已交保证金： {{ order_info.jiedan_bond }} 元 </view>
      </view>
	  <u-gap height="30"></u-gap>

      <u-button  type="" @click="iodd_sell()" v-if=" order_info.seller_status == '10'">接单者没有完成任务，进入申诉</u-button >
      <u-gap height="10"></u-gap>
      <u-button type="success" @click="iacceptok()" v-if="order_info.seller_status == '10'">确认接单人已完成任务</u-button>
      <u-gap height="10"></u-gap>
      <u-button type="" @click="ilongtime()" v-if="order_info.seller_status == '1' && timestamp > 0 && order_info.selluid==user.userInfo.users_id">重置等待时间 延长等待至{{ order_info.timelimit }}分钟</u-button>
      <!-- <u-button type="" class="u-m-t-20" @click="ilongtime()" v-if="order_info.seller_status == '1' && order_info.selluid==user.userInfo.users_id">恶意接单，取消此人任务</u-button> -->

</view>
<view v-else>
<!--接单方-->
			
      <view class="base-panel-box">
        <view class="htitle">
          服务卡
        </view>
        <view class="item">
          服务地址： {{ order_info.hisfulladress }} 
        </view>
		<view class="item">业主手机： {{ order_info.hismobile }} </view>
		<view class="item" @tap="chatTo(order_info)">在线联系：点击聊天</view>
		<view class="item" v-if="order_info.jiddan_bond_paystatus==1">已交保证金： {{ order_info.jiedan_bond }} 元 </view>
      </view>
      <u-gap height="30"></u-gap>
	  <view class="u-text-center u-type-error">未按规定产生一个争议订单并败诉后，将失去接单资格。</view>
      <u-gap height="30"></u-gap>
      <view v-if="order_info.buyer_zt == '10'" >
        <u-button type="success" :disabled="dis">
          <u-count-down :timestamp="timestamp" :show-seconds="true" @end="dis == false"  @click="iodd_buy()"></u-count-down>
          我未收到对方服务款</u-button>
      </view>
	  
		<u-button type="success" @click="ipayok()" v-if="order_info.buyer_zt == '1'">我已完成{{order_info.needsitemname}}</u-button>
</view>

	<u-gap height="30"></u-gap>
      <view class="base-panel-box">
        <view class="htitle">
          任务详情
        </view>
        <view class="item">
          {{order_info.content}}
			<view v-for="(item, index) in order_info.img" :key="index" class="u-text-center u-m-t-30">
				<image class="pre-item-image" :src="item.pic" mode="widthFix"></image>
			</view>
        </view>
      </view>
	
    </view>
    <u-gap height="120"></u-gap>

    <u-popup v-model="return_pops_show" mode="center" width="88%" border-radius="20">
      <view class="return_pops">
        <view class="u-padding-30">
          <h3>确认离开</h3>
          <u-gap height="20"></u-gap>
          <h5>如您已经完成任务，请务必先点击“我已成功完成任务”</h5>

          <u-gap height="20"></u-gap>
          <view><u-icon
                name="zhifuchenggong"
                custom-prefix="customicon"
                size="30"
                color="blue"></u-icon>我确认还没有完成任务</view>
        </view>
        <view style="position: absolute; bottom: 10rpx; width: 100%">
          <view class="u-padding-20">
            <u-row gutter="16" justify="space-between" style="width: 100%">
              <u-col span="6">
                <u-button type="" @click="isback()">暂时离开，稍会再来</u-button>
              </u-col>
              <u-col span="6">
                <u-button type="primary" @click="cancelorder()">坚持离开取消任务</u-button>
              </u-col>
            </u-row>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>


<script>
import {mapState,mapMutations} from 'vuex';
export default {
  data() {
    return {
      dis: true,
      order_info: [],
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      recordid: "",
      timestamp: 0, //倒计时
      return_pops_show: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad(options) {
	let query = JSON.parse(decodeURIComponent(options.query));
	console.log(query)
    this.recordid = query.recordid;
    this.hasLogin = this.$store.getters.loginFlag;
    this.getpagecontrac();
  },
  onPullDownRefresh() {
    this.getpagecontrac();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 500);
  },
  methods: {
    isback() {
      uni.navigateBack({
        deta: 1,
      });
    },
    chat_linkTo() {
      let room_id = this.order_info.buyuid + this.order_info.selluid;
      let client_uesrs_id;
      if (this.order_info.transtype == "mybuy") {
        client_uesrs_id = this.order_info.selluid;
      }
      if (this.order_info.transtype == "mysell") {
        client_uesrs_id = this.order_info.buyuid;
      }
      this.$Router.push({
        path: "/pages/chat/chat",
        query: { messageId: room_id, fromUserId: client_uesrs_id },
      });
    },
    BackPage() {
      if (
        (this.order_info.buyer_zt == 1 || this.order_info.seller_status == 1) &&
        this.order_info.buyuid == this.user.userInfo.users_id
      ) {
        this.return_pops_show = true;
      } else {
        this.isback();
      }
    },
    cancelorder() {
      let msg = this.autocancelorder("-100", "-100", "1"); //我已确认付款
      //this.$u.toast('交易已取消');
      setTimeout(() => {
        this.$Router.push({
          path: "/pages/ctc/index",
          query: {},
        });
      }, 500);
    },
    autocancelorder(zt, status, uptime) {
      //if (this.order_info.buyer_zt>=10) return;
      this.$api("ctc.setadrecord", {
        recordid: this.recordid,
        buyer_zt: zt,
        seller_status: status,
        updatetime: uptime,
      }).then((res) => {
          this.$u.toast(res.data.msg);
          if (zt == "-1" || status == "-1") {
            setTimeout(() => {
              this.$Router.push({
                path: "/pages/ctc/index",
                query: {},
              });
            }, 500);
          } else {
            return this.res.data.msg;
          }
        })
        .catch((e) => {});
    },
    ipayok() {
      uni.showModal({
        title: "温馨提示",
        content: "是否确定已完成？",
        success: (res) => {
          if (res.confirm) {
            let msg = this.autocancelorder("10", "10", "1"); //我已确认付款
            this.$u.toast(msg);
            setTimeout(() => {
              this.getpagecontrac();
            }, 500);
          }
        },
      });
      return true;
    },
    iodd_sell() {
      //卖方未收到放款   1111卖方投诉
      uni.showModal({
        title: "温馨提示",
        content: "是否进入投诉？",
        success: (res) => {
          if (res.confirm) {
            this.autocancelorder("11", "11", ""); //我已确认付款
            setTimeout(() => {
              this.getpagecontrac();
            }, 500);
          }
        },
      });
    },
    iodd_buy() {
      //买方未收到货物    1212 买方投诉
      uni.showModal({
        title: "温馨提示",
        content: "是否进入投诉？",
        success: (res) => {
          if (res.confirm) {
            this.autocancelorder("12", "12", ""); //我已确认付款
            setTimeout(() => {
              this.getpagecontrac();
            }, 500);
          }
        },
      });
    },
    ilongtime() {
      this.autocancelorder("", "", "1");
      setTimeout(() => {
        this.getpagecontrac();
      }, 500);
    },
    iacceptok() {
      uni.showModal({
        title: "温馨提示",
        content: "是否确定已收到款？",
        success: (res) => {
          if (res.confirm) {
            let msg = this.autocancelorder("100", "100", ""); //我已确认付款
			setTimeout(() => {
					this.$api("ctc.releasecoin", {
						  //去放款
						  recordid: this.recordid,
						}).then((res) => {
							console.log(res)
							if (res.code==200){
								  this.getpagecontrac();
							}else{
								this.autocancelorder("13", "13", ""); //回退
								this.$u.toast(res.msg);
								setTimeout(() => {
									this.getpagecontrac();
								}, 500);
							}
					}).catch((e) => {});
			}, 500);
          }
        },
      });
      return true;
    },
    getpagecontrac() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("ctc.myorderview", {
          recordid: this.recordid,
        }).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.order_info = res.data;
              //console.log(new Date().getTime());
              //console.log(res.data.add_time * 1000);
              this.timestamp = res.data.times_countdown;
              if (this.timestamp <= 0) this.dis = false; //时间到，买家按钮投䜠对方未付款可用
            }
            this.loadstatus = false;
          }).catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },
    chatTo(item) {
      let room_id = item.room_id;
      this.$Router.push({
        path: "/pages/chat/chat",
        query: { messageId: room_id,roomname:''}
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.return_pops {
  border-radius: 50rpx;
  height: 350rpx;
  position: relative;
}
</style>
