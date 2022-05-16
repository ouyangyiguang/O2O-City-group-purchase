<template>

		<u-form-item label-position="top" label="币种选择" prop="cointype" label-width="150" :label-position="forminfo.labelPosition" :label-width="forminfo.labelwidth">
			<u-input  type="select" :select-open="selectShow" v-model="cointype" placeholder="请选择" @click="selectShow = true"></u-input>
			<u-select mode="single-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm" confirm-color="#000000" cancel-color="#000000"></u-select>
		</u-form-item>

</template>

<script>
    import {
    	mapState,
    	mapMutations
    } from 'vuex';
	export default {
		props: {
			forminfo:{},
			exclude_id:'',//排除的ID
			default_id:'',//默认ID
		},
		data() {
			return {
				selectShow: false,
				selectList:[],
				cointype:"",
			};
		},
		created(){

			this.$api('assets.coin_list', {}).then(res => {
				if (res.code==200){

					for (let i = 0; i < res.data.list.length; i++) {
						this.selectList.push({
							value:res.data.list[i].id,
							label:res.data.list[i].name
						});
							if (this.exclude_id!=''&&res.data.list[i].id==this.exclude_id){
								this.selectList.pop()//删除掉排除的那个
							}
							if (this.default_id!=""&&res.data.list[i].id==this.default_id){
								this.$emit('eventChange', ({
									value:res.data.list[i].id,
									label:res.data.list[i].name
								}));
								this.cointype=res.data.list[i].name;
							}
					}
				if (this.default_id==""){
					this.$emit('eventChange', this.selectList[0]);
					this.cointype=this.selectList[0].label;
				}

				}
			}).catch((e)=>{});
			
			
		},
		methods:{
		// 选择商品类型回调
		selectConfirm(e) {
			this.cointype = '';
			e.map((val, index) => {
				this.cointype += this.cointype == '' ? val.label : '-' + val.label;
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
