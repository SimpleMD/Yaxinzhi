<template>
<div class="recharge">
    <div class="Header">
      <div class="left"><img :src="UserInfo.face"/></div>
      <div class="right">{{UserInfo.uname}}</div>
    </div>
    <!--Header end-->

    <div class="List">
      <div class="Item" v-for="(item,index) in rechargeList" :index='index' :key="item" :class="{'active':item.isSelect}" @click="choose(index)">充{{item.money}}元得{{item.money+item.giveMoney}}</div>
    </div>
    <!--List end-->
    <div class="shopName">
      <picker @change="bindPickerChange" :value="shopName" :range="shopArray">
        <div class="picker">
          <span>充值门店:</span><span>{{shopName}}</span>
        </div>
      </picker>
    </div>
    <div class="btn" @click="recharge">充值</div>
</div>
</template>

<script>
import Tab from '@/components/tab';
import Api from "@/utils/Api"
import Goodlist from '@/components/goodlist';
import config from "@/config"
let api=new Api
export default {
  components: {
   Goodlist
  },

  data () {
    return {
      UserInfo:{},
      shopArray: [],
      shopName:'',
      rechargeList:[],
      memberId:'',
      shopListArry:[],
      shopId:''
    }
  },
  methods:{
    bindPickerChange: function(e) {
      this.shopName=this.shopArray[e.mp.detail.value] 
      this.shopId=this.shopListArry[e.mp.detail.value].shopId
    },
   choose(index){
    let that=this
    that.rechargeList.map((item)=>{
      item.isSelect=false
    })
    that.rechargeList[index].isSelect=true
   },
   recharge(){
    let that=this
    let recharge=that.rechargeList.find((item)=>{
      if(item.isSelect){
        return item
      }
    })
    wx.showModal({
      title: '充值提示',
      content: '充值'+recharge.money+'送'+recharge.giveMoney,
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等',
          })
           let payParms={}
           var  sn = Date.parse(new Date())
           payParms.orderid = Date.parse(new Date())
           payParms.total_fee = 1
           payParms.sn = sn
           wx.login({
             success: function (res) {
               if (res.code) {
                api.prepay(res.code,payParms).then(function(res){
                  var pay=res.data
                  wx.requestPayment({
                    timeStamp: pay.timeStamp,
                    nonceStr: pay.nonceStr,
                    package: pay.package,
                    signType: pay.signType, 
                    paySign: pay.paySign,
                    success: function (res) {
                      wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 2000
                      })
                      api.topUp(that.memberId,recharge.id,that.shopId).then(function(res){
                        if(res.data.code==0){
                          wx.showToast({
                            title: '充值成功',
                            icon: 'success',
                            duration: 2000
                          })
                          wx.switchTab({
                            url: '../myself/main',
                          })
                        }
                      })
                    }
                  })
                })
               }
             }
           })


        
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    console.log(recharge);
   }
  },
  async onLoad(){
    let that = this;
    that.memberId= wx.getStorageSync('memberId')
    that.UserInfo.face = wx.getStorageSync('face');
    that.UserInfo.uname = wx.getStorageSync('uname');
    let shopList=[]
    let accountRes= await api.accountSettingList()
    if(accountRes.data.code==0){
      accountRes.data.data=accountRes.data.data.map((item)=>{
        item.isSelect=false
        return item
      })
      accountRes.data.data[0].isSelect=true
      that.rechargeList=accountRes.data.data
    }
   
    api.getshopList().then(function(res){
      that.shopListArry=res.data
      that.shopArray=res.data.map((item)=>{
        return item.shopName
      })
      that.shopName=that.shopArray[0]
      that.shopId=that.shopListArry[0].shopId
    })
  }
}
</script>

<style scoped lang='scss'>
@mixin Flexc{
  display: flex;align-items: center
}
img{
  width: 100%;
  height: 100%;
  display: block;
  overflow:hidden;
}
.Header{@include Flexc;padding: 20rpx 30rpx 10rpx;font-weight: 100;font-size: 34rpx;
   .left img{width: 90rpx;height: 90rpx;border-radius: 50%;margin-right: 15rpx;}
}
.picker{
  width: 95%;
  margin: 0 auto;
  height: 100rpx;
  line-height: 100rpx;
}
.List{padding: 25rpx;margin-bottom: 16rpx;@include Flexc;flex-wrap: wrap;font-weight: 100;font-size: 32rpx;line-height: 90rpx;
  .Item{width: 30%;margin-bottom: 16rpx;margin-right: 1.3%;margin-left: 1.3%;border-radius: 10rpx;
        text-align: center;color:#ccc;border:1px solid #ccc;}
  .active{
    color: rgb(252,153,47);border:1px solid rgb(252,153,47);
  }
}

.btn{width: 55%;margin: auto;background: rgb(252,153,47);color: #fff;font-size: 32rpx;line-height: 75rpx;text-align: center;border-radius: 15rpx;}


</style>