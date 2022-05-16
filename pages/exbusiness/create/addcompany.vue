<template>
  <account-page :title="title" :desc="desc">
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
	<!-- <u-navbar :is-back="true" title="添加公司"  :immersive="true"></u-navbar> -->
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus" :text="loadstxt"/>

    <view class="u-padding-20" v-if="!hasLogin">
      <u-empty text="请先登陆" mode="permission"></u-empty>
    </view>
	<u-gap height="16" bg-color="#f3f4f6"></u-gap>
    <view class="u-padding-35">
      <u-form ref="uForm" :errorType="form.errorType">
        <u-form-item class="form-item" label="小区名字" prop="realname" :label-position="form.labelPosition">
          <u-input v-model="businessname" placeholder="填写小区名字" type="text"/>
        </u-form-item>
      </u-form>


	  
      <u-form ref="uForm" :errorType="form.errorType">
        <u-form-item class="form-item" label="所在区域" prop="realname" :label-position="form.labelPosition">
          <input disabled type="text" :value="region" placeholder-class="line" placeholder="选择小区所在位置"  @tap="showRegionPicker"/>
        </u-form-item>
      </u-form>

      <u-form ref="uForm" :errorType="form.errorType">
        <u-form-item class="form-item" label="详细地址" prop="realname" :label-position="form.labelPosition">
          <u-input v-model="address" placeholder="详细地址信息" type="text"/>
        </u-form-item>
      </u-form>
	  
      <u-form ref="uForm" :errorType="form.errorType">
        <u-form-item class="form-item" label="联系人电话" prop="realname" :label-position="form.labelPosition">
          <u-input v-model="contactphone" placeholder="业务联系人电话" type="text"/>
        </u-form-item>
      </u-form>
<!--      <view class="u-m-t-30 u-m-b-30">
	  <view>LOGO <text class="float_right u-font-xs u-type-info-disabled">请上传透明背景的照片</text></view>
        <u-row gutter="0" justify="space-between">
          <u-col span="4" text-align="left">
            <u-upload
              :max-size="8 * 1024 * 1024"
              max-count="1"
              :action="fileuploadaction"
              ref="uUpload"
              :auto-upload="true"
              :header="upheaderdata"
            ></u-upload>
          </u-col>
          <u-col span="8" align="left">
			 
            <image
              :src="idCard1"
              mode="aspectFill"
              style="height: 220rpx; width: 300rpx"
            ></image>
          </u-col>
        </u-row>
      </view> -->

      <u-button type="primary" @click="submit">添加</u-button>
	  <u-picker mode="region" ref="uPicker" v-model="show"  :defaultRegion="defaultRegion" @confirm="confirm" /></u-picker>
    </view>
	
  </account-page>
</template>


<script>
import { API_URL } from "@/env";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
	  title: "添加小区",
      desc: "添加小区名称",
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      loadstxt: "loading...",
      form: {
        errorType: ["message"],
        labelPosition: "top",
      },
      idCard1: "../../../../static/image/idcard1.png",
      fileuploadaction: API_URL + "tools/uploadbase64files",
      upheaderdata: {
        MemberToken: "",
      },
	  businessname:'',
	  contactphone:'',
	  address:'',
			region:'',
			area_name:'',
			defaultRegion: ['广东省', '深圳市', '宝安区'],
			show: false,
			
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad() {
    this.hasLogin = this.$store.getters.loginFlag;
	this.upheaderdata.MemberToken = this.user.tokenInfo;
	if (this.user.location.locale==1){
		this.region=this.user.location.province+'-'+this.user.location.city+'-'+this.user.location.township;
		this.defaultRegion=this.region.split('-');
	}
  },

  methods: {
  //返回按钮事件
  onBackPress(e) {
    this.$Router.push({
      path: "/pages/my/my",
      params: {},
    });
    return true;
  },
		showRegionPicker(e) {
			this.show = true;	
		},
		confirm(e) {
			this.region = e.province.label + '-' + e.city.label + '-' + e.area.label;
			this.area_name=e.area.label;
			console.log(this.region)
		},
    submit() {

      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("exbusiness.add", {
			businessname:this.businessname,
			area_name:this.area_name,
			region:this.region,
			address:this.address,
			contactphone:this.contactphone
			
		}).then((res) => {
			console.log(res)
            if (res.code == 200) {
				
				this.$tools.routerTo("/pages/my/success",
				  {title: "创建成功",
				   msg: '请您登陆电脑版后台，完成小区的基本设置（『邻里管家』中的"管理小区"中可查看用户名和密码）'},
				'');
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
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>
<style lang="scss" scoped>
</style>
