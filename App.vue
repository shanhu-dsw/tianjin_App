<script>
	import {
		mapActions,
		mapState
	} from 'vuex';
	// import eruda from "./debug/eruda.js"
	export default {
		computed: mapState({
			stateUser: state => state.user,
			statelocation: state => state.locations,
		}),
		methods: {
			...mapActions(['current', 'get_problem_categories']),
			...mapActions(['current', 'get_locations']),
			...mapActions(['refreshAdminToken']),
			tokenHandler(msg) {
				console.log(msg);
			},

		},
		onLaunch: async function() {
			console.log('App Launch');
		},
		// onShow(){
		// 	eruda.init()
		// }
		onShow() {
			if (this.statelocation == "FREQUENCY_CHECK_ERROR") {

				uni.reLaunch({
					url: '/pages/login/index/index'
				});
				uni.showToast({
					title: "登录过期，请重新登录",
					icon: "none"
				})
			} else if (!this.stateUser) {
				uni.reLaunch({
					url: '/pages/login/index/index'
				});
				uni.showToast({
					title: "登录过期，请重新登录",
					icon: "none"
				})
			} else {
				this.refreshAdminToken().then((response) => {})
			}
		}
		// onShow: function() {
		// 	//获取从其他app启动传入的参数，未测试过
		// 	//为了获取token
		// 	let self=this;
		// 	setTimeout(function(){
		// 		var msg=plus.runtime.arguments;
		// 		self.tokenHandler(msg);
		// 	},200)
		// 	console.log('App Show')
		// },
		// onHide: function() {
		// 	plus.runtime.arguments='';
		// 	console.log('App Hide')
		// }
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";

	/*每个页面公共css */
	.container {
		background-color: #F5F5F5 !important;
	}

	/* #ifdef H5 */
	uni-page-head {
		display: none;
	}

	.uni-select {
		border: 0px !important;
	}

	/* #endif */
</style>
