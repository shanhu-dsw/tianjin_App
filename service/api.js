import CONFIG from "../config/config.js"

import {
	param
} from 'express/lib/application';

import axios from 'axios'

const qs = require('qs');
let base_url = CONFIG.base_url();
let H5_url = CONFIG.h5_app_root()
let headers = CONFIG.headers()
//const debugmode = true; //debug模式true为调试环境，false为发布正式环境；

let token = null;

const setToken = new_token => token = new_token;

const getRequest = (url, method, data) => new Promise((resolve, reject) => {

	let request_options = null;

	if (data) {
		// console.log(data)
		request_options = data.request_options;
		if (request_options) {
			delete data.request_options
		}
	}

	if (!request_options && data) {
		let keys = Object.keys(data);
		for (let i = 0; i < keys.length; i++) {
			if (!request_options) {
				// request_options = data[keys[i]].request_options;
				if (request_options) {
					delete data[keys[i]].request_options
				}
			}
		}
	}

	if (request_options && request_options.loading_title) {
		uni.showLoading({
			title: request_options.loading_title,
			mask: true
		});;
	}

	let options = ({
		url: base_url + url,
		method: method,
		data: method == 'GET' ? null : data,
		header: headers,
		success: (res) => {
			if (res.statusCode == 200 || res.statusCode == 201) {
				if (request_options && request_options.success_message) {
					uni.showToast({
						icon: 'none',
						title: request_options.success_message,
					});
				}
				resolve(res.data)
			} else {
				if (!(request_options && request_options.fail_message === false)) {
					uni.showToast({
						icon: 'none',
						title: request_options && request_options.fail_message ?
							request_options.fail_message : res.data.data,
					});
				}
				reject(res.data);
			}
		},
		fail: (res) => reject(res),
		complete: (res) => {
			if (request_options) {
				if (request_options.loading_title && request_options.unmask_on_complete !== false) {
					uni.hideLoading();
				}
			}
		}
	});

	// if (token) {
	// 	options.header['Authorization'] = `Bearer ${token}`;
	// }
	uni.request(options)
});
/**
 * request_options          参数配置
 * - loading_title            加载中标题，默认不显示
 * - success_message          加载成功标题，默认不显示
 * - fail_message             加载失败标题，默认为服务器返回信息
 * - unmask_on_complete       加载结束后是否关闭加载谈框，默认关闭
 */
const requests = {
	get: (url, params) => getRequest(
		`${url}?${qs.stringify(params, {arrayFormat: 'brackets'})}`, 'GET', params),
	put: (url, body) => getRequest(url, 'PUT', body),
	post: (url, body) => getRequest(url, 'POST', body),
	del: (url, params) => getRequest(url, 'DELETE', params),
	patch: (url, params) => getRequest(url, 'PATCH', params)
};
const Resources = (resource, resources) => ({
	all: params =>
		requests.post(`/${resources}`, {
			"Account-Token": token
		}),
	stats: params =>
		requests.get(`/${resources}/stats`, params),
	get: id =>
		// requests.get(`/${resources}/${id}`),
		requests.get(`/${resources}`, id),
	create: data =>
		requests.post(`/${resources}`, {
			"content": data.content,
			"type": data.type,
			"to_uuid": data.to_uuid,
			"type_uuid": data.type_uuid,
			"from_uuid": data.from_uuid,
			"Account-Token": token,
			"file_content": data.file_content,
			"file_suffix": data.file_suffix
		}),
	update: data =>
		requests.post(`/${resources}`, {
			"Account-Token": data,
			"offset": 0,
			"rows": 9999,
			// "name": data
		}),
	post: data =>
		requests.post(`/${resources}`, data),
	del: id =>
		requests.del(`/${resources}/${id}`),
});

const Auth = {
	current: () =>
		requests.get('/security.Admin/getAdmin'),
	logout: () => {
		requests.get('/supervision.spot.AdminInfo/adminLogoff')

		uni.reLaunch({
			url: "/pages/login/index/index"
		})
	},
	validate_password: (user) =>
		requests.get('/supervision.spot.AdminInfo/adminLogon', {
			name: user.name,
			password: user.password
		})
};
const Users = Resources('user', 'users');
const Login = Resources('Login', 'supervision.spot.AdminInfo/adminLogon')
// const ProblemPersonType = Resources('location_event', 'supervision.spot.ProblemPersonType/getProblemPersonType');
const Locations = Resources('location', 'supervision.spot.Department/getDepartment'); //获取单位接口
const Logout = Resources('logout', 'supervision.spot.AdminInfo/adminLogoff'); //退出登录接口
const Admins = Resources('admin', 'supervision.spot.AdminInfo/getAdmin') //获取管理员接口
// const getAdmin_old = Resources('getAdmin_old', 'security.Admin/getAdmin')
const refreshAdminToken = Resources('refreshAdminToken', 'security.Admin/refreshAdminToken') //刷新token接口
const Problems = Resources('problem', 'supervision.spot.Problem/addProblem'); //创建问题接口
const getProblem = Resources('getProblem', 'supervision.spot.Problem/getProblem') //获取问题接口
const modifyProblem = Resources('getProblem', 'supervision.spot.Problem/modifyProblem') //修改问题接口
const ProblemCategories = Resources('problem_category',
	'supervision.spot.ProblemDepartmentType/getProblemDepartmentType'); //获取问题类型接口
const addFeedback = Resources('addFeedback', 'supervision.spot.Feedback/addFeedback') //创建问题反馈接口
const getMessage = Resources('getMessage', 'supervision.spot.Message/getMessage') //获取消息接口
const modifyMessage = Resources('modifyMessage', 'supervision.spot.Message/modifyMessage') //修改消息接口
const getFeedback = Resources('getFeedback', 'supervision.spot.Feedback/getFeedback') //获取问题反馈接口
const deleteFeedback = Resources('deleteFeedback', 'supervision.spot.Feedback/deleteFeedback') //删除问题反馈接口
const modifyFeedback = Resources('modifyFeedback', 'supervision.spot.Feedback/modifyFeedback') //修改问题反馈接口
const addStorageFileBatch = Resources('addStorageFileBatch',
	'supervision.spot.StorageFile/addStorageFileBatch') //创建反馈附件接口
const addMessage = Resources('addMessage', 'supervision.spot.Message/addMessage') //添加消息接口
const getDepartmentProblemCount = Resources('getDepartmentProblemCount',
	'supervision.spot.Department/getDepartmentProblemCount') //获取单位问题数量接口
const getProblemDepartmentTypeCount = Resources('getProblemDepartmentTypeCount',
	'supervision.spot.ProblemDepartmentType/getProblemDepartmentTypeCount') //获取单位问题类型数量接口
const getLogonLogoffInfo = Resources('getLogonLogoffInfo',
	'supervision.spot.LogonLogoffInfo/getLogonLogoffInfo') //登入登出信息接口
const modifyAdminPasswordOfSelf = Resources('modifyAdminPasswordOfSelf',
	'security.Admin/modifyAdminPasswordOfSelf') //修改密码
const getRole = Resources('getRole', 'security.Role/getRole')
const getProblemCountStatistics = Resources('getProblemCountStatistics',
	'supervision.spot.Problem/getProblemCountStatistics') //根据周天月问题数量
const getProblemExact = Resources('getProblemExact', 'supervision.spot.Problem/getProblemExact') //根据创建人单位或责任人获取问题
const getDepartmentWorkloadFromCache = Resources('getDepartmentWorkloadFromCache',
	'supervision.spot.Department/getDepartmentWorkloadFromCache') //获取单位工作量
const removeStorageFile = Resources('removeStorageFile', 'supervision.spot.StorageFile/removeStorageFile') //删除图片附件
const BaseUrl = () => {
	return base_url;
}

export default {
	Login,
	Auth,
	Users,
	modifyAdminPasswordOfSelf,
	Logout,
	Locations,
	ProblemCategories,
	Problems,
	setToken: setToken,
	modifyProblem,
	addFeedback,
	modifyFeedback,
	addStorageFileBatch,
	getProblem,
	getFeedback,
	deleteFeedback,
	Admins,
	// getAdmin_old,
	getMessage,
	modifyMessage,
	addMessage,
	getDepartmentProblemCount,
	getProblemDepartmentTypeCount,
	getLogonLogoffInfo,
	refreshAdminToken,
	getProblemCountStatistics,
	getRole,
	getProblemExact,
	getDepartmentWorkloadFromCache,
	removeStorageFile
};
