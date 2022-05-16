<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <ourLoading isFullScreen :active="loadstatus"/>
    <view class="u-padding-20" v-if="!hasLogin">
      <u-empty text="请先登陆" mode="permission"></u-empty>
    </view>

    <view class="u-padding-20" v-else>

      <u-gap height="30"></u-gap>
      <view class="u-text-center">
		接单后需在 {{(adinfo.timelimit/60).toFixed(2)}}小时 内完成。
      </view>
		

	<u-gap height="30"></u-gap>
      <view class="base-panel-box">
        <view class="htitle">
          任务详情
        </view>
        <view class="item">

		  <u-parse :html="content" :selectable="true"></u-parse>
			<view v-for="(item, index) in adinfo.img" :key="index" class="u-text-center u-m-t-30">
				<image class="pre-item-image" :src="item.pic" mode="aspectFill"></image>
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
      dis: true,
      adinfo: [],
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      adid: "",
      timestamp: 0, //倒计时
      return_pops_show: false,
	  content:''
	  
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad(options) {
	let query = JSON.parse(decodeURIComponent(options.query));
	console.log(query)
    this.adid = query.adid;
    this.hasLogin = this.$store.getters.loginFlag;
    this.info(this.adid);
  },

  methods: {

	info(adid){
		this.$api("ctc.adinfo", {adid: adid,}).then((res) => {
							if (res.code==200){
								this.adinfo=res.data
								this.content=res.data.content
							}
						}).catch((e) => {});
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
.pre-item-image{
	max-width: 96%;
	margin: auto;
}
</style>
