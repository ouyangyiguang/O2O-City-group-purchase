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
			<u-gap height="10"></u-gap>
			<u-row gutter="0" justify="space-between">
				<u-col span="4" >
					<u-tabs name="cate_name" :list="cateList" :is-scroll="false" :current="currentTab" @change="changeBigTab"
					 bg-color="#63E5CB"
					 inactive-color	="#ecf5ff"
					 :active-item-style="tabsstyle"
					 :show-bar="false"
					 active-color="#ffffff"></u-tabs>
				</u-col>
				<u-col span="4" text-align="right">
					<view class="u-text-right"><text style="color: #63E5CB;">.</text></view>
				</u-col>
				<u-col span="4"  @click="$tools.routerTo('/pages/ctc/mypublish')" text-align="right">
					<view class="u-p-r-30">
						<u-icon name="Rectangle" custom-prefix="customicon" size="30"></u-icon>我的发布
					</view>
				</u-col>
			</u-row>
		</view>
		<view class="mybasebox">
				<u-tabs class="tabscoinstyle" name="cate_name" :list="needsType" :is-scroll="false" :current="currentNeedsTabid" @change="changeNeedsTab" 
				 bg-color="#ffffff"
				 inactive-color	="#000000"
				 font-size="30"
				 :bold="false"
				 height="60"
				 active-color="#52D3FF"></u-tabs>
		
		<u-gap height="2"></u-gap>
		<view class="u-padding-20" v-if="currentTab==0">
			
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
			<u-form-item class="form-item" label="项目" label-position="left" label-width="80">
				  <u-radio-group v-model="currentNeedsItemid" :wrap="true">
					<u-radio @change="radioChange" v-for="(item, index) in needs_item" :key="index" :name="index">
						{{item.name}} <u-tag :text="item.price+' 元/'+item.unit" size="mini" type="success"  shape="circle" class="u-m-l-20" v-if="item.price>0"/>
					</u-radio>
				  </u-radio-group>
			</u-form-item>
				<u-form-item class="form-item" label="介绍" label-position="left" label-width="80" v-if="openwindow==1">
					<view @click="viewnews(selectneeds_param.id)">项目【<text class="u-type-warning-dark">{{selectneeds_param.name}}</text>】介绍说明</view>
				</u-form-item>
			<u-form-item class="form-item" label="说明" label-position="left" label-width="80">
				<u-input placeholder="这里填写您的详细要求" type="textarea" v-model="content"/>
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
		</u-form>

			<view class="u-m-t-50">
				<u-button type="primary" @click="submit_1()">发布需求</u-button>
			</view>
		</view>
		</view>

	
	<u-popup v-model="ineeds_show" mode="bottom">
		<view class="pops">
		<view class="title">
			<u-row gutter="0" justify="space-between">
			  <u-col span="6" text-align="left">
				  <h3>{{needs_title}} </h3>
			  </u-col>
			  <u-col span="6" text-align="right">
				  {{selectneeds_param.name}}
			  </u-col>
			</u-row>
		</view>
	<view class="u-padding-20">
			<u-form class="u-m-b-20 numinput">
				<u-form-item class="form-item" label="时间限制" label-position="left" label-width="160">
					<u-input v-model="timelimit"  type="input"  :focus="false"/>
					<text slot="right" style="font-size: 22rpx;color: #007AFF;">分钟(接单后规定时间内完成)</text>
				</u-form-item>

<!-- 				<u-form-item class="form-item" label="限制" label-position="left" label-width="160">
					<view class="u-p-l-6 u-p-t-12" text-align="right">
						同小区实名认证用户才可接单 <u-switch  size="30"></u-switch>
					</view>
				</u-form-item> -->
			
		<view v-if="selectneeds_param.price>0">
		    <u-form-item class="form-item" label="数量" label-position="left" label-width="160">
			  <u-number-box v-model="nums" @change="valChange" :min="1" :max="max" :disabled-input="true"></u-number-box> {{selectneeds_param.unit}}
			</u-form-item>

		    <u-form-item class="form-item" label="额外打偿" label-position="left" label-width="160">
			  <u-checkbox-group>
				  <u-checkbox @change="prize_change" v-for="(item, index) in prize_list" :key="index" v-model="item.checked" :name="item.amount">{{ item.name }}</u-checkbox>
			  </u-checkbox-group>
			</u-form-item>

		    <u-form-item class="form-item" label="支付费用" label-position="left" label-width="160">
			  <view><h1>{{needs_price}}<text class="u-font-xs">元</text></h1></view>
			</u-form-item>
			
		    <u-form-item class="form-item" label="帐号余额" label-position="left" label-width="160">
			  <u-radio-group  :wrap="true">
				<u-radio @change="coin_change" v-for="(item, index) in coin_list" :key="index" :name="index">{{ item.name }}
				<text   class="u-p-l-20 u-p-r-20" >
				 可用：{{(item.balance_available * 1).toFixed(2)}}{{ item.unit }}</text></u-radio>
			  </u-radio-group>
			</u-form-item>
		</view>	
			
		  
	  </u-form>
	  
			<view class="u-m-t-20">
					<u-row gutter="0" justify="space-between" style="width:100%;">
						<u-col span="5" >
							<u-button type="" @click="ineeds_show = false;">
								取消
							</u-button>
						</u-col>
						<u-col span="2" ><text style="color: #FFFFFF;">.</text></u-col>
						<u-col span="5" text-align="right">
							<u-button type="primary" @click="confirmorder()">确认发布</u-button>
						</u-col>
					</u-row>
			</view>
		</view>
		</view>
	</u-popup>
		<u-popup mode="bottom" v-model="openwiddowpops" :closeable="true" :safe-area-inset-bottom="false">
			<view class="u-padding-20" style="background: #ffffff;">
				<scroll-view scroll-y="true" style="height: 800rpx;">
					<view>
						<rich-text :nodes="openwindowcontent"></rich-text>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import { API_URL } from "@/env";
import initPages  from "@/components/init-pages.vue"
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
	  showUploadList: true, 
	  upfileslists: [],
	  verify_img:'',
      flow_list: [],
      hasLogin: false,
      loadstatus: false,
      loadstxt: "loading...",
	  background: {backgroundColor: '#63E5CB'},
      navbar: {
        background: "#63E5CB",
      },
      cateList: [
        {
          id: 1,
          name: "我有需求",
        }
      ],
      tabsstyle: {
        fontSize: "40rpx",
      },
	  prize_list:[
		  {
			  amount:2,
			  name:'2元'
		  },
		  {
			  amount:5,
			  name:'5元'
		  },
		  {
			  amount:20,
			  name:'20元'
		  },
		  {
			  amount:80,
			  name:'80元'
		  }
	  ],
      currentTab: 0,
      currentNeedsTabid: 0,
      needs_price: "0.01",
      is_price: false,
	  ineeds_show:false,
	  needs_item:[],
	  currentIndex:'',
	  needsType:[],
	  currentNeedsItemid:0,
	  pay_coinclass:[],
	  coin_list:[],
	  nums:1,
	  max:1,
	  price:0,
	  prize:0,
	  selectneeds_param:[],
	  needs_title:'',
	  prizelist:[],
	  openwindow:0,
	  openwindowcontent:'',
	  openwiddowpops:false,
      address_is_empty: true,
      addressData: [],
	  sendname:'',
	  addr_id:'',
	  content:'',
	  timelimit:''
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    //显示空白页
    addressData(e) {
		console.log(e)
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
  async onLoad() {

	this.addr_id=this.user.wareRoom.addr_id;
    this.upheaderdata.MemberToken = this.user.tokenInfo;
    this.upheaderdata.Bid = this.user.bid;
	this.formdata.table='ctcad';
    this.hasLogin = this.$store.getters.loginFlag;

		this.coin_list = this.user.userInfo.coinlist;
		this.select_coininfo = this.coin_list[0];
		this.select_coininfo_id = this.select_coininfo.id;
		
		this.needsType = this.user.siteInfo.needs_cate;
		console.log(this.needsType)
		if (this.needsType[0].id==0){
			this.needsType.splice(0, 1)
		}
		this.needs_item=this.needsType[0].item
		this.needs_title=this.needsType[0].name
		this.selectneeds_param=this.needsType[0].item[0]
		this.timelimit=this.selectneeds_param.timelimit

	
		// #ifdef MP-WEIXIN
		this.getRegeo()
		// #endif
		if (this.user.wareRoom.businessname==''){
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
	  viewnews(newsid){
		this.openwiddowpops=true;
        this.$api("archives.needsitem_view", {
			content_id:newsid
		}).then((res) => {
            if (res.code == 200) {
				this.openwindowcontent=res.data.content
            }
          }).catch((e) => {});
	  },
		reset_village(){
			this.$api("village.list", {}).then((res) => {
				if (res.code == 200) {
					uni.$emit("changeDorm",res.data.list)
					this.setBidPopupShow(true);
				}
			}).catch((e) => {});
		},
		radioChange(e) {
			
			 this.selectneeds_param=this.needsType[this.currentNeedsTabid].item[e];
			 console.log(this.selectneeds_param)
			 //this.currentNeedsItemid=this.selectneeds_param.id
			 this.max=parseInt(this.selectneeds_param.maxnum)
			 this.price=this.selectneeds_param.price
			 this.openwindow=this.selectneeds_param.openwindow
			 this.timelimit=this.selectneeds_param.timelimit
			 this.jfjs()
		},
		prize_change(e){
			  let a=0;
			  for (a;a<this.prizelist.length;a++){
				  if (this.prizelist[a]==e.name){
					  this.prizelist.splice(a, 1)
				  }
			  }
			  if (e.value==false){
				  for (a=0;a<this.prizelist.length;a++){
					  
					  if (this.prizelist[a]==e.name){
						  this.prizelist.splice(a, 1)
					  }
				  }
			  }else{
				  this.prizelist.push(e.name);
			  }
			  // if (this.prizelist.length>=3){
				 //  this.$u.toast("最多选择3个"); return;
			  // }
			  
			this.jfjs()
		},
		jfjs(){
			this.prize=0
				  for (let a=0;a<this.prizelist.length;a++){
					  this.prize=this.prize+this.prizelist[a]
			}
			this.needs_price=(this.price*this.nums+this.prize*this.nums).toFixed(2)
		},
    coin_change(e) {//支付帐户选择，目前仅一项，不需用
      this.select_coininfo = this.coin_list[e];
      this.select_coininfo_id = this.select_coininfo.id;
    },
    changeBigTab(e) { //大类，目前仅一项，不需用
      this.currentNeedsTabid = 0;
      this.currentTab = e;
    },
    changeNeedsTab(e) {
      this.currentNeedsTabid = e;
      this.needs_item=this.needsType[e].item
		this.currentNeedsItemid="0";
		this.selectneeds_param=this.needsType[this.currentNeedsTabid].item[0];
		this.timelimit=this.selectneeds_param.timelimit
		this.openwindow=this.selectneeds_param.openwindow
	  this.needs_title=this.needsType[e].name
    },
	valChange(e) {
		if(e){
		this.nums=e.value
		this.jfjs()
		}

	},
    submit_1() {

		if (this.user.wareRoom.addr_id==''){
			this.$u.toast("地址为空");return;
			//this.setBidPopupShow(true);return;
			//this.setroomPopupShow(true);return;
		}
	  if (this.selectneeds_param.id==''){
		  this.$u.toast("请先选择项目");return;
	  }
	  if (this.user.location.locale==0){
		  //this.$u.toast("请先打开地理位置");
		  //return;
	  }
      this.ineeds_show = true;
	  this.upfileslists=[];
    },
        getRegeo() {
			let _this=this;
				uni.getLocation({
				    type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				    success: function (res) {
						//this.longitude=res.longitude;
						//this.latitude=res.latitude;
						let localedata={
							locale:1,
							lat:res.latitude,
							lng:res.longitude,
							township:''
						}
						_this.$store.commit("setLocation",localedata);
		console.log(MAPKEY)
		const QQMapWX = new qqmapsdk({
		            //填写自己申请的Key
			        key: MAPKEY   
			    });
		// 解析地址
		QQMapWX.reverseGeocoder({
			location: {
				latitude: res.latitude,
				longitude: res.longitude
			},
			success: (res) => {
				//console.log(res)
						let localedata={
							locale:1,
							lat:res.result.location.lat,
							lng:res.result.location.lng,
							country:res.result.address_component.nation,
							province:res.result.address_component.province,
							city:res.result.address_component.city,
							district:res.result.address_component.district,
							township:res.result.address_component.street
						}
						_this.$store.commit("setLocation",localedata);
			},
			fail: function(res) {
				//console.log(res)
				//_this.reserr=res.message
				uni.showToast({
					title: '定位失败',
					duration: 2000,
					icon: "none",
				})
			},
		})
						
						
						
				    }
				})
			
			
        },
    confirmorder() {
      if (this.nums < 0 || this.nums == "") {
        this.$u.toast("请输入数量");
        return;
      }
	  if (this.sendname==''&&this.addr_id==''&&this.addr_id==0){
		  this.$u.toast("必须选择地址");return;
	  }
	  // console.log(this.sendname)
	  // console.log(this.addr_id)
	  // return;
	if (this.timelimit<this.selectneeds_param.timelimit){
		this.$u.toast("时间期限不能少于默认值");return;
	}
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
			//console.log(this.upfileslists);return;

		  
		  
		  
        this.loadstatus = true;
        this.$api("ctc.needsorder", {
          sendname:this.sendname,
		  addr_id:this.addr_id,
		  location:this.user.location,
		  use_coininfo_id: this.select_coininfo_id,//使用支付帐户号
		  needsid:(this.currentNeedsTabid+1),
		  needssid:(this.currentNeedsItemid),
		  needs_num:this.nums,      //数量
		  needs_prize:this.prize,    //额外打偿
		  img:this.upfileslists,
		  content:this.content,
		  timelimit:this.timelimit
        }).then((res) => {
            console.log(res);
            if (res.code == 200) {
				this.ineeds_show=false;
			  if (res.data.needpay==1){
				// #ifdef MP-WEIXIN
					this.onAppWxPay(res.data.paydata)
				// #endif
				// #ifdef H5
					  this.$Router.push({
					    path: "/pages/ctc/mypublish",
					    query: {},
					  });
				//#endif
			  }else{
				  if(res.data.payok=200){
						  this.$Router.push({
							path: "/pages/ctc/mypublish",
							query: {},
						  });
				  }
			  }

			  
            } else {
              this.$u.toast(res.msg);
            }
            this.loadstatus = false;
          })
          .catch((e) => {
            this.loadstatus = false;
            resolve(false);
          });
      });
    },
    onAppWxPay(paydata) {

      setPay({
          type: paydata.onlinepay_type, // APP微信支付=wxpay，APP支付宝支付=alipay，微信小程序支付=smallPay
          price: paydata.price, // 价格，
          title: paydata.title, // 标题
          orderNo: paydata.orderNo, // 订单编号
		  table:paydata.table
        },(res) => {
          // 小程序支付的回调
          if (res.success) {
            uni.showToast({
              title: "支付成功",
              icon: "none",
            });
          } else {
            uni.showToast({
              title: "支付失败，" + res.data,
              icon: "none",
            });
          }
		  this.$Router.push({
			path: "/pages/ctc/mypublish",
			query: {},
		  });
        }
      );
    },

  },
};
</script>
<style lang="scss" scoped>

.topfixbar {
	background: $u-type-primary;
	color:#FFFFFF;
	height: 130rpx;
	line-height: 100rpx;
	width: 100%;
	z-index: 1;
}
.tabscoinstyle {
	padding:0rpx;
	width: 96%;
	margin: auto;
}


.pops {
  background: #ffffff;
  height: 900rpx;
  .title {
    background: $u-type-primary-light;
    padding: 20rpx 30rpx;
  }
}
	.active{
		background: #007AFF;
	}
</style>
