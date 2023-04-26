<template>
	<view class="">
		<view class="page-top">
			<view class="container-go-back" @click="backhome" hover-class="other-navigator-hover">
				<uni-icons type="back" size="30" style="color: #FFF;position: absolute;left: 17px;top: 45px;">
				</uni-icons>
			</view>
			<h3 class="title">问题详情</h3>
		</view>
		<view class="container container-go-back">
			<view class="problem-scroll-container">
				<view class="problem-info-container" style="margin-top: 5px;">
					<uni-segmented-control :current="current" :values="items" :style-type="styleType"
						:active-color="activeColor" @clickItem="onClickItem" />
				</view>
				<scroll-view scroll-y="true" class="sv" :style="{height:navHeight+'px'}">
					<view class="problem-info-container" style="" v-show="problem_show">
						<scroll-view scroll-y="true" class="sv">
							<view class=""
								style="display: flex;margin:10px;height: 70px;line-height: 35px; font-size: 14px;">
								<view
									style="width: 80px;background-color: #ff5a41;text-align: center;color: #FFF;border-radius: 5px">
									<view>
										编号
										<p>
											#{{problem.number}}
										</p>
									</view>
								</view>
								<view style="position: absolute;top: 10px;left: 110px;">
									<uni-icons type="calendar" size="18" style="padding-right: 5px;"></uni-icons>
									{{ moment(problem.create_datetime).format('YYYY-MM-DD HH:mm:ss') }}
								</view>
								<view style="position: absolute;top: 45px;left: 110px;">
									<uni-icons type="staff" size="18" style="padding-right: 5px;">
									</uni-icons>
									{{problem.department_name }}
									<text v-if="problem.status == 'FILED'" class="card-right-status3">
										{{$t(problem.status)}}
									</text>
									<text v-else
										:class="[problem.status == 'UN_FEEDBACK'?'card-right-status':'card-right-status2']">
										{{$t(problem.status)}}
									</text>
								</view>
							</view>
							<view class="info-container">
								<text class="info-title">问题类型:</text>
								<text
									class="problem-info-text">{{ problem.problem_department_type_parent_name ?   problem.problem_department_type_parent_name : '暂无问题类型' }}</text>
							</view>
							<view class="info-container">
								<text class="info-title">问题细目:</text>
								<text
									class="problem-info-text">{{ problem.problem_department_type_name ?   problem.problem_department_type_name : '暂无问题类型' }}</text>
							</view>
							<view class="info-container">
								<text class="info-title">备注信息:</text>
								<u-parse class="problem-info-text" style="width: 225px;margin-left: 0;"
									:content="problem.content"></u-parse>
								<!-- <view type="text" class="problem-info-text"
									style="width: 225px;border: 1px solid #b0b0b0;margin-left: 0;">
									{{problem.content !== "null" ? problem.content : '暂无备注信息'}}
								</view> -->
								<!-- {{problem.content ? problem.content : '无备注信息'}} -->
							</view>
							<view class="info-container">
								<text class="info-title">检查单位: </text>
								<text class="problem-info-text">{{ problem.from_department_name }}</text>
							</view>
							<view class="info-container">
								<text class="info-title">督察人员:</text>
								<text class="problem-info-text">{{problem.from_real_name}}</text>
							</view>

							<!-- <view class="info-container">
								<text class="info-title">是否属实:</text>
								<text class="problem-info-text">
									<u-tag :text="$t(this.problem.is_fact)" type="warning"
										style="width: 30%;text-align: center;"></u-tag>
								</text>
							</view> -->
							<view class="info-container">
								<text class="info-title">问题责任人:</text>
								<text
									class="problem-info-text">{{problem_responsible ?problem_responsible : '暂无问题责任人'}}</text>
							</view>
							<view class="info-container" style="border: 0px;">
								<text class="info-title">问题附件:</text>
							</view>

							<view class="image-container" :key="index"
								v-for="(evidence, index) in problem.storage_file">
								<image class="card-left-image" mode='widthFix' :src="baseurl + evidence.url">
									<uni-icons type="close" size="30" class="delete_icon" color="black"
										@click="remove_img(evidence.uuid)" v-show="compile_show">
									</uni-icons>
								</image>
								<text
									class=" card-left-image-time">{{ moment(evidence.created_at).format('YYYY-MM-DD HH:mm:ss') }}</text>
							</view>
						</scroll-view>
						<view class="info-container" style="border: 0px;">
							<button @click="compile" v-show="compile_show" class="problem_alter">编辑</button>
							<!-- <button @click="post_face" v-show="postface_show" class="problem_alter">反馈</button> -->
						</view>
					</view>
					<view class="problem-info-container" style="" v-show="face_show">
						<scroll-view scroll-y="true" class="sv" style="height:80%">
							<view class=""
								style="display: flex;margin:10px;height: 70px;line-height: 35px;font-size: 14px;">
								<view
									style="width: 80px;background-color: #ff5a41;text-align: center;color: #FFF;border-radius: 5px">
									<view>
										编号
										<p>
											#{{problem.number}}
										</p>
									</view>
								</view>
								<view style="position: absolute;top: 10px;left: 110px;">
									<uni-icons type="calendar" size="18" style="padding-right: 5px;"></uni-icons>
									{{ moment(problem.create_datetime).format('YYYY-MM-DD HH:mm:ss') }}
								</view>
								<view style="position: absolute;top: 45px;left: 110px;">
									<uni-icons type="staff" size="18" style="padding-right: 5px;"></uni-icons>
									{{problem.department_name }}
									<text v-if="problem.status == 'FILED'" class="card-right-status3">
										{{$t(problem.status)}}
									</text>
									<text v-else
										:class="[problem.status == 'UN_FEEDBACK'?'card-right-status':'card-right-status2']">
										{{$t(problem.status)}}
									</text>
								</view>
							</view>
							<view class="info-container">
								<text class="info-title">是否属实:</text>
								<text class="problem-info-text">{{$t(problem.is_fact) }}</text>
							</view>
							<view class="info-container">
								<text class="info-title">反馈人员:</text>
								<text
									class="problem-info-text">{{ problem_feeback.from_admin_array ?   problem_feeback.from_admin_array[0].real_name  : '暂无反馈人员' }}</text>
							</view>
							<view class="info-container">
								<text class="info-title">反馈时间:</text>
								<text class="problem-info-text">{{ problem_feeback.create_datetime }}</text>
							</view>

							<view class="info-container">
								<text class="info-title">反馈内容:</text>
								<u-parse class="problem-info-text" style="width: 225px;margin-left: 0;"
									:content="problem_feeback.content"></u-parse>
								<!-- <view type="text" class="problem-info-text"
									style="width: 225px;border: 1px solid #b0b0b0;margin-left: 0;">
									{{problem.content !== "null" ? problem.content : '暂无备注信息'}}
								</view> -->
								<!-- {{problem.content ? problem.content : '无备注信息'}} -->
							</view>

							<view class="info-container" style="border: 0px;">
								<text class="info-title">反馈附件:</text>
							</view>

							<view class="image-container" :key="index"
								v-for="(evidence, index) in problem_feeback.storage_file">
								<image class="card-left-image" mode='widthFix' :src="baseurl + evidence.url">
									<uni-icons type="close" size="30" class="delete_icon" color="black"
										@click="remove_img(evidence.uuid)" v-show="postface_show">
									</uni-icons>
								</image>
								<text
									class="card-left-image-time">{{ moment(evidence.created_at).format('YYYY-MM-DD HH:mm:ss') }}</text>
							</view>
						</scroll-view>
						<view class="info-container" style="border: 0px;">
							<!-- <button @click="compile" v-show="compile_show" class="problem_alter">编辑</button> -->
						</view>
					</view>

					<view class="problem-info-container" style="" v-show="face_create_show">
						<scroll-view scroll-y="true" class="sv" style="height:80%">
							<view class=""
								style="display: flex;margin:10px;height: 70px;line-height: 35px;font-size: 14px;">
								<view
									style="width: 80px;background-color: #ff5a41;text-align: center;color: #FFF;border-radius: 5px">
									<view>
										编号
										<p>
											#{{problem.number}}
										</p>
									</view>
								</view>
								<view style="position: absolute;top: 10px;left: 110px;">
									<uni-icons type="calendar" size="18" style="padding-right: 5px;"></uni-icons>
									{{ moment(problem.create_datetime).format('YYYY-MM-DD HH:mm:ss') }}
								</view>
								<view style="position: absolute;top: 45px;left: 110px;">
									<uni-icons type="staff" size="18" style="padding-right: 5px;"></uni-icons>
									{{problem.department_name }}
									<text v-if="problem.status == 'FILED'" class="card-right-status3">
										{{$t(problem.status)}}
									</text>
									<text v-else
										:class="[problem.status == 'UN_FEEDBACK'?'card-right-status':'card-right-status2']">
										{{$t(problem.status)}}
									</text>
								</view>
							</view>
							<view class="info-container" style="line-height: 200%;">
								<text class="info-title">是否属实:</text>
								<uni-data-select v-model="value_isfact" :localdata="range" :clear="false"
									@change="change_isfact" style="margin-left: 80px;"></uni-data-select>
								<!-- <text class="problem-info-text">{{$t(problem.is_fact) }}</text> -->
							</view>
							<view class="info-container">
								<text class="info-title">反馈人员:</text>
								<text class="problem-info-text">{{ negated_admin }}</text>
							</view>
							<view class="info-container">
								<text class="info-title">问题责任人:</text>
								<el-select size="small" v-model="value_select" multiple filterable placeholder="请选择"
									style="width:170px;border: 0;" @change="options_change">
									<el-option v-for="item in options" :key="item.value" :label="item.real_name"
										:value="item.uuid">
									</el-option>
								</el-select>
							</view>
							<view class="info-container">
								<text class="info-title">反馈时间:</text>
								<text class="problem-info-text">{{ issued_at }}</text>
							</view>

							<view class="info-container">
								<text class="info-title">反馈内容:</text>
								<textarea type="text" class="problem-info-text"
									style="width: 225px;height: 90px;border: 1px solid #b0b0b0;margin-left: 0;text-align: left;"
									v-model="corrected_note"></textarea>
							</view>

							<view class="info-container" style="border: 0px;">
								<text class="info-title">反馈附件:</text>
							</view>

							<view style="margin: 15px;">
								<uni-file-picker file-mediatype="image" mode="grid" :limit="10" ref="files"
									:auto-upload="false" @delete="deleteimg" @select="select"
									:image-styles="imageStyles" />
							</view>
							<view class="info-container" style="border: 0px;">
								<!-- <button @click="compile" v-show="compile_show" class="problem_alter">编辑</button> -->
								<button @click="problemFeedback" class="problem_alter">提交</button>
							</view>
						</scroll-view>
					</view>
					<view class="info-container" style="border: 0px;">
						<!-- <button @click="compile" v-show="compile_show" class="problem_alter">编辑</button> -->
						<button @click="post_face" v-show="postface_show" class="problem_alter">反馈</button>
					</view>
				</scroll-view>

			</view>
		</view>
	</view>

</template>

<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import moment from 'moment';
	import CONFIG from "../../../config/config.js"
	import ReplaceRealUrl from "../../../service/comFun.js"
	import getRole from "../../../Role_judgment/Role_judgment.js"
	import {
		mapActions,
		mapState
	} from 'vuex';
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	export default {
		components: {
			MxDatePicker,
		},
		data() {
			return {
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度
				items: ['问题详情', '问题反馈'], //问题类型切换
				activeColor: '#007aff', //问题类型切换颜色
				current: 0, ////问题类型切换下标
				styleType: "text", //问题类型切换样式
				problem_responsible: "", //问题责任人
				value_isfact: "FACT", //是否属实
				range: [{
						value: "FACT",
						text: "属实"
					},
					{
						value: "NOT_FACT",
						text: "失实"
					},
				], //是否属实切换
				problem: {}, //问题列表数据
				problem_feeback: {}, //反馈附件
				filepath: "", //选择的反馈图片base64
				file_suffix: "", //选择反馈图片的后缀
				problem_show: true, //问题详情列表模块控制
				imageStyles: {
					border: {
						color: "#1E90FF",
						width: 2,
						radius: '1px'
					}
				}, //图片选择组件的样式
				imageValue: [], //选择的图片
				baseurl: '', //图片显示前缀
				problemFeedback_obj: {}, //提交反馈的参数
				id: null, //跳转传的问题uuid
				value: "", //
				value_select: [], //选中的问题责任人
				options: [], //根据单位取到对应问题责任人
				responsible_uuids: "", //选中的问题责任人的uuid
				face_show: false, //反馈详情列表模块控制
				face_create_show: false, //创建和编辑反馈模块控制
				// modifyProblem_note: true,
				// modifyProblem_note2: false,
				compile_show: false, //编辑按钮控制
				postface_show: false, //反馈按钮控制
				type: 'rangetime',
				issued_at: "", //反馈时间
				corrected_note: "", //反馈内容
				negated_admin: "", //反馈人员
				problem_type: "", //问题类型
				Feedback_id: "",
				// fact_status: "FACT",
				location_message: [], //反馈通知人
			}
		},
		computed: mapState({
			stateProblemCategories: state => state.problem_categories,
			stateUser: state => state.user,
			statelocation: state => state.locations,
		}),
		onLoad(options) {
			this.id = options.id
			this.problem_type = options.problem_type
		},
		onPullDownRefresh() {
			// this.$router.go(0)
			this.onClickItem()
			uni.stopPullDownRefresh()
		},
		methods: {
			moment: moment,
			backhome() {
				uni.navigateBack({
					//关闭当前页面，返回上一页面或多级页面。
					delta: 1
				});
				// uni.reLaunch({
				// 	url: "./index_of?id=" + this.problem.to_uuid + "&name=" + this.problem.department_name
				// })
			},
			remove_img(img_uuid) {
				console.log(img_uuid)
				const _this = this
				var token = this.stateUser.token
				uni.showModal({
					title: '提示',
					// 提示文字
					content: '确认删除该图片吗？',
					// 取消按钮的文字自定义
					cancelText: "取消",
					// 确认按钮的文字自定义
					confirmText: "删除",
					//删除字体的颜色
					confirmColor: 'red',
					//取消字体的颜色
					cancelColor: '#000000',
					success: function(res) {
						console.log(res)
						// console.log(token)
						if (res.confirm) {
							// 执行确认后的操作
							console.log(token)
							console.log(CONFIG.headers())
							uni.request({
								url: CONFIG.base_url() +
									"/supervision.spot.StorageFile/removeStorageFile",
								method: "post",
								data: {
									"Account-Token": token,
									"uuid": img_uuid
								},
								header: CONFIG.headers()
							}).then(response => {
								if (response[1].data.status == "SUCCESS") {
									uni.showToast({
										title: "删除成功"
									})
									_this.onClickItem()
								}
							})
						} else {
							// 执行取消后的操作
						}
					}
				})
			},
			onClickItem(e) {
				if (e) {
					this.current = e.currentIndex
				}
				console.log(this.items[this.current])
				if (this.items[this.current] == "问题详情") {
					this.problem_show = true
					this.face_show = false
					this.face_create_show = false
					this.postface_show = false
					this.Getproblems()
				} else {
					this.$api.getProblemExact.post({
						"Account-Token": this.statelocation.token,
						"uuid": this.id,
						"offset": 0,
						"rows": 10
					}).then(response => {
						this.problem = response.content.array[0]
						if (getRole(this.stateUser.admin_info[0].role_name).is_problem_modify) {
							this.postface_show = true
						}

						switch (this.problem.status) {
							case "FEEDBACK":
								this.face_show = true
								this.$api.getFeedback.post({
									"Account-Token": this.statelocation.token,
									"problem_uuid": this.id,
									"offset": 0,
									"rows": 10
								}).then(response => {
									this.Feedback_id = response.content.array[0].uuid
									this.problem_feeback = response.content.array[0]
									this.corrected_note = response.content.array[0].content
								})
								break;
							case "FILED":
								this.face_show = true
								this.postface_show = false
								this.$api.getFeedback.post({
									"Account-Token": this.statelocation.token,
									"problem_uuid": this.id,
									"offset": 0,
									"rows": 10
								}).then(response => {
									this.Feedback_id = response.content.array[0].uuid
									this.problem_feeback = response.content.array[0]
									this.corrected_note = response.content.array[0].content
								})
								break;
							default:
								uni.showToast({
									title: "暂未反馈",
									icon: "none"
								})
								this.face_show = false
						}
						this.problem_show = false
						this.face_create_show = false
					})
				}
			},
			navigateBack() {
				uni.switchTab({
					url: '/pages/problems/index/index'
				});
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
				this.issued_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
				this.isfeeback_name = this.stateUser
				this.baseurl = CONFIG.url_img()
				this.negated_admin = this.stateUser.admin_info[0].real_name
				// this.issued_at = this.problem.issued_at
				this.Getproblems()
				const role_name = this.stateUser.admin_info[0].role_name
				console.log(this.problem)
			},
			select(e) {
				this.imageValue = this.imageValue.concat(e.tempFilePaths)
				e.tempFiles.map(data => {
					this.file_suffix += data.extname.toUpperCase() + "|"
				})
				console.log(this.imageValue)
				this.filepath = ""
				this.imageValue.map(data => {
					// this.base64ToBlob(data)
					this.imgToBase64(data).then(base64 => {
						this.filepath += base64 + "|"
						// console.log("problem.file_content:" + this.problem.file_content)
					}).catch(e => {
						console.log(e)
					})
				})

			}, //附件上传
			change_isfact(e) {
				this.value_isfact = e
				console.log(e)
				// console.log(this.value_isfact)
			},
			deleteimg(e) {
				console.log(this.imageValue)
				const raw = e.tempFile.extname.toUpperCase() + "|"
				this.file_suffix = this.file_suffix.replace(raw, "")
				const num = this.imageValue.indexOf(e.tempFilePath);
				console.log(num)
				this.imageValue.splice(num, 1)
				console.log(this.imageValue)
				this.filepath = ""
				this.imageValue.map(data => {
					this.imgToBase64(data).then(base64 => {
						this.problem.file_content += base64 + "|"
						// console.log("problem.file_content:" + this.problem.file_content)
					}).catch(e => {
						console.log(e)
					})
					// this.base64ToBlob(data)
				})
			}, //删除附件
			GetBase64Str(str) {
				return btoa(unescape(encodeURIComponent(str)))
			},
			imgToBase64(data) {
				return new Promise((resolve, reject) => {
					pathToBase64(data).then(base64 => {
						resolve(base64)
					}).catch(error => {
						console.error(error)
						reject(error)
					})
				})
			},
			options_change() {
				console.log(this.value_select)
				this.responsible_uuids = ""
				this.value_select.map(data => {
					this.responsible_uuids += data + ";"
				})
				this.responsible_uuids = this.responsible_uuids.slice(0, this.responsible_uuids
					.length - 1);
				console.log(this.responsible_uuids)
			},
			Getproblems() {
				const role_name = this.stateUser.admin_info[0].role_name
				this.$api.getProblemExact.post({
					"Account-Token": this.statelocation.token,
					"uuid": this.id,
					"offset": 0,
					"rows": 10
				}).then((response) => {

					this.problem = response.content.array[0]
					if (this.stateUser.admin_info[0].parent_array.length >= 2) {
						this.stateUser.admin_info[0].department_uuid = this.stateUser.admin_info[0].parent_array[1]
							.uuid
					}
					// console.log(response.content.array[0].responsible_real_name.length)
					if (response.content.array[0].responsible_real_name) {
						if (response.content.array[0].responsible_real_name.length >= 1) {
							this.problem_responsible = ""
							response.content.array[0].responsible_real_name.map((data, index) => {
								console.log(data)
								this.problem_responsible += response.content.array[0]
									.responsible_real_name[
										index] + "(" + response.content.array[0].responsible_account_name[
										index] + ")" + "  "
							})
							console.log(this.problem_responsible)
						}
					}
					console.log()
					if (getRole(this.stateUser.admin_info[0].role_name).is_problem_feeback) {
						this.compile_show = true
					}
					// if (getRole(this.stateUser.admin_info[0].role_name).is_problem_modify) {
					// 	this.postface_show = true
					// }
					if (this.stateUser.uuid == this.problem.from_uuid) {
						this.compile_show = true
					}
					console.log(this.stateUser.admin_info[0].role_name)
					console.log(this.stateUser.admin_info[0].department_uuid)
					console.log(this.problem.from_department_uuid)
					// if(this.stateUser.admin_info[0].role_name == "zd_leader" && this.stateUser.admin_info[0].department_uuid == this.problem.from_department_uuid){
					// 	this.compile_show = true
					// }
					if (response.content.array[0].responsible_uuid) {
						this.value_select = []
						response.content.array[0].responsible_uuid.map((data, index) => {
							this.value_select.push(data)
						})
						console.log(this.value_select)
					}
					this.$api.Admins.post({
						"Account-Token": this.statelocation.token,
						"offset": 0,
						"rows": 9999,
						"all_from_department_uuid": this.problem.to_uuid
					}).then(response => {
						console.log(response)
						this.options = response.content.array
						this.options.map(data => {
							data.real_name = data.real_name + "(" + data.name + ")"
						})
						// response.content.array.map(data => {
						// 	if (this.stateUser.uuid == data.uuid) {
						// 		this.postface_show = true
						// 	}
						// })
					})

					this.$api.Admins.post({
						"Account-Token": this.statelocation.token,
						"offset": 0,
						"rows": 9999,
						"manage_department_uuid_like": this.problem.to_uuid
					}).then(response => {
						console.log(response)
						this.location_message = response.content.array
						// response.content.array.map(data => {
						// 	if (this.stateUser.uuid == data.uuid) {
						// 		this.postface_show = true
						// 	}
						// })
					})
					if (this.problem.status == "FEEDBACK") {
						this.value_isfact = response.content.array[0].is_fact
						this.compile_show = false
						console.log(this.value_isfact)
					}
					if (this.problem.status == "FILED") {
						this.compile_show = false
						this.postface_show = false
						// this.modifyProblem_note = true
						// this.modifyProblem_note2 = false
					}
				})
			},
			compile() {
				console.log(123)
				uni.navigateTo({
					url: "/pages/problems/list_unfeeback/compile" + "?id=" + this.id + "&content=" + this
						.problem.content
				})
			}, //跳转编辑页

			post_face() {
				this.face_show = false
				this.face_create_show = true
				this.postface_show = false
			},
			onShow() {
				console.log(getCurrentPages())
			},
			postFeedback_file() {
				uni.showLoading({
					title: '上传反馈中',
					mask: true
				});
				this.value_select.map(item => {
					this.location_message.push({
						uuid: item
					})
				})
				this.$api.addFeedback.post(this.problemFeedback_obj).then(response => {
					if (response.status == "SUCCESS") {

						this.$api.modifyProblem.post({
							"Account-Token": this.statelocation.token,
							"uuid": this.id,
							"status": "FEEDBACK",
							"fact": this.value_isfact
						}).then(response => {
							if (response.status == "SUCCESS") {
								this.file_suffix = ""
								this.filepath = ""
								this.imageValue = []
								this.$refs.files.clearFiles()
								this.face_create_show = false
								this.postface_show = true
								this.onClickItem()
								uni.hideToast()
								uni.showToast({
									title: "反馈成功",
								})
								const messageTemplate = {
									"feedbeck_message": this.problem.department_name + "，在" + this
										.problem
										.create_datetime + "被发现" + this.problem
										.problem_department_type_name +
										"的问题已做反馈，请查看反馈详情。" // 示例：宁远路派出所张三（110120），在“2023-03-14”被发现“个人着装”的问题已做反馈，请查看反馈详情。
								};
								console.log(this.location_message)
								this.location_message.forEach((item, index) => {
									this.$api.addMessage.post({
										"Account-Token": this.statelocation.token,
										"from_uuid": this.stateUser.uuid,
										"to_uuid": item.uuid,
										"content": messageTemplate.feedbeck_message,
										"title": "反馈产生通知",
										"remark": this.problem.uuid
									})
								})
							} else {
								uni.hideToast()
								uni.showToast({
									title: "反馈失败",
								})
							}

						})
					} else {
						uni.hideToast()
						uni.showToast({
							title: "反馈失败",
							icon: "none"
						})
					}
				})
			},
			postFeedback() {
				uni.showLoading({
					title: '上传反馈中',
					mask: true
				});
				this.value_select.map(item => {
					this.location_message.push({
						uuid: item
					})
				})
				this.$api.addFeedback.post(this.problemFeedback_obj).then(response => {
					if (response.status == "SUCCESS") {
						uni.hideToast()
						uni.showToast({
							title: "反馈成功"
						})
						this.postface_show = true
						console.log(this.value_select)
						this.face_show = true
						const messageTemplate = {
							"feedbeck_message": this.problem.department_name + "，在" + this.problem
								.create_datetime + "被发现" + this.problem.problem_department_type_name +
								"的问题已做反馈，请查看反馈详情。" // 示例：宁远路派出所张三（110120），在“2023-03-14”被发现“个人着装”的问题已做反馈，请查看反馈详情。
						};
						console.log(this.location_message)
						this.location_message.forEach((item, index) => {
							this.$api.addMessage.post({
								"Account-Token": this.statelocation.token,
								"from_uuid": this.stateUser.uuid,
								"to_uuid": item.uuid,
								"content": messageTemplate.feedbeck_message,
								"title": "反馈产生通知",
								"remark": this.problem.uuid
							})
						})
						this.$api.modifyProblem.post({
							"Account-Token": this.statelocation.token,
							"uuid": this.id,
							"status": "FEEDBACK",
							"fact": this.value_isfact
						}).then(response => {
							this.face_show = true
							this.face_create_show = false
							this.onClickItem()
						})
					} else {
						console.log(response)
						uni.hideToast()
						// if(response.)
						uni.showToast({
							title: "反馈失败",
							icon: "none"
						})
					}
				})
			},
			modifyFeedback() {
				uni.showLoading({
					title: '修改反馈中',
					mask: true
				});
				this.$api.modifyFeedback.post(this.problemFeedback_obj).then(response => {
					if (response.status == "SUCCESS") {
						uni.hideToast()
						uni.showToast({
							title: "反馈修改成功"
						})
						this.postface_show = true
						this.$api.modifyProblem.post({
							"Account-Token": this.statelocation.token,
							"uuid": this.id,
							"fact": this.value_isfact
						}).then(response => {
							this.face_show = true
							this.face_create_show = false
							this.onClickItem()
						})
					} else {
						uni.hideToast()
						uni.showToast({
							title: "反馈失败",
							icon: "none"
						})
					}
				})
			},
			modifyFeedback_file() {
				uni.showLoading({
					title: '修改反馈中',
					mask: true
				});
				this.$api.modifyFeedback.post(this.problemFeedback_obj).then(response => {
					if (response.status == "SUCCESS") {
						this.postface_show = true
						this.$api.addStorageFileBatch.post({
							"Account-Token": this.statelocation.token,
							"associate_type": "FEEDBACK",
							"associate_uuid": this.Feedback_id,
							"file_suffix": this.file_suffix,
							"file_content": this.filepath
						}).then(response => {
							if (response.status == "SUCCESS") {
								this.$api.modifyProblem.post({
									"Account-Token": this.statelocation.token,
									"uuid": this.id,
									"status": "FEEDBACK",
									"fact": this.value_isfact
								}).then(response => {
									this.file_suffix = ""
									this.filepath = ""
									this.imageValue = []
									this.$refs.files.clearFiles()
									this.face_show = true
									this.face_create_show = false
									this.onClickItem()
									uni.hideToast()
									uni.showToast({
										title: "反馈修改成功",
									})
								})
							} else {
								uni.hideToast()
								uni.showToast({
									title: "反馈修改失败",
									icon: "none"
								})
							}
						})

					} else {
						uni.hideToast()
						uni.showToast({
							title: "反馈失败",
							icon: "none"
						})
					}
				})
			},
			modify_responsible() {
				this.$api.modifyProblem.post({
					"Account-Token": this.statelocation.token,
					"responsible_uuids": this.responsible_uuids,
					"uuid": this.id
				})
			},
			problemFeedback() {
				if (this.value_select == "") {
					this.responsible_uuids = "clear"
				}
				if (!this.corrected_note) {
					this.corrected_note = "无"
				}
				if (this.filepath) {
					if (this.problem.status == "FEEDBACK") {
						this.problemFeedback_obj = {
							"Account-Token": this.statelocation.token,
							"uuid": this.Feedback_id,
							"content": this.corrected_note,
						}
						this.modifyFeedback_file()
						this.modify_responsible()
					} else {
						this.problemFeedback_obj = {
							"Account-Token": this.statelocation.token,
							"problem_uuid": this.id,
							"from_uuid": this.stateUser.uuid,
							"content": this.corrected_note,
							"file_content": this.filepath,
							"file_suffix": this.file_suffix,
						}
						this.postFeedback_file()
						this.modify_responsible()
					}
				} else {
					if (this.problem.status == "FEEDBACK") {
						this.problemFeedback_obj = {
							"Account-Token": this.statelocation.token,
							"uuid": this.Feedback_id,
							"content": this.corrected_note,
							// "responsible_uuids": this.value_select,
						}
						this.modifyFeedback()
						this.modify_responsible()
					} else {
						this.problemFeedback_obj = {
							"Account-Token": this.statelocation.token,
							"problem_uuid": this.id,
							"from_uuid": this.stateUser.uuid,
							"content": this.corrected_note,
							// "responsible_uuids": this.value_select,
						}
						this.postFeedback()
						this.modify_responsible()
					}
				}
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
					this.filepath += imgUrl + "|"
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
		/* margin-top: 10px; */
	}

	.problem-info-container {
		/* border-radius: 15px; */
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

	.card-right-status {
		background-color: #fab33d;
		color: #bf6600;
		margin-left: 15px;
		padding: 5px;
	}

	.card-right-status2 {
		background-color: #c3f1eb;
		color: #00b99a;
		margin-left: 15px;
		padding: 5px;
	}

	.card-right-status3 {
		background-color: #9b9da0;
		color: #FFF;
		margin-left: 15px;
		padding: 5px;
	}

	.problem_alter {
		width: 80%;
		height: 20%;
		font-size: 14px;
		background-color: #007aff;
		/* border: 1px solid #1E90FF; */
		color: #FFF;
		margin-top: 15px;
	}

	.info-container {
		display: flex;
		margin: 10px;
		padding-bottom: 10px;
		margin-bottom: ;
		border-bottom: 1px dashed #999;
	}

	.info-title {
		/* width: 80px !important; */
		font-size: 14px;
		flex: 1.4;
		/* text-align: justify;	 */
		/* text-align-last: justify; */
		color: #686666;
		font-weight: 300;
	}

	.problem-info-text {
		flex: 3;
		width: 100%;
		margin-left: 25px;
		font-size: 14px;
		text-align: right;
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
		position: relative;
	}

	.image-container {
		margin: 10px 10px 20px 10px;
	}

	.delete_icon {
		position: absolute;
		right: 10px;
	}

	.close_icon {}

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
