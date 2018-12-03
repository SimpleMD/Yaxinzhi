<template>
  <div class="Up">
     <div class="header"><img :src="listImg.headerImg" mode='aspectFit'/></div>
     <div class="Tou"><img :src="face"/></div>
     <div class="title">大众会员</div>
     <div class="Btn"><text @click="Membershioup">立即升级</text></div>

     <div class="List">
         <div class="ListTitle"><div class="line"></div><text>成长介绍</text></div>
     </div>

       <div class='membergarddetail'>
    <div class='membergardtitle'>
      <div>等级</div>
      <div>会员角色</div>
      <div>分润</div>
      <div>价格</div>
    </div>
    <div class='membergardlist'>
      <div class='row1'>一级分销商</div>
      <div class='row2'>
        <div>{{memberLvList[0].name}}</div>
        <div>{{memberLvList[1].name}}</div>
      </div>
      <div class='row3'>
        <div>{{memberLvList[0].desLow}}%</div>
        <div>{{memberLvList[1].desLow}}%</div>
      </div>
      <div class='row4' style='color: #C19657'>
       <div>{{memberLvList[0].point}}</div> 
       <div>{{memberLvList[1].point}}</div>
      </div>
    </div>
    <div class='membergardlist'>
      <div class='row1'>二级分销商</div>
      <div class='row2'>
        <div>{{memberLvList[0].name}}</div>
        <div>{{memberLvList[1].name}}</div>
      </div>
      <div class='row3'>
        <div>{{memberLvList[0].desHigh}}%</div>
        <div>{{memberLvList[1].desHigh}}%</div>
      </div>
      <div class='row4' style='color: #C19657'>
       <div>{{memberLvList[0].point}}</div> 
       <div>{{memberLvList[1].point}}</div>
      </div>
    </div>
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
    listImg:{headerImg:config.imgUrl+'/distribe/headerUp.jpg',weiBtn:config.imgUrl+'/distribe/weiBtn.jpg',
       },
    memberId:'',
    distribeDo:{},
    memberLvList:[],
    len:0,
    needpay:'',
    totalAssets:'',
    face:'',
    uname:''
    }
  },
  methods:{
   //选项点击加载   
   async onLoads(){

   },
   //立即升级
   Membershioup(){
    var that=this;
    let payParms = {}
    var sn = Date.parse(new Date())
    payParms.orderid = Date.parse(new Date())
    payParms.total_fee = that.needpay*100
    payParms.sn = sn
    
    wx.login({
      success: res => {
        if(res.code){
             api.ConfirmPay(payParms,res.code).then(function(Pres){
               let pay = Pres.data
               wx.requestPayment({
                timeStamp: pay.timeStamp,
                nonceStr: pay.nonceStr,
                package: pay.package,
                signType: pay.signType,
                paySign: pay.paySign,
                 success: res => {
                   Lib.Show('支付成功','success',2000)
                  let orderParm = {}
                  orderParm.sn = sn
                  orderParm.payMoney = that.needpay
                  orderParm.payStatus = 1
                  orderParm.nowlvid = that.memberLvList[1].lvId
                  orderParm.memberId = that.memberId
                  api.PayOrder(orderParm).then(function(PayRes){
                    console.log("支付完成",PayRes)
                     if (res.data.code == 0) {
                        Lib.Show('升级成功','success',1000)
                        setTimeout(function(){
                          wx.redirectTo({
                            url: '../distribe/main',
                          })
                        },1000)
                       
                      }
                  })
                 }
               });
             })
        }
      }
    });




   }
  },
  async onLoad(options) {
     let that = this;
     that.memberId = wx.getStorageSync('memberId')
     that.face = wx.getStorageSync('face');

       let res = await api.MemberLvList()
      
       that.memberLvList = res.data.memberLvList
       that.needpay = Math.abs(res.data.memberLvList[1].point - res.data.memberLvList[0].point)

        console.log("查看数据",that.memberLvList)
     //初始化数据
     that.onLoads();
  }
}
</script>

<style scoped lang='scss'>
@mixin flexc{
    display: flex;align-items: center;
}
img{display: block;height: 100%;width: 100%}

.Up{font-weight: 100;}

.header{height: 500rpx;}
.Tou{position: absolute;top: 200rpx;left: 190rpx;width: 85rpx;height: 85rpx;border-radius: 50%;overflow: hidden;}
.title{position: absolute;top: 22rpx;left: 100rpx;color: #fff;font-size: 32rpx;}
.Btn{position: absolute;right: 45rpx;top: 400rpx;color: #666;background: rgb(249,239,173);padding: 5rpx 45rpx;border-radius: 40rpx;}

.List{margin: 15rpx 25rpx;font-weight: 100;font-size: 34rpx;
   .ListTitle{@include flexc;}
   .line{display: inline-block;height: 55rpx;width: 4px;background:rgb(49,49,49); margin-right: 15rpx;}
}

.membergarddetail{
  background: #fff;
}
.membergardtitle{
display: flex;
background: #FAF4E8;
color: #C19657;
}
.title{
  height: 100rpx;
  line-height: 100rpx;
  padding-left: 20rpx;
  box-sizing: border-box;
}
.membergardtitle div{
  width: 25%;
  text-align: center;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
}
.membergardlist{
  display: flex;
  font-size: 28rpx;
  text-align: center;
  justify-content: space-around;
}
.membergardlist>div{
  width: 25%;
}
.row1{
  height: 130rpx;
  line-height: 130rpx;
}
.row2 , .row3, .row4 div{
  height: 65rpx;
  line-height: 65rpx;
}
</style>
