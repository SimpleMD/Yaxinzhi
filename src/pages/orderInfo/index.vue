<template>
<div class="OrderInfo">
    <div class="header">
        <div class="left">
          <text v-if="selectIndex == 1">待收货</text>
          <text v-if="selectIndex == 2">待发货</text>
          <text v-if="selectIndex == 3">待收货</text>
          <text v-if="selectIndex == 4">待自提</text>
        </div>
        <div class="right">
          <img v-if="selectIndex == 1" :src="ImgList.headerImg01" mode='aspectFit'/>
          <img v-if="selectIndex == 2" :src="ImgList.headerImg02" mode='aspectFit'/>
          <img v-if="selectIndex == 3" :src="ImgList.headerImg03" mode='aspectFit'/>
          <img v-if="selectIndex == 4" :src="ImgList.headerImg04" mode='aspectFit'/>
        </div>
    </div>
    <!--header end-->

    <div class="AddInfo">
       <div class="left"><img :src="ImgList.ressImg" mode='aspectFit'/></div>
       <div class="right">
           <div class="name"><text>{{orderDO.shipName}}</text><text>{{orderDO.shipMobile}}</text></div>
           <div class="addressInfo">{{orderDO.shipAddr}}</div>
       </div>
    </div>
    <!--AddInfo end-->

    <div class="OrderList">
        <!-- <div ></div> -->
          <div class="OrderItem" v-for="(item,index) in orderDO.item" :index = 'index' :key='item'>
             <Shopaddr :shopname="shopname"></Shopaddr>
             <div class="orderWarp">
                  <div class="left"><img :src="item.image" /></div>
                  <div class="right">
                    <div class="orderName fontHidden">{{item.name}}</div>
                    <div class="tagNum">
                      <text class="tag"></text><text>x {{item.num}}</text></div>
                    <div class="price"><text>￥{{item.price}}</text></div>
                  </div>
             </div>
        </div>
    </div>
    <!--OrderList end-->

    <div class="MaskWarp">
        <div class="MaskItem"><text class=''>运费</text><text>￥0.00</text></div>
        <div class="MaskItem"><text class=''>积分折扣</text><text>￥{{orderDO.gainedpoint}}</text></div>
        <!-- <div class="MaskItem"><text class=''>优惠券</text><text>￥52.00</text></div> -->
        <div class="MaskItem"><text class=''>实付款</text><text class="pri">￥{{orderDO.goodsAmount}}</text></div>
    </div>
    <!--MaskWarp end-->

    <div class="footBtn">
       <!-- <text class="que">确认收货</text> -->
    </div>

</div>
</template>

<script>
import Api from "@/utils/Api"
import config from "@/config"
 import Shopaddr from '@/components/shopaddr'
 
let api=new Api
export default {
  components: {
    Shopaddr
  },

  data () {
    return {
       ImgList:{headerImg01:config.imgUrl+'/order/header01.png',headerImg02:config.imgUrl+'/order/header02.png',
                headerImg03:config.imgUrl+'/order/header03.png',headerImg04:config.imgUrl+'/order/header04.png',
                ressImg:config.imgUrl+'/order/dz.png',shopImg:config.imgUrl+'/cart/shopimg01.jpg'},
       shopname:'八一店',
       indexdata:'',
       orderDO:[],
       selectIndex:1
    }
  },
  methods:{ 
   async onLoads(option){
      let that = this;
      that.indexdata = wx.getStorageSync('indexdata')
      let params = {}
      params.orderId=option.orderId
      let res = await api.OrderIntRo(params);
      that.orderDO = res.data.orderDO

    }
  
  },
 
    onLoad(option){
     console.log(option)
     let that = this;
     that.selectIndex = option.InfoTypeId
     that.onLoads(option);
  }
}
</script>

<style scoped lang='scss'>
@mixin flexc{display: flex;align-items: center;}
img{
  width: 100%;
  height: 100%;
  overflow:hidden;
}

.header{@include flexc;background: linear-gradient(90deg, rgb(253,113,0), rgb(255,86,5));height: 250rpx;
  .left{width: 50%;text-align: center;}
  .left text{font-weight: 100;color: #fff;font-size: 40rpx;}
  .right{width: 50%;text-align: center;}
  .right img{width: 140rpx;height: 140rpx;margin: auto;}
}

.AddInfo{@include flexc;justify-content: center;padding: 20rpx 10rpx;border-bottom: 1px solid #f5f5f5;
    .left{width: 16%;text-align: center;}
    .left img{width: 70rpx;height: 65rpx;}
    .right{width: 84%;font-weight: 100;font-size: 30rpx;}
}


.OrderList{padding: 20rpx 10rpx;border-bottom: 1px solid #f5f5f5;
   .orderWarp{@include flexc;padding: 10rpx;}
   .left{width: 30%;text-align: center;}
   .left img{width: 170rpx;height: 170rpx;margin: auto;}
   .right{width: 70%;font-weight: 100;font-size: 30rpx;}
   .orderName{height: 87rpx;}
   .tagNum{@include flexc;justify-content:space-between;padding-right: 10rpx;font-size: 26rpx;font-size: rgb(129, 129, 129);margin-top: 15rpx;}
   .tag{color: rgb(251,194,2)}
   .price{text-align: right;font-size: 30rpx;color: rgb(251,194,2);padding-right: 20rpx;}
}

.MaskWarp{font-weight: 100;font-size: 30rpx;padding: 20rpx;}
.MaskItem{@include flexc;justify-content: space-between;padding: 6rpx 0;
   .pri{font-size: 36rpx;color: rgb(251,194,2)}
}


.footBtn{text-align: right;padding: 30rpx 15rpx;
  .que{display: inline-block;padding: 5rpx 25rpx;border-radius: 25rpx;font-size: 28rpx;border:1px solid rgb(251,194,2);color: rgb(251,194,2);}
}

</style>