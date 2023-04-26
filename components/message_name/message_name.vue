<template>
	<u-popup  :show="label_popupShow" mode="bottom" :round="10">
			<view class="label_popup">
				<view class="label_popupTop">
					<view style="width:120rpx ;">
						<view class="label_popupDrop" @click="label_popupDrop">
							<image src="../../static/Vector.png"></image>
						</view>
					</view>
					
					<view class="label_popupTitle">标签</view>
					<view class="label_popupbtn" @click="saveTags">完成</view>
				</view>
				<view class="label_popupContant" >
					<view class="label_inputContant" :style="boxStyleDefault1">
						<u--input
						    placeholder="请输入内容"
						    border="surround"
							@blur="losefocusState"
							@focus="focusState"
						    v-model="labelInputvalue"
							@keyup.enter.native="deleteTags"
							@change="change"
						  ></u--input>
						  
					</view>
					<view class="infoText" v-if="isWarning">标签长度不能超过8</view>
					<view class="delete_contant">
						<text >已有标签</text>
						<image class="tagDelete_image" @click="tagDelete" src="@/static/notice/labeldelete.png" v-if="!tagClosable"> </image>
						<image class="tagDeleteBack_image" @click="tagDeleteBack" src="@/static/notice/labeldeleteBack.png" v-if="tagClosable"> </image>
					</view>
					 
					<view class="existing_label">
						<view class="u-page__tag-item" v-for="(item, index) in allTags" :key="index">
							<u-tag shape="circle"  :text="item.name" :plain="!item.checked"  :name="index"
								@click="TagClick" borderColor='#fff' color='black'  :closable='tagClosable'
								@close="closelabelTag">
							</u-tag>
						</view>
					</view>
				</view>
				
			</view>
		</u-popup>
</template>

<script>
</script>

<style>
</style>