<template>
	<view style="background-color: #F1F1F1;">
		<view class="page-top">
			<view class="container-go-back" @click="backhome" hover-class="other-navigator-hover">
				<uni-icons type="back" size="30" style="color: #FFF;position: absolute;left: 17px;top: 45px;">
				</uni-icons>
			</view>
			<h3 class="title">消息通知</h3>
		</view>
		<view class="container">
			<view class="problem-scroll-container">
				<u-subsection mode="subsection" :list="list" :current="current" @change="sectionChange"
					activeColor="#2057B8" fontSize="14"
					style="padding-left:10px;padding-right: 5px; flex: 1;margin-bottom: 5px">
				</u-subsection>
				<scroll-view scroll-y="true" class="sv" :style="{height:navHeight+'px'}" @scrolltolower="lower">

					<navigator :url="'./show?id=' + message.remark +'&message_uuid=' + message.uuid "
						hover-class="other-navigator-hover" class="problem-card" :key="index" open-type="reLaunch"
						v-for="(message, index) in messages">
						<uni-icons type="mail-open" size="30" style="margin-left:5px;" v-if="message.is_read == 'READ'">
						</uni-icons>
						<uni-icons type="email" size="30" color="#ff8232" style="margin-left:5px;" v-else>
						</uni-icons>
						<view class="" style="color: #46817b;text-align: center;font-size: 15px;margin-top: 10px;">
							{{message.content}}
						</view>
						<navigator :url="'./show?id=' + message.remark +'&message_uuid=' + message.uuid "
							hover-class="other-navigator-hover" open-type="reLaunch">
							<view class="navshow">查看问题详情
								<uni-icons type="arrow-right" size="25" color="#999" style="margin-top: 5px;">
								</uni-icons>
							</view>
						</navigator>
						<view
							style="display: flex;justify-content: space-between;font-size: 14px;color: #666;margin-top: 10px;">
							<view class="" style="margin-left: 15px;margin-bottom: 10px;">
								<uni-icons type="staff" size="20"></uni-icons>
								{{message.from_uuid_info ? message.from_uuid_info.real_name : "系统自动发送"}}{{message.from_uuid_info ? "-" + message.from_uuid_info.name : ""}}
							</view>
							<view style="margin-right: 15px; margin-bottom: 10px;" class="">
								<uni-icons type="calendar" size="20"></uni-icons>
								{{message.create_datetime}}
							</view>
						</view>

					</navigator>
				</scroll-view>
			</view>
			<!-- <view class="page-size">
				<uni-pagination :total="50" title="标题文字" />
			</view> -->
		</view>
	</view>

</template>

<script>
	import moment from 'moment';
	import {
		mapActions,
		mapState
	} from 'vuex';
	import CONFIG from '../../../config/config';
	import ReplaceRealUrl from "../../../service/comFun.js"
	export default {
		data() {
			return {
				messages: [],
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度
				page: 1,
				maxPage: "",
				current_search_value: "",
				token: "",
				Fromtime: "",
				Totime: "",
				message_obj: {},
				list: ['未读消息', '已读消息'],
				current: 0,
				Locations_name: "",
				rows_num: 10,
				Totime_30: "",
				message_number: '',
				// corrected_name:[],
				index5: [0]
			}
		},
		onPullDownRefresh() {
			console.log("触发下拉刷新")
			if (this.current == 0) {
				this.getproblems_time()
			} else if (this.current == 1) {
				this.getproblems_time()
			} else {
				this.getproblems()
			}
			uni.stopPullDownRefresh()
		},
		computed: mapState({
			stateUser: state => state.user,
			statelocation: state => state.locations,
		}),
		methods: {
			moment: moment,
			backhome() {
				uni.reLaunch({
					url: "/pages/dashboard/index",
					fail(error) {
						console.log(error)
					}
				})
			},
			filter_problem() {
				this.$api.getProblem.post({
					"Account-Token": this.statelocation.token,
					"to_uuid": this.id,
					"offset": 0,
					"rows": this.rows_num,
					"status": "UN_FEEDBACK",
					number: this.current_search_value
				}).then(response => {
					console.log(response)
					uni.redirectTo({
						url: "./show?id=" + response.content.array[0].uuid + "&problem_type=" + response
							.content.array[0]
					})
				})
			},
			sectionChange(index) {
				this.current = index;
				if (this.current == 0) {
					this.message_obj = {
						"Account-Token": this.statelocation.token,
						"to_uuid": this.stateUser.uuid,
						"offset": 0,
						"rows": 10,
						"read": "UN_READ"
					}
					this.getMessage_UN_READ()
				} else {
					this.message_obj = {
						"Account-Token": this.statelocation.token,
						"to_uuid": this.stateUser.uuid,
						"offset": 0,
						"rows": 10,
						"read": "READ"
					}
					this.getMessage_READ()
				}
			},
			lower() {
				if (this.current == 0) {
					this.rows_num += 10
					this.message_obj = {
						"Account-Token": this.statelocation.token,
						"to_uuid": this.stateUser.uuid,
						"offset": 0,
						"rows": this.rows_num,
						"read": "UN_READ"
					}
					this.getMessage_UN_READ()
				} else {
					this.rows_num += 10
					this.message_obj = {
						"Account-Token": this.statelocation.token,
						"to_uuid": this.stateUser.uuid,
						"offset": 0,
						"rows": this.rows_num,
						"read": "READ"
					}
					this.getMessage_READ()
				}

			},
			GetBase64Str(str) {
				return btoa(unescape(encodeURIComponent(str)))
			},
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
				});
			},
			getMessage_UN_READ() {
				this.$api.getMessage.post(this.message_obj).then(response => {
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
					this.messages = response.content.array
					this.list[0] = "未读消息" + response.content.count
					console.log(this.list)
					// setTimeout(() => {
					// 	response.content.array.map(data => {
					// 		this.$api.modifyMessage.post({
					// 			"Account-Token": this.statelocation.token,
					// 			"uuid": data.uuid,
					// 			"read": "READ"
					// 		})
					// 		this.$router.go(0)
					// 	})
					// }, 3000)
				});
			},
			getMessage_READ() {
				this.$api.getMessage.post(this.message_obj).then(response => {
					this.messages = response.content.array
					this.list[1] = "已读消息" + response.content.count
				});
			},
			getDays() {
				let oneDay = 24 * 60 * 60 * 1000
				let endTime = new Date(Date.now())
				endTime = this.formatterDate(endTime, "yyyy-MM-dd hh:mm:ss")
				let startTime = new Date(Date.now() - 7 * oneDay)
				startTime = this.formatterDate(startTime, "yyyy-MM-dd hh:mm:ss")
				let startTime_30 = new Date(Date.now() - 30 * oneDay)
				startTime_30 = this.formatterDate(startTime_30, "yyyy-MM-dd hh:mm:ss")
				const days = {
					startTime,
					endTime,
					startTime_30
				}
				return days
			},
			//时间格式化
			formatterDate(date, fmt) {
				let nowDate = {
					yyyy: date.getFullYear(), // 年
					MM: date.getMonth() + 1, // 月份
					dd: date.getDate(), //日
					hh: date.getHours(),
					mm: date.getMinutes(),
					ss: date.getSeconds()
				}
				if (/(y+)/.test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
				}
				for (var k in nowDate) {
					if (new RegExp("(" + k + ")").test(fmt)) {
						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (nowDate[k]) : (("00" + nowDate[k]).substr((
							"" + nowDate[k]).length)));
					}
				}
				return fmt;
			},
			onShow() {
				this.message_obj = {
					"Account-Token": this.statelocation.token,
					"to_uuid": this.stateUser.uuid,
					"offset": 0,
					"rows": 10,
					"read": "UN_READ"
				}
				this.getMessage_UN_READ()
				// console.log(getCurrentPages())
				// if (this.current == 0) {
				// 	this.message_obj = {
				// 		"Account-Token": this.statelocation.token,
				// 		"to_uuid": this.stateUser.uuid,
				// 		"offset": 0,
				// 		"rows": 10,
				// 		"read": "UN_READ"
				// 	}
				// 	this.getMessage_UN_READ()
				// } else {
				// 	this.message_obj = {
				// 		"Account-Token": this.statelocation.token,
				// 		"to_uuid": this.stateUser.uuid,
				// 		"offset": 0,
				// 		"rows": 10,
				// 		"read": "READ"
				// 	}
				// 	this.getMessage_READ()
				// }
			},

		}
	}
</script>
<style>
	.container {
		overflow: hidden;
		padding: 0 15px;
		background-color: #F1F1F1;
		margin-top: 15px
	}

	.uni-list-cell-picker {
		color: #8F8F94;
		border: 1px solid #1E90FF;
		height: 30px;
		line-height: 30px;
		margin-top: 5px;
		padding-left: 10px;
		border-radius: 12px;
	}

	.uni-list-cell-triangle {
		display: inline-block;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 8px solid #C8C7CC;
		position: absolute;
		right: 12px;
		bottom: 12px;
	}

	.page-top {
		height: 120px;
		width: 100%;
		padding: 0 0 !;
		background-color: #2057b5;
		border-bottom-right-radius: 15%;
		border-bottom-left-radius: 15%;
		/* margin-bottom: 35px; */
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center
	}

	.title {
		font-size: 24px;
		font-weight: 300;
	}

	.top-button-container {
		margin: 10px 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.top-button {
		background-color: #b3b3b3;
		color: #FFFFFF;
		font-weight: 600;
		letter-spacing: 0.5px;
		height: 25px;
		line-height: 25px;
		border-radius: 5px;
		font-size: 13px;
		padding: 0 10px;
	}

	.button-active {
		background-color: #747474 !important;
	}

	.problem-card {
		background-color: #FFFFFF;
		margin-bottom: 15px;
		/* height: 110px; */
		border-radius: 10px;
		/* display: flex; */
	}

	.navshow {
		/* width: 35%;
		height: 20%;
		text-align: center; */
		font-size: 16px;
		margin-top: 10px;
		color: #46817b;
		margin-left: 55%;
	}

	.card-left {
		width: 100px;
		padding: 8px;
		position: relative;
	}

	.card-left-image {
		height: 100%;
		width: 100%;
		border-radius: 10px;
	}

	.card-right {
		flex: 1;
		padding: 8px 8px 8px 2px;
	}

	.card-left-btn-container {
		margin-top: 6px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.card-left-btn {
		background-color: #b3b3b3;
		color: #FFFFFF;
		font-weight: 600;
		font-size: 10px;
		padding: 0 8px;
		margin: 0;
		height: 20px;
		line-height: 20px;
		border-radius: 5px;
	}

	.card-left-status {
		height: 14px;
		background-color: #F1F1F1;
		position: absolute;
		top: 15px;
		left: -10px;
		border-radius: 5px;
		display: flex;
		padding: 3px;
	}

	.card-left-square {
		background-color: #f06a07;
		height: 14px;
		width: 14px;
		margin-left: 10px;
		border-radius: 3px;
	}

	.card-left-status-text {
		font-size: 12px;
		line-height: 14px;
		padding: 0 3px;
		color: #f06a07;
		font-weight: 600;
	}

	.card-right-top {
		height: 20px;
		width: 100%;
		display: inline-block;
	}

	.card-right-center {
		height: 20px;
		margin-top: 5px;
	}

	.card-right-division-name {
		background-color: #F1F1F1;
		font-size: 12px;
		line-height: 14px;
		margin: 0;
		padding: 2px 5px;
		border-radius: 5px;
		display: inline-block;
	}

	.card-right-division-time {
		font-size: 10px;
		line-height: 16px;
		margin: 0;
		padding: 2px 5px;
		float: right;
		display: inline-block;
		color: #747474;
	}

	.card-right-center {
		overflow: hidden;
		-webkit-line-clamp: 2;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		font-size: 12px;
		line-height: 20px;
	}

	.card-right-bottom {
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.card-right-bottom-btn {
		background-color: #747474;
		color: #FFFFFF;
		font-weight: 600;
		font-size: 10px;
		padding: 0 8px;
		margin: 0;
		height: 20px;
		line-height: 20px;
		border-radius: 5px;
		font-size: 10px;
		padding: 0 8px;
	}

	.go-back {
		position: absolute;
		top: calc(var(--status-bar-height) + 7px);
		right: 15px;
		background-color: #808080;
		color: #FFFFFF;
		padding: 0 10px;
		height: 22px;
		line-height: 22px;
		border-radius: 5px;
		font-size: 13px;
		padding: 0 10px;
	}
</style>
