<template>
  <div class="distribefrom">
      <div class="warp">
      <div class="boxWarp">
            <div class="header"><img :src="MemberIcon" mode='aspectFit'/></div>
            <div class="item"><input type="text" v-model="UserName" placeholder="名字" placeholder-style='color:#ccc;font-weight: 100'></div>
            <div class="item"><input type="text" v-model="UserPhone" placeholder="电话" placeholder-style='color:#ccc;font-weight: 100'></div>
            <div class="item"><input type="text" v-model="UserMa" placeholder="身份证号码" placeholder-style='color:#ccc;font-weight: 100'></div>
            <div class="item"><input type="text" v-model="UserYin" placeholder="银行卡号" placeholder-style='color:#ccc;font-weight: 100'></div>
            <div class="item"><input type="text" v-model="UserYinName" placeholder="开户银行" placeholder-style='color:#ccc;font-weight: 100'></div>
            <div class="Btn">
                <text @click="next">提交并支付{{money}}元</text>
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
             MemberIcon:config.imgUrl+'/distribe/memberIcon.jpg',
             money:'',
             ivid:'',
             memberId:'',
             UserName:'',
             UserPhone:'',
             UserMa:'',
             UserYin:'',
             UserYinName:''
    }
  },
  methods:{
   //选项点击加载   
   async next(){
      var that = this;
        if (that.UserMa == "" || that.UserMa.length!=18) { 
          Lib.Show('身份证格式错误','loading',1000)
        }
        else if (that.UserName == '') {
           Lib.Show('姓名不能为空','loading',1000)
        } else if (that.UserPhone == '') {
           Lib.Show('电话不能为空','loading',1000)
        }
        else if (that.UserYin == "") {
           Lib.Show('银行卡号为空','loading',1000)
        }
        else if (that.UserYinName == "") {
          Lib.Show('开户银行为空','loading',1000)
        } else {
            Lib.Loading("请稍等")
            var parms = {}
            parms.name = that.UserName
            parms.referrer = wx.getStorageSync('isisAgent')
            parms.lvid = that.ivid; 
            parms.mobile = that.UserPhone
            parms.memberId = that.memberId
            parms.midentity = that.UserMa
            parms.cardno = that.UserYin
            parms.depositBank = that.UserYinName
 
            let res = await api.SubmitDistribeApply(parms)
            console.log(" 提交信息",res)
            if(res.data.code == 0){
                //  订单提交成功，唤起微信支付
                let payParms={}
                var  sn = Date.parse(new Date())
                payParms.orderid = Date.parse(new Date())
                payParms.total_fee = that.money*100 
                payParms.sn = sn

                //获取Code
                wx.login({
                  success: res => {
                      if(res.code){
                          //请求支付信息
                           api.ConfirmPay(payParms,res.code).then(function(Payres){
                             // 支付签字
                             let pay = Payres.data
                             wx.requestPayment({
                                timeStamp: pay.timeStamp,
                                nonceStr: pay.nonceStr,
                                package: pay.package,
                                signType: pay.signType,
                                paySign: pay.paySign,
                               success: res => {
                                   Lib.Show('支付成功','success',2000)
                                    let orderParm={}
                                    orderParm.sn = sn
                                    orderParm.payMoney =that.money
                                    orderParm.payStatus  = 0
                                    orderParm.memberId = that.memberId
                                    api.PayOrder(orderParm).then(function(OrderRes){
                                        console.log("支付成功",OrderRes)
                                        if(OrderRes.data.code == 0){
                                            wx.redirectTo({
                                              url: '../distribe/main',
                                            })
                                        }
                                    })
                               }
                             });
                           })
                      }
                  }
                })
            }
       }
     
   }
  },
   onLoad(options) {
     let that = this;
     var memberId = wx.getStorageSync('memberId')
     that.money = options.money
     that.ivid = options.ivid
     console.log(options)
     that.memberId = memberId
     console.log()
  }
}
</script>

<style scoped lang='scss'>
@mixin flexc{
display: flex;align-items: center;
}

/*文本换行省略*/
@mixin fontM{
white-space:normal;overflow: hidden;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
}
img{display: block;height: 100%;width: 100%;}
.distribefrom{background: #f5f5f5;min-height: 100vh;}

.warp{padding-top: 1px;}
.header img{height: 75rpx;}
.boxWarp{margin: 20rpx 20rpx;padding: 20rpx 20rpx 30rpx;background: #fff;}
input{text-align: center;}
.item{border-bottom: 1px solid #ccc;padding: 25rpx 0;}

.Btn{margin-top: 25rpx;
    text{display: block;margin: auto;line-height: 75rpx;color: #fff;font-weight: 100;font-size: 30rpx;width: 320rpx;text-align: center;border-radius: 30rpx;background: rgb(245,230,152);}
}

</style>
