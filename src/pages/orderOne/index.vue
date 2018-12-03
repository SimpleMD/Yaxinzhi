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
          <picker mode="date" :value="data" :start="startdate"  @change="bindDateChange">
            <view class="picker">
              {{date}}
            </view>
          </picker>
          <picker mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
            <view class="picker">
              {{time}}
            </view>
          </picker>
      </div>
    </div>
  <!-- ZitiTime end --> 

    <div class="AddressWarp" v-show='selectIndex==2'>
      <div class="AddressBtn" v-if="AddressBtn" @click="toAddress">
          <i class="fa fa-plus" aria-hidden="true"></i><text>请填写收货地址</text>
      </div>
      <div class="Address" v-else @click="toAddress">
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

    <!-- <Shopaddr :shopname="shopname"></Shopaddr> -->
     
    <OrderList v-for="(item,index) in GoodItem.googitem" :index='index' :key='item' :Shop_List='item' :shopname='shopDetail.shopName'></OrderList>
    <!--OrderList end-->

    <div class="OrderMask">
        <div class="MaskItem"><text>优惠券</text><text class="fensi" @click="fenSi">粉丝专享 ></text></div>
        <div class="MaskItem" @click="jifen(selectIco)">
          <text>积分</text>
          <div class="jifen">可使用{{point}}积分，可抵扣{{point_price}}元  
            <icon :type="selectIco?'success':'circle'" size="16" v-if="iconBool"/><icon type="success" size="16" v-else/>
          </div>
        </div>
       <div class="MaskItem" v-if='selectIndex==1'><text>自提电话:</text><input type="text" v-model="mobile" placeholder="填写你想和商家想说的" placeholder-style='font-size:26rpx;font-weight: 100;color:#8e8e8e;'></div>
       <div class="MaskItem" v-if='selectIndex==1'><text>自提点: </text>
         <!-- <input type="text" v-model="ShopName" placeholder="填写你想和商家想说的" placeholder-style='font-size:26rpx;font-weight: 100;color:#8e8e8e;'> -->
          <picker @change="bindPickerChange" :value="shopName" :range="shopArray">
          <div class="picker">
             {{shopName}}
          </div>
          </picker>
         </div>
        <div class="MaskItem"><text>备注:</text><input type="text" v-model="InputMask" placeholder="填写你想和商家想说的" placeholder-style='font-size:26rpx;font-weight: 100;color:#8e8e8e;'></div>
    </div>
    <!--OrderMask end-->

    <div class="PayType">
      <div class="PayItemTitle">支付方式</div>
      <div class="Item"  @click="selectPay(1)">
        <div class="Items"><img :src="ImgList.wxImg" /><text>微信支付</text></div>
        <div class="ItemSelect"><icon type="success" size="21" v-show='!PayBool'/><icon type="circle" size="21" v-show='PayBool'/></div>
      </div>
      <div class="Item" @click="selectPay(0)">
        <div class="Items"><img :src="ImgList.qianbao" /><text>余额支付</text></div>
        <div class="ItemSelect"><icon type="success" size="21" v-show='PayBool'/><icon type="circle" size="21" v-show='!PayBool'/></div>
      </div>
    </div>
    <!--PayType end-->

   <div class="couPonWarp" v-if="couponBool"></div>
  <div class="couponModel" v-if="couponBool">
    <div class="title">优惠卷</div>
    <div class="CouItem"><img :src="ImgList.couponModel" />
      <div class="couInfo">
        <div class="left">
          <span>新人优惠</span>
          <text>有效期：10.8 - 10.3</text>
        </div>
        <div class="right">
          <div class="btn">立即领取</div>
        </div>
      </div>
    </div>
  </div>

     
     <div class="Divheight"></div>
     <div class="footerBnt">
       <div class="selectBtn"></div>
       <div class="cartBtn">
         <div class="price">合计：{{GoodItem.goodsAmount}}元<span v-if="selectIco">优惠：{{point_price}}元</span></div>
         <div class="btn" @click="toast">结算</div>
       </div>
     </div>
     <!--footerBnt end-->
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import Lib from "@/utils/lib"
 import config from "@/config"
 import util from "@/utils/index"
//  import Shopaddr from '@/components/shopaddr'
 import OrderList from '@/components/OrderOneList'

let api = new Api
export default {
  components: {
     OrderList,
  },
   
  data () {
    return {
     ImgList:{topImg:config.imgUrl+'/cart/home.jpg',shopImg:config.imgUrl+'/cart/shopimg01.jpg',wxImg:config.imgUrl+"/store/wxzf.png",
              qianbao:config.imgUrl+"/store/qianbao.png",couponModel:config.imgUrl+"/shop/coupon.png"},
     shopname:"王小姐水果店(抚生路点)",
     shopList:[{shopImg:config.imgUrl+'/cart/shopimg01.jpg',shopTitle:'福建馆溪平柚子好吃好甜你好世界你好世界你好世界你好世界你好世界你好世界',mask:"你好世界",p1:19,p2:9},
            
          ],
      couponBool:false,
      PayBool:false,
      shopNameIndex:0,
      PayIndex:1,
      shipStatus:3,
      time: '12:01',
      shopListArry:[],
      shopDetail:{},
      shopArray:[],
      jifens:'',
      shopName:'',
      shopId:'',
      date:'',
      startdate:'',
      starttime:'',
      selectIndex:1,
      AddressBtn:false,
      iconBool:true,
      selectIco:false,
      GoodItem:[],
      AllPrice:0,
      InputMask:'',
      code:'',
      Cart:'',
      paymoney:'',
      quanquan:'',
      gainedpoint:'',
      ordername:'',
      point_price:0,
      addr:'',
      point:'',
      mobile:'',
    }
  },
  methods:{
    bindTimeChange: function (e) {
      let that = this;
      var jindata = new Date();
      let time2 = that.date + ' ' + that.time
      var startdate=new Date(time2.replace(/-/g,"/"));
      if(startdate>jindata){
              let that = this;
              that.time = e.mp.detail.value
      }else{
        Lib.Show("抱歉你选的时间不符","none",1500)
      }
    },
    bindDateChange:function(e){
       let that = this;
      var jindata = new Date();
      let time2 = that.date + ' ' + that.time
      var startdate=new Date(time2.replace(/-/g,"/"));
      if(startdate>jindata){
              let that = this;
              that.data = e.mp.detail.value
      }else{
        Lib.Show("抱歉你选的时间不符","none",1500)
      }
    },

    //店铺选择
    bindPickerChange(e){
      let that = this;
      let index = e.mp.detail.value
      that.shopName = that.shopArray[index]
      // console.log( that.shopName,"点名")
    },

    //判断是否有地址
    async SelectAdder(){
     let that =this;
     if(wx.getStorageSync('addr') == 'noaddr'){
       let addParms = {}
       addParms.memberId = wx.getStorageSync('memberId');
       let res = await api.SelectAddre(addParms)
       if(res.data.code){
          that.AddressBtn = true
       }else{
          that.addr = res.data.memberAddressDO
          that.AddressBtn = false
       }
     }else{
        that.addr=wx.getStorageSync('addr')
        that.AddressBtn = false
     }
    },
     
     //提交订单
     Order(){
       let that = this;
      if(that.Cart == 1){
        var orderamount = Number(that.GoodItem.goodsAmount).toFixed(2)
        let paymoney=0;
        let quanquan=0;
        that.GoodItem.gooditem.map(v => {
            paymoney=Number(paymoney*1+v.num * v.weight).toFixed(2)
            quanquan=Number(quanquan*1+v.num * v.point)
        })
        that.goodsAmount=orderamount;
        that.list=that.GoodItem.googitem;
        that.weight=that.GoodItem.weight;
        that.orderAmount=orderamount;
        that.gainedpoint= GoodItem.gainedpoint
      }
     },
     
     //提交按钮
     toast(){
          let that = this;
          let advance = wx.getStorageSync('advances');
          if(that.selectIndex == 1){
            console.log("asd0")
            if(that.mobile == ''){
              Lib.Show("电话为空","none",1500)
            }else{
                 if(that.PayIndex == 1){
                  that.OrderUp();
                }else{
                  if(advance >= that.GoodItem.goodsAmount){
                    that.OrderUp();
                  }else{
                    Lib.Show("余额不足","none",2000)
                  }
                } 
            }
          }else{
               console.log("asd1",that.addr,that.AddressBtn)
              if(that.addr == ''&&that.AddressBtn){
                wx.showToast({ title: '请添加地址',})
              }else{
                if(that.PayIndex == 1){
                  that.OrderUp();
                }else{
                  if(advance >= that.GoodItem.goodsAmount){
                    that.OrderUp();
                  }else{
                    Lib.Show("余额不足","none",2000)
                  }
                } 
            }
          }
        },

    //订单提交参数赋值
    OrderUp(){
       let that = this;
        let bean = {}
        let goodObj = {}
        let orderParms = {}
          wx.showLoading({
            title: '请稍等',
          })
          // 判断是否使用积分抵扣
          if (that.selectIco == true) {
            if (that.GoodItem.goodsAmount - that.point_price <= 0) {
              bean.orderAmount = 0.01
              bean.consumepoint = parseInt((that.GoodItem.goodsAmount - 0.01) * that.indexdata.pointCash)
            } else {
              bean.orderAmount = that.GoodItem.goodsAmount - that.point_price
              bean.consumepoint = that.point
            }
          }
          else {
            bean.orderAmount = that.GoodItem.goodsAmount
            bean.consumepoint = 0
          }
console.log("查看积分",that.GoodItem.googitem[0].point,that.addr,that.Cart)
          //提交方式不同
          if(that.Cart == 0){
              bean.memberId = wx.getStorageSync('memberId');
              bean.image = that.GoodItem.googitem[0].image
              bean.weight = that.GoodItem.googitem[0].weight * that.GoodItem.googitem[0].num
              bean.shippingAmount = 0
              bean.googitem = []
              goodObj.price = that.GoodItem.googitem[0].price
              goodObj.name = that.GoodItem.googitem[0].name
              goodObj.num = that.GoodItem.googitem[0].num * 1
              goodObj.cart = that.GoodItem.googitem[0].cart
              goodObj.goodsId = that.GoodItem.googitem[0].goodsId
              goodObj.catId = that.GoodItem.googitem[0].catId
              goodObj.image = that.GoodItem.googitem[0].image
              goodObj.goodsAmount = that.GoodItem.googitem[0].price * that.GoodItem.googitem[0].num
              goodObj.productId = that.GoodItem.googitem[0].productId
                bean.googitem[0] = goodObj
                bean.point = that.selectIco ? Number(that.point_price*that.indexdata.pointCash).toFixed(0):0
                bean.shopId=that.shopDetail.shopId
                bean.gainedpoint = that.GoodItem.googitem[0].point
   
                bean.province = that.addr.province
                bean.city = that.addr.city
                bean.addr = that.addr.addr
                bean.region = that.addr.region
                bean.shipMobile = that.addr.mobile
                bean.shipName = that.addr.name
                bean.addrId = that.addr.addrId
                bean.clickd = that.InputMask
                bean.payType = that.PayIndex
                bean.orderType = 1
                bean.shipStatus = that.shipStatus
                bean.shipName   = wx.getStorageSync('uname');
                if(that.shipStatus == 0){
                    bean.province = that.addr.province
                    bean.city = that.addr.city
                    bean.addr = that.addr.addr
                    bean.region = that.addr.region
                    bean.shipMobile = that.addr.mobile
                    bean.addrId = that.addr.addrId
                }else{
                  var stringTime =that.date+ ' ' + that.time;
                  var timestamp2 = Date.parse(new Date(stringTime));

                  console.log("输出时间",timestamp2,stringTime)
                  bean.takeTimes=timestamp2
                  bean.addr = that.shopName
                  bean.shipMobile = that.mobile
                }
                bean.goodsAmount = that.GoodItem.googitem[0].price * that.GoodItem.googitem[0].num
                // bean = JSON.stringify(bean)
                // orderParms.order=bean
                that.saveOrder(bean)
          }else{
            //购物车提交订单
              bean.weight = that.weight
              bean.gainedpoint = that.gainedpoint
              bean.memberId = wx.getStorageSync('memberId');
              bean.goodsAmount = that.GoodItem.goodsAmount
              bean.shippingAmount = 0
              bean.googitem = that.GoodItem.googitem
              // bean = JSON.stringify(bean)
              // orderParms.order = bean
              that.saveOrder(bean)
          }
    },
    
    //提交订单并支付
    async saveOrder(bean){
      let that = this;
      let res = await api.OrderSave(bean)
      wx.hideLoading()
      if(res.data.code == 0){
        Lib.Show("订单提交成功","success",2000)
      }
      that.order = res.data.order
       //暂无判断优惠券红包
       let orderId = res.data.order.orderId
       let ordername =''
        res.data.order.item.map(v =>{
          if(res.data.order.item.length == 1){
              ordername = v.name
          }else{
              ordername = v.name + '...'
          }
        })

      //赋值
      that.ordername = ordername
      let payorderamount = res.data.order.orderAmount
      let payordertime = util.formatTime(new Date(res.data.order.createTime))
      if(that.PayIndex == 1){
          that.wxPay(orderId,payordertime,payorderamount)
      }else{
         that.payReturen()  
      }
    },
   

   //微信支付方法封装
   wxPay(orderId,payordertime,payorderamount){
     let that = this;
     let parms ={}
      parms.orderid = orderId
      parms.sn = that.order.sn
      parms.total_fee = payorderamount * 100
      //请求支付
      api.ConfirmPay(parms,that.code).then(function(PayRes){
        wx.requestPayment({
          timeStamp: PayRes.data.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
          nonceStr: PayRes.data.nonceStr, //随机字符串，长度为32个字符以下,
          package: PayRes.data.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
          signType: PayRes.data.signType, //签名算法，暂支持 MD5,
          paySign: PayRes.data.paySign, //签名,具体签名方案参见小程序支付接口文档,
          success: res => {
            util.sendMsg(PayRes.data.package, orderId,payordertime,that.ordername, that.order.orderAmount) 
            that.payReturen()                             
          },
          fail: function (res) {
                      // fail   
                      console.log(res);
                      Lib.Show("支付失败","success",2000)
                    },
                  });
      })

   },
   payReturen(){
    let that=this
    let orderParams = {}
    // orderparms.order = order
    orderParams.orderId = that.order.orderId
    orderParams.code = 200
    orderParams.gainedpoint = that.point
    orderParams.paymoney = that.GoodItem.goodsAmount
    // parms.parms = JSON.stringify(orderparms)
    api.PaypassOrder(orderParams).then(function(res){
      console.log("保存后台订单",res)
      if(res.data.code == 0){
        console.log("进来了吗",res.data.code,wx.getStorageSync('isAgent'))
            //分润
            if (wx.getStorageSync('isAgent') != '') {
              let fenrunParm = {}
              // let params = {}
              fenrunParm.memberId = that.memberId
              fenrunParm.distribeId = wx.getStorageSync('isAgent')
              fenrunParm.monetary = that.GoodItem.goodsAmount
              fenrunParm.shareMoney = that.GoodItem.shareMoney
              console.log(fenrunParm)
              // params.params = JSON.stringify(fenrunParm)
              api.ShareProfit(fenrunParm).then(function(res){
               console.log("商品分润")
             })
            }

         //支付完成后
         console.log("44564")
         Lib.Show("支付成功","success",2000)
         setTimeout(function(){
          wx.switchTab({ url: '../index/main' });
        },1000)
       }
     }) 
   },
   //获取优惠券
   VoucherUsed(){
     let that = this;
     var parms = {}
     var parmss = JSON.parse(option.parms)
     var orderAmount = parmss.orderAmount
     parms.goodsIds = parmss.goodsIds
     parms.memberId = that.memberId
     parms = JSON.stringify(parms)
     let res = api.VoucherUsed()
   },

    //使用积分
    jifen(select){
        let that = this;
   
        if(!select){
          that.selectIco = true

          if(that.GoodItem.goodsAmount - that.point_price <= 0){
            // that.jifens = that.GoodItem.goodsAmount * 100
            // console.log("645465",select,that.jifens)
            that.point_price = that.GoodItem.goodsAmount
            // that.point_price = 0
            that.zhenPoint_price = 0
            that.GoodItem.goodsAmount = 0.01
          }else{
              that.jifens =  that.GoodItem.goodsAmount * 100
              that.GoodItem.goodsAmount =  that.GoodItem.goodsAmount - that.point_price
          }
        }else if(select){
          that.selectIco = false
          console.log("真实价格",that.AllPrice)
          that.GoodItem.goodsAmount = that.AllPrice
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

      //支付方式选择
      selectPay(index){
         let that = this;
         that.PayBool = !that.PayBool;
         that.PayIndex = index;
         if(index == 0){
           //当选择余额支付的时候判断余额

         }
      },
     
      //优惠券跳转
      fenSi(){
        let that = this;
        wx.navigateTo({ url: '../coupon/main' });
      },

    // 获取时间
    getTime(){
     let that=this
     var myDate = new Date();
     that.date=`${myDate.getFullYear()}-${myDate.getMonth()+1}-${myDate.getDate()}`
     that.time=`${myDate.getHours()+1}:${myDate.getMinutes()}`
     that.startdate=`${myDate.getFullYear()}-${myDate.getMonth()+1}-${myDate.getDate()}`
     that.starttime=`${myDate.getHours()+1}:${myDate.getMinutes()}`
    },

    //选择
    selectTo(index){
      console.log("输出",index)
      let that = this;
      that.selectIndex = index;
      that.shipStatus=index==1?3:0   
    },
    //跳转
    toAddress(){
      wx.setStorageSync('cartId',this.Cart)
      wx.setStorageSync('GoodItem',this.GoodItem)
      wx.navigateTo({ url: '../addressList/main' });
    }
  },
  onShow(){
    let that = this;
    that.shopDetail= wx.getStorageSync('shopDetail')
    that.Cart = this.$root.$mp.query.cart;
    // that.GoodItem =JSON.parse(this.$root.$mp.query.gooditem);
    // console.log("显示商品信息",that.GoodItem)
    that.point = wx.getStorageSync('point')
    that.indexdata = wx.getStorageSync('indexdata')
     

     that.getTime();
     that.GetShopName();

    //判断跳转链接
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];

    //初始化积分
    that.selectIco = false;
    that.point_price = Number(that.point/that.indexdata.pointCash).toFixed(2)
    
    //微信登录获取Code
    wx.login({
      success: res => {
        if(res.code){
          that.code = res.code
        }
      },
    });

    if(prevpage.route=="pages/addressList/main"){
        that.Cart = wx.getStorageSync('cartId')
        that.GoodItem = wx.getStorageSync('GoodItem')
        that.addr = wx.getStorageSync('addr')
        that.AddressBtn = false
      }  
      else{
        that.Cart = this.$root.$mp.query.cart;
        that.GoodItem = JSON.parse(this.$root.$mp.query.gooditem)
        that.AllPrice = that.GoodItem.goodsAmount
           //判断获取地址
        that.SelectAdder();
        that.Order();
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

.AddressWarp{padding: 20rpx 0;}
.Address{padding: 10rpx 25rpx;border-bottom: 1px solid rgb(244,244,244);
    .Address-item{@include flexc;font-weight: 100;font-size: 32rpx;}
    .itemLeft{width: 30%;}
    .itemRight{width: 70%;@include flexc;justify-content: space-between;color: #8e8e8e;}
}
.AddressBtn{text-align: center;width: 90%;margin: auto;line-height: 75rpx;background: rgb(252,154,47);border-radius: 45rpx;color: #fff;font-weight: 100;font-size: 30rpx;
   text{display: inline-block;text-align: center;}
}

.OrderMask{font-size: 28rpx;font-weight: 100;color: #666;padding: 10rpx 20rpx;border-bottom: 5px solid rgb(243,243,243);
    .MaskItem{@include flexc;justify-content: space-between;height: 75rpx;line-height: 75rpx;}
    .fensi{color: rgb(250,143,43);}
    .jifen{color: rgb(250,143,43);}
    .jifen icon{line-height: 12rpx;}
    input{width: 80%;}
}

.PayType{padding: 10rpx 20rpx;font-weight: 100;font-weight: 100;font-size: 28rpx;color: #666;
    .PayItemTitle{font-size: 34rpx;}
    img{width: 40rpx;height: 40rpx;margin-right: 15rpx;}
    .Item{padding: 16rpx 0;@include flexc;justify-content: space-between;}
    .Items{@include flexc;}
}

.couPonWarp{position: fixed;left: 0;top: 0;height: 100vh;width: 100%;z-index: 5;background: rgba(0, 0, 0, 0.295);}
.couponModel{position: fixed;top: 50%;left: 50%;z-index: 6;margin-top: -320rpx;margin-left: -190rpx;
    background: #fff;padding: 20rpx;height: 520rpx;width: 380rpx;
    .title{text-align: center;font-weight: 100;font-size: 32rpx;}
    .CouItem{position: relative;width: 375rpx;margin: auto;height: 110rpx;}
    .couInfo{position: absolute;top: 15rpx;width: 100%;font-weight: 100;font-size: 26rpx;color: #fff;}
    .couInfo{display: flex;align-items: center;justify-content: space-between;}
    .couInfo .left{width: 70%;margin-left: 5%;}
    .couInfo .right{width: 20%;padding-left: 3%;}
    .couInfo .left span{display: block;}
}

.Divheight{height: 120rpx;}
.footerBnt{@include flexc;justify-content: space-between;position: fixed;bottom: 0;width: 100%;height: 95rpx; 
           box-shadow: 0px -7px 30px rgba(0,0,0,0.1);
    .selectBtn{@include flexc;padding-left: 15rpx;font-size: 36rpx;font-weight: 100;color: #8e8e8e;}
    .selectBtn icon{margin-right: 10rpx;}
    .cartBtn{display: flex;justify-content: center;align-items: center;font-size: 36rpx;font-weight: 100;color: #8e8e8e;}
    .price{margin-right: 15rpx;font-size: 34rpx;}
    .price span{display: block;font-size: 24rpx;color: rgb(252,110,1);}
    .btn{background-image: -webkit-linear-gradient(0deg, rgb(255,191,3), rgb(252,148,53));height: 95rpx;line-height: 95rpx; width: 180rpx;text-align: center;color: #fff;}
}


</style>
