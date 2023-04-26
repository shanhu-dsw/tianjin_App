import CONFIG from "../config/config.js"

//替换图片的真实url
 function ReplaceRealUrl(url) {
	 // console.log(url)
	const regex =/.*\/rails\//;
	const replacement = CONFIG.url_img()+"/rails/";
	// const replacement = CONFIG.base_url();
	const newUrl = url.replace(regex, replacement);
	return newUrl;
}


export default ReplaceRealUrl