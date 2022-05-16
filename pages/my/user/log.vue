<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus" :text="loadstxt"/>
    <view class="u-padding-20" v-if="!hasLogin">
      <u-empty text="请先登陆" mode="permission"></u-empty>
    </view>

    <view class="" v-else>
      <u-empty text="没有数据"  mode="data"  :show="flow_list.length === 0"  v-if="loadstatus == false" ></u-empty>
      <view class="" v-if="flow_list.length > 0">
        <view class="base-panel-box u-margin-20" v-for="(item, index) in flow_list" :key="index">
          <view class="htitle">
            <view class="u-font-sm">{{ item.create_time }}</view>
          </view>
          <view class="item" style="height: auto">
            <u-row gutter="0" justify="space-between">
              <u-col span="12">
                <view class="demo-layout bg-purple-light"
                  >{{ item.remark }}{{ item.info }}</view
                >
              </u-col>
            </u-row>
          </view>
        </view>
        <view v-if="flow_list.length > 0">
          <u-loadmore :status="loadStatus" @loadmore="getflowlist"></u-loadmore>
        </view>
      </view>
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
      page: 1,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad(options) {
		let query=this.user.chatScenesInfo.query;
		if (query != null && query!="" && query!=undefined){
			console.log(query)
			let querys=JSON.parse(query);
			//this.$store.commit('setChatScenesInfo', querys);
		}
		
    this.hasLogin = this.$store.getters.loginFlag;
    this.getflowlist();
	
  },
  onReachBottom() {
    this.loadStatus = "loading";
    setTimeout(() => {
      this.getflowlist();
      this.loadStatus = "loadmore";
    }, 50);
  },
  onPullDownRefresh() {
    this.flow_list = [];
    this.page = 1;
    this.getflowlist();

    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 500);
  },
  methods: {
    getflowlist() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("user.userlog", {
          page: this.page,
          limit: 10,
        })
          .then((res) => {
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
          })
          .catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
