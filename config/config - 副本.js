const debugmode = true ; //debug模式true为调试环境，false为发布正式环境；
//调试环境
const debug_base_url = "http://192.168.10.240/api";
const debug_sql_query = "http://192.168.10.242:8080/sv-plugin-tianjin/module/plugin.CommonSql/query?sql=";
const debug_sql_update = "http://192.168.10.242:8080/sv-plugin-tianjin/module/plugin.CommonSql/update?sql=";
const debug_location_category_id= 26;
const debug_url_img = "http://192.168.10.240"
const debug_app_root = "http://192.168.10.242:8080/webapp/app/config.txt"
// const debug_url_img = "http://192.168.20.81:14035/ga/svducha-proj/"
//真实环境
const real_base_url = "http://192.168.20.81:14035/ga/svducha-proj/api";
const real_sql_query = "http://192.168.20.81:14035/ga/svducha-proj-8080/sv-plugin-tianjin/module/plugin.CommonSql/query?sql="; 
const real_sql_update = "http://192.168.20.81:14035/ga/svducha-proj-8080/sv-plugin-tianjin/module/plugin.CommonSql/update?sql="; 
const real_location_category_id= 26;
const real_url_img = "http://192.168.20.81:14035/ga/svducha-proj"
const real_app_root = "http://192.168.20.81:14035/ga/svducha-proj-8080/webapp/app/config.txt"
const CONFIG =
{
	is_debug : function()
	{
		return debugmode
		// return false
	},
	is_h5_mode:true,
	h5_app_root : function(){
		if(debugmode)
		{
			return debug_app_root
		}
		else
		{
			return real_app_root
		}
	},
	url_img : function(){
		if(debugmode)
		{
			return debug_url_img}
		else
		{
			return real_url_img
		}
	},
	base_url : function()
	{
		if(debugmode)
		{
			return debug_base_url}
		else
		{
			return real_base_url
		}
	},
	base_sql_query : function()
	{
		if(debugmode)
		{
			return debug_sql_query}
		else
		{
			return real_sql_query
		}	
		
	},
	base_sql_update : function(){
		if(debugmode)
		{
			return debug_sql_update}
		else
		{
			return real_sql_update
		}	
	},
	location_category_id : function()
	{
		if(debugmode)
		{
			return debug_location_category_id}
		else
		{
			return real_location_category_id
		}	
	}
};


export default CONFIG;