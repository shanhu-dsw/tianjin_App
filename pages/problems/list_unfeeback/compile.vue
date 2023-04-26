<template>
	<view style="background-color: #F1F1F1;">
		<view class="page-top">
			<view class="container-go-back" @click="backhome" hover-class="other-navigator-hover">
				<uni-icons type="back" size="30" style="color: #FFF;position: absolute;left: 17px;top: 45px;">
				</uni-icons>
			</view>
			<h3 class="title">编辑问题</h3>
		</view>
		<view class="container">
			<view class="problem-scroll-container">
				<u-loading-page :loading="post_loading" icon-size="36"></u-loading-page>

				<scroll-view scroll-y="true" class="sv" :style="{height:navHeight+'px'}">
					<!-- <u-loading-page :loading="post_loading"></u-loading-page> -->
					<view class="problem-info-container">
						<view class="info-container" v-show="show_DEPARTMENT">
							<view class="uni-list-cell-left">
								<text style="color: red;">*</text>
								问题类型
							</view>
							<view class="uni-list-cell-db" style="margin-top: 5px;">
								<uni-segmented-control :current="current" :values="items" :style-type="styleType"
									:active-color="activeColor" @clickItem="bindPickerChange3" />
							</view>
							<!-- <view class="uni-list-cell-db">
								<picker @change="bindPickerChange3" mode="selector" :range-value="'id'"
									:range-key="'name'" :range="problem_categories3" class="uni-list-cell-picker">
									<label class="">{{ problem_categories3[index3].name }}</label>
								</picker>
							</view> -->
						</view>
						<view class="info-container">
							<view class="uni-list-cell-left">
								<text style="color: red;">*</text>
								问题细目
							</view>
							<view class="uni-list-cell-db">
								<picker @change="bindPickerChange2" mode="selector" :range-value="'id'"
									:range-key="'name'" :range="problem_categories2" class="uni-list-cell-picker">
									<label class="">{{ problem_categories2[index2].name }}</label>
									<!-- <view class="uni-list-cell-triangle"></view> -->
								</picker>
							</view>
						</view>
						<view class="info-container" v-show="show_DEPARTMENT">
							<view class="uni-list-cell-left">
								<text style="color: red;">*</text>
								被检查单位
							</view>
							<view class="uni-list-cell-db">
								<view @change="bindPickerChange1" mode="selector" :range-value="'id'"
									:range-key="'name'" :range="problem_categories1" class="uni-list-cell-picker">
									<label class="">{{ problem_categories1[index1].name }}</label>
									<!-- <view class="uni-list-cell-triangle"></view> -->
								</view>
							</view>
						</view>
						<view class="info-container">
							<view class="uni-list-cell-left">
								<text style="color: red;">*</text>督导检查时间
							</view>
							<view class="uni-list-cell-db">
								<view class="uni-list-cell-picker">
									<label @click="DatePicker('datetime')"
										class="uni-input">{{problem.issued_at}}</label>
									<view @click="DatePicker('datetime')" class="uni-list-cell-time"></view>
								</view>
								<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true"
									:begin-text="'入住'" :end-text="'离店'" :show-seconds="true" @confirm="ed"
									@cancel="ed" />
							</view>
						</view>
						<!-- <view class="info-container">

							<view class="uni-list-cell-left">
								问题责任人
							</view>
							<view class="uni-list-cell-db">
								<em></em>
								
								<input class="uni-list-cell-picker" type="text" placeholder=""
									v-model="current_search_value" @focus="handleinput">
								</input>
							</view>
							<transition name="app_dialog_dowm">
								<view class="mt-master-container" v-if="showList&&associateWords.length>0"
									@click="close('showList')">
									<view class="mt-master-content" @click.stop>
										<view class="mt-master-wrap">
											<view class="associate-list">
												<view class="associate-item" v-for="(item,index) of associateWords"
													:key="index" @click="hotClick(item)">
													{{item.real_name}}{{item.name}}
												</view>
											</view>
										</view>
									</view>
								</view>
							</transition>

						</view> -->
						<view class="info-container">
							<view class="uni-list-cell-left">
								问题责任人
							</view>
							<view class="uni-list-cell-db">
								<el-select size="small" v-model="value_select" multiple filterable placeholder="请选择"
									style="width: 100%;margin-top: 5px;" @change="options_change">
									<el-option v-for="item in options" :key="item.value" :label="item.real_name"
										:value="item.uuid">
									</el-option>
								</el-select>
								<!-- <u-tag text="部门负责人" type="success" plain size="large" closable :show="close_tag"
									@close="close_tags"></u-tag> -->
								<!-- <input class="uni-list-cell-picker" type="text" placeholder=""
									v-model="current_search_value" @focus="handleinput" v-show="close_tag">
								</input>
								<transition name="app_dialog_dowm">
									<view class="mt-master-container" v-if="showList&&associateWords.length>0"
										@click="close('showList')">
										<view class="mt-master-content" @click.stop>
											<view class="mt-master-wrap">
												<view class="associate-list">
													<view class="associate-item" v-for="(item,index) of associateWords"
														:key="index" @click="hotClick(item)">
														{{item.real_name}}{{item.name}}
													</view>
												</view>
											</view>
										</view>
									</view>
								</transition> -->
								<!-- <view class="uni-list-cell-db" :key="index" v-for="(item,index) in manage_name">
									<input class="uni-list-cell-picker" v-model="item.name"></input>
								</view> -->
							</view>
						</view>

						<view class="info-container">
							<view class="uni-list-cell-left">
								<text style="color: red;">*</text>问题描述
							</view>
						</view>

						<view class="info-container">
							<textarea class="uni-list-cell-textarea" v-model="problem.content" placeholder="请输入备注信息" />
						</view>

						<view class="info-container">
							<view class="uni-list-cell-left">
								上传图片
							</view>
						</view>

						<view style="margin: 15px;">
							<uni-file-picker file-mediatype="image" mode="grid" :limit="10" ref="files"
								@delete="handleDelete" :auto-upload="false" @select="select"
								:image-styles="imageStyles" />
						</view>

						<view class="info-container" style="margin: 0;">
							<button type="primary" class="submit-button" @click="problemCreate()">提交</button>
						</view>


					</view>

				</scroll-view>
			</view>
		</view>
	</view>

</template>

<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	// import { response } from "express";
	import moment from 'moment';
	import CONFIG from '../../../config/config.js'
	import getRole from '../../../Role_judgment/Role_judgment.js'
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	// var _self;
	import {
		mapActions,
		mapState
	} from 'vuex';

	export default {
		components: {
			MxDatePicker
		},
		data() {
			return {
				id: "",
				options: [],
				value_select: [],
				post_loading: false,
				items: ["自查问题", "检查问题"],
				items_order: [],
				imageValue: [],
				filePathsList: "",
				activeColor: '#007aff',
				styleType: 'button',
				current: 0,
				showPicker: false,
				datetime: null,
				type: 'rangetime',
				value: '',
				close_tag: false,
				loading: false,
				disabled: false,
				show_DEPARTMENT: true,
				show_DEPARTMENT2: true,
				imgsrc: '',
				current_search_value: '',
				// current_search_value2: '',
				// current_search_value3: '',
				current_search_id: "",
				searchList: [],
				statusname: [],
				manage_name: [],
				associateWords: [],
				showList: false,
				showList2: false,
				showList3: false,
				problemCreate_obj: "",
				problem_evidence: {
					problem_id: "",
					img: ""
				},
				problem_types: [],
				datetime: null,
				imageStyles: {
					border: {
						color: "#1E90FF",
						width: 2,
						radius: '1px'
					}
				},
				token: "",
				problem: {
					uuid: "",
					content: null,
					type: "DEPARTMENT",
					to_uuid: 0,
					type_uuid: "",
					issued_at: null,
					from_uuid: null,
					file_content: "",
					file_suffix: "",
					problem_type: "SELF",
					responsible_uuids: "",
				}, //创建问题数据
				problem_categories1: [{
					name: '请选择',
					id: 0,
				}],
				problem_categories2: [{
					name: '请选择',
					id: 0
				}],
				// Parent_length:"",
				problem_categories5: [],
				index1: [0], //选择器被选中选项
				index2: [0], //选择器被选中选项
				index5: [0], //选择器被选中选项
				pH: 0, //窗口高度
				navHeight: 0, //元素的所需高度
			}
		},
		computed: mapState({
			stateProblemCategories: state => state.problem_categories,
			statelocation: state => state.locations,
			stateUser: state => state.user
		}),
		watch: {
			// 检测输入框搜索数据变化，搜索联想词列表
			current_search_value: {
				handler(val) {
					if (val) {
						this.getAssociateWords(val);
					} else {
						this.associateWords = [];
					}
				},
				immediate: true
			},
		},
		onLoad(options) {
			this.id = options.id
		},
		methods: {
			moment: moment,
			backhome() {
				// uni.switchTab({
				// 	url: "/pages/dashboard/index"
				// })
				uni.navigateBack({
					delta: 1, //返回层数，2则上上页
				})
			},
			onClickItem(e) {
				console.log(e)
			},
			options_change() {
				console.log(this.value_select)
				this.problem.responsible_uuids = ""
				this.value_select.map(data => {
					this.manage_name.push({
						uuid: data
					})
					this.problem.responsible_uuids += data + ";"
				})
				console.log(this.manage_name)
				console.log(this.problem.responsible_uuids.length)
				this.problem.responsible_uuids = this.problem.responsible_uuids.slice(0, this.problem.responsible_uuids
					.length - 1);
				console.log(this.problem.responsible_uuids)
			},
			// hotClick(val) {
			// 	console.log(this.current_search_value2)
			// 	this.current_search_value = val.real_name + "(" + val.name + ")"
			// 	this.showList = false
			// 	this.problem.to_uuid = val.uuid
			// },
			select(e) {
				this.imageValue = this.imageValue.concat(e.tempFilePaths)
				console.log(this.imageValue)
				// console.log("tempFilePaths:" + e.tempFilePaths);
				// console.log("imageValue :" + this.imageValue);
				e.tempFiles.map(data => {
					this.problem.file_suffix += data.extname.toUpperCase() + "|"
				})
				console.log("problem.file_suffix :" + this.problem.file_suffix);
				this.problem.file_content = ""
				this.imageValue.map(data => {
					console.log(data)
					this.imgToBase64(data).then(base64 => {
						console.log(base64)
						this.problem.file_content += base64 + "|"
						console.log("problem.file_content:" + this.problem.file_content)
					}).catch(e => {
						console.log(e)
					})
					// this.base64ToBlob(data)
				})
			},
			handleDelete(e) {
				console.log(this.imageValue)
				const raw = e.tempFile.extname.toUpperCase() + "|"
				this.problem.file_suffix = this.problem.file_suffix.replace(raw, "")
				const num = this.imageValue.indexOf(e.tempFilePath);
				console.log(num)
				this.imageValue.splice(num, 1)
				// console.log(this.imageValue)
				// this.imageValue.replace(e.tempFilePath, "");
				this.problem.file_content = ""
				this.imageValue.map(data => {
					console.log(data)
					this.imgToBase64(data).then(base64 => {
						this.problem.file_content += base64 + "|"
						// console.log("problem.file_content:" + this.problem.file_content)
					}).catch(e => {
						console.log(e)
					})
					// this.base64ToBlob(data)
				})
			},
			close_tags() {
				this.close_tag = false
			},
			imgclick() {
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						console.log(res);
						const tempFilePaths = res.tempFilePaths
						tempFilePaths.forEach((item, index) => {
							this.imageValue.push({
								img: item
							})
						})
						console.log(tempFilePaths)
					}
				});
			},
			// 输入框获取焦点时，展示联想词列表
			handleinput() {
				this.associateWords = []
				this.showList = true
				this.showList2 = false
				this.showList2 = false
			},
			getAssociateWords(val) {
				// 此处通过接口获取联想数据
				// console.log(this.current_search_value)
				console.log(val)
				this.associateWords.splice(0, this.associateWords.length)
				for (let i = 0; i < this.statusname.length; i++) {
					var postname = this.statusname[i].real_name + this.statusname[i].name
					if (postname.indexOf(this.current_search_value) !== -1) {
						// console.log(this.associateWords)
						this.associateWords.push(this.statusname[i])
						this.associateWords = Array.from(new Set(this.associateWords))
					}
				}
				console.log(this.associateWords)
			},
			close(key) {
				console.log(key)
				this[key] = false;
				this.associateWords = []
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
					// console.log(imgUrl);
					this.problem.file_content += imgUrl + "|"

					console.log(this.problem.file_content)
					// console.log(this.problem.file_content)
				}
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
			bindPickerChange1: function(e) {
				this.index1 = e.target.value
				console.log(this.problem_categories1[this.index1].id)
				this.problem.to_uuid = this.problem_categories1[this.index1].id
				this.$api.Admins.post({
					"Account-Token": this.statelocation.token,
					"offset": 0,
					"rows": 9999,
					"manage_department_uuid_like": this.problem_categories1[this.index1].id
				}).then((response) => {
					console.log(response)
					this.manage_name = response.content.array
					if (this.manage_name) {
						this.close_tag = true
					}

				})

			},
			bindPickerChange2: function(e) {
				this.index2 = e.target.value
				this.problem.type_uuid = this.problem_categories2[this.index2].id

			},
			bindPickerChange3: function(e) {
				if (e) {
					this.current = e.currentIndex
				}
				console.log(this.items[this.current])
				if (this.items[this.current] == "自查问题") {
					this.problem.problem_type = "SELF"
					this.problem_categories2 = [{
						name: '请选择',
						id: 0
					}]
					console.log(this.items_order)
					this.problem_categories1 = [{
						name: '请选择',
						id: 0
					}]
					// getRole(this.stateUser.admin_info[0].role_name, this, this.stateUser.token).get_problem_locations(
					// 	this.problem_categories1, this.current, this.stateUser.admin_info[0].department_uuid)
					if (this.items_order.length > 1) {
						console.log(this.problem_categories5)
						this.problem_categories5.filter(item => item.order_group.substr(0, 3) == this.items_order[1]
								.order_group)
							.map(data => {
								this.problem_categories2.push({
									name: data.name,
									id: data.uuid
								})
							})
					} else {
						console.log(this.problem_categories5)
						this.problem_categories5.filter(item => item.order_group.substr(0, 3) == this.items_order[0]
								.order_group)
							.map(data => {
								this.problem_categories2.push({
									name: data.name,
									id: data.uuid
								})
							})
					}
				} else {
					this.problem.problem_type = "CHECK"
					this.problem_categories2 = [{
						name: '请选择',
						id: 0
					}]
					// this.problem_categories1 = [{
					// 	name: '请选择',
					// 	id: 0
					// }]
					// getRole(this.stateUser.admin_info[0].role_name, this, this.stateUser.token).get_problem_locations(
					// 	this.problem_categories1, this.current, this.stateUser.admin_info[0].department_uuid)
					console.log(this.problem_categories5)
					console.log(this.items_order[1])
					if (this.items_order.length <= 1) {
						this.problem_categories2 = [{
							name: '请选择',
							id: 0
						}]
					} else {
						this.problem_categories5.filter(item => item.order_group.substr(0, 3) == this.items_order[0]
								.order_group)
							.map(data => {
								this.problem_categories2.push({
									name: data.name,
									id: data.uuid
								})
							})
					}
				}
			},
			navigateBack() {
				uni.switchTab({
					url: '/pages/problems/index/index'
				});
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

				this.datetime = moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
				this.problem.issued_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
				this.token = this.stateUser.token
			},
			onShow() {
				if (!getRole(this.stateUser.admin_info[0].role_name).is_problem_create_check) {
					this.items = ["自查问题"]
				} else if (!getRole(this.stateUser.admin_info[0].role_name).is_problem_create_self) {
					this.items = ["检查问题"]
				}

				if (this.stateUser.admin_info[0].parent_array.length == 2) {
					this.stateUser.admin_info[0].department_uuid = this.stateUser.admin_info[0].parent_array[1].uuid
				}
				getRole(this.stateUser.admin_info[0].role_name, this, this.stateUser.token).get_problem_type(this
					.problem_categories5, this.items_order, this.stateUser.admin_info[0]
					.department_uuid).then((response) => {
					this.bindPickerChange3()
					console.log(this.problem_categories2)


					this.$api.getProblemExact.post({
						"uuid": this.id,
						"offset": 0,
						"rows": 10
					}).then(response => {
						console.log(response.content.array[0].content)
						this.problem.content = response.content.array[0].content
						this.items = [response.content.array[0].problem_department_type_parent_name]
						this.problem_categories1.push({
							"name": response.content.array[0].department_name,
							"id": response.content.array[0].to_uuid
						})
						this.index1 = 1
						// this.index2 = 2
						console.log(this.problem_categories2)
						this.problem.uuid = response.content.array[0].uuid
						this.problem_categories2[this.index2].name = response.content.array[0]
							.problem_department_type_name
						this.problem_categories2[this.index2].id = response.content.array[0].type_uuid
						if (response.content.array[0].responsible_uuid) {
							this.value_select = []
							response.content.array[0].responsible_uuid.map((data, index) => {
								this.value_select.push(data)
							})
							console.log(this.value_select)
						}
						console.log(response.content.array[0])
						this.problem.to_uuid = this.problem_categories1[this.index1].id
						this.problem.type_uuid = this.problem_categories2[this.index2].id
						this.$api.Admins.post({
							"Account-Token": this.statelocation.token,
							"offset": 0,
							"rows": 9999,
							"all_from_department_uuid": response.content.array[0].to_uuid
						}).then(response => {
							this.statusname = response.content.array
							this.options = response.content.array
							this.options.map(data => {
								data.real_name = data.real_name + "(" + data.name + ")"
							})
							console.log(this.options)
						})
						// this.problem_categories2[this.index2].name =response.content.array[0].problem_department_type_name
					})
				})
			},
			postproblems_file() {
				uni.showLoading({
					title: '编辑问题中',
					mask: true
				});
				this.$api.modifyProblem.post(this.problemCreate_obj).then((response) => {
					if (response.status == "SUCCESS") {
						this.$api.addStorageFileBatch.post({
							"Account-Token": this.statelocation.token,
							"associate_type": "PROBLEM",
							"associate_uuid": this.problem.uuid,
							"file_content": this.problem.file_content,
							"file_suffix": this.problem.file_suffix,
						}).then(response => {
							uni.hideToast()
							uni.navigateBack({
								delta: 1, //返回层数，2则上上页
							}).then(() => {
								uni.showToast({
									title: "修改成功"
								})

							})
						}).catch(e => {
							uni.hideToast()
							uni.showToast({
								title: "上传失败",
								icon: 'none'
							})
						})
					} else {
						uni.hideToast()
						uni.showToast({
							title: "上传失败",
							icon: 'none'
						})
					}

				}).catch(e => {

				})

			},
			postproblems() {
				this.$api.modifyProblem.post(this.problemCreate_obj).then((response) => {
					if (response.status == "SUCCESS") {
						uni.navigateBack({
							delta: 1, //返回层数，2则上上页
						}).then(() => {
							uni.hideToast()
							uni.showToast({
								title: "修改成功"
							})
						})
					} else {
						uni.hideToast()
						uni.showToast({
							title: "上传失败",
							icon: 'none'
						})
					}

				}).catch(e => {

				})
			},
			problemCreate() {
				// if (this.current_search_value) {
				// 	this.problem.type = "PERSON"
				// }
				if (this.value_select == "") {
					this.problem.responsible_uuids = "clear"
				}
				console.log(this.problem.file_content)
				if (this.problem.file_content) {
					this.problemCreate_obj = {
						"uuid": this.problem.uuid,
						"content": this.problem.content,
						"type": this.problem.type,
						// "to_uuid": this.problem.to_uuid,
						"type_uuid": this.problem.type_uuid,
						"Account-Token": this.statelocation.token,
						"create_datetime": this.problem.issued_at,
						// "responsible_uuids": this.problem.responsible_uuids,
					};
					if (this.problem.responsible_uuids) {
						this.problemCreate_obj = {
							"uuid": this.problem.uuid,
							"content": this.problem.content,
							"type": this.problem.type,
							"type_uuid": this.problem.type_uuid,
							"Account-Token": this.statelocation.token,
							"create_datetime": this.problem.issued_at,
							"responsible_uuids": this.problem.responsible_uuids,
						};
					}
					this.postproblems_file()
				} else {
					this.problemCreate_obj = {
						"uuid": this.problem.uuid,
						"content": this.problem.content,
						"type": this.problem.type,
						"type_uuid": this.problem.type_uuid,
						"Account-Token": this.statelocation.token,
						"create_datetime": this.problem.issued_at,
					}
					if (this.problem.responsible_uuids) {
						this.problemCreate_obj = {
							"uuid": this.problem.uuid,
							"content": this.problem.content,
							"type": this.problem.type,
							"type_uuid": this.problem.type_uuid,
							"Account-Token": this.statelocation.token,
							"create_datetime": this.problem.issued_at,
							"responsible_uuids": this.problem.responsible_uuids,
						};
					}
					this.postproblems()
				}

			},
			DatePicker(type) { //显示
				this.type = type;
				this.showPicker = true;
				this.value = this[type];
			},
			ed(e) { //选择
				this.showPicker = false;
				if (e) {
					//选择的值 e.value
					//原始的Date对象 e.date
					this[this.type] = e.value;
					this.problem.issued_at = e.value
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
		margin-top: 10px;
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

	.problem-info-container {
		border-radius: 15px;
		background-color: #FFFFFF;
		margin-bottom: 15px;
		padding: 10px 10px;
	}

	.info-container {
		/* display: flex; */
		margin: 20px 10px;
		/* justify-content: space-between; */
		font-size: 14px;
	}

	.problem-info-text {
		margin-left: 30px;
		font-size: 14px;
		background-color: #3F536E;
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

	.uni-list-cell-triangle {
		display: inline-block;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 8px solid #C8C7CC;
		position: absolute;
		right: 12px;
		bottom: 12px;
	}

	.uni-list-cell-time {
		display: inline-block;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 8px solid #C8C7CC;
		position: absolute;
		right: 34px;
		margin-top: 12px;
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

	.upload-button {
		background-color: #F8F8F8;
		height: 60px;
		width: 60px;
		line-height: 52px;
		font-size: 60px;
		color: #808080;
	}

	.submit-button {
		height: 40px;
		width: 80px;
		line-height: 40px;
	}

	.uni-list-cell-left {
		flex-shrink: 0;
		margin-right: 5px;
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
</style>
