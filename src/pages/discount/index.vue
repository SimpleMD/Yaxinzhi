<template>
  <div class="bargain">
     <div class="banner" v-if="Gallery.length==1">
      <img :src="Gallery[0].imageUrl"  mode="widthFix">
    </div>
    <div class="header" v-if="Gallery.length!=1">
     <swiper class="swiper" indicator-dots='true' autoplay='true'>
      <swiper-item v-for="(item,index) in Gallery" :key="item" :index="index"><img :src="item.imageUrl" mode="widthFix"></swiper-item>
    </swiper>
  </div> 
  <scroll-view scroll-y bindscrolltolower="loadMore">
    <Discountlist :Shop_item='apiLimit' :hasmore='hasMore'></Discountlist>
  </scroll-view> 
 
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import Discountlist from "@/components/discountlist"
 let api=new Api
export default {
  components: {
    Discountlist
  },
  data () {
    return {
      apiLimit:[],
      Gallery:[],
      nowPage:0,
      hasMore:true
    }
  },
  methods:{
   async getLimit(offset,limit){
    let that=this
    let limitRes= await api.getLimit(offset,limit)
    if(limitRes.data.page.rows.length<limit){
      that.hasMore=false
    }
    else{
      that.hasMore=true
    }
    limitRes.data.page.rows.map((item)=>{
      let nowtime=(new Date()).valueOf()
      if(item.endTime<nowtime){
        item.isOver=true
      }
      else{
        item.isOver=false
      }
      return item
    })
    that.apiLimit=that.apiLimit.concat(limitRes.data.page.rows)
    that.Gallery=limitRes.data.adList
    wx.hideLoading();
   }
  },
  async onLoad() {
    let that=this
    wx.showLoading({
      title: '加载中',
    })
    that.apiLimit=[]
    that.getLimit(0,5)
  },
   onReachBottom() {
    let that=this

    if(that.hasMore){
      wx.showLoading({
        title: '玩命加载中',
      })
      that.nowPage+=1
      that.getLimit(that.nowPage,5)
    }
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    // if (!this.loading && this.data.page < this.data.pages) {
    //   this.fetchArticleList(this.data.page + 1)
    // } 
  }
}
</script>

<style scoped lang='scss'>
/*局部水平居中*/
@mixin flexc{
display: flex;align-items: center;
}

/*文本换行省略*/
@mixin fontM{
white-space:normal;overflow: hidden;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
}
img{display: block;height: 100%;width: 100%;}

</style>
