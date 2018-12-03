<template>
  <div class="storePay">
    <div class="boxWarp">
        <div class="Box1">
            <div class="boxItem boxItem1"><span class="Price"><text>*</text> 消费总额(元)</span>
              <input  type='text' placeholder="请咨询服务员后输入" v-model="allPrice" /></div>
            <!-- <div class="boxItem"><span>参与优惠金额(元)</span><input  type='text' placeholder="请咨询服务员后输入" /></div> -->
        </div>
    </div>
    <!--boxWarp end-->
    
    <div class="selectShop">
      <text>门店选择</text>
      <picker @change="bindPickerChange" :value="shopName" :range="shopArray">
        <div class="picker">
         <span>{{shopName}}</span>
        </div>
      </picker>
    </div>

    <!-- <div class="boxWarp">
        <div class="Box1">
          <div class="ItemTitle">叠加优惠</div>
            <div class="boxItem color1">
              <span class="Price" @click="youhuiClick">
                <icon type="circle" size="18" v-show='YouBool'/>
                <icon type="success" color='rgb(249,98,105)' size="18" v-show='!YouBool'/>  使用250积分抵扣
              </span><text>-2.5</text>
            </div>
            <div class="boxItem color1"><span><img :src="youhui"/> 参与优惠金额(元)</span></div>
        </div>
    </div> -->
    <!--boxWarp end-->
    <div class="boxWarp">
      <div class="Box1">
        <div class="ItemTitle"><text>*</text> 请选择支付方式</div>
          <div class="boxItem color1 img1" @click="SelectPay(1)"><span class="Price" >
            <img :src="wxImg"/> 微信支付</span>
             <icon type="success" color='rgb(249,98,105)' size="18" v-show='PayBool'/>
             <icon type="circle" size="18"  v-show='!PayBool'/>
          </div>
          <div class="boxItem color1 img1" @click="SelectPay(0)">
            <span><img :src="qianbao"/> 余额支付</span>
            <icon type="success" color='rgb(249,98,105)' size="18" v-show='!PayBool'/>
             <icon type="circle" size="18"  v-show='PayBool'/>
          </div>
      </div>
    </div>
 <!--boxWarp end-->
    <div class="PriceWarp">
      <div v-show="!YouBool"><div class="PriceInfo youhui"><text>优惠</text><text>-2.5元</text></div></div>
      <div class="PriceInfo"><text>实际支付(元)</text><text>{{allPrice == ''? 0 : allPrice}}元</text></div> 
    </div>
    <!--PriceWarp end-->
    <div class="Btn">
      <text @click="Paysub">已和服务员确认，立即购买</text>
    </div>
    <!--Btn end-->
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import Lib from "@/utils/lib"
 import config from "@/config"
 import globalLoca from  '@/utils/qqmap-wx-jssdk'

let api = new Api
export default {
  components: {

     
  },
   
  data () {
    return {
      youhui:config.imgUrl+"/store/youhui.png",
      wxImg:config.imgUrl+"/store/wxzf.png",
      qianbao:config.imgUrl+"/store/qianbao.png",
      YouBool:true,
      PayBool:true,
      shopArray: [],
      PayTypeIndex:1,
      allPrice:'',
      shopName:'',
      shopId:''
    }
  },
  methods:{
     bindPickerChange: function(e) {
      this.shopName=this.shopArray[e.mp.detail.value] 
      this.shopId=this.shopListArry[e.mp.detail.value].shopId
    },
    
    //确认支付
     Paysub(){

      let that = this;
      if(that.allPrice == ''){
           Lib.Show('请输入金额','none',1000)
      }else{
               Lib.Loading("请稍等")
              if(that.PayTypeIndex == 0){
                that.yuPay();
              }else{
                that.wxPay();
              }
      }
 

    },
    
    //余额支付
     async yuPay(){
        let that = this;
        let params ={}

        params.consume = that.allPrice
        params.methodPayment = that.PayTypeIndex
        params.shopId = that.shopId
        params.memberId = wx.getStorageSync('memberId');
        let res = await api.BelowConsume(params)
        console.log("付款存入数据库",res)
        if(res.data.code == 0){
           wx.hideLoading();
           Lib.Show('支付成功','success',2000)
           wx.switchTab({ url: '../myself/main' });
        }
    },

    //微信支付
    wxPay(){
      let that = this;
      let payParms = {}
      var sn = Date.parse(new Date())
      payParms.orderid = Date.parse(new Date())
      payParms.total_fee = that.allPrice*100
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
                    that.yuPay()
                  }
                });
              })
          }
        }, fail: function (res) {
             wx.hideLoading();
            Lib.Show('支付失败','loading',2000)
            },
      });
    },

    //使用积分优惠
    youhuiClick(){
      let that = this;
      that.YouBool = !that.YouBool;
    },
    //选择支付方式
    SelectPay(index){
      let that = this;
      that.PayBool = !that.PayBool;
      that.PayTypeIndex = index
      if(index == 1){
        console.log("选择微信支付")
      }
      else if(index == 0){
        console.log("选择余额支付")
      }
    }
  },
  
  async onLoad(){
    let that = this;
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
/*局部水平居中*/
@mixin flexc{
display: flex;align-items: center;
}

/*文本换行省略*/
@mixin fontM{
white-space:normal;overflow: hidden;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
}
img{display: block;height: 100%;width: 100%;}
.storePay{min-height: 100vh;background: rgb(244,244,244);}

.boxWarp{padding-top: 1rpx;}
.Box1{margin: 20rpx;background: #fff;
    .boxItem{@include flexc;justify-content: space-between;padding: 20rpx 0;margin:0 20rpx;
     span{font-weight: 100;font-size: 32rpx;display: inline-block;width: 50%;}
     input{font-size: 30rpx;font-weight: 100;text-align: right;}
    }
    .boxItem1{border-bottom: 1px solid #f5f5f5;}
    .Price text{color: rgb(249,98,105);}
    .ItemTitle{margin: 0 20rpx;padding: 10rpx 0;font-weight: 100;font-size: 35rpx;border:1px solid rgb(250,250,250);}
    .ItemTitle text{color: rgb(250,141,146);}
}

.Box1{
   .color1{color: #8e8e8e;padding: 10rpx 0;font-size: 28rpx;}
   .color1 img{width: 40rpx;height: 37rpx;margin-right: 15rpx;}
   .color1 icon{margin-right: 15rpx;}
   .color1 span{@include flexc;}
   text{color: rgb(249,98,105);font-weight: 100;}
   .img1 img{width: 45rpx;height: 45rpx;}
} 

.selectShop{@include flexc;justify-content: space-between;padding: 20rpx;margin:20rpx;background:#fff;font-weight: 100;font-size: 32rpx;}

.PriceWarp,.Btn{padding: 18rpx 30rpx;font-weight: 100;font-size: 34rpx;color: #666;}
.PriceWarp{
    .PriceInfo{@include flexc;justify-content: space-between;}
    .youhui{font-weight: 100;font-size: 26rpx;color: rgb(248,118,124);}
}
.Btn text{display: block;background: rgb(249,98,105);color: #fff;text-align: center;line-height: 80rpx;border-radius: 16rpx;}

</style>
