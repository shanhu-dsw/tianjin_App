<template>
	<view class="container sv" :style="{height:navHeight+'px'}">
		<view class="page-top">
			<image src="../../static/logo.png" mode="" class="page-title-img"></image>
			<h1 class="page-title-name">津北公安
				<p>E监督</p>
			</h1>
		</view>
		<view class="page-container-top" v-show="page_container">
			<view class="page_icon_one" @click="change_icon_1" v-show="addproblem_show">
				<image src="../../static/icon/icon2.png" class="page-container-img-1" mode=""></image>
				<view class="page-problem">录入问题</view>
				<text class="segmentation">──────────────</text>
				<text class="page-probelm-num">手工录入问题，进行上报</text>
			</view>
			<view class="page_icon_two" @click="change_icon_2">
				<image src="../../static/icon/icon3.png" class="page-container-img-1" mode=""></image>
				<view class="page-problem">情况反馈</view>
				<text class="segmentation">──────────────</text>
				<text class="page-probelm-num">对问题进行反馈</text>
			</view>
			<view class="page_icon_three" @click="change_icon_4">
				<image src="../../static/icon/icon9.png" class="page-container-img-1" mode=""></image>
				<view class="page-problem">问题列表</view>
				<text class="segmentation">──────────────</text>
				<text class="page-probelm-num">现场督察问题查看</text>
			</view>
			<view class="page_icon_foure" @click="change_icon_3">
				<image src="../../static/icon/icon5.png" class="page-container-img-1" mode=""></image>
				<view class="page-problem">统计信息</view>
				<text class="segmentation">──────────────</text>
				<text class="page-probelm-num">查看统计数据</text>
			</view>
		</view>
		<view class="page-bottom">
			天津市公安局河北分局
		</view>
	</view>
	
</template>

<script>
	// import { response } from 'express
	import moment from 'moment';
	import getRole from '../../Role_judgment/Role_judgment.js'
	import {
		mapActions,
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				page_container: true,
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度
				Message_num:"",
				addproblem_show:true //是否隐藏录入问题模块
			}
		},
		computed: mapState({
			stateUser: state => state.user,
			statelocation: state => state.locations,
		}),
		methods: {
			...mapActions(['refreshAdminToken']),
			onReady() {
				let that = this;
				uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
					success(res) { //成功回调函数
						that._data.pH = res.windowHeight //windoHeight为窗口高度，主要使用的是这个
						let titleH = uni.createSelectorQuery().select(".sv"); //想要获取高度的元素名（class/id）
						titleH.boundingClientRect(data => {
							let pH = that._data.pH;
							that._data.navHeight = pH - data.top //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
						}).exec()
					}
				})
			},
			onShow() {
				//获取消息数量
				this.$api.getMessage.post({
					"Account-Token": this.statelocation.token,
					"to_uuid":this.stateUser.uuid,
					"read":"UN_READ",
					"offset":0,
					"rows":999
				}).then((response)=>{
					var number = response.content.count.toString()
					
					if(number == 0){
						uni.removeTabBarBadge({ //隐藏数字标
							index: 2 //tabbar下标
						})
					}else{
					uni.setTabBarBadge({ //tabBar右上角添加文本
					    index: 2, //tabBar下标（底部tabBar的位置，从0开始）
					    text: number  //显示的内容,必须为字符串可通过JSON.toString()将number转为字符串
					})
					}
				})
				// if(this.stateUser.admin_info[0].role_name == "department_leader"){
				// 	this.addproblem_show = false
				// }
				if(!getRole(this.stateUser.admin_info[0].role_name).is_problem_create){
				//如果登录账号没有录入问题权限就隐藏
						this.addproblem_show = false
				}else{
					this.addproblem_show = true
				}
			},
			change_icon_1() {
				uni.reLaunch({
					url: '../problems/new/new'
				})
			},
			change_icon_2() {
				uni.reLaunch({
					url: '../problems/list_unfeeback/index'
				})
			},
			change_icon_3() {
				uni.reLaunch({
					url: '../index/index'
				})
			},
			change_icon_4() {
				uni.reLaunch({
					url: '../problems/list_All/index'
				})
			},
		}
	}
</script>

<style>
	/* body {
		background-color: #F1F1F1!important;
		}
	} */

	.uni-app--showtabbar .uni-app--maxwidth{
		background-color: #F1F1F1!important;
	}
	
	.page-top {
		height: 25%;
		 background-color : linear-gradient(#2057b5, #45a1ec);
		background-color: #2057b5;
		border-bottom-right-radius: 15%;
		border-bottom-left-radius: 15%;
		color: #fff;
		text-align: center;
		/* font-size: 12px; */
		position: relative;
		/* opacity: 0.5; */
	}

	/* .page-title{
	width: 420px;
	height: 170px;
	/* background-image: url(/static/img/logo.597f1258.png); */
	/* 	background-size: 50% 100%;
	background-repeat: no-repeat; */
	/* opacity: 0.5; */
	/* background-position: center; */
	/* display: flex;
	justify-content: center;
	align-items: center; */
	/* position: relative;
	text-align: center; */
	/* line-height: 100%; */
	/* } */

	@media only screen and (min-width: 10px) and (max-width: 352px) {
		.page-top {
			font-size: 14px;
		}
	}

	@media only screen and (min-width: 352px) and (max-width: 640px) {
		.page-top {
			font-size: 16px;
		}

		.page-container-top {
			margin-top: 5%;
		}
	}

	@media only screen and (min-width: 640px) and (max-width: 750px) {
		.page-top {
			font-size: 18px;
		}
	}

	@media only screen and (min-width: 750px) {
		.page-top {
			font-size: 20px;
		}
	}



	.page-title-img {
		height: 100%;
		width: 150px;
		opacity: 0.5;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%)
			/* margin: auto;  position: absolute;  top: 0;  left: 0;  right: 0;  bottom: 0; */
	}

	.page-title-name {
		/* font-size: 20px; */
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/* margin: auto;  position: absolute;  top: 0;  left: 0;  right: 0;  bottom: 0; */
	}

	.page-container-icon {
		/* line-height: 50px; */
	}

	.page-container-top {
		width: 100%;
		height: 70%;
		margin-left: 10%;
		display: flex;
		flex-direction:column;
		justify-content: space-around;
		/* justify-content: center; */
		margin-top: 2%;
		/* margin-left: 10px; */
		/* border-radius: 30%; */
	}

	.page_icon_one {
		width: 80%;
		height: 80px;
		position: relative;
		background-color: #00db96;
		color: #F8F8FF;
		border-radius: 10px;
		/* margin-top: 6%; */
	}

	.page_icon_none {
		display: none;
	}

	.page-container-img-1 {

		width: 55px;
		height: 55px;
		/* line-height: 100px; */
		margin-top: 15px;
		margin-left: 15px;
	}

	.page-problem {
		font-size: 20px;
		position: absolute;
		top: 10px;
		left: 30%;
	}

	.segmentation {
		position: absolute;
		top: 36px;
		left: 85px;
		font-size: 16px;
		/* font-size: 200px; */
	}

	.page-probelm-num {
		font-size: 12px;
		position: absolute;
		bottom: 12px;
		left: 90px;
	}

	.page_icon_two {
		/* margin-top: 6%; */
		/* margin-top: 6%; */
		width: 80%;
		color: #F8F8FF;
		height: 80px;
		position: relative;
		background-color: #ffc200;
		border-radius: 10px;
	}

	.page_icon_three {
		position: relative;
		/* margin-top: 6%; */
		/* margin-top: 6%; */
		color: #F8F8FF;
		width: 80%;
		background-color: #009cff;
		height: 80px;
		border-radius: 10px;
	}
	.page_icon_foure{
		position: relative;
		/* margin-top: 6%; */
		/* margin-top: 6%; */
		color: #F8F8FF;
		width: 80%;
		height: 80px;
		background-color: #ff4257;
		border-radius: 10px;
	}
	.page-container-buttom {
		width: 20%;
		height: 100px;
		background-color: #fff;
		margin-top: 50px;
		margin-left: 10px;
		border-radius: 35%;
		text-align: center;
		line-height: 100px;
	}

	.page-bottom {
		position: absolute;
		bottom: 2%;
		left: 30%;
	}
</style>
