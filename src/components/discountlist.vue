<template>
  <div class="ShopList">
   <div class="item" v-for="(item,index) in Shop_item" :index='index' :key='item'>
    <div class="item-warp" @click="jumpdetail(item.goodsId,item.limitId,item.endTime,item.finalAmount,item.isOver,item.productId,item.goodsPrice)">
     <div class="left">
       <img :src="item.thumbnail" />
     </div>
     <div class="right">
       <div class="title">
          <div class="fontHidden">{{item.goodsName}}</div>  
        </div>
       <div class="mask">{{item.limitName}}</div>
       <div class="price">
         <div class="priceLeft ">￥<text class="newPrice">{{item.finalAmount}}</text><text class="oldPrice">{{item.goodsPrice}}</text></div>
         <div class="priceRight"><img :src="btn" mode='aspectFit'/></div>
       </div>
     </div>
   </div>
 </div>
 <div class="tip" v-if="!hasmore">~~~~小果是有底线的~~~~</div>
</div>
</template>
<script>
import config from "@/config"
export default {
   props: ['Shop_item','hasmore'],
   data(){
    return{
      btn:config.imgUrl+'/discount/btn.png'
    }
    },
    methods: {
      jumpdetail:function(goodsId,limitId,endTime,finalAmount,isover,productId,goodsPrice){
        if(isover){
          wx.showToast({
            icon:'none',
            title: '该活动已结束',
          })
        }
        else{
        let url=`../discountInfo/main?goodsId=${goodsId}&limitId=${limitId}&endTime=${endTime}&finalAmount=${finalAmount}&productId=${productId}&goodsPrice=${goodsPrice}`
        wx.navigateTo({
           url: url,
        }) 
        }
               
      }
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
.item-warp,.price{@include flexc}

.item{padding: 10rpx 16rpx;border-bottom: 3px solid rgb(247,247,247); box-sizing: border-box;
    .left img{width: 230rpx;height: 230rpx;margin: auto}
    .right{padding-right: 20rpx;height: 100%;padding-left: 20rpx;box-sizing: border-box;}
    .mask{font-size: 26rpx;color: rgb(255,128,104);font-weight: 100;}
    .title{height: 130rpx;font-weight: 100;font-size: 30rpx;color: #8e8e8e;display: block;width: 450rpx;
       div{
        line-height: 1.5;
       }
      }
    .price{@include flexc;justify-content: space-between;}
    .priceLeft{font-size: 30rpx;font-weight: 100;color: rgb(252,78,79);}
    .priceLeft .newPrice{font-size: 36rpx;margin-right: 10rpx;}
    .priceLeft .oldPrice{font-size: 26rpx;font-weight: 100;color: #8e8e8e;text-decoration:line-through}
    .priceRight img{height: 60rpx;width: 160rpx;}
}
.tip{
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 0.8em;
  color: #949494;
}

</style>
