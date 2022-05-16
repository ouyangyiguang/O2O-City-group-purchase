<template>
  <account-page :title="title" :desc="desc">
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus"/>
    <view class="u-padding-20" v-if="!hasLogin">
      <u-empty text="请先登陆" mode="permission"></u-empty>
    </view>

    <view class="" v-else>
      <u-empty text="没有数据" mode="data" :show="flow_list.length === 0" v-if="loadstatus == false"></u-empty>
      <view class="u-p-t-10" v-if="flow_list.length > 0">
        <u-gap height="16" bg-color="#f3f4f6"></u-gap>
        <view
          class="base-tonglan-box u-m-b-30"
          style="border: none"
          v-for="(item, index) in flow_list"
          :key="index"
		   @click="$Router.push({path: '/pages/ctc/myorderview', query: {recordid: item.id}})">
          <view class="htitle_s2">
            <u-row gutter="16" justify="space-between">
              <u-col span="6">
                <view>{{ item.needstypename }} - {{ item.needsitemname }}</view>
			  </u-col>
              <u-col span="6" text-align="right">
                {{ item.showzt}}<u-icon name="xiangyoujiantou u-m-l-10"
                    custom-prefix="customicon"
                    size="30"></u-icon>
              </u-col>
            </u-row>
          </view>
          <view class="item">
            <u-row gutter="16" justify="space-between">
              <u-col span="4"
                text-align="left"
                class="u-font-xs u-type-success-light"
                >时间</u-col >
              <u-col span="4"
                text-align="center"
                class="u-font-xs u-type-success-light">数量</u-col>
              <u-col
                span="4"
                text-align="right"
                class="u-font-xs u-type-success-light"
                >交易总额</u-col>
            </u-row>
            <u-row gutter="16" justify="space-between">
              <u-col span="4" text-align="left">{{ item.add_time }}</u-col>
              <u-col span="4" text-align="center">
                {{ item.nums }}
              </u-col>
              <u-col span="4" text-align="right">
                {{ item.cost }}
              </u-col>

            </u-row>
          </view>
          <u-gap height="16" bg-color="#f3f4f6"></u-gap>
        </view>
      </view>
			<view v-if="flow_list.length>0">
				<u-loadmore :status="loadStatus" @loadmore="getpagecontrac"></u-loadmore>
			</view>
    </view>
  </account-page>
</template>


<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      title: "任务记录",
      desc: "我的O2O订单详细",
      flow_list: [],
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      page: 1,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad() {
    this.hasLogin = this.$store.getters.loginFlag;
    this.getpagecontrac();
  },
  onReachBottom() {
    this.loadStatus = "loading";
    setTimeout(() => {
      this.getpagecontrac();
      this.loadStatus = "loadmore";
    }, 50);
  },
  methods: {
    getpagecontrac() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("ctc.myorder", {
          page: this.page,
		  limit:10,
        }).then((res) => {
            console.log(res.data);
            if (res.code == 200) {
					if (res.data.count>0){
					let list=res.data.list;
						if (this.page<=res.data.pages){
							for (let i = 0; i < list.length; i++) {
								this.flow_list.push(list[i]);
							}
							if (this.page==res.data.pages){this.loadStatus = 'nomore';}
							this.page+=1;
						}else{
							this.loadStatus = 'nomore';
						}
					}else{
						this.flow_list=[];
						this.loadStatus = 'nomore';
					}
					this.loadstatus=false;
            }
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
</style>
