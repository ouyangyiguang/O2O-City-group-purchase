<template>
  <view class="page-wrap">
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading isFullScreen :active="loadstatus"/>

		<view class="page-header">
			<view class="page-title">房间管理</view>
			<view class="page-desc">修改所在小区房号</view>
		</view>
<u-gap height="16" bg-color="#f3f4f6"></u-gap>

    <view class="u-padding-20">

			<u-form class="u-m-b-20 numinput">

				<u-form-item class="form-item" label="所在地区" label-position="left" label-width="160">
					{{input}}
				</u-form-item>
				<u-form-item class="form-item" label="小区名" label-position="left" label-width="160">
					{{addressData.villagename}}
				</u-form-item>
				<u-form-item class="form-item" label="所在栋/期" label-position="left" label-width="160">
					<u-input v-model="addressData.building" placeholder="栋/期等"/>
				</u-form-item>
				<u-form-item class="form-item" label="房号" label-position="left" label-width="160">
					<u-input v-model="addressData.roomnumber" placeholder="街道、楼牌等"/>
				</u-form-item>

			</u-form>
		<u-gap height="30"></u-gap>
		<u-button type="primary" @click="submitedit">确认</u-button>

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
      loadstatus: false,
	  show: false,
			input:'',
			defaultRegion: ['广东省', '深圳市', '宝安区'],
			addressData:{
				province_name:'',
				city_name:'',
				area_name:'',
				is_default:false,
				consignee:'',
				mobile:'',
				address:'',
				addr_id:''
			}
	  
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad(option) {
    let query = JSON.parse(decodeURIComponent(option.query));
			this.addressData=query.item;
			this.input=this.addressData.province_name+'-'+this.addressData.city_name+'-'+this.addressData.area_name;
			//this.defaultRegion=this.input.split('-');
	//this.alluserroom()
  },

  methods: {

		submitedit(){
			this.$api('order.address_add', {
				province_name:this.addressData.province_name,
				city_name:this.addressData.city_name,
				area_name:this.addressData.area_name,
				building:this.addressData.building,
				roomnumber:this.addressData.roomnumber,
				addr_id:this.addressData.addr_id
			}).then(res => {
				if (res.code==200){
							this.$tools.msg('修改成功');
							setTimeout(() => {
								uni.navigateBack(1);
							}, 400);
				}
			}).catch((e)=>{
			});
		},
	tiren(id){
        this.$api("shelf.tichu", {
			package_id:id
		}).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.alluserroom()
            }else{
				this.$tools.msg(res.msg)
			}
          }).catch((e) => {});
	},
    alluserroom() {
      return new Promise((resolve, reject) => {
        this.loadstatus = true;
        this.$api("shelf.roomalluser", {
			positionmarker:this.positionmarker
		}).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.flow_list = res.data;
            }
            this.loadstatus = false;
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

	.base-panel-box{
		&.disabled{
			 .htitle,.item{
				 color:#dddddd;
			 }
		}
	}


</style>
