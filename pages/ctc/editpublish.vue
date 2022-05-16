<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="u-text-center piaofu"><u-loading :show="loadstatus"></u-loading></view>

		<view class="u-padding-20">
			
		<u-form class="u-m-b-20 numinput">
				<u-form-item class="form-item" label="地址" label-position="left" label-width="80">
					  <view v-if="address_is_empty === true" class="empty">
						<navigator url="/pages/order/address/index?source=1">
								<view v-if="user.wareRoom.addr_id==''||user.wareRoom.addr_id==null">选择地址</view>
								<view v-else>
									{{user.wareRoom.businessname}}
								</view>
						</navigator>
					  </view>
					  <view v-else>
						<navigator url="/pages/order/address/index?source=1" >{{ addressData.address }}</navigator>
					  </view>
				</u-form-item>

<!-- 			<u-form-item class="form-item" label="说明" label-position="left" label-width="80">
				<u-input placeholder="这里填写您的详细要求" type="textarea" v-model="content"/>
			</u-form-item> -->
			<u-form-item class="form-item" label="简介" label-position="left" label-width="80">
				<editor id="editor" class="editor-container" placeholder="请输入内容" @input="getEditorContent" @ready="onEditorReady"></editor>
			</u-form-item>
			<u-form-item class="form-item" label="照片" label-position="left" label-width="80" :borderBottom="false">
				<u-row gutter="0" justify="space-between">
				  <u-col span="12" text-align="left">
						<u-upload 
						:action="fileuploadaction"
						ref="uUpload"
						:auto-upload="true"
						:max-size="8 * 1024 * 1024"
						:header="upheaderdata"
						:form-data="formdata"
						max-count="5"
						width="130"
						height="130"
						:show-upload-list="showUploadList">
						</u-upload>
				  </u-col>
				</u-row>
			</u-form-item>
			
		<view class="pre-box">
			<view class="pre-item" v-for="(item, index) in list_img" :key="index">
				<image class="pre-item-image" :src="item.pic" mode="aspectFill"></image>
				<u-icon name="close" size="36" color="#ffffff" @click="del_pic(item)"></u-icon>
			</view>
		</view>
			

		</u-form>

			<view class="u-m-t-50">
				<u-button type="primary" @click="editorder()">修改</u-button>
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
      fileuploadaction: API_URL + "index/Tools/uploadbase64files",
      upheaderdata: {
        ExmanageToken: "",
        Bid: "",
      },
	  formdata:{
		  table:''
	  },
	  showUploadList: true, 
	  upfileslists: [],
	  list_img:[],
      flow_list: [],
      hasLogin: false,
      loadstatus: false,
      loadstxt: "loading...",
      address_is_empty: true,
      addressData: [],
	  sendname:'',
	  addr_id:'',
	  content:'',
	  adid:''
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    //显示空白页
    addressData(e) {
      let empty = e == undefined || e.length <= 0 ? true : false;
      if (this.address_is_empty !== empty) {
        this.address_is_empty = empty;
      }
	  if (empty == false){
		  if (e.addr_id==null){
			  this.addr_id=this.user.wareRoom.addr_id
		  }else{
			  this.addr_id=e.addr_id
		  }
	  }
    },
  },
  onLoad(options) {
	let query = JSON.parse(decodeURIComponent(options.query));
    this.adid = query.adid;
	this.addr_id=this.user.wareRoom.addr_id;
    this.upheaderdata.MemberToken = this.user.tokenInfo;
    this.upheaderdata.Bid = this.user.bid;
	this.formdata.table='ctcad';
    this.hasLogin = this.$store.getters.loginFlag;
	this.info(this.adid);
  },

  methods: {
	  ...mapMutations(['setBidPopupShow','setroomPopupShow']),

            onEditorReady() {/////////////////////////初始化
                uni.createSelectorQuery().select('#editor').context((res) => {
                    var contentVal_1 = this.content;
                    //将内容写入编辑器
                    this.editorCtx = res.context;
                    let EContent = {
                        html: contentVal_1
                    }
                    this.editorCtx.setContents(EContent); //设置富文本编辑器的内容
                }).exec()
            },
            getEditorContent(e) {/////////////////////////获取编辑器内容，当前页面都能获取到
                this.content = e.detail.html;
            },
			
	info(adid){
		this.$api("ctc.adinfo", {adid: adid,}).then((res) => {
							if (res.code==200){
								this.content=res.data.content
								this.onEditorReady()
								  if (res.data.addr_id==0){
								  }else{
									  this.addr_id=res.data.addr_id
								  }
								  this.list_img=res.data.img
							}
						}).catch((e) => {});
	},
	del_pic(item){
		this.$api("delpic", {
			id: item.id
		}).then((res) => {
			if (res.code==200){
					this.info(this.adid);
				}else{
					this.$u.toast(res.msg);
			}}).catch((e) => {});
	},
    editorder() {

	  if (this.addr_id==''&&this.addr_id==0){
		  this.$u.toast("必须选择地址");return;
	  }

      return new Promise((resolve, reject) => {
			this.upfileslists=[];
			let files = [];
			files = this.$refs.uUpload.lists.filter(val => {
				return val.progress == 100;
			})
			if (files.length > 0){
				for(var i = 0;i<files.length;i++){
					this.upfileslists.push(files[i].response.data);
				}
			}
			//console.log(this.upfileslists);return;

        this.loadstatus = true;
        this.$api("ctc.editinfo", {
		  addr_id:this.addr_id,
		  adid:this.adid,
		  img:this.upfileslists,
		  content:this.content
        }).then((res) => {
            console.log(res);
            if (res.code == 200) {
				this.$Router.push({
					path: "/pages/ctc/mypublish",
					query: {},
				});
            } else {
              this.$u.toast(res.msg);
            }
          }).catch((e) => {});
      });
    },

  },
};
</script>
<style lang="scss" scoped>
	.pre-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.pre-item {
		flex: 0 0 23%;
		border-radius: 10rpx;
		height: 140rpx;
		overflow: hidden;
		position: relative;
		margin-bottom: 20rpx;
		position: relative;
		.u-icon{
			position: absolute;
			top:10rpx;
			right:10rpx;
		}
	}

	.pre-item-image {
		width: 100%;
		height: 140rpx;
	}
    #editor {
        width: 100%;
		line-height: 130%;
        background-color: #EEEEEE;
		padding: 10rpx;
		border-radius: 10rpx;
		overflow: hidden;
    }
</style>
