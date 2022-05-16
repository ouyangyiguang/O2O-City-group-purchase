<template>
  <view class="page-wrap">
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus" :text="loadstxt"/>
		<view class="page-header">
			<view class="page-title">上传有效证明文件</view>
			<view class="page-desc">上传后请等待管理员审核</view>
		</view>
	<u-gap height="20" bg-color="#f8f8f8"></u-gap>
	<view class="u-padding-40">
		<u-form-item class="form-item" label="证件文件上传" label-position="top" label-width="200" :borderBottom="false">
			<u-row gutter="0" justify="space-between">
			  <u-col span="5" text-align="left">
					<u-upload 
					:action="fileuploadaction"
					ref="uUpload"
					:auto-upload="true"
					:max-size="8 * 1024 * 1024"
					:header="upheaderdata"
					max-count="1"
					:show-upload-list="showUploadList">
					</u-upload>
			  </u-col>
			  <u-col span="7">
				<view class="u-p-t-30"><image
				  :src="verify_img"
				  mode="aspectFit"
				  style="height: 200rpx; width: 300rpx"
				  v-if="verify_img"
				></image></view>
			  </u-col>
			</u-row>
		</u-form-item>


	</view>
		<view class="fixedbottom u-text-center u-padding-20">
			<u-button type="primary" @click="submit">确认</u-button>
		</view>
    </view>
  </view>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import { API_URL } from "@/env";
export default {
  data() {
    return {
      flow_list: [],
      hasLogin: false,
      loadStatus: "loadmore",
      loadstatus: false,
      loadstxt: "loading...",
	  package_id:'',
	  verify_img:'',
      fileuploadaction: API_URL + "index/Tools/uploadbase64files",
      upheaderdata: {
        ExmanageToken: "",
        Bid: "",
      },
	  showUploadList: true, 
	  upfileslists: [],
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad(option) {
    let query = JSON.parse(decodeURIComponent(option.query));
    this.upheaderdata.MemberToken = this.user.tokenInfo;
    this.upheaderdata.Bid = this.user.bid;
	this.package_id=query.id
	this.verify_img=query.img
	console.log(query)
  },

  methods: {

		submit(){
			let files = [];
			files = this.$refs.uUpload.lists.filter(val => {
				return val.progress == 100;
			})
			if (files.length > 0){
				for(var i = 0;i<files.length;i++){
					this.upfileslists.push(files[i].response.data);
				}
				
                    this.$api('shelf.operateroom', {
						verify_img:this.upfileslists[0],
						package_id:this.package_id,
					}).then(res => {
						if (res.code==200){
							this.verify_img=res.data.verify_img;
							this.$tools.msg('提交成功')
						}
                    }).catch((e)=>{});
			}

			
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
