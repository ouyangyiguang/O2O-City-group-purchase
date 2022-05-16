<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus" :text="loadstxt"/>

	<view class="u-padding-20">
		<view class="u-m-t-20">
			1、重复添加的小区名字将不会被审核。
		</view>
	</view>
	<view class="flexbottom">
		<view @click="$tools.routerTo('/pages/exbusiness/create/addcompany')">同意，继续下一步</view>
	</view>
  </view>
</template>


<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      flow_list: [],
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      loadstxt: "loading...",
    };
  },

  onLoad(options) {
  },

  methods: {

  },
};
</script>
<style lang="scss" scoped>
</style>
