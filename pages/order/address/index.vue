<template>
  <view class="u-padding-20">
	  <ourLoading isFullScreen :active="loadstatus"/>
    <u-empty text="地址列表" mode="page" v-if="addressList.length === 0"></u-empty>

    <view v-for="(res, index) in addressList" :key="res.addr_id" class="base-panel-box u-m-b-20">
	<view  @click="checkAddress(res)">
      <view class="htitle">
        <i><u-icon name="dizhi" custom-prefix="customicon" size="30"></u-icon></i>
        {{ res.province_name }}{{ res.city_name }}{{ res.area_name }}
        <view class="right"><u-icon name="edit-pen" color="#999999" @click="toAddSite('edit', res)" v-if="res.addr_id==null"></u-icon></view>
      </view>
      <view class="item">
			<text v-if="res.addr_id>0">{{ res.businessname }}</text>
			<text v-else>{{ res.address }}</text>
			<text class="u-p-l-20" v-if="res.is_default">[默认]</text>
      </view>
	  </view>
    </view>

    <view class="addSite u-m-t-50" @tap="toAddSite('add')">
      <view class="add">
        <u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建地址
      </view>
    </view>
	<u-gap height="200"></u-gap>
  </view>
</template>

<script>
export default {
  data() {
    return {
	  loadstatus:false,
      addressList: [],
      source: 0,
    };
  },
  onLoad(option) {
    this.source = option.source;
  },
  onShow() {
    this.refreshList();
  },
  methods: {
    //添加或修改成功之后回调
    refreshList(data, type) {
		this.loadstatus=true
      this.$api("order.address_list", {}).then((res) => {
          if (res.code == 200) {
            this.addressList = Array.isArray(res.data) ? res.data : [];
          }
		  this.loadstatus=false
        }).catch((e) => {});
    },
    toAddSite(type, item) {
      this.$Router.push({
        path: "/pages/order/address/addsite",
        query: {
          type: type,
          item: item,
        },
      });
      // uni.navigateTo({
      //     url: '/pages/order/address/addsite'
      // });
    },
    checkAddress(item) {

      if (this.source == 1) {
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];
        // #ifdef H5
        prePage.addressData = item;
        // #endif
        prePage.$vm.addressData = item;

        uni.navigateBack(1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  padding: 20rpx 20rpx;
  .top {
    display: flex;
    font-weight: bold;
    font-size: 34rpx;
  }
  .bottom {
    display: flex;
    margin-top: 20rpx;
    font-size: 28rpx;
    justify-content: space-between;
    color: #999999;
  }
}
.addSite {
  display: flex;
  justify-content: space-around;
  width: 600rpx;
  line-height: 100rpx;
  margin: auto;
  bottom: 120rpx;
  left: 80rpx;
  background-color: red;
  border-radius: 60rpx;
  font-size: 30rpx;
  .add {
    display: flex;
    align-items: center;
    color: #ffffff;
    .icon {
      margin-right: 10rpx;
    }
  }
}
</style>
