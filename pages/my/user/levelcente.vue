<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus"/>
    <view class="u-padding-20" v-if="!hasLogin">
      <u-empty text="请先登陆" mode="permission"></u-empty>
    </view>

    <view class="u-padding-20">
      <view class="mingpian u-m-b-30">
		<view class="lefttips">购买年卡</view>
        <view class="htitle u-m-t-30 u-m-b-2">
          <!-- <i><u-icon name="bankcard" custom-prefix="customicon" size="30"></u-icon></i> -->
          年保卡
        </view>
		<view class="u-m-b-2" style="color: #909399;">
			全年保障服务，享受品质服务。
		<u-radio-group v-model="level_value" :wrap="true">
          <u-radio class="ssradio"
            @change="levle_change"
            v-for="(item, index) in leveltypelist"
            :key="index"
            :name="item.type_id"
            active-color="#BD1E2C">
            <text>{{ item.type_name }} {{ item.price }} 元/{{ item.limit_name }}</text>
          </u-radio>
        </u-radio-group>
		</view>
		
      </view>
	  
	 <view class="content">
        <view class="htitle u-m-t-30 u-m-b-2">
          <i><u-icon name="bankcard" custom-prefix="customicon" size="30"></u-icon></i>
          <text style="color:#E4BB7B">产品介绍</text>
        </view>
	 <rich-text :nodes="content"></rich-text>
	 </view>
	 <u-gap height="150"></u-gap>
      
    </view>
	  <view class="flexbottom">
		  <u-button type="success" class="submit" @click="confirm()" :hairLine="false" style="background: #4B536A;">
		  购买</u-button>
	  </view>
	
	
  </view>
</template>


<script>
import { mapState, mapMutations } from "vuex";
// #ifdef MP-WEIXIN
import { setPay, setPayAssign } from "@/plugins/wxutils";
// #endif
export default {
  data() {
    return {
      flow_list: [],
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      loadstxt: "loading...",
      leveltypelist: [],
      level_value: "1",
      coin_list: [],
      pay_coinclass: 1,
      price: 99, //等级1价
      platform: "",
	  content:""
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad() {
    this.hasLogin = this.$store.getters.loginFlag;
    this.get_level_type();
    this.getcoin();
    // #ifdef MP-WEIXIN || MP
    this.platform = "weixin";
    // #endif
    // #ifdef H5
    this.platform = "h5";
    // #endif
    // #ifdef APP-PLUS
    this.platform = "app";
    // #endif
	this.get_viewnews(18)
  },

  methods: {
    levle_change(e) {
      this.level_value = e;

      for (let i = 0; i < this.leveltypelist.length; i++) {
        console.log(this.leveltypelist);
        if (this.leveltypelist[i].type_id == this.level_value) {
          this.price = this.leveltypelist[i].price;
          break;
        }
      }
      console.log(this.price);
    },
    coin_change(e) {
      this.pay_coinclass = e;
    },
	  get_viewnews(newsid){
		this.openwiddowpops=true;
        this.$api("archives.article_view", {
			content_id:newsid
		}).then((res) => {
            if (res.code == 200) {
				this.content=res.data.content
            }
          }).catch((e) => {});
	  },
    get_level_type() {
      return new Promise((resolve, reject) => {
        this.$api("user.leveltypemanage", {})
          .then((res) => {
            this.leveltypelist = res.data;
          })
          .catch((e) => {});
      });
    },
    getcoin() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("assets.coin_list", {})
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.coin_list = res.data.list;
            }
            resolve(true);
            this.loadstatus = false;
          })
          .catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },

    confirm() {
      if (this.level_value == "") {
        this.$u.toast("请选择一个会员类型");
      }

      if (this.pay_coinclass != 1) {
        this.confirm_ok();
        return;
      }
      uni.showModal({
        title: "温馨提示",
        content:
          "如果现金余额不够，将会跳转到微信支付。",
        success: (res) => {
          if (res.confirm) {
            setTimeout(() => {
              this.confirm_ok();
            }, 500);
          }
        },
      });
    },

    confirm_ok() {
      return new Promise((resolve, reject) => {
        this.$api("user.levelupgradepay", {
          users_id: this.user.userInfo.users_id,
          type_id: this.level_value,
          pay_coinclass: this.pay_coinclass,
          platform: this.platform,
        })
          .then((res) => {
            console.log(res);

            if (res.data.needpay == 1) {
              
				// #ifdef MP-WEIXIN
					this.onAppWxPay(res.data.paydata)
				// #endif
				// #ifdef H5
					this.$u.toast("调起支付失败，请在小程序内支付。");
				//#endif
				
            } else {
			  //this.$store.commit("USER_INFO", res.data);
              this.$store.dispatch("getUserInfo");
              this.$u.toast(res.data.msg);
              setTimeout(() => {
                uni.navigateBack(1);
                // this.$Router.push({
                // 	path: '/pages/my/my',
                // 	query: {}
                // });
              }, 1500);
            }
          })
          .catch((e) => {});
      });
    },
	
    onAppWxPay(paydata) {
		console.log(paydata)
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
		  this.$Router.push({
			path: "/pages/my/my",
			query: {},
		  });
        }
      );
    },
	
	
  },
};
</script>
<style lang="scss" scoped>
.ssradio {
  border: solid 0px #2b85e4;
  padding: 10rpx 20rpx 10rpx 0rpx;
  margin: 10rpx 0rpx;
  border-radius: 20rpx;
  color: #FFFFFF;
}
.ppradio {
  padding: 5rpx 20rpx;
}
.content{
	color: #999999;
	line-height: 180%;
}

.mingpian{
	background: #F1F2F7;
	color: #4B536A;
	border-radius: 18rpx;
	padding: 20rpx;
	position: relative;
	.lefttips{
		background: #4B536A;
		height: 50rpx;
		line-height: 40rpx;
		border-radius: 18rpx 0rpx 50rpx 0rpx;
		position: absolute;
		left:0rpx;top:0rpx;
		width: 200rpx;
		padding: 6rpx 5rpx 4rpx 5rpx;
		color: #FFFFFF;
		text-align: center;
		font-size: 24rpx;
		
	}
}
.submit{
	background: #4B536A;
	color: #FFFFFF;
	border-radius: 50rpx;
	border: none;
}

</style>
