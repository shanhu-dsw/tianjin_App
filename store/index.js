import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import api from '../service/api.js';

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		user: null,
		problem_categories: [],
		locations: []
	},
	plugins: [
		createPersistedState({
			storage: {
				getItem: key => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: key => uni.removeStorageSync(key)
			}
		})
	],
	mutations: {
		'LOGIN_SUCCESS': (state, user) => state.user = user,
		'LOGIN_FAILED': (state) => state.user = null,
		'GET_PROBLEM_CATEGORIES_SUCCESS': (state, problem_categories) => state.problem_categories =
			problem_categories,
		'GET_LOCATIONS_SUCCESS': (state, locations) => state.locations = locations,
	},
	actions: {
		current({
			commit,
			state
		}, user) {
			api.setToken(state.user.token)

			api.Auth.current(user).then((response) => {
				commit('LOGIN_SUCCESS', response.data);
			}).catch((e) => {
				commit('LOGIN_FAILED');
				uni.showToast({
					title: "登录过期，请重新登录",
					icon: "none"
				})
			})
		},
		login({
			commit,
			state
		}, user) {
			return api.Auth.validate_password(user).then((response) => {
				if (response.status == "SUCCESS") {
					api.setToken(response.content.token);
					commit('LOGIN_SUCCESS', response.content);
					commit('GET_LOCATIONS_SUCCESS', response.content);
					uni.switchTab({
						url: '/pages/dashboard/index'
					});
				} else {
					uni.showToast({
						title: response.attach,
						icon: "none"
					})
				}
			});
		},
		refreshAdminToken({
			commit,
			state
		}, user) {
			return api.refreshAdminToken.all().then((response) => {
				if (response.response == "SUCCESS") {
					api.setToken(response.content.token);
					commit('GET_LOCATIONS_SUCCESS', response.content);
				}
			})
		},
		get_problem_categories({
			commit,
			state
		}, problem_categories) {
			return api.ProblemCategories.all({
				page_size: 999
			}).then((response) => {
				commit('GET_PROBLEM_CATEGORIES_SUCCESS', response.data);
			}).catch((e) => {
				uni.showToast({
					title: "登录过期，请重新登录",
					icon: "none"
				})
			})
		},
		get_locations({
			commit,
			state
		}, locations) {
			return api.Locations.all({
				"level": 2
			}).then((response) => {
				commit('GET_LOCATIONS_SUCCESS', response.data);
			}).catch((e) => {
				uni.showToast({
					title: "登录过期，请重新登录",
					icon: "none"
				})
			})
		},
		logout({
			commit,
			state
		}) {
			return api.Logout.all().then((response) => {
				console.log("退出登录了")
				uni.reLaunch({
					url: "/pages/login/index/index"
				})
				return commit('LOGIN_FAILED');
				commit('LOGIN_SUCCESS', "");
				commit('GET_LOCATIONS_SUCCESS', "");
			});

		},
	}
})

export default store
