<template>
	<view>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view v-if="mode == 'panel'" class="panel-box">
			<u-cell-group :border="border">
				<view class="panel-main">
<u-cell-item v-if="user.userInfo.is_mobile == 0" :border-top="false" title="手机" value="未绑定" @click="$tools.routerTo('/pages/account/bindMobile/bindMobile')" :border-bottom="borderBottom"></u-cell-item>
<u-cell-item v-if="user.userInfo.is_mobile == 1" :border-top="false" title="手机" :value="user.userInfo.mobile"  :arrow="false" :border-bottom="borderBottom"></u-cell-item>
<!--u-cell-item  :title="this.$t('usercenter.modipwd')" :value="this.$t('modify')" @click="$tools.routerTo('/pages/account/updatePassword/updatePassword')" :border-bottom="borderBottom"></u-cell-item-->

<u-cell-item  title="关于我们"  @click="aboutus()" :border-bottom="borderBottom"></u-cell-item>
					<!--u-cell-item
						:title="item.title"
						:value="item.value"
						@click="openPage(item.path)"
						:border-bottom="borderBottom"
						v-for="(item, index) in cells"
						:key="index"
					></u-cell-item-->
<u-cell-item  title="版本" value="1.0.0" :border-bottom="borderBottom" :arrow="false"></u-cell-item>
				</view>
			</u-cell-group>

			<u-gap height="60"></u-gap>

			<view class="u-margin-20"><u-button type="primary" @click="logout">退出</u-button></view>
		</view>
		<view v-if="mode == 'card'" class="card-box">
			<view class="card-main">
				<u-cell-group :border="border">
					<u-cell-item
						:title="item.title"
						:value="item.value"
						@click="openPage(item.path)"
						:border-bottom="borderBottom"
						v-for="(item, index) in cells"
						:key="index"
					></u-cell-item>
				</u-cell-group>
			</view>

			<u-gap height="60"></u-gap>

			<view class="u-margin-20"><u-button type="primary" @click="logout">退出</u-button></view>
		</view>
	</view>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
export default {
	name: 'my-setting',
	props: {
		// 是否显示边框
		border: {
			type: Boolean,
			default: false
		},
		// 是否显示内边框
		borderBottom: {
			type: Boolean,
			default: true
		},
		// 模式
		mode: {
			type: String,
			default: 'panel'
		}
	},
	computed: {
	  ...mapState(['user']),
	},
	data() {
		return {
			cells: [
				{
					title: "工单反馈",
					value: '',
					path: 'my/user/feedback'
				}
			]
		};
	},
	methods: {
		openPage(path) {
			this.$Router.push({
				path: '/pages/' + path
			});
		},
		aboutus(){
			uni.setStorageSync('guidePages', '');
			uni.redirectTo({
				url: "/pages/my/user/aboutus"
			});
		},
		logout() {
			
        uni.showModal({
          title: "退出登录",
          content: "确定要退出登录吗？",
          showCancel: true,
          cancelText: "取消",
          confirmText: "确认",
          success: res => {
            if (res.confirm) {
              try {
                this.$store.commit('OUT_LOGIN');
                this.$u.toast("退出成功");
				this.$Router.push({path: '/pages/index/index'});
              } catch (e) {

              }
            } else if (res.cancel) {
              return;
            }

          },
          fail: () => {},
          complete: () => {}
        });
			
			

		}
	}
};
</script>

<style lang="scss" scoped>

</style>
