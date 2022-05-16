<template>
	<view>

		<u-gap height="10"></u-gap>
		
		<view class="u-p-t-10" v-if="shelvesList.length == 0">
			小区管家还没有完成本小区的基础设置哦
		</view>
		<u-tabs
		name="shelfname"
	    :list="shelvesList"
		:is-scroll="true"
		:show-bar="false"
		:current="currentshelves"
		 @change="shelvesChange"
		 :active-item-style="tabcss"
		 :bar-style="bartype"
		 duration="0"
		 active-color="#cd5e3c" inactive-color="#425066"
		 style="width: 100%;"
		 ></u-tabs>
		 
		 <u-gap height="8"></u-gap>
		<u-tabs
		name="rowid"
	    :list="rowsList"
		:is-scroll="true"
		:show-bar="false"
		:bar-style="bartype"
		:height="40"
		:current="currentrows"
		@change="rowsChange"
		 duration="0"
		 active-color="#cd5e3c" inactive-color="#425066"
		 ></u-tabs>
		<u-gap height="10"></u-gap>
		<view>

<!-- 			<u-radio-group @change="checkboxGroupChange" max="1" size="32" icon-size="32" shape="circle" style="width: 100%;">
				<u-row gutter="0" justify="start" style="width: 100%;">
					<u-col span="3" text-align="center" v-for="(item,index) in colList" :key="index">
						 <view class="bg-purple u-margin-6 u-padding-6"
						 :class="item.packagecount>0?'havenumber':''">
						<u-radio
						 :name="item.areacode+'_'+item.rowid+'_'+item.colid"
						 v-model="item.checked">
							<view class="have u-font-xs" style="line-height: 88rpx;">{{currentrows+1}}_{{item.colid}}</view>
						</u-radio>
						</view>
					</u-col>
				</u-row>
			</u-radio-group> -->
			<scroll-view scroll-y="true" style="height: 300rpx;">
				<u-row gutter="0" justify="start" style="width: 100%;">
					<u-col span="6" text-align="center" v-for="(item,index) in colList" :key="index">
						 <view class="bg-purple u-margin-6 u-padding-6"
						 :class="item.packagecount>0?'havenumber':''" @click="specificationBtn(item,index)">
							<view class="have u-font-xs" :class="currentIndex== index?'active':''" style="line-height: 60rpx;">
								<span v-if="item.aliasname==''||item.aliasname==null">{{item.areacode}}{{currentrows+1}}楼{{item.colid}}房</span>
								<span class="u-type-warning-dark" v-else>{{item.aliasname}}</span>
							</view>
						</view>
					</u-col>
				</u-row>
			</scroll-view>

			
			
		</view>

	</view>
</template>

<script>
    import {mapState,mapMutations} from 'vuex';
	export default {
		props: {

		},
		data() {
			return {
			currentIndex:'',
			  tabcss:{
				background:'#cd5e3c',
				borderRadius:'10rpx',
				color:'#ffffff'
			  },
			  bartype:{
				marginBottom:'0rpx',
				background:'#ffffff'
			  },
				shelvesList: [],
				currentshelves: 0,
				rowsList:[],
				currentrows:0,
				shelf_id:'',
				colList:[],
				result: [],
			};
		},
		created() {
			let shelf_id=uni.getStorageSync('shelf_id');
			if (shelf_id){
				this.shelf_id=shelf_id
			}
			uni.setStorageSync('exeone', true);
			setTimeout(() => {
				this.getshelflist();
			}, 10);
			
			console.log(this.shelvesList)

				
		},
		computed: {
		...mapState(["user"]),
		},
		onLoad(){

		},
		methods:{
		// 选中某个复选框时，由checkbox时触发
		checkboxChange(e) {
			//console.log(e)
		},
		// 选中任一checkbox时，由checkbox-group触发
		checkboxGroupChange(e) {
			this.$emit('eventChange',e );	
				//this.result.join(",");
				//this.$emit('eventChange',this.result.join(",") );	
	
		},
		changegrid(data){
			this.$emit('eventChange',data );	
		},
		specificationBtn(item,index){
			if (index==this.currentIndex){
				this.currentIndex=''
			}else{
				this.currentIndex= index
			}
			this.$emit('eventChange',item);
		},
		shelvesChange(index) {
			this.currentshelves = index;
			this.currentrows=0; //选择后将第二个归置在第一
			this.shelf_id=this.shelvesList[index].shelf_id
			uni.setStorageSync('currentshelves', this.currentshelves);
			uni.setStorageSync('shelf_id', this.shelf_id);
			uni.setStorageSync('currentrows', this.currentrows);
			uni.setStorageSync('exeone', true);
			this.getshelflist()
		},
		rowsChange(index){
			this.currentrows = index;
			uni.setStorageSync('currentrows', index);
			uni.setStorageSync('exeone', true);
			this.getshelflist()
		},
		getshelflist(){
			let exeone=uni.getStorageSync('exeone');
			//if (exeone==true){
				
			this.$api("shelf.shelflist", {
				wareroomid:this.user.wareroomid,
				shelf_id:this.shelf_id,
				currentshelves:this.currentshelves,
				currentrows:uni.getStorageSync('currentrows')
			}).then((res) => {
				console.log(res)
				if (res.code == 200) {
				  this.shelvesList = res.data.list;
				  this.rowsList=res.data.currentrow;
				  this.colList=res.data.currentcol;
				  
					let shelf=uni.getStorageSync('currentshelves');
					if (shelf){
						this.currentshelves=shelf
					}
					let rows=uni.getStorageSync('currentrows');
					if (rows>0){
						this.currentrows=rows
					}
	
				}
				this.loadstatus = false;
			  }).catch((e) => {});
			  uni.setStorageSync('exeone', false);
			//}
		}
		}
	}
</script>

<style lang="scss">
	.bg-purple {
		background: #d3dce6;
		border-radius: 10rpx;
		height: 72rpx;
		text-align: center;
			&.havenumber{
				background: #eb6101;
				.have{
					color: #FFFFFF;
				}
			}
		}
	.active{
		background: #007AFF;
	}
</style>
