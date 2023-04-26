<template>
	<view class="" style="background-color: #F1F1F1;">
		<view class="page-top">
			<view class="container-go-back" @click="backhome" hover-class="other-navigator-hover">
				<uni-icons type="back" size="30" style="color: #FFF;position: absolute;left: 17px;top: 45px;">
				</uni-icons>
			</view>
			<h3 class="title">视频督察</h3>
		</view>
		<view class="container">
			<view class="problem-scroll-container">
				<u-subsection mode="subsection" :list="list" :current="current" @change="sectionChange"
					activeColor="#2057B8" fontSize="14" style="padding:0 10px;"></u-subsection>

				<scroll-view scroll-y="true" class="sv" :style="{height:navHeight+'px'}">

					<view class="problem-info-container" style="padding-bottom: 30px">
						<view class="small-title">
							<text>单位名称</text>
							<text style="padding-left:50%;">问题数</text>
						</view>

						<view v-show="show" style="padding-top: 200px;">
							<u-loading-icon size="36"></u-loading-icon>
						</view>

						<view v-show="!show" class="info-container" v-for="(locations, index) in location"
							:key="locations.id">
							<view class="info-icon">
								<image src="../../../static/icon/20230212185025.jpg" mode=""
									style="width: 45px;height: 34px;margin-top: 5px;"></image>
							</view>
							<view class="info-container-name">
								{{locations.name}}
							</view>
							<u-line direction="col"></u-line>
							<view class="info-container-num">
								<progress :percent="locations.count/maxProCount*100"  activeColor="#ff0000" style="margin-right: 10px;flex: 1;"/>
								<!-- <u-line-progress style="margin-right: 10px;" :showText="false"
									:percentage="locations.count/maxProCount*100" activeColor="#ff0000">
								</u-line-progress> -->
								{{locations.count}}
							</view>
							<view class="">
								<!-- 问题数量: -->
								<!-- <view class="progress-container">
										<view :style="width:50%" class="progress-bar"></view>
									</view> -->
								<!-- <navigator url="../"></navigator> -->
								<navigator :url="'/pages/problems/list_my/index_of?id=' + locations.id + '&current='+current"
									hover-class="other-navigator-hover" open-type="reLaunch">
									<uni-icons type="arrow-right" size="40" style="color: #d0d0d0;"></uni-icons>
								</navigator>
							</view>
						</view>

					</view>
				</scroll-view>
			</view>
		</view>
	</view>

</template>

<script>
	import moment from 'moment';
	// import { response } from 'express';
	import {
		mapActions,
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				info: {
					waiting: 0,
					correcting: 0,
					corrected: 0,
					negated: 0,
					reviewing: 0,
					field: 0,
				},
				list: ['最近一周', '最近一月', '全部'],
				location: [],
				current: 2,
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度
				Problems_number: 0,
				processing_ratio: 0,
				modification_ratio: 0,
				maxProCount: 0,
				show: true
			}
		},
		onPullDownRefresh() {
			this.getList();
			uni.stopPullDownRefresh()
		},
		computed: mapState({
			stateUser: state => state.user
		}),
		onLoad() {

		},
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
			this.getList();
			},
			onShow() {
				// this.$api.Locations.all({page_size:999,query_location_level_id:4,query_location_category_id:27}).then(response =>{
				// 	this.location = response.data
				// 	console.log(this.location)
				// })
				this.location.forEach((item, index) => {
					// this.maxproblem_num = Math.max(this.maxproblem_num, item.problem_count);
					this.maxproblem_num += item.problem_count
				})
				console.log(getCurrentPages())
				
			},
			GetBase64Str(str) {
				return btoa(unescape(encodeURIComponent(str)))
			},
			getList() {
				this.show = true;
				var sqlExt = "";

				if (this.current == 0) {
					sqlExt =
						"and (b.created_at between (select current_timestamp - interval '7 day')  and current_timestamp)";

				} else if (this.current == 1) {
					sqlExt =
						"and (b.created_at between (select current_timestamp - interval '1 month')  and current_timestamp)";

				}
				var sql_base64 =
					"select a.id,a.name,a.location_category_id,a.ancestry,count(b.id) as count from locations a left join problems b on a.id = b.location_id  and b.discover_type = 0 "+
					sqlExt +" group by a.id order by count desc"
				sql_base64 = this.GetBase64Str(sql_base64)
				console.log(sql_base64)
				this.$api.QuerySql(
					sql_base64
				).then(res => {
					// console.log(res)
					this.location = res[1].data.content.array.filter(item => item.location_category_id == 27);
					this.location.forEach(
						item => {
							res[1].data.content.array.filter(model => model.ancestry != undefined && model
								.ancestry.indexOf(item.id) >= 0).map(model => item.count += model.count);
						})
					var proArray = this.location.map(model => model.count);
					this.maxProCount = Math.max(...proArray);
					this.show = false;
				})
			console.log(this.maxProCount)
			for(let i=0;i<this.location.length;i++){
				console.log(this.location[i].count)
			}
			},
			sectionChange(e) {
				this.current = e.target.value;
				this.getList();
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
		color: #2e726a;
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
