<template>
	<view class="page-wrap">
		<view class="page-header">
			<view class="page-title">{{ title }}</view>
			<view class="page-desc">{{ desc }}</view>
		</view>
		<view class="page-body"><slot></slot></view>
	</view>
</template>

<script>
export default {
	name: 'account-page',
	props: {
		// 标题
		title: {
			type: String,
			default: ''
		},
		// 描述
		desc: {
			type: String,
			default: ''
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>


</style>