<template>
	<view>
		
		<view>
				<view class="cu-form-group">
					<view class="title">{{ $t('assets.wallettype') }}</view>
					<input :placeholder="$t('usercenter.pls_select')+$t('assets.wallettype')" v-model="coinname" placeholder-style="color: rgba(255,255,255,0.8);" @click="showSinglePicker" />
					<mpvue-picker ref="mpvuePicker" @onConfirm="onConfirm" :pickerValueArray="pickerValueArray"></mpvue-picker>
				</view>
				<view class="image padding">
					<center><image :src="serverAddress+shouinfo.qrcCode" mode="widthFix"></image></center>
				</view>
				<view class="cu-list padding">
					<view>{{ $t('assets.tips_charge') }}</view>
					<view class="cu-item">{{ $t('assets.assetstype') }}:{{shouinfo.name}}</view>
					<view class="cu-item">
						<view class="content flex-sub">
							<view class="text-grey">{{ $t('assets.walletaddress') }}：{{shouinfo.wallet}}</view>
						</view>
					</view>
				</view>
		</view>
		
		
	</view>
</template>

<script>
  import {mapState,mapMutations} from 'vuex';


  export default {

    data() {
      return {
		  shouinfo:{},
		  coinid:2,
		  coinname:'',
		  pickerValueArray: [],
      }
    },
    async onLoad(options){
		
		uni.setNavigationBarTitle({
		    title:this.$i18n.messages[this.$i18n.locale].assets.charge 
		});	
		
		const userinfo = uni.getStorageSync('userInfo');
	    if (userinfo && userinfo.token) {this.login(userinfo);this.$store.dispatch('resetuserinfo');}
		
		this.shouinfo=this.userInfo.balance[this.coinid];
		console.log(this.shouinfo)
    },
    computed: {
      ...mapState(['serverAddress','userInfo'])
    },
    methods: {
      ...mapMutations(['login']),
			showSinglePicker() {
				uni.hideKeyboard()
				let balance = this.userInfo.balance;
				let picker = Object.keys(balance).map(item => {
					return {
						value: balance[item].coinid,
						label: balance[item].name
					}
				});
				picker=picker.filter(item=>{
				    if (item.value!=1) return item;
				})
				this.pickerValueArray=picker;

				console.log('lllll', this.pickerValueArray)
				this.$refs.mpvuePicker.show()
			},
			onConfirm(e) {
				uni.hideKeyboard();
				this.coinname = e.label;
				this.coinid = e.value[0];
				this.shouinfo = this.userInfo.balance[this.coinid];
			},
	}
  }
</script>
<style lang="scss">
	
</style>
