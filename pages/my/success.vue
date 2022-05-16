<template>
	<view>
		<view class="u-padding-20 ">
			<u-gap height="240"></u-gap>
			<view class="u-text-center"><h1>{{title}}</h1></view>
             
			<u-gap height="40"></u-gap>
			<view class="u-text-center">{{msg}}</view>
			<u-gap height="140"></u-gap>
			<u-button type="primary" @click="back()">返回首页</u-button><!--$tools.routerTo('/pages/index/index')-->
		</view>
			
	</view>
</template>


<script>
import {mapState,mapMutations} from 'vuex';
export default {
	data(){
		return {
			flow_list:[],
			hasLogin:false,
			loadStatus: 'loadmore',
			loadstatus:false,
			loadstxt:'loading...',
			title:'',
			msg:''
		};
	},
	computed: {
	  ...mapState(['user']),
	},
	 onLoad(options){
		let query = JSON.parse(decodeURIComponent(options.query));
		console.log('query=',query)
        this.title=query.title;
	    this.msg=query.msg;

	},

	methods: {
	  //返回按钮事件
	  back() {
			uni.reLaunch({
				url: '/pages/my/my'
			})
	  },
	},
};
</script>
<style lang="scss" scoped>
	
</style>
