<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<init-pages></init-pages>
		<u-navbar :is-back="true" title="发布" :background="background" :border-bottom="false" :custom-back="back">
			<!-- <view class="slot-wrap">aaaa</view> -->
		</u-navbar>
		<!--isFullScreen 可以实其全屏显示-->
		<!-- <ourLoading isFullScreen :active="loadstatus" :text="loadstxt"/> -->
		<view class="u-text-center piaofu"><u-loading :show="loadstatus"></u-loading></view>
		<view class="topfixbar">
		</view>
		<view class="mybasebox">
				<u-tabs class="tabscoinstyle" name="category_name" :list="category" :is-scroll="true" :current="currentCatetab" @change="changeCateTab" 
				 bg-color="#ffffff"
				 inactive-color	="#000000"
				 font-size="30"
				 :bold="false"
				 height="60"
				 active-color="#52D3FF"></u-tabs>

		<view class="u-p-l-20 u-p-r-20">
			
		<u-form class="u-m-b-20 numinput">
				<u-form-item class="form-item" label="地址" label-position="left" label-width="80">
					  <view v-if="address_is_empty === true" class="empty">
						<navigator url="/pages/order/address/index?source=1">
								<view v-if="user.wareRoom.businessname==''||user.wareRoom.businessname==null">选择地址</view>
								<view v-else>
									{{user.wareRoom.businessname}}
								</view>
						</navigator>
					  </view>
					  <view v-else>
						<navigator url="/pages/order/address/index?source=1" >{{ addressData.address }} </navigator>
					  </view>
				</u-form-item>
			<u-form-item class="form-item" label="类型" label-position="left" label-width="80">
				<view v-if="id>0">
					<u-input :value="category_name" :disabled="true"></u-input>
				</view>
				<view v-else>
				  <u-radio-group v-model="currentSelectCate" :wrap="true">
					<u-radio @change="radioChange" v-for="(item, index) in cate_item" :key="index" :name="index">
						{{item.category_name}}
					</u-radio>
				  </u-radio-group>
				</view>
				  
			</u-form-item>
			<u-form-item class="form-item" label="价格" label-position="left" label-width="80">
				<u-input placeholder="可选填" type="text" v-model="price"/>
			</u-form-item>
<!-- 			<u-form-item class="form-item" label="简介" label-position="left" label-width="80">
				<u-input placeholder="这里填写您的详细要求" type="textarea" v-model="content"/>
			</u-form-item> -->
			<u-form-item class="form-item" label="简介" label-position="left" label-width="80">
				<editor id="editor" class="editor-container" placeholder="请输入内容" @input="getEditorContent" @ready="onEditorReady"></editor>
			</u-form-item>
			<u-form-item class="form-item" label="图片" label-position="left" label-width="80" :borderBottom="false">
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

			<view class="u-m-t-20">
				<u-button type="primary" @click="submit_1()">{{submit_txt}}</u-button>
			</view>
			<u-gap height="100" ></u-gap>
		</view>
		</view>

	

	</view>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import initPages  from "@/components/init-pages.vue"
import { API_URL } from "@/env";
// #ifdef MP-WEIXIN
import { setPay, setPayAssign } from "@/plugins/wxutils";
import { MAPKEY } from "@/env";
import qqmapsdk from "@/plugins/qqmap-wx-jssdk.min.js"
// #endif
export default {
	components:{
		initPages
	},
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
	  id:'',
	  showUploadList: true, 
	  upfileslists: [],
	  verify_img:'',
      category: [],
	  cate_item:[],
	  category_name:'',
      hasLogin: false,
      loadstatus: false,
	  background: {backgroundColor: '#63E5CB'},
      currentCatetab: 0,
      address_is_empty: true,
      addressData: [],
	  sendname:'',
	  addr_id:'',
	  content:'',
	  price:'',
	  currentSelectCate:'aaa',
	  SelectCateid:'',
	  content_id:'',
	  submit_txt:'发布新信息',
	  list_img:[],

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
  async onLoad(options) {
	if (options.query!==undefined){
		let query = JSON.parse(decodeURIComponent(options.query));
		this.id = query.id;
		if (this.id>0){
			this.get_info(this.id)
		}
	}


	this.addr_id=this.user.wareRoom.addr_id;
    this.upheaderdata.MemberToken = this.user.tokenInfo;
    this.upheaderdata.Bid = this.user.bid;
	this.formdata.table='info';
    this.hasLogin = this.$store.getters.loginFlag;
	
	let update_time=this.user.siteInfo.update_time*1000
	this.cate_one=[];
	if (update_time==0||(Date.now()-update_time>100000)){
		let siteinfo=await this.$store.dispatch("getsiteInfo");
		if (siteinfo){
			this.category = this.user.siteInfo.info_cate;
			this.cate_item=this.category[0]['_child'];
		}
	}else{
			this.category = this.user.siteInfo.info_cate;
			this.cate_item=this.category[0]['_child'];
	}
	
		if (this.user.wareRoom.businessname==''){
			//this.setroomPopupShow(true);
			this.reset_village()
			this.setBidPopupShow(true);return;
		}
	

  },

  methods: {
	  ...mapMutations(['setBidPopupShow','setroomPopupShow']),
	  back(){
		  uni.navigateBack({
		  	
		  })
	  },
		reset_village(){
			this.$api("village.list", {}).then((res) => {
				if (res.code == 200) {
					uni.$emit("changeDorm",res.data.list)
					this.setBidPopupShow(true);
				}
			}).catch((e) => {});
		},

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
	radioChange(e) {
		this.SelectCateid=this.category[this.currentCatetab]._child[e].category_id;
		this.get_only(this.SelectCateid)
	},

    changeCateTab(e) {
	  this.currentSelectCate='aaa'
	  this.SelectCateid=''
      this.currentCatetab = e;
	  this.cate_item=this.category[this.currentCatetab]._child;
	  //this.SelectCateid=this.category[this.currentCatetab]._child[this.currentSelectCate].category_id;
    },

    submit_1() {

		if(this.user.bid == ''){
			//this.setBidPopupShow(true);return;
		}
		if (this.user.wareRoom.positionmarker==''){
			this.setBidPopupShow(true);return;
			//this.setroomPopupShow(true);return;
		}
	  if (this.SelectCateid==''){
		  this.$u.toast("请先选择类别");return;
	  }
	  if (this.user.location.locale==0){
		  //this.$u.toast("请先打开地理位置");
		  //return;
	  }

		console.log(this.content)
	  this.upfileslists=[];

	  if (this.addr_id==''&&this.addr_id==0){
		  this.$u.toast("必须选择地址");return;
	  }
	  // console.log(this.sendname)
	  // console.log(this.addr_id)
	  // return;

      return new Promise((resolve, reject) => {
		  
			let files = [];
			files = this.$refs.uUpload.lists.filter(val => {
				return val.progress == 100;
			})
			if (files.length > 0){
				for(var i = 0;i<files.length;i++){
					this.upfileslists.push(files[i].response.data);
				}
			}

        this.loadstatus = true;
        this.$api("info.add", {
		  addr_id:this.addr_id,
		  location:this.user.location,
		  img:this.upfileslists,
		  content:this.content,
		  category_id:this.SelectCateid,
		  content_id:this.content_id,
		  price:this.price
        }).then((res) => {
			if (res.code==400){
					let item={
						
					};
					this.$store.commit("setwareRoom",item);
					uni.setStorageSync('wareRoom','');
			}
            if (res.code == 200) {
					  this.$Router.push({
					    path: "/pages/info/index",
					    query: {},
					  });
            } else {
              this.$u.toast(res.msg);
            }
            this.loadstatus = false;
          }).catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },
		get_info(id){
			this.$api("info.info", {
				content_id:id
			}).then((res) => {

			    if (res.code == 200) {
					 if (res.data.content_id>0){
						 
						 this.content_id=res.data.content_id
						 this.content=res.data.content
						 this.onEditorReady()
						 this.SelectCateid=res.data.category_id
						 this.price=res.data.price
						 this.addr_id=res.data.addr_id
						 //this.sendname=res.data.sendname
						 this.category_name=res.data.category_name
						 if (res.data.is_hide==1){
							this.submit_txt="该条目已对你禁用"
						 }else{
							this.submit_txt="刷新信息"
						 }
						 this.list_img=res.data.img
						 
					 }
			    }
			  }).catch((e) => {});
		},
	del_pic(item){
		this.$api("delpic", {
			id: item.id
		}).then((res) => {
			if (res.code==200){
					this.get_only(this.SelectCateid)
				}else{
					this.$u.toast(res.msg);
			}}).catch((e) => {});
	},
		get_only(cate_id){
			this.$api("info.get_only", {
				category_id:cate_id
			}).then((res) => {

			    if (res.code == 200) {
					 if (res.data.content_id>0&&res.data.category.isonlyone==1){
						 this.content_id=res.data.content_id
						 this.content=res.data.content
						 this.price=res.data.price
							this.onEditorReady()
						 this.list_img=res.data.img
						 if (res.data.is_hide==1){
							this.submit_txt="该条目已对你禁用"
						 }else{
							this.submit_txt="刷新信息"
						  uni.showModal({
							title: "温馨提示",
							content: "为减少垃圾信息的产生，本类目仅可发布一条信息，请您在原信息编辑更新",
							success: (res) => {
							  if (res.confirm) {}
							},
						  });
						 }

						 
					 }else{
						 this.content_id=""
						 this.content=""
						 this.price=""
						 this.list_img=[]
						 this.submit_txt="发布新信息"
					 }
			    }
			  }).catch((e) => {});
		}
  },
};
</script>
<style lang="scss" scoped>

.topfixbar {
	background: $u-type-primary;
	color:#FFFFFF;
	height: 20rpx;
	line-height: 100rpx;
	width: 100%;
	z-index: 1;
}
.tabscoinstyle {
	padding:0rpx;
	width: 96%;
	margin: auto;
}

	.active{
		background: #007AFF;
	}
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
