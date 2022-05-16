<template>
	<view>

		<view class="shadow margin radius">

			<form>
				<view class="cu-form-group">
					<view class="title">{{ $t('assets.exchangetypeto') }}</view>
					<input :placeholder="$t('usercenter.pls_select')+$t('assets.exchangetypeto')" v-model="convert_form_name" placeholder-style="color: rgba(255,255,255,0.8);" @click="showSinglePicker" />
					<mpvue-picker ref="mpvuePicker_form" @onConfirm="onConfirm" :pickerValueArray="pickerValueform"></mpvue-picker>
				</view>
				<view class="cu-form-group">
					<view class="title">{{ $t('assets.quantityavailable') }}</view>
					<input placeholder="" v-model="balanceAvailable" :disabled="true"></input>
					<text></text>
				</view>
				<view class="cu-form-group">
					<view class="title">{{ $t('assets.exchangenum') }}</view>
					<input :placeholder="$t('usercenter.pls_required')+$t('assets.exchangenum')" v-model="swapnum"></input>
				</view>
				
				<view class="text-center margin">
					<text>{{ $t('assets.exchangerate') }}：{{rate}}</text>
				</view>

				<view class="cu-form-group">
					<view class="title">{{ $t('assets.exchangetypefrom') }}</view>
					<input :placeholder="$t('usercenter.pls_select')+$t('assets.exchangetypefrom')" v-model="convert_to_name" placeholder-style="color: rgba(255,255,255,0.8);" @click="showSinglePicker2" />
					<mpvue-picker ref="mpvuePicker_to" @onConfirm="onConfirm2" :pickerValueArray="pickerValueto"></mpvue-picker>
				</view>
				
				<view class="flex flex-direction">
					<button class="cu-btn bg-blue margin-tb-sm lg" @tap="dosubmit">{{ $t('confirm') }}</button>
				</view>
			</form>
		</view>




	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {

		data() {
			return {
				coininfo: {},
				convert_form_name:'',
				convert_to_name:'',
				balanceAvailable:'',
				convert_form_coinid:'',
				convert_to_coinid:'',
				form_index:0,
				to_index:0,
				swaplist:[],
				swapintent: [],
				pickerValueform: [],
				pickerValueto: [],
				swapnum:'',
				rate:'',

			}
		},
		async onLoad(options) {
			
		uni.setNavigationBarTitle({
		    title:this.$i18n.messages[this.$i18n.locale].assets.exchange 
		});	
			
			const userinfo = uni.getStorageSync('userInfo');
			if (userinfo && userinfo.token) {
				this.login(userinfo);
				this.$store.dispatch('resetuserinfo');
			}
			this.coininfo=this.userInfo.balance[this.coinid];

				this.app.get({
					url: this.serverAddress + '/index.php?m=vueapi&c=wallet&a=swap',
					method: 'GET',
					data: {
						uid: this.userInfo.users_id,
						token: this.userInfo.token
					},
					success: res => {
						this.swaplist=res.swaplist;
						this.convert_form_name=res.swaplist[0]['name'];
						this.convert_form_coinid=res.swaplist[0]['coinid'];
						this.balanceAvailable=res.swaplist[0]['balance_available']+' '+res.swaplist[0]['unit'];
						this.swapintent=res.swapintent;
						this.convert_to_name=res.swapintent[0]['name'];
						this.convert_to_coinid=res.swapintent[0]['coinid'];
						
						this.calcrate(res.swaplist[0],res.swapintent[0]);
					},
					errmsg: res =>{}
				});


			

		},
		computed: {
			...mapState(['serverAddress', 'userInfo'])
		},
		methods: {
			...mapMutations(['login']),
			showSinglePicker() {
                uni.hideKeyboard()
				let swapList = this.swaplist;
				let picker = Object.keys(swapList).map(item => {
						return {
							value: swapList[item].coinid,
							label: swapList[item].name
						}
				});
				picker=picker.filter(item=>{
				     //if (this.convert_to_coinid!=item.value){
						 return item;
					 //}
				})
				this.pickerValueform=picker;
				this.$refs.mpvuePicker_form.show();

			},
			onConfirm(e) {
				uni.hideKeyboard();
				this.convert_form_name = e.label;
				this.convert_form_coinid = e.value[0];
				this.form_index=e.index[0];
				this.balanceAvailable=this.swaplist[e.index[0]]['balance_available']+' '+this.swaplist[e.index[0]]['unit'];
				this.calcrate(this.swaplist[this.form_index],this.swapintent[this.to_index]);

			},
			calcrate(swaplist,swapintent){
				let swapprice=swaplist['usd_unitprice']/swapintent['usd_unitprice'];
				this.rate='1 '+swaplist['unit']+' = '+swapprice+' '+swapintent['unit'];
			},
			showSinglePicker2() {
                uni.hideKeyboard()
				let swapintent = this.swapintent;
				let picker2 = Object.keys(swapintent).map(item => {
						return {
							value: swapintent[item].coinid,
							label: swapintent[item].name
						}
				});
				picker2=picker2.filter(item=>{
				     //if (this.convert_form_coinid!=item.value){
						 return item;
					 //}
				})
				this.pickerValueto=picker2;
				this.$refs.mpvuePicker_to.show();





			},
			onConfirm2(e) {
				uni.hideKeyboard();
				this.convert_to_name = e.label;
				this.convert_to_coinid = e.value[0];
				this.to_index=e.index[0];
				this.calcrate(this.swaplist[this.form_index],this.swapintent[this.to_index]);

				
			},
			
			dosubmit() {
				var that = this;
				if (this.swapnum == '') {
					this.$api.msg("Quantity cannot be empty");
					return false;
				}
				uni.hideKeyboard();

				this.app.get({
					url: this.serverAddress + '/index.php?m=vueapi&c=wallet&a=swap2',
					method: 'GET',
					data: {
						uid: this.userInfo.users_id,
						token: this.userInfo.token,
						swapform:this.convert_form_coinid,
						swapto:this.convert_to_coinid,
						swapnum:this.swapnum
					},
					success: res => {
						this.swapnum='';
						this.$api.msg(res.msg);
					},
					errmsg: res =>{}
				});

			}

		}
	}
</script>
<style lang="scss">

</style>
