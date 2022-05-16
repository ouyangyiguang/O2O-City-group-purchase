
import { getAppWxLatLon } from '@/plugins/utils';
import api from '@/common/request/index'
// #ifdef H5
import { getLatLonH5, publicShareFun, wxPublicPay, getBrowser, appMutual } from '@/plugins/html5Utils';
// 公众号分享
export const publicShare = publicShareFun;
// #endif
// #ifdef APP-PLUS
import appShareFun, {closeShare} from '@/plugins/share';
// APP分享
export const appShare = function(data,callbcak){
	return appShareFun({
		shareTitle: data.shareTitle || base.share.title,
		shareUrl: data.shareUrl || base.share.link,
		shareContent: data.shareContent || base.share.desc,
		shareImg: data.shareImg || base.share.imgUrl,
	},callbcak);
};
export const closeAppShare = closeShare;
// #endif

// #ifdef MP-WEIXIN
// 微信小程序分享
export const wxShare = function (title,path) {
	let shareInfo = {
		title: title || base.share.title,
	};
	if(path && typeof(path) == "string"){
		shareInfo.path = path;
	}else if(path === undefined){
		shareInfo.path = base.share.path;
	}
	if (store.state.userInfo.token) {
		if (shareInfo.path.indexOf("?") >= 0) {
			shareInfo.path += "&recommendCode=" + store.state.userInfo.uid;
		} else {
			shareInfo.path += "?recommendCode=" + store.state.userInfo.uid;
		}
	}
	return shareInfo;
}
// #endif

//支付（APP微信支付、APP支付宝支付、微信小程序支付）
export const setPay = function(payInfo, callback) {
	console.log("开始调用支付")
	let httpUrl = "";
	if (payInfo.type == 'wxpay') {
		// APP微信支付
		httpUrl = 'pay_sign_wx'
	} else if (payInfo.type == 'alipay') {
		// APP支付宝支付
		httpUrl = 'pay_sign_ali'
	} else if (payInfo.type == 'smallPay') {
		// 微信小程序支付
		httpUrl = 'small_pay_sign_wx'
	}

	api('pay.'+httpUrl, {
		orderNo: payInfo.orderNo,
		type: payInfo.type,
		title: payInfo.title,
		price: payInfo.price,
		table: payInfo.table
	}).then(data => {
		let payData = {
			success: function(res) {
				callback && callback({
					success: true,
					data: res
				});
				console.log('success:' + JSON.stringify(res));
			},
			fail: function(err) {
				callback && callback({
					success: false,
					data: err
				});
				console.log('fail:' + JSON.stringify(err));
			}
		};
		if (payInfo.type == 'smallPay') {
			// 小程序
			payData.provider = 'wxpay';
			payData.timeStamp = data.data.timeStamp;
			payData.nonceStr = data.data.nonceStr;
			payData.package = data.data.package;
			// payData.package = "prepay_id=" + data.prepayid;
			payData.signType = "MD5";
			payData.paySign = data.data.paySign;
		} else if (payInfo.type == 'wxpay') {
			// app微信
			payData.provider = 'wxpay';
			payData.orderInfo = data.data;
		} else if (payInfo.type == 'alipay') {
			// app 支付宝
			payData.provider = 'alipay';
			payData.orderInfo = data.data;
		} else if (payInfo.type == 'baidu') {
			payData.provider = 'baidu';
			payData.orderInfo = data.data;
		}
		console.log("支付参数", payData);
		uni.requestPayment(payData);
	}, err => {
		callback && callback({
			success: false,
			data: err
		});
	});
}
// 支付统一分配
export const setPayAssign = function(orderInfo, callback) {
	orderInfo.price = orderInfo.price || orderInfo.pricePay;
	orderInfo.title = orderInfo.title || orderInfo.orderTitle;
	//支付
	// #ifdef APP-PLUS
	uni.navigateTo({
		url: '/pages/template/pay?orderNo=' + orderInfo.orderNo + '&price=' + orderInfo.price + '&title=' + orderInfo.title
	});
	// #endif 
	// #ifdef MP-WEIXIN
	setPay({
		...orderInfo,
		type: "smallPay"
	}, callback);
	// #endif
	// #ifdef H5
	if (getBrowser() === '微信') {
		wxPublicPay({
			orderNo: orderInfo.orderNo
		});
	} else {
		// H5嵌套在APP里面，调用app支付方法
		
		appMutual('setJumpPay', orderInfo);
	}
	// #endif
}
// 获取地址信息 （微信小程序、APP、公众号）
export const getLatLon = function(tip){
	return new Promise((resolve, reject) => {
		const successProcess = function(res){
			store.commit("setCurrentAddress", {
				latitude: res.latitude,
				longitude: res.longitude
			});
			resolve(res);
		};
		const errProcess = function(err){
			reject(err);
			if(tip){
				uni.showToast({
					title: err,
					icon: "none"
				});
			}
		};
		// #ifdef H5
		getLatLonH5(successProcess,errProcess);
		// #endif
		// #ifndef H5
		getAppWxLatLon(successProcess,errProcess);
		// #endif
	});
}




