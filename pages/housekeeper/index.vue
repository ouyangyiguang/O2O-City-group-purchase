<template>
  <view>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus" :text="loadstxt"/>
	
	<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
 
    <view class="u-padding-20" v-if="current==0">
      <u-empty text="没有数据" mode="data" :show="flow_list.length === 0" v-if="loadstatus == false"></u-empty>
      <view class="u-p-t-10" v-if="flow_list.length > 0">
        <view v-for="(item, index) in flow_list" :key="index" class="base-panel-box u-m-b-30" :class="item.status==0?'disabled':''">
          <view class="htitle">
            {{item.city_name}} {{item.villagename}}
            <view class="right u-font-xs">【{{item.verifytitle}}】</view>
          </view>
          <view class="item" v-if="item.status==1">
            <u-row gutter="16" justify="space-between">
              <u-col span="8">{{item.building}} {{item.roomnumber}}</u-col>
				<u-col span="2" text-align="right">
				  <u-button size="mini" @click="$Router.push({path: '/pages/housekeeper/identification', query: {id: item.package_id,img:item.verify_img}})">认证</u-button>
				</u-col>
				<u-col span="2" text-align="right">
				  <!-- <u-button size="mini" @click="$Router.push({path: '/pages/housekeeper/roommanage', query: {id: item.positionmarker}})">查看</u-button> -->
				  <u-button size="mini" @click="$Router.push({path: '/pages/housekeeper/roommanage', query: {item: item}})">修改</u-button>
				</u-col>
            </u-row>
          </view>
		  <view class="item" v-else>
			  已移除的房号可重新激活，但无法修改房号。
		  </view>
        </view>
      </view>
	  
	  
    </view>
	
	  <view v-if="current==1">
      <u-empty text="没有数据" mode="data" :show="community_list.length === 0" v-if="loadstatus == false"></u-empty>

			  <view class="u-padding-20 u-m-t-10" v-if="community_list.length > 0">
				<view
				  v-for="(item, index) in community_list"
				  :key="index"
				  class="base-panel-box u-m-b-30">
					  <view class="htitle">
						{{item.villagename}}
						<view class="right u-font-xs">【{{item.region_fullname}}】</view>
					  </view>
					  <view class="item">
						  <button type="primary" plain size="mini" @tap="edit_village(item.village_id)">修改</button>
					  </view>
<!-- 					  <view class="item">
						<u-row gutter="0" justify="space-between">
						  <u-col span="5" text-align="right">
							后台管理入口网址：
						  </u-col>
						  <u-col span="7">
							  https://i.yodin.com/htb
						  </u-col>
						</u-row>
						<u-row gutter="0" justify="space-between">
						  <u-col span="5" text-align="right">
							后台管理用户名：
						  </u-col>
						  <u-col span="7">
							  {{item.adminusername}}
						  </u-col>
						</u-row>
						<u-row gutter="0" justify="space-between">
						  <u-col span="5" text-align="right">
							后台管理者密码：
						  </u-col>
						  <u-col span="7">
							  {{item.adminpwd}}
						  </u-col>
						</u-row>
					  </view> -->
				</view>
				</view>

		<view class=" u-text-center u-padding-20 u-p-b-55">
			<u-button type="primary"  @click="$tools.routerTo('/pages/exbusiness/create/protocol','')">创建新小区</u-button>
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
	  list: [{
			name: '我的房子'
		}, {
			name: '管理小区'
		}],
		current: 0,
		community_list:[]
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad() {
    this.hasLogin = this.$store.getters.loginFlag;
    this.my_houseroom();
  },

  methods: {
	change(index) {
	  	this.current = index;
		console.log(this.current)
		if (this.current==1){
			this.communitylist()
		}
	},
    my_houseroom() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("shelf.userroomlist", {
			status:999,
			find_users_id:this.user.userInfo.users_id
		}).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.flow_list = res.data.roomlist;
            }
            this.loadstatus = false;
          }).catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },
	communitylist(){
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("village.list", {
			p:1,
			limit:20,
			create_uid:this.user.userInfo.users_id
		}).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.community_list = res.data.list;
            }
            this.loadstatus = false;
          }).catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
	},
	edit_village(id){
		this.$tools.routerTo("/pages/exbusiness/create/addcompany",{vallage_id: id},'');
	}
  },
};
</script>
<style lang="scss" scoped>

	.base-panel-box{
		&.disabled{
			 .htitle,.item{
				 color:#dddddd;
			 }
		}
	}


</style>
