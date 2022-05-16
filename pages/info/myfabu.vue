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
              <u-col span="12">
						 <view> {{ item.name }}</view>
						 <view>
							<u-row gutter="0" justify="space-between">
								<u-col span="12" >
									<view @click="$Router.push({path: '/pages/info/view', query: {id: item.content_id}})">
										<text :style="'color:'+item.category_style">【{{ item.category_name }}】</text>{{ item.content }}
									</view>
								</u-col>
							</u-row>
						 </view>
			  </u-col >
			  </u-row>

			<u-gap height="10"></u-gap>
			<u-row gutter="0" justify="space-between">
              <u-col span="12" text-align="right">
				<u-button size="mini" type="error"  class="u-m-l-20" @click="iwant_cancelorder(item.content_id)">关闭展示</u-button>
				<u-button size="mini" type="primary" class="u-m-l-20"  @click="iwant_edit(item.content_id)">修改</u-button>
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
        this.$api("info.list", {
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
	iwant_edit(id){
			this.$Router.push({
				path: '/pages/info/fabu',
				query: {
					id:id,
					}
			});
	},

    iwant_cancelorder(content_id) {
      uni.showModal({
        title: "温馨提示",
        content: "确定关闭此信息？",
        success: (res) => {
          if (res.confirm) {
			  this.$api("info.cancel", {
				content_id: content_id,
			  }).then((res) => {
				  if (res.code == 200) {
					this.$u.toast("关闭成功");
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
