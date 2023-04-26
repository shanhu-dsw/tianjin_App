<template style="background-color: #007AFF;">
	<view class="container sv" :style="{height:navHeight+'px'}">
		<view class="page-top">
			<image class="logo-style" src="/static/images/logo.png">
			</image>
			<view class="page-title">
				津北公安E监督
			</view>
		</view>


		<view class="body-container">
			<view class="input-container">
				<view class="input-icon">
					<image src="../../../static/icon/Union.png" mode="" style="width: 25px;height: 25px;"></image>
				</view>
				<input class="input-style" focus placeholder="用户名" v-model="user.name"
					style="padding-left: 55px;"></input>
			</view>

			<view class="input-container">

				<view class="input-icon">
					<image src="../../../static/icon/Union1.png" mode="" style="width: 25px;height: 25px;"></image>
				</view>
				<input class="input-style" password type="text" placeholder="密码" v-model="user.password"
					style="padding-left: 55px;" />
			</view>

			<checkbox-group @change="checkboxChange">
				<checkbox value="cb" :checked="checked" style="position: absolute; right: 45px;">记住</checkbox>
			</checkbox-group>
			<view class="button-container">
				<button class="button-style" @click="onLogin()">登录</button>
			</view>
			<view class="page-bottom">
				天津市公安局河北分局
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapActions,
		mapState
	} from 'vuex';
	import CONFIG from "../../../config/config.js"
	// import eruda from "../../../debug/eruda.js"
	export default {
		data() {
			return {
				user: {
					name: '',
					password: ''
				},
				checked: false, //是否记住密码
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度
			}
		},
		computed: mapState({
			stateUser: state => state.user
		}),
		methods: {
			...mapActions(['login']),
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
				// eruda.init()

				//如果上传登录选择了记住密码，那就自动填入账号密码
				if (uni.getStorageSync('user')) {
					this.user.name = uni.getStorageSync('user')[0]
					this.user.password = uni.getStorageSync('user')[1]
					this.checked = true
				}
			},
			//点击记住框后改变选择状态
			checkboxChange(e) {
				this.checked = !this.checked
			},
			onLogin() {
				this.login(this.user).then(() => {
					if (this.checked == true) {
						//选择记住密码后，把当前输入用户名和密码存入本地存储
						uni.setStorage({
							key: 'user', //本地缓存中的指定的 key
							data: [this.user.name, this.user.password]
						})
					} else {
						//没选择记住密码，清空当前存储的用户名和密码
						uni.removeStorageSync('user');
					}
					//刷新token
					this.refreshAdminToken().then((response) => {})
				}).catch((e) => {
					console.log(e)
					uni.showToast({
						title: "登录失败",
						icon: "none"
					})
				});
			},
			onLogin_app() {
				console.log("abc")
				// uni.close()
				// history.replaceState(null, null, location.href);
				// plus.runtime.quit()
				// uni.navigateBack({
				//   delta: 0
				// });
				// history.pushState(null, null, location.href);
				// location.replace(location.href);
			}
		}
	}
</script>
<style>
	.container {
		background-color: #F5F5F5 !important;
		position: relative;
	}

	.page-top {
		background-color: #2057b5;
		height: 30%;
		border-bottom-right-radius: 15%;
		border-bottom-left-radius: 15%;
	}

	.page-title {
		text-align: center;
		height: 50px;
		font-size: 40px;
		color: #FFFFFF;
	}

	.logo-style {
		width: 70px;
		height: 70px;
		padding-top: 8%;
		position: relative;
		left: calc(50% - 35px);
	}

	.input-container {
		/* display: flex; */
		position: relative;
		margin: 15px auto;
	}

	.input-icon {
		background-color: #2057b5;
		width: 50px;
		height: 50px;
		line-height: 60px;
		text-align: center;
		border-radius: 10px;
		margin-top: 5px;
		position: absolute;
		top: -5px;
		left: 0px;
	}

	.input-style {
		background-color: #F1F1F1;
		border-radius: 10px;
		padding: 10px;
		height: 1.8em;

	}

	.body-container {
		padding: 25% 10% 0 10%;
	}

	.button-container {
		margin-top: 30%;

	}

	.button-style {
		background-color: #2057b5;
		color: #FFFF;
	}

	.page-bottom {
		position: fixed;
		/* bottom: 10%; */
		left: 30%;
		margin-top: 10px
	}
</style>
