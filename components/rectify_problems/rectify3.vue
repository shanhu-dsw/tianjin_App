<template>
	<u-popup :show="show" @close="close" @open="open" :closeable="true">
		<view class="info-container">
	
			<view class="uni-list-cell-left">
				审核负责人
			</view>
		</view>
		<view class="info-container">
			<view style="display: flex;">
				<em></em>
				<input class="uni-list-cell-picker2" type="text" placeholder=""
					v-model="current_search_value" @focus="handleinput">
				<input class="uni-list-cell-picker2" type="text" placeholder=""
					v-model="current_search_value2" @focus="handleinput2">
				<input class="uni-list-cell-picker2" type="text" placeholder=""
					v-model="current_search_value3 @focus="handleinput3">
			</view>
			<transition name="app_dialog_dowm">
				<view class="mt-master-container" v-if="showList&&associateWords.length>0"
					@click="close('showList')">
					<view class="mt-master-content" @click.stop>
						<view class="mt-master-wrap">
							<ul class="associate-list">
								<li class="associate-item" v-for="(item,index) of associateWords"
									:key="index" @click="hotClick(item)">
									{{item}}
								</li>
							</ul>
						</view>
					</view>
				</view>
			</transition>
			<transition name="app_dialog_dowm">
				<view class="mt-master-container" v-if="showList2&&associateWords.length>0"
					@click="close('showList2')">
					<view class="mt-master-content" @click.stop>
						<view class="mt-master-wrap">
							<ul class="associate-list">
								<li class="associate-item" v-for="(item,index) of associateWords"
									:key="index" @click="hotClick2(item)">
									{{item}}
								</li>
							</ul>
						</view>
					</view>
				</view>
			</transition>
			<transition name="app_dialog_dowm">
				<view class="mt-master-container" v-if="showList3&&associateWords.length>0"
					@click="close('showList3')">
					<view class="mt-master-content" @click.stop>
						<view class="mt-master-wrap">
							<ul class="associate-list">
								<li class="associate-item" v-for="(item,index) of associateWords"
									:key="index" @click="hotClick3(item)">
									{{item}}
								</li>
							</ul>
						</view>
					</view>
				</view>
			</transition>
		</view>
		<view class="info-container">
			<view class="uni-list-cell-left">
				审核时间
			</view>
		</view>
		<view class="info-container">
			<view class="uni-list-cell-db">
				
			</view>
		</view>
		<view class="info-container">
			<view class="uni-list-cell-left">
				审核说明
			</view>
	
		</view>
	
		<view class="info-container">
			<textarea class="uni-list-cell-textarea" placeholder="请输入审核说明"
				v-model="problem_state" />
		</view>
		<view class="info-container" style="margin: 0;">
			<button type="primary" class="submit-button" @click="updata_state">提交</button>
		</view>
	</u-popup>
</template>

<script>
	export default {
		data() {
			return {
				current_search_value: "",
				current_search_value2: "",
				current_search_value3: "",
				show: true,
				showList: false,
				showList2: false,
				showList3: false,
				issued_at: "",
				problem_state: "",
				imageValue: "",
				imageStyles: {
					border: {
						color: "#1E90FF",
						width: 2,
						radius: '1px'
					}
				},
			}
		},
		methods: {
			open() {
	
			},
			select(e) {
				this.imageValue = this.imageValue.concat(e.tempFilePaths)
				console.log(this.imageValue)
			},
			updata_state() {
				var current_search_value_All = this.current_search_value + this.current_search_value2 + this
					.current_search_value3
				this.$api.Problems.pathch_reviewing_none([this.id, current_search_value_All, this.problem_state, this
					.issued_at
				]).then((
					response) => {
					this.Getproblems()
					console.log(response)
					this.show = false
					uni.showToast({
						title: "修改成功",
					})
				}).catch((Error) => {
					console.log(Error)
				})
			},
			close() {
				this.show = false
				// console.log('close');
			},
			// 输入框获取焦点时，展示联想词列表
			handleinput() {
				this.associateWords = []
				this.showList = true
				this.showList2 = false
				this.showList2 = false
			},
			handleinput2() {
				this.associateWords = []
				this.showList = false
				this.showList3 = false
				this.showList2 = true
			},
			handleinput3() {
				this.associateWords = []
				this.showList = false
				this.showList2 = false
				this.showList3 = true
			},
			hotClick(val) {
				this.current_search_value = val
				this.showList = false
			},
			hotClick2(val) {
				this.current_search_value2 = val
				this.showList2 = false
			},
			hotClick3(val) {
				this.current_search_value3 = val
				this.showList3 = false
			},
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
	
		padding-left: 20px;
		height: 36px;
		line-height: 36px;
		width: 130px;
		background-color: #FFFFFF;
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
		position: relative;
		left: -20px;
	}
	
	.title {
		font-size: 24px;
		font-weight: 300;
	}
	
	.sv {
		margin-top: 10px;
	}
	
	.problem-info-container {
		border-radius: 15px;
		background-color: #FFFFFF;
		margin-bottom: 15px;
		padding: 10px 10px;
	}
	
	.problem-info-container2 {
		border-radius: 15px;
		background-color: #FFFFFF;
		margin-bottom: 15px;
		padding: 10px 10px;
		display: none;
	}
	
	.info-container {
		display: flex;
		margin: 10px;
	}
	
	.info-title {
		width: 80px !important;
		font-size: 14px;
		text-align: justify;
		text-align-last: justify;
		color: #686666;
		font-weight: 300;
	}
	
	.problem-info-text {
		width: 100%;
		margin-left: 30px;
		font-size: 14px;
	}
	
	.change-status-btn-container {
		width: 100%;
		margin-left: 30px;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	
	.change-status-btn {
		background-color: #808080;
		color: #FFFFFF;
		font-weight: 600;
		font-size: 10px;
		padding: 0 8px;
		margin: 0 10px 0 0;
		height: 25px;
		line-height: 25px;
		border-radius: 5px;
	}
	
	.card-left-image {
		border-radius: 5px;
		width: 100%;
	}
	
	.image-container {
		margin: 10px 10px 20px 10px;
	}
	
	.card-left-image-time {
		color: #686666;
		font-size: 12px;
		background-color: #E5E5E5;
		margin: 3px 0 10px 0;
		border-radius: 5px;
		padding: 2px;
		float: right;
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
	
	.uni-list-cell-left {
		flex-shrink: 0;
		margin-right: 5px;
	}
	
	.uni-list-cell-picker2 {
		color: #8F8F94;
		border: 1px solid #1E90FF;
		height: 30px;
		line-height: 30px;
		margin-top: 5px;
		/* padding-left: 10px; */
		border-radius: 12px;
	}
	
	.info-container {
		/* display: flex; */
		/* margin: 20px 10px; */
		/* justify-content: space-between; */
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
	}
	
	.uni-list-cell-picker2 {
		color: #8F8F94;
		border: 1px solid #1E90FF;
		height: 30px;
		line-height: 30px;
		margin-top: 5px;
		/* padding-left: 10px; */
		border-radius: 12px;
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
	
	.submit-button {
		height: 40px;
		width: 80px;
		line-height: 40px;
	}
	
	.associate-item {
		color: black;
		border: 1px solid #1E90FF;
		height: 22px;
		line-height: 22px;
		margin-top: 5px;
		padding-left: 10px;
		border-radius: 12px;
		width: 170px;
		list-style-type: none;
	}
	
	.page-top {
		height: 120px;
		width: 100%;
		padding: 0 0;
		background-color: #2057b5;
		border-bottom-right-radius: 15%;
		border-bottom-left-radius: 15%;
		/* margin-bottom: 35px; */
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center
	}
</style>