<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus"/>

    <view class="flexView">
      <view class="scrollView">
        <view class="head-read">
          <view class="flex">
            <image class="read-img" :src="coininfo.icons" mode="aspectFill" />
            <view class="flex-box">
              <view class="flex-box-text">{{ coinname }}</view>
              <view class="flex-box-text">{{ (coininfo.balance_total * 1).toFixed(2) }} {{ coininfo.unit }}</view>
            </view>

            <view class="tx-btn" v-if="coininfo.id == 1" @click="$tools.routerTo( '/pages/my/assets/ticash')"><span class="tx-grid-comm-sign">提现</span></view>
            <view class="tx-btn" v-if="coininfo.id != 1"
              @click="$tools.routerTo( '/pages/my/assets/congcoin','selectcoinid=' + coininfo.id)"><span class="tx-grid-comm-sign">充币</span></view>
            <view class="tx-btn" v-if="coininfo.id != 1"
              @click=" $tools.routerTo( '/pages/my/assets/ticoin', 'selectcoinid=' + coininfo.id)"><span class="tx-grid-comm-sign">立即提币</span></view>
          </view>
        </view>
        <view class="white-box">
          <view class="palace palace-one">
            <view class="palace-grid">
              <view class="palace-grid-text">
                <view class="palace-grid-text-data">
                  <text></text>
                  <text class="palace-grid-text-data-b">{{ (coininfo.balance_available * 1).toFixed(2) }}</text>
                </view>
                <view class="palace-grid-text-name" @click="showModal = true">可用余额</view>
              </view>
            </view>
            <view class="palace-grid">
              <view class="palace-grid-text">
                <view class="palace-grid-text-data">
                  <text></text>
                  <text class="palace-grid-text-data-b">{{ (coininfo.balance_forzen * 1).toFixed(2) }}</text>
                </view>
                <view class="palace-grid-text-name" @click="showModal = true">冻结数额</view>
              </view>
            </view>
          </view>
        </view>
		</view></view>
		<u-gap height="10"></u-gap>
		<view class="u-p-l-20 u-p-r-20">

          <u-tabs
            name="cate_name"
            :list="tabs"
            :is-scroll="false"
            :current="currentTab"
            @change="changeTab"
            class=""
            bg-color="#ffffff"
            height="60"
            inactive-color="#999999"
            :active-item-style="tabsstyle"
            :show-bar="false"
            duration="0"
            active-color="#ffffff"
          ></u-tabs>

        <view class="list-view">
          <u-empty text="没有数据" mode="data" :show="flow_list.length === 0"  v-if="loadstatus == false" class="u-maring-50"></u-empty>
          <view class="list-item" v-for="(item, index) in flow_list" :key="index" hover-class="hover" :hover-stay-time="150" bindtap="detail">
            <view class="content-box">
              <view class="des-box" v-if="currentTab == 3">
                <view class="tit">
                  {{ (item.trueamount * 1).toFixed(4) }}{{ coininfo.unit }}
                </view>
                <view class="source" :style="{color: item.status == 1
                        ? '#4caf50'
                        : item.status == 2
                        ? '#ff1e0f'
                        : '#00b7ff',}">
                  提现{{item.status == 1
                      ? "成功"
                      : item.status == 2
                      ? "失败"
                      : "处理中"}}
                </view>
                <view class="source">
                  提现帐号：{{ item.towalletaccount }}
                </view>
                <view class="time">{{ item.add_time }}</view>
              </view>
              <view class="des-box" v-else>
                <view class="tit">
                 {{currentTab == 3 ? "流水号：" + item.id : "总额：" + (item.surplus*1).toFixed(2)}}
                  <u-tag :text="item.behaviorname" :type="item.opera == '+' ? 'success' : 'error'" size="mini" class="u-m-l-10"/>
                </view>
                <view class="source">
                  {{ item.remark }}
                </view>
                <view class="time">{{ item.add_time }}</view>
              </view>
            </view>
            <view class="money" v-if="currentTab != 3" :class="item.opera == '+' ? 'jia' : 'shao'">
			  {{ currentTab == 3 ? item.coin : (item.coin * 1).toFixed(2) }}
              {{ coininfo.unit }}
			</view>
          </view>
          <view v-if="flow_list.length > 0">
            <u-loadmore :status="loadStatus" @loadmore="getflowlist"></u-loadmore>
          </view>
        </view></view>
        <!-- <view class="tip">仅显示近半年内的收支记录</view> -->
      
    

    <u-popup v-model="showModal" mode="center">
      <view class="cu-modal">
        <view class="cu-dialog">
          <view class="cu-bar bg-white justify-end">
            <view class="u-padding-35 u-font-xl">名词解释</view>
          </view>
          <view class="" style="text-align: left; padding: 0rpx 35rpx 50rpx 35rpx">
            <view>
              <text class="u-type-error-dark">可用余额：</text>
              <text>当前您可以提现的金额</text>
            </view>
            <view class="u-m-t-10">
              <text class="u-type-error-dark">冻结数额：</text>
              <text>交易中的金额，交易成功后可解冻</text>
            </view>

            <view class="u-m-t-10"
              ><text class="u-type-info-dark">*注：所有金额币种均为{{ coinname }}，单位为{{coininfo.unit}}</text
              ></view>
          </view>
          <view class="cu-bar bg-white justify-end">
            <view class="action">
			<button class="cu-btn bg-green margin-left" @tap="showModal = false">
                我已知晓
            </button></view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      selectList: [],
      flow_list: [],
      coininfo: [],
      loadStatus: "loadmore",
      page: 1,
      coinclassid: 0,
      coinname: "",
      date: "incomeMonth",
      currentTab: 0,
      tabs: [
        {
          name: "所有记录",
        },
        {
          name: "充值记录",
        },
        {
          name: "解锁冻结",
        },
        {
          name: "提现记录",
        },
      ],
      tabsstyle: {
        background: "#ff8a4a",
        borderRadius: "20rpx",
      },
      behaviorclass: "",
    };
  },
  onLoad(option) {

	let query = JSON.parse(decodeURIComponent(option.query));
    console.log(option);
    this.coinname = query.name;
    uni.setNavigationBarTitle({
      title: this.coinname,
    });
    this.coinclassid = query.id;

    this.$api("assets.coin_detail", {
      coinclass: this.coinclassid,
    })
      .then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.coininfo = res.data;
        }
      })
      .catch((e) => {});

    let flag = this.getflowlist();
  },

  onPullDownRefresh() {
	if(this.currentTab==0){
		this.flow_list = [];
		this.page = 1;
		this.getflowlist();
	}else if (this.currentTab == 2) {
		//解冻记录
		this.freezelog();
      }else if (this.currentTab == 3) {
		//解冻记录
		this.gettibilog();
      }
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 500);
  },
  methods: {
    changeTab(e) {
      this.currentTab = e;
      this.flow_list = [];
      this.page = 1;
      this.date = "";
      if (this.currentTab == 3) {
        this.gettibilog();
      } else if (this.currentTab == 0) {
        this.behaviorclass = "";
		this.getflowlist();
      } else if (this.currentTab == 1) {
        this.behaviorclass = "1";
        this.date = "incomeYesterday";
		this.getflowlist();
        //this.date = "incomeMonch";
      } else if (this.currentTab == 2) {
		//解冻记录
		this.freezelog();
      }
    },
    freezelog() {
      this.loadstatus = true;
      return new Promise((resolve, reject) => {
        this.$api("assets.freeze_log", {
          page: this.page,
          limit: 10,
          coinclass: this.coinclassid,}).then((res) => {
            console.log(res);
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
			this.loadstatus = false;
          }).catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },
    gettibilog() {
      this.loadstatus = true;
      return new Promise((resolve, reject) => {
        this.$api("assets.ti_bi_log", {
          page: this.page,
          limit: 10,
          coinclass: this.coinclassid,}).then((res) => {
            console.log(res);
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
			this.loadstatus = false;
          }).catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },

    getflowlist() {
      this.loadstatus = true;
      return new Promise((resolve, reject) => {
        this.$api("assets.coinflow_list", {
          page: this.page,
          limit: 10,
          coinclass: this.coinclassid,
          date: this.date,
          behaviorclass: this.behaviorclass,
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
			this.loadstatus = false;
          }).catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// .page-wrap,.qs-page-wrap{
// 	background: #FFFFFF;
// }
.u-load-more-wrap {
  padding: 50rpx;
}

.flexView {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  .scrollView {
    width: 100%;
    height: 100%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    .head-read {
      //background: linear-gradient(to right, #ff8440, #ff1e0f);
      background-color: #fe5c47;
      padding-bottom: 50rpx;
      .flex {
        display: flex;
        align-items: center;
        padding: 30rpx;
        position: relative;
        .read-img {
          width: 120rpx;
          height: 120rpx;
          border-radius: 100%;
          overflow: hidden;
          margin-right: 20rpx;
          border: 4rpx solid rgba(255, 255, 255, 0.3);
        }
        .flex-box {
          flex: 1;
          min-width: 0;
          font-size: 26rpx;
          color: #333;
          &-text {
            margin: 10rpx 0;
            color: #f5f5f5;
            font-weight: normal;
          }
        }
        .arrow {
          position: relative;
          padding-right: 30rpx;
          span {
            font-size: 28rpx;
            color: white;
          }
          &:after {
            content: " ";
            display: inline-block;
            height: 12rpx;
            width: 12rpx;
            border-width: 4rpx 4rpx 0 0;
            border-color: #848484;
            border-style: solid;
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            position: relative;
            top: -4rpx;
            position: absolute;
            top: 50%;
            margin-top: -8rpx;
            right: 4rpx;
            border-radius: 2rpx;
          }
        }
        .arrow-one:after {
          border-color: white;
          margin-top: -6rpx;
        }
      }
    }
    .white-box {
      width: 94%;
      background: $u-bg-color;
      border-radius: 10rpx;
	  padding-top: 30rpx;
      margin: -60rpx auto 20rpx;
      box-shadow: 0 6rpx 20rpx #dddddd;
      .tx {
        padding-top: 20rpx;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-content: center;
        &-grid {
          box-sizing: border-box;
          &:first-child {
            margin-left: 20rpx;
          }
          &-comm-sign {
            display: block;
            border-radius: 10rpx;
            font-size: 26rpx;
            padding: 10rpx;
            background: linear-gradient(to right, #fef082, #ffc551);
            background-color: #fef082;
            color: #cf4400;
          }
          &-text {
            display: block;
            color: #ff6423;
            font-size: 26rpx;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            .title {
              font-size: 26rpx;
              font-weight: normal;
              color: #ff6423;
            }
            .money {
              font-size: 32rpx;
              color: #ff6423;
              letter-spacing: 2rpx;
              margin-bottom: 10rpx;
              &-b {
                font-size: 28rpx;
                padding: 0rpx 40rpx 0rpx 10rpx;
              }
            }
          }
        }
      }
      .palace {
        padding-bottom: 30rpx;
        overflow: hidden;
        display: flex;
        justify-content: center;
        &-grid {
          flex: 1;
          position: relative;
          box-sizing: border-box;
          &:not(:last-child) {
            &:after {
              width: 1rpx;
              height: 80rpx;
              background: #fddece;
              content: " ";
              display: inline-block;
              position: absolute;
              top: 0;
              right: 0;
            }
          }
          &-text {
            display: block;
            text-align: center;
            color: #333;
            font-size: 32rpx;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            &-name {
              font-size: 26rpx;
              font-weight: normal;
              color: #ff8a4a;
            }
            &-data {
              font-size: 32rpx;
              color: #ff8a4a;
              letter-spacing: 2rpx;
              margin-bottom: 5rpx;
              &-b {
                font-size: 20rpx;
              }
            }
          }
        }
      }
    }
  }
}
.tx-btn {
  border-radius: 40rpx;
  font-size: 26rpx;
  padding: 16rpx 44rpx;
  background: linear-gradient(to right, #fef082, #ffc551);
  background-color: #fef082;
  color: #cf4400;
  margin-left: 30rpx;
}

.list-view {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.list-item {
  width: 100%;
  padding: 30rpx 0rpx;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1rpx solid $u-border-color;
}
.list-item:last-child {
  border-bottom: 0rpx;
}

.item-last::after {
  left: 0 !important;
}

.content-box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.des-box {
  min-height: 80rpx;
  padding-left: 28rpx;
  box-sizing: border-box;
  vertical-align: top;
  font-size: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tit {
  font-size: 32rpx;
  max-width: 420rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.source {
  margin: 12rpx 0;
}
.time {
  color: #888;
}

.money {
  display: inline-block;
  font-size: 30rpx;
  font-weight: 500;
  color: #fe5c47;
  // white-space: nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;
  padding-right: 50rpx;
  &.jia {
    color: #18b566;
  }
  &.shao {
    color: red;
  }
}

.tip {
  margin-top: 50rpx;
  display: flex;
  justify-content: center;
  align-content: center;
  font-size: 24rpx;
  color: #888;
}
</style>
