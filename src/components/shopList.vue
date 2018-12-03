<template>
<div class="shopWarp">
       <Shopaddr :shopname="Shop_List.shopname"></Shopaddr>
     <div class="shopList">
       <!-- <div class="selectico"> <icon type="circle" class="ico" size="21" /></div> -->

       <div class="itemLeft"><img :src="Shop_List.shopImg"/></div>
       <div class="itemRight">
          <div class="title">{{Shop_List.shopTitle}}</div>
          <small>{{Shop_List.specvalue}}</small>
          <div class="price">
             <div class="priceleft"><text>￥{{Shop_List.price}}元</text></div>
             <div class="priceright">
                 x {{Shop_List.num}}
             </div>
          </div>
       </div>
     </div>
     </div>
</template>
<script>
 import Shopaddr from '@/components/shopaddr'

export default {
  props: ['Shop_List'],
  components:{
    Shopaddr
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
.shopList{@include flexc;padding: 10rpx;border-bottom: 5px solid rgb(243,243,243);
   .itemLeft{width: 35%}
   .itemLeft img{width: 230rpx;height: 230rpx;margin: auto}
   .itemRight{width: 65%;padding-right: 20rpx;}
   .itemRight .title{@include fontM;height: 102rpx;font-weight: 100;font-size: 30rpx;color: #8e8e8e;}
   .itemRight small{font-size: 26rpx;color: #ccc;font-weight: 100;}
   .price{@include flexc;justify-content: space-between;}
   .priceleft{
     text{font-size: 36rpx;font-weight: 100;color: rgb(252,78,79);}
     span{font-size: 26rpx;font-weight: 100;color: #8e8e8e;text-decoration:line-through}
   }
   .priceright{height: 48rpx;font-size: 28rpx;font-weight: 100;color: #8e8e8e;
   }
}
</style>
