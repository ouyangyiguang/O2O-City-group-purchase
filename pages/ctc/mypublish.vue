<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
<!-- 	<u-navbar :is-back="true" title="我的发布" :border-bottom="false" :custom-back="back" title-color="#000000"  back-icon-color="#000000">
	</u-navbar> -->
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus" :text="loadstxt"/>
    <view class="u-padding-20" v-if="!hasLogin">
      <u-empty text="请先登陆" mode="permission"></u-empty>
    </view>

    <view  v-else>
      <u-empty
        text="没有数据"
        mode="data"
        :show="flow_list.length === 0"
        v-if="loadstatus == false"
      ></u-empty>
      <view class="u-p-t-10" v-if="flow_list.length > 0">
        <view class="base-panel-box u-m-b-30">
          <view class="item" v-for="(item, index) in flow_list" :key="index">
            <u-row gutter="0" justify="space-between">
              <u-col span="6">
				  <view>
				  <text  class="u-font-32">{{ item.needstypename }} {{ item.needsitemname }} </text>
				  <text>x {{item.needs_num}}</text>
				  </view>
			  </u-col >
              <u-col span="6" text-align="right" class="u-font-xs">{{
                item.add_time
              }}</u-col>
			  </u-row>
			<u-row gutter="0" justify="space-between">
              <u-col span="6">总费用:{{ item.totalamount }}</u-col>
              <u-col span="6" text-align="right" class="u-font-xs">单价:{{ item.needs_price }}</u-col>
			</u-row>
			<u-gap height="10"></u-gap>
			<u-row gutter="0" justify="space-between"  v-if="item.zt!=2">
              <u-col span="12" text-align="right">
				<u-button size="mini" type="error"  class="u-m-l-20" v-if="item.zt==0" >未支付费用</u-button>
                <u-button size="mini" type="primary" class="u-m-l-20" @click="iwant_cancelorder(item.id)" v-if="item.zt==1">正在展示中,终止任务</u-button>
				<u-button size="mini" type="primary" class="u-m-l-20" v-if="item.zt==1"  @click="iwant_edit(item.id)">修改</u-button>
				<u-button size="mini" type="primary"  class="u-m-l-20" @click="iwant_del(item.id)" v-if="item.zt==0" >删除</u-button>
              </u-col>
            </u-row>
			<u-row gutter="0" justify="space-between"  v-else>
              <u-col span="12" text-align="right">
				<view v-if="item.zt==2">已完成订单</view>
              </u-col>
            </u-row>
          </view>
        </view>
      </view>
      <view v-if="flow_list.length > 0">
        <u-loadmore
          :status="loadStatus"
          @loadmore="getpagecontrac"
        ></u-loadmore>
      </view>
    </view>
  </view>
</template>


<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      title: "我的发布",
      desc: "自已发布的服务需求广告",
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
	onPullDownRefresh() {
		this.flow_list=[];
		this.page=1
		this.getpagecontrac();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 500);
	},
  methods: {
	  back(){
			this.$Router.push({
				path: '/pages/my/my',
				query: {}
			});
	  },
    getpagecontrac() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("ctc.adlist", {
          page: this.page,
          limit: 10,
          see_users_id: this.user.userInfo.users_id,
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
            this.loadstatus = false;
          }).catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },
	iwant_edit(adid){
			this.$Router.push({
				path: '/pages/ctc/editpublish',
				query: {
					adid:adid,
					}
			});
	},
	iwant_del(adid){
			  this.$api("ctc.delorder", {
				adid: adid,
			  }).then((res) => {
				  if (res.code == 200) {
					this.$u.toast("删除成功");
					this.flow_list=[];
					this.page=1
					this.getpagecontrac();
				  }
				}).catch((e) => {});
	},
    iwant_cancelorder(adid) {
		
      uni.showModal({
        title: "温馨提示",
        content: "确定终止发布此任务？",
        success: (res) => {
          if (res.confirm) {
			  this.$api("ctc.cancelorder", {
				adid: adid,
			  }).then((res) => {
				  if (res.code == 200) {
					this.$u.toast("取消成功");
					this.flow_list=[];
					this.page=1
					this.getpagecontrac();
				  }
				}).catch((e) => {});
          }
        },
      });
		
		

    },
  },
};
</script>
<style lang="scss" scoped>
</style>
