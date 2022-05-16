<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<!-- 小程序登录弹窗组件 -->
		<applets-login></applets-login>
		<!-- #endif --> 

		

	</view>
</template>

<script>
	// #ifdef MP-WEIXIN
	import appletsLogin  from "@/components/common/applets-login.vue"
	// #endif

	

	export default {
		components:{
			// #ifdef MP-WEIXIN
			appletsLogin,
			// #endif
	
			

		}
	};
</script>
<style lang="scss" scoped>

</style>
