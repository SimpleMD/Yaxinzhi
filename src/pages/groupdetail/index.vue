<template>
  <div class="groupDetail">
      <div class="header">
        <swiper class="swiper" indicator-dots='true' autoplay='true'>
          <swiper-item v-for="(item,index) in Gallery" :key="item" :index="index"><img :src="item.original"></swiper-item>
        </swiper>
      </div>
      <!--header end-->
      
      <div class="DataTime" v-if="ShopTipBool">
          <div class="left">
            <div class="popleNum">{{collageDO.collagePersons}}人团</div>
            <div class="prcie">￥<text class="newPrice">{{collageGoodsDO.activityPrice}}</text><text class="delPrice">￥{{collageGoodsDO.goodsPrice}}</text></div>
          </div>
          
      </div>
      <!--DataTime end-->

      <div class="shopTitle">
          <div class="left fontHidden">{{Goods.name}}</div>
          <div class="right"><img :src="imgList.fenxiang"/><div class="fenxiang font28rpx">分享</div></div>
      </div>
     
     <div class="JoinGroup padding815rpx">
        <div class="title"><span></span><text>立即加入</text></div>
        <div class="item" v-for="(item,index) in collages" :key="item" :index="index" v-if="hascollages">
          <div class="left">
            <div class="itemimg"><img :src="item.face"/></div><span>{{item.uname}}的团</span>
          </div>
          <div class="right">
             <div class="itemInfo"><span class="info">还差<text>{{item.shortPerson}}人</text>成团</span><span class="time">剩余{{item.countDownHour}}:{{item.countDownMinute}}:{{item.countDownSecond}}</span></div>
             <div class="btn" @click="jumpGroup(item.memberCollageId)">去参团</div>
          </div>
        </div>
        <div class="tip" v-if="!hascollages">暂无拼团数据</div>
     </div>
     <!--JoinGroup end-->
     
     <div class="Tion">
       <div class="tionTitle">
          <span>邀请好友一起参团，人数不足将自动退款，如不明白请看玩法详情</span>
          <span class="xianQin" @click="showModel"><i class="fa fa-question-circle" aria-hidden="true"></i> 玩法详情</span>
        </div>
       <div class="TionInfo">
        <wxParse :content="Goods.intro" @preview="preview" @navigate="navigate" />
      </div>
     </div>
     <!--Tion end-->
     
     <div class="HeightDiv"></div>
     <div class="footerBnt">
       <div class="left">
         <div class="leftItme"  @click="toIndex('/pages/index/main')"><img :src="imgList.home" /><text>首页</text></div>
         <div class="leftItme">  <button class='homepage custom' open-type="contact" session-from="weapp"><img :src="imgList.kefu" @click="kefu"/><text>客服</text> </button></div>
         <div class="leftItme" @click="collection">
          <img :src="imgList.noshouChang" v-if="posts" />
          <img :src="imgList.shouChang" v-if="!posts"/><text>收藏</text></div>
       </div>
       <div class="right">
         <div class="btnWarp">
            <text @click="showbuyModel">原价购买</text><span></span><text @click="jumpOrder">立即开团</text>
         </div>
       </div>
     </div> 
     <!--footerBnt end-->

     <div class="showModel" v-if="ShowModel">
       <div class="Model"><img :src="imgList.ModelImg" mode='aspectFit'/>
          <div @click="hideModel"><i class="fa fa-times-circle" aria-hidden="true"></i> </div>
       </div>
     </div>
     <!--showModel end-->
      <Model :ImgList='imgList' :modelShow='modelShow' :Area_item='Area_item' :Weight_item='Weight_item'  @hideModel='hidebuyModel' ref="childs">></Model>
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import wxParse from 'mpvue-wxparse'
  import Model from "@/components/shopModel"
let api= new Api 
export default {
  data () {
    return {
      Area_item:[{AreaName:'湖北'},{AreaName:'江西'}],
      Weight_item:[{WeightName:'1kg'},{WeightName:'2kg'}],
      modelShow:false,
      imgList:{ShopImg:config.imgUrl+'/cart/shopimg01.jpg',fenxiang:config.imgUrl+'/group/fenxiang.png',home:config.imgUrl+'/group/home.png',
               kefu:config.imgUrl+'/group/kefu.png',noshouChang:config.imgUrl+'/group/shoucan.png',shouChang:config.imgUrl+'/group/shoucang.png',
               TionInfo:config.imgUrl+'/group/TionInfo.jpg',ModelImg:config.imgUrl+'/group/modelImg.png',
      },
      Gallery:[],
      ShopTipBool:true,
      ShowModel:false,
      Goods:{},
      collageGoodsDO:{},
      collageDO:{},
      collages:[],
      posts:false,
      memberId:'',
      productId:'',
      hascollages:true
    }
  },
  components: {
     wxParse,
     Model
  },
  methods: {
    showbuyModel(){
     let that = this;
     that.modelShow=true;
     //父组件控制子组件
     that.$refs.childs.emitEvent();
    },
     toIndex(url){
    wx.switchTab({ url: url });
   },
    async getProduct(goodsId,memberId){
      let that=this
      let productRes=await api.getProduct(goodsId,memberId)
      that.product=productRes.data.product
    },
    jumpOrder(){
      var that = this;
      if (that.Goods.enableStore>0) {  
        let url=`../order/main?goodsImg=${that.Goods.thumbnail}&goodname=${that.Goods.name}&activityPrice=${that.collageGoodsDO.activityPrice}&collagePersons=${that.collageDO.collagePersons}&Type=K&price=${that.Goods.price}&goodsId=${that.Goods.goodsId}&productId=${that.productId}`
         wx.navigateTo({
          url:url,
        })
      }
      else{ 
         wx.showToast({
          title: "库存不够！",
          icon: "success",
          durantion: 2000
        })   
      }  
    },
   async jumpGroup(memberCollageId){
      let that=this;
      let cantuanParams = {}
      cantuanParams.memberId = that.memberId
      cantuanParams.memberCollageId = memberCollageId
     let collageRes=await api.joinCollageRepetition(cantuanParams)
     if(collageRes.data.code==0){
      // 可以参团
      if (that.Goods.enableStore>0) { 
        let url= `../order/main?goodsImg=${that.Goods.thumbnail}&goodname=${that.Goods.name}&activityPrice=${that.collageGoodsDO.activityPrice}&memberCollageId=${memberCollageId}&Type=C&price=${that.Goods.price}&goodsId=${that.Goods.goodsId}&productId=${that.productId}`
        wx.navigateTo({
          url: url,
        })
      }
      else{
         wx.showToast({
          title: "库存不够！",
          icon: "success",
          durantion: 2000
        })   
      }
     }
     else{
      // 不能参团
      wx.showToast({
        title: '您已经参过这个团了哦',
        icon: 'none',
        duration: 2000
      })
     }
    },
    hidebuyModel(){
       //是否传值
     let that = this;
     that.modelShow=false;
     console.log("点击了吗",that.modelShow)
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
      hideModel(){
       let that=this;
       that.ShowModel=false;
      },
      showModel(){
        let that=this;
        that.ShowModel=true;
      },
      countdown:function(i,endtime){
        var that=this;
        var timestamp2 = (new Date()).valueOf();
        var leftTime = (endtime+86400000) - timestamp2
        if (leftTime >= 0) {
          var interval = setInterval(function () {
          // var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
          var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
          var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
          var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
          leftTime = leftTime - 1000;
          that.collages[i].countDownHour=hours
          that.collages[i].countDownMinute=minutes
          that.collages[i].countDownSecond=seconds
        }, 1000)
          if (leftTime <= 0) {
            clearinterval(interval)
          }
        } 
      },

  },
 async onLoad(option){
    let that=this
    that.memberId= wx.getStorageSync('memberId')
    // let goodsRes=await api.getGoods(option.goodsId,187)
    let goodsRes=await api.getGoods(option.goodsId,that.memberId)
    that.productId=option.productId
    that.Gallery=goodsRes.data.Gallery
    that.Goods=goodsRes.data.Goods
    if (goodsRes.data.Goods.count == 0) {
      that.posts= false
    } else {   
      that.posts= true
    }
    let getseleCollGoodsRes=await api.getseleCollGoods(option.collageGoodsId)
    that.collageGoodsDO=getseleCollGoodsRes.data.collageGoodsDO
    that.collageDO=getseleCollGoodsRes.data.collageDO
    api.getallStartCollage(option.productId).then(function(getallStartCollage){
      console.log('z执行了');
      for (var i = 0; i < getallStartCollage.data.length; i++) {
        getallStartCollage.data[i].countDownHour=0
        getallStartCollage.data[i].countDownMinute=0
        getallStartCollage.data[i].countDownSecond=0
        that.countdown(i, getallStartCollage.data[i].collageStarttime)
      }
      that.collages=getallStartCollage.data
    }).catch(function(res){
      that.collages=[]
      that.hascollages=false
      clearinterval(interval)
      
    })
   
  },
  
  onShareAppMessage: function () {
    return {
      title: '',
      desc: '小程序招商开发',
      path: 'pages/index/main'
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
.HeightDiv{height: 110rpx;}

.header{
.swiper{height: 380rpx;}
}

.DataTime{@include flexc;justify-content: space-between;padding: 15rpx 20rpx;background-image: -webkit-linear-gradient(0deg, rgb(249,92,15), rgb(249,175,76));
    .left{@include flexc;}
    .left .popleNum{height: 40rpx;line-height: 40rpx;padding: 5rpx 22rpx;color: #fff;font-weight: 100;font-size: 28rpx;border-radius: 20rpx;border:1px solid #fff;}
    .left .prcie{margin-left: 10rpx;font-weight: 100;color: #fff;font-size: 30rpx;}
    .left .newPrice{font-size: 36rpx;}
    .left .delPrice{margin-left: 10rpx;color: #eeeeee;font-size: 26rpx;text-decoration:line-through}
    .right{color: #fff;font-weight: 100;font-size: 32rpx;}
    .right text{background: rgb(253,127,20);display: inline-block;height: 50rpx;line-height: 50rpx;width: 45rpx;border-radius: 8rpx;text-align: center;}
}

.shopTitle{padding: 0 15rpx;@include flexc;
  .left{font-weight: 100;font-size: 32rpx;height: 100rpx;flex-grow:1;}
  .right{width: 180rpx;height: 110rpx;text-align: center;padding-top: 10rpx;}
  .right img{height: 60rpx;width: 60rpx;margin: auto;}
  .fenxiang{color: #8e8e8e;}
}

.title{display: flex;align-items: center;
  span{background-color: rgb(241,95,19);height: 38rpx;display: inline-block;width: 10rpx;margin-right: 15rpx;}
  text{font-size: 35rpx;color:#f9af4c;font-weight: 100;}
}

.JoinGroup{border-bottom: 5px solid rgb(233,233,233);}
.JoinGroup .item,.JoinGroup .left,.JoinGroup .right{@include flexc;}
.item{justify-content: space-between;font-size: 30rpx;font-weight: 100;padding: 15rpx 0; 
  .itemimg{width: 75rpx;height: 75rpx;border-radius: 50%;margin-right: 10rpx;}
  .itemInfo{text-align: center;margin-right: 30rpx;}
  .itemInfo span{display: block;}
  .itemInfo .time{font-size: 26rpx;color: #8e8e8e;}
  .itemInfo .info{font-size: 28rpx;}
  .itemInfo .info text{color: rgb(238,129,26);}
  .btn{height: 55rpx;line-height: 55rpx; width: 180rpx;border-radius: 40rpx;background-image: -webkit-linear-gradient(0deg, rgb(255,191,3), rgb(252,148,53));text-align: center;color: #fff;}
}
.tip{height: 150rpx;line-height: 150rpx;text-align: center;color: #8e8e8e;font-size: 0.8em;}

.Tion{padding-top:20rpx; 
  .tionTitle{@include flexc;justify-content: space-between;color: #8e8e8e;font-size: 20rpx;font-weight: 100;padding: 0 10rpx;}
  .tionTitle .xianQin{font-weight: bold;color: #666;}
}

.TionInfo{height: 1135rpx;}

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
  .btnWarp text{font-size: 32rpx;color: #fff;font-weight: 100;padding: 0 15rpx;}
  .btnWarp span{width: 2rpx;height: 35rpx;background-color: #fff;}
}

.showModel{position: fixed;z-index: 2;top: 0;left: 0;background: rgba(0, 0, 0, 0.51);height: 100vh;width: 100%;
.Model{height: 100%;width: 100%;display: flex;justify-content: center;align-items: center;}
.Model img{height: 800rpx;width: 450rpx;}
.Model i{position: absolute;right: 100rpx;top: 150rpx;color: #fff;}
}

</style>