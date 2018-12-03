<template>
<div class="search">
   <div class="header">
       <div class="left"><input type="text" placeholder="请输入鲜果名称" v-model="FromStr"></div>
       <div class="right" @click="BtnSearch"><text>搜索</text></div>
   </div>
   <!--header end-->

   <!-- <div class="TabList">
     <div class="titile"><text>热门搜索</text><text @click="taps">换一批</text></div>
    <div class="tagList">
         <text v-for="(item,index) in random" :index = 'index' :key='item'>{{item.name}}</text>
    </div>   
   </div> -->
   <!--TabList end-->

   <div class="Lsit">

        <!-- <div class="item">
             <div class="ItemImg"><img :src="shopImg" /></div>
           <div class="title"> 你好世界你好世界你好世界你好世界你好世界你好世界你好世界</div>
           <div class="Price"><text>￥169.00</text><text>销量：235</text></div>
       </div> -->
      <div class="item" v-for='(item,index) in ShopList' :index='index' :key="item" @click="jumpGooddetail(item.goodsId)">
           <div class="ItemImg"><img :src="item.thumbnail" mode='aspectFit'/></div>
           <div class="title">
            <div class="fontHidden">{{item.name}}</div>
           </div>
           <div class="Price"><text class="Pri">￥{{item.price}}</text><text class="info">销量：{{item.buyCount}}</text></div>
       </div>

       <div class="Tip" v-show='showModel'>抱歉暂无该商品~~~~</div>
   </div>
</div>
</template>

<script>
import Api from "@/utils/Api"
import config from "@/config"

let api=new Api
export default {
  components: {
  },

  data () {
    return {
    shopImg:config.imgUrl+'/cart/shopimg01.jpg',
    random:[],
    ShopList:[],
    showModel:false,
    FromStr:''
    }
  },
  methods:{
    //初始化数据
   async onLoads(){
     let that = this;
     let res = await api.GetSearchList()
     that.random = res.data.random
   },
    jumpGooddetail(goodsId){
       wx.navigateTo({ url: '/pages/shopInfo/main?goodsId='+goodsId });
    },
   //点击搜索
   async BtnSearch(){
     let that = this;
     var parms = {}
     parms.condition = that.FromStr
     let res = await api.SelectIndexGoods(parms)
     that.ShopList = res.data.goodsList
     if(res.data.goodsList.length == 0){
       that.showModel = true
     }else{
       that.showModel = false
     }
   },

   //换一批
   async taps(){
     let that = this;
     let res = await api.RandomList();
     console.log("换一批",res)
     that.random = res.data.random
   },

   //点击标签
   async doKeySearch(){
     let that = this;


   }
  },
  async onShow() {
    let that=this
    
    //数据初始化
    that.onLoads()
  }
}
</script>

<style scoped lang='scss'>
@mixin flexc{
    display: flex;align-items: center
}
img{
  width: 100%;
  height: 100%;
  overflow:hidden;
}
.search{min-height: 100vh;background: #f6f6f6;}

.header{@include flexc;justify-content:space-between;padding: 20rpx;font-weight: 100;font-size: 32rpx;border-bottom: 1px solid #f4f4f4;background: #fff;
  .left{width: 84%;background: #f5f5f5;border-radius: 35rpx;padding-left: 18rpx;line-height: 65rpx;height: 65rpx;}
  .left input{height: 65rpx;}
  .right{width: 16%;text-align: center;}
  .right text{background: rgb(253,199,6);color: #fff;display: inline-block;padding: 10rpx 15rpx;font-size: 26rpx;border-radius: 10rpx;margin-left: 15rpx;}

}

.titile{@include flexc;justify-content: space-between;font-weight: 100;font-size: 34rpx;color: #666;}
.TabList{padding: 10rpx 20rpx;border-bottom: 1px solid #f4f4f4;background: #fff;
  .tagList{@include flexc;flex-wrap: wrap;margin-right: 20rpx;padding: 15rpx 0;}
  .tagList text{background: rgb(253,199,6);font-size: 24rpx;display: inline-block;padding: 5rpx 15rpx;color: #fff;} 
}



.Lsit{display: flex;align-items: center;justify-content: space-between;font-weight: 100;flex-wrap:wrap;
  .item{width: 49%;background: #fff;margin-bottom: 10rpx;}
  .ItemImg{height: 280rpx;padding: 25rpx;}
  .item .title{font-size: 30rpx;color: #666; height: 80rpx;padding: 10rpx;}
}

.Tip{font-weight: 100;text-align: center;color: rgb(141, 141, 141);margin: auto;padding-top: 20rpx;font-size: 32rpx;
  
}

.Price{@include flexc;justify-content: space-between;padding: 15rpx;
     .Pri{font-size: 34rpx;color: rgb(253,199,6);}
     .info{font-size: 25rpx;color: #ccc;}
}

</style>