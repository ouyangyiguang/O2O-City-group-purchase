/**
 * 接口列表文件
 * auth代表接口是否需要token
 */
export default {
	/** 初始化 ↓ **/
	init: {
		url: 'index/Index/init',
		auth: false,
		method: 'GET',
		// desc: '初始化数据',
	},
	siteinit: {
		url: 'index/Index/cate_init',
		auth: false,
		method: 'GET',
		// desc: '初始化数据',
	},
	delpic:{
		url: 'index/Tools/delpic',
		auth: true,
		method: 'GET',
	},
	/** 用户 ↓ **/
	user: {
		userinfo: {
			url: 'index/Member/info',
			auth: true,
			method: 'GET',
			// desc: '用户信息',
		},
		clientuserinfo: {
			url: 'index/Memberinfo/get_clientuserinfo',
			auth: true,
			method: 'GET',
		},
		login: {
			url: 'index/Login/login',
			auth: false,
			method: 'GET',
		},
		appletslogin: {
			url: 'index/Login/mini',//index/Wechat/login_applets
			auth: false,
			method: 'POST',
		},
		register: {
			url: 'index/Register/register',
			auth: false,
			method: 'GET',
		},
		getsmscode: {
			url: 'index/Tools/sendverifycode',
			auth: false,
			method: 'POST',
		},
		userlist_edit: {
			url: 'index/Memberinfo/userlist_edit',
			auth: true,
			method: 'POST',
		},
		usernick_edit: {
			url: 'index/Memberinfo/usernick_edit',
			auth: true,
			method: 'POST',
		},
		setpwd: {
			url: 'index/Member/pwd',
			auth: true,
			method: 'POST',
		},
		bindmobile:{
			url: 'index/Memberinfo/bindmobile',
			auth: true,
			method: 'POST',
		},
		invite:{
			url: 'index/Tools/invite',
			auth: true,
			method: 'GET',
		},
		userlog:{
			url: 'index/Memberinfo/actionlog',
			auth: true,
			method: 'GET',
		},
		useraccount:{
			url: 'index/Basebusiness/clinetaccountinfolist',
			auth: true,
			method: 'GET',
		},
		team:{
			url: 'index/Team/list_new',
			auth: true,
			method: 'GET',
		},
		ckuser:{
			url: 'User/user_check',
			auth: true,
			method: 'GET',
		},
		leveltypemanage:{
			url: 'index/Team/level_type_manage',
			auth: true,
			method: 'GET',
		},
		levelupgradepay:{
			url: 'index/Team/level_upgrade_pay',
			auth: true,
			method: 'GET',
		},
		teaminfo:{
			url:'index/Team/team_info',
			auth: true,
			method: 'GET',
		},
		feedbackadd:{
			url:'List/feedback_add',
			auth: true,
			method: 'GET',
		},
		feedbacklist:{
			url:'List/feedback_list',
			auth: true,
			method: 'GET',
		},
		getminimobi:{
			url:'index/Login/getminimobi',
			auth: true,
			method: 'GET',
		}
		

	},
	pay:{
		small_pay_sign_wx:{
			url:'index/Wx/pay_small_sign_wx',
			auth:true,
			method:'POST',
		}
	},
	/** 文档调用  **/
	  archives: {
		article_list: {
			url: 'Artice/list',
			auth: false,
			method: 'POST'
		},
		article_view: {
			url: 'index/cms.Content/info',
			auth: false,
			method: 'POST'
		},
		needsitem_view:{
			url: 'index/cms.Contentneedsitem/info',
			auth: false,
			method: 'GET'
		},
		shop_view:{
			url: 'index/Shop/shopinfo',
			auth: false,
			method: 'GET'
		}
	},
	/** 订单  **/
	 order: {
		address_add: {
			url: 'index/Order/user_address_add',
			auth: true,
			method: 'POST'
		},
		address_list: {
			url: 'index/Order/user_address_list',
			auth: true,
			method: 'POST'
		},
		order_list: {
			url: 'index/Order/order_alist',
			auth: true,
			method: 'POST'
		},
		order_view: {
			url: 'index/Order/order_view',
			auth: true,
			method: 'POST'
		},
		order_pay:{
			url:'index/Order/order_pay',
			auth: true,
			method: 'POST'
		},
		order_del:{
			url:'index/Order/order_del',
			auth: true,
			method: 'POST'
		}
	},
	/** 产品调用  **/
	  shop: {
		shop_list: {
			url: 'index/Shop/shoplist',
			auth: false,
			method: 'POST'
		},
		products_list: {
			url: 'index/Shop/list',
			auth: false,
			method: 'POST'
		},
		products_view: {
			url: 'index/Shop/view',
			auth: false,
			method: 'POST'
		},
		add_cart:{
			url: 'index/Shop/addcart',
			auth: true,
			method: 'POST'
		},
		car_list:{
			url: 'index/Shop/carlist',
			auth: true,
			method: 'POST'
		},
		cart_uni_algorithm:{
			url: 'index/Shop/cart_uni_algorithm',
			auth: true,
			method: 'POST'
		},
		cart_del:{
			url: 'index/Shop/cart_del',
			auth: true,
			method: 'POST'
		},
		order_save:{
			url: 'index/Shop/order_save',
			auth: true,
			method: 'POST'
		},
	},
    ticket: {
    	url: 'index/Order/ticket_list',
    	auth: true,
    	method: 'GET',
    },
	/** 资产  **/
	  assets: {
		coin_list: {
			url: 'index/Assets/coin_list',
			auth: true,
			method: 'POST'
		},
		coin_detail: {
			url: 'index/Assets/coin_detail',
			auth: true,
			method: 'POST'
		},
		coinflow_list: {
			url: 'index/Assets/coinflow_list',
			auth: true,
			method: 'POST'
		},
		zhuan_zhang: {
			url: 'index/Assets/zhuan_zhang',
			auth: true,
			method: 'POST'
		},
		ti_bi: {
			url: 'index/Assets/ti_bi',
			auth: true,
			method: 'POST'
		},
		ti_bi_log: {
			url: 'index/Assets/ti_bi_log',
			auth: true,
			method: 'POST'
		},
		gethangqing: {
			url: 'index/Assets/hangqing',
			auth: true,
			method: 'POST'
		},
		autodiscover:{
			url: 'index/Assets/auto_discover_wallet',
			auth: true,
			method: 'POST'
		},
		freeze_log:{
			url: 'index/Assets/freeze_log',
			auth: true,
			method: 'POST'
		}
	},
	/** 客服 ↓ **/
	chat: {
		room: {
			url: 'index/Chat/get_roomgroup',
			auth: true,
			method: 'POST'
		},
		sendmsg: {
			url: 'index/Chat/send_msg',
			auth: true,
			method: 'POST'
		},
		listmsg: {
			url: 'index/Chat/get_msg_list',
			auth: true,
			method: 'POST'
		},
		create_roomgroup: {
			url: 'index/Chat/create_roomgroup',
			auth: true,
			method: 'POST'
		},
	},
	/** 短信 ↓ **/
	sms: {
		send: {
			url: 'sms/send',
			auth: false,
			method: 'POST',
			// desc: '发送短信',
		},
	},

	/** 商家管理  **/
	exbusiness: {
		add: {
			url: 'index/Village/add_newvillage',
			auth: true,
			method: 'POST'
		},
		communitylist: {
			url: 'index/Basebusiness/communitylist',
			auth: true,
			method: 'POST'
		},
	},
	village:{
		list:{
			url: 'index/Village/village_list',
			auth: true,
			method: 'GET'
		},
		apitb:{
			url: 'api/Index/tb_qqmap_village',
			auth: true,
			method: 'POST'
		}
	},
	//房至选择列表
	shelf: {
		shelflist: {
			url: 'index/Wareroom/shelflist',
			auth: true,
			method: 'POST'
		},
		userroomlist: {
			url: 'index/Village/userroomlist',
			auth: true,
			method: 'GET'
		},
		bindroom: {
			url: 'index/Village/bindroom',
			auth: true,
			method: 'POST'
		},
		operateroom: {
			url: 'index/Wareroom/operateroom',
			auth: true,
			method: 'POST'
		},
		roomalluser: {
			url: 'index/Wareroom/roomalluser',
			auth: true,
			method: 'POST'
		},
		tichu: {
			url: 'index/Wareroom/roomtichu',
			auth: true,
			method: 'POST'
		},
	},
	info:{
		add: {
			url: 'index/cms.Info/add',
			auth: true,
			method: 'POST',
		},
		list: {
			url: 'index/cms.Info/list',
			auth: true,
			method: 'GET',
		},
		info: {
			url: 'index/cms.Info/info',
			auth: true,
			method: 'GET',
		},
		get_only:{
			url: 'index/cms.Info/getonly',
			auth: true,
			method: 'GET',
		},
		cancel:{
			url: 'index/cms.Info/delete',
			auth: true,
			method: 'GET',
		}
	},
	/** C2C ↓ **/
	 ctc: {
		init_list: {
			url: 'index/Ctc/init_list',
			auth: true,
			method: 'POST',
		},
		adlist: {
			url: 'index/Ctc/ad_list',
			auth: true,
			method: 'POST',
		},
		adrefresh: {
			url: 'index/Ctc/ad_refresh',
			auth: true,
			method: 'POST',
		},
		confirmbuyorder: {
			url: 'index/Ctc/confirm_buyorder',
			auth: true,
			method: 'POST',
		},
		myorder: {
			url: 'index/Ctc/order_list',
			auth: true,
			method: 'POST',
		},
		myorderview: {
			url: 'index/Ctc/myorder_view',
			auth: true,
			method: 'POST',
		},
		setadrecord: {
			url: 'index/Ctc/set_adrecord',
			auth: true,
			method: 'POST',
		},
		needsorder: {
			url: 'index/Ctc/confirm_needsorder',
			auth: true,
			method: 'POST',
		},
		cancelorder:{
			url: 'index/Ctc/cancel_order',
			auth: true,
			method: 'POST',
		},
		releasecoin:{
			url: 'index/Ctc/release_coin',
			auth: true,
			method: 'POST',
		},
		delorder:{
			url: 'index/Ctc/delorder',
			auth: true,
			method: 'POST',
		},
		adinfo:{
			url: 'index/Ctc/get_adinfo',
			auth: true,
			method: 'GET',
		},
		editinfo:{
			url: 'index/Ctc/edit_adinfo',
			auth: true,
			method: 'POST',
		}
	},
	
	

};
