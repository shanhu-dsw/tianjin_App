import CONFIG from "../config/config.js"

import {
	param
} from 'express/lib/application';
import axios from 'axios'


const qs = require('qs');
let base_url = CONFIG.base_url();
let base_sql_query = CONFIG.base_sql_query();
let base_sql_update = CONFIG.base_sql_update()
let location_category_id = CONFIG.location_category_id();
let H5_url = CONFIG.h5_app_root()

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
		header: {
			// 'content-type': 'application/json',
			'serviceID': '0df8147c693d435cbf952365b136a8fc',
			'secretKey': 'f49b62affc166ac2e6644c000b0e3363',
			'requestType': 'service'
		},
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

	if (token) {
		options.header['Authorization'] = `Bearer ${token}`;
	}
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
	patch:(url,params) => getRequest(url,'PATCH',params)
};
const Resources = (resource, resources) => ({
	all: params =>
		requests.get(`/${resources}`, params),
	stats: params =>
		requests.get(`/${resources}/stats`, params),
	get: id =>
		requests.get(`/${resources}/${id}`),
	create: data =>
		requests.post(`/${resources}`, {
			[resource]: data
		}),
	update: data =>
		requests.put(`/${resources}/${data.id}`, {
			[resource]: data
		}),
	del: id =>
		requests.del(`/${resources}/${id}`),
	patch_correcting: id => requests.patch(`/${resources}/${id}`,{
		"problem": {
		"problem_status":"correcting"
		  }
	}),
	patch_corrected: id => requests.patch(`/${resources}/${id[0]}`,{
		"problem": {
		"problem_status":"corrected",
		"corrected_admin":id[1],
		"corrected_note":id[2],
		"corrected_at":id[3]
		  }
	}),
	patch_waiting:id => requests.patch(`/${resources}/${id}`,{
		"problem": {
		"problem_status":"waiting"
		  }
	}),
	pathch_reviewing:id => requests.patch(`/${resources}/${id[0]}`,{
		"problem": {
		"problem_status":"reviewing",
		"negated_admin":id[1],
		"negated_note":id[2],
		"negated_at":id[3]
		  }
	}),
	pathch_negated:id => requests.patch(`/${resources}/${id}`,{
		"problem": {
		"problem_status":"negated"
		  }
	}),
	pathch_reviewing_none:id => requests.patch(`/${resources}/${id[0]}`,{
		"problem": {
		"problem_status":"correcting",
		"reviewing_admin":id[1],
		"reviewing_note":id[2],
		"reviewing_at":id[3]
		  }
	}),
	
});

const Auth = {
	current: () =>
		requests.get('/auth/current'),
	logout: () => {
		requests.get('/auth/logout')
		
		uni.redirectTo({
			url: "/pages/login/index/index"
		})
	},
	validate_password: (user) =>
		requests.post('/auth/validate_username_password', {
			user
		})
};

const Users = Resources('user', 'users');
const LocationEvents = Resources('location_event', 'location_events');
const Locations = Resources('location', 'locations');
const Admins = Resources('admin', 'admins')
const Problems = Resources('problem', 'problems');
const ProblemCategories = Resources('problem_category', 'problem_categories');
const ProblemEvidences = Object.assign(Resources('problem_evidence', 'problem_evidences'), {
	upload: (problem_evidence) => {
		uni.uploadFile({
			url: base_url + '/problem_evidences', //仅为示例，非真实的接口地址
			// 
			filePath: problem_evidence.img,
			name: 'problem_evidence[img]',
			formData: {
				'problem_evidence[problem_id]': problem_evidence.problem_id
			},
			success: (uploadFileRes) => {
				uni.switchTab({
					url: '/pages/problems/index/index'
				});
			}
		});
	}
})

const Post_H5 = ()=>{
	return uni.request({
		url:H5_url,
		header:{
			'serviceID': 'fe5cca6c4a6d4d87b28c2ff05f26e812',
			'secretKey': '71d7e44cca8d60460a5c0e6fcac926e9',
			'requestType': 'service'
		},
	})
}
const QuerySql = params =>{
	return uni.request({
		url:base_sql_query+params,
		header:{
			// 'serviceID': 'fe5cca6c4a6d4d87b28c2ff05f26e812',
			// 'secretKey': '71d7e44cca8d60460a5c0e6fcac926e9',
			// 'requestType': 'service'
		}
	})
}
const UpdateSql = params =>{
	return uni.request({
		url:base_sql_update + params,
		header:{
			'serviceID': 'fe5cca6c4a6d4d87b28c2ff05f26e812',
			'secretKey': '71d7e44cca8d60460a5c0e6fcac926e9',
			'requestType': 'service'
		}
	})
}

const BaseUrl = ()=>{
	return base_url;
}

// const QuerySql = params => {
// 	return axios.get(base_url_sql + 'method=commonSqlQuery&sql=' + params);
// };
// const UpdateSql = params => {
// 	return axios.get(base_url_sql + 'method=commonSqlUpdate&sql=' + params);
// };
export default {
	Auth,
	Users,
	LocationEvents,
	Locations,
	ProblemCategories,
	ProblemEvidences,
	Problems,
	setToken: setToken,
	location_category_id,
	QuerySql,
	UpdateSql,
	Admins,
	BaseUrl,
	Post_H5
};
