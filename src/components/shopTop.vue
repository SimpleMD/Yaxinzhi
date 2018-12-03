<template>
    <div>
      <div class="header">
        <swiper class="swiper" indicator-dots='true' autoplay='true'>
          <swiper-item><img :src="ShopInfo.brand"></swiper-item>
        </swiper>
      </div>
      <!--header end-->
      
      <div class="DataTime" v-if="ShopTipBool">
          <div class="left">
            <div class="popleNum">2人团</div>
            <div class="prcie">￥<text class="newPrice">9.90</text><text class="delPrice">￥19.9</text></div>
          </div>
          <div class="right">
              <text>00</text> 天 <text>15</text>：<text>35</text>：<text>20</text>
          </div>
      </div>
      <!--DataTime end-->

      <div class="shopTitle">
          <div class="left fontHidden">桃子水蜜桃好吃好甜你好世界你好世界你好世界你好世界你好世界你好世界界你好世界你好世界你</div>
          <div class="right"><img :src="ShopInfo.fenxiang"/><div class="fenxiang font28rpx">分享</div></div>
      </div>
      <!--shopTitle end-->

    </div>
</template>
<script>
export default {
  props: ['ShopInfo','ShopTipBool']
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
.HeightDiv{height: 110rpx;}

.header{
.swiper{height: 380rpx;}
}
.DataTime{@include flexc;justify-content: space-between;padding: 15rpx 20rpx;background-image: -webkit-linear-gradient(0deg, rgb(249,92,15), rgb(249,175,76));
    .left{@include flexc;}
    .left .popleNum{height: 40rpx;line-height: 40rpx;padding: 5rpx 22rpx;color: #fff;font-weight: 100;font-size: 28rpx;border-radius: 20rpx;border:1px solid #fff;}
    .left .prcie{margin-left: 10rpx;font-weight: 100;color: #fff;font-size: 30rpx;}
    .left .newPrice{font-size: 36rpx;}
    .left .delPrice{margin-left: 10rpx;color: #eeeeee;font-size: 26rpx;text-decoration:line-through}
    .right{color: #fff;font-weight: 100;font-size: 32rpx;}
    .right text{background: rgb(253,127,20);display: inline-block;height: 50rpx;line-height: 50rpx;width: 45rpx;border-radius: 8rpx;text-align: center;}
}

.shopTitle{padding: 0 15rpx;@include flexc;
  .left{font-weight: 100;font-size: 32rpx;height: 100rpx;color: #666;border-right: 1px solid #f5f5f5;}
  .right{width: 250rpx;height: 110rpx;text-align: center;padding-top: 10rpx;}
  .right img{height: 60rpx;width: 60rpx;margin: auto;}
  .fenxiang{color: #8e8e8e;}
}

</style>
