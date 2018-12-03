<template>
  <div class="Cart">
      <div class="ShopHeader"><text>购物车</text><text @click="Edits">{{EditsName}}</text></div>
     <CartList :ShopList='ShopLists' :shopname="shopDetail.shopName" @onSelect='SeleAllPrice' ref="childs" v-if="length != 0"></CartList>
     <div class="Kong"  v-if="length == 0">
       <img :src="ImgList.KongImg" mode='aspectFit'/>
            <div class="Konginfo">购物车空空如也~~~</div>
     </div>
     <!--shopList end-->
     <div class="DivHeigt"></div>
     <div class="footerBnt">
       <div class="selectBtn"  @click="AllSelect(SelectBool)"><icon type="success" class="ico" size="21" v-show="SelectBool"/>
                                                   <icon type="circle" class="ico" size="21" v-show="!SelectBool"/> 全选</div>
       <div class="cartBtn">
         <div class="price" v-show='!BtnDelete'>合计：{{AllPrice}}元</div>
         <div class="price MaskInfo" v-show='BtnDelete'>注：请选择删除</div>
         <div class="btn" @click="next"  v-show='!BtnDelete'>结算</div>
         <div class="btn" @click="Delete" v-show='BtnDelete'>删除</div>
       </div>
     </div>
     <!--footerBnt end-->
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import Shopaddr from '@/components/shopaddr'
 import CartList from '@/components/cartlist'

 let api= new Api 
export default {
  components: {
    CartList
  },

  data () {
    return {
     ImgList:{KongImg:config.imgUrl+'/cart/kong.png'},
     memberId:'',
     ShopLists:[],
     SelectBool:false,
     AllPrice:0,
     BtnDelete:false,
     EditsName:'编辑',
     shopDetail:{},
     length:0
    }
  },
  //事件
  methods:{
   //加载初始化数据
   async onLoads(){
     let that = this;
     let res = await api.CartList(that.memberId) 
     if(res.data.code != 1){
        that.ShopLists = res.data.cartList.map(v=>{
          v.selected = false
          return v
        })
        that.length =  that.ShopLists.length
     }else{
       that.ShopLists = [];
     }
   },

   //选中时子组件触发父组件
   SeleAllPrice(price){
     this.AllPrice = price
   },

   //全部选中
   AllSelect(bool){
      let that = this;
      that.SelectBool = !that.SelectBool
      that.ShopLists.map(v =>{
        v.selected = v.marketEnable==1 ?  that.SelectBool:false;
        return v
      })
 
    //父组件触发子组件
    that.$refs.childs.getTotalPrice();
   },

   //编辑删除Edits
   Edits(){
   let that =this;
   that.BtnDelete = !that.BtnDelete
   if(that.BtnDelete){
     that.EditsName = '删除'
   }else{
     that.EditsName = '编辑'
   }
   },

   //商品删除事件
  async Delete(){
      let that = this
      let parms = {}
      let cartIdgood=[]
      let cart = {}
      that.ShopLists.map(v => {
        if(v.selected){
          cartIdgood.push(v.cartId) 
        }
      })
      parms.cartS = cartIdgood
      let res = await api.CartOrderDele(parms)
      console.log("删除事件",res)
      if(res.data.code == 0){
        that.AllPrice = 0.00;
        that.BtnDelete = !that.BtnDelete;
        that.onLoads();
      }
   },

   //跳转结算
   next(){
        let that = this
        var googitem = [];
        var Goods = {};
        let total = 0;
        var weight=0;
        var gainedpoint = 0;
        var gooditemString = gooditemString
        // var orderAmount = that.AllPrice
        var totalPrice = that.AllPrice
        var goodsAmount = that.AllPrice
        var cartgoods = that.ShopLists;   
        that.ShopLists.map(v =>{
           if(v.selected){
             v.cart = 1;
             googitem.push(v)
             gainedpoint += v.point 
             total  += v.num * v.price;   
             weight += v.weight;    
           }
            Goods.googitem = googitem
            Goods.shareMoney = weight
            Goods.gainedpoint = gainedpoint
            Goods.goodsAmount = goodsAmount
            Goods.shippingAmount = 0
            // Goods.orderAmount = that.AllPrice
            // Goods.gainedpoint = gainedpoint

            
            gooditemString = JSON.stringify(Goods)
        
        })
            console.log("你好世界查看数据",Goods,gooditemString)
        // console.log("跳转查看数据",gooditemString,Goods)
        that.AllPrice=total.toFixed(2)
        if (googitem.length == "") {
          wx.showToast({
            title: "请选择订单",
            icon: "success",
            durantion: 2000
          })
        }else {
          wx.navigateTo({
            url: "../orderOne/main?gooditem=" + gooditemString + '&cart=1',
            success: function (res) {
              that.SelectBool=false;
              that.AllPrice=0.00;    
            },
          })
        }
   }
  },
  //初始化加载
  onShow(){
   let that = this;
   that.memberId = wx.getStorageSync('memberId');
   that.onLoads();
   that.shopDetail=wx.getStorageSync('shopDetail')
  },
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
.CartHeader{@include flexc;padding: 10rpx 25rpx;border-bottom: 1px solid #f5f5f5;
   img{width: 35rpx;height: 35rpx;margin-right: 15rpx;}
   text{font-size: 32rpx;font-weight: 100;color: #666;display: inline-block;width: 420rpx;overflow: hidden;text-overflow:ellipsis;
white-space: nowrap;}
}
.DivHeigt{height: 100rpx;}

.ShopHeader{@include flexc;justify-content: space-between;padding: 10rpx 30rpx;border-bottom: 1px solid #f4f4f4;
   text{color: rgb(252,155,45);font-weight: 100;font-size: 34rpx;}
}

.footerBnt{@include flexc;justify-content: space-between;position: fixed;bottom: 0;width: 100%;height: 95rpx;
    .selectBtn{@include flexc;padding-left: 15rpx;font-size: 36rpx;font-weight: 100;color: #8e8e8e;}
    .selectBtn icon{margin-right: 10rpx;}
    .cartBtn{display: flex;justify-content: center;font-size: 36rpx;font-weight: 100;color: #8e8e8e;}
    .price{height: 95rpx;line-height: 95rpx;margin-right: 15rpx;}
    .btn{background-image: -webkit-linear-gradient(0deg, rgb(255,191,3), rgb(252,148,53));height: 95rpx;line-height: 95rpx; width: 180rpx;text-align: center;color: #fff;}
}
.Kong{height: 450rpx;
   .Konginfo{text-align: center;font-weight: 100;color: rgb(234,89,95);}
}

</style>
