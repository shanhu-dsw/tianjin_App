<template>
	<view style="background-color: #F1F1F1;">
		<view class="page-top">
			<view class="container-go-back" @click="backhome" hover-class="other-navigator-hover">
				<uni-icons type="back" size="30" style="color: #FFF;position: absolute;left: 17px;top: 45px;">
				</uni-icons>
			</view>
			<h3 class="title">录入问题</h3>
		</view>
		<view class="container">
			<view class="problem-scroll-container">
				<scroll-view scroll-y="true" class="sv" :style="{height:navHeight+'px'}">
					<view class="problem-info-container">
						<view class="info-container">
							<view class="uni-list-cell-left">
								<text style="color: red;">*</text>
								问题类型
							</view>
							<view class="uni-list-cell-db" style="margin-top: 5px;">
								<uni-segmented-control :current="current" :values="items" :style-type="styleType"
									:active-color="activeColor" @clickItem="bindPickerChange3" />
							</view>
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
						<view class="info-container">
							<view class="uni-list-cell-left">
								<text style="color: red;">*</text>
								被检查单位
							</view>
							<view class="uni-list-cell-db">
								<picker @change="bindPickerChange1" mode="selector" :range-value="'id'"
									:range-key="'name'" :range="problem_categories1" class="uni-list-cell-picker">
									<label class="">{{ problem_categories1[index1].name }}</label>
									<!-- <view class="uni-list-cell-triangle"></view> -->
								</picker>
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
						<view class="info-container">
							<view class="uni-list-cell-left">
								问题责任人
							</view>
							<view class="uni-list-cell-db">
								<el-select size="small" v-model="value_select" multiple filterable placeholder="请选择"
									style="width: 100%;margin-top: 5px;border: 1px solid #1E90FF;border-radius: 6px;" @change="options_change">
									<el-option v-for="item in options" :key="item.value" :label="item.real_name"
										:value="item.uuid">
									</el-option>
								</el-select>
							</view>
						</view>

						<view class="info-container">
							<view class="uni-list-cell-left">
								问题描述
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
	import getRole from '../../../Role_judgment/Role_judgment.js' //引入权限控制模板
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
				options: [],//责任人数组
				value_select: [], //已选择的责任人
				items: ["自查问题", "检查问题"], //问题类型切换
				items_order: [],
				imageValue: [],//选择后的图片数组
				activeColor: '#007aff',//问题类型切换栏颜色
				styleType: 'button', //弹出方式
				current: 0,//问题类型切换栏索引
				showPicker: false,//时间选择器是否弹出
				datetime: null,//时间选择器默认时间
				type: 'rangetime',//时间选择器类型：日期时间范围
				value: '',
				// current_search_value: '',
				// current_search_value2: '',
				// current_search_value3: '',
				// statusname: [],
				manage_name: [],
				// associateWords: [],
				// showList: false,
				// showList2: false,
				// showList3: false,
				problemCreate_obj :"",
				// problem_evidence: {
				// 	problem_id: "",
				// 	img: ""
				// },
				problem_types: [],
				imageStyles: {
					border: {
						color: "#1E90FF",
						width: 2,
						radius: '1px'
					}
				},
				token: "",
				problem: {
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
				problem_categories3: [{
					name: '请选择',
					id: 0
				}],
				problem_categories4: [{
					name: '请选择',
					id: 0
				}],
				// Parent_length:"",
				problem_categories5: [],
				index1: [0], //选择器被选中选项
				index2: [0], //选择器被选中选项
				index3: [0], //选择器被选中选项
				index4: [0], //选择器被选中选项
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
		methods: {
			moment: moment,
			backhome() {
				uni.switchTab({
					url: "/pages/dashboard/index"
				})
			},
			onClickItem(e) {
				console.log(e)
			},
			options_change() {
				console.log(this.value_select)
				this.problem.responsible_uuids = ""
				this.value_select.map(data => {
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
				console.log(this.imageValue)
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
				// this.getCategory(this.problem_categories1[this.index1].id, this.problem_categories2)
				console.log(this.problem_categories1[this.index1].id)
				this.problem.to_uuid = this.problem_categories1[this.index1].id
				this.$api.Admins.post({
					"Account-Token": this.statelocation.token,
					"offset": 0,
					"rows": 9999,
					"all_from_department_uuid": this.problem.to_uuid
				}).then(response => {
					this.statusname = response.content.array
					this.options = response.content.array
					this.options.map(data => {
						data.real_name = data.real_name + "(" + data.name + ")"
					})
				})
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
					getRole(this.stateUser.admin_info[0].role_name, this, this.stateUser.token).get_problem_locations(
						this.problem_categories1, this.current, this.stateUser.admin_info[0].department_uuid)
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
					this.problem_categories1 = [{
						name: '请选择',
						id: 0
					}]
					getRole(this.stateUser.admin_info[0].role_name, this, this.stateUser.token).get_problem_locations(
						this.problem_categories1, this.current, this.stateUser.admin_info[0].department_uuid)
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
								console.log(data.name)
								this.problem_categories2.push({
									name: data.name,
									id: data.uuid
								})
							})
					}
				}
			},
			// bindPickerChange3: function(e) {
			// 	this.index3 = e.target.value
			// 	if (this.problem_categories3[this.index3].name == "检查问题") {
			// 		this.problem_categories2 = [{
			// 			name: '请选择',
			// 			id: 0
			// 		}]
			// 		this.problem_categories5.filter(item => item.order_group.substr(0, 3) == this.problem_categories3[
			// 			this.index3].id).map(data => {
			// 			this.problem_categories2.push({
			// 				name: data.name,
			// 				id: data.uuid
			// 			})
			// 		})
			// 	} else if (this.problem_categories3[this.index3].name == "自查问题") {
			// 		this.problem_categories2 = [{
			// 			name: '请选择',
			// 			id: 0
			// 		}]
			// 		this.problem_categories5.filter(item => item.order_group.substr(0, 3) == this.problem_categories3[
			// 			this.index3].id).map(data => {
			// 			console.log(data.name)
			// 			this.problem_categories2.push({
			// 				name: data.name,
			// 				id: data.uuid
			// 			})
			// 		})
			// 	}
			// },
			bindPickerChange4: function(e) {
				this.index4 = e.target.value
				this.problem.type_uuid = this.problem_categories4[this.index4].id
			},
			getCategory(id, categoryArr) {

				this.$api.Locations.post({
					"Account-Token": this.statelocation.token,
					"level": 2,
					"uuid": id,
					// "uuid":this.stateUser.admin_info[0].department_uuid
				}).then((response) => {
					if (this.index3 == 1) {
						this.problem_categories5 = response.content.array[0].problem_types
						var order_num = this.problem_categories5.filter(item => item.name == "自查问题")[0].order_group
						response.content.array[0].problem_types.filter(item => item.level == 2).map((data,
							index) => {
							var abc = data.order_group.substr(0, 3)
							console.log(abc)
							if (abc == order_num) {
								categoryArr.push({
									name: data.name,
									id: data.uuid
								})
							}
						})
					} else if (this.index3 == 2) {
						this.problem_categories5 = response.content.array[0].problem_types
						var order_num = this.problem_categories5.filter(item => item.name == "检查问题")[0].order_group
						console.log(order_num)
						response.content.array[0].problem_types.filter(item => item.level == 2).map((data,
							index) => {
							var abc = data.order_group.substr(0, 3)
							if (abc == order_num) {
								categoryArr.push({
									name: data.name,
									id: data.uuid
								})
							}

						})
					}
				})
				console.log(categoryArr)
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
				// this.$api.Admins.post({
				// 	"Account-Token": this.statelocation.token,
				// 	"offset": 0,
				// 	"rows": 9999
				// }).then(response => {
				// 	this.statusname = response.content.array
				// 	this.options = response.content.array
				// 	this.options.map(data => {
				// 		data.real_name = data.real_name + "(" + data.name + ")"
				// 	})
				// })
				console.log(getCurrentPages())
				if(!getRole(this.stateUser.admin_info[0].role_name).is_problem_create_check){
					this.items = ["自查问题"]
				}else if(!getRole(this.stateUser.admin_info[0].role_name).is_problem_create_self){
					this.items = ["检查问题"]
				}
				
				if (this.stateUser.admin_info[0].parent_array.length == 2) {
					this.stateUser.admin_info[0].department_uuid = this.stateUser.admin_info[0].parent_array[1].uuid
				}
				getRole(this.stateUser.admin_info[0].role_name, this, this.stateUser.token,this.items).get_problem_locations(this
					.problem_categories1, this.current, this.stateUser.admin_info[0].department_uuid)
				getRole(this.stateUser.admin_info[0].role_name, this, this.stateUser.token).get_problem_type(this
					.problem_categories3, this.problem_categories5, this.items_order, this.stateUser.admin_info[0]
					.department_uuid).then((response) => {
					this.bindPickerChange3()
				})
			},
			postproblems() {
				uni.showLoading({
					title: '创建问题中',
					mask:true
				});
				this.$api.Problems.post(this.problemCreate_obj).then((response) => {
					if (response.status == "SUCCESS") {
						console.log(this.value_select)
						this.value_select.map(item=>{
						this.manage_name.push({
							uuid:item
						})
						})
						const messageTemplate = {
							"problem_message": this.problem_categories1[this.index1].name +
								"，于" + this.problem.issued_at + "被" + this.stateUser.admin_info[0].real_name +
								"(" + this.stateUser.admin_info[0].name + ")" + "发现" + this
								.problem_categories2[this.index2].name +
								"的问题，请及时整改。", // 示例：宁远路派出所张三（110120），于“2023-03-14”被“李四（110120）”发现“个人着装”的问题，请及时整改。
							"feedbeck_message": "${department_name}${to_name}，对在“${datetime}”被发现“${problem_type_name}”的问题已做反馈，请查看反馈详情。" // 示例：宁远路派出所张三（110120），在“2023-03-14”被发现“个人着装”的问题已做反馈，请查看反馈详情。
						};
						this.manage_name.forEach((item, index) => {
							this.$api.addMessage.post({
								"Account-Token": this.statelocation.token,
								"from_uuid": this.stateUser.uuid,
								"to_uuid": item.uuid,
								"content": messageTemplate.problem_message,
								"title": "发现" + this.problem_categories2[this.index2].name + "的问题",
								"remark": response.content.uuid
							})
						})
						uni.switchTab({
							url: "/pages/dashboard/index"
						}).then(() => {
							uni.hideToast()
							uni.showToast({
								title: "创建成功"
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
				if(!this.problem.content){
					 this.problem.content = "无"
				}
				console.log(this.problem.file_content)
				if (this.problem.file_content)
				{
					this.problemCreate_obj ={
					"content": this.problem.content,
					"type": this.problem.type,
					"to_uuid": this.problem.to_uuid,
					"type_uuid": this.problem.type_uuid,
					"from_uuid": this.stateUser.uuid,
					"Account-Token": this.statelocation.token,
					"file_content": this.problem.file_content,
					"file_suffix": this.problem.file_suffix,
					"create_datetime": this.problem.issued_at,
					// "responsible_uuids": this.problem.responsible_uuids,
					"to_lv2_department_uuid" : this.problem.to_uuid,
					"problem_type": this.problem.problem_type,
					"from_lv2_department_uuid": this.stateUser.admin_info[0].department_uuid
				};
				if(this.problem.responsible_uuids){
					this.problemCreate_obj ={
						"content": this.problem.content,
						"type": this.problem.type,
						"to_uuid": this.problem.to_uuid,
						"type_uuid": this.problem.type_uuid,
						"from_uuid": this.stateUser.uuid,
						"Account-Token": this.statelocation.token,
						"file_content": this.problem.file_content,
						"file_suffix": this.problem.file_suffix,
						"create_datetime": this.problem.issued_at,
						"responsible_uuids": this.problem.responsible_uuids,
						"problem_type": this.problem.problem_type,
						"to_lv2_department_uuid" : this.problem.to_uuid,
						"from_lv2_department_uuid": this.stateUser.admin_info[0].department_uuid
					};
				}
					this.postproblems()
				} 
				else {
					this.problemCreate_obj ={
						"content": this.problem.content,
						"type": this.problem.type,
						"to_uuid": this.problem.to_uuid,
						"type_uuid": this.problem.type_uuid,
						"from_uuid": this.stateUser.uuid,
						"Account-Token": this.statelocation.token,
						"create_datetime": this.problem.issued_at,
						// "responsible_uuids": this.problem.responsible_uuids,
						"problem_type": this.problem.problem_type,
						"to_lv2_department_uuid" : this.problem.to_uuid,
						"from_lv2_department_uuid": this.stateUser.admin_info[0].department_uuid
					}
					if(this.problem.responsible_uuids){
						this.problemCreate_obj ={
							"content": this.problem.content,
							"type": this.problem.type,
							"to_uuid": this.problem.to_uuid,
							"type_uuid": this.problem.type_uuid,
							"from_uuid": this.stateUser.uuid,
							"Account-Token": this.statelocation.token,
							"create_datetime": this.problem.issued_at,
							"responsible_uuids": this.problem.responsible_uuids,
							"problem_type": this.problem.problem_type,
							"to_lv2_department_uuid" : this.problem.to_uuid,
							"from_lv2_department_uuid": this.stateUser.admin_info[0].department_uuid
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
		border-radius: 6px;
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
	/deep/.el-input__inner {
	  border: 1px solid #1E90FF;
	  border: 6px;
	}
</style>
