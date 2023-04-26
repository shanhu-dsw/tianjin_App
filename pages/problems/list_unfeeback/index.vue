<template>
	<view class="" style="background-color: #F1F1F1;">
		<view class="page-top">
			<view class="container-go-back" @click="backhome" hover-class="other-navigator-hover">
				<uni-icons type="back" size="30" style="color: #FFF;position: absolute;left: 17px;top: 45px;">
				</uni-icons>
			</view>
			<h3 class="title">情况反馈</h3>
		</view>
		<view class="container">
			<view class="problem-scroll-container">
				<view class="uni-list-cell-db" style="display: flex;">
					<uni-data-select v-model="value" :localdata="division_time" @change="bindPickerChange"
						:clear="false" placeholder="请选择时间" class="uni-list-cell-picker" style=""></uni-data-select>
					<uni-data-select v-model="value_type" :localdata="division_type" @change="bindPickerChange2"
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
							:url="'/pages/problems/list_unfeeback/index_of?id=' + locations.uuid +'&value_time='+ value + '&value_type=' + value_type + '&name='+locations.name"
							hover-class="other-navigator-hover" v-show="!show" class="info-container"
							open-type="reLaunch" v-for="(locations, index) in location" :key="locations.uuid">
							<view class="info-icon">
								<image src="../../../static/icon/20230212185025.jpg" mode=""
									style="width: 45px;height: 34px;margin-top: 5px;"></image>
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
								{{locations.problem_count}}
							</view>
							<view class="">
								<navigator
									:url="'/pages/problems/list_unfeeback/index_of?id=' + locations.uuid +'&value_time='+ value + '&value_type=' + value_type + '&name='+locations.name"
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
	import index_ofVue from './index_of.vue';
	export default {
		data() {
			return {
				value: "",
				value_type: "",
				maxproblem_num: 0,
				division_time: [{
					value: 0,
					text: "全部"
				}, {
					value: 1,
					text: "最近一周"
				}, {
					value: 2,
					text: "最近一月"
				}],
				division_type: [{
					value: 0,
					text: "全部"
				}, {
					value: 1,
					text: "检查问题"
				}, {
					value: 2,
					text: "自查问题"
				}],
				location: [],
				Fromtime: "",
				Totime: "",
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度
				show: true,
				face: "",
				query: {}
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
				this.query = {
					"Account-Token": this.statelocation.token,
					"level": 2,
					"status": "UN_FEEDBACK"
				}
				this.getList()
			},
			bindPickerChange(e) {
				this.value = e
				console.log(this.value)
				if (this.value == 0) {
					delete this.query.start_create_datetime
					delete this.query.end_create_datetime
					this.getList()
				} else if (this.value == 1) {
					this.query.start_create_datetime = this.getDays().startTime
					this.query.end_create_datetime = this.getDays().endTime
					this.getList()
				} else {
					this.query.start_create_datetime = this.getDays().startTime_30
					this.query.end_create_datetime = this.getDays().endTime
					this.getList()
				}
			},
			getColor(index) {
				if (index <= 2) {
					return "#DE6F6D";
				} else if (index <= 7) {
					return "#5A70C1";
				} else {
					return "#A1CC83";
				}
			},
			getClass(index) {
				if (index <= 2) {
					return "rank1";
				} else if (index <= 7) {
					return "rank2";
				} else {
					return "rank3";
				}
			},
			bindPickerChange2(e) {
				this.value_type = e
				this.$api.ProblemCategories.post({
					"Account-Token": this.statelocation.token
				}).then(response => {
					const order_num = response.content.array.filter(item => item.name == "检查问题")[0].order_group
					const order_num2 = response.content.array.filter(item => item.name == "自查问题")[0].order_group
					if (this.value_type == 1) {
						this.query.order_group = order_num
					} else if (this.value_type == 2) {
						this.query.order_group = order_num2
					} else {
						delete this.query.order_group
					}
					this.getList()
				})
			},
			// GetBase64Str(str) {
			// 	return btoa(unescape(encodeURIComponent(str)))
			// },
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
				this.$api.getDepartmentProblemCount.post(this.query).then((response) => {
					this.location = response.content.array
					this.location.sort((a, b) => b.problem_count - a.problem_count)
					this.show = false
					this.maxproblem_num = this.location.reduce((prev, cur) => prev.problem_count > cur
						.problem_count ? prev : cur).problem_count;
				})
			},
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
		font-size: 14px;
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
		border-radius: 10px
	}

	.info-icon {
		width: 45px;
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
