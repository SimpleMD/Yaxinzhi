<template>
  <div class="Order">
    <div class="TopTab">
      <div class="Item" :class="selectIndex == 1?'active':''"  @click="selectTo(1)"><i class="fa fa-clock-o" aria-hidden="true"></i> 预约自提</div>
      <div class="Item" :class="selectIndex == 2?'active':''"  @click="selectTo(2)"><i class="fa fa-paper-plane-o" aria-hidden="true"></i> 骑手派送</div>
    </div>
    <!--TopTab end-->

   <div class="ZitiTimeWarp"  v-show='selectIndex==1'>
      <div class="ZitiTime">
          <text>预约时间</text>
          <picker mode="date" :value="startdate" :start="startdate"  @change="bindDateChange">
            <view class="picker">
              {{date}}
            </view>
          </picker>
          <picker mode="time" :value="starttime" :start="starttime" :end="endtime" @change="bindTimeChange">
            <view class="picker">
              {{time}}
            </view>
          </picker>
      </div>
    </div>
  <!-- ZitiTime end -->

    <div class="AddressWarp" v-show='selectIndex==2'>
      <div class="AddressBtn" v-if="!isAddr" @click="toAddresslist">
          <i class="fa fa-plus" aria-hidden="true"></i><text>请填写收货地址</text>
      </div>
      <div class="Address" v-if="isAddr" @click="toAddresslist">
          <div class="Address-item">
              <div class="itemLeft">收货人</div>
              <div class="itemRight"><text>{{addr.name}}</text><text>{{addr.mobile}}</text></div>
          </div>
            <div class="Address-item">
              <div class="itemLeft">收货地址</div>
              <div class="itemRight">{{addr.addr}}</div>
          </div>
      </div>
     </div>
      <!--Address end-->  
    <OrderList :Shop_List='shopList'></OrderList>
    <!--OrderList end-->

    <div class="OrderMask">
      <!-- <div class="MaskItem"><text>优惠券</text><text class="fensi">粉丝专享 ></text></div> -->
       <!--  <div class="MaskItem">
          <text>积分</text>
          <div class="jifen">可使用590积分，可抵扣5.90元  
            <icon type="circle" size="16" v-if="iconBool"/><icon type="success" size="16" v-else/>
          </div>
        </div> -->
        <div class="MaskItem" v-if='selectIndex==1'><text>提货电话:</text><input type="text" placeholder="请输入提货电话" placeholder-style='font-size:26rpx;font-weight: 100;color:#8e8e8e;' v-model="mobile"></div>
        <div class="MaskItem" v-if='selectIndex==1'><text>自提点:</text>
          <picker @change="bindPickerChange" :value="shopName" :range="shopArray">
            <div class="picker">
             {{shopName}}
           </div>
         </picker>
       </div>
       <div class="MaskItem">
         <text>配送费:</text>
         <text>{{perFreight}}元</text>
       </div>
       <div class="MaskItem"><text>备注:</text><input type="text" placeholder="填写你想和商家想说的" placeholder-style='font-size:26rpx;font-weight: 100;color:#8e8e8e;' v-model="msg"></div>
     </div>
     <!--OrderMask end-->

    <div class="PayType">
      <div class="PayItemTitle">支付方式</div>
      <div class="Item">
        <div class="Items"><img :src="ImgList.wxImg" /><text>微信支付</text></div>
        <div class="ItemSelect" @click="selectPay(1)"><icon type="success" size="21" v-show='!PayBool'/><icon type="circle" size="21" v-show='PayBool'/></div>
      </div>
      <div class="Item">
        <div class="Items"><img :src="ImgList.qianbao" /><text>余额支付</text></div>
        <div class="ItemSelect" @click="selectPay(0)"><icon type="success" size="21" v-show='PayBool'/><icon type="circle" size="21" v-show='!PayBool'/></div>
      </div>
    </div>
    <!--PayType end-->

     <div class="footerBnt">
       <div class="selectBtn"></div>
       <div class="cartBtn"><div class="price">合计：{{totlaAmount}}元
        <!-- <span>优惠：{{shopList.price*1-totlaAmount}}元</span> -->
      </div><div class="btn" @click="orderPay">{{tip}}</div></div>
     </div>
     <!--footerBnt end-->
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import Lib from "@/utils/lib"
 import config from "@/config"
 import Shopaddr from '@/components/shopaddr'
 import OrderList from '@/components/shopList'
 let api=new Api
export default {
  components: {
     OrderList,
     Shopaddr,
   
  },
   
  data () {
    return {
      ImgList:{topImg:config.imgUrl+'/cart/home.jpg',shopImg:config.imgUrl+'/cart/shopimg01.jpg',wxImg:config.imgUrl+"/store/wxzf.png",
              qianbao:config.imgUrl+"/store/qianbao.png",},
      shopList:{shopImg:'',shopTitle:'',mask:"你好世界",activityPrice:'',price:'',num:1,goodsId:'',productId:''},
      shopListArry:[],
      shopArray:[],
      PayBool:false,
       PayIndex:1,
      shopName:'',
      shopId:'',
      startdate:'',
      date:'',
      starttime:'',
      time:'',
      endtime:'21:01',
      selectIndex:1,
      isAddr:false,
      iconBool:true,
      Type:'',
      goodImg:'',
      goodname:'',
      addr:{},
      memberId:'',
      option:{},
      collagePersons:'',
      product:{},
      msg:'',
      tip:'',
      shopDetail:{},
      memberCollageId:'',
      kaituanrest:{},
      shipStatus:3,
      mobile:'',
      shopDetail:{},
      indexdata:{},
      perFreight:0,
      totlaAmount:0,
      startCutId:''
    }
  },
  methods:{
    bindTimeChange: function (e) {
      let that = this;
      that.time = e.mp.detail.value
      // let jindata = Date.parse(new Date());
      // let stringTime = Date.parse(new Date(that.date + e.mp.detail.value))
      // console.log(jindata,stringTime)
      // if(stringTime>jindata){
      //   that.time = e.mp.detail.value
      // }else{
      //   Lib.Show("抱歉你选的时间不符","none",1500)
      // }
    },
    bindDateChange:function(e){
       let that = this;
       that.date = e.mp.detail.value
      // var jindata = new Date();
      // let time2 = that.date + ' ' + that.time
      // var startdate=new Date(time2.replace(/-/g,"/"));
      // if(startdate>jindata){
      //     that.date = e.mp.detail.value
      // }else{
      //   Lib.Show("抱歉你选的时间不符","none",1500)
      // }
    },

       //店铺选择
    bindPickerChange(e){
      let that = this;
      let index = e.mp.detail.value
      that.shopName = that.shopArray[index]
      // console.log( that.shopName,"点名")
    },

     //支付方式选择
    selectPay(index){
        let that = this;
        console.log(index)
        if(index==0){
          let advances= wx.getStorageSync('advances');
          if(advances<that.totlaAmount){
           wx.showToast({
            title: "账户余额不足",
            icon: "none",
            durantion: 2000
          }) 
         }
         else{
          that.PayBool = !that.PayBool;
          that.PayIndex = index;
         }
        }
        else{
        that.PayBool = !that.PayBool;
        that.PayIndex = index;
        }
       
    },
    
    
    //选择
    selectTo(index){
      let that = this;
      that.totlaAmount=0  
      that.shipStatus=index==1?3:0  
      if(index==1){
        that.perFreight=0
      }
      else{
        if(that.shopList.activityPrice>that.indexdata.freight){
          that.perFreight=0
        }
        else{
          that.perFreight=that.indexdata.perFreight
        } 
      }   
      if(that.Type=="K"||that.Type=="C"){
        wx.showToast({
          title: "拼团暂不支持自提",
          icon: "none",
          durantion: 2000
        }) 
        that.shipStatus=0
        if(that.shopList.activityPrice>that.indexdata.freight){
          that.perFreight=0
        }
        else{
          that.perFreight=that.indexdata.perFreight
        }  
      }else{
        that.selectIndex = index;
      }
      that.totlaAmount=that.perFreight*1+that.shopList.activityPrice*1
       
    },
    // 获取货品信息
    // async getProduct(){
    //   let that=this
    //   let productRes=await api.getProduct(that.shopList.goodsId,that.memberId)
    //   that.product=productRes.data.product
    // },
    //跳转
    // toAddress(){
    //   wx.setStorageSync('options',this.option)
    //   wx.navigateTo({ url: '../address/main' });
    // },
    toAddresslist(){
      wx.setStorageSync('options',this.option)
      wx.navigateTo({ url: '../addressList/main' });
    },
   async orderPay(){
        let that=this
        console.log(that.shipStatus)
        if(that.shipStatus==0){
         if(that.addr == {}) {
          wx.showToast({
            icon:'none',
            title: '请添加地址',
          })
        }
        else{
          if(that.Type=='C'){
           var judgeIsCollagedRes=await api.judgeIsCollaged(that.memberCollageId)
           if(judgeIsCollagedRes.data.code==1){
             wx.showToast({
              icon:'none',
              title: '手慢了，已成团'
            })
             setTimeout(function(){
              wx.switchTab({
                url: '../index/main',
              })
            },1000) 
           }else{
             that.orderSave()
           }
         }
         else{
          that.orderSave()
        } 
      }
    }
    else{
      if(that.mobile==''){
       wx.showToast({
        icon:'none',
        title: '请填写提货号码',
      })
     }
     else{
       that.orderSave()
     } 
    }
    },
   async orderSave(){
        let that=this
        var bean = {}
        var goodObj={}
        wx.showLoading({
          title: '请稍等',
        })
        bean.image = that.shopList.shopImg
        bean.memberId = that.memberId
        bean.orderAmount = that.totlaAmount
        bean.weight = 0
        bean.shippingAmount = 0
        bean.goodsAmount = that.shopList.price
        bean.googitem = []
        goodObj.price = that.shopList.price
        goodObj.name = that.shopList.shopTitle
        goodObj.num = 1
        goodObj.cart = 0
        goodObj.goodsId = that.shopList.goodsId
        goodObj.image = that.shopList.shopImg
        goodObj.goodsAmount = that.shopList.price 
        goodObj.productId = that.shopList.productId
        bean.googitem[0] = goodObj
        bean.shipStatus=that.shipStatus
        bean.shopId=that.shopDetail.shopId
        bean.payType = that.PayIndex
        bean.shipName   = wx.getStorageSync('uname');

        if(that.shipStatus==0){
         bean.province = that.addr.province
         bean.city = that.addr.city
         bean.addr = that.addr.addr
         bean.region = that.addr.region
         bean.shipMobile = that.addr.mobile
         bean.addrId = that.addr.addrId
        }
        else{
          var stringTime =that.date+ ' ' + that.time;
          var timestamp2 = Date.parse(new Date(stringTime));
          bean.takeTimes=timestamp2
          bean.takeAddr = that.shopName
          bean.addr = that.shopName
          bean.shipMobile = that.mobile
        } 
        bean.clickd = that.msg  
        if(that.Type=="K"){
          // 开团
          bean.collagePersons = that.collagePersons
          bean.orderType = '2'
        }
        else if(that.Type=='Z'){
          // 限时折扣
          bean.limitId = that.shopList.limitId
          bean.orderType = '3'
        }
        else if(that.Type=='C'){
          // 参团
          bean.memberCollageId = that.memberCollageId
          bean.orderType = '2'
        }
        else{
          // 砍价
          bean.cutId=that.cutId
          bean.orderType='4'
        }
        // goodObj.catId = that.data.Goods.catId
        
        
       
        // var googitem = that.data.list; 
        let orderSave=await api.oderSave(bean)
        if(orderSave.data.code==0){
           wx.hideLoading()
           that.order=orderSave.data.order
          if(that.PayIndex == 1){      
            var params={}
            params.orderid = that.order.orderId
            params.sn = that.order.sn
            // wxc6a44ea909442b31
            params.total_fee = that.order.needPayMoney*100
            wx.login({
              success: function (res) {
                if (res.code) {
                  api.prepay(res.code,params).then(function(res){
                    var pay=res.data
                    console.log(pay.timeStamp,pay.nonceStr);
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

                      that.CouponType();
                      },
                      fail: function (res) {
                        // fail   
                        console.log(res);
                        wx.showToast({
                          title: '支付失败',
                          icon: 'success',
                          duration: 2000
                        })

                      },
                      complete: function (complete) {
                        // complete   
                        console.log(complete)
                      }
                    })
                  })
                }
              }
            })
          }else{
            that.CouponType();
          }

        }
    },

    //优惠类型
    CouponType(){
      let that = this;
      console.log(that.Type)
       if(that.Type=='K'){
        // 支付成功之后开团
        var orderparams = {}
        orderparams.goodsId = that.shopList.goodsId
        orderparams.price = that.shopList.price
        orderparams.sn = that.order.sn
        orderparams.amounts = that.order.needPayMoney * 100
        orderparams.amount = that.order.needPayMoney
        orderparams.memberId = that.memberId
        orderparams.collagePersons = that.collagePersons
        orderparams.productId = that.shopList.productId
        orderparams.num = 1
        orderparams.orderId = that.order.orderId
        api.openCollage(orderparams).then(function(res){
          that.kaituanrest=res.data 
          return api.collagePayReturn(orderparams)
        }).then(function(res){
          wx.showToast({
            title: '开团成功',
            icon: 'success',
            duration: 2000
          })
          console.log(that.kaituanrest);
          var parmss = {}
          parmss.price = that.kaituanrest.price
          parmss.goodsId=that.shopList.goodsId
          parmss.activityPrice = that.kaituanrest.activityPrice
          parmss.productId = that.shopList.productId
          parmss.goodsName = that.kaituanrest.goodsName
          parmss.memberCollageId = that.kaituanrest.memberCollageId
          parmss.img = that.kaituanrest.img
          parmss.shortPerson = that.kaituanrest.shortPerson
          if (that.kaituanrest.shortPerson == 0) {
            parmss.iscollage = 1
          }
          else {
            parmss.iscollage = 2
          }
          wx.redirectTo({
            url: '../group/main?shops=' + JSON.stringify(parmss),
          })
        })
      }
      else if(that.Type=="C"){
        // 参团
        let cantuanparams = {}
        cantuanparams.orderId = that.order.orderId
        api.collagePayReturn(cantuanparams).then(function(res){
            let cantuanorderparams = {}
            cantuanorderparams.goodsId = that.shopList.goodsId
            cantuanorderparams.price = that.shopList.price
            cantuanorderparams.sn = that.order.sn
            cantuanorderparams.amounts = that.order.needPayMoney* 100
            cantuanorderparams.amount = that.order.needPayMoney
            cantuanorderparams.memberId = that.memberId
            cantuanorderparams.memberCollageId = that.memberCollageId
            cantuanorderparams.productId = that.shopList.productId
            cantuanorderparams.num = 1
            cantuanorderparams.orderId = that.order.orderId
          return api.joinCollage(cantuanorderparams)
        }).then(function(res){
          wx.showToast({
            title: '参团成功',
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '../index/main',
          })
        })
      }
      else if(that.Type=="Z"){
        let orderParams = {}
        orderParams.orderId = that.order.orderId
        orderParams.code = 200
        orderParams.shipStatus = that.shipStatus
        orderParams.paymoney = that.order.orderAmount
        api.PaypassOrder(orderParams).then(function(paypassOrderRes){
          if(paypassOrderRes.data.code==0){
          wx.showToast({
            title: '抢购成功',
            icon: 'success',
            duration: 2000
          })
          wx.switchTab({
            url: '../index/main',
          })
        }
        })
      }
      else{
        let orderParams = {}
        orderParams.orderId = that.order.orderId
        orderParams.code = 200
        orderParams.shipStatus = that.shipStatus
        orderParams.paymoney = that.order.orderAmount
        api.PaypassOrder(orderParams).then(function(paypassOrderRes){
          if(paypassOrderRes.data.code==0){
            return api.finishCut(that.startCutId)
        }
        }).then(function(res){
          wx.showToast({
            title: '抢购成功',
            icon: 'success',
            duration: 2000
          })
          wx.switchTab({
            url: '../index/main',
          })
        })
      }
    },
    
      //获取所有店铺
      GetShopName(){
        let that = this;
        api.getshopList().then(function(res){
          that.shopListArry=res.data
          that.shopArray=res.data.map((item)=>{
            return item.shopName
          })
          that.shopName=that.shopArray[0]
          that.shopId=that.shopListArry[0].shopId
        })
      },

    //获取默认地址
    async getdefaultAddr(){
      let that=this
      let addParms = {}
      addParms.memberId = that.memberId
      let addressRes=await api.getdefaultAddr(addParms)
      if (addressRes.data.code == 1) {
        that.addr=wx.getStorageSync('addr')
        if(wx.getStorageSync('addr')=='noaddr'){
           that.isAddr=false
        }
        else{
          that.isAddr=true
        }
      }
      else {
        that.isAddr=true
        that.addr=addressRes.data.memberAddressDO
      }
  },
  // 获取时间
  getTime(){
     let that=this
     var myDate = new Date();
     that.date=`${myDate.getFullYear()}-${myDate.getMonth()+1}-${myDate.getDate()}`
     that.time=`${myDate.getHours()+1}:${myDate.getMinutes()}`
     that.startdate=`${myDate.getFullYear()}-${myDate.getMonth()+1}-${myDate.getDate()}`
     that.starttime=`${myDate.getHours()+1}:${myDate.getMinutes()}`
  }
},
  
  onLoad(options){
   var that=this
   that.getTime()
   that.GetShopName();
   that.indexdata=wx.getStorageSync('indexdata')
   that.option=options
   console.log(that.option)
   that.memberId= wx.getStorageSync('memberId')
   that.shopDetail= wx.getStorageSync('shopDetail')
   let pages = getCurrentPages();
   let prevpage = pages[pages.length-2];
   if(prevpage.route=="pages/addressList/main"){
      that.option=wx.getStorageSync('options')
      that.addr=wx.getStorageSync('addr')
   }
   else{
    that.option=options
    that.getdefaultAddr()
    that.Type= that.option.Type;
   }
   // that.getProduct()
   that.shopList.shopImg= that.option.goodsImg;
   that.shopList.productId=that.option.productId
   that.shopList.goodsId=that.option.goodsId
   that.shopList.shopTitle= that.option.goodname;
   that.shopList.price= that.option.price;
   that.shopList.activityPrice= that.option.activityPrice;
   that.shopList.shopname=that.shopDetail.shopName
   that.totlaAmount=that.shopList.activityPrice
   if( that.option.Type=="K"){
     that.selectIndex=2
     that.shipStatus=0
     that.collagePersons=that.option.collagePersons
     that.tip='立即开团'
      if(that.shopList.activityPrice>that.indexdata.freight){
        that.perFreight=0
      }
      else{
        that.perFreight=that.indexdata.perFreight
      }  
      that.totlaAmount=that.perFreight*1+that.shopList.activityPrice*1
   }
   else if(that.option.Type=='Z'){
    that.limitId=that.option.limitId
    that.tip='立即抢购'
   }
   else if(that.option.Type=='C'){
    that.selectIndex=2
    that.shipStatus=0
    that.memberCollageId=that.option.memberCollageId
    that.tip='立即参团'
     if(that.shopList.activityPrice>that.indexdata.freight){
        that.perFreight=0
      }
      else{
        that.perFreight=that.indexdata.perFreight
      }  
      that.totlaAmount=that.perFreight*1+that.shopList.activityPrice*1
   }
   else{
    that.cutId=that.option.cutId
    that.tip='立即购买'
    that.startCutId=that.option.startCutId
   }
  },
  onShow(){
    if(wx.getStorageSync('addr')!='noaddr'){
      this.addr=wx.getStorageSync('addr')
       this.isAddr=true
    }
    else{
      this.isAddr=false
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
img{display: block;height: 100%;width: 100%;}

.TopTab{@include flexc;padding: 25rpx 10rpx;margin-bottom: 15rpx;justify-content: space-around;border-bottom: 1px solid rgb(244,244,244);
   .Item{border:1rpx solid rgb(221,221,221);font-size:30rpx;color:rgb(221,221,221);padding: 12rpx 45rpx;border-radius: 10rpx;  }
   .active{border:1rpx solid rgb(253,93,5);color:rgb(253,93,5);}
}

.ZitiTime{@include flexc;justify-content: space-between;font-weight: 100;font-size: 32rpx;padding: 15rpx 25rpx;}
.inputList{
  font-size: 0.8em;
}
.AddressWarp{padding: 20rpx 0;}
.Address{padding: 10rpx 25rpx;border-bottom: 1px solid rgb(244,244,244);
    .Address-item{@include flexc;font-weight: 100;font-size: 32rpx;}
    .itemLeft{width: 30%;}
    .itemRight{width: 70%;@include flexc;justify-content: space-between;color: #8e8e8e;}
}
.AddressBtn{text-align: center;width: 90%;margin: auto;line-height: 75rpx;background: rgb(252,154,47);border-radius: 45rpx;color: #fff;font-weight: 100;font-size: 30rpx;
   text{display: inline-block;text-align: center;}
}

.PayType{padding: 10rpx 20rpx;font-weight: 100;font-weight: 100;font-size: 28rpx;color: #666;
    .PayItemTitle{font-size: 34rpx;}
    img{width: 40rpx;height: 40rpx;margin-right: 15rpx;}
    .Item{padding: 10rpx 0;@include flexc;justify-content: space-between;}
    .Items{@include flexc;}
}


.OrderMask{font-size: 28rpx;font-weight: 100;color: #666;padding: 10rpx 20rpx;
    .MaskItem{@include flexc;justify-content: space-between;height: 75rpx;line-height: 75rpx;}
    .fensi{color: rgb(250,143,43);}
    .jifen{color: rgb(250,143,43);}
    .jifen icon{line-height: 12rpx;}
    input{width: 80%;}
}

.footerBnt{@include flexc;justify-content: space-between;position: fixed;bottom: 0;width: 100%;height: 95rpx; 
           box-shadow: 0px -7px 30px rgba(0,0,0,0.1);
    .selectBtn{@include flexc;padding-left: 15rpx;font-size: 36rpx;font-weight: 100;color: #8e8e8e;}
    .selectBtn icon{margin-right: 10rpx;}
    .cartBtn{display: flex;justify-content: center;font-size: 36rpx;font-weight: 100;color: #8e8e8e;}
    .price{height: 95rpx;margin-right: 15rpx;font-size: 34rpx;}
    .price span{display: block;font-size: 24rpx;color: rgb(252,110,1);}
    .btn{background-image: -webkit-linear-gradient(0deg, rgb(255,191,3), rgb(252,148,53));height: 95rpx;line-height: 95rpx; width: 180rpx;text-align: center;color: #fff;}
}


</style>
