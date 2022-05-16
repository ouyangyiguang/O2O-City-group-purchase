<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus"/>
    <view class="u-padding-20">
      <u-parse :html="content"></u-parse>
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
	  content:""
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad() {
	this.get_viewnews(19)
  },

  methods: {
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
	
  },
};
</script>
<style lang="scss" scoped>

</style>
