<template>
	<view class="" style="background-color: #F1F1F1;">
		<view class="page-top">
			<view class="container-go-back" @click="backhome" hover-class="other-navigator-hover">
				<uni-icons type="back" size="30" style="color: #FFF;position: absolute;left: 17px;top: 45px;">
				</uni-icons>
			</view>
			<h3 class="title">问题列表</h3>
		</view>
		<view class="container">
			<view class="problem-scroll-container">
				<view class="uni-list-cell-db" style="display: flex;">
					<uni-data-select v-model="value" :localdata="division_time" @change="bindPickerChange"
						:clear="false" placeholder="请选择时间" class="uni-list-cell-picker" style=""></uni-data-select>
					<uni-data-select v-model="value_state" :localdata="division_state" @change="bindPickerChange2"
						:clear="false" placeholder="请选择状态" class="uni-list-cell-picker" style=""></uni-data-select>
					<uni-data-select v-model="value_type" :localdata="division_type" @change="bindPickerChange3"
						:clear="false" placeholder="请选择类型" class="uni-list-cell-picker" style=""></uni-data-select>
				</view>
				<scroll-view scroll-y="true" class="sv" :style="{height:navHeight+'px'}">
					<view class="problem-info-container" style="padding-bottom: 30px">
						<view class="small-title">
							<text>单位名称</text>
							<text style="padding-left:50%;">问题数</text>
						</view>
						<view v-show="show" style="padding-top: 200px;">
							<u-loading-icon size="36"></u-loading-icon>
						</view>

						<navigator
							:url="'/pages/problems/list_All/index_of?id=' + locations.uuid +'&division_time='+value + '&division_state='+value_state + '&division_type='+value_type + '&name='+locations.name"
							hover-class="other-navigator-hover" v-show="!show" class="info-container"
							open-type="reLaunch" v-for="(locations, index) in location" :key="locations.uuid">
							<view class="info-icon">
								<image src="../../../static/icon/departementicon.png" mode=""
									style="width: 25px;height: 30px;margin-top: 5px;"></image>
							</view>
							<text :class="getClass(index)"
								style="font-size: 18px;line-height: 200%;margin-left: 2px;">{{index+1}}</text>
							<view class="info-container-name" :style="'color:'+getColor(index)">
								{{locations.name}}
							</view>
							<u-line direction="col"></u-line>
							<view class="info-container-num" :style="'color:'+getColor(index)">
								<progress :percent="locations.problem_count/maxproblem_num*100" stroke-width="5"
									:activeColor="getColor(index)" style="height: 50rpx;margin-right: 10px;flex: 1;"
									border-radius="20%" />
								<!-- <u-line-progress style="margin-right: 10px;" :showText="false"
									:percentage="locations.count/maxProCount*100" activeColor="#ff0000">
								</u-line-progress> -->
								{{locations.problem_count}}
							</view>
							<view class="">
								<navigator
									:url="'/pages/problems/list_All/index_of?id=' + locations.uuid +'&division_time='+value + '&division_state='+value_state + '&division_type='+value_type + '&name='+locations.name"
									hover-class="other-navigator-hover" open-type="reLaunch">
									<uni-icons type="arrow-right" size="40" style="color: #d0d0d0;"></uni-icons>
								</navigator>
							</view>
						</navigator>
					</view>
				</scroll-view>


			</view>
		</view>
	</view>

</template>

<script>
	import moment from 'moment';
	import {
		mapActions,
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				// info: {
				// 	waiting: 0,
				// 	correcting: 0,
				// 	corrected: 0,
				// 	negated: 0,
				// 	reviewing: 0,
				// 	field: 0,
				// },
				value: "",//选择时间对应下标
				value_state: '',//选择状态对应下标
				value_type: '',//选择类型对应下标
				maxproblem_num: 0,//全部问题数量
				division_time: [{
					value: 0,
					text: "全部"
				}, {
					value: 1,
					text: "最近一周"
				}, {
					value: 2,
					text: "最近一月"
				}],//时间筛选
				division_state: [{
					value: 0,
					text: "全部"
				}, {
					value: 1,
					text: "未反馈"
				}, {
					value: 2,
					text: "已反馈"
				}, {
					value: 3,
					text: "已归档"
				}],//状态筛选
				division_type: [{
					value: 0,
					text: "全部"
				}, {
					value: 1,
					text: "检查问题"
				}, {
					value: 2,
					text: "自查问题"
				}],//类型筛选
				location: [],//问题数据
				Fromtime: "",//开始创建
				Totime: "",//结束创建
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度
				show: true,//加载组件控制
				status: "",//问题状态
				problem_obj: {

				}//接口传参
			}
		},
		onPullDownRefresh() {
			this.getList();
			uni.stopPullDownRefresh()
		},
		computed: mapState({
			stateUser: state => state.user,
			statelocation: state => state.locations,
		}),

		methods: {
			//点击返回按钮
			backhome() {
				uni.switchTab({
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
							that._data.navHeight = pH - data.top //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
						}).exec()
					}
				})
			},
			onShow() {
				this.problem_obj = {
					"Account-Token": this.statelocation.token,
					"level": 2,
				}
				this.getList()
			},
			//根据排名显示颜色
			getColor(index) {
				if (index <= 2) {
					return "#DE6F6D";
				} else if (index <= 7) {
					return "#5A70C1";
				} else {
					return "#A1CC83";
				}
			},
			//根据排名显示颜色
			getClass(index) {
				if (index <= 2) {
					return "rank1";
				} else if (index <= 7) {
					return "rank2";
				} else {
					return "rank3";
				}
			},
			//根据时间筛选
			bindPickerChange(e) {
				this.value = e
				this.value_state = ""
				this.value_type = ""
				console.log(this.value)
				if (this.value == 0) {
					this.problem_obj = {
						"Account-Token": this.statelocation.token,
						"level": 2,
					}
					this.getList()
				} else if (this.value == 1) {
					this.Fromtime = this.getDays().startTime
					this.Totime = this.getDays().endTime
					this.problem_obj = {
						"Account-Token": this.statelocation.token,
						"level": 2,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
					this.getList()
				} else {
					this.Fromtime = this.getDays().startTime_30
					this.Totime = this.getDays().endTime
					this.problem_obj = {
						"Account-Token": this.statelocation.token,
						"level": 2,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
					this.getList()
				}
			},
			//根据状态筛选
			bindPickerChange2(e) {
				this.value_state = e
				this.value = ""
				this.value_type = ""
				console.log(this.value)
				if (this.value_state == 0) {
					this.problem_obj = {
						"Account-Token": this.statelocation.token,
						"level": 2,
					}
					this.getList()
				} else if (this.value_state == 1) {
					this.status = "UN_FEEDBACK"
					this.problem_obj = {
						"Account-Token": this.statelocation.token,
						"level": 2,
						"status": this.status
					}
					this.getList()
				} else if (this.value_state == 2) {
					this.status = "FEEDBACK"
					this.problem_obj = {
						"Account-Token": this.statelocation.token,
						"level": 2,
						"status": this.status
					}
					this.getList()
				} else {
					this.status = "FILED"
					this.problem_obj = {
						"Account-Token": this.statelocation.token,
						"level": 2,
						"status": this.status
					}
					this.getList()
				}
			},
			//根据类型筛选
			bindPickerChange3(e) {
				this.value_type = e
				this.value = ""
				this.value_state = ""
				console.log(this.division_type[this.value_type].text)
				this.getList_type()
			},
			//获取当前时间，获取七，三十天前
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
			getList() {
				this.show = true;
				this.maxproblem_num = 0;
				this.$api.getDepartmentProblemCount.post(this.problem_obj).then((response) => {
					this.location = response.content.array
					this.location.sort((a, b) => b.problem_count - a.problem_count)
					this.location.forEach((item, index) => {
						// this.maxproblem_num = Math.max(this.maxproblem_num, item.problem_count);
						this.maxproblem_num += item.problem_count
					})
					console.log(this.maxproblem_num)
					this.show = false
					// this.checkProblemPermission(this.stateUser.admin_info[0],)
				})

			},
			getList_time() {
				this.show = true;
				this.maxproblem_num = 0
				this.$api.getDepartmentProblemCount.post({
					"Account-Token": this.statelocation.token,
					"level": 2,
					"start_create_datetime": this.Fromtime,
					"end_create_datetime": this.Totime,
				}).then((response) => {
					this.location = response.content.array
					this.location.sort((a, b) => b.problem_count - a.problem_count)
					this.location.forEach((item, index) => {
						// this.maxproblem_num = Math.max(this.maxproblem_num, item.problem_count);
						this.maxproblem_num += item.problem_count
					})
					this.show = false
				})

			},
			getList_fiflter() {
				this.show = true;
				this.maxproblem_num = 0
				this.$api.getDepartmentProblemCount.post({
					"Account-Token": this.statelocation.token,
					"level": 2,
					"status": this.status
				}).then((response) => {
					this.location = response.content.array
					this.location.sort((a, b) => b.problem_count - a.problem_count)
					this.location.forEach((item, index) => {
						// this.maxproblem_num = Math.max(this.maxproblem_num, item.problem_count);
						this.maxproblem_num += item.problem_count
					})
					this.show = false
				})
			},
			getList_type() {
				this.show = true;
				this.maxproblem_num = 0
				this.$api.ProblemCategories.post({
					"Account-Token": this.statelocation.token
				}).then(response => {
					if (this.value_type == 1) {
						const order_num = response.content.array.filter(item => item.name == "检查问题")[0].order_group
						this.$api.getDepartmentProblemCount.post({
							"Account-Token": this.statelocation.token,
							"order_group": order_num,
							"level": 2
						}).then(response => {
							this.location = response.content.array
							this.location.sort((a, b) => b.problem_count - a.problem_count)
							this.location.forEach((item, index) => {
								// this.maxproblem_num = Math.max(this.maxproblem_num, item.problem_count);
								this.maxproblem_num += item.problem_count
							})
							this.show = false
						})
					} else if (this.value_type == 2) {
						const order_num2 = response.content.array.filter(item => item.name == "自查问题")[0]
							.order_group
						this.$api.getDepartmentProblemCount.post({
							"Account-Token": this.statelocation.token,
							"order_group": order_num2,
							"level": 2
						}).then(response => {
							this.location = response.content.array
							this.location.sort((a, b) => b.problem_count - a.problem_count)
							this.location.forEach((item, index) => {
								// this.maxproblem_num = Math.max(this.maxproblem_num, item.problem_count);
								this.maxproblem_num += item.problem_count
							})
							this.show = false
						})
					} else {
						this.getList()
					}
				})

				// this.$api.ProblemCategories.post({
				// 	"Account-Token": this.statelocation.token
				// }).then(response => {
				// 	if (this.value_type == 1) {
				// 		const order_num = response.content.array.filter(item => item.name == "检查问题")[0].order_group
				// 		console.log(this.location)
				// 		this.location.map((data, index) => {
				// 			data.problem_count = 0
				// 		})
				// 		response.content.array.map((data, index) => {
				// 			var abc = data.order_group.substr(0, 3)
				// 			console.log(abc)
				// 			if (abc == order_num) {
				// 				this.$api.getDepartmentProblemCount.post({
				// 					"Account-Token": this.statelocation.token,
				// 					"type_uuid": data.uuid,
				// 					"level": 2
				// 				}).then(response => {
				// 					this.location.map((data, index) => {
				// 						data.problem_count += response.content.array[index].problem_count
				// 					})
				// 					this.location = this.location.sort((a, b) => b.problem_count - a.problem_count)
				// 					this.show = false;
				// 				})
				// 			}
				// 		})
				// 	} else if (this.value_type == 2) {
				// 		const order_num = response.content.array.filter(item => item.name == "自查问题")[0].order_group
				// 		this.location.map((data, index) => {
				// 			data.problem_count = 0
				// 		})
				// 		response.content.array.map((data, index) => {
				// 			var abc = data.order_group.substr(0, 3)
				// 			console.log(abc)
				// 			if (abc == order_num) {
				// 				this.$api.getDepartmentProblemCount.post({
				// 					"Account-Token": this.statelocation.token,
				// 					"type_uuid": data.uuid,
				// 					level: 2
				// 				}).then(response => {
				// 					this.location.map((data, index) => {
				// 						data.problem_count += response.content.array[index]
				// 							.problem_count
				// 					})
				// 					// this.location.sort((a, b) => b.problem_count - a.problem_count)
				// 					this.show = false;
				// 					console.log(response)
				// 				})
				// 			}
				// 		})
				// 	}else{
				// 		this.getList()
				// 	}
				// })
			},
			checkProblemPermission(adminInfoObj, departmentArray, problemType, problemToUuid) {
				if ("department" === problemType) {
					// 判断是否为单位负责人
					{
						const manageDepartmentArray = adminInfoObj.manage_departments.split(";");
						for (let i = 0; i < manageDepartmentArray.length; i++) {
							const manageDepartment = manageDepartmentArray[i];
							if (2 < manageDepartment.length) {
								if (manageDepartment === problemToUuid) {
									return true;
								}
							}
						}
					}
					// 判断是否为分局领导
					{
						let isLeader = true;
						for (let i = 0; i < departmentArray.length; i++) {
							const department = departmentArray[i];
							if (department.hasOwnProperty("level")) {
								if (1 < department.level) {
									isLeader = false;
									break;
								}
							}
						}
					}
					if (isLeader) {
						return true;
					}
					return false;
				} else {
					// 个人问题
					if (problemToUuid === adminInfoObj.uuid) {
						return true;
					}
					return false;
				}
			}
		}
	}
</script>

<style>
	.container {
		overflow: hidden;
		padding: 0 10px;
		margin-top: 20px;
		background-color: #F1F1F1;
	}

	.uni-list-cell-picker {
		color: #303133;
		font-size: 20px;
		/* border: 1px solid #2057B8; */
		height: 30px;
		/* width: 100px; */
		line-height: 30px;
		margin-left: 10px;
		text-align: center;
		/* margin-bottom: 5px; */
		/* padding-left: 10px; */
		border-radius: 6px;
	}

	.uni-select {
		border: 0px;
	}

	.page-top {
		height: 120px;
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

	.problem-info-container {
		border-radius: 15px;
		/* background-color: #FFFFFF; */
		margin-bottom: 15px;
		padding: 10px 10px;
	}

	.small-title {
		font-size: 14px;
		height: 30px;
		padding-left: 24px;
		line-height: 30px;
		color: #FFF;
		background: #2057B8;
		margin-bottom: 10px;
		border-radius: 8px;
	}

	.overview-container {
		display: flex;
	}

	.overview-info {
		flex: 1;
		margin-bottom: 10px;
	}

	.overview-info-text {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #747474;
	}

	.overview-info-text-number {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.info-container {
		display: flex;
		margin-top: 12px;
		background-color: #FFF;
		justify-content: space-between;
		height: 38px;
		font-size: 10px;
		line-height: 50px;
		border-radius: 6px;
	}

	.info-icon {
		/* width: 45px; */
		margin-left: 5px;
	}

	.rank1 {
		color: #DE6F6D;
	}

	.rank2 {
		color: #5A70C1;
	}

	.rank3 {
		color: #A1CC83;
	}

	.info-container-name {
		display: flex;
		align-items: center;
		flex: 1.5;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-left: 10px;
		margin-right: 10px;
		color: #2e726a;
		font-size: 12px;
		font-weight: 500;
	}

	.info-container-num {
		display: flex;
		align-items: center;
		flex: 2;
		margin-left: 10px;
		margin-right: 10px;
		/* color: #2e726a; */
		font-size: 12px;
		font-weight: 500;
	}

	.progress-container {
		margin: 0 20px;
	}

	.progress-bar {
		height: 5px;
		border-radius: 10px;
		background-color: #007AFF;
	}
</style>
