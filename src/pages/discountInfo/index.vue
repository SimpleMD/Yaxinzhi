<template>
  <div class="bargainInfo">
    <div class="header">
      <swiper class="swiper" indicator-dots='true' autoplay='true'>
          <swiper-item v-for="(item,index) in Gallery" :key="item" :index="index"><img :src="item.original"></swiper-item>
      </swiper>
    </div>
    <!--header end-->
    <div class="priceWarp">
      <div class="left">
         <div class="tag">精选水果</div><div class="price">￥<text class="newPrice">{{finalAmount}}</text><text class="oldPrice">￥{{goodsPrice}}</text></div>
      </div>
      <div class="right">
        <Timedown :countdown="countdown"></Timedown>
      </div>
    </div>
    <!--price end-->
    
   <div class="shopInfo">
     <div class="shopTile fontHidden">{{Goods.name}}</div>
     <div class="shopTag">
       <text>快递包邮</text><text>销量{{Goods.buyCount}}</text>
     </div>
   </div>
   <!--shopInfo end-->
   
   <div class="tip">
     <div class="tipImg"><img :src="ImgList.qiang" /></div><text>限时限量</text><text>疯狂抢购</text>
   </div>
    <!--tip end-->

    <div class="tipInfo">
      <div class="left">
         <div class="tipInfoLeft">优惠<text>积分</text></div><div class="tipInfoRight">购买可得11积分</div>
      </div>
      <div class="right">
        积分用于抵扣现金<img :src="ImgList.wenhao"/>
      </div>
    </div>
    <!--tipInfo end-->

    <div class="tabInfo">
      <div class="InfoTitle"><img :src="ImgList.InfoTitle" mode='aspectFit'/></div>
      <wxParse :content="Goods.intro" @preview="preview" @navigate="navigate" />
    </div>
    <!--tabInfo end-->

     <div class="HeightDiv"></div>
     <div class="footerBnt">
       <div class="left">
         <div class="leftItme"  @click="toIndex('/pages/index/main')"><img :src="ImgList.home" /><text>首页</text></div>
         <div class="leftItme">  <button class='homepage custom' open-type="contact" session-from="weapp"><img :src="ImgList.kefu" @click="kefu"/><text>客服</text> </button></div>
         <div class="leftItme"  @click="collection">
          <img :src="ImgList.noshouChang" v-if="posts" />
          <img :src="ImgList.shouChang" v-if="!posts"/>
          <text>收藏</text></div>
       </div>
       <div class="right">
            <form @submit="FromModal" report-submit="true"> 
         <div class="btnWarp">
            <button @click="showModel(2)" form-type="submit">加入购物车</button><span></span><button @click="jumporder" form-type="submit">立即购买</button>
         </div>
            </form>
       </div>
     </div>
     <!--footerBnt end-->
      
  <Model :GoodsInfo='Goods' 
         :modelShow='modelShow'
         :memberId='memberId' 
         @hideModel='hideModel' ref="childs"></Model>
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import Timedown from "@/components/countdown"
 import Tabs from "@/components/tab"
 import Model from "@/components/shopModel"
 import wxParse from 'mpvue-wxparse'
 let api=new Api
export default {
  components: {
   Timedown,
   Tabs,
   Model,
   wxParse
  },

  data () {
    return {
          Area_item:[{AreaName:'湖北'},{AreaName:'江西'}],
          Weight_item:[{WeightName:'1kg'},{WeightName:'2kg'}],
          ImgList:{home:config.imgUrl+'/group/home.png',kefu:config.imgUrl+'/group/kefu.png',noshouChang:config.imgUrl+'/group/shoucan.png',shouChang:config.imgUrl+'/group/shoucang.png',qiang:config.imgUrl+'/discount/qiang.png',wenhao:config.imgUrl+'/discount/wenhao .png',InfoTitle:config.imgUrl+'/discount/InfoTitle.jpg'
          },
          modelShow:false,
          countdown:{},
          Gallery:[],
          Goods:{},
          memberId:'',
          posts:false,
          finalAmount:'',
          limitId:'',
          goodsPrice:''

    }
  },
   methods: {
    jumporder(){
      let that=this
      let url=`../order/main?pic=1&goodsId=${that.Goods.goodsId }&activityPrice=${that.finalAmount}&limitId=${that.limitId}&Type=Z&goodname=${that.Goods.name}&price=${that.goodsPrice}&goodsImg=${that.Goods.thumbnail}`
      wx.navigateTo({
        url:url,
      })
    },
     toIndex(url){
    wx.switchTab({ url: url });
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
     console.log("点击了吗",that.modelShow)
    },
    async getGood(goodsId,memberId){
      let that=this
      let goodsRes=await api.getGoods(goodsId,memberId)
      goodsRes.data.products=goodsRes.data.products.map((item)=>{
      item.selected=false
      return item
     })
     goodsRes.data.products[0].selected=true
     goodsRes.data.Goods.specs=goodsRes.data.products[0].name
     goodsRes.data.Goods.products=goodsRes.data.products
     that.Gallery = goodsRes.data.Gallery;
     that.Goods = goodsRes.data.Goods;

  
      if (goodsRes.data.count == 0) {
        that.posts= false
      } else {   
        that.posts= true
      }
    },
    // 收藏
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
    cutTime(starttime,endtime){
      var that=this; 
      var leftTime = endtime - starttime;
      if (leftTime >= 0) {
        var interval = setInterval(function () {
        let cutTime={}
        cutTime.days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
        cutTime.hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
        cutTime.minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        cutTime.seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
        leftTime = leftTime - 1000;
        that.countdown=cutTime      
        }, 1000)
        if (leftTime <= 0) {
          clearinterval(interval)
        }
      }
    },
  

  },
  onLoad(options){
     var that=this;
     that.finalAmount=options.finalAmount
     that.memberId= wx.getStorageSync('memberId')
     that.getGood(options.goodsId,that.memberId)
     that.goodsPrice=options.goodsPrice
     that.limitId=options.limitId
     var endtime=options.endTime
     var starttime = (new Date()).valueOf();
     that.cutTime(starttime,endtime)
     //页面渲染完成创建一个动画
    
  },
  
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


.priceWarp{@include flexc;justify-content: space-between;;margin: 25rpx 20rpx;padding: 15rpx 20rpx;background-image: -webkit-linear-gradient(0deg,rgb(252,148,53), rgb(255,191,3)); border-radius: 40rpx;
  .left{@include flexc;}
  .left .tag{margin-right: 15rpx;padding: 0 10rpx;font-weight: 100;font-size: 24rpx;background: #fff;color:rgb(255,191,3);border-radius: 20rpx;}
  .price{font-size: 28rpx;font-weight: 100;color: #fff;}
  .newPrice{font-size: 34rpx;}
  .oldPrice{color: #e9e9e9;font-size: 24rpx;text-decoration:line-through;}
}

.shopInfo{padding: 10rpx 20rpx;font-weight: 100;border-bottom: 4px solid rgb(244,244,244);
  .shopTile{color: #666;font-size: 34rpx;}
  .shopTag{display: flex;justify-content:space-between;margin: 10rpx 0;color: #8e8e8e;font-size: 25rpx;}
}

.tip{@include flexc;padding: 20rpx 30rpx;margin: 10rpx;background: rgb(254,241,250);border-radius: 10rpx;
   img{width: 46rpx;height: 46rpx;margin-right: 15rpx;}
   text{font-weight: 100;font-size: 30rpx;margin-right: 20rpx;color: rgb(242,42,48);}
}

.tipInfo{@include flexc;justify-content: space-between;font-weight: 100;font-size: 24rpx;border-bottom: 2px solid rgb(244,244,244);
   .left,.right {@include flexc;}
   .tipInfoLeft{padding: 15rpx 35rpx;color: #8e8e8e;}
   .tipInfoLeft text{margin-left: 10rpx;background:rgb(254,242,229);color: rgb(246,112,113);font-size: 20rpx; }
   .tipInfoRight{color: #666;}
   .right{padding-right: 15rpx;}
   .right img{width: 35rpx;height: 35rpx;margin-left: 15rpx;}
}

.InfoTitle{margin: 20rpx 0;
   img{height: 125rpx;width:300rpx;margin: auto;}
} 
.TionInfo{height: 1135rpx;}


.HeightDiv{height: 110rpx;}
.footerBnt .left,.btnWarp{@include flexc;justify-content: space-around;}
.leftItme{line-height: 28rpx;}
.footerBnt{@include flexc;justify-content: space-between;padding: 10rpx 2%;position: fixed;bottom: 0;width:96%;background: #fff;
  button{background: rgba(255, 255, 255, 0);line-height: 50rpx;}
  button::after{border:none;}
  .left{width: 45%;}
  .left img{width: 58rpx;height: 58rpx;margin: auto;}
  .left text{color: rgb(117,117,117);font-size: 28rpx;font-weight: 100;}
  .right{width: 55%;}
  .btnWarp{background-image: -webkit-linear-gradient(0deg,rgb(252,148,53), rgb(255,191,3));border-radius: 45rpx;height: 75rpx;line-height: 75rpx;}
  .btnWarp button{font-size: 32rpx;color: #fff;font-weight: 100;padding: 0 15rpx;}
  .btnWarp span{width: 2rpx;height: 35rpx;background-color: #fff;}
}


</style>
