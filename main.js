import Vue from 'vue'
import App from './App'
import api from './service/api.js';
import store from './store/index.js';
import VueI18n from 'vue-i18n'
import uView from '@/uni_modules/uview-ui'
import './plugins/element.js'
Vue.use(uView)

Vue.use(VueI18n);
Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$store = store;
Vue.prototype._i18n = i18n

const i18n = new VueI18n({ 
	// #ifdef MP 	
	locale: 'zh-CN', //初始化,保证刷新页面也保留
	// #endif
	// #ifdef APP-PLUS
	locale: plus.storage.getItem('locale') || 'zh-CN', //初始化,保证刷新页面也保留
	// #endif
	// #ifdef H5
	locale: localStorage.getItem('locale') || 'zh-CN', //初始化,保证刷新页面也保留
	// #endif
	// 加载语言文件的内容
	messages: { 
		'zh-CN': require('./locales/zh-CN.js').lang,
	}
})


App.mpType = 'app'

const app = new Vue({
	...App, store, i18n
});
app.$mount()


