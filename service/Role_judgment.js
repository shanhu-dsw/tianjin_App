import {
	mapActions,
	mapState
} from 'vuex';
import moment from 'moment';
computed: mapState({
	stateUser: state => state.user,
	statelocation: state => state.locations,
})

function getRole(roleName) {
	console.log(roleName)
	if (roleName == "superadmin" || roleName == "ds_admin") {
		return {
			"is_problem_create": true, //是否可以创建问题
			"is_problem_create_SELF": true, //是否可以创建自查问题
			"is_problem_create_CHECK": true, //是否可以创建检查问题
			"is_problem_list": true, //是否可以查看问题
			"is_problem_Feeback": true, //是否可以反馈
			"is_problem_modify": true, //是否可以编辑
			"get_problem_list": function() {
				console.log(roleName)
			},
			"get_problem_type": function() {
				this.$api.Locations.post({
					"Account-Token": this.statelocation.token,
					"level": 2
					// "uuid":this.stateUser.admin_info[0].department_uuid
				}).then((response) => {
					return response
					console.log(response)
					// this.problem_categories1 = [{
					// 	name: '请选择',
					// 	id: 0
					// }]
					// response.content.array.filter((data) => {
					// 	this.problem_categories1.push({
					// 		name: data.name,
					// 		id: data.uuid,
					// 	})
					// })
					// this.$api.ProblemCategories.post({
					// 	"Account-Token": this.statelocation.token,
					// }).then(response => {

					// 	const problemtype_name = response.content.array.filter(item => item.level ==
					// 		1)
					// 	this.problem_categories5 = response.content.array.filter(
					// 		item => item
					// 		.level == 2)
					// 	this.problem_categories3 = [{
					// 		name: '请选择',
					// 		id: 0
					// 	}]
					// 	problemtype_name.map(data => {
					// 		console.log(data)
					// 		this.items_order.push(data)
					// 	})

					// 	console.log(problemtype_name)
					// 	this.bindPickerChange3()
					// })
				})
			}
		}
	}
}
export default getRole
