<template>
	<view class="" style="background-color: #F1F1F1;">
		<view class="page-top">
			<view class="container-go-back" @click="backhome" hover-class="other-navigator-hover">
				<uni-icons type="back" size="30" style="color: #FFF;position: absolute;left: 17px;top: 45px;">
				</uni-icons>
			</view>
			<h3 class="title">个人中心</h3>
		</view>
		<view class="container">


			<view>
				<scroll-view scroll-y="true" class="sv" :style="{height:navHeight+'px'}">
					<view class="admin-info-container">
						<view style="display: flex;">
							<image class="portrait-image" src="/static/images/logo.png">
							</image>
							<view class="info-text-container">
								<view class="info-text">姓名：{{real_name}}</view>
								<view class="info-text">警号：{{username}}</view>
								<view class="info-text">单位：{{location}}</view>
								<view class="info-text">登录：{{login_time}}</view>
							</view>
						</view>
						<view style="display: flex;">
							<!-- <view class="info-icon">
								积分{{score}}分
							</view> -->
							<view class="info-icon">
								<!-- <u-icon name="photo" size="35" style="margin-left: 37%;margin-bottom: 5px;margin-top: 5px;"></u-icon> -->
								<view class="">

									<uni-icons type="contact" size="45"></uni-icons>
								</view>
								登录{{login_number}}次
							</view>
							<view class="info-icon">
								<view class="">

									<uni-icons type="plus-filled" size="45"></uni-icons>
								</view>
								<!-- <uni-icons type="contact" size="35" style="margin-left: 37%;margin-bottom: 5px;margin-top: 5px;"></uni-icons> -->
								录入{{frome_number}}次
							</view>
							<view class="info-icon">
								<!-- <u-icon name="edit-pen-fill" size="35" style="margin-left: 37%;margin-bottom: 5px;margin-top: 5px;	"></u-icon> -->
								<view class="">
									<uni-icons type="compose" size="45" @click="post_eruda"></uni-icons>
								</view>
								反馈{{Feedback_num}}次
							</view>
						</view>
					</view>

					<view class="admin-info-container">

						<view class="info-container" style="padding-bottom: 10px; border-bottom: 1px solid #e3e3e3;"
							@click="modifyPassword">
							<text class="info-title">修改密码</text>
							<uni-icons type="right" size="20" style="position: absolute; right: 50px;">
							</uni-icons>

						</view>
						<!-- <view class="info-container" style="margin-top: 20px!important;">
							<text class="info-title">使用帮助</text>
							<uni-icons type="right" size="20" style="position: absolute; right: 50px;">
							</uni-icons>
						</view> -->
						<view class="info-container"
							style="margin-top: 10px!important;border-bottom: 1px solid #e3e3e3;padding-bottom: 10px;"
							@click="message_contact">
							<text class="info-title">联系管理员</text>
							<uni-icons type="right" size="20" style="position: absolute; right: 50px;">
							</uni-icons>
						</view>
						<view class="info-container"
							style="margin-top: 10px!important;border-bottom: 1px solid #e3e3e3;padding-bottom: 10px;"
							@click="onLogout">
							<text class="info-title">退出登录</text>
							<uni-icons type="right" size="20" style="position: absolute; right: 50px;">
							</uni-icons>
						</view>
						<view class="info-container"
							style="margin-top: 10px!important;border-bottom: 1px solid #e3e3e3;padding-bottom: 10px;"
							@click="onLogout_app">
							<text class="info-title">退出APP</text>
							<uni-icons type="right" size="20" style="position: absolute; right: 50px;">
							</uni-icons>
						</view>
					</view>
					<u-popup :show="show" @close="close" @open="open" :closeable="false">
						<view class="info-container" style="justify-content: center;">
							<view class="uni-list-cell-left">
								修改密码
							</view>

						</view>
						<view class="info-container" style="line-height:40px ;flex:1">
							<text style="color: red;">*</text>
							<text>
								旧密码：
							</text>
							<input class="uni-list-cell-picker" type="text" placeholder="" v-model="old_password">
							</input>
						</view>
						<view class="info-container" style="line-height:30px ;flex:1">
							<text style="color: red;">*</text>
							<text>
								新密码：
							</text>
							<input class="uni-list-cell-picker" type="text" placeholder="" v-model="new_password">
							</input>
						</view>
						<view class="info-container">
							<button class="bottom-btn-style" @click="PostPassword()">提交修改</button>
						</view>
					</u-popup>
					<u-popup :show="show2" @close="close2" @open="open2" :closeable="false">
						<view class="info-container" style="justify-content: center;">
							<view class="uni-list-cell-left">
								联系管理员
							</view>

						</view>
						<view class="info-container" style="line-height:40px ;flex:1">
							<text>
								通知接收人：
							</text>
							<u-tag text="系统管理员" type="success" plain style="margin-top: 5px;"></u-tag>

						</view>
						<view class="info-container">
							<text style="color: red;">*</text>
							消息内容：
						</view>
						<view class="info-container">
							<textarea class="uni-list-cell-textarea" placeholder="请输入备注信息" v-model="message_content" />
						</view>
						<view class="info-container">
							<button class="bottom-btn-style" @click="Postmessage()">发送消息</button>
						</view>
					</u-popup>
				</scroll-view>
			</view>
		</view>
	</view>


</template>
<script>
	import moment from 'moment';
	import eruda from "../../../debug/eruda.js"
	import {
		mapActions,
		mapState
	} from 'vuex';
	// import uni from "uni-app";
	export default {
		data() {
			return {
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度	
				location: "",
				real_name: "",
				username: "",
				login_time: "",
				score: "",
				show: false, //控制修改密码弹出框
				show2: false, //控制联系管理员弹出框
				login_number: "",
				frome_number: "",
				eruda_number: 0,
				Feedback_num: "",
				old_password: "",
				new_password: "",
				message_content: ""
			}
		},
		computed: mapState({
			stateUser: state => state.user,
			statelocation: state => state.locations
		}),
		methods: {
			...mapActions(['logout']),
			backhome() {
				uni.reLaunch({
					url: "/pages/dashboard/index"
				})
			},
			onReady() {
				let that = this;
				uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
					success(res) { //成功回调函数
						that._data.pH = res.windowHeight //windoHeight为窗口高度，主要使用的是这个
						let titleH = uni.createSelectorQuery().select(".sv"); //想要获取高度的元素名（class/id）
						titleH.boundingClientRect(data => {
							let pH = that._data.pH;
							that._data.navHeight = pH - data.top - 10 //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
						}).exec()
					}
				})
			},
			onShow() {
				//获取消息数量
				this.$api.getMessage.post({
					"Account-Token": this.statelocation.token,
					"to_uuid": this.stateUser.uuid,
					"read": "UN_READ",
					"offset": 0,
					"rows": 999
				}).then((response) => {
					var number = response.content.count.toString()
					if (number == 0) {
						uni.removeTabBarBadge({ //隐藏数字标
							index: 2 //tabbar下标
						})
					} else {
						uni.setTabBarBadge({ //tabBar右上角添加文本
							index: 2, //tabBar下标（底部tabBar的位置，从0开始）
							text: number //显示的内容,必须为字符串可通过JSON.toString()将number转为字符串
						})
					}
				})
				console.log(this.stateUser.admin_info[0])
				this.real_name = this.stateUser.admin_info[0].real_name //登录账号的姓名
				this.username = this.stateUser.name //登录账号的用户名（警号）
				this.location = this.stateUser.admin_info[0].full_name //登录账号所在的单位
				//this.score = this.stateUser.admin_info[0].score //登录账号的积分数

				//登录登出情况
				this.$api.getLogonLogoffInfo.post({
					"Account-Token": this.statelocation.token,
					"name": this.stateUser.name,
					"type": "LOGIN",
					"offset": 0,
					"rows": 10
				}).then(response => {
					this.login_time = response.content.array[0].create_datetime //最近一次登录时间
					this.login_number = response.content.count //登录总次数
				})

				//获取我录入的问题
				this.$api.getProblem.post({
					"Account-Token": this.statelocation.token,
					"from_uuid": this.stateUser.uuid,
					"offset": 0,
					"rows": 10
				}).then(response => {
					this.frome_number = response.content.count //我录入的问题数量
				})

				//获取我反馈的问题数量
				this.$api.getFeedback.post({
					"Account-Token": this.statelocation.token,
					"from_uuid": this.stateUser.uuid,
					"offset": 0,
					"rows": 10
				}).then(response => {
					this.Feedback_num = response.content.count //我反馈的问题
				})
			},
			//控制调试工具的隐藏和显示
			post_eruda() {
				this.eruda_number += 1
				if (this.eruda_number >= 5) {
					//点击超过三次显示调试工具
					eruda.init()
				}
			},
			//退出登录
			onLogout() {
				this.logout();
			},
			//退出app
			onLogout_app() {
				console.log(window.location.href);
				window.location.href = "./static/logout/logout.html";
			},
			//点击显示修改密码弹出框
			modifyPassword() {
				this.show = true
			},
			open() {

			},
			open2() {

			},
			close() {
				this.show = false
			},
			close2() {
				this.show2 = false
			},
			//修改密码
			PostPassword() {
				this.$api.modifyAdminPasswordOfSelf.post({
					"Account-Token": this.statelocation.token,
					"old_password": this.old_password,
					"new_password": this.new_password
				}).then(response => {
					if (response.status == "SUCCESS") {
						uni.showToast({
							title: "修改成功"
						})
						this.show = false
					} else {
						if (response.attach == "参数old_password不允许为空") {
							uni.showToast({
								title: "旧密码不允许为空",
								icon: "none"
							})
						} else if (response.attach == "参数new_password不允许为空") {
							uni.showToast({
								title: "新密码不允许为空",
								icon: "none"
							})
						} else {
							uni.showToast({
								title: response.attach,
								icon: "none"
							})
						}
					}
				})
			},
			//显示联系管理员弹出框
			message_contact() {
				this.show2 = true
			},
			//发送消息给超级管理员
			Postmessage() {
				this.$api.addMessage.post({
					"Account-Token": this.statelocation.token,
					"from_uuid": this.stateUser.uuid,
					// "to_uuid" : data.uuid,
					"role_name": "superadmin",
					"content": this.message_content,
					"title": "个人发送问题"
				}).then(response => {
					if (response.status == "SUCCESS") {
						uni.showToast({
							title: "发送成功"
						})
						this.show2 = false
					} else {
						if (response.attach == "参数content不允许为空") {
							uni.showToast({
								title: "消息内容不能为空",
								icon: "none"
							})
						} else {
							uni.showToast({
								title: "发送失败",
								icon: "none"
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		overflow: hidden;
		padding: 0 15px;
		background-color: #F1F1F1;
	}

	.title-container {
		position: relative;
	}

	.title {
		font-size: 24px;
		font-weight: 300;
	}


	.sv {
		margin-top: 10px;
	}

	.admin-info-container {
		border-radius: 15px;
		background-color: #FFFFFF;
		margin-bottom: 15px;
		padding: 10px 10px;
	}

	.log-out-text {
		color: #747474;
		position: absolute;
		top: 8px;
		right: 3px;
	}

	.info-icon {
		width: 25%;
		flex: 1;
		font-size: 15px;
		text-align: center;
		margin-top: 5px;
	}

	.portrait-image {
		height: 60px;
		width: 60px;
		padding: 5px;
		flex-shrink: 0;
		border-radius: 10px;
	}

	.info-text-container {
		margin-left: 15px;
	}

	.info-text {
		font-size: 14px;
		/* height: 25px;
		line-height: 25px; */
		margin-top: 5px;
	}

	/* .info-text2 {
		font-size: 13px;
		height: 30px;
		line-height: 30px;
	} */

	.info-container {
		display: flex;
		margin: 10px;
		/* padding-bottom: 10px;
		    border-bottom: 1px solid #999; */
	}

	.info-title {
		width: 80px !important;
		font-size: 14px;
		text-align: justify;
		text-align-last: justify;
		color: #686666;
		font-weight: 300;
	}

	.admin-info-text {
		width: 100%;
		margin-left: 30px;
		font-size: 14px;
	}

	.uni-list-cell-picker {
		color: #8F8F94;
		border: 1px solid #1E90FF;
		height: 30px;
		line-height: 30px;
		margin-top: 5px;
		padding-left: 10px;
		border-radius: 12px;
		flex: 3;
	}

	.page-top {
		height: 120px;
		width: 100%;
		padding: 0, 0 !important;
		background-color: #2057b5;
		border-bottom-right-radius: 15%;
		border-bottom-left-radius: 15%;
		/* margin-bottom: 35px; */
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center
	}

	.bottom-btn-style {
		margin-top: 20px;
		background-color: #2057b5;
		color: #FFFFFF;
		padding: 0 10px;
		height: 35px;
		line-height: 35px;
		border-radius: 5px;
		font-size: 21px;
		padding: 0 10px;
		width: 205px;
	}

	.uni-list-cell-textarea {
		background-color: #F8F8F8;
		height: 80px;
		padding: 5px;
		margin: auto;
		color: #8F8F94;
		width: 100%;
		letter-spacing: 0.5px;
		font-size: 14px;
		border: 1px solid #1E90FF;
	}
</style>
