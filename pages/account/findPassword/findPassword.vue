<template>
	<account-page :title="title" :desc="desc">
		<list></list>

		<u-gap height="40"></u-gap>
	</account-page>
</template>

<script>
import list from '@/components/account/find-password.vue';
export default {
	components: {
		list
	},
	data() {
		return {
			title: '找回密码',
			desc: ''
		};
	}
};
</script>

<style lang="scss" scoped></style>
