import {
	mapActions,
	mapState
} from 'vuex';
import api from '../service/api.js';
import moment from 'moment';

computed: mapState({
	stateUser: state => state.user,
	statelocation: state => state.locations,
})

function getRole(roleName, thisObj, token) {
	console.log(roleName)
	if (roleName == "superadmin" || roleName == "ds_admin") {
		return {
			"is_problem_create": true, //是否可以创建问题
			"is_problem_create_self": true, //是否可以创建自查问题
			"is_problem_create_check": true, //是否可以创建检查问题
			"is_problem_list_all": true, //是否可以查看全部问题
			"is_problem_list_of": true, //是否可以查看本单位问题
			"is_problem_list_depatmentcreate": true, //是否可以查看本单位创建的问题
			"is_problem_feeback": true, //是否可以反馈
			"is_problem_feeback_of": false, //是否可以反馈
			"is_problem_modify": true, //是否可以编辑
			"get_problem_list": function() {
				console.log(roleName)
			},
			"get_problem_locations": function(problem_categories1, current, department_uuid) {
				if (current == 0) {
					console.log(current)
					return thisObj.$api.Locations.post({
						"Account-Token": token,
						"level": 2,
						"uuid": department_uuid
						// "uuid":this.stateUser.admin_info[0].department_uuid
					}).then(response => {
						response.content.array.filter((data) => {
							problem_categories1.push({
								name: data.name,
								id: data.uuid,
							})
						})
					})
				} else {
					return thisObj.$api.Locations.post({
						"Account-Token": token,
						"level": 2
						// "uuid":this.stateUser.admin_info[0].department_uuid
					}).then(response => {
						response.content.array.filter((data) => {
							problem_categories1.push({
								name: data.name,
								id: data.uuid,
							})
						})
					})
				}
			},
			"get_problem_type": function(problem_categories5, items_order) {
				return thisObj.$api.ProblemCategories.post({
					"Account-Token": token,
				}).then(response => {
					console.log(problem_categories5)
					response.content.array.filter(item => item.level == 2).map(data => {
						problem_categories5.push(data)
					})
					const problemtype_name = response.content.array.filter(item => item.level == 1)
					console.log(problem_categories5)
					problemtype_name.map(data => {
						console.log(data)
						items_order.push(data)
					})
				})
			},

		}
	} else if (roleName == "min_jing" || roleName == "fu_jing") {
		return {
			"is_problem_create": false, //是否可以创建问题
			"is_problem_create_self": true, //是否可以创建自查问题
			"is_problem_create_check": true, //是否可以创建检查问题
			"is_problem_list_all": false, //是否可以全部查看问题
			"is_problem_list_of": false, //是否可以本单位查看问题
			"is_problem_list_depatmentcreate": false, //是否可以查看本单位创建的问题
			"is_problem_feeback": false, //是否可以反馈
			"is_problem_feeback_of": true, //是否可以反馈
			"is_problem_modify": false, //是否可以编辑
			// "get_problem_list": function() {
			// 	console.log(roleName)
			// },
			"get_problem_locations": function(problem_categories1, current, department_uuid) {
				if (current == 0) {
					console.log(current)
					return thisObj.$api.Locations.post({
						"Account-Token": token,
						"level": 2,
						"uuid": department_uuid
						// "uuid":this.stateUser.admin_info[0].department_uuid
					}).then(response => {
						response.content.array.filter((data) => {
							problem_categories1.push({
								name: data.name,
								id: data.uuid,
							})
						})
					})
				} else {
					return thisObj.$api.Locations.post({
						"Account-Token": token,
						"level": 2
						// "uuid":this.stateUser.admin_info[0].department_uuid
					}).then(response => {
						response.content.array.filter((data) => {
							problem_categories1.push({
								name: data.name,
								id: data.uuid,
							})
						})
					})
				}
			},
			"get_problem_type": function(problem_categories5, items_order) {
				return thisObj.$api.ProblemCategories.post({
					"Account-Token": token,
				}).then(response => {
					console.log(problem_categories5)
					response.content.array.filter(item => item.level == 2).map(data => {
						problem_categories5.push(data)
					})
					const problemtype_name = response.content.array.filter(item => item.level == 1)
					console.log(problem_categories5)
					problemtype_name.map(data => {
						console.log(data)
						items_order.push(data)
					})
				})
			},

		}
	} else if (roleName == "department_admin") {
		return {
			"is_problem_create": true, //是否可以创建问题
			"is_problem_create_SELF": true, //是否可以创建自查问题
			"is_problem_create_check": false, //是否可以创建检查问题
			"is_problem_list_all": false, //是否可以全部查看问题
			"is_problem_list_of": true, //是否可以本单位查看问题
			"is_problem_list_depatmentcreate": true, //是否可以查看本单位创建的问题
			"is_problem_feeback": true, //是否可以反馈
			"is_problem_feeback_of": true, //是否可以反馈
			"is_problem_modify": true, //是否可以编辑
			"get_problem_locations": function(problem_categories1, current, department_uuid,index) {
				if (current == 0) {
					console.log(current)
					return thisObj.$api.Locations.post({
						"Account-Token": token,
						"level": 2,
						"uuid": department_uuid
						// "uuid":this.stateUser.admin_info[0].department_uuid
					}).then(response => {
						response.content.array.filter((data) => {
							problem_categories1.push({
								name: data.name,
								id: data.uuid,
							})
						})
					})
				} else {
					return problem_categories1 = [{
						name: '请选择',
						id: 0
					}]
				}
			},
			"get_problem_type": function(problem_categories5, items_order, department_uuid) {
				return thisObj.$api.Locations.post({
					"Account-Token": token,
					"uuid": department_uuid
				}).then(response => {
					console.log(problem_categories5)
					response.content.array[0].problem_types.filter(item => item.level == 2).map(data => {
						problem_categories5.push(data)
					})
					const problemtype_name = response.content.array[0].problem_types.filter(item => item
						.level == 1)
					console.log(problem_categories5)
					problemtype_name.map(data => {
						console.log(data)
						items_order.push(data)
					})
				})
			},

		}
	} else if (roleName == "zd_admin") {
		return {
			"is_problem_create": true, //是否可以创建问题
			"is_problem_create_self": false, //是否可以创建自查问题
			"is_problem_create_check": true, //是否可以创建检查问题
			"is_problem_list_all": false, //是否可以全部查看问题
			"is_problem_list_of": false, //是否可以本单位查看问题
			"is_problem_list_depatmentcreate": true, //是否可以查看本单位创建的问题
			"is_problem_feeback": false, //是否可以反馈
			"is_problem_feeback_of": false, //是否可以反馈
			"is_problem_modify": false, //是否可以编辑
			"get_problem_locations": function(problem_categories1, current, department_uuid) {
					return thisObj.$api.Locations.post({
						"Account-Token": token,
						"level": 2
						// "uuid":this.stateUser.admin_info[0].department_uuid
					}).then(response => {
						response.content.array.filter((data) => {
							problem_categories1.push({
								name: data.name,
								id: data.uuid,
							})
						})
					})
				
			},
			"get_problem_type": function(problem_categories5, items_order, department_uuid) {
				return thisObj.$api.Locations.post({
					"Account-Token": token,
					"uuid": department_uuid
				}).then(response => {
					console.log(problem_categories5)
					response.content.array[0].problem_types.filter(item => item.level == 2).map(data => {
						problem_categories5.push(data)
					})
					const problemtype_name = response.content.array[0].problem_types.filter(item => item
						.level == 1)
					console.log(problem_categories5)
					
					problemtype_name.map(data => {
						console.log(data)
						items_order.push(data)
					})
				})
			},

		}
	} else if (roleName == "zd_leader") {
		return {
			"is_problem_create": true, //是否可以创建问题
			"is_problem_create_self": true, //是否可以创建自查问题
			"is_problem_create_check": true, //是否可以创建检查问题
			"is_problem_list_all": false, //是否可以全部查看问题
			"is_problem_list_of": true, //是否可以本单位查看问题
			"is_problem_list_depatmentcreate": true, //是否可以查看本单位创建的问题
			"is_problem_feeback": true, //是否可以反馈
			"is_problem_feeback_of": true, //是否可以反馈
			"is_problem_modify": true, //是否可以编辑
			"get_problem_locations": function(problem_categories1, current, department_uuid) {
				if (current == 0) {
					return thisObj.$api.Locations.post({
						"Account-Token": token,
						"level": 2,
						"uuid": department_uuid
						// "uuid":this.stateUser.admin_info[0].department_uuid
					}).then(response => {
						response.content.array.filter((data) => {
							problem_categories1.push({
								name: data.name,
								id: data.uuid,
							})
						})
					})
				} else {
					return thisObj.$api.Locations.post({
						"Account-Token": token,
						"level": 2
						// "uuid":this.stateUser.admin_info[0].department_uuid
					}).then(response => {
						response.content.array.filter((data) => {
							problem_categories1.push({
								name: data.name,
								id: data.uuid,
							})
						})
					})
				}
			},
			"get_problem_type": function(problem_categories5, items_order, department_uuid) {
				return thisObj.$api.Locations.post({
					"Account-Token": token,
					"uuid": department_uuid
				}).then(response => {
					console.log(problem_categories5)
					response.content.array[0].problem_types.filter(item => item.level == 2).map(data => {
						problem_categories5.push(data)
					})
					const problemtype_name = response.content.array[0].problem_types.filter(item => item
						.level == 1)
					console.log(problem_categories5)
					
					problemtype_name.map(data => {
						console.log(data)
						items_order.push(data)
					})
				})
			},

		}
	} else if (roleName == "department_leader") {
		return {
			"is_problem_create": false, //是否可以创建问题
			"is_problem_create_self": true, //是否可以创建自查问题
			"is_problem_create_check": true, //是否可以创建检查问题
			"is_problem_list_all": true, //是否可以全部查看问题
			"is_problem_list_of": true, //是否可以本单位查看问题
			"is_problem_list_depatmentcreate": true, //是否可以查看本单位创建的问题
			"is_problem_feeback": false, //是否可以反馈
			"is_problem_feeback_of": true, //是否可以反馈
			"is_problem_modify": false, //是否可以编辑
			"get_problem_locations": function(problem_categories1, current, department_uuid) {
			},
			"get_problem_type": function( problem_categories5, items_order, department_uuid) {
			},

		}
	}
}
export default getRole
