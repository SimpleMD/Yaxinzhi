<template>
  <div class="distribe">
    <div class="head">
      <div class="title">可提现佣金</div>
      <div class="money">￥{{distribeDo.balance}}元</div>
      <div class="btnWarp"><text @click="jumpPage">提现</text><text @click="eventDraw">推广</text></div>
    </div>
    <!--head end-->

    <div class="panelWarp">
    <div class="panel">
      <div class="panelitem">
        <p>{{total}}</p> 
        <p class="name">累计佣金</p>
      </div>
      <div class="line"></div>
      <div class="panelitem">
        <p>{{len}}</p> 
        <p class="name">我的团队</p>
      </div>
    </div>
    </div>
    <!--panelWarp end-->

    <div class="List">
      <div class="Item" @click="toPage('../commission/main')"><img :src="listImg.item01" /><text>分佣商品</text></div>
      <div class="line"></div>
      <div class="Item" @click="toPage('../distribePay/main')"><img :src="listImg.item02" /><text>提现申请记录</text></div>
      <div class="line"></div>
      <div class="Item" @click="toPage('../distribeUp/main')"><img :src="listImg.item03" /><text>会员升档</text></div>
    </div>
    <!--List end-->

    <div class="UserList">
      <div class="userTitle"><text class="line"></text><text>新增成员</text></div>
      <div class="item" v-for="(item,index) in memberDOList" :index='index' :key="item"><img :src="item.face"/><text>{{item.uname}}</text></div>
    </div>
    <!--User END-->
    
    <div class='canvas' v-if='maskmodel'>
    <div class='modelcard'>
      <div class='model'>
        <img :src="shareImage" class="share-image"/>
        <!-- <image :src="shareImage" class="share-image"></image> -->
        <canvasdrawer :painting="painting" class="canvasdrawer" @getImage="eventGetImage"/>
      </div> 

      <div class="BtnWarp">
        <div class='modelbtn'  @click="eventSave">保存本地</div>
        <div class='modelbtn modelbtntop' @click='guanbi'>关闭</div>
      </div>
      </div>
    </div>

  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import Lib from "@/utils/lib"
 import config from "@/config"
 let api=new Api
export default {
  components: {

  },

  data () {
    return {
    listImg:{headerImg:config.imgUrl+'/distribe/headerImg.jpg',weiBtn:config.imgUrl+'/distribe/weiBtn.jpg',
           Bac:config.imgUrl+'/distribe/bac.jpg',item01:config.imgUrl+'/distribe/item01.png',
           item02:config.imgUrl+'/distribe/item02.png',item03:config.imgUrl+'/distribe/item03.png',
       },
    memberId:'',
    distribeDo:{},
    memberDOList:[],
    painting:{},
    shareImage:'',
    maskmodel:false,
    len:0,
    total:'',
    totalAssets:'',
    face:'',
    uname:''
    }
  },
  methods:{
   //选项点击加载   
   async onloads(){
     let that = this;
     let res = await api.DistribeInfo(that.memberId)
     console.log("查看请求信息",res)
     that.distribeDo = res.data.distribeDo;
     that.memberDOList = res.data.memberDOList
     that.len = res.data.memberDOList.length
     that.total = res.data.total
     that.totalAssets = res.data.totalAssets
   },
   toPage(url){
     wx.navigateTo({ url: url });
   },
   //跳转提现
   jumpPage(){
     let that = this;
     if(that.distribeDo.balance == 0){
       Lib.Show('账号余额不足','none',2000)
     }else{
       wx.redirectTo({ url: '../distribemoney/main?balance='+that.distribeDo.balance+'&cardno='+that.distribeDo.cardno+'&depositBank='+that.distribeDo.depositBank });
     }
   },
   guanbi(){
     let that = this;
     that.maskmodel = false
    //  console.log("你好世界 123132")
   },

   async eventDraw(){
     let that = this;
     that.maskmodel=true;
     Lib.Loading("图片绘制中")
     let res = await api.GetShare('pages/index/main',that.distribeDo.distribeId)
     let ImgArr = [res.data,that.listImg.Bac,that.face]

     let ImgRes = await Lib.getImageInfo(ImgArr)
      console.log("查看图片asdas",ImgRes)
         that.painting={
              width: 375,
              height: 460,
              clear: true,
                   views: [
                  {
                    type: 'image',
                    url: ImgRes[1],
                    top: 0,
                    left: 37,
                    width: 300,
                    height: 460
                  },
                  {
                    type: 'image',
                    url: ImgRes[2],
                    top: 45,
                    left: 172,
                    width: 40,
                    height: 40
                  },
                  {
                    type: 'text',
                    content: that.uname+"邀你加入会员",
                    fontSize: 16,
                    color: '#666',
                    textAlign: 'center',
                    width:375,
                    top: 105,
                    left: 175,
                  },
                  {
                    type: 'image',
                    url: ImgRes[0],
                    top: 150,
                    left: 130,
                    width: 120,
                    height: 120
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
    }
  }

  },
   onLoad(options) {
     let that = this;
     that.memberId = wx.getStorageSync('memberId')
     that.face = wx.getStorageSync('face');
     that.uname = wx.getStorageSync('uname');

     //初始化信息
     that.onloads()
  }
}
</script>

<style scoped lang='scss'>
.head{
  height: 350rpx;
  background: #fc9e39;
  width: 100%;
  color:#fff;
  font-weight: 100;
  text-align: center;
  .title{
    padding-top: 26rpx;
    height: 90rpx;
    line-height: 120rpx;
  }
  .money{
    height: 100rpx;
    line-height: 100rpx;
    font-size: 2em;
  }
  .btn{
    background: #fff;
    width: 200rpx;
    color: #8e8e8e;
    border-radius: 30rpx;
    margin: 10rpx auto;
    font-size: 0.8em;

  }
}

.panelWarp{position: relative;width: 100%;margin-top: -35rpx;}
.panel{
  width: 85%;
  margin:0 auto;
  height: 100rpx;
  display: flex;
  align-items:center;
  background: #fff;
  box-shadow: 0 0 25rpx rgba(0, 0, 0, 0.15);
  padding: 20rpx 0;
  border-radius: 6rpx;
  .panelitem{width: 49%;text-align: center;font-size: 32rpx;font-weight: 100;color: #666;}
  .panelitem .name{font-size: 30rpx;}
  .line{height: 80rpx;width: 1px;background: rgb(190, 190, 190);}
}

.List{display: flex;align-items: center;justify-content:space-around;margin: 30rpx 0;
   .Item{text-align: center;line-height: 40rpx;}
   .Item img{width: 60rpx;height: 60rpx;margin: auto}
   .Item text{display: block;font-weight: 100;font-size: 30rpx;}
   .line{height: 70rpx;width: 1px;background: #ccc;}
}

.userTitle{display: flex;align-items: center;padding: 0 25rpx;font-weight: 100;font-size: 34rpx;
   .line{height: 30rpx;width: 4px;background: rgb(252,153,47);margin-right: 20rpx;}
}

.UserList{margin: 10rpx 20rpx;
   .item{display: flex;align-items: center;padding: 20rpx;border-bottom: 1px solid rgb(231, 231, 231);}
   .item img{width: 76rpx;height: 76rpx;border-radius: 50%;margin-right: 18rpx;}
}

.btnWarp{
  text{display: inline-block;margin: 8rpx 20rpx;width: 170rpx;border-radius: 30rpx;
        background: #fff;font-weight: 100;font-size: 28rpx;color: #666;}
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


</style>
