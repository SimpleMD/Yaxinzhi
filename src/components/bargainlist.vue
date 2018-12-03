<template> 
  <div class="ShopList">
     <div class="item" v-for="(item,index) in Shop_item" :index='index' :key='item'>
        <div class="item-warp" @click="jumpdetail(item.goodsId,item.cutId,item.productId)">
         <div class="left">
             <img :src="item.thumbnail" />
         </div>
         <div class="right">
             <div class="title">
                <div class="fontHidden">
                    {{item.name}}
                </div>
             </div>
             <div class="mask">{{item.maskInfo}}</div>
             <div class="price">
                 <div class="priceLedt ">￥<text class="newPrice">{{item.belowPrice}}</text><text class="oldPrice">{{item.initPrice}}</text></div>
                 <div class="priceRight"><img :src="btn" mode='aspectFit'/></div>
             </div>
         </div>
       </div>
     </div>
 </div>
</template>
<script>
import config from "@/config"
export default {
  props: ['Shop_item'],
    data(){
        return{
          btn:config.imgUrl+'/bargain/btn.png'
      }
  },
  methods: {
    jumpdetail:function(goodsId,cutId,productId){
        wx.navigateTo({
         url: '../bargainInfo/main?cutId=' + cutId + '&goodsId=' + goodsId+'&productId='+productId,
     })
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

.item{padding: 10rpx 16rpx;border-bottom: 3px solid rgb(247,247,247);
    .left{width: 35%}
    .left img{width: 230rpx;height: 230rpx;margin: auto}
    .right{width: 65%;padding-right: 20rpx;}
    .mask{font-size: 26rpx;color: rgb(255,128,104);font-weight: 100;}
    .title{height: 102rpx;font-weight: 100;font-size: 30rpx;color: #8e8e8e;
        div{
            line-height: 1.5;
        }
    }
    .price{@include flexc;justify-content: space-between;}
    .priceLedt{font-size: 30rpx;font-weight: 100;color: rgb(252,78,79);}
    .priceLedt .newPrice{font-size: 36rpx;margin-right: 10rpx;}
    .priceLedt .oldPrice{font-size: 26rpx;font-weight: 100;color: #8e8e8e;text-decoration:line-through}
    .priceRight img{height: 60rpx;width: 160rpx;}
}


</style>
