<template>
      <div class="modeWarp" v-if="modelShow" >
      <div class="ModelMask" ></div>
      <div class="Model" :animation='Animation'>
          <div class="colse" @click="hideModel">
              <img :src="close" />
          </div>
         <div class="ModelTop">
           <div class="topLeft"><img :src="GoodsInfo.thumbnail"/></div>
           <div class="topRight">
             <div class="title">
                <div class="fontHidden">
                  {{GoodsInfo.name}}
                </div>
             </div>
             <div class="tagInfo"><text>已选</text><text class="spec">{{GoodsInfo.specs}}</text></div>
             <div class="Price"><text>￥{{GoodsInfo.price}}</text><text>库存：{{GoodsInfo.enableStore}}</text></div>
           </div>
         </div>
         <div class="Area">
           <div v-for="(item,Pindex) in GoodsInfo.products" :index='Pindex' :key='item' @click="AreaselectClick(Pindex)" :class="item.selected?'active':''">{{item.name}}</div>
         </div>
          <div class="ModelNum"><text>数量：</text>
             <div class="priceright">
                <span class="icon" @click="Minu()" ><img src="/static/images/dec.png"></span> 
                <span class="num">{{pic}}</span>  
                <span class="icon"><img src="/static/images/add.png" @click="Plus()" ></span> 
             </div>
          </div>
          <div class="ModelBtn"><span v-if='btnIndex == 1' @click="toNext">立即购买</span>
                                <span v-if='btnIndex == 2' @click="toCart">加入购物车</span></div>
      </div>

      </div>
    <!--Model end-->
</template>
<script>
 import Api from "@/utils/Api"
 import Lib from "@/utils/lib"
 import config from "@/config"
let api = new Api
export default {
  props: ['GoodsInfo','modelShow','memberId'],
  data() {
      return {
          close:config.imgUrl+'/myself/close.png',
          icoImg:'',
              Animation:'',
              AreaselectIndex:0,
              WeightselectIndex:0,
              btnIndex:0,
              pic:1,
              count:0,
              goodsId:0,
              productId:0,
              TagInfo:'',
              space:'',
              Guige:[],
              enableStore:'',
              price:''
      }
  },
  methods: {
     //选中事件
    async AreaselectClick(Pindex){
         let that = this;
         that.GoodsInfo.products = that.GoodsInfo.products.map((v) =>{      
          v.selected = false
          return v 
         })
         // that.TagInfo = that.TagInfo + that.Guige[Pindex].value[indexs].specvalue;
         that.GoodsInfo.products[Pindex].selected = true  
         that.GoodsInfo.price=that.GoodsInfo.products[Pindex].price;
         that.GoodsInfo.enableStore=that.GoodsInfo.products[Pindex].enableStore;
         that.GoodsInfo.specs=that.GoodsInfo.products[Pindex].name
             // let specValueId = ''
             // let space =''
             // that.Guige.map(v => {
             //      if(v.selected == true){
             //        space = space + s.specvalue
             //      }
             //    })
             // that.space = space
             // let goodparms = {}
             // goodparms.goodsId = that.goodsId
             // goodparms.specs = specValueId.slice(0,-1);
             // let res = await api.GetProduct(goodparms)
             // if(res.data.code == 0){
             //   that.productId = res.data.product.productId
             //   that.GoodsInfo.price = res.data.product.price
             //   that.GoodsInfo.cost = res.data.product.cost
             //   that.GoodsInfo.enableStore = res.data.product.enableStore
             // }else{
             //   that.GoodsInfo.enableStore = 0
             // }     
     },
   
     //点击隐藏
     hideModel(){
         let that=this;
         //通过子组件触发父组件
         that.$emit('hideModel')
     },

    //父组件触发的方法
     emitEvent(index){
     let that = this;
     that.btnIndex = index;
      let animation = wx.createAnimation({
        duration: 200, timingFunction: 'linear', delay: 100,  transformOrigin: 'left top 0',
          success: function(res) {
              console.log(res)
            }
      })
        animation.translateY(300).step()
          //输出动画
        that.Animation=animation.export()
        that.modelShow=true;
        setTimeout(function () {
        animation.translateY(0).step()
          that.Animation=animation.export()
        }.bind(that), 100)
    },

    //点击加入购物车
    async toCart(){
         let that = this;
         let productsSelect=that.GoodsInfo.products.find((item)=>{
          if(item.selected){
            return item
          }
        })
        if(productsSelect.enableStore == 0){
          Lib.Show("暂无库存","success",1000)
        }else{
          let cartparms = {};
          cartparms.productId =productsSelect.productId
          cartparms.original = that.GoodsInfo.thumbnail
          cartparms.memberId = that.memberId
          cartparms.goodsId = that.GoodsInfo.goodsId
          cartparms.itemtype = that.GoodsInfo.typeId
          cartparms.image = that.GoodsInfo.thumbnail
          cartparms.num = that.pic
          cartparms.point = that.GoodsInfo.point
          cartparms.weight = productsSelect.fenrunAmount*that.pic
          cartparms.name = that.GoodsInfo.name
          cartparms.price = productsSelect.price
          cartparms.cart = 1//判断购物车订单
          cartparms.specvalue = that.GoodsInfo.specs
          let res = await api.toCartSave(cartparms)
          Lib.Show("添加成功","success",2000)
        }
    },
    
    //立即购买
    async toNext(){
        let that = this;
        let productsSelect=that.GoodsInfo.products.find((item)=>{
          if(item.selected){
            return item
          }
        })
        if(that.pic > productsSelect.enableStore){
          Lib.Show("库存不够","success",2000)
        }else{
          //定义接收对象
          var googitem = [];
          var Goods = {};
          let GoodsLIst = []
          let GoodsInfo = that.GoodsInfo;
          let GoodsItem = ''
          //商品信息赋值
          GoodsInfo.specvalue = that.GoodsInfo.specs
          GoodsInfo.cart = 0
          GoodsInfo.image = that.GoodsInfo.thumbnail
          GoodsInfo.num = that.pic
          GoodsInfo.productId = productsSelect.productId
          GoodsInfo.price=productsSelect.price
          delete GoodsInfo.intro
          //封装数据传值
          GoodsLIst[0] = GoodsInfo
                    // console.log("你好世界12313212",GoodsInfo,GoodsLIst[0])
          Goods.googitem = GoodsLIst
          Goods.gainedpoint = that.pic * that.GoodsInfo.point
          Goods.goodsAmount = that.pic * productsSelect.price
          Goods.shareMoney= productsSelect.fenrunAmount*that.pic
          Goods.shippingAmount = 2
          GoodsItem = JSON.stringify(Goods)
            wx.navigateTo({ url: '/pages/orderOne/main?gooditem='+GoodsItem+'&cart=0' });
        }
    },
    Plus(){
      this.pic +=1
    },
    Minu(){
      if(this.pic>0){
         this.pic -=1
      }
    }

  },
  
  mounted(){
    console.log(this.Guige,"商品信息")
  }

}

</script>
<style scoped lang='scss'>
/*局部水平居中*/
@mixin flexc{
display: flex;align-items: center;
}
img{width: 100%;height: 100%;display: block;}
/*文本换行省略*/
@mixin fontM{
white-space:normal;overflow: hidden;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
}
.modeWarp{height: 100vh;position: fixed;left: 0;top: 0;width: 100%;}
.ModelMask,.Model{position: fixed;left: 0;width: 100%;height: 100%;}
.ModelMask{z-index: 1;top: 0;background: rgba(0, 0, 0, 0.400);}
.Model{z-index: 2;bottom: 0;height: 900rpx;background: #fff;border-top-left-radius: 20rpx;border-top-right-radius: 20rpx;
      .ModelTop{@include flexc;font-weight:100;padding: 15rpx 15rpx;border-bottom: 2px solid rgb(247,247,247); }
      .ModelTop .topLeft{width: 35%}
      .ModelTop .topLeft img{width: 250rpx;height: 250rpx;}
      .ModelTop .topRight{width: 65%;margin-top: 20rpx; padding:10rpx;box-sizing: border-box;}
      .topRight .title{font-size: 32rpx;color: #666;height: 120rpx;}
      .topRight .tagInfo text{font-size: 26rpx;color: #8e8e8e;display: inline-block; vertical-align:middle;}
      .topRight .tagInfo .spec{color:rgb(255,107,79);width:80%; display: inline-block;overflow: hidden; text-overflow:ellipsis;white-space: nowrap;padding-left: 10rpx;box-sizing: border-box;}
      .topRight .Price{margin-top: 10rpx;@include flexc;justify-content: space-between;font-size: 24rpx;color: rgb(255,107,79);}
      .topRight .Price text{font-size: 32rpx;}

      .Area{padding: 10rpx 15rpx;display: flex;flex-wrap:wrap;
          div{margin: 10rpx 15rpx;padding: 20rpx 35rpx;color: #666;background: rgb(244,244,244);font-size: 30rpx;font-weight: 100;border-radius: 15rpx;}
          .active{color: rgb(253,146,63);border:1px solid rgb(253,146,63);background: #fff;}
      }
      .colse{position: absolute;right: 10rpx;top: 0;color: #fff;font-size: 45rpx;font-weight: 100;
       img{width: 45rpx;height: 45rpx;}
      }
    }
    .ModelBtn{position: fixed;z-index: 3;left: 0;bottom: 20rpx;width: 100%;}
     .ModelBtn span{
       display: block;width: 90%;margin: auto;line-height: 80rpx;text-align: center;border-radius: 40rpx;background: rgb(254,102,3);color: #fff;font-weight: 100;
     }
     .ModelNum{@include flexc;justify-content: space-between;padding: 20rpx;font-weight: 100;font-size: 32rpx;}
    .priceright{background:#e7e7e7;@include flexc;height: 48rpx;
      .icon{color: #fff;display: inline-block;width: 48rpx;height: 48rpx;overflow: hidden;padding:10rpx;box-sizing: border-box;}
     .num{background: #fff;height: 40rpx;line-height: 40rpx;color: rgb(248,193,92);display: inline-block;padding:0 15rpx;font-size: 28rpx;}
   }
</style>
