// 用户数据模块
import api from '@/common/request/index'
import store from '@/common/store'
import router from '@/common/router.js'
import tools from '@/common/utils/tools'

import {
	USER_INFO,
	TOKEN_INFO,
	OUT_LOGIN,
} from '../types.js'
const state = {
	userInfo: uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo') : {},
	tokenInfo: uni.getStorageSync('tokenInfo') ? uni.getStorageSync('tokenInfo') : '',
	bid: uni.getStorageSync('bid') ? uni.getStorageSync('bid') : '3',
	wareRoom: uni.getStorageSync('wareRoom') ? uni.getStorageSync('wareRoom') : {
		village_id:'',
		addr_id:'',
		villagename:'',
		roomnumber:'',
		verifytitle:'',
		is_verify:0,
		positionmarker:''
	},
	basebusinessInfo: uni.getStorageSync('basebusinessInfo') ? uni.getStorageSync('basebusinessInfo') : {},
	siteInfo: uni.getStorageSync('siteInfo') ? uni.getStorageSync('siteInfo') : {
		update_time:0
	},
	location: uni.getStorageSync('location') ? uni.getStorageSync('location') : {locale:0},
	//微信场景参数
	chatScenesInfo: {},
	//登录弹窗状态
	bidPopupShow: false,
	roomPopupShow: false,
	chatmsgnoread:0,
	//登录弹窗状态
	loginPopupShow: false,
}

const actions = {
	//设置token 获取个人信息 并返回上次页面
	setTokenAndBack({
		commit
	}, token) {
		
		uni.setStorageSync('tokenInfo', token);
		store.dispatch('getUserInfo');
        //返回登录之前的页面
		let fromLogin = uni.getStorageSync('fromLogin');
		if (fromLogin) {
			tools.routerTo(fromLogin.path, fromLogin.query, true);
			uni.removeStorageSync('fromLogin')
		} else {
			//默认跳转首页
			router.replaceAll('/pages/my/my')
		}
	},
	
	

	// 获取用户信息
	getUserInfo({
		commit,state
	}) {
		
		return new Promise((resolve, reject) => {
			api('user.userinfo').then(res => {
				console.log('getUserInfo',res)
				if (res.code==200){
					store.commit('USER_INFO',res.data);
					uni.setStorageSync('userInfo', res.data);
				resolve(true)
				}else{
					let data = {
						bid:'',
					};
					store.commit("setbasebusinessID",data);
					let item={
					};
					store.commit("setwareRoom",item);
					uni.setStorageSync('wareRoom','');
					store.commit('OUT_LOGIN');
					resolve(false)
				}
			}).catch(e => {
				resolve(false)
				reject(e)
			})
			
		})
	},
	
	
	setBaseBusinessInfo({commit}, data) {
			api('init',{
				bid:data.bid
			}).then(res => {
				console.log(res)
				if (res.code==200){
					uni.setStorageSync('basebusinessInfo', res.data.basebusinessInfo);
					state.basebusinessInfo = res.data.basebusinessInfo;
				}
			}).catch(e => {})
	},
	
	getsiteInfo({commit}, data) {
		console.log(Date.now())
		///let updatetime=store.state.user.siteInfo.update_time*1000
		//console.log(updatetime)
		return new Promise((resolve, reject) => {
			api('siteinit').then(res => {
				if (res.code==200){
						setTimeout(() => {
							store.commit("setsiteInfo",res.data);
							resolve(res.data);
						}, 0);
				}else{
					resolve(false)
				}
			}).catch(e => {
				resolve(false)
				reject(e)
			})
		})
	},


}

const mutations = {

	[USER_INFO](state, data) {
		state.userInfo = data
	},
    [TOKEN_INFO](state, data) {
    	state.tokenInfo = data
    },
	[OUT_LOGIN](state, data) {
		uni.removeStorageSync('tokenInfo');
		uni.removeStorageSync('userInfo');
		store.commit('USER_INFO', {});
		store.commit('TOKEN_INFO', '');
	},
	  //微信场景参数
	  setChatScenesInfo(state, data) {
		if (data) {
			
			state.chatScenesInfo = Object.assign({}, state.chatScenesInfo, data);
			
			if (state.chatScenesInfo.query!=undefined){
				let querys=JSON.parse(state.chatScenesInfo.query);
				console.log(querys)
				if (querys.b>0){
					state.bid=querys.b;
					uni.setStorageSync('bid', querys.b);
					store.commit('setbasebusinessID', state);
					store.dispatch('getUserInfo');
				}
				if (querys.s>0){
					state.chatScenesInfo.recommendCode=querys.s
				}
			}
		}
	  },
	  
	  //商家参数
	  setbasebusinessID(state, data) {
		if (data) {
			uni.setStorageSync('bid', data.bid);
			state.bid = data.bid;
			store.dispatch("setBaseBusinessInfo",data);
		}
	  },
	  
	  setsiteInfo(state, data) {
		if (data) {
			uni.setStorageSync('siteInfo', data);
			state.siteInfo = data;
		}
	  },
	  setChatmsgnoread(state, data) {
		if (data) {
			state.chatmsgnoread = data;
		}
	  },
	  //登录弹窗状态
	  setBidPopupShow(state, data) {
		state.bidPopupShow = data;
	  },
	  //设置仓库 ID
	  setwareRoom(state, data) {
		if (data) {
			uni.setStorageSync('wareRoom', data);
			state.wareRoom = data;
		}
	  },
	  //定位
	  setLocation(state, data) {
		if (data) {
			uni.setStorageSync('location', data);
			state.location = data;
		}
	  },
	  //登录弹窗状态
	  setroomPopupShow(state, data) {
		state.roomPopupShow = data;
	  },
	  setChatmsgnoread(state, data) {
		if (data) {
			state.chatmsgnoread = data;
		}
	  },
	  //登录弹窗状态
	  setLoginPopupShow(state, data) {
		  console.log('close',data)
		state.loginPopupShow = data;
	  },
	  
	  
}

const getters = {
    loginFlag: state => {
        return Boolean( Object.keys(state.tokenInfo).length != 0 );
    },
}

export default {
	state,
	mutations,
	actions,
	getters
}
