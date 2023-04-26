## 分页器
### 简单介绍
- 通过uni_modules引用组件，在页面template中即可直接使用，无需在页面中import和注册components；
- 可自定义显示分页信息，如总条数，每页条数等；
- 欢迎大家下载使用，项目源码示例：[https://gitee.com/lunc9932/pagination](https://gitee.com/lunc9932/pagination)

### API
#### 属性说明
| 属性名           | 类型      | 默认值   | 说明              |
|---------------|---------|---------|-----------------------|
| total         | Number  | 0       | 数据总条数             |
| pageSize      | Number  | 10      | 每页显示条数           |
| currentPage   | Number  | 1       | 当前页数               |
| mode          | String  | multi   | 显示模式，可选值：multi / simple<br>multi：标准模式；simple：简单模式，只显示当前页/总页数  |
| showAround    | Boolean | false   | 是否显示首页和尾页按钮      |
| btnText       | Boolean | false   | 上页、下页、首页和尾页是否使用汉字，默认使用箭头表示  |
| showPageSize  | Number  | 5       | 显示的页码个数，当使用 forceEllipses 和 numAround 属性时，中间显示的页码个数将 减2   |
| forceEllipses | Boolean | false   | 总页码数 超过 showPageSize 时，是否显示省略号   |
| numAround     | Boolean | false   | 是否保留页码中的第一页和最后一个，为true时不再显示首页和尾页，优先级高于 showAround 和 forceEllipses    |
| size          | String  | normal  | 按钮大小，可选值：large / normal / small<br>large：大号按钮；normal：普通按钮(默认)；small：小型按钮    |
| color         | String  | #1989FA | 自定义按钮文字颜色   |
| showPageInfo  | Boolean | false   | 是否显示分页信息，如总条数，每页条数等   |
| showGoPage    | Boolean | false   | 是否显示页码input输入框，跳转页码   |
| trigger       | String  | blur    | 页码input输入框跳转页码触发方式，可选值：blur / click<br>blur：失去焦点时触发；click：点击跳转按钮触发<br>值为blur时，不会显示跳转按钮   |

注意：
1. 当 showPageSize 属性数值过大时，可能会出现横向滚动条；
2. 当 showPageSize 属性数值小于3，且forceEllipses 或 numAround 为 true 时，中间页码将无法显示；
3. 只有当 总页码数 超过 showPageSize，且属性 forceEllipses 或 numAround 为 true 时，省略号才能显示出来；
4. 自定义分页信息只需在`<page-pagination>`标签内自定义即可，并不是写属性；



#### 事件说明
- 重复点击同一个页码，不会触发 change 事件，避免不必要的刷新；

| 事件名        | 说明                | 返回值 |
|------------|-------------------|-----|
| @change     | 页码改变时触发 | currentPage：当前页；type：点击的类型，详细见下面说明 |

##### type返回类型
| 类型     | 说明 |
| -------- | ---- |
| page     | 表示点击的是页码 |
| prev     | 点击的是上页 |
| next     | 点击的是下页 |
| homePage | 点击的是首页 |
| endPage  | 点击的是尾页 |
| goPage   | 页码input输入框触发 |

### 基本用法
在`template`中使用组件

```
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

<view class="title">自定义显示分页信息</view>
<page-pagination :total="page.total" :pageSize="page.pageSize" :currentPage="page.currentPage" @change="change" :showAround="true">
	<view>total：{{page.total}}，currentPage：{{page.currentPage}}，pageSize：{{page.pageSize}}</view>
</page-pagination>

<view class="title">自定义输入页码(可选择触发方式)</view>
<page-pagination :total="page.total" :pageSize="page.pageSize" :showAround="true" :btnText="true" :showGoPage="true" trigger="click"></page-pagination>

<view class="title">大号按钮</view>
<page-pagination :total="page.total" :pageSize="page.pageSize" :btnText="true" :showAround="true" :showPageSize="4" size="large"></page-pagination>

<view class="title">小型按钮</view>
<page-pagination :total="page.total" :pageSize="page.pageSize" :showAround="true" size="small" :showPageSize="8"></page-pagination>

<view class="title">自定义颜色</view>
<page-pagination :total="page.total" :pageSize="page.pageSize" :forceEllipses="true" :showAround="true" color="#F56C6C" :btnText="true"></page-pagination>
<page-pagination :total="page.total" :pageSize="page.pageSize" :btnText="true" :showAround="true" color="#67C23A" style="margin-top: 15rpx;"></page-pagination>
<page-pagination :total="page.total" :pageSize="page.pageSize" color="#FF00E3" :showAround="true" style="margin-top: 15rpx;"></page-pagination>
```
在`script`中使用

```
export default {
  data() {
    return {
      page:{
        total: 88,
        pageSize: 10,
        currentPage: 1
      }
    }
  },
  onLoad() { },
  methods: {
    change(currentPage, type){
      this.page.currentPage = currentPage;
      console.log("点击了" + type +"，当前页：" + currentPage);
    }
  }
}
```


