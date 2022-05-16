import Request from './request'
import apiList from './api'
import store from '@/common/store/index.js'

export default function api(url, data = {}) {
	const request = new Request();
	let api = getApiObj(url);
    
	request.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
        let tokenFlag = store.getters.loginFlag;
		if (api.auth && !tokenFlag) {
            store.commit('OUT_LOGIN');
            console.log('暂未登录,已阻止此次API请求~');
            throw('暂未登录,已阻止此次API请求~');
		}
		if (tokenFlag) {
            //tokenInfo.access_token即为登录token
			config.header.MemberToken = store.state.user.tokenInfo;
			config.header.Bid = store.state.user.bid;
		}
		return config
	});

	request.interceptor.response((response) => { /* 请求之后拦截器 */
        if (response.data.code === 401) { // 服务端返回的状态码不等于200，则reject()
            //401代表token失效
            store.commit('OUT_LOGIN');
			uni.navigateTo({ url: '/pages/account/login/pwd-login'})
        }
        
		if (response.data.code != 200) { // 服务端返回的状态码不等于200，则reject()
			uni.showToast({
				title: response.data.msg || '请求出错,稍后重试',
				icon: 'none',
				duration: 2000,
				mask: true
			});
		}

		
		// if (response.config.custom.verification) { // 演示自定义参数的作用
		//   return response.data
		// }
		return response
	}, (response) => { // 预留可以日志上报
		return response
	})
	let lang = uni.getStorageSync("locale");
	data.lang=lang;
	return request.request({
		url: api.url,
		data,
		method: api.method
	})

}

function getApiObj(url) {
	let apiArray = url.split(".");
	let api = apiList;
	apiArray.forEach(v => {
		api = api[v];
	});
	return api;
}
