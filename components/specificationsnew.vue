<template>
	<view class="content">

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="goodsInfoNew.litpic || goodsInfo.litpic"></image>
					<view class="right">
						<text class="price">¥{{ goodsInfoNew.spec_price || goodsInfo.users_price }}</text>
						<text class="stock">库存：{{ goodsInfoNew.spec_stock || goodsInfo.stock_count }}件</text>
						<view class="selected">
							<text>{{ skutitlename }}</text>
						</view>
					</view>
				</view>
				<view v-for="(ProductItem, n) in gspecList.spec_info_list" :key="n" class="attr-list">
					<text>{{ ProductItem.spec_name }}</text>  
					<view class="item-list">
						<text
							v-for="(oItem, index) in ProductItem.value"
							@click="specificationBtn(oItem.spec_value_id, n, index, oItem.isShow, ProductItem.spec_value_name)"
							:key="index"
							class="tit"
							:class="[oItem.isShow=== undefined || oItem.isShow ? '' : 'noneActive', subIndex[n] == index ? 'selected' : '']"
						>
							{{ oItem.spec_value_name }}
						</text>
					</view>
				</view>
<!-- 				
				
				<view v-for="(attrItem, mm) in attrList.attr" :key="attrItem.attr_id" class="attr-list">
					<text>{{ attrItem.attr_name }}</text>
					<view class="item-list"> 
						<text v-for="(oItemattr, index2) in attrItem.attr_item_array" :key="index2" class="tit" 
						:class="[subattrIndex[mm] == index2 ? 'selected' : '']"
						@click="attrificationBtn(oItemattr.itemid,mm,index2,attrItem.attr_name+':'+oItemattr.name)">
						{{ oItemattr.name }}
						</text>
					</view>
				</view> -->
				<button class="btn" @click="submitnew">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		gspecList:{
		},
		goodsInfo:{
			
		},
		attrList:{
			
		}
	},
	data() {
		return {
			specClass:'none',//规格弹窗是否显示
			goodsInfoNew: {},//当规格选择完成时重新覆盖商品信息
			skutitlename: '',//提示用户例如：请选择温度，口味；或者提示用户已选择温度，口味
			skutitlenamelist: [],//存储规格标题
			selectArr: [], //存放被选中的值
			shopItemInfo: {}, //存放要和选中的值进行匹配的数据
			subIndex: [], //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
			skuId:'',//规格id
			value_id:'',
			skuattrnamelist:[],
			shopattrInfo:{},
			subattrIndex:[],
			selectAttr:[],
			arr_id:'',
			arr_serialize:[],
			
		};
	},
	mounted() {
		var self = this;
		var skutitle = [];
		
		this.skuId=this.goodsInfo.spec_value_id

		//if (JSON.stringify(self.attrList)!='{}'){
		 
		//}

		if (JSON.stringify(self.gspecList)!='{}'){
			for (var i of self.gspecList.goods_spec) {
				self.shopItemInfo[i.spec_value_id] = i;
				//修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
			}
			for (var j of self.gspecList.spec_info_list) {
				self.skutitlenamelist.push(j.spec_name)
				//存储规格标题
			}
		}
		//console.log(self.shopItemInfo)
		self.checkItem();
	},
	methods: {
		// 选择规格
		specificationBtn: function(id, pindex, index, disable, pname) {
			var self = this;
			if (!disable) {
				return '';
			}
			
			if (self.selectArr[pindex] != id) {
				self.selectArr[pindex] = id;
				self.subIndex[pindex] = index;
				self.skutitlenamelist[pindex] = ''; //
			} else {
				self.selectArr[pindex] = '';
				self.subIndex[pindex] = -1; //去掉选中的颜色
				self.skutitlenamelist[pindex] = pname; //
			}
			self.checkItem();
		},
		attrificationBtn:function(id,pindex2,index2,pname){
			var self = this;
			if (self.selectAttr[pindex2] != id) {
				self.selectAttr[pindex2] = id;
				self.subattrIndex[pindex2] = index2;
				self.skuattrnamelist[pindex2] = pname; //
			} else {
				self.selectAttr[pindex2] = '';
				self.subattrIndex[pindex2] = -1; //去掉选中的颜色
				self.skuattrnamelist[pindex2] = ''; //
			}
			
			self.checkItem();
		},
		// 处理数据
		checkItem: function() {
			var self = this;

		if (JSON.stringify(self.gspecList)!='{}'){
			var option = self.gspecList.spec_info_list;
			var result = []; //定义数组存储被选中的值
			for (let i=0;i<option.length; i++) {
				result[i] = self.selectArr[i] ? self.selectArr[i] : '';
			}
			
			for (let i=0;i<option.length; i++) {
				var last = result[i]; //把选中的值存放到字符串last去
				for (var k=0;k<option[i].value.length;k++) {
					result[i] = option[i].value[k].spec_value_id; //赋值，存在直接覆盖，不存在往里面添加id值
					option[i].value[k].isShow = self.isMay(result); //在数据里面添加字段isShow来判断是否可以选择
				}
				result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
			}

			//重绘
			self.gspecList.spec_info_list = [];
			self.$set(self.gspecList, 'spec_info_list', option);
		}	
			
			
		// if (JSON.stringify(self.attrList)!='{}'){
		// 	var option2 = self.attrList.attr;
		// 	var result2 = []; //定义数组存储被选中的值
		// 	for (let i=0;i<option2.length; i++) {
		// 		result2[i] = self.selectAttr[i] ? self.selectAttr[i] : '';
		// 	}
			
		// 	for (let i=0;i<option2.length; i++) {
		// 		var last = result2[i]; //把选中的值存放到字符串last去
		// 		for (var k=0;k<option2[i].attr_item_array.length;k++) {
		// 			result2[i] = option2[i].attr_item_array[k].itemid; //赋值，存在直接覆盖，不存在往里面添加id值
		// 		}
		// 		result2[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
		// 	}
			
		// 	//重绘
		// 	self.attrList.attr = [];
		// 	self.$set(self.attrList, 'attr', option2);
		// }	
			
			self.getinfo(self.selectArr,self.selectAttr);

			
		},
		// 获取选择的值
		getinfo: function(item,item2) {

			//console.log(item2)
			var checked = item.join('_');
			
			if (this.shopItemInfo[checked]) {
				this.goodsInfoNew = this.shopItemInfo[checked];
				this.skutitlename=this.shopItemInfo[checked].specname;
				this.skuId=this.shopItemInfo[checked].spec_value_id;
				this.value_id=this.shopItemInfo[checked].value_id;
			} else {
				this.goodsInfoNew = {};
				var skutitle = [];
				for (var i = 0; i < this.skutitlenamelist.length; i++) {
					if (this.skutitlenamelist[i]) {
						skutitle.push(this.skutitlenamelist[i]);
					}
				}
				this.skutitlename = '' + skutitle.toString(',');
				//this.skuId='';
			}
			     this.arr_id='';this.arr_serialize="";
				for (var i = 0; i < item2.length; i++) {
					this.arr_id+=item2[i];
				}
				for (var i = 0; i < this.skuattrnamelist.length; i++) {
					if (this.skuattrnamelist[i]!='undefined'){
					this.arr_serialize+=this.skuattrnamelist[i]+';';
					}
				}

			
		},
		/**
		 * 判断库存是否为0
		 */
		isMay: function(result) {
			for (var i in result) {
				if (result[i] == '') {
					return true; //如果数组里有为空的值，那直接返回true
				}
			}
			result = result.join('_');
			if (!this.shopItemInfo[result]) {
				return false;
			}
			return this.shopItemInfo[result].spec_stock == 0 ? false : true; //匹配选中的数据的库存，若不为空返回true反之返回false
		},
         // 阻止默认事件
		stopPrevent() {},
		//规格弹窗开关
		toggleSpec() {
			if (this.specClass === 'show') {
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			} else if (this.specClass === 'none') {
				this.specClass = 'show';
			}
		},
		// 点击完成事件
		submitnew:function(){
			 if(this.skuId){
					this.specClass = 'none'; 
					// uni.showToast({
					// 	title:`规格id为${this.skuId}`,
					// 	mask: false,
					// 	duration: 1500
					// });
				        let rdata = {  
				          specid: this.skuId,
						  value_id:this.value_id,
						  specname: this.skutitlename,
						  arr_id:this.arr_id,
						  arr_serialize:this.arr_serialize
				        }; 
					this.$emit('submitSukid',rdata)
			 }else{
				 uni.showToast({
				 	title: '请选择规格',
				 	mask: false,
				 	duration: 1500
				 });
			 }
		}
	}
};
</script>

<style lang="scss">
/* 规格选择弹窗 */
.attr-content {
	padding: 10upx 30upx;
	.a-t {
		display: flex;
		image {
			width: 170upx;
			height: 170upx;
			flex-shrink: 0;
			margin-top: -40upx;
			border-radius: 8upx;
		}
		.right {
			display: flex;
			flex-direction: column;
			padding-left: 24upx;
			line-height: 42upx;
			.price {
				color: $uni-color-primary;
				margin-bottom: 10upx;
			}
			.selected-text {
				margin-right: 10upx;
			}
		}
	}
	.attr-list {
		display: flex;
		flex-direction: column;
		padding-top: 30upx;
		padding-left: 10upx;
	}
	.item-list {
		padding: 20upx 0 0;
		display: flex;
		flex-wrap: wrap;
		text {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #eee;
			margin-right: 20upx;
			margin-bottom: 20upx;
			border-radius: 100upx;
			min-width: 60upx;
			height: 60upx;
			padding: 0 20upx;
			color: $uni-text-color;
		}
		.selected {
			background: #fbebee;
			color: $uni-color-primary;
		}
		.noneActive {
			color: $uni-color-primary;
			background-color: rgba(0, 0, 0, 0.4);
		}
	}
}

/*  弹出层 */
.popup {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 99;

	&.show {
		display: block;
		.mask {
			animation: showPopup 0.2s linear both;
		}
		.layer {
			animation: showLayer 0.2s linear both;
		}
	}
	&.hide {
		.mask {
			animation: hidePopup 0.2s linear both;
		}
		.layer {
			animation: hideLayer 0.2s linear both;
		}
	}
	&.none {
		display: none;
	}
	.mask {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		min-height: 40vh;
		border-radius: 10upx 10upx 0 0;
		background-color: #fff;
		.btn {
			height: 66upx;
			line-height: 66upx;
			border-radius: 100upx;
			width: 80%;
			box-sizing: border-box;
			background: $uni-color-primary;
			color: #fff;
			margin: 30upx auto 20upx;
		}
	}
	@keyframes showPopup {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes hidePopup {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes showLayer {
		0% {
			transform: translateY(120%);
		}
		100% {
			transform: translateY(0%);
		}
	}
	@keyframes hideLayer {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(120%);
		}
	}
}
</style>
