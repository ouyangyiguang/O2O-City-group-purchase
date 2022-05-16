<template>
	<view class="u-wrap" >
	<u-navbar :is-back="true" :title="shoptitle"  :border-bottom="false" :custom-back="BackPage" title-color="#000000"  back-icon-color="#000000">
	</u-navbar>
	<view class="u-text-center piaofu"><u-loading :show="loadstatus"></u-loading></view>
			<view class="nav" v-if="!loadstatus">
				<view class="header">
					<view class="left" v-if="shopinfo.orderType == 'takein'">
<!-- 						<view class="store-name">
							<text>{{ shopinfo.name }}</text>
							<u-icon name="arrow-right"></u-icon>
						</view> -->
						<view class="store-location">
							<image src='/static/images/location.png' style="width: 30rpx; height: 30rpx;" class="mr-10"></image>
							<text class="text-color-base" style="width: 300rpx; height: 30rpx;line-height: 30rpx; overflow: hidden;">{{ shopinfo.address }}</text>
						</view>
					</view>
					<view class="left overflow-hidden" v-else>
						<view class="d-flex align-items-center overflow-hidden">
							<view class="font-size-lg text-color-base font-weight-bold text-truncate">
								{{ shopinfo.name }}
							</view>
						</view>

					</view>
					<view class="right">
						<view class="dinein" :class="{active: shopinfo.orderType == 'takein'}">
							<text>票券/自取</text>
						</view>
						<view class="takeout" :class="{active: shopinfo.orderType == 'takeout'}">
							<text>快递/上门</text>
						</view>
					</view>
				</view>
				<view class="coupon" @click="$Router.push({path: '/pages/archives/view_shop', query: {id: shopinfo.shop_id}})">
					<text class="title">{{ shopinfo.title }}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>

			</view>
		<view class="u-menu-wrap content">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view menus" :scroll-top="scrollTop"
			 :scroll-into-view="itemId"  v-if="catecount>1">
				<view v-for="(item,index) in goods" :key="index" class="u-tab-item" :class="[current == index ? 'u-tab-item-active' : '']"
				 @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{ item.name }}</text>
					<text class="dot" v-show="menuCartNum(item.id)">{{ menuCartNum(item.id) }}</text>
				</view>
			</scroll-view>
			<scroll-view :scroll-top="scrollRightTop" scroll-y scroll-with-animation class="right-box goods" @scroll="rightScroll">
				<view class="page-view wrapper">
					<swiper class="ads" id="ads" autoplay :interval="3000" indicator-dots>
						<swiper-item v-for="(item, index) in ads" :key='index'>
							<image :src="item.pic"></image>
						</swiper-item>
					</swiper>
						<view class="list">
							<!-- category begin -->
							<view class="category" v-for="(item, index) in goods" :key="index" :id="`cate-${item.id}`">
								<view class="title">
									<text>{{ item.name }}</text>
									<image :src="item.icon" class="icon"></image>
								</view>
								<view class="items">
									<!-- 商品 begin -->
									<view class="good" v-for="(good, key) in item.goods_list" :key="key">
										<image :src="good.images" class="image" @tap="showGoodDetailModal(item, good)"></image>
										<view class="right">
											<text class="name">{{ good.name }}</text>
											<text class="tips">{{ good.content }}</text>
											<view class="price_and_action">
												<text class="price">￥{{ good.price }}</text>
												<view class="btn-group" v-if="good.use_property">
													<button type="primary" class="btn property_btn" hover-class="none"
													 size="mini" @tap="showGoodDetailModal(item, good)">
														选规格
													</button>
													<view class="dot" v-show="goodCartNum(good.goods_id)">{{ goodCartNum(good.goods_id) }}</view>
												</view>
												<view class="btn-group" v-else>
													<button type="default" v-show="goodCartNum(good.goods_id)" plain class="btn reduce_btn"
													 size="mini" hover-class="none" @tap="handleReduceFromCart(item, good)">
														<u-icon name="minus"></u-icon>
													</button>
													<view class="number" v-show="goodCartNum(good.goods_id)">{{ goodCartNum(good.goods_id) }}</view>
													<button type="primary" class="btn add_btn" size="min" hover-class="none" 
														@tap="handleAddToCart(item, good, 1)">
														<u-icon name="plus"></u-icon>
													</button>
												</view>
											</view>
										</view>
									</view>
									
									<!-- 商品 end -->
								</view>
							</view>
							<!-- category end -->
						</view><!-- <u-gap height="80"></u-gap> -->
				</view>
				
				

				
				
				
			</scroll-view>
		</view>
		
		
		

			<!-- 购物车栏 begin -->
			<view class="cart-box" v-if="cart.length > 0"> <!--v-if="cart.length > 0"-->
				<view class="mark">
					<image src="/static/images/menu/cart.png" class="cart-img" @tap="openCartPopup"></image>
					<view class="tag">{{ getCartGoodsNumber }}</view>
				</view>
				<view class="price">￥{{ getCartGoodsPrice }}</view>
				<button type="primary" class="pay-btn" @tap="toPay" :disabled="disabledPay">
					{{ disabledPay ? `差${spread}元起送` : '去结算' }}
				</button>
			</view>
			<!-- 购物车栏 end -->
		<!-- 商品详情模态框 begin -->
		<modal :show="goodDetailModalVisible" class="good-detail-modal" color="#5A5B5C" width="90%" custom padding="0rpx" radius="12rpx">
			<view class="cover">
				<image v-if="good.images" :src="good.images" class="image"></image>
				<view class="btn-group">
					<image src="/static/images/menu/close.png" @tap="closeGoodDetailModal"></image>
				</view>
			</view>
			<scroll-view class="detail" scroll-y>
				<view class="wrapper">
					<view class="basic">
						<view class="name">{{ good.name }}</view>
						<view class="tips">{{ good.content }}</view>
					</view>
					<view class="properties" v-if="good.use_property">
						<view class="property" v-for="(item, index) in good.property" :key="index">
							<view class="title">
								<text class="name">{{ item.name }}</text>
								<view class="desc" v-if="item.desc">({{ item.desc }})</view>
							</view>
							<view class="values">
								<view class="value" v-for="(value, key) in item.values" :key="key" 
								:class="{'default': value.is_default}" 
								@tap="changePropertyDefault(index, key)">
									{{ value.value }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="action">
				<view class="left">
					<view class="price">￥{{ good.price }}</view>
					<view class="props" v-if="getGoodSelectedProps(good)">
						{{ getGoodSelectedProps(good) }}
					</view>
				</view>
				<view class="btn-group">
					<button type="default" plain class="btn" size="mini" hover-class="none" 
						@tap="handlePropertyReduce">
						<u-icon name="minus"></u-icon>
					</button>
					<view class="number">{{ good.number }}</view>
					<button type="primary" class="btn" size="min" hover-class="none" 
						@tap="handlePropertyAdd">
						<u-icon name="plus"></u-icon>
					</button>
				</view>
			</view>
			<view class="add-to-cart-btn" @tap="handleAddToCartInModal">
				<view>加入购物车</view>
			</view>
		</modal>
		<!-- 购物车详情popup -->
		<popup-layer direction="top" :show-pop="cartPopupVisible" class="cart-popup">
			<template slot="content">
				<view class="top">
					<text @tap="handleCartClear">清空</text>
				</view>
				<scroll-view class="cart-list" scroll-y>
					<view class="wrapper">
						<view class="item" v-for="(item, index) in cart" :key="index">
							<view class="left">
								<view class="name">{{ item.name }}</view>
								<view class="props">{{ item.props_text }}</view>
							</view>
							<view class="center">
								<text>￥{{ item.price }}</text>
							</view>
							<view class="right">
								<button type="default" plain size="mini" class="btn" hover-class="none"
									@tap="handleCartItemReduce(index)">
									<u-icon name="minus"></u-icon>
								</button>
								<view class="number">{{ item.number }}</view>
								<button type="primary" class="btn" size="min" hover-class="none"
									@tap="handleCartItemAdd(index)">
									<u-icon name="plus"></u-icon>
								</button>
							</view>
						</view>
						<view class="item" v-if="shopinfo.orderType == 'takeout' && shopinfo.packing_fee">
							<view class="left">
								<view class="name">快递费</view>
							</view>
							<view class="center">
								<text>￥{{ parseFloat(shopinfo.packing_fee) }}</text>
							</view>
							<view class="right invisible">
								<button type="default" plain size="mini" class="btn" hover-class="none">
									<u-icon name="minus"></u-icon>
								</button>
								<view class="number">1</view>
								<button type="primary" class="btn" size="min" hover-class="none">
									<u-icon name="plus"></u-icon>
								</button>
							</view>
						</view>
					</view>
				</scroll-view>
			</template>
		</popup-layer>
		<!-- 购物车详情popup -->
		
		
		
	</view>
</template>
<script>
import modal from '@/components/modal/modal'
import popupLayer from '@/components/popup-layer/popup-layer'
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
	export default {
	components: {
		modal,
		popupLayer
	},
		data() {
			return {
				loadstatus:false,
				scrollTop: 0, //tab标题的滚动条位置
				oldScrollTop: 0,
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				itemId: '', // 栏目右边scroll-view用于滚动的id
				goods: [],
				good:[],
				cart: [], //购物车
				menuItemPos: [],
				arr: [],
				scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
				timer: null, // 定时器
				shopinfo:[],
				currentCateId:'',
				catecount:'',
				ads:[],
				cartPopupVisible: false,
				sizeCalcState: false,
				goodDetailModalVisible: false, //是否饮品详情模态框
				shoptitle:''

			}
		},
	async onLoad(options) {
		this.loadstatus=true;
		if(options.q){
			let q = decodeURIComponent(options.q);
			this.shop_id = this.$tools.getQueryString(q, 's');
		}else{
			let query = JSON.parse(decodeURIComponent(options.query));
			this.shop_id = query.shop_id;
		}
		this.shop_list()
		
		

		await this.init()
	},
	
	computed: {
		...mapState(["user"]),

		goodCartNum() {	//计算单个饮品添加到购物车的数量
			return (id) => this.cart.reduce((acc, cur) => {
					if(cur.id === id) {
						return acc += cur.number
					}
					return acc
				}, 0)
		},
		menuCartNum() {
			return (id) => this.cart.reduce((acc, cur) => {
					if(cur.cate_id === id) {
						return acc += cur.number
					}
					return acc
			}, 0)
		},
		getCartGoodsNumber() { //计算购物车总数
			return this.cart.reduce((acc, cur) => acc + cur.number, 0)
		},
		getCartGoodsPrice() {	//计算购物车总价
			return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
		},
		disabledPay() { //是否达到起送价
			return this.shopinfo.orderType == 'takeout' && (this.getCartGoodsPrice < this.shopinfo.min_price) ? true : false
		},
		spread() { //差多少元起送
			if(this.shopinfo.orderType != 'takeout') return
			return parseFloat((this.shopinfo.min_price - this.getCartGoodsPrice).toFixed(2))
		}
	},
		onReady() {
			this.getMenuItemTop()
		},
onShareAppMessage: function (res) {
	if (res.from === 'button') {}
	let data = {shop_id:this.shop_id,s:this.user.userInfo.salt,b:this.user.bid}
		return {
			title: this.shoptitle+' 邻邻社',
			path: '/pages/shop/index?query='+encodeURIComponent(JSON.stringify(data)),
			success: function(res) {},
			fail: function(res) {}
		}
},
		methods: {
		BackPage(){
			//this.$tools.routerTo("/pages/shop/shop",{},'');
			uni.reLaunch({
				url: '/pages/shop/shop'
			})
		},
		async init() {	//页面初始化
			uni.setStorageSync('cart','')
			this.cart = uni.getStorageSync('cart') || []
		},
		shop_list(){
                    this.$api('shop.products_list', {
						page:1,
						limit:10,
						shop_id:this.shop_id
					}).then(res => {
						this.loadstatus=false;
						if (res.code==200){
							this.goods=res.data.menu;
							console.log(res)
							this.currentCateId=res.data.currentCateId;
							this.catecount=res.data.catecount
							this.shopinfo=res.data.shopinfo
							this.ads=res.data.shopinfo.imgs
							this.shoptitle=this.shopinfo.name
						}
                    }).catch((e)=>{
                        resolve(false);
                    });
		},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if(this.arr.length == 0) {
					await this.getMenuItemTop();
				}
				if (index == this.current) return;
				this.scrollRightTop = this.oldScrollTop;
				this.$nextTick(function(){
					this.scrollRightTop = this.arr[index];
					this.current = index;
					this.leftMenuStatus(index);
				})
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
						resolve();
					}).exec();
				})
			},
			// 观测元素相交状态
			async observer() {
				this.tabbar.map((val, index) => {
					let observer = uni.createIntersectionObserver(this);
					// 检测右边scroll-view的id为itemxx的元素与right-box的相交状态
					// 如果跟.right-box底部相交，就动态设置左边栏目的活动状态
					observer.relativeTo('.right-box', {
						top: 0
					}).observe('#item' + index, res => {
						if (res.intersectionRatio > 0) {
							let id = res.id.substring(4);
							this.leftMenuStatus(id);
						}
					})
				})
			},
			// 设置左边菜单的滚动状态
			async leftMenuStatus(index) {
				this.current = index;
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取右边菜单每个item到顶部的距离
			getMenuItemTop() {
				new Promise(resolve => {
					let selectorQuery = uni.createSelectorQuery();
					selectorQuery.selectAll('.class-item').boundingClientRect((rects) => {
						// 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
						if(!rects.length) {
							setTimeout(() => {
								this.getMenuItemTop();
							}, 10);
							return ;
						}
						rects.forEach((rect) => {
							// 这里减去rects[0].top，是因为第一项顶部可能不是贴到导航栏(比如有个搜索框的情况)
							this.arr.push(rect.top - rects[0].top);
							resolve();
						})
					}).exec()
				})
			},
			// 右边菜单滚动
			async rightScroll(e) {
				this.oldScrollTop = e.detail.scrollTop;
				if(this.arr.length == 0) {
					await this.getMenuItemTop();
				}
				if(this.timer) return ;
				if(!this.menuHeight) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
				}
				setTimeout(() => { // 节流
					this.timer = null;
					// scrollHeight为右边菜单垂直中点位置
					let scrollHeight = e.detail.scrollTop + this.menuHeight / 2;
					for (let i = 0; i < this.arr.length; i++) {
						let height1 = this.arr[i];
						let height2 = this.arr[i + 1];
						// 如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
						if (!height2 || scrollHeight >= height1 && scrollHeight < height2) {
							this.leftMenuStatus(i);
							return ;
						}
					}
				}, 10)
			},
			
		handleMenuTap(id) {	//点击菜单项事件
			if(!this.sizeCalcState) {
				this.calcSize()
			}
			
			this.currentCateId = id
			this.$nextTick(() => this.cateScrollTop = this.goods.find(item => item.id == id).top)
		},
		handleGoodsScroll({detail}) {	//商品列表滚动事件
			if(!this.sizeCalcState) {
				this.calcSize()
			}
			const {scrollTop} = detail
			let tabs = this.goods.filter(item=> item.top <= scrollTop).reverse()
			if(tabs.length > 0){
				this.currentCateId = tabs[0].id
			}
		},
		calcSize() {
			let h = 10
			
			let view = uni.createSelectorQuery().select('#ads')
			view.fields({
				size: true
			}, data => {
				h += Math.floor(data.height)
			}).exec()
			
			this.goods.forEach(item => {
				let view = uni.createSelectorQuery().select(`#cate-${item.id}`)
				view.fields({
					size: true
				}, data => {
					item.top = h
					h += data.height
					item.bottom = h
				}).exec()
			})
			this.sizeCalcState = true
		},
		handleAddToCart(cate, good, num) {	//添加到购物车
			const index = this.cart.findIndex(item => {
				if(good.use_property) {
					return (item.id === good.goods_id) && (item.props_text === good.props_text)
				} else {
					return item.id === good.goods_id
				}
			})
			if(index > -1) {
				this.cart[index].number += num
			} else {
				this.cart.push({
					id: good.goods_id,
					cate_id: cate.id,
					name: good.name,
					price: good.price,
					number: num,
					image: good.images,
					use_property: good.use_property,
					props_text: good.props_text,
					props: good.props
				})
			}
			console.log(this.cart)
		},
		handleReduceFromCart(item, good) {
			const index = this.cart.findIndex(item => item.id === good.goods_id)
			this.cart[index].number -= 1
			if(this.cart[index].number <= 0) {
				this.cart.splice(index, 1)
			}
		},
		showGoodDetailModal(item, good) {
			this.good = JSON.parse(JSON.stringify({...good, number: 1}))
			this.category = JSON.parse(JSON.stringify(item))
			this.goodDetailModalVisible = true
		},
		closeGoodDetailModal() { //关闭饮品详情模态框
			this.goodDetailModalVisible = false
			this.category = {}
			this.good = {}
		},
		changePropertyDefault(index, key) { //改变默认属性值
			this.good.property[index].values.forEach(value => this.$set(value, 'is_default', 0))
			this.good.property[index].values[key].is_default = 1
			this.good.number = 1
		},
		getGoodSelectedProps(good, type = 'text') {	//计算当前饮品所选属性
			if(good.use_property) {
				let props = []
				good.property.forEach(({values}) => {
					values.forEach(value => {
						if(value.is_default) {
							props.push(type === 'text' ? value.value : value.id)
						}
					})
				})
				return type === 'text' ? props.join('，') : props
			}
			return ''
		},
		handlePropertyAdd() {
			this.good.number += 1
		},
		handlePropertyReduce() {
			if(this.good.number === 1) return
			this.good.number -= 1
		},
		handleAddToCartInModal() {
			const product = Object.assign({}, this.good, {props_text: this.getGoodSelectedProps(this.good), props: this.getGoodSelectedProps(this.good, 'id')})
			this.handleAddToCart(this.category, product, this.good.number)
			this.closeGoodDetailModal()
		},
		openCartPopup() {	//打开/关闭购物车列表popup
			this.cartPopupVisible = !this.cartPopupVisible
		},
		handleCartClear() {	//清空购物车
		this.cartPopupVisible=false;
			uni.showModal({
				title: '提示',
				content: '确定清空购物车么',
				success: ({confirm}) =>  {
					if(confirm) {
						this.cartPopupVisible = false
						this.cart = []
					}
				}
			})
		},
		handleCartItemAdd(index) {
			this.cart[index].number += 1
		},
		handleCartItemReduce(index) {
			if(this.cart[index].number === 1) {
				this.cart.splice(index, 1)
			} else {
				this.cart[index].number -= 1
			}
			if(!this.cart.length) {
				this.cartPopupVisible = false
			}
		},
		toPay() {
			let cartnum=this.getCartGoodsNumber;
			if (cartnum==0){
				this.$u.toast("购物车还是空的哦");return;
			}
			uni.setStorageSync('cart', JSON.parse(JSON.stringify(this.cart)))
			  this.$Router.push({
				path: "/pages/shop/cart",
				query: { shop_id: this.shopinfo.shop_id}
			  });
		},
		setHeight() {
			let windowHeight = uni.getSystemInfoSync().windowHeight;//页面可见区域
			console.log("windowHeight = "+windowHeight)
			this.pageheight =windowHeight*2
				windowHeight = windowHeight - 44;//页面可见区域 - 在线购物条高度					
				console.log("windowHeight = "+windowHeight)
				// var query = uni.createSelectorQuery();
				// query.select('.content').boundingClientRect(rect => {
				// 	if (rect) {
				// 		console.log("view_head.height = "+rect.height)
				// 		this.height = windowHeight - rect.height;//页面可见区域 - 头部高度
				// 		console.log("this.height = "+this.height)
				// 	}
				// }).exec();				
			
		},
			
			
			
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}
				.dot {
					position: absolute;
					width: 34rpx;
					height: 34rpx;
					line-height: 34rpx;
					font-size: 22rpx;
					background-color: #FF9900;
					color: #ffffff;
					top: 16rpx;
					right: 10rpx;
					border-radius: 100%;
					text-align: center;
				}
	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
		position: relative;
	}

	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}

	.right-box {
		background-color: rgb(250, 250, 250);
	}

	.page-view {
		padding: 16rpx;
	}

	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.class-item:last-child {
		min-height: 100vh;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.item-menu-name {
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
	}

	.item-container {
		display: flex;
		flex-wrap: wrap;
	}

	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}
	@import '~@/pages/shop/menu.scss';
</style>
