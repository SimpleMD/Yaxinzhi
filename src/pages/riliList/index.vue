<template>
  <div class="rankind">
      <div class="HeaderImg"><img :src="ListImg.headerImg"  mode="widthFix"/></div>
   <div class="headerTitle"><img :src="ListImg.headerTitle" mode='aspectFit'/></div>
       <!--header end-->
   <div class="scrollWarp">
      <scroll-view  lower-threshold="0" class="scroll" scroll-y bindscrolltolower="loadMore">
       <div class="List">
         <div class="Item" v-for="(item,index) in GoodList" :index='index' :key='item' @click="jumpshopInfo(item.goodsId)">
           <div class="left">      
             <div class="leftImg"><img :src="item.thumbnail" /></div>
           </div>
           <div class="right">
             <div class="title fontHidden">{{item.name}}</div>
             <div class="Price"><text>￥{{item.price}}</text><img :src="ListImg.cartImg" /></div>
           </div>
         </div>
       </div>
       </scroll-view>
      </div>
  </div>
</template>

<script>
import Api from "@/utils/Api"
import Lib from "@/utils/lib"
import config from "@/config"

let api=new Api
export default {
  components: {
  },

  data () {
    return {
      ListImg:{ headerImg:config.imgUrl+'/index/riliBrand.jpg', headerTitle:config.imgUrl+'/index/riliheader.png',
                cartImg:config.imgUrl+'/ranking/cart.png',shopImg:config.imgUrl+'/ranking/shopImg.png',
                hopImg:config.imgUrl+'/ranking/shopImg.png',ico1:config.imgUrl+'/index/ico1.png',
                ico2:config.imgUrl+'/index/ico2.png',ico3:config.imgUrl+'/index/ico3.png'
      },
      GoodList:[],
      limit:4,
      index:0,
      catId:0
    }
  },
  methods:{

    //请求排行数据
    async onloads(){
      let that = this;
      let params = {}
      params.offset = that.index
      params.limit = that.limit
      params.catId = that.catId
      Lib.Loading("加载中")
      let res = await api.RiliListAll(params)
      if(res.data.code == 0){
        wx.hideLoading();
        
        if(res.data.data.length == 0){
          Lib.Show("没有更多","none",2000)
        }else{
          that.GoodList = that.GoodList.concat(res.data.data) 
        }
      }
    },
          jumpshopInfo(goodsId){
         wx.navigateTo({ url: '/pages/shopInfo/main?goodsId='+goodsId });
      },
    
  },
  onLoad(option){
    let that = this;
    that.catId = option.catId
    console.log("查看ID",that.catId)
    that.onloads();
  },
  onReachBottom:function(){
    let that = this;
    that.index += 1
    that.onloads()
    
  }
  
}
</script>
<style scoped lang='scss'>
@mixin Flexc{
  display: flex;align-items: center;
}
img{
  width: 100%;
  height: 100%;
  overflow:hidden;
}
.HeaderImg{margin: 15rpx 0;
  img{
    width: 100%;
    overflow:hidden;
  }
}
.HeaderTitle{position: absolute;top: 55rpx;left: 50%;margin-left: -202rpx;width: 404rpx;height: 166rpx;}

.scrollWarp{position: relative;}
.headerTitle{width: 190rpx;height: 80rpx;margin: auto;}

.List{margin:10rpx 30rpx;
  .Item{@include Flexc;justify-content: space-between;margin-bottom: 15rpx;background: #fff;font-weight: 100;border-bottom: 1px solid #f4f4f4;}
  .Item .left{position:relative;width: 38%;height: 100%;}
  .Item .right{width: 62%;}
  .leftImg{height: 100%;width: 100%;}
  .leftImg img{width: 230rpx;height: 230rpx;}
  .right .title{font-size: 32rpx;height: 95rpx;}
  .tag{font-size: 26rpx;margin-top: 10rpx;}
  .tagInfo{font-size: 26rpx;margin-top: 10rpx;background: rgb(247,45,45);color: #fff;padding: 0 25rpx;width: 250rpx;border-radius: 25rpx;}
  .tagInfo i{margin-right: 20rpx;}
  .right .Price{@include Flexc;justify-content: space-between;padding-right: 15rpx;margin-top: 50rpx;}
  .Price img{width: 48rpx;height: 48rpx;}
  .Price text{color: rgb(255,115,88);}
}

.Item .left{
  .ico{position: absolute;}
  .ico img{width: 70rpx;height: 70rpx;}
}


</style>