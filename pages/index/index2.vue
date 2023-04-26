<template>
	<view class="" style="background-color: #F1F1F1;">
		<view class="page-top">
			<view class="container-go-back" @click="backhome" hover-class="other-navigator-hover">
				<uni-icons type="back" size="30" style="color: #FFF;position: absolute;left: 17px;top: 45px;">
				</uni-icons>
			</view>
			<h3 class="title2">数据分析</h3>
		</view>
		<view class="container">
			<scroll-view scroll-y="true" class="sv" :style="{height:navHeight+'px'}">

				<u-row justify="space-between" gutter="10">
					<u-col span="3">
						<view style="background-color: #ff4357;border-radius: 10px;color:#FFF;text-align: center;">
							<view style="font-size:16px;font-weight: bold;padding-top: 15px;padding-bottom: 10px;">
								{{statistics.total1}}
							</view>
							<view style="font-size:12px;padding-top:5px;padding-bottom: 10px;">问题总数</view>
						</view>
					</u-col>
					<!-- <u-col span="3">
						<view style="background-color: #ffc200;border-radius: 10px;color:#FFF;text-align: center;">
							<view style="font-size:16px;font-weight: bold;padding-top: 15px;padding-bottom: 10px;">
								{{statistics.total2}}
							</view>
							<view style="font-size:12px;padding-top:5px;padding-bottom: 10px;">监控总数</view>
						</view>
					</u-col> -->
					<u-col span="3">
						<view style="background-color: #00d993;border-radius: 10px;color:#FFF;text-align: center;">
							<view style="font-size:16px;font-weight: bold;padding-top: 15px;padding-bottom: 10px;">
								{{statistics.total3}}
							</view>
							<view style="font-size:12px;padding-top:5px;padding-bottom: 10px;">问题种类</view>
						</view>
					</u-col>
					<u-col span="3">
						<view style="background-color: #4eb4fe;border-radius: 10px;color:#FFF;text-align: center;">
							<view style="font-size:16px;font-weight: bold;padding-top: 15px;padding-bottom: 10px;">
								{{statistics.total4}}
							</view>
							<view style="font-size:12px;padding-top:5px;padding-bottom: 10px;">未反馈问题</view>
						</view>
					</u-col>
				</u-row>

				<view class="chart-container" style="margin-top: 20px;">
					<view class="title">部门问题数排行(top10)
					<uni-datetime-picker v-model="range" type="daterange" @maskClick="maskClick" style="font-size: 20px;"/>
						<!-- <uni-data-select v-model="value_time" :localdata="division_time" @change="bindPickerChange"
							:clear="false" placeholder="请选择时间" class="uni-list-cell-picker" style="padding-left: 45px;">
						</uni-data-select> -->
					</view>

					<mpvue-echarts :echarts="echarts" :onInit="barInit" canvasId="bar1" ref="barChart1" />
				</view>
				<view class="chart-container">
					<view class="title">
						自查问题排行(top10)
						<uni-data-select v-model="value_time2" :localdata="division_time" @change="bindPickerChange2"
							:clear="false" placeholder="请选择时间" class="uni-list-cell-picker" style="padding-left: 60px;">
						</uni-data-select>
					</view>
					<mpvue-echarts :echarts="echarts" :onInit="barInit5" canvasId="bar5" ref="barChart5" />
				</view>
				<view class="chart-container">
					<view class="title">
						工作量排行(top10)
						<!-- <uni-data-select v-model="value_time" :localdata="division_time" @change="bindPickerChange"
							:clear="false" placeholder="请选择时间" class="uni-list-cell-picker" style="padding-left: 100px;">
						</uni-data-select> -->
					</view>
					<mpvue-echarts :echarts="echarts" :onInit="barInit4" canvasId="bar4" ref="barChart4" />
				</view>
				
				<!-- <view class="chart-container">
					<view class="title">
						问题整改数排行(top10)
						<uni-data-select v-model="value_time4" :localdata="division_time" @change="bindPickerChange4"
							:clear="false" placeholder="请选择时间" class="uni-list-cell-picker" style="padding-left: 45px;">
						</uni-data-select>
					</view>
					<mpvue-echarts :echarts="echarts" :onInit="barInit2" canvasId="bar2" ref="barChart2" />
				</view> -->
				<view class="chart-container">
					<view class="title">
						高发问题(top10)
						<uni-data-select v-model="value_time3" :localdata="division_time" @change="bindPickerChange3"
							:clear="false" placeholder="请选择时间" class="uni-list-cell-picker" style="padding-left: 85px;">
						</uni-data-select>
					</view>
					<mpvue-echarts :echarts="echarts" :onInit="barInit3" canvasId="bar3" ref="barChart3" />
				</view>
				<view class="chart-container">
					<view class="title">
						问题流量统计
						<!-- <uni-data-select v-model="value_time4" :localdata="division_time" @change="bindPickerChange4"
							:clear="false" placeholder="请选择时间" class="uni-list-cell-picker" style="padding-left: 100px;">
						</uni-data-select> -->
					</view>
					<mpvue-echarts :echarts="echarts" :onInit="lineInit" canvasId="line" ref="lineChart" />
				</view>
				<view class="chart-container">
					<view class="title">
						问题整改率
						<uni-data-select v-model="value_time5" :localdata="division_time" @change="bindPickerChange5"
							:clear="false" placeholder="请选择时间" class="uni-list-cell-picker" style="padding-left: 140px;">
						</uni-data-select>
					</view>
					<mpvue-echarts :echarts="echarts" :onInit="pieInit" canvasId="pie1" ref="pieChart" />
				</view>

			</scroll-view>
		</view>
	</view>

</template>

<script>
	import * as echarts from '@/components/echarts/echarts.min.js';
	import mpvueEcharts from '@/components/mpvue-echarts/src/echarts.vue';
	import {
		data
	} from 'uview-ui/libs/mixin/mixin';
	import {
		mapActions,
		mapState
	} from 'vuex';

	let pieOption = {
		legend: {
			orient: 'vertical',
			x: 'right',
			y: 'bottom',
			itemWidth: 24, // 设置图例图形的宽
			itemHeight: 18, // 设置图例图形的高
			textStyle: {
				color: '#666' // 图例文字颜色
			},
			backgroundColor: '#eee', // 设置整个图例区域背景颜色

		},
		tooltip: {
			trigger: "item"
		},
		grid: {
			height: 125
		},
		series: [{
			type: 'pie',
			center: ['40%', '40%'],
			radius: ['40%', '70%'],
			avoidLabelOverlap: false,
			label: {
				show: false,
				position: 'center'
			},
			emphasis: {

			},
			labelLine: {
				show: false
			},
			data: []
		}]
	};

	let lineOption = {
		animation: false,
		color: ['#37A2DA', '#9FE6B8'],
		grid: {
			height: 185,
			x: 35,
			y: 20,
			x2: 10,
			y2: 30
			// x: 35,
			// x3: 35,
			// x2: 10,
			// y: 30,
			// y2: 25,
			// y3: 25
		},
		calculable: false,
		xAxis: [{
			type: 'category',
			data: [],
		}],
		yAxis: [{
			min: 0, //y轴的最小值
			max: 0, //y轴最大值
			interval: 10, //值之间的间隔
			type: 'value',
			splitArea: {
				show: true
			}
		}],
		series: [{
			itemStyle: {
				normal: {
					label: {
						show: true
					}
				}
			},
			name: '问题数',
			type: 'line',
			data: []
		}]
	};

	let barOption = {
		grid: {
			// top: "25%",

			// left: "10%",

			// right: "20%",
			height: 125,
			// bottom: "35%",
			x: 35,
			y: 20,
			x2: 10,
			y2: 30
		},
		heigth: "auto",
		xAxis: {
			data: [],
			axisLabel: {
				interval: 0, //强制文字产生间隔
				// rotate: 30,     //文字逆时针旋转45°
				textStyle: { //文字样式
					color: "black",
					fontFamily: '微软雅黑',
					fontSize: 10,
					// fontFamily: 'Microsoft YaHei'
				},
				formatter: function(value) //X轴的内容
				{
					var ret = ""; //拼接加\n返回的类目项
					var max = 1; //每行显示的文字字数
					var val = value.length; //X轴内容的文字字数
					var rowN = Math.ceil(val / max); //需要换的行数
					if (rowN > 1) //判断 如果字数大于2就换行
					{
						for (var i = 0; i < rowN; i++) {
							var temp = ""; //每次截取的字符串
							var start = i * max; //开始截取的位置
							var end = start + max; //结束截取的位置
							temp = value.substring(start, end) + "\n";
							ret += temp; //最终的字符串
						}
						return ret;
					} else {
						return value
					}
				},
			}
		},
		yAxis: {
			min: 0, //y轴的最小值
			max: 0, //y轴最大值
			interval: 200, //值之间的间隔
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				color: '#999'
			},
		},
		series: [{
			label: {
				normal: {
					show: true, //开启显示
					position: 'top', //柱形上方
					textStyle: { //数值样式
						color: 'black'
					}
				}
			},
			type: 'bar',
			showBackground: true,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#83bff6'
					},
					{
						offset: 0.5,
						color: '#188df0'
					},
					{
						offset: 1,
						color: '#188df0'
					}
				])
			},
			emphasis: {
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#2378f7'
						},
						{
							offset: 0.7,
							color: '#2378f7'
						},
						{
							offset: 1,
							color: '#83bff6'
						}
					])
				}
			},
			data: []
		}]
	};

	let barOption2 = {
		grid: {
			// top: "25%",

			// left: "10%",

			// right: "20%",
			height: 125,
			// bottom: "35%",
			x: 35,
			y: 20,
			x2: 10,
			y2: 30
		},
		heigth: "auto",
		xAxis: {
			data: [],
			axisLabel: {
				interval: 0, //强制文字产生间隔
				// rotate: 30,     //文字逆时针旋转45°
				textStyle: { //文字样式
					color: "black",
					fontFamily: '微软雅黑',
					fontSize: 10,
					// fontFamily: 'Microsoft YaHei'
				},
				formatter: function(value) //X轴的内容
				{
					var ret = ""; //拼接加\n返回的类目项
					var max = 1; //每行显示的文字字数
					var val = value.length; //X轴内容的文字字数
					var rowN = Math.ceil(val / max); //需要换的行数
					if (rowN > 1) //判断 如果字数大于2就换行
					{
						for (var i = 0; i < rowN; i++) {
							var temp = ""; //每次截取的字符串
							var start = i * max; //开始截取的位置
							var end = start + max; //结束截取的位置
							temp = value.substring(start, end) + "\n";
							ret += temp; //最终的字符串
						}
						return ret;
					} else {
						return value
					}
				},
			}
		},
		yAxis: {
			min: 0, //y轴的最小值
			max: 0, //y轴最大值
			interval: 200, //值之间的间隔
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				color: '#999'
			},
		},
		series: [{
			label: {
				normal: {
					show: true, //开启显示
					position: 'top', //柱形上方
					textStyle: { //数值样式
						color: 'black'
					}
				}
			},
			type: 'bar',
			stack: 'Ad',
			showBackground: true,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#83bff6'
					},
					{
						offset: 0.5,
						color: '#188df0'
					},
					{
						offset: 1,
						color: '#188df0'
					}
				])
			},
			emphasis: {
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#2378f7'
						},
						{
							offset: 0.7,
							color: '#2378f7'
						},
						{
							offset: 1,
							color: '#83bff6'
						}
					])
				}
			},
			data: []
		},{
			label: {
				normal: {
					show: true, //开启显示
					position: 'top', //柱形上方
					textStyle: { //数值样式
						color: 'black'
					}
				}
			},
			stack: 'Ad',
			type: 'bar',
			showBackground: true,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: 'rgb(0, 219, 150)'
					},
					{
						offset: 0.5,
						color: 'rgb(0, 219, 150)'
					},
					{
						offset: 1,
						color: 'rgb(0, 219, 150)'
					}
				])
			},
			emphasis: {
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgb(0, 219, 150)'
						},
						{
							offset: 0.7,
							color: 'rgb(0, 219, 150)'
						},
						{
							offset: 1,
							color: 'rgb(0, 219, 150)'
						}
					])
				}
			},
			data: [1,2,3,1,2,5]
		}]
	};

	let barOption3 = {
		grid: {
			// top: "25%",

			// left: "10%",

			// right: "20%",
			height: 125,
			// bottom: "35%",
			x: 35,
			y: 20,
			x2: 10,
			y2: 30
		},
		heigth: "auto",
		xAxis: {
			data: [],
			axisLabel: {
				interval: 0, //强制文字产生间隔
				// rotate: 30,     //文字逆时针旋转45°
				textStyle: { //文字样式
					color: "black",
					fontFamily: '微软雅黑',
					fontSize: 10,
					// fontFamily: 'Microsoft YaHei'
				},
				formatter: function(value) //X轴的内容
				{
					var ret = ""; //拼接加\n返回的类目项
					var max = 1; //每行显示的文字字数
					var val = value.length; //X轴内容的文字字数
					var rowN = Math.ceil(val / max); //需要换的行数
					if (rowN > 1) //判断 如果字数大于2就换行
					{
						for (var i = 0; i < rowN; i++) {
							var temp = ""; //每次截取的字符串
							var start = i * max; //开始截取的位置
							var end = start + max; //结束截取的位置
							temp = value.substring(start, end) + "\n";
							ret += temp; //最终的字符串
						}
						return ret;
					} else {
						return value
					}
				},
			}
		},
		yAxis: {
			min: 0, //y轴的最小值
			max: 0, //y轴最大值
			interval: 200, //值之间的间隔
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				color: '#999'
			},
		},
		series: [{
			label: {
				normal: {
					show: true, //开启显示
					position: 'top', //柱形上方
					textStyle: { //数值样式
						color: 'black'
					}
				}
			},
			type: 'bar',
			showBackground: true,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#83bff6'
					},
					{
						offset: 0.5,
						color: '#188df0'
					},
					{
						offset: 1,
						color: '#188df0'
					}
				])
			},
			emphasis: {
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#2378f7'
						},
						{
							offset: 0.7,
							color: '#2378f7'
						},
						{
							offset: 1,
							color: '#83bff6'
						}
					])
				}
			},
			data: []
		}]
	};
	let barOption4 = {
		grid: {
			// top: "25%",

			// left: "10%",

			// right: "20%",
			height: 125,
			// bottom: "35%",
			x: 35,
			y: 20,
			x2: 10,
			y2: 30
		},
		heigth: "auto",
		xAxis: {
			data: [],
			axisLabel: {
				interval: 0, //强制文字产生间隔
				// rotate: 30,     //文字逆时针旋转45°
				textStyle: { //文字样式
					color: "black",
					fontFamily: '微软雅黑',
					fontSize: 10,
					// fontFamily: 'Microsoft YaHei'
				},
				formatter: function(value) //X轴的内容
				{
					var ret = ""; //拼接加\n返回的类目项
					var max = 1; //每行显示的文字字数
					var val = value.length; //X轴内容的文字字数
					var rowN = Math.ceil(val / max); //需要换的行数
					if (rowN > 1) //判断 如果字数大于2就换行
					{
						for (var i = 0; i < rowN; i++) {
							var temp = ""; //每次截取的字符串
							var start = i * max; //开始截取的位置
							var end = start + max; //结束截取的位置
							temp = value.substring(start, end) + "\n";
							ret += temp; //最终的字符串
						}
						return ret;
					} else {
						return value
					}
				},
			}
		},
		yAxis: {
			min: 0, //y轴的最小值
			max: 0, //y轴最大值
			interval: 200, //值之间的间隔
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				color: '#999'
			},
		},
		series: [{
			label: {
				normal: {
					show: true, //开启显示
					position: 'top', //柱形上方
					textStyle: { //数值样式
						color: 'black'
					}
				}
			},
			type: 'bar',
			barWidth : 20,
			showBackground: true,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#83bff6'
					},
					{
						offset: 0.5,
						color: '#188df0'
					},
					{
						offset: 1,
						color: '#188df0'
					}
				])
			},
			emphasis: {
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#2378f7'
						},
						{
							offset: 0.7,
							color: '#2378f7'
						},
						{
							offset: 1,
							color: '#83bff6'
						}
					])
				}
			},
			data: []
		}]
	};
	let barOption5 = {
		grid: {
			// top: "25%",

			// left: "10%",

			// right: "20%",
			height: 125,
			// bottom: "35%",
			x: 35,
			y: 20,
			x2: 10,
			y2: 30
		},
		heigth: "auto",
		xAxis: {
			data: [],
			axisLabel: {
				interval: 0, //强制文字产生间隔
				// rotate: 30,     //文字逆时针旋转45°
				textStyle: { //文字样式
					color: "black",
					fontFamily: '微软雅黑',
					fontSize: 10,
					// fontFamily: 'Microsoft YaHei'
				},
				formatter: function(value) //X轴的内容
				{
					var ret = ""; //拼接加\n返回的类目项
					var max = 1; //每行显示的文字字数
					var val = value.length; //X轴内容的文字字数
					var rowN = Math.ceil(val / max); //需要换的行数
					if (rowN > 1) //判断 如果字数大于2就换行
					{
						for (var i = 0; i < rowN; i++) {
							var temp = ""; //每次截取的字符串
							var start = i * max; //开始截取的位置
							var end = start + max; //结束截取的位置
							temp = value.substring(start, end) + "\n";
							ret += temp; //最终的字符串
						}
						return ret;
					} else {
						return value
					}
				},
			}
		},
		yAxis: {
			min: 0, //y轴的最小值
			max: 0, //y轴最大值
			interval: 200, //值之间的间隔
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				color: '#999'
			},
		},
		series: [{
			label: {
				normal: {
					show: true, //开启显示
					position: 'top', //柱形上方
					textStyle: { //数值样式
						color: 'black'
					}
				}
			},
			type: 'bar',
			showBackground: true,
			itemStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#83bff6'
					},
					{
						offset: 0.5,
						color: '#188df0'
					},
					{
						offset: 1,
						color: '#188df0'
					}
				])
			},
			emphasis: {
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#2378f7'
						},
						{
							offset: 0.7,
							color: '#2378f7'
						},
						{
							offset: 1,
							color: '#83bff6'
						}
					])
				}
			},
			data: []
		}]
	};
	export default {
		data() {
			return {
				list: ['日流量', '周流量', '月流量'],
				echarts: echarts,
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度
				problems_num: 0,
				statistics: {
					total1: "",
					total3: "",
					total4: "",
				},
				range:"",
				locations: "",
				locations2: "",
				value_time: "",
				value_time2: "",
				value_time3: "",
				value_time4: "",
				value_time5: "",
				List2_obj:{},
				List8_obj:{},
				List4_obj:{},
				List3_obj:{},
				List6_obj_unfeedback:{},
				List6_obj_feedback:{},
				List6_obj_filed:{},
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
				Fromtime:"",
				end_create_datetime:"",
			}
		},
		onPullDownRefresh() {
			this.getList1();
			this.getList2();
			// this.getList3();
			this.getList4();
			this.getList5();
			this.getList6();
			this.getList7();
			this.getList8();
			uni.stopPullDownRefresh()
		},
		onLoad() {

		},

		components: {
			mpvueEcharts
		},
		computed: mapState({
			stateUser: state => state.user,
			statelocation: state => state.locations,
		}),
		methods: {
			maskClick(){
				
			},
			backhome() {
				uni.switchTab({
					url: "/pages/dashboard/index"
				})
			},
			bindPickerChange(e) {
				this.value_time = e
				this.getList2()
			},
			bindPickerChange2(e){
				this.value_time2 = e
				this.getList8()
			},
			bindPickerChange3(e){
				this.value_time3 = e
				this.getList4()
			},
			// bindPickerChange4(e){
			// 	this.value_time4 = e
			// 	this.getList3()
			// },
			bindPickerChange5(e){
				this.value_time5 = e
				this.getList6()
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
				this.getList1();
				this.getList2();
				// this.getList3();
				this.getList4();
				this.getList5();
				this.getList6();
				this.getList7();
				this.getList8();
			},

			pieInit(canvas, width, height) {
				let pieChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(pieChart)

				pieChart.setOption(pieOption, true)
				return pieChart
			},
			lineInit(canvas, width, height) {
				let lineChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(lineChart)

				lineChart.setOption(lineOption, true)
				return lineChart
			},

			barInit(canvas, width, height) {
				let barChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(barChart)

				barChart.setOption(barOption, true)
				return barChart
			},
			barInit2(canvas, width, height) {
				let barChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(barChart)

				barChart.setOption(barOption2, true)
				return barChart
			},
			barInit3(canvas, width, height) {
				let barChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(barChart)

				barChart.setOption(barOption3, true)
				return barChart
			},
			barInit4(canvas, width, height) {
				let barChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(barChart)

				barChart.setOption(barOption4, true)
				return barChart
			},
			barInit5(canvas, width, height) {
				let barChart = echarts.init(canvas, null, {
					width: width,
					height: height
				})
				canvas.setChart(barChart)

				barChart.setOption(barOption5, true)
				return barChart
			},
			GetBase64Str(str) {
				return btoa(unescape(encodeURIComponent(str)))
			},
			getFullNum(srcNum) {
				const numStr = (srcNum + "").length - 1;
				const firstNumStr = (srcNum + "").substring(0, 1);
				const firstNum = parseInt(firstNumStr) + 1;
				let str = "";
				for (let i = 0; i < numStr; i++) {
					str += "0";
				}
				return firstNum + str;
			},
			onShow() {
				console.log(getCurrentPages())
			},
			//4个格子统计
			getList1() {
				this.$api.getProblem.post({
					"Account-Token": this.statelocation.token,
					"offset": 0,
					"rows": 10
				}).then((response) => {
					// console.log()
					this.statistics.total1 = response.content.count;
				})
				this.$api.ProblemCategories.post({
					"Account-Token": this.statelocation.token,
				}).then(response => {
					this.statistics.total3 = response.content.array.length
				})
				this.$api.getProblem.post({
					"Account-Token": this.statelocation.token,
					"offset": 0,
					"rows": 10,
					"status": "UN_FEEDBACK"
				}).then((response) => {
					// console.log()
					this.statistics.total4 = response.content.count;
				})
			},
			//视频、现场问题
			getList2() {
				console.log(this.value_time)
				if(this.value_time == 1){
					this.Fromtime = this.getDays().startTime
					this.Totime = this.getDays().endTime
					this.List2_obj ={
						"Account-Token": this.statelocation.token,
						"level": 2,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
				}else if(this.value_time == 2){
					this.Fromtime = this.getDays().startTime_30
					this.Totime = this.getDays().endTime
					this.List2_obj ={
						"Account-Token": this.statelocation.token,
						"level": 2,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
				}else{
					this.List2_obj ={
						"Account-Token": this.statelocation.token,
						"level": 2
					}
				}
				this.$api.getDepartmentProblemCount.post(this.List2_obj).then((response) => {
					// this.statistics.total1 = response.content.count;
					this.locations = response.content.array
					response.content.array = response.content.array.sort((a, b) => b.problem_count - a
						.problem_count).slice(0, 10)

					barOption.xAxis.data = []
					barOption.xAxis.data = response.content.array.map(model =>
						model.name);

					barOption.series[0].data = response.content.array.map(model =>
						model.problem_count);
					barOption.series[0].data.splice(10, barOption.series[0].data.length)
					console.log(barOption.series[0].data)
					var seriesnum = barOption.series[0].data[0]

					barOption.series[0].data.forEach((item, index) => {
						seriesnum = Math.max(seriesnum, item);
					})
					seriesnum = this.getFullNum(seriesnum)
					barOption.yAxis.max = seriesnum;
					if (barOption.yAxis.max <= 10) {
						barOption.yAxis.interval = 1
					} else if (barOption.yAxis.max <= 100) {
						barOption.yAxis.interval = 10
					} else if (barOption.yAxis.max <= 1000) {
						barOption.yAxis.interval = 100
					} else if (barOption.yAxis.max <= 10000) {
						barOption.yAxis.interval = 1000
					} else if (barOption.yAxis.max <= 100000) {
						barOption.yAxis.interval = 10000
					}
					this.$refs.barChart1.init();
				})
			},
			// getList3(){
			// 	if(this.value_time4 == 1){
			// 		this.Fromtime = this.getDays().startTime
			// 		this.Totime = this.getDays().endTime
			// 		this.List3_obj ={
			// 			"Account-Token": this.statelocation.token,
			// 			"level": 2,
			// 			"status": "FEEDBACK",
			// 			"start_create_datetime": this.Fromtime,
			// 			"end_create_datetime": this.Totime,
			// 		}
			// 	}else if(this.value_time4 == 2){
			// 		this.Fromtime = this.getDays().startTime_30
			// 		this.Totime = this.getDays().endTime
			// 		this.List3_obj ={
			// 			"Account-Token": this.statelocation.token,
			// 			"level": 2,
			// 			"status": "FEEDBACK",
			// 			"start_create_datetime": this.Fromtime,
			// 			"end_create_datetime": this.Totime,
			// 		}
			// 	}else{
			// 		this.List3_obj ={
			// 			"Account-Token": this.statelocation.token,
			// 			"level": 2,
			// 			"status": "FEEDBACK"
			// 		}
			// 	}
			// 	this.$api.getDepartmentProblemCount.post(this.List3_obj).then((response) => {
			// 		console.log(response.content.array)
			// 		// this.statistics.total1 = response.content.count;
			// 		response.content.array = response.content.array.sort((a, b) => b.problem_count - a
			// 			.problem_count).slice(0, 10)
			// 		barOption2.xAxis.data = []
			// 		barOption2.xAxis.data = response.content.array.map(model =>
			// 			model.name);
			// 		console.log(barOption2.xAxis.data)
			// 		barOption2.series[0].data = response.content.array.map(model =>
			// 			model.problem_count);
				
			// 		var seriesnum2 = barOption2.series[0].data[0]
				
			// 		barOption2.series[0].data.forEach((item, index) => {
			// 			seriesnum2 = Math.max(seriesnum2, item);
			// 		})
			// 		seriesnum2 = this.getFullNum(seriesnum2)
			// 		barOption2.yAxis.max = seriesnum2;
			// 		if (barOption2.yAxis.max <= 10) {
			// 			barOption2.yAxis.interval = 1
			// 		} else if (barOption2.yAxis.max <= 100) {
			// 			barOption2.yAxis.interval = 10
			// 		} else if (barOption2.yAxis.max <= 1000) {
			// 			barOption2.yAxis.interval = 100
			// 		} else if (barOption2.yAxis.max <= 10000) {
			// 			barOption2.yAxis.interval = 1000
			// 		} else if (barOption2.yAxis.max <= 100000) {
			// 			barOption2.yAxis.interval = 10000
			// 		}
			// 		this.$refs.barChart2.init();
			// 	})
			// },
			//高发问题排行
			getList4() {
				if(this.value_time3 == 1){
					this.Fromtime = this.getDays().startTime
					this.Totime = this.getDays().endTime
					this.List4_obj ={
						"Account-Token": this.statelocation.token,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
				}else if(this.value_time3 == 2){
					this.Fromtime = this.getDays().startTime_30
					this.Totime = this.getDays().endTime
					this.List4_obj ={
						"Account-Token": this.statelocation.token,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
				}else{
					this.List4_obj ={
						"Account-Token": this.statelocation.token,
					}
				}
				this.$api.getProblemDepartmentTypeCount.post(this.List4_obj).then(response => {
					response.content.array = response.content.array.sort((a, b) => b.problem_count - a
						.problem_count).slice(0, 10)
					barOption3.xAxis.data = []
					barOption3.xAxis.data = response.content.array.map(model =>
						model.name);
					console.log(barOption3.xAxis.data)
					console.log(response.content.array)
					barOption3.series[0].data = response.content.array.map(model =>
						model.problem_count);
					var seriesnum3 = barOption3.series[0].data[0]
					barOption3.series[0].data.forEach((item, index) => {
						seriesnum3 = Math.max(seriesnum3, item);
					})
					seriesnum3 = this.getFullNum(seriesnum3)
					barOption3.yAxis.max = seriesnum3;
					if (barOption3.yAxis.max <= 10) {
						barOption3.yAxis.interval = 1
					} else if (barOption3.yAxis.max <= 100) {
						barOption3.yAxis.interval = 10
					} else if (barOption3.yAxis.max <= 1000) {
						barOption3.yAxis.interval = 100
					} else if (barOption3.yAxis.max <= 10000) {
						barOption3.yAxis.interval = 1000
					} else if (barOption3.yAxis.max <= 100000) {
						barOption3.yAxis.interval = 10000
					}
					this.$refs.barChart3.init();
				})
			},

			//问题流量
			getList5() {
				this.$api.getProblemCountStatistics.post({
					"Account-Token": this.statelocation.token,
					"start_create_datetime": this.getDays().startTime,
					"end_create_datetime": this.getDays().endTime,
					"statistics_unit": "DAY"
				}).then(response => {
					var result = response.content.array;
					lineOption.xAxis[0].data = result.map(data => data.datetime)
					lineOption.series[0].data = result.map(data => data.count)
					var seriesnum4 = lineOption.series[0].data[0]
					console.log(seriesnum4)
					lineOption.series[0].data.forEach((item, index) => {
						seriesnum4 = Math.max(seriesnum4, item);
					})
					lineOption.series[0].data.forEach((item, index) => {
						seriesnum4 = Math.max(seriesnum4, item);
					})
					seriesnum4 = this.getFullNum(seriesnum4)
					lineOption.yAxis[0].max = seriesnum4
					if (lineOption.yAxis.max <= 10) {
						lineOption.yAxis.interval = 1
					} else if (lineOption.yAxis.max <= 100) {
						lineOption.yAxis.interval = 10
					} else if (lineOption.yAxis.max <= 1000) {
						lineOption.yAxis.interval = 100
					} else if (lineOption.yAxis.max <= 10000) {
						lineOption.yAxis.interval = 1000
					} else if (lineOption.yAxis.max <= 100000) {
						lineOption.yAxis.interval = 10000
					}
					this.$refs.lineChart.init();
				})
			},

			//饼图
			getList6() {
				const that = this
				const problem_status_num = [{
					value: 0,
					name: '未反馈'
				}, {
					value: 0,
					name: '已反馈'
				}, {
					value: 0,
					name: '已归档'
				}]
				if(this.value_time5 == 1){
					this.Fromtime = this.getDays().startTime
					this.Totime = this.getDays().endTime
					this.List6_obj_unfeedback = {
						"Account-Token": this.statelocation.token,
						"status": "UN_FEEDBACK",
						"offset": 0,
						"rows": 10,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
					this.List6_obj_feedback ={
						"Account-Token": this.statelocation.token,
						"status": "FEEDBACK",
						"offset": 0,
						"rows": 10,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
					this.List6_obj_filed = {
						"Account-Token": this.statelocation.token,
						"status": "FILED",
						"offset": 0,
						"rows": 10,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
				}else if(this.value_time5 == 2){
					this.Fromtime = this.getDays().startTime_30
					this.Totime = this.getDays().endTime
					this.List6_obj_unfeedback = {
						"Account-Token": this.statelocation.token,
						"status": "UN_FEEDBACK",
						"offset": 0,
						"rows": 10,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
					this.List6_obj_feedback ={
						"Account-Token": this.statelocation.token,
						"status": "FEEDBACK",
						"offset": 0,
						"rows": 10,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
					this.List6_obj_filed = {
						"Account-Token": this.statelocation.token,
						"status": "FILED",
						"offset": 0,
						"rows": 10,
						"start_create_datetime": this.Fromtime,
						"end_create_datetime": this.Totime,
					}
				}else{
					this.List6_obj_unfeedback = {
						"Account-Token": this.statelocation.token,
						"status": "UN_FEEDBACK",
						"offset": 0,
						"rows": 10
					}
					this.List6_obj_feedback ={
						"Account-Token": this.statelocation.token,
						"status": "FEEDBACK",
						"offset": 0,
						"rows": 10
					}
					this.List6_obj_filed = {
						"Account-Token": this.statelocation.token,
						"status": "FILED",
						"offset": 0,
						"rows": 10
					}
				}
				this.$api.getProblem.post(this.List6_obj_unfeedback).then(response => {
					console.log(response)
					problem_status_num[0].value = response.content.count
					// pieOption.series[0].data.push(problem_status_num[0])
					// this.$refs.pieChart.init();
				});
				this.$api.getProblem.post(this.List6_obj_feedback).then(response => {
					problem_status_num[1].value = response.content.count
					// pieOption.series[0].data.push(problem_status_num[1])
					// this.$refs.pieChart.init();
				})
				this.$api.getProblem.post(this.List6_obj_filed).then(response => {
					problem_status_num[2].value = response.content.count
					// pieOption.series[0].data.push(problem_status_num[2])
					// this.$refs.pieChart.init();
				})
				setTimeout(() => {
					pieOption.series[0].data = problem_status_num
					this.$refs.pieChart.init();
				}, 2000)
			},
			//检查问题排行
			getList7() {
				this.$api.getDepartmentWorkloadFromCache.post({
						"Account-Token": this.statelocation.token
				}).then(response=>{
					// console.log(response)
					response.content.array = response.content.array.sort((a, b) => b.count - a
						.count).slice(0, 10)
					console.log(response.content.array)
					barOption4.xAxis.data = []
					barOption4.xAxis.data = response.content.array.map(model => model.name);
					barOption4.series[0].data = response.content.array.map(model => model
						.count);
					var seriesnum4 = barOption4.series[0].data[0]
					barOption4.series[0].data.forEach((item, index) => {
						seriesnum4 = Math.max(seriesnum4, item);
					})
					seriesnum4 = this.getFullNum(seriesnum4)
					barOption4.yAxis.max = seriesnum4;
					if (barOption4.yAxis.max <= 10) {
						barOption4.yAxis.interval = 1
					} else if (barOption4.yAxis.max <= 100) {
						barOption4.yAxis.interval = 10
					} else if (barOption4.yAxis.max <= 1000) {
						barOption4.yAxis.interval = 100
					} else if (barOption4.yAxis.max <= 10000) {
						barOption4.yAxis.interval = 1000
					} else if (barOption4.yAxis.max <= 100000) {
						barOption4.yAxis.interval = 10000
					}
					this.$refs.barChart4.init();
				})
				// this.$api.ProblemCategories.post({
				// 	"Account-Token": this.statelocation.token
				// }).then(response => {
				// 	const order_num = response.content.array.filter(item => item.name == "检查问题")[0].order_group
				// 	this.$api.getDepartmentProblemCount.post({
				// 		"Account-Token": this.statelocation.token,
				// 		"order_group": order_num,
				// 		"level": 2
				// 	}).then(response => {
				// 		response.content.array = response.content.array.sort((a, b) => b.problem_count - a
				// 			.problem_count).slice(0, 10)
				// 		console.log(response.content.array)
				// 		barOption4.xAxis.data = []
				// 		barOption4.xAxis.data = response.content.array.map(model => model.name);
				// 		barOption4.series[0].data = response.content.array.map(model => model
				// 			.problem_count);
				// 		var seriesnum4 = barOption4.series[0].data[0]
				// 		barOption4.series[0].data.forEach((item, index) => {
				// 			seriesnum4 = Math.max(seriesnum4, item);
				// 		})
				// 		seriesnum4 = this.getFullNum(seriesnum4)
				// 		barOption4.yAxis.max = seriesnum4;
				// 		if (barOption4.yAxis.max <= 10) {
				// 			barOption4.yAxis.interval = 1
				// 		} else if (barOption4.yAxis.max <= 100) {
				// 			barOption4.yAxis.interval = 10
				// 		} else if (barOption4.yAxis.max <= 1000) {
				// 			barOption4.yAxis.interval = 100
				// 		} else if (barOption4.yAxis.max <= 10000) {
				// 			barOption4.yAxis.interval = 1000
				// 		} else if (barOption4.yAxis.max <= 100000) {
				// 			barOption4.yAxis.interval = 10000
				// 		}
				// 		this.$refs.barChart4.init();
				// 	})
				// })
			},
			//自查问题排行
			getList8() {
				this.$api.ProblemCategories.post({
					"Account-Token": this.statelocation.token
				}).then(response => {
					const order_num = response.content.array.filter(item => item.name == "自查问题")[0].order_group
					if(this.value_time2 == 1){
						this.Fromtime = this.getDays().startTime
						this.Totime = this.getDays().endTime
						this.List8_obj = {
							"Account-Token": this.statelocation.token,
							"order_group": order_num,
							"level": 2,
							"start_create_datetime": this.Fromtime,
							"end_create_datetime": this.Totime,
						}
					}else if(this.value_time2 == 2){
						this.Fromtime = this.getDays().startTime_30
						this.Totime = this.getDays().endTime
						this.List8_obj = {
							"Account-Token": this.statelocation.token,
							"order_group": order_num,
							"level": 2,
							"start_create_datetime": this.Fromtime,
							"end_create_datetime": this.Totime,
						}
					}else{
						this.List8_obj = {
							"Account-Token": this.statelocation.token,
							"order_group": order_num,
							"level": 2,
						}
					}
					this.$api.getDepartmentProblemCount.post(this.List8_obj).then(response => {
						response.content.array = response.content.array.sort((a, b) => b.problem_count - a
							.problem_count).slice(0, 10)
						console.log(response.content.array)
						barOption5.xAxis.data = []
						barOption5.xAxis.data = response.content.array.map(model => model.name);
						barOption5.series[0].data = response.content.array.map(model => model
							.problem_count);
						var seriesnum5 = barOption5.series[0].data[0]
						barOption5.series[0].data.forEach((item, index) => {
							seriesnum5 = Math.max(seriesnum5, item);
						})
						seriesnum5 = this.getFullNum(seriesnum5)
						barOption5.yAxis.max = seriesnum5;
						if (barOption5.yAxis.max <= 10) {
							barOption5.yAxis.interval = 1
						} else if (barOption5.yAxis.max <= 100) {
							barOption5.yAxis.interval = 10
						} else if (barOption5.yAxis.max <= 1000) {
							barOption5.yAxis.interval = 100
						} else if (barOption5.yAxis.max <= 10000) {
							barOption5.yAxis.interval = 1000
						} else if (barOption5.yAxis.max <= 100000) {
							barOption5.yAxis.interval = 10000
						}
						this.$refs.barChart5.init();
					})
				})
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

		}
	}
</script>

<style>
	.title2 {
		font-size: 24px;
		font-weight: 300;
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

	.container {
		overflow: hidden;
		padding: 0 15px;
		margin-top: 20px;
		background-color: #F1F1F1;
		display: flex;
		flex-direction: column;
	}


	.demo-layout {
		height: 20px;
		background-color: #2057b5;
	}


	.chart-container {
		border-radius: 15px;
		background-color: #FFFFFF;
		margin-bottom: 15px;
		padding: 10px 10px;
		flex-direction: column;
		display: flex;
		min-height: 275px;
		flex: 1;
	}

	.chart-container2 {
		display: flex;
		justify-content: space-between;
	}

	.title {
		display: flex;
		font-size: 14px;
		font-weight: bold;
	}
</style>
