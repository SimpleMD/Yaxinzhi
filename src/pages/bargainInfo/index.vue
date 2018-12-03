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
         <div class="tag">精选水果</div><div class="price">￥<text class="newPrice">{{cutGood.belowPrice}}</text><text class="oldPrice">￥{{cutGood.initPrice}}</text></div>
      </div>
      <div class="right">
        <Timedown :countdown="countdown"></Timedown>
      </div>
    </div>
    <!--price end-->
    
    <div class="peopleInfo" v-if="isjoin">
      <div class="left">
        <img :src="memberCut.face"/>
      </div>
      <div class="right">
        <div class="title">{{memberCut.uname}}</div><div class="info">已有{{cutPersonCount}}位好友帮忙砍价，共砍<text>￥{{cutTotal}}</text>元</div>
      </div>
    </div>
    <div class="peopleInfoTip" v-if="!isjoin">
      少侠，赶紧砍一刀吧
    </div>
    <!--peopleInfo end-->
    
    <div class="shopInfo">
      <span>{{cutGood.cutName}}</span>
      <text>砍后价￥{{cutGood.belowPrice}}</text>
    </div>
   <!--shopinfo end-->
   <div class="tabWarp">
     <Tabs :find_item='find_item' @listenToChild="fromChild" :wid="width"></Tabs>
   </div>
    <!--tabWarp-->
    <div class="tabInfo">
      <div class="TionInfo" v-if="selectIndex==0">
        <wxParse :content="Goods.intro" @preview="preview" @navigate="navigate" />
      </div>
      <div class="tabInfoList" v-if="selectIndex==1&&isjoin">
         <div class="item" v-for="(item,index) in memberCut.cutHistoryDOs" :inedx='index' :key='item'>
           <div class="left"><img :src="item.face" /><div><p>{{item.uname}}</p><p>{{item.cutTime}}</p></div></div>
           <div class="right"><text class="selTile">已砍：</text><text class="selPrice">￥{{item.cutPersAmount}}元</text></div>
         </div>
      </div>
      <div class="tabInfoListTip" v-if="selectIndex==1&&!isjoin">
         砍价排行榜为空
      </div>

    </div>

     <div class="HeightDiv"></div>
     <div class="footerBnt">
       <div class="left">
         <div class="leftItme"  @click="toIndex('/pages/index/main')"><img :src="ImgList.home" /><text>首页</text></div>
         <div class="leftItme">
           <button class='homepage custom' open-type="contact" session-from="weapp"><img :src="ImgList.kefu" @click="kefu"/><text>客服</text> </button></div>
         <div class="leftItme"><img :src="ImgList.shouChang" /><text>收藏</text></div>
       </div>
       <div class="right" >
         <form @submit="FromModal" report-submit="true"> 
          <div class="btnWarp" v-if="!isjoin&&!iscutOk&&canJoin" @click="startCut">
              <!-- <text>加入购物车</text><span></span><text @click="showModel">立即购买</text> -->
              <button form-type="submit">立即参与</button>
          </div>
         </form>
         <div class="btnWarp" v-if="isjoin&&!iscutOk&&canJoin"> 
            <div class="nowprice" @click="payorder">
              <p>现价入手</p>
              <p>￥{{cutFinalAmount}}</p>
            </div> 
            <span></span>
            <div>
              <button class="forhelp" open-type='share'>找人帮砍</button>
            </div>     
         </div>
         <div class='btnWarp' v-if="iscutOk&&canJoin&&isjoin" @click="payorder">砍价成功立即购买</div>
         <div class='btnWarp' v-if="iscutOk&&!canJoin&&isjoin" >成功参与活动</div>
       </div>
     </div>
     <!--footerBnt end-->
      
   <!--    <Model :ImgList='ImgList' :modelShow='modelShow' :Area_item='Area_item' :Weight_item='Weight_item'  @hideModel='hideModel' ref="childs">></Model> -->
   <cutModel :bcg='bcg' :cutType='cutType' @listenToChild="close" :cutPersAmount='cutResult.cutHistoryDOs[0].cutPersAmount' v-if='cutModalStatus'></cutModel>
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import Timedown from "@/components/countdown"
 import Tabs from "@/components/tab"
 import Model from "@/components/shopModel"
 import cutModel from "@/components/cutModel"
 import wxParse from 'mpvue-wxparse'
 import formatTime from "@/utils/index"
 let api= new Api 
export default {
  components: {
   Timedown,
   Tabs,
   Model,
   wxParse,
   cutModel
  },

  data () {
    return {
          find_item:[
          {name:"商品详情页",selected:true},
          {name:"砍价排行榜",selected:false}],
          Area_item:[{AreaName:'湖北'},{AreaName:'江西'}],
          Weight_item:[{WeightName:'1kg'},{WeightName:'2kg'}],
          ImgList:{home:config.imgUrl+'/group/home.png',kefu:config.imgUrl+'/group/kefu.png',shouChang:config.imgUrl+'/group/shoucang.png',
          },
          countdown:{},
          selectIndex:0,
          modelShow:false,
          width:"50%",
          Gallery:[],
          Goods:{},
          cutGood:{},
          isjoin: false,
          iscutOk: false,
          cutTotal:'',
          memberCut:{},
          cutPersonCount:'',
          cutFinalAmount:'',
          memberId:'',
          cutId:'',
          goodsId:'',
          bcg:config.imgUrl+'/group/cut.png',
          cutModalStatus:false,
          cutResult:{},
          cutType:'C',
          productId:'',
          canJoin:true
    }
  },
   methods: {
    // 砍价成功立即购买
    payorder(){
      let that=this
      let cutfinalAmount =Number(that.cutGood.initPrice - that.cutTotal).toFixed(2) 
      let url=`../order/main?goodsImg=${that.Goods.thumbnail}&goodname=${that.Goods.name}&cutId=${that.cutId}&Type=KJ&price=${that.cutGood.initPrice}&goodsId=${that.Goods.goodsId}&productId=${that.productId}&activityPrice=${cutfinalAmount}&startCutId=${that.memberCut.startcutId}`
      wx.navigateTo({
        url:url,
      })
    },
     toIndex(url){
    wx.switchTab({ url: url });
   },
    //选项卡点击事件
    async fromChild(data){
      let that = this;
      that.selectIndex=data
      that.find_item=that.find_item.map((item)=>{
         item.selected=false;
         return item
        })
       that.find_item[data].selected=true
     
    },
    close(){
      let that=this
      that.cutModalStatus=false
      that.getByCut()
      that.isJoin()
    },
    //立即购买淡出模态框
    showModel(){
     let that = this;
     that.modelShow=true;
     //父组件控制子组件
     that.$refs.childs.emitEvent();
    },
    hideModel(){
       //是否传值
     let that = this;
     that.modelShow=false;
     console.log("点击了吗",that.modelShow)
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
    async getGood(){
    let that=this
    let goodsRes=await api.getGoods(that.goodsId,that.memberId)
    that.Gallery=goodsRes.data.Gallery
    that.Goods=goodsRes.data.Goods
    },
    async getByCut(){
      let that=this
      var starttime = (new Date()).valueOf();
      let cutDetailRes=await api.getByCutId(that.cutId)
      that.cutGood=cutDetailRes.data
      that.cutTime(starttime,that.cutGood.endtime)
    },
    async isJoin(){
      let that=this
      let isJoinRes=await api.isJoin(that.memberId,that.cutId)
      if(isJoinRes.data.code==1){
        that.isjoin=false
        that.iscutOk=false;
        that.canJoin=true;
      }else{
        var cuttotal = 0;
        for (var i = 0; i < isJoinRes.data.memberCutDate.cutHistoryDOs.length; i++) {
          cuttotal = cuttotal + isJoinRes.data.memberCutDate.cutHistoryDOs[i].cutPersAmount
          isJoinRes.data.memberCutDate.cutHistoryDOs[i].cutTime=formatTime.formatTime(isJoinRes.data.memberCutDate.cutHistoryDOs[i].cutTime)
        }
        if (isJoinRes.data.memberCutDate.isSuccess == 1&&isJoinRes.data.memberCutDate.paied==1) {
          that.iscutOk=true;
          that.isjoin= true;
          that.canJoin=true; 
        }
        else if(isJoinRes.data.memberCutDate.isSuccess == 1&&isJoinRes.data.memberCutDate.paied==2){
          that.canJoin=false;
          that.isjoin= true; 
          that.iscutOk=true;
        }
        else {
          that.iscutOk=false;
          that.isjoin= true;
          that.canJoin=true; 
        }
        that.cutTotal= Number(cuttotal).toFixed(2);
        that.cutFinalAmount= Number(that.cutGood.initPrice - cuttotal).toFixed(2);
        that.memberCut= isJoinRes.data.memberCutDate;
        that.cutPersonCount=that.memberCut.cutHistoryDOs.length

      }
    },
    async startCut(){
      var that=this
      var startcutparm = {}
      startcutparm.memberId = that.memberId
      startcutparm.cutId = that.cutGood.cutId
      startcutparm.cutType = that.cutGood.cutType
      if (that.cutGood.cutType == 0) {
        startcutparm.minAmount = that.cutGood.minAmount
        startcutparm.maxAmount = that.cutGood.maxAmount
      }
      else {
        startcutparm.cutAverAmount = that.cutGood.cutAverAmount
      }
       let startCutRes=await api.startCut(startcutparm)
       that.cutResult=startCutRes.data.memberCutDate
       that.cutModalStatus=true
    },
    async FromModal(e){
      let that = this;
      let memberId = wx.getStorageSync('memberId');
      let fromid = e.mp.detail.formId
      let res = await api.SaveFormid(memberId,fromid)
    }

  },
  onLoad(options){
     var that=this;
    console.log(options);
    that.memberId = wx.getStorageSync('memberId');
    that.goodsId=options.goodsId;
    that.cutId=options.cutId;
    that.productId=options.productId
     //页面渲染完成创建一个动画
    that.getGood()
    that.getByCut()
    that.isJoin()
  },
  onShareAppMessage: function () {
    var that = this;
    console.log(that.cutId);
    return {
      title: '分享砍价',
      desc: '少侠，快帮我砍一刀',
      path: '/pages/helpdiscount/main?memberId=' + that.memberId + '&cutId=' + that.cutId + '&goodsname=' + that.Goods.name+'&goodImg='+that.Goods.thumbnail// 路径，传递参数到指定页面
    }
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

.bottomright{height: 120rpx;}
.peopleInfo{@include flexc;padding-bottom: 20rpx;border-bottom: 2px solid rgb(245,245,245);
   .left{width: 25%;}
   .left img{width: 100rpx;height: 100rpx;margin: auto;border-radius: 50%;}
   .right{width: 75%;}
   .right .title{font-weight: 100;font-size: 34rpx;color: #666;}
   .right .info{color: #8e8e8e;font-weight: 100;font-size: 26rpx;}
   .right text{color: rgb(252,148,53);}
}
.peopleInfoTip{
  color: rgb(252,148,53);text-align: center;height: 120rpx;line-height: 120rpx;
}
.shopInfo{padding: 10rpx 20rpx;
   span{font-size: 28rpx;font-weight: 100;}
   text{display: inline-block;padding: 0rpx 10rpx;margin-left: 15rpx;border-radius: 25rpx; background:rgb(252,148,53);font-weight: 100;font-size: 24rpx;color: #fff;}
}

.TionInfo{}
.tabInfoList{padding: 5rpx 25rpx;
   .item{@include flexc;justify-content: space-between;margin-bottom: 20rpx;padding-bottom: 15rpx;border-bottom: 2px solid rgb(243,243,243); font-weight: 100;font-size: 30rpx;color: #666;}
   .item .left{@include flexc; }
   .left img{border-radius: 50%;width: 70rpx;height: 70rpx;margin-right: 15rpx;}
   .right .selPrice{color: rgb(251,154,50);}
}
.tabInfoListTip{
  color: #ccc;
  font-size: 0.8em;
  text-align: center;
  height: 180rpx;
  line-height: 180rpx;
}
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
  .btnWarp{background-image: -webkit-linear-gradient(0deg,rgb(252,148,53), rgb(255,191,3));border-radius: 45rpx;height: 75rpx;line-height: 75rpx; display: flex; color:#fff;}
  .btnWarp .nowprice{font-size: 28rpx;color: #fff;font-weight: 100;padding: 0 15rpx 0 20rpx;display:block;box-sizing: border-box;}
  .btnWarp .nowprice p{height: 35rpx;line-height: 35rpx;}
  .btnWarp span{width: 2rpx;height: 35rpx;background-color: #fff;}
  .btnWarp .forhelp{background: none;border:none;color: #fff;}
  .btnWarp button{color: #fff;}
}

</style>
