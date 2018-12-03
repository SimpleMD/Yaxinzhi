<template>
  <div class="helpdiscount">
    <div class='userInfo'>
      <div class='userImg'>
        <img :src="memberCut.face"/>
      </div>
      <text>{{memberCut.uname}}</text>
    </div>
    <div class='title'>距离活动剩余{{countdown.days}}天{{countdown.hours}}小时{{countdown.minutes}}分
      {{countdown.seconds}}秒</div>
    <div class='good'>
      <div class='goodleft'>
        <div class='goodImg'>
         <img :src='goodImg'/>
       </div>
     </div>
     <div class='goodright'>
      <div>{{goodname}}</div>
    </div>
  </div>
  <div class="tabInfoList">
   <div class="item" v-for="(item,index) in memberCut.cutHistoryDOs" :inedx='index' :key='item'>
     <div class="left"><img :src="item.face" /><div><p>{{item.uname}}</p><p>{{item.cutTime}}</p></div></div>
     <div class="right"><text class="selTile">已砍：</text><text class="selPrice">￥{{item.cutPersAmount}}元</text></div>
   </div>
   <div class="count">
     <div class="left">已砍:{{cutTotal}} 元</div>
     <div class="right">还剩:{{cutGood.initPrice-cutTotal}}元</div>
   </div>
 </div>
 <div class='tip'>{{cutStatus}} </div>
 <div class='btn help' @click='helpcut' v-if="!isCut">帮他补一刀</div>
 <div class='btn btnmyslf'  @click='gocutlist' v-if="isCut">我也想要</div>
 


<!--     <div class='cutpanel'>
      
      
      <div class='good'>
        <div class='goodleft'>
          <div class='goodImg'>
             <image :src='goodImg'></image> 
          </div>
        </div>
        <div class='goodright'>
          <div>{{goodname}}</div>
          <div class='acttime'>距离活动剩余{{countdown.days}}天{{countdown.hours}}小时{{countdown.minutes}}分
          {{countdown.seconds}}秒</div>
        </div>
      </div>
      <div class='box'>
        <div class='small-box1'>
          <div class='small-top'> -->
           <!--  <div class='top_bcg'>
             <image src='https://shop.yogain.cn/simages/image/group/06.png'></image>
           </div>  -->
           <!-- <div class='top-tu'>￥{{cutTotal}}</div> 
           <div class='top-tu'>￥{{cutTotal}}</div> 
         </div>
         <div class='small-cont'>

        </div>
        <div class='small-bottom'>
          <text>原价：￥{{cutGood.initPrice}}.00</text>
          <text>最低：￥{{cutGood.belowPrice}}.00</text>
        </div>
      </div>
    </div>
    <div class='tip'>{{cutStatus}} </div>
    <div class='btngroup' v-if="!isCut">
      <div class='help' @click='helpcut'>帮他补一刀</div>
    </div> 
    <div class='btnmyslf'  @click='gocutlist' v-if="isCut">我也想要</div>

  </div>-->
  <!-- 分享砍价模态框 -->
<!--   <div class="drawer_screen" data-statu="close" wx:if="{{showModalStatus1}}"></div>
  <div animation="{{animationData}}" class="drawer_box" wx:if="{{showModalStatus1}}">
    <div class='cular' bindtap="modelClose" data-statu="close">
      <image src='https://shop.yogain.cn/simages/imgs/kx.png'></image>
    </div>
    <text class='mueb'>{{cutResult.cutMoney}}<text class='yuan'>元</text></text>
  </div> -->
 <loginModel ref="loginModel"></loginModel> 
  <cutModel :bcg='bcg' :cutType='cutType' @listenToChild="close" :cutPersAmount='cutResult.cutMoney' v-if='cutModalStatus'></cutModel> 
</div>
</template>

<script>
import Api from "@/utils/Api";
import config from "@/config";
import loginModel from "@/components/loginModel";
import cutModel from "@/components/cutModel"
let api=new Api
export default {
  data() {
    return {
      needhelpmemberId:'',
      goodsId:'',
      isCut:'',
      cutStatus:'',
      cutTotal:'',
      percent:'',
      memberCut:{},
      cutGood:{},
      countdown:{},
      goodImg:'',
      goodname:'',
      cutModalStatus:false,
      bcg:config.imgUrl+'/group/sharecut.png',
      cutResult:{},
      cutType:'H'
    }
  },
  async mounted(options){
    let that=this
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length-1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    var options = currentPage.options //如果要获取url中所带的参数可以查看options  
    that.needhelpmemberId = options.memberId;
    that.goodsId=options.goodsId;
    that.cutId=options.cutId;
    that.goodname=options.goodsname
    that.goodImg=options.goodImg  
    await that.$refs.loginModel.userLogin()// 方法2
    that.helpRequset()
    that.getByCut()
  },
  components: {
    loginModel,
    cutModel
  },
  methods: {
    helpRequset(){
     let that=this
     let params={}
     params.memberId =that.needhelpmemberId; 
     params.cutId = that.cutId;
     params.helpMemberId = wx.getStorageSync('memberId');
     api.isHelp(params).then(function(res){
       that.memberCut= res.data.cutData
       if(res.data.code==200){
        if(res.data.cutData.isSuccess==1){
          that.isCut=true;
          that.cutStatus='好友已砍价成功，即将为他发货'
        }
        else{
          that.isCut=false;
          that.cutStatus='好友正在砍价，快助他一臂之力吧'
        }
      }
      else{
        that.isCut=true
      }
      var cuttotal = 0;
      for (var i = 0; i < res.data.cutData.cutHistoryDOs.length; i++) {
        cuttotal = cuttotal + res.data.cutData.cutHistoryDOs[i].cutPersAmount
      }
      that.cutTotal= cuttotal
      that.percent= (cuttotal / (that.data.cutGood.initPrice - that.data.cutGood.belowPrice)) * 100
    })
     if (that.needhelpmemberId  ==  wx.getStorageSync('memberId')) {
       that.isCut= true
     } else { 
      that.isCut=false  
    } 
  },
  close(){
    let that=this
    that.isCut=true
    that.cutModalStatus=false
    that.helpRequset()
    that.getByCut()
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
    async getByCut(){
      let that=this
      var starttime = (new Date()).valueOf();
      let cutDetailRes=await api.getByCutId(that.cutId)
      that.cutGood=cutDetailRes.data
      that.cutTime(starttime,that.cutGood.endtime)
    },
    async helpcut(){

    let that = this;
    wx.showLoading({
      title: '请稍等',
    })
    // 帮忙砍价
    var helpCutParm = {}
    helpCutParm.memberId = that.needhelpmemberId;
    helpCutParm.startcutId = that.memberCut.startcutId;
    helpCutParm.helpMemberId = wx.getStorageSync('memberId');
    helpCutParm.residualAmount = that.memberCut.residualAmount;
    helpCutParm.cutType = that.cutGood.cutType;
    helpCutParm.belowPrice = that.cutGood.belowPrice;
    if (that.cutGood.cutType == 0) {
      helpCutParm.minAmount = that.cutGood.minAmount;
      helpCutParm.maxAmount = that.cutGood.maxAmount;
    }
    else {
      helpCutParm.cutAverAmount = that.cutGood.cutAverAmount
    }
    let helpCutRes=await api.helpCut(helpCutParm)
    wx.hideLoading()
    that.cutResult=helpCutRes.data
    that.cutModalStatus=true
    }
  }
}
</script>
<style scoped lang='scss'>

.userInfo{
  
  width: 100%;
  text-align: center; 
}
.title{
 text-align: center;
}
.userImg{
  border-radius: 50%;
  width: 130rpx;
  height: 130rpx;
  overflow: hidden;
  margin: 10rpx auto;
}
img{
  width: 100%;
  height: 100%;
  display: block;
}
.good{
  display: flex;
  width: 95%;
  margin: 0 auto;
  margin-top: 20rpx;

}
.goodleft{
 width: 200rpx;
}
.goodImg{
  width: 200rpx;
  height: 200rpx;
  overflow: hidden;
}
.goodright{
  flex-grow:1; 
}
.tabInfoList{padding: 5rpx 25rpx;max-height: 500rpx;
  overflow: hidden;
   .item{display:flex;justify-content: space-between;margin-bottom: 20rpx;border-bottom: 2px solid rgb(243,243,243); font-weight: 100;font-size: 30rpx;color: #666;}
   .item .left{display:flex; }
   .left img{border-radius: 50%;width: 70rpx;height: 70rpx;margin-right: 15rpx;}
   .right .selPrice{color: rgb(251,154,50);}
   .count{
    display: flex;justify-content: space-between;color: #666;font-size: 30rpx;
   }
}

.tip{
  width: 90%;
  margin: 0 auto;
  text-align: center;
  height: 80rpx;
  line-height: 80rpx;
 
}
.btn{
  width: 90%;
  margin: 0 auto;
  border-radius: 10rpx;
  color: #fff;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
}
.help{
  background: #ff4948;
}

.btnmyslf{
 
  background: #08BC03;
}
</style>

