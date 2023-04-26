<template>
	<view class="content">
		<view class="title">默认分页</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :currentPage="page.currentPage" @change="change"></page-pagination>

		<view class="title">简单模式</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" mode="simple" :showAround="true"></page-pagination>

		<view class="title">使用汉字表示及显示省略号</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :showAround="true" :btnText="true" :forceEllipses="true"></page-pagination>

		<view class="title">保留页码中的第一页和最后一页</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :numAround="true"></page-pagination>

		<view class="title">设置中间页码显示个数</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :showAround="true" :showPageSize="7"></page-pagination>

		<view class="title">显示分页信息</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :showAround="true" :btnText="true" :showPageInfo="true"></page-pagination>

		<view class="title">自定义输入页码(可选择触发方式)</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :showAround="true" :btnText="true" :showGoPage="true" trigger="click"></page-pagination>

		<view class="title">自定义显示分页信息</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :currentPage="page.currentPage" @change="change" :showAround="true">
			<view>total：{{page.total}}，currentPage：{{page.currentPage}}，pageSize：{{page.pageSize}}</view>
		</page-pagination>

		<view class="title">大号按钮</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :btnText="true" :showAround="true" :showPageSize="4" size="large"></page-pagination>

		<view class="title">小型按钮</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :showAround="true" size="small" :showPageSize="8"></page-pagination>

		<view class="title">自定义颜色</view>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :forceEllipses="true" :showAround="true" color="#F56C6C" :btnText="true"></page-pagination>
		<page-pagination :total="page.total" :pageSize="page.pageSize" :btnText="true" :showAround="true" color="#67C23A" style="margin-top: 15rpx;"></page-pagination>
		<page-pagination :total="page.total" :pageSize="page.pageSize" color="#FF00E3" :showAround="true" style="margin-top: 15rpx;"></page-pagination>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: {
					total: 13,
					pageSize: 5,
					currentPage: 1
				}
			}
		},
		onLoad() {},
		methods: {
			change(currentPage, type) {
				this.page.currentPage = currentPage;
				console.log("点击了" + type + "，当前页：" + currentPage);
			}
		}
	}
</script>

<style>
	.content {
		padding-bottom: 100rpx;
	}

	.title {
		font-size: 28rpx;
		line-height: 32rpx;
		padding: 45rpx 30rpx 18rpx;
		color: rgba(69, 90, 100, 0.6);
	}
</style>
