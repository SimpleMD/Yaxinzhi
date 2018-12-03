<template>
<div class="fruiList">
  <div class="headerImg"><img :src="ListImg.fruImg1"/></div>
  <div class="maskWarp">
     <div class="maskInfo"><text>{{bigTitle}}</text><text>{{smallTitle}}</text></div>
  </div>
  <!--header end-->
 <div class="listWarp">
    <scroll-view  lower-threshold="0" class="scroll" scroll-y bindscrolltolower="loadMore">
      <div class="List">
          <div class="item" v-for="(item,index) in GoodList" :index='index' :key="item" @click="jumpshopInfo(item.goodsId)">
              <div class="topImg"><img :src="item.thumbnail" /></div>
              <div class="title fontHidden">{{item.name}}</div>
              <div class="Price"><text>￥{{item.price}}</text><img :src="ListImg.cartImg"/></div>
          </div>
          
      </div>
    </scroll-view>
  </div>
<!--List end-->

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
      ListImg:{ fruImg1:config.imgUrl+'/index/fruImg1.png', cartImg:config.imgUrl+'/ranking/cart.png',
                fruShop:config.imgUrl+'/index/fruilShop.jpg'
      },
      GoodList:[],
      catId:0,
      limit:4,
      index:0,
      bigTitle:'',
      smallTitle:''
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
      let res = await api.FruList(params)
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
    that.bigTitle = option.bigTitle
    that.smallTitle = option.smallTitle
    that.GoodList = []
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
    display: flex;align-content: center;
}

img{
  width: 100%;
  height: 100%;
  overflow:hidden;
}

.headerImg{height: 400rpx;}
.maskInfo{left: 50%;margin-left: -175rpx;width: 350rpx;height: 110rpx;font-weight: 100;font-size: 26rpx;text-align: center;margin: auto;
   text{display: block;text-align: center;color: rgb(205,194,160);}
}

.maskWarp{position: absolute;width: 100%;top: 155rpx;}
.listWarp{position: relative;
   .scroll{position: absolute;top: -80rpx;}
}

.List{@include Flexc;justify-content: space-between;flex-wrap: wrap;margin: 10rpx 35rpx;
    .item{padding: 20rpx;margin-bottom: 16rpx;width: 42%;background: #fff;box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.15);border-radius: 30rpx;font-weight: 100;}
    .item .title{font-size: 30rpx;}
    .topImg{text-align: center;}
    .topImg img{height: 250rpx;width: 250rpx;margin: auto;}
    .Price{@include Flexc;justify-content: space-between;margin-top: 20rpx;color: rgb(255,134,111);}
    .Price img{width: 50rpx;height: 50rpx;}
}


</style>