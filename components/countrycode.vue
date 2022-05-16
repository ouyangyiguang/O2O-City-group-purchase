<template>
	<view>
		<u-form-item label-position="top" :label="this.$t('cocode.countrycode')" prop="mobicountry" label-width="150">
			<u-input  type="select" :select-open="selectShow" v-model="mobicountry" :placeholder="this.$t('usercenter.pls_required')+this.$t('cocode.countrycode')" @click="selectShow = true"></u-input>
			<u-select mode="single-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm" confirm-color="#000000" cancel-color="#000000"></u-select>
		</u-form-item>
	</view>
</template>

<script>
    import {
    	mapState,
    	mapMutations
    } from 'vuex';
	export default {
		props: {
			default_id:''
		},
		data() {
			return {
			selectShow: false,
			selectList: [
				{
					value: '0086',
					label: this.$t('cocode.china')
				},
				{
					value: '0060',
					label: this.$t('cocode.malaysia')
				},
			],
				mobicountry:"",
			};
		},
		created(){
        console.log(this.default_id);
				//if (this.default_id==""){
					this.$emit('eventChange', this.selectList[0]);
					this.mobicountry=this.selectList[0].label;
				//}
				
		},
		methods:{
		// 选择商品类型回调
		selectConfirm(e) {
			this.mobicountry = '';
			e.map((val, index) => {
				this.mobicountry += this.mobicountry == '' ? val.label : '-' + val.label;
				this.$emit('eventChange', val);
			});
			
		},
		}
	}
</script>

<style lang="scss">
.guide_pages_swiper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color:#fff;
    z-index: 10000;
	image {
		width: 100vw;
		height: 100vh;
	}
    .guide_pages_bg1 {
        width: 100vw;
        height: 100vh;
        background-color: #4CD964;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFF;
        font-size: 60rpx;
        font-weight: bold;
    }
    .guide_pages_bg2 {
        width: 100vw;
        height: 100vh;
        background-color: #007AFF;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFF;
        font-size: 60rpx;
        font-weight: bold;
    }
    .guide_pages_bg3 {
        width: 100vw;
        height: 100vh;
        background-color: #EA552D;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFF;
        font-size: 60rpx;
        font-weight: bold;
    }
    .guide_pages_close {
        border:2rpx solid #FFF;
        color: #FFF;
        line-height: 68rpx;
        height: 68rpx;
    }
	.close_1334 {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 290rpx;
		height: 68rpx;
		transform: translateX(-50%) translateY(438rpx);
		background-color: transparent;
	}
	.close_1624 {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 290rpx;
		height: 68rpx;
		background-color: transparent;
		transform: translateX(-50%) translateY(412rpx);
	}
}
</style>
