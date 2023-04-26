<template>
	<view style="background-color: #F1F1F1;">
		<view class="page-top">
			<view class="container-go-back" @click="backhome" hover-class="other-navigator-hover">
				<uni-icons type="back" size="30" style="color: #FFF;position: absolute;left: 17px;top: 45px;">
				</uni-icons>
			</view>
			<h3 class="title">情况反馈</h3>
		</view>
		<view class="container">
			<view class="uni-list-cell-db" style="display: flex;margin-bottom: 5px">
				<input class="uni-list-cell-picker" type="text" placeholder="请输入问题编号" v-model="current_search_value"
					style="flex: 3;">
				<button class="uni-list-cell-picker" @click="filter_problem"
					style="flex: 1 ;margin-left: 25px;">筛选</button>
				<!-- <picker @change="bindPickerChange" mode="selector" :range-value="'id'" :range-key="'name'"
					:range="division_name" class="uni-list-cell-picker">
					<label class="picker-text">{{ division_name[index5].name }}</label>
					<view class="uni-list-cell-triangle"></view>
				</picker> -->
				<!-- 	<u-subsection mode="subsection" :list="list" :current="current" @change="sectionChange"
				activeColor="#2057B8" fontSize="14" style="padding:0 10px;"></u-subsection> -->
			</view>
			<view class="problem-scroll-container">
				<scroll-view scroll-y="true" class="sv" :style="{height:navHeight+'px'}" @scrolltolower="lower">

					<view class="problem-card" :key="problem.uuid" v-for="(problem, index) in problems">

						<navigator :url="'./show?id=' + problem.uuid + '&problem_type='+problem.type_uuid"
							hover-class="other-navigator-hover" class="card-left">

							<image class="card-left-image"
								:src="(problem.storage_file !==undefined ?  baseurl + problem.storage_file[0].url : '/static/images/no_find_image.png')">
							</image>

							<view class="card-left-status">
								<view class="card-left-square"></view>
								<!-- <view class="card-left-status-text">{{$t(problem.is_fact)}}</view> -->
								<view class="card-left-status-text">#{{problem.number}}</view>
							</view>
						</navigator>

						<navigator :url="'./show?id=' + problem.uuid + '&problem_type='+problem.type_uuid"
							hover-class="other-navigator-hover" class="card-right">
							<view class="card-right-top">
								<view class="card-right-division-name" size="mini">{{ problem.department_name }}</view>
								<view v-if="problem.status == 'FILED'" class="card-right-division-time3">
									<!-- {{ moment(problem.create_datetime).format('YYYY-MM-DD') }} -->
									{{$t(problem.status)}}
								</view>
								<view v-else
									:class="[problem.status == 'UN_FEEDBACK'?'card-right-division-time':'card-right-division-time2']">
									<!-- {{ moment(problem.create_datetime).format('YYYY-MM-DD') }} -->
									{{$t(problem.status)}}
								</view>
							</view>
							<!-- <view class="card-right-center">
								<text class="">
									问题责任人：{{ problem.admin.full_name }}
								</text>
							</view> -->
							<view class="card-right-center">
								<text class="card-right-center-text">
									发生时间：{{ problem.create_datetime }}</text>
							</view>
							<view class="card-right-center">
								<text class="card-right-center-text">
									问题类型：{{$t(problem.problem_type)}}-{{problem.type ?  problem.problem_department_type_name : '暂无问题类型'}}</text>
							</view>
							<view class="card-right-center">
								<text class="">
									检查单位：{{problem.from_department_name ? problem.from_department_name : "暂无检查单位"}}
								</text>
							</view>
						</navigator>
					</view>
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
	import getRole from "../../../Role_judgment/Role_judgment.js"
	export default {
		data() {
			return {
				problems: [],
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度
				page: 1,
				maxPage: "",
				current_search_value: "",
				token: "",
				Locations_name: "",
				baseurl: '',
				rows_num: 10,
				Totime_30: "",
				// list: ['全部', '已确认', '已整改'],
				current: 0,
				problem_data: {

				},
				value_time: "",
				value_type: "",
				index5: [0]
			}
		},
		onPullDownRefresh() {
			console.log("触发下拉刷新")
			if (getRole(this.stateUser.admin_info[0].role_name).is_problem_list_all) {
				this.getproblems()
			} else if (getRole(this.stateUser.admin_info[0].role_name).is_problem_list_of) {
				if (this.stateUser.admin_info[0].full_name.indexOf(this.Locations_name) !== -1) {
					this.getproblems()
				} else {
					uni.showToast({
						title: "抱歉，您无权查看",
						icon: "none"
					})
				}
			} else {
				uni.showToast({
					title: "抱歉，您无权查看",
					icon: "none"
				})
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
					url: "./index",
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
					"rows": 999,
					"status": "UN_FEEDBACK"
				}).then(response => {
					var filter_number = response.content.array.filter(item => item.number == this
						.current_search_value)
					uni.navigateTo({
						url: "./show?id=" + filter_number[0].uuid
					})
				})
			},
			onLoad(options) {
				console.log(options)
				this.id = options.id
				this.value_time = options.value_time
				this.value_type = options.value_type
				this.Locations_name = options.name
				// this.current = options.current
				// this.current = options.current
			},
			lower() {
				this.problem_data.rows += 10
				this.getproblems()
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
			getproblems() {
				this.$api.getProblemExact.post(this.problem_data).then(response => {
					this.problems = response.content.array
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
				this.problem_data = {
					"Account-Token": this.statelocation.token,
					"to_uuid": this.id,
					"offset": 0,
					"rows": this.rows_num,
					"status": "UN_FEEDBACK"
				}
				this.baseurl = CONFIG.url_img()
				const role_name = this.stateUser.admin_info[0].role_name
				if (this.value_time == 1) {
					this.problem_data.start_create_datetime = this.getDays().startTime
					this.problem_data.end_create_datetime = this.getDays().endTime
				} else if (this.value_time == 2) {
					this.problem_data.start_create_datetime = this.getDays().startTime_30
					this.problem_data.end_create_datetime = this.getDays().endTime
				}

				if (this.value_type == 1) {
					this.problem_data.problem_type = "CHECK"
				} else if (this.value_type == 2) {
					this.problem_data.problem_type = "SELF"
				}
				if (getRole(this.stateUser.admin_info[0].role_name).is_problem_list_all) {
					this.getproblems()
				} else if (getRole(this.stateUser.admin_info[0].role_name).is_problem_list_of) {
					if (this.stateUser.admin_info[0].full_name.indexOf(this.Locations_name) !== -1) {
						this.getproblems()
					} else {
						uni.showToast({
							title: "抱歉，您无权查看",
							icon: "none"
						})
						setTimeout(() => {
							this.backhome()
						}, 500)
					}
				} else {
					uni.showToast({
						title: "抱歉，您无权查看",
						icon: "none"
					})
					setTimeout(() => {
						this.backhome()
					}, 500)
				}
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
		height: 110px;
		border-radius: 10px;
		display: flex;
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
		background-color: #fab33d;
		font-size: 10px;
		line-height: 16px;
		margin: 0;
		padding: 4px 10px;
		float: right;
		display: inline-block;
		color: #bf6600;
	}

	.card-right-division-time2 {
		background-color: #c3f1eb;
		font-size: 10px;
		line-height: 16px;
		margin: 0;
		padding: 4px 10px;
		float: right;
		display: inline-block;
		color: #00b99a;
	}

	.card-right-division-time3 {
		background-color: #9b9da0;
		font-size: 10px;
		line-height: 16px;
		margin: 0;
		padding: 4px 10px;
		float: right;
		display: inline-block;
		color: #FFF;
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
