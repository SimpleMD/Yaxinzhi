<template>
  <div class="MoenyTi">
      <div class="warp">
       <div class="headerTop">
           <div class="topItem">到账银行卡：</div>
           <div class="topMoeny">{{depositBank}}{{cardno}}</div>
       </div>
       <div class="FromNum">
           <div class="title">提现到账</div>
           <div class="titleFrom">
               <input type="number" value='12312'  placeholder='请输入提现金额' v-model="Num" />
           </div>
       </div>

       <div class="tip"><text class="qian">当前账户余额{{balance}}元</text><text class="Allmoney" @click="Allmoney">全部提现</text></div>
       <div class="liTixian"><text @click="putforwardbtn">立即提现</text></div>
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
    listImg:{headerImg:config.imgUrl+'/distribe/headerImg.jpg',weiBtn:config.imgUrl+'/distribe/weiBtn.jpg',
           item01:config.imgUrl+'/distribe/item01.png',item02:config.imgUrl+'/distribe/item02.png',
           item03:config.imgUrl+'/distribe/item03.png',
       },
       Num:0,
    memberId:'',
    balance:'',
    cardno:'',
    depositBank:''
    }
  },
  methods:{
   Allmoney(){
       let that = this;
       that.Num = that.balance
   },
   //金额提现
   async putforwardbtn(){
     let that = this;
     if(that.balance*1 <that.Num*1){
       Lib.Show("账号余额不足","none",1500)
     }else{
         let parms = {}
         parms.memberId = that.memberId
         parms.amount = that.Num
         let res = await api.Withdraw(parms)
         console.log(res,"iakj ")
         if(res.data.code == 0){
            Lib.Show("提现申请成功","success",2000)
            that.balance = that.balance-that.Num
            that.Num = ''
            setTimeout(function(){
                wx.navigateTo({ url: '../distribe/main' });
            },1000)
         }else{
              Lib.Show("提现申请失败","node",2000)
                setTimeout(function(){
                wx.navigateTo({ url: '../distribe/main' });
                },1000)
         }
     } 
   }
  },
   onLoad(options) {
     let that = this;
     that.memberId = wx.getStorageSync('memberId')
     that.balance = options.balance
     that.cardno = options.cardno.slice(-4)
     that.depositBank = options.depositBank
    
  }
}
</script>

<style scoped lang='scss'>
@mixin flexc{
    display: flex;justify-content: center;
}

img{display: block;height: 100%;width: 100%}

.MoenyTi{background: #f8f8f8;padding-top: 1rpx;min-height: 100vh;}
.warp{margin: 15rpx;padding: 20rpx;background: #fff;padding-top: 1rpx;}
.headerTop{padding: 20rpx;font-size: 34rpx;font-weight: 100;}
.FromNum{padding: 20rpx;font-size: 34rpx;font-weight: 100;}

.tip{@include flexc;justify-content: space-between;padding: 0 20rpx;font-size: 28rpx;font-weight: 100;
  .qian{color: #ccc;}
  .Allmoney{background: rgb(223,198,144);color: #fff;padding: 8rpx 15rpx;border-radius: 30rpx;}
}
.titleFrom{border-bottom: 1px solid rgba(204, 204, 204, 0.233);}
.liTixian{text-align:center;padding: 20rpx;
   text{font-size: 26rpx;background:rgb(223,198,144);font-weight: 100;padding: 15rpx 30rpx;border-radius: 30rpx; }
}
</style>
