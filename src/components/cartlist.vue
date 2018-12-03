<template>
   <div class="CartWarp">
     <div class="CartHeader"><img :src="topImg"/><text>{{shopname}}</text></div>
     <div class="shopList"  v-for="(Shop_List,index) in ShopList" :index='index' :key='Shop_List'>
       <div class="selectico" @click="selectCheck(index)">
         <icon type="success" class="ico" size="21" v-show='Shop_List.selected'/><icon type="circle" class="ico" size="21" v-show='!Shop_List.selected'/>
       </div>
       <div class="itemLeft"><img :src="Shop_List.image"/></div>
       <div class="itemRight">
          <div class="status">状态:<span>{{Shop_List.marketEnable==1?'热销中':'已下架'}}</span></div>
          <div class="title">
            <div>
              {{Shop_List.name}}
            </div>  
          </div>
          <small>{{Shop_List.specvalue}}</small>
          <div class="price">
             <div class="priceleft"><text>￥{{Shop_List.price}}元</text>
                <!-- <span>￥{{Shop_List.p2}}</span> -->
              </div>
             <div class="priceright">
                <span class="icon"  @click="Minu(index,Shop_List.cartId)" ><img src="/static/images/dec.png"></span> 
                <span class="num">{{Shop_List.num}}</span>  
                <span class="icon"><img src="/static/images/add.png" @click="Plus(index,Shop_List.cartId)" ></span>        
             </div>
          </div>
       </div>
     </div>
   </div>
</template>
<script>
 import Api from "@/utils/Api"
import config from "@/config"

 let api= new Api 
export default {
  props: ['ShopList','shopname'],
  data () {
    return {
      topImg:config.imgUrl+'/cart/home.jpg',
      AllTotal:0
    }
  },
  methods:{
    //选中
   selectCheck(index){
     let that = this;
     console.log(that.ShopList[index]);
     if(that.ShopList[index].marketEnable==1){
      that.ShopList[index].selected = !that.ShopList[index].selected
     }
     else{
       wx.showToast({
          title: "商品已下架无法购买",
          icon: "none",
          durantion: 2000
        })   
     }
     that.getTotalPrice()
  
   },
   //减
  async Minu(index,cartId){
    
     let that = this;
    console.log("输出一下数据",that.ShopList,index,cartId)
    if(that.ShopList[index].num >1){
        let num = that.ShopList[index].num -1;
        let res = await that.MinuPlusNum(index,cartId,num);
        if(res.data.code == 0){
          that.ShopList[index].num -=1;
        }
     }
     else{
      wx.showToast({
        title:'数量最少为1',
        icon:'none',
        durantion:2000
      })
     }
     if(that.ShopList[index].selected){
       that.getTotalPrice()
     }

   },
   //加
   async Plus(index,cartId){
      let that = this;
      if(that.ShopList[index].num !=0){
        let num = that.ShopList[index].num +1;
        let res = await that.MinuPlusNum(index,cartId,num);
        if(res.data.code == 0){
        that.ShopList[index].num +=1;
        }
      }
      if(that.ShopList[index].selected){
       that.getTotalPrice()
      }

   },
    
   //数量修改
   async MinuPlusNum(index,cartId,num){
     let that = this;
      let parms={}
      let cart={}
      cart.cartId = cartId
      cart.num = num
      parms.cart = cart
      console.log(" 进来1",cartId,index,num)
      let res = await api.CartOrderNum(parms)
      return res;
      console.log("查看是否修改",res)
   },

   //计算多少钱
   getTotalPrice(){
     let that = this;
     let Total = 0;
     if(that.ShopList != undefined){
        that.ShopList.map(v =>{
          if(v.selected){
           Total += v.price * v.num
          }
        })
     }
     that.AllTotal = Total;
    that.$emit("onSelect",that.AllTotal)  
   }
  },

}

</script>
<style scoped lang='scss'>
/*局部水平居中*/
@mixin flexc{
display: flex;align-items: center;
}
img{
  width: 100%;
  height: 100%;
  display: block;
}
/*文本换行省略*/
@mixin fontM{
white-space:normal;overflow: hidden;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
}

.CartHeader{@include flexc;padding: 10rpx 25rpx;border-bottom: 1px solid #f5f5f5;
   img{width: 35rpx;height: 35rpx;margin-right: 15rpx;}
   text{font-size: 32rpx;font-weight: 100;color: #666;display: inline-block;width: 420rpx;overflow: hidden;text-overflow:ellipsis;
white-space: nowrap;}
}

.CartWarp{box-shadow: 0 0 40rpx rgba(0, 0, 0, 0.123);border-radius: 30rpx;margin: 15rpx;}
.shopList{@include flexc;padding: 15rpx 10rpx; 
   .selectico{padding-right: 15rpx;box-sizing: border-box;}
   .itemLeft{width: 35%}
   .itemLeft img{width: 230rpx;height: 230rpx;margin: auto}
   .itemRight{width: 55%;padding-right: 20rpx; padding-left: 20rpx;box-sizing: border-box;}
   .itemRight .status{height: 40rpx;text-align: right;color:#8e8e8e;font-size: 0.8em;
    span{color: #fc9b2d;}
   }
   .itemRight .title{height: 102rpx;font-weight: 100;font-size: 30rpx;color: #8e8e8e;
    div{@include fontM;}
   }
   .itemRight small{font-size: 26rpx;color: #ccc;font-weight: 100;display: inline-block;width: 100%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
   .price{@include flexc;justify-content: space-between;}
   .priceleft{
     text{font-size: 32rpx;font-weight: 100;color: rgb(252,78,79);}
     span{font-size: 26rpx;font-weight: 100;color: #8e8e8e;text-decoration:line-through}
   }
   .priceright{background:#e7e7e7;@include flexc;height: 48rpx;
     .icon{color: #fff;display: inline-block;width: 48rpx;height: 48rpx;overflow: hidden;padding:10rpx;box-sizing: border-box;}
     .num{background: #fff;height: 40rpx;line-height: 40rpx;color: rgb(248,193,92);display: inline-block;padding:0 15rpx;font-size: 28rpx;}
   }
}
</style>
