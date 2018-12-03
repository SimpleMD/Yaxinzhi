<template>
  <div class="group">
   <Shopaddr :shopname="shopDetail.shopName"></Shopaddr>
   <div class="grouppanel">
     <div class="left">
       <img :src="pingtuandetail.img">
     </div>
     <div class="right">
       <div class="top">{{pingtuandetail.goodsName}}</div>
       <div class="center">
         <!-- <div class="centerleft">
           <div class="bcg">
             <img :src="bcg">
           </div>
           <div class="groupperson">
             2人团
           </div>  
         </div> -->
         <div class="centerright">
           剩余人数:<span>{{pingtuandetail.shortPerson}}</span>人
         </div>
       </div>
       <div class="bottom">
         <div class="bottomleft">
           <span class="groupprice">￥{{pingtuandetail.activityPrice}}</span>
           <span class="price">￥{{pingtuandetail.price}}</span>
         </div>
         <!-- <Countdowns :countdown="countdown"></Countdowns> -->
       </div>
     </div>
   </div>
   <div class="result" v-if="collageType==1">
     <img :src="pingsuccess">
   </div>
   <div class="result" v-if="collageType==2">
     <img :src="success">
   </div>
   <div class="result" v-if="collageType==3">
     <img :src="file">
   </div>
   <div class="resultTime" v-if="collageType==4&&canJoin">
      剩余{{countdown.hours}}时{{countdown.minutes}}分{{countdown.seconds}}秒结束</text>
   </div>
   <!-- 拼团人头像 -->
   <div class="userconten" v-if="(collageType==4&&canJoin)||(collageType!=4&&!canJoin)">
     <div class="useravator" v-for="(item,index) in collage" :key="item" :index="index">
      <div class="avator">
        <img :src="item.face">
      </div>
      <div class="captain" v-if="item.isStarter==1">
       <img :src="captain">
     </div>
   </div>

 </div>
 <div class="tip" v-if="collageType==1">
  已成团，等待发货
</div>
<div class="btn" v-if="collageType==1" @click="jumpGroupList">
 再开一团
</div>
<div class="tip" v-if="collageType==2">
 还差{{pingtuandetail.shortPerson}}人，赶紧去邀请好友来参团吧
</div>
<div v-if="collageType==2" @click="inviteFriends">
  <button class="btn" open-type='share'>邀请好友来参团</button> 
</div>
<div class="tip" v-if="collageType==3">
 未成团，重新开团
</div>
<div class="btn" v-if="collageType==3" @click="jumpGroupList">
 重新开团
</div>
<div class="btn" v-if="collageType==4&&canJoin" @click="jumpOrder">
 立即参团
</div>
<div class="btn" v-if="collageType==4&&!canJoin" @click="jumpGroupList">
 我要开团
</div>
<loginModel ref="loginModel"></loginModel> 
  </div>
</template>

<script>
import Api from "@/utils/Api";
import util from "@/utils/index";
import Shopaddr from '@/components/shopaddr';
import config from "@/config";
import Countdowns from "@/components/countdown";
import loginModel from "@/components/loginModel";
let api=new Api
export default {
  data() {
    return {
      collageType:'',
      pingsuccess:config.imgUrl+'/group/pingsuccess.png',
      success:config.imgUrl+'/group/success.png',
      file:config.imgUrl+'/group/file.png',
      bcg:config.imgUrl+"/group/quer.png",
      captain:config.imgUrl+"/group/cation.png",
      countdown:{},
      collage:[],
      pingtuandetail:{},
      shopDetail:{},
      memberId:'',
      isMember:false,
      countdown:{},
      canJoin:false
    }
  },
 
  components: {
  Countdowns,
  Shopaddr,
  loginModel
  },
  methods: {
    inviteFriends:function(){

    },
    jumpGroupList(){
     wx.navigateTo({
      url: '../grouplist/main',
     })
    },
   async jumpOrder(){
      let that=this
      console.log(that.pingtuandetail);
      let cantuanParams = {}
      cantuanParams.memberId = that.memberId
      cantuanParams.memberCollageId = that.pingtuandetail.memberCollageId
      let collageRes=await api.joinCollageRepetition(cantuanParams)
      if(collageRes.data.code==0){
      // 可以参团
      let url= `../order/main?goodsImg=${that.pingtuandetail.img}&goodname=${that.pingtuandetail.goodsName}&activityPrice=${that.pingtuandetail.activityPrice}&memberCollageId=${that.pingtuandetail.memberCollageId}&Type=C&price=${that.pingtuandetail.price}&goodsId=${that.pingtuandetail.goodsId}&productId=${that.pingtuandetail.productId}`
        wx.navigateTo({
          url: url,
        })
      }
      else{
      wx.showToast({
        title: '您已经参过这个团了哦',
        icon: 'none',
        duration: 2000
      })
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
    async collageSucceed(productId,memberCollageId){
      let params = {}
      let that=this
      params.productId =productId
      params.memberCollageId = memberCollageId
      let collageSucceedRes=await api.collageSucceed(params)
      that.collage=collageSucceedRes.data.collageSucceed
      if(that.collageType==4){
        let starttime=(new Date()).valueOf()
        let endtime = (that.collage[0].entertime + 86400000);
        if(starttime>endtime){
           wx.showToast({
            title: "活动已过期！",
            icon: "success",
            durantion: 2000
          })
           that.canJoin=false
        }
        else{
          that.canJoin=true
          that.cutTime(starttime,endtime)
        }    
      }
  }
},
   async mounted(options){
    var that=this;
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length-1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    var options = currentPage.options //如果要获取url中所带的参数可以查看options  
    that.shopDetail=wx.getStorageSync('shopDetail')
    that.memberId = wx.getStorageSync('memberId')
    console.log(options);
    var pingtuandetail = JSON.parse(options.shops)
    that.pingtuandetail=pingtuandetail
    if(that.pingtuandetail.Type=='FC'){
      // 判断是否好友参团
      that.collageType=4
      wx.setNavigationBarTitle({
         title: "参团"//页面标题为路由参数
       })
       // 判断时候是平台会员
       await that.$refs.loginModel.userLogin()
       let friendCollageRes=await api.friendCollage(that.pingtuandetail.memberCollageId)
       if(friendCollageRes.data.code==0){
              // 说明可以参团并且获取拼团成功数据
              that.collageSucceed(that.pingtuandetail.productId,that.pingtuandetail.memberCollageId)     
            }
            else{
             wx.showToast({
               title: "团人数已满！",
               icon: "success",
               durantion: 2000
             })
             that.canJoin=false   
           }

         } 
         else{
           that.collageSucceed(pingtuandetail.productId,pingtuandetail.memberCollageId)
     // var endtime=1541995932000
     // var starttime = (new Date()).valueOf();
     // that.cutTime(starttime,endtime)
     if(pingtuandetail.iscollage==1){
       that.collageType=1
       wx.setNavigationBarTitle({
         title: "拼团成功"//页面标题为路由参数
       })
     }
     else if(pingtuandetail.iscollage==2){
      that.collageType=2
      wx.setNavigationBarTitle({
       title: "待成团"//页面标题为路由参数
     })
    }
    else{
      that.collageType=3
      wx.setNavigationBarTitle({
       title: "拼团失败"//页面标题为路由参数
     })
    } 
  }  
  },
   onShareAppMessage: function () {
    var that = this
    var shops={}
    shops = that.pingtuandetail
    shops.memberId = wx.getStorageSync('memberId')
    shops.Type='FC'
    shops=JSON.stringify(shops)
    console.log(shops);
    return {
      path: '/pages/group/main?shops=' + shops,
    }
  },  
}
</script>
<style scoped lang='scss'>
img{
  width: 100%;
  height: 100%;
  overflow:hidden;
}
.grouppanel{
  display: flex;
  margin-top: 20rpx;
  border-bottom: 3rpx solid #f3f3f3;
  padding-bottom: 20rpx;
  box-sizing:border-box;
  .left{
    width: 200rpx;
    height: 200rpx;
    overflow: hidden;
  }
  .right{
    padding-left: 20rpx;
    box-sizing: border-box;
    flex-grow:1;
    .top{
      display: -webkit-box;
      width: 500rpx;
      line-height: 1.5;
      font-size: 0.9em;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      color:#999;
    }
    .center{
      display: flex;
      width: 500rpx;
      margin-top: 10rpx;
      margin-bottom: 10rpx;
      justify-content: space-between;
      .centerleft{
        position: relative;
        .bcg{
          width:75px;
          height: 25px;
          overflow: hidden; 
        }
        .groupperson{
          position: absolute;
          top: 0;
          left: 55rpx;
          color:#fff;
          font-size: 0.7em;
          height: 25px;
          line-height: 25px;
        }
      }
      .centerright{
        font-size: 0.7em;
        span{
          color: #fc9632;
        }
      }

    }
    .bottom{
      width: 500rpx;
      display: flex;
      justify-content: space-between;
      font-size: 0.7em;
      .bottomleft{
        .groupprice{
          font-size: 20px;
          color: #fc9632;
        }
        .price{
          color: #999;
          text-decoration: line-through;
        }
      } 
    }
  }
}
.result{
  width: 190rpx;
  height: 120rpx;
  margin: 20rpx auto;
  overflow: hidden;
}
.resultTime{
  width: 100%;
  text-align: center;
}
.userconten{
  display: flex;
  justify-content: center; 
  .useravator{
    position: relative;
    .avator{
      width: 120rpx;
      height: 120rpx;
      overflow: hidden;
      margin-left: 10rpx;
      border-radius: 50%;
    }
    .captain{
      position: absolute;
      width: 140rpx;
      height: 45rpx;
      top: 0 ;
      left: -5rpx;
    }
  }

}
.tip{
  font-size: 0.8em;
  color: #999;
  text-align: center;
  width: 70%;
  margin: 0 auto;
}
.btn{
  height: 80rpx;
  line-height: 80rpx;
  width: 70%;
  background: linear-gradient(to right,#ee5033,#ca261d);;
  color: #fff;
  border-radius: 40rpx;
  margin: 30rpx auto;
  text-align: center;
}

/* 登录模态框 */
.mode{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}
.bcg{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
}
.loginmodel{
  border-radius:10rpx; 
  width: 60%;
  height: 260rpx;
  background: #fff;
  position: absolute;
  top: 500rpx;
  left: 20%;
}
.title{
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
}
.modeltip{
  width: 90%;
  margin: 0 auto;
  font-size: 0.8em;
  text-indent: 20px;
  color: #8a8a8a;
  height: 100rpx;
}
.modelbtn{
  border: none;
  outline: 0;
  text-align: right;
  background: #fff;
  color: #3494ff
}
button::after {
  border: none;
}

</style>

