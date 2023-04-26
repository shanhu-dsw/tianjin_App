<template>
	<view class="">
		<u-popup  @close="close" @open="open" :closeable="true">
			<view class="info-container">
				<view class="uni-list-cell-left">
					整改说明
				</view>

			</view>

			<view class="info-container">
				<textarea class="uni-list-cell-textarea" placeholder="请输入整改说明" v-model="problem_state" />
			</view>
			<view class="info-container">
				<view class="uni-list-cell-left">
					上传整改图片
				</view>
			</view>

			<view style="margin: 15px;">
				<uni-file-picker file-mediatype="image" mode="grid" file-extname="png,jpg" :limit="999" ref="files"
					:auto-upload="false" @select="select" :image-styles="imageStyles" />
			</view>
			<view class="info-container" style="margin: 0;">
				<button type="primary" class="submit-button" @click="updata_state">提交</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState
	} from 'vuex';

	export default {
		// props: ['show','id',"is_fact"],
		data() {
			return {
				problem_state: "",
				imageValue: "",
				statusname: "",
				file_content:"",
				file_suffix:"",
				imageStyles: {
					border: {
						color: "#1E90FF",
						width: 2,
						radius: '1px'
					}
				},
			}
		},
		computed: mapState({
			stateProblemCategories: state => state.problem_categories,
			statelocation: state => state.locations,
			stateUser: state => state.user
		}),
		methods: {
			onShow() {
				this.$api.Admins.update(this.statelocation.token).then((response) => {
					this.statusname = response.content.array
				})
			},
			open() {

			},
			base64ToBlob(urlData) {
				 const image = new Image() // 新建一个img标签（还没嵌入DOM节点)
				      //blob:http://localhost:8080/b878edea-e649-4f8d-b723-c3f25454141b
				      image.src = urlData;
				      image.onload = () => {
				        const canvas = document.createElement('canvas')
				        canvas.width = image.width
				        canvas.height = image.height
				        const context = canvas.getContext('2d')
				        context.drawImage(image, 0, 0, image.width, image.height);
				        let imgUrl = canvas.toDataURL() //图片的base64地址
				        console.log(imgUrl);
						this.file_content +=imgUrl+"|"
						this.file_suffix += "PNG|"
						}
			},
			select(e) {
				this.imageValue = this.imageValue.concat(e.tempFilePaths)
				console.log(this.imageValue)
				this.base64ToBlob(this.imageValue)
			},
			updata_state() {

				this.$api.addFeedback.post({
					"Account-Token": this.statelocation.token,
					"problem_uuid": this.id,
					"from_uuid": this.stateUser.uuid,
					"content": this.problem_state,
					"file_content":this.file_content,
					"file_suffix":this.file_suffix
				}).then((
					response) => {
					this.$api.modifyProblem.post({
						"Account-Token": this.statelocation.token,
						"uuid": this.id,
						"feedback":"FEEDBACK"
					}).then((response) => {
						console.log(response)
						this.show = false
						this.is_fact = "FEEDBACK"
						// this.Getproblems()
						uni.showToast({
							title: "修改成功",
						})
					}).catch((Error) => {
						uni.showToast({
							title: "修改失败",
							icon: "none"
						})
						console.log(Error)
					})
				}).catch((Error) => {
					console.log(Error)
				})
				
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
