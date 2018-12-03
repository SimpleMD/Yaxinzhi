<template>
  <div class="shopList">
    <div class="fenIco" @click="fenclick(true)"><img :src="ImgList.fenIco" mode='aspectFit'/></div>
    <div class="header">
        <swiper class="swiper" indicator-dots='true' autoplay='true'>
          <swiper-item v-for="(item,index) in Gallery" :index='index' :key='item'><img :src="item.original"></swiper-item>
        </swiper>
    </div>
    <!--header end-->

     <div class="PriceTitle fontHidden">
         {{Goods.name}}
     </div>
     <div class="Price">
         <text class="new">￥{{Goods.price}}</text><text class="old">￥19.90</text>
     </div>
     <div class="PriceTag">
         <text>全场满{{indexdata.freight}}元免配送费</text>  <text>库存:{{Goods.enableStore}}</text>
     </div>
    <!--Price end-->

    <div class="PriceInfo">
        <div class="Box1"><text>积分</text><text>购买可得{{Goods.point}}积分</text></div>
        <div class="Box1"><text>优惠券</text><text class="juan" @click="toCoupon('/pages/coupon/main')">领劵 ></text></div>
    </div>
    <!--PriceInfo end-->
    

    <div class="Info">
        <div class="InfoTop"><img :src="ShopTopImg" mode='aspectFit'/></div>
        <div class="Infocontent">
  <wxParse :content="Goods.intro" @preview="preview" @navigate="navigate" />
        </div>
    </div>
    <!--Info end-->
        <div class="HeightDiv"></div>
     <div class="footerBnt">
       <div class="left">
         <div class="leftItme"><img :src="ImgList.home" @click="toIndex('/pages/index/main')"/><text>首页</text></div>
         <div class="leftItme">
            <button class='homepage custom' open-type="contact" session-from="weapp"><img :src="ImgList.kefu" @click="kefu"/><text>客服</text> </button>
         </div>
         <div class="leftItme"  @click="collection">
          <img :src="ImgList.noshouChang" v-if="posts" />
          <img :src="ImgList.shouChang" v-if="!posts"/>
          <text>收藏</text></div>
       </div>
       <div class="right">
          <form @submit="FromModal" report-submit="true"> 
            <div class="btnWarp">

            <button  @click="showModel(2)" form-type="submit">加入购物车</button ><span></span>
            <button  @click="showModel(1)"  form-type="submit">立即购买</button >

            </div>
          </form>
       </div>
     </div>
     <!--footerBnt end-->


  <div class="footerMode" v-if="footerModel">
    <div class="footerMask" @click="fenclick(false)"></div>
    <div class="footerWarp">
      <button class="fen" open-type="share"><img :src="ImgList.wxfen"/><text>分享</text></button>
      <div class="line"></div>
      <div class="fen" @click="eventDraw"><img :src="ImgList.haibao"/> <text>海报</text></div>
     
    </div>
  </div>
  <!--footerMode END-->


    <div class='canvas' v-if='maskmodel'>
    <div class='modelcard'>
      <div class='model'>
        <!-- <img :src="shareImage" class="share-image"/> -->
        <!-- <image :src="shareImage" class="share-image"></image> -->
        <canvasdrawer :painting="painting" class="canvasdrawer" @getImage="eventGetImage"/>
      </div> 

      <div class="BtnWarp">
        <!-- <div class='modelbtn'  @click="eventSave">保存本地</div>
        <div class='modelbtn modelbtntop' @click='guanbi'>关闭</div> -->
      </div>
      </div>
    </div>
  <!--modelcard end-->

  <div class="ShopCart"  @click="toIndex('/pages/cart/main')"><img src="/static/images/cart.png" /></div>

  <Model :GoodsInfo='Goods' 
         :modelShow='modelShow'
         :memberId='memberId' 
         @hideModel='hideModel' ref="childs"></Model>

  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import Lib from "@/utils/lib"
 import config from "@/config"
 import Tabs from "@/components/tab.vue"
 import ShopTit from "@/components/shopaddr.vue"
 import wxParse from 'mpvue-wxparse'
 import Model from "@/components/shopModel"

 let api= new Api 
export default {
  components: {
     Tabs,
     ShopTit,
     wxParse,
     Model
  },
   
  data () {
    return {
          modelShow:false,
          ShopTopImg:config.imgUrl+'/shop/shopImg.jpg',
          ImgList:{home:config.imgUrl+'/group/home.png', kefu:config.imgUrl+'/group/kefu.png',
                   noshouChang:config.imgUrl+'/group/shoucan.png',shouChang:config.imgUrl+'/group/shoucang.png',fenIco:config.imgUrl+'/myself/fenxiang.png',wxfen:config.imgUrl+'/shop/wxfen.png',haibao:config.imgUrl+'/shop/haibao.png',
          },
          posts:false,
          maskmodel:false,
          footerModel:false,
          Gallery:[],
          Goods:{},
          Guige:[],
          painting:{},
          shareImage:'',
          pic:1,
          count:0,
          memberId:'',
          goodsId:'',
          catId:'',
          productId:'',
          indexdata:{},
    }
  },
  
  methods:{
   //获取用户信息
   async SelectShopInfo(){
     let that = this;
     let goodparms = {}
     goodparms.goodsId = that.goodsId
     let res = await api.getGoods(that.goodsId,that.memberId)
     res.data.products=res.data.products.map((item)=>{
      item.selected=false
      return item
     })
     res.data.products[0].selected=true
     res.data.Goods.specs=res.data.products[0].name
     res.data.Goods.products=res.data.products
     that.Gallery = res.data.Gallery;
     that.Goods = res.data.Goods;
     if (res.data.count == 0) {
        that.posts= false
      } else {   
        that.posts= true
      }
   },
    async collection(){
      let that=this
      let favorite = {}
      favorite.memberId = that.memberId
      favorite.goodsId = that.Goods.goodsId
      if(that.posts){
        let delCollectionRes=await api.delCollection(favorite)
       if(delCollectionRes.data.code==0){
          wx.showToast({
            title: '取消收藏',
            icon: 'success',
            duration: 2000
          })
          that.posts=!that.posts
        }
      }
      else{
        let addCollectionRes=await api.addCollection(favorite)
        if(addCollectionRes.data.code==0){
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
          that.posts=!that.posts
        }
      }
    },
    //点击生成海报
   async eventDraw(){
     let that = this;
     that.maskmodel=true;
     Lib.Loading("图片绘制中")
     let res = await api.GetShare('pages/index/main',that.goodsId)
     let ImgArr = [res.data,that.Goods.thumbnail]
     let ImgRes = await Lib.getImageInfo(ImgArr)
         that.painting={
              width: 375,
              height: 510,
              clear: true,
                   views: [
                   {
                    type: 'image',
                    url: ImgRes[1],
                    top: 0,
                    left: 0,
                    width: 375,
                    height: 375
                  },
                   {
                    type: 'rect',
                    background: '#fff',
                    top: 375,
                    left: 0,
                    width: 385,
                    height: 140
                  },
                   {
                    type: 'image',
                    url: ImgRes[0],
                    top: 410,
                    left: 260,
                    width: 90,
                    height: 90
                  },
                  {
                    type: 'text',
                    content: that.Goods.name,
                    fontSize: 13,
                    color: '#666',
                    textAlign: 'left',
                    breakWord: true,
                    left: 15,
                    top: 390,
                    width:300
                  },
                  {
                    type: 'text',
                    content: '新鲜水果',
                    fontSize: 13,
                    color: '#ccc',
                    textAlign: 'left',
                    breakWord: true,
                    left: 15,
                    top: 430,
                    width:130
                  },
                   {
                    type: 'text',
                    content: '新鲜水果',
                    fontSize: 13,
                    color: '#ccc',
                    textAlign: 'left',
                    breakWord: true,
                    left: 85,
                    top: 430,
                    width:130
                  },
                  {
                    type: 'text',
                    content: '价格',
                    fontSize: 15,
                    color: '#FB8621',
                    textAlign: 'left',
                    breakWord: true,
                    left: 15,
                    top: 470,
                    width:130
                  },
                   {
                    type: 'text',
                    content: '￥'+that.Goods.price,
                    fontSize: 20,
                    color: '#FB8621',
                    textAlign: 'left',
                    bolder: true,
                    left: 45,
                    top: 465,
                    width:130
                  },
                
              ]
            }
   },


    eventSave() {
      wx.saveImageToPhotosAlbum({
        filePath: this.shareImage,
        success(res) {
          wx.showToast({
            title: '保存图片成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    },

    eventGetImage(event) {
      console.log("执行了吗")
      console.log(event)
      wx.hideLoading()
      console.log("s99",event)
      console.log("s88",event.mp.detail)
      const { tempFilePath, errMsg } = event.mp.detail

      if (errMsg === 'canvasdrawer:ok') {
          this.shareImage=tempFilePath
          wx.previewImage({
            current: this.shareImage, // 当前显示图片的http链接
            urls: [this.shareImage] // 需要预览的图片http链接列表
          })
          this.maskmodel = false
      }
    },

    //存储fromId
    async FromModal(e){
      // console.log("46454656666",e)
      let that = this;
      let memberId = wx.getStorageSync('memberId');
      let fromid = e.mp.detail.formId
      let res = await api.SaveFormid(memberId,fromid)
    },
 
    //立即购买淡出模态框
    showModel(index){
     let that = this;
     that.modelShow=true;
     //父组件控制子组件
     that.$refs.childs.emitEvent(index);
    },

    hideModel(){
       //是否传值
     let that = this;
     that.modelShow=false;
    },

   //点击分享按钮
   fenclick(bool){
    this.footerModel = bool;
   },

   //跳转
   toCoupon(url){
     console.log("判断点击",url)
    wx.navigateTo({ url: url });
   },
   
   //跳转首页
   toIndex(url){
    wx.switchTab({ url: url });
   },

   kefu(){
     //触发打电话
     let that = this;
     let indexData = wx.getStorageSync('indexdata');

      wx.makePhoneCall({
        phoneNumber: indexData.mobile,
      })
   }
  },
  async mounted(){
    let that = this;
    that.indexdata=wx.getStorageSync('indexdata')
    that.goodsId = this.$root.$mp.query.goodsId;
    that.catId =  this.$root.$mp.query.catId;
    that.memberId = wx.getStorageSync('memberId');
    //获取商品信息
    that.SelectShopInfo();
  },
  onShow(){
    this.modelShow=false;
  },
    onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '果冉回味',
      path: '/shopinfo/main?goodsId='+this.goodsId
    }
  }

}
</script>

<style scoped lang='scss'>
@import url("~mpvue-wxparse/src/wxParse.css");
/*局部水平居中*/
@mixin flexc{
display: flex;align-items: center;
}

/*文本换行省略*/
@mixin fontM{
white-space:normal;overflow: hidden;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
}
img{display: block;height: 100%;width: 100%;}

.header{
.swiper{height: 380rpx;}
}

.PriceTitle{font-weight: 100;font-size: 34rpx;color: #666;padding: 0 25rpx;}
.Price,.PriceTag{font-weight: 100;color: #8e8e8e;padding: 0rpx 25rpx;}
.Price{
  .new{color: rgb(252,122,67);font-size: 36rpx;}
  .old{color: #8e8e8e;text-decoration:line-through;font-size: 26rpx;}
}

.PriceTag{@include flexc;justify-content: space-between;font-size: 26rpx;border-bottom: 1px solid rgb(248,248,248);padding: 15rpx 25rpx;;}

.PriceInfo{padding: 20rpx;
  .Box1{@include flexc;justify-content: space-between;font-weight: 100;font-size: 24rpx;margin-bottom: 10rpx;}
  .juan{color: rgb(253,130,75);}
}

.InfoTop img{margin: auto;width: 234rpx;height: 141rpx;}
.HeightDiv{height: 110rpx;}
.footerBnt .left,.btnWarp{@include flexc;justify-content: space-around;}
.leftItme{line-height: 28rpx;}
.leftItme {
  button{line-height: 36rpx;background: #fff;}
  button::after{border: none;}
}
.footerBnt{@include flexc;justify-content: space-between;padding: 10rpx 2%;position: fixed;bottom: 0;width:96%;background: #fff;box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.164) ;
  .left{width: 45%;}
  .left img{width: 58rpx;height: 58rpx;margin: auto;}
  .left text{color: rgb(117,117,117);font-size: 28rpx;font-weight: 100;}
  .right{width: 55%;}
  .btnWarp{background-image: -webkit-linear-gradient(0deg,rgb(252,148,53), rgb(255,191,3));border-radius: 45rpx;height: 75rpx;line-height: 75rpx;}
  .btnWarp button{font-size: 32rpx;color: #fff;font-weight: 100;padding: 0 15rpx;background: rgba(255, 255, 255, 0)}
  .btnWarp button::after{border: none;}
  .btnWarp span{width: 2rpx;height: 35rpx;background-color: #fff;}
}

.fenIco{position: absolute;right: -38rpx;top: 15rpx;z-index: 2;border-radius: 50%;
  img{height: 80rpx;width: 195rpx;}
}

.footerMode{position:fixed;top: 0;left: 0;height: 100vh;width: 100%;
   .footerMask{height: 100%;width: 100%;background: rgba(0, 0, 0, 0.15);}
   .footerWarp{position: absolute;bottom: 0;background: #FFF;height: 150rpx;width: 100%;@include flexc;justify-content: space-between}
   .footerWarp text{font-weight: 100;font-size: 34rpx;}
   .footerWarp .fen{width: 48%;text-align: center;}
   .footerWarp button{background: rgba(255, 255, 255, 0);line-height: 50rpx;}
   .footerWarp button::after{border:none;}
   .fen img{width: 75rpx;height: 75rpx;margin: auto}
   .line{height: 60rpx;width: 1px;background: #ccc;}
}

/* 海报样式 */
.canvas{z-index: 10;position: absolute;top: 0;left: 0;background: rgba(0, 0, 0, 0.600);height: 100vh;width: 750rpx;}
/* .model{height: 700rpx;width: 100%;} */
.model{width: 750rpx;}
.model image{width:750rpx;height: 932rpx;}

.modelbtn{width: 85%;line-height: 75rpx;border:1px solid #ff7903;;color:#fff;margin: auto;text-align: center;border-radius: 20rpx;}
.modelcard{padding-top: 60rpx;}

.BtnWarp{display:flex;align-items: center;margin-top: 15rpx;
  .modelbtn{width: 230rpx;color: #ff7903}
}

.ShopCart{position: fixed;right: 0;bottom: 180rpx;text-align: center;width: 40rpx;height: 40rpx;padding: 15rpx;line-height: 40rpx;background:rgba(0, 0, 0, 0.103);border-radius: 50%;

}


</style>
