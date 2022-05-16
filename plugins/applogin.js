import {
	API_URL
} from '@/env'
import store from '@/common/store'
import api from '@/common/request/index'
// #ifdef H5
import { h5Login } from '@/plugins/html5Utils';
// #endif
let code = "";
let loginStart = true;
let userInfo = {
	token: ""
};
let lastPageUrl = "";
// 微信小程序登录
function onLogin(type = "judge",callback) {
	//判断登录状态
	
	if (loginStart) {
		lastPageUrl = "";
		loginStart = false;
		const _this = this;
		let platform;
		// #ifdef MP-WEIXIN
		platform = 'weixin';
		// #endif
		// #ifdef MP-ALIPAY
		platform = 'alipay';
		// #endif
		// #ifdef MP-BAIDU
		platform = 'baidu';
		// #endif
		console.log("小程序登陆")
		
		uni.login({
			provider: platform,
			success: function(loginRes) {
				
				if (loginRes.errMsg == 'login:ok') {
					code = loginRes.code;
					// 获取用户信息
					uni.getUserInfo({
						provider: platform,
						success: function(infoRes) {
							getUserInfo(infoRes, "", callback);
						},
						fail() {
							if(type != "try"){
								store.commit('setLoginPopupShow', true);
								Object.defineProperty(userInfo, "token", {
									get: function(val) {
										return {};
									},
									set: function(newVal) {
										callback && callback();
									}
								});
								setTimeout(() => {
									loginStart = true;
								}, 2000);
							}else{
								loginStart = true;
							}
						}
					});
				}
			}
		});
	}
}
//微信小程序获取用户信息
function getUserInfo(info, type, callback) {
	let httpData = {
		wxSmallCode: code, //小程序code
		iv: info.iv, //小程序加密算法的初始向量
		encryptedData: info.encryptedData ,//包括敏感数据在内的完整用户信息的加密数据
		user_info:info.userInfo,
		recommendUid:'',
		bid:store.state.user.bid
	};
	// store.state.chatScenesInfo里面是小程序二维码附带的信息
	
	if(store.state.user.chatScenesInfo.recommendCode){
		// 推荐码
		httpData.recommendUid = store.state.user.chatScenesInfo.recommendCode;
	}
	console.log('info1',info)
	api('user.appletslogin', { 
		httpData:httpData,
	}).then(res => {
			loginStart = true;
			console.log(res)
			if (res.code==200){
					store.commit('USER_INFO',res.data);
					store.commit('TOKEN_INFO',res.data.member_token);
					store.dispatch('setTokenAndBack',res.data.member_token);
				let bussiness = {
					bid:res.data.bid,
				};
				this.$store.commit("setbasebusinessID",bussiness);
				if (type == "authorized") {
					store.commit('setLoginPopupShow', false);
				}else{
					callback && callback();
				}
				uni.showToast({
					title: "登录成功"
				});
			}else{
				uni.showToast({
					title: "登录失败"
				});
			}

	}).catch((e)=>{
	     console.log(e);
	});

}
//判断是否登录（所有端）
function judgeLogin(callback, type = "judge"){

        let storeUserInfo = store.state.user.userInfo;
        if(!store.state.user.tokenInfo){ // nvue页面读取不到vuex里面数据，将取缓存
            storeUserInfo = uni.getStorageSync("userInfo");
        }

        if (type != "force" && storeUserInfo.username) {
            callback();
        } else if (store.state.user.tokenInfo && storeUserInfo.username !==undefined && storeUserInfo.is_mobile!=1) {
            if (type == "force") {
                uni.navigateTo({
                    url: '/pages/account/bindMobile/bindMobile'
                });
            } else {

                uni.showModal({
                    title: "提示"+storeUserInfo.length,
                    content: "您还未绑定手机号，请先绑定~",
                    confirmText: "去绑定",
                    cancelText: "再逛会",
                    success: (res) => {
                        if (res.confirm) {
							console.log(" 这里bindMobile")
                            uni.navigateTo({
                                url: '/pages/account/bindMobile/bindMobile'
                            });
                        }
                    }
                });
            }
        } else {
			
            // #ifdef MP
            onLogin(type, callback);
            // #endif
            // #ifdef APP-PLUS
            uni.showModal({
                title: "登录提示",
                content: "此时此刻需要您登录喔~",
                confirmText: "去登录",
                cancelText: "再逛会",
                success: (res) => {
                    if (res.confirm) {
                        uni.navigateTo({
                            url: "/pages/account/login/pwd-login"
                        });
                    }
                }
            });
            // #endif
			
            // #ifdef H5
			console.log(" 这里这里这里3333"+storeUserInfo.length)
            h5Login(type, () => {
                callback();
            });
            // #endif
        }

}
export {
	onLogin,
	getUserInfo,
	judgeLogin
}
