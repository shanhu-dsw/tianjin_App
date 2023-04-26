const debugmode = true ; //debug模式true为调试环境，false为发布正式环境；
//调试环境
// const debug_base_url = "http://192.168.10.150:8081/supervision-spot/module";
const debug_base_url = "http://192.168.10.150:9010/supervision-spot/module";
const debug_url_img = "http://192.168.10.150:9010/webapp/problem_file/"
const debug_app_root = "http://192.168.10.242:8080/webapp/app/config.txt"
const debug_header = {
	'Content-Type': 'application/x-www-form-urlencoded',
}
// const debug_url_img = "http://192.168.20.81:14035/ga/svducha-proj/"
//真实环境
const real_base_url = "http://192.168.20.81:14035/ga/supervision-spot-proj-9010/supervision-spot/module";
const real_url_img = "http://192.168.20.81:14035/ga/supervision-spot-proj-9010/webapp/problem_file/";
// const real_base_url = "http://192.168.20.81:14035/ga/supervision.spot-proj-9010/supervision-spot/module";
// const real_url_img = "http://192.168.20.81:14035/ga/supervision.spot-proj-9010/supervision-spot/webapp/problem_file/"
// const real_base_url = "http://192.168.20.81:14035/ga/supervision-spot/module";
// const real_url_img = "http://17.62.1.11:9010/webapp/problem_file/"
const real_app_root = "http://192.168.20.81:14035/ga/svducha-proj-8080/webapp/app/config.txt"
const real_header = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'serviceID': '0df8147c693d435cbf952365b136a8fc',
	'secretKey': 'f49b62affc166ac2e6644c000b0e3363',
	'requestType': 'service'
}
const CONFIG = {
	is_debug: function() {
		return debugmode
		// return false
	},
	is_h5_mode: true,
	h5_app_root: function() {
		if (debugmode) {
			return debug_app_root
		} else {
			return real_app_root
		}
	},
	url_img: function() {
		if (debugmode) {
			return debug_url_img
		} else {
			return real_url_img
		}
	},
	base_url: function() {
		if (debugmode) {
			return debug_base_url
		} else {
			return real_base_url
		}
	},
	headers:function(){
		if(debugmode){
			return debug_header
		}else{
			return real_header
		}
	}
};


export default CONFIG;
