<template>
  <div class="myself">
    <Userpanel :userInfo="userInfo"></Userpanel>
    <!-- 积分余额优惠劵面板 -->
    <div class="panel">
      <div class="bcgimg">
        <img :src="panel">
      </div>
      <div class="paneldetail">
        <div class="panelbox">
          <div class="boxWarp">
            <div class="panelcount">{{userInfo.point}}</div>
            <div class="panelname">积分</div>
          </div>
        </div>
        <div class="panelbox">
          <div class="boxWarp" @click="topage('../Recharge/main')">
            <div class="panelcount"  >{{userInfo.advance}}</div>
            <div class="panelname">余额/充值</div>
          </div>
        </div>
        <div class="panelbox">
          <div class="boxWarp">
            <div class="panelcount">{{vouchercount}}张</div>
            <div class="panelname">优惠劵</div>
          </div>

        </div>
        <div class="panelbox">
          <div class="boxWarp" @click="topage('../storePay/main')">
            <div class="panelcount maidan"><img :src="pianbao"/></div>
            <div class="panelname">买单</div>
          </div>
        </div>
      </div>
    </div>
<!-- 我的订单面板 -->
    <div class="orderpanel">
      <div class="title">
        <span class="left">我的订单</span>
        <span class="all">全部订单</span>
      </div>
      <div class="orderitem">
        <div class="orderlist" v-for="(item,index) in orderitem" :key="item" :index="index" @click="jumpOrder(index,item.InfoTypeId)">
          <div class="ordericon">
            <img :src="item.icon">
          </div>
          <view class='yuan' v-if="item.statuscount!=0">{{item.statuscount}}</view>
          <div class="title">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="feature">
      <div class="featurelist" v-for="(item,index) in featureitem" :key="item" :index="index" @click='topage(item.PageUrl)'>
        <div class="icon">
          <img :src="item.icon">
        </div>
        <div class="name">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config"
 import Api from "@/utils/Api"
import Userpanel from '@/components/userpanel'
let api= new Api 
export default {
  components: {
  Userpanel
  },

  data () {
    return {
     userInfo:{},
     panel:config.imgUrl+"/myself/panel.png",
     pianbao:config.imgUrl+"/myself/qianbao.png",
     orderitem:[
     {name:'待付款',icon:config.imgUrl+"/myself/daifukuan.png",statuscount:0,InfoTypeId:1},
     {name:'待发货',icon:config.imgUrl+"/myself/daifahuo.png",statuscount:0,InfoTypeId:2},
     {name:'待收货',icon:config.imgUrl+"/myself/daishouhuo.png",statuscount:0,InfoTypeId:3},
     {name:'已完成',icon:config.imgUrl+"/myself/wancheng.png",statuscount:0,InfoTypeId:4},
     ],
     featureitem:[
     {name:'自提',icon:config.imgUrl+"/myself/ziti.png",PageUrl:'../Selflifting/main'},
     {name:'积分',icon:config.imgUrl+"/myself/point.png",PageUrl:'../sign/main'},
     {name:'微分销',icon:config.imgUrl+"/myself/fenxiao.png",PageUrl:'../distribestart/main'},
     {name:'地址管理',icon:config.imgUrl+"/myself/address.png",PageUrl:'../addressList/main'},
     {name:'优惠券',icon:config.imgUrl+"/myself/youhuijuan.png",PageUrl:'../coupon/main'},
     {name:'拼团',icon:config.imgUrl+"/myself/group.png",PageUrl:'../groupitem/main'},
     {name:'联系客服',icon:config.imgUrl+"/myself/connect.png",PageUrl:'../kefu/main'}
     ],
     vouchercount:0
    }
  },

  async onShow(){
     let that=this;
     let memberId= wx.getStorageSync('memberId');
     that.memberId=memberId;  //设置memberId
     let userInfoRes= await api.getMemberInfo(memberId)

     that.userInfo=userInfoRes.data.memberDO
     wx.setStorageSync('advances',that.userInfo.advance)
    //  wx.setStorageSync('UserInfo',userInfoRes.data.memberDO,)
     
     that.orderitem[0].statuscount=userInfoRes.data.statuscount
     that.orderitem[1].statuscount=userInfoRes.data.freightstatuscount
     that.orderitem[2].statuscount=userInfoRes.data.shippedstatuscount
     that.orderitem[3].statuscount=userInfoRes.data.finishstatuscount
     that.vouchercount=userInfoRes.data.vouchercount
  },
  methods: {
   //
  async topage(url){
     let that = this;
    //微分销条件跳转
    if(url == '../distribestart/main'){
      let memberId = wx.getStorageSync('memberId');
      let res = await api.WhetherDistribe(memberId)
      if(res.data.code == 0){
        wx.navigateTo({ url: '../distribestart/main' });
      }else{
        wx.navigateTo({ url: '../distribe/main' });
      }
    }else if(url == '../kefu/main'){
       //触发打电话
     let that = this;
     let indexData = wx.getStorageSync('indexdata');

      wx.makePhoneCall({
        phoneNumber: indexData.mobile,
      })
    }
    else{
      wx.navigateTo({ url: url });
    
    }

   },
   jumpOrder(index,InfoTypeId){
    let id=index+1
    wx.navigateTo({
      url:'../orderList/main?currentTarget='+id+'&InfoTypeId='+InfoTypeId
    })
   },

  
  }
}
</script>

<style scoped lang='scss'>
  img{
    width: 100%;
    height: 100%;
    display: block;
  }
 
 .panel{
  width: 679rpx;
  height: 200rpx;
  margin: 0 auto;
  position: relative;
  box-shadow: 10rpx 10rpx 10rpx 5rpx #ccc;
  .bcgimg{
    width:100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    top: 0;
    left: 0;
  }

  .paneldetail .boxWarp{height: 98rpx;}
  .maidan img{width: 50rpx;height: 50rpx;margin: auto;}
  .panelbox{line-height: 85rpx;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;}
  .paneldetail{
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    font-weight: 100;
    font-size: 32rpx;
    top: 0;
    left: 0;
    div{
      width: 33%;
      text-align: center;
      div{
 
        width: 100%;
        line-height: 50rpx;
      }
      .panelcount{
        font-size: 0.8em;
        color:#fc9632;

      }
    }
  }
 }

 .title{
  width: 90%;
  margin: 0 auto;
  height: 130rpx;
  line-height: 130rpx;
  font-size: 1.1em;
  .all{
    float: right;
    font-size: 0.9em;
    color: #353535;
  }
 }
 .orderitem{
    width: 100%;
  display: flex;
  .orderlist{
    width: 25%;
    color:#333;
    position: relative;
    .ordericon{
      width: 78rpx;
      height: 48rpx;
      overflow: hidden;
      margin: 20rpx auto;
    }
    .yuan{
     width: 40rpx;
     height: 40rpx;
     background: #fc9632;
     font-size: 12px;
     color: #fff;
     position: absolute;
     border-radius: 50%;
     line-height: 40rpx;
     top: -5px;
     right: 14px;
     text-align: center;
    }
    .title{
      height: 50rpx;
      line-height: 50rpx;
      width: 100%;
      font-size: 0.8em;
      text-align: center;
    }
  }
 }
 .feature{
  .featurelist{
    display: flex;
    height: 100rpx;
    line-height: 100rpx;
    width: 90%;
    margin: 0 auto;
    color:#333;
    .icon{
      width: 50rpx;
      height: 50rpx;
      margin:28rpx 15rpx 25rpx 0;
      overflow: hidden;
    }
  }
 }
 
</style>
