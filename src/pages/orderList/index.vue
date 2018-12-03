<template>
  <div class="OrderList">
      <div class="tab"><Tabs @listenToChild='onselect' :find_item='find_item' :wid='width'></Tabs></div>
      <!--tab end-->
      <div class="shopList" v-if="kong != 0">
        <div class="Item" v-for="(orderItem,index) in orderList" :index='index' :key='orderItem'>
          <div class="ItemHeader">
            <div class="orderBh">订单编号：{{orderItem.sn}}</div>
             <!-- <div class="addr"><div class="topImg"><img :src="topImg"/></div><text>{{shopname}}</text><small>[切换]</small> </div> -->
             <div class="addInfo">
               <text class="status_Box" v-if="orderItem.status==0&orderItem.shipStatus==0">待付款</text>
               <text class="status_Box" v-if="orderItem.status==1 || orderItem.status == 2&orderItem.shipStatus==0&orderItem.payStatus==2">待发货</text>
               <text class="status_Box" v-if="orderItem.status==3&orderItem.shipStatus==1&orderItem.payStatus==2">待收货</text>
               <text class="status_Box" v-if="orderItem.status==4||orderItem.status == 3&orderItem.shipStatus==2&orderItem.payStatus==2">已完成</text>
             </div>
          </div>
           <div class="shopWarp" v-for="(shopItme,ind) in orderItem.item" :index='ind' :key="shopItme">
            <div class="addr"><div class="topImg"><img :src="topImg"/></div><text>{{shopItme.shopName}}</text> </div>
            <div class="List">
              <div class="left"><img :src="shopItme.image"/></div>
              <div class="right">
                  <div class="Itemtitle fontHidden">{{shopItme.name}}</div>
                  <div class="NumInfo">
                     <text class="tag">桃子水密桃</text>
                     <span><text class="Num">x {{shopItme.num}}</text><text class="price">￥{{shopItme.price}}</text></span> 
                  </div>
              </div>
            </div>
          </div>
          <div class="shopWarpInfo"><text>共{{orderItem.shopNum}}件商品</text><text class="zongji">合计：￥{{orderItem.orderAmount}}</text></div>
          <div class="warpBtn" v-show="btnSelect!=0">
            <div class="Btn" v-show='btnSelect==1'>
              <text class="btn1" @click="CancelOrder('取消订单',orderItem.orderId,index)">取消订单</text>
              <text class="btn2" @click="Payoff('确认付款',orderItem.orderId,index,orderItem.status,orderItem.needPayMoney,orderItem.sn)">确认付款</text>
            </div>
            <div class="Btn" v-show='btnSelect==2'>
              <text @click="SelectOrder(orderItem.orderId)" class="btn2">查看订单</text>
            </div>
            <div class="Btn" v-show='btnSelect==3'>
              <text class="btn1" @click="SelectOrder(orderItem.orderId)">查看订单</text>
              <text class="btn2" @click="queShop(index,orderItem.orderId)">确认收货</text>
            </div>
            <div class="Btn" v-show='btnSelect==4'>
              <text class="btn1" @click="SelectOrder(orderItem.orderId)">查看订单</text>
              <text class="btn2" @click="DelShop(index,orderItem.orderId)">删除订单</text></div>
          </div>
        </div>
      </div>
      <div class="kong" v-if="length == 0">
        <img :src="kong" mode='aspectFit'/>
        <div class="Konginfo">订单空空如也~~~</div>
      </div>
      <!--shopList end-->
      
      <div class=""></div>
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import Lib from "@/utils/lib"
 import config from "@/config"
 import Tabs from "@/components/tab.vue"
 import ShopTit from "@/components/shopaddr.vue"

 let api= new Api 
export default {
  components: {
     Tabs,
     ShopTit
  },
   
  data () {
    return {
          topImg:config.imgUrl+'/cart/home.jpg',
          shopImg:config.imgUrl+'/cart/shopimg01.jpg',
          kong:config.imgUrl+'/myself/kong.png',
          find_item:[{name:"全部",selected:true},{name:"待付款",selected:false},{name:"待发货",selected:false},{name:"待收货",selected:false},{name:"已完成",selected:false}],
          width:"20%",
          shopname:'小程序鲜果零食店',
          orderList:[],
          InfoTypeIndex:0,
          total_fee:'',
          orderId:'',
          btnSelect:0,
          memberId:'',
          orderArry:[],
          length:0
    }
  },
  methods:{
   async OnAllGoodList(){
        let that = this;
        if(that.orderArry[0]!=undefined){
          that.orderList=that.orderArry[0]
        }else{
          var parms = {}
          parms.memberId = that.memberId
          let res = await api.AllGoodList(parms); 
          that.orderList =  res.data.orderList.map(v=>{ 
            v.shopNum=v.item.length
            return v
         })
          that.orderArry[0]=that.orderList
        }
       that.length = that.orderList.length
      //  console.log("所有的商品",res,that.orderList )
     },


    //订单按钮事件
    async CancelOrder(value,orderId,index){
      let that = this;
      var status = 6
      var parms = {}
      var order = {}
          
      if(value = '取消订单'){
        wx.showModal({
          title: '提示', //提示的标题,
          content: '是否取消订单', //提示的内容,
          success: res => {
            if (res.confirm) {
              order.orderId = orderId
              order.status = 6
              order.payStatus = 0
              order.shipStatus = 0
              parms.order = order
              console.log(parms)
              api.OrderCancel(parms).then(function(res){
                  console.log("45665")
                  console.log("取消成功",res)
                  if(res.data.code==0){
                    that.orderList.splice(index,1)
                  }
              })
            } 
          }
        });
      }
    },

    //付款按钮事件
   async Payoff(value,orderId,index,status,price,Ass){
     console.log("确定点击",value,orderId,index,status,price,Ass)
      let that = this;
      var total = price
      var orderid = orderId
      var sn=Ass
      var total_fee = total * 100
      var parms = {}
      parms.orderid = orderid
      parms.total_fee = total_fee
      parms.sn=sn
      wx.login({
        success: Coderes => {
          if(Coderes.code){
              Lib.Show("正在支付","loading",2000)
            api.ConfirmPay(parms,Coderes.code).then(function(res){
           
             //全局赋值
             that.total_fee = total_fee
             that.orderId = orderid

              var pay = res.data
              //发起支付   
              var timeStamp = pay.timeStamp;
              console.log("timeStamp:" + timeStamp)
              var packages = pay.package;
              console.log("package:" + packages)
              var paySign = pay.paySign;
              console.log("paySign:" + paySign)
              var nonceStr = pay.nonceStr;
              console.log("nonceStr:" + nonceStr)
              var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
              that.Pay(param,index)
            })
          }
        },
      });
    },

    //确认收货
    async queShop(index,orderId){
      let that = this;
      let res = await Lib.ShopModel("提示","是否确认收货")
    //  console.log("确认收货",that.orderList,)
      if(res.confirm){
          let parms = {}
          let order = {}
          order.shipStatus = 2
          order.orderId=orderId
          parms.order = order
          let QueRes = await api.OrderCancel(parms)
          console.log("确认收货",QueRes)
          if(QueRes.data.code == 0){
            Lib.Show("成功","success",1500)
            console.log(that.orderList[that.btnSelect],index)
            that.orderList.splice(index,1)
          }
      }
    },

    //删除订单
   async DelShop(index,orderId){
      let that = this;
      var parms = {}
      var order = {}
      let res = await Lib.ShopModel("提示","是否确认删除")
      if(res.confirm){
        order.orderId = orderId
        order.status = 7
        parms.order = order
        let QueRes = await api.OrderCancel(parms)
          if(QueRes.data.code == 0){
            Lib.Show("成功","success",1500)
            that.orderList.splice(index,1)
          }
      }
    },

    //查看订单
    SelectOrder(orderId){
      console.log("检查",orderId)
      let that = this;
      wx.redirectTo({ url: '../orderInfo/main?orderId='+orderId+'&InfoTypeId='+that.btnSelect });
    },

     onselect(e){
       let that = this;
       that.btnSelect = e
       that.find_item=that.find_item.map((item)=>{
         item.selected=false;
         return item
        })
       that.find_item[e].selected=true
       if(e==0){
           that.OnAllGoodList()
       }
       else if(e==1){
          let stauts=1;
          let cat="待付款"
          that.OrderRequest(0,0,0,stauts,cat)
       }
      else if(e==2){
          let stauts = 2;
          let cat = "待发货" 
          var statuss = "2,1"
          that.OrderRequest(statuss,2,0, stauts, cat)
      }
      else if(e==3){
          let stauts = 3;
          let cat = "已发货" 
          that.OrderRequest(3,2,1, stauts, cat) 
      }
      else if(e==4){
          let stauts = 4;
          let cat = "已完成"
          that.OrderRequest("3,4",2,2,stauts, cat) 
      }
        that.btnSelect = e
     },

      async OrderRequest(statuss, payStatus, shipStatus, status,cat){
        let that = this;
        if(that.orderArry[status]!=undefined){
            that.orderList=that.orderArry[status]
        }else{
          let parms = {}
          let order = {}
          order.statuss = statuss//状态
          order.payStatus = payStatus
          order.shipStatus = shipStatus
          order.memberId = that.memberId
          
          parms.order = order
          let res = await api.OrderSelectList(parms)
          that.orderList =  res.data.orderList.map(v=>{ 
            v.shopNum=v.item.length
            return v
          })
          that.orderArry[status]=that.orderList
        }
         that.length = that.orderList.length
      },

     //支付
     Pay(param,index){
       let that = this;
        var parms = {}
        var order = {}
        var code = 200
        
        console.log("你好世界sad",that.orderList[index],that.orderId,that.orderList[index].orderId) 

        var orderId = that.orderId
        order.orderId = orderId
        parms.order = order
        parms.code = code
        parms.paymoney = that.total_fee / 100
        wx.requestPayment({
                timeStamp: param.timeStamp,
                nonceStr: param.nonceStr,
                package: param.package,
                signType: param.signType,
                paySign: param.paySign,
                success: res =>{
                    let orderParams = {}
                    orderParams.orderId = that.orderList[index].orderId
                    orderParams.code = 200
                    orderParams.gainedpoint = that.orderList[index].gainedpoint
                    orderParams.paymoney = that.orderList[index].orderAmount
           
                  api.PaypassOrder(orderParams).then(function(res){
                      console.log("保存后台订单",res)
                      if(res.data.code == 0){
                          //分润
                          if (wx.getStorageSync('isAgent') != '') {
                            let fenrunParm = {}
                            // let params = {}
                            fenrunParm.memberId = that.memberId
                            fenrunParm.distribeId = wx.getStorageSync('isAgent')
                            fenrunParm.monetary = that.orderList[index].orderAmount
                            fenrunParm.shareMoney = that.GoodItem[0].fenrunAmount
                            // params.params = JSON.stringify(fenrunParm)
                            api.ShareProfit(fenrunParm).then(function(res){
                              console.log("商品分润")
                            })
                          }

                          //支付完成后
                          that.orderList = [] //清空存储数据下次进入重新加载
                          Lib.Show("支付成功","success",1000)
                          
                          setTimeout(function(){
                             wx.switchTab({ url: '../myself/main' });
                          },1000)
                      
                      }
                  })   
           }
        })
     },

    async fail(e){
        var parms = {}
        var order = {}
        var code = 500
        var orderId = this.data.orderId
        order.orderId = orderId
        parms.order = order
        parms.code = code
        let res = await api.PaypassOrder(parms)
        console.log("输出",res)
     }

  },
  onLoad(options){
    let that = this;
    that.memberId = wx.getStorageSync('memberId');
    that.btnSelect = options.currentTarget
    console.log(options,'初始化参数',that.btnSelect)
    that.find_item=that.find_item.map((item)=>{
         item.selected=false;
         return item
        })
        // console.log("5465465",options,options.currentTarget)
       that.find_item[options.currentTarget].selected=true
    if(options.currentTarget==0){
      that.OnAllGoodList()
    }
    else if(options.currentTarget==1){
      let stauts=1;
      let cat="待付款"
      that.OrderRequest(0,0,0,stauts,cat)
    }
    else if(options.currentTarget==2){
      let stauts = 2;
      let cat = "待发货" 
      var statuss = "2,1"
      that.OrderRequest(statuss,2,0, stauts, cat)
    }
    else if(options.currentTarget==3){
      let stauts = 3;
      let cat = "已发货" 
      that.OrderRequest(3,2,1, stauts, cat) 
    }
    else if(options.currentTarget==4){
      let stauts = 4;
      let cat = "已完成"
      that.OrderRequest("3,4",2,2,stauts, cat) 
    }
    // that.OnAllGoodList()
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

.tab{border-bottom: 2px solid rgb(244,244,244);}
.ItemHeader{@include flexc;justify-content: space-between;padding:8rpx 20rpx;font-size: 32rpx;font-weight: 100;
   .addInfo{color: rgb(252,156,56);}
}

.shopList{
  .Item{padding: 15rpx 20rpx;box-shadow: 0px 5px 30rpx rgba(0, 0, 0, 0.116);margin: 20rpx;border-radius: 30rpx;}
}

.shopWarp{border-bottom:1px solid #f5f5f5;
   .left{width: 30%}
   .left img{width: 150rpx;height: 150rpx;margin: auto;}
   .right{font-size:100%;width: 70%;}
   .right .Itemtitle{font-size: 28rpx;color: #666;height: 95rpx;}
   .List{@include flexc;}
   .right .NumInfo{@include flexc;justify-content: space-between;font-size: 26rpx;margin-top: 5rpx;}
   .NumInfo .tag{color: #8e8e8e;font-size: 26rpx;}
   .NumInfo .Num{color: #8e8e8e;margin-right: 15rpx;font-size: 26rpx;}
   .NumInfo .price{font-size: 32rpx;color: rgb(251,147,37);}
}

.warpBtn{@include flexc;justify-content:flex-end;
  text{display: inline-block;border:1px solid #8e8e8e;padding: 5rpx 20rpx;margin: 6rpx 15rpx;font-weight: 100;font-size: 28rpx;border-radius: 30rpx;}
  .btn2{color:#fc9c38;border:1px solid #fc9c38; }
}

.shopWarpInfo{@include flexc;justify-content: flex-end;font-weight: 100;font-size: 32rpx;color: #666;}

.addr{font-size: 100;font-size: 25rpx;display: flex;align-items: center;color: rgb(170, 170, 170);height: 62rpx;padding: 0 10rpx;
   .topImg{height: 35rpx;width: 35rpx;margin-left: 10rpx;margin-right: 10rpx;}
   small{display: inline-block;margin-left: 6rpx;color: rgb(236,189,87);}
}
.kong{height: 350rpx;
  .Konginfo{text-align: center;font-weight: 100;color: rgb(234,89,95);}
}


</style>
