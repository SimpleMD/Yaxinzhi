<template>
  <div class="indexwarp ">
    <skeleton selector="skeleton"
    loading="spin"
    bgcolor="#FFF"
    v-if="showSkeleton"></skeleton>
    <div class="skeleton">
      <!-- <div class="heightDiv"></div> -->
      <div class="header"  @click="toPage('../search/main')">
        <div class="search">
          <span><img src="/static/images/search.png"></span>王小贱鲜果零食优选
        </div>
      </div>
      <!--header end-->
      <div class="tips  skeleton-Mrect">
        <div class="logo"><img :src="imgList.logo"><span>{{shopDetail.shopName}}</span></div><small @click="changeShop">[切换]</small>
      </div>
      <!--tip end-->
      <div class="brand skeleton-Mrect">
        <swiper class="swiper" indicator-dots='true' autoplay='true'>
          <swiper-item v-for="(item,index) in banner" :key='item' :index="index" @click="jumpshopInfo(item.goodsId)"><img :src="item.imageUrl"></swiper-item>
        </swiper>
      </div>
      <!--brand end-->
      <div class="news  skeleton-Mrect">
        <div class="shopImg"><img :src="imgList.shopImg"></div>
        <small class="tag">火热</small>
         <div class="contentWarp">
            <div class="box-content">
                <text v-for='(item,index) in messageDoList' :index='index' :key='item'>{{item.content}}</text>
                <text style="display: inline-block; width: 5em;"></text>
            </div>
          </div>

        <!-- <swiper class="messageswiper" duration='1500' autoplay='true' interval='2000' >
          <swiper-item v-for="(item,index) in messageDoList" :key="item" :index="index" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
              {{item.content}}
          </swiper-item>
        </swiper> -->
      </div>
      <!--news end-->
      <div class="hot">
       <div class="hotBg" @click="toPage('../ranking/main')"><img :src="imgList.hotImg" /></div>
       <div class="hotList">
        <div class="hotItem skeleton-rect" v-for="(item,index) in hotgoodsList" :key="item" :index="index" @click="jumpshopInfo(item.goodsId)">
          <div class="icoImg" v-show="index == 0"><img :src="imgList.ico1"/></div>
          <div class="icoImg" v-show="index == 1"><img :src="imgList.ico2"/></div>
          <div class="icoImg" v-show="index == 2"><img :src="imgList.ico3"/></div>
          <div class="hotShop"><img :src="item.thumbnail"/></div>
          <span>已售{{item.buyCount}}件</span>
        </div>
      </div>
    </div>
    <!--hot end-->
    
    <div class="activity">
      <div class="top topimg"><img :src="imgList.activityImg"></div>
      <div class="actList">
        <div class="actItem skeleton-rect" v-for="(item,index) in activityImg" :index='index' :key='item' @click="toPage(item.pageUrl)">
            <div class="itembg"><img :src="item.actBg"/></div>
            <div class="itemTile">
               <text>{{item.actName}}</text><small>{{item.acttall}}</small>
            </div>
        </div>
      </div>
    </div>
   <!--activity end-->
   <div class="rili">
     <div class="riliTitle"><text>时令日历</text></div>
     <div class="riliMore"><span class="time">11月</span><small class="more" @click="toPage('../riliList/main?catId='+rilicatId)">查看更多</small></div>
     <div class="riliBg"><img :src="imgList.rilibg"/></div>
     <div class="liriWarp">
      <!-- <div class="riliTop">
        <span>新品上市</span><span>超值特惠</span><span>店长推荐</span>
      </div> -->
      <!-- <div class=""></div> -->
      <scroll-view  scroll-x style="height: 270rpx;">
        <div class="riliWarp" >
          <div class="Item" v-for="(item,index) in seasonalCalendarRes" :index='index' :key='item' @click="jumpshopInfo(item.goodsId)">
             <div class="posIco"><img :src="imgList.riliico"/></div>
            <img :src="item.thumbnail"/>
            <div class="riliPrice">￥{{item.price}}</div>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
  <!--rili end-->
  <block v-for="(outitem,outindex) in advertisingIndex" :index="outindex" :key="outitem">
    <div class="free">
      <div class="freeTop"><span>{{outitem.bigTitle}}</span><p>{{outitem.smallTitle}}</p></div>
      <div class="freeBrand"   @click="jumpshopInfo(outitem.goodsId)"><img :src="outitem.imageUrl"/></div>
    </div>
    <div class="freeList">
      <div class="freeListBg"><img :src="imgList.freeImgBg" /></div>
      <scroll-view class="scrollItem" scroll-x style="height: 335rpx;">
        <div class="freeItemWarp">
          <div class="freeItem" v-for="(innerItem,innerIndex) in outitem.goodsDOList" :index='innerIndex' :key='innerItem' @click="jumpshopInfo(innerItem.goodsId)">
            <img :src="innerItem.thumbnail" /><div class="freeInfo">{{innerItem.name}}</div>
          </div>
          <div class="loadMore" @click="toPage('../fruitList/main?catId='+outitem.catid+'&bigTitle='+outitem.bigTitle+'&smallTitle='+outitem.smallTitle)">
          <!-- 查<br>看<br>更<br>多<br>
          <i class="fa fa-chevron-circle-right" aria-hidden="true"></i>  -->
            <img :src="imgList.MoreImg" class="MoerImg" mode='aspectFit' />
          </div>
        </div>   
      </scroll-view>
    </div>
<!--     <div class="freeMore" @click="jumpmore(outitem.catid)">更多热销<i class="fa fa-chevron-circle-right" aria-hidden="true"></i> </div>
 -->
  </block>

  <!--free end-->
  <div class="bottomBrand">
    <img :src="imgList.bottomBrand" mode='aspectFit' />
  </div>
  <!--bottomBrand end-->

  <div class="footer">
   <img :src="imgList.footerImg"/>
 </div>
</div>
<loginModel ref="loginModel"></loginModel> 

</div>
</template>
<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import skeleton from '@/components/skeleton'
 import loginModel from "@/components/loginModel";
 let api= new Api 
  export default {
    data() {
      return {
        imgList:{logo:config.imgUrl+'/index/logo1.jpg',shopImg:config.imgUrl+'/index/news.jpg',hotImg:config.imgUrl+'/index/hot.jpg',activityImg:config.imgUrl+'/index/activityImg.jpg',
        rilibg:config.imgUrl+'/index/rili.png',riliico:config.imgUrl+'/index/rilico.png',freeImgBg:config.imgUrl+'/index/freeBg.jpg',bottomBrand:config.imgUrl+'/index/bottomBrand.jpg',
        footerImg:config.imgUrl+'/index/footerImg.png', ico1:config.imgUrl+'/index/ico1.png',ico2:config.imgUrl+'/index/ico2.png',ico3:config.imgUrl+'/index/ico3.png',
        MoreImg:config.imgUrl+'/shop/moreBtn.png'
        },
        banner:[],
        hotgoodsList:[],
        seasonalCalendarRes:[],
        messageDoList:[{content:''}],
        activityImg:[
          {actName:'限时活动',acttall:'每日10点限时秒杀',actBg:config.imgUrl+'/index/cuxiao0.jpg',pageUrl:'../discount/main'},
          {actName:'火爆拼团',acttall:'每日10点限时秒杀',actBg:config.imgUrl+'/index/cuxiao1.jpg',pageUrl:'../grouplist/main'},
          {actName:'分享砍价',acttall:'每日10点限时秒杀',actBg:config.imgUrl+'/index/cuxiao2.jpg',pageUrl:'../bargain/main'},
          {actName:'优惠券',acttall:'400减50',actBg:config.imgUrl+'/index/cuxiao3.jpg',pageUrl:'../coupon/main'}
        ],
        showSkeleton: false ,
        isMember:false,
        rilicatId:0,
        FrucatId:0,
        memberId:'',
        advertisingIndex:[] ,
        shopList:[],
        shopDetail:{},
        addr:{a:'2222'}
      } 
    },
    components: {
      skeleton,
      loginModel
    },
    async mounted(){
      let that=this
      that.getTopIndex()
      that.getseasonalCalendar()
      that.getadvertisingIndex()
      that.getLoca()
      that.$refs.loginModel.userLogin()
    },
    onShow(){
      wx.setStorageSync('addr','noaddr')
      this.shopDetail=wx.getStorageSync('shopDetail')
    },
    methods: {
      getLoca(){
        let that=this
        wx.getLocation({
         type: 'wgs84',
         success (res) {
          let myaddr=res
          api.getshopList().then(function(res){
            res.data=res.data.map((v)=>{
              let locaArr=v.location.split(',')
              v.distance=that.getDistance(myaddr.latitude,myaddr.longitude,locaArr[0],locaArr[1])
              return v
            })
            for(var i=0;i<res.data.length-1;i++){
              for(var j=i+1;j<res.data.length;j++){
               if(res.data[i].distance>res.data[j].distance){
                  var temp=res.data[i];
                  res.data[i]=res.data[j];
                  res.data[j]=temp;
                }
              }
            }
           that.shopList=res.data
           wx.setStorageSync('shopDetail',that.shopList[0])
          }).catch(function(reason){
              wx.showLoading({
                title: '网络错误',
              })
          });
         }
       })
      },
      jumpmore(catid){
      
      },
      changeShop(){
        wx.navigateTo({ url: '/pages/store/main'});
      },
      getDistance: function (lat1, lng1, lat2, lng2) {
        var rad1 = lat1 * Math.PI / 180.0;
        var rad2 = lat2 * Math.PI / 180.0;
        var a = rad1 - rad2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var r = 6378137;
        return parseInt(r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))) 
      },
      jumpshopInfo(goodsId){
        if(goodsId!=undefined){
          wx.navigateTo({ url: '/pages/shopInfo/main?goodsId='+goodsId });
        }
      },
      toPage(url){
        this.toNav(url)
      },
      async getseasonalCalendar(){
        let that=this
        let seasonalCalendarRes= await api.getseasonalCalendar()
        that.seasonalCalendarRes=seasonalCalendarRes.data.data
        that.rilicatId = seasonalCalendarRes.data.catId
        // console.log("查看数据12313213",that.seasonalCalendarRes)
      },
      async getTopIndex(){
        let that=this
        let indexTopRes = await api.getTopIndex()
        // console.log(indexTopRes.data);
        that.banner=indexTopRes.data.data.AdpicDoList;
 
        that.messageDoList=indexTopRes.data.data.messageDoList;
        that.hotgoodsList=indexTopRes.data.data.goodsList;
        wx.setStorageSync('indexdata', indexTopRes.data.message)
        console.log("查看商品信息",that.messageDoList,indexTopRes)
      },
      async getadvertisingIndex(){
        let that=this
        let getadvertisingIndexRes=await api.getadvertisingIndex()
        that.advertisingIndex=getadvertisingIndexRes.data.data.map((item)=>{
          let titleArry=item.movieName.split(',')
          item.bigTitle=titleArry[0]
          item.smallTitle=titleArry[1]
          return item
        })
    
        console.log(that.advertisingIndex,"查看数据asds",getadvertisingIndexRes)
        // that.advertisingIndex=getadvertisingIndexRes.data.data
        console.log(that.advertisingIndex)
      },
      toNav(url){
        wx.navigateTo({ url: url });
      },
    }
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

img{display: block;width: 100%;height: 100%}
.heightDiv{height: 48rpx;}
.header{padding: 10rpx 0 28rpx;border-bottom: 10rpx solid rgb(243,243,243);
  .search{
    img{width: 40rpx;height: 40rpx;vertical-align:middle;
   display:inline-block;}
    width: 100%;height: 65rpx;background: #f5f5f5;border-radius: 35rpx;font-weight: 100;font-size: 30rpx;text-align: center;line-height: 65rpx;}
}

 .tips{
  @include flexc;justify-content: space-between;font-size: 27rpx;font-weight: 100;color: rgb(170, 170, 170);height: 78rpx;padding: 0 15rpx;border-bottom: 6rpx solid rgb(243,243,243);
   .logo{height: 90%;display: inline-block;display: flex;align-items: center;}
   .logo img{width: 80rpx;height: 80rpx;}
   span{display: inline-block;width: 420rpx;overflow: hidden;text-overflow:ellipsis;
white-space: nowrap;}
   small{display: inline-block;margin-left: 6rpx;color: rgb(236,189,87);float: right;}
 }

.brand{
  .swiper{height: 320rpx;}
}

.news{@include flexc;height: 65rpx;padding: 0 10rpx;
  .shopImg{width: 160rpx;height: 100%;}
  small{display: inline-block;margin: 0 10rpx;padding:0 12rpx;border-radius: 20rpx;font-size: 22rpx;color: #fff;background: rgb(242,42,71)}
  .messageswiper{height: 50rpx;width: 440rpx;font-size: 0.8em;color:#8a8a8a;}
}

.hot{position: relative;height: 410rpx;margin-bottom: 10rpx;padding: 15rpx 20rpx;background: #f6f6f6;
 .hotBg{height: 410rpx; width: 94%;margin-left: 3%;position: absolute;left: 0;top: 15rpx;}
}
.hotList{position: absolute;bottom: 30rpx;width: 92%;display: flex;justify-content: space-around;align-items: flex-end;padding:0 10rpx;
  .hotItem{position: relative;width: 32%;height: 258rpx;text-align: center;background: #fff;border-radius: 10rpx;}
  .hotShop{width: 92%;height: 172rpx;margin: auto;padding: 15rpx 0;}
  .hotItem span{font-weight: 100;font-size: 30rpx;display: inline-block;margin: auto;color: #ccc;}
  .icoImg{position: absolute;top: 10rpx;left: 10rpx;width: 70rpx;height: 70rpx;}
}


.topimg{width: 306rpx;height: 90rpx;margin: auto;}


.actList{display: flex;justify-content: space-between;flex-wrap: wrap;padding: 0 15rpx;
  .actItem{width: 49%;height: 184rpx;position: relative;margin-bottom: 15rpx;border-radius: 10rpx;overflow: hidden;}
  .itembg{position: absolute;height: 100%;width: 100%;left: 0;top: 0;}
  .itemTile{position: relative;z-index: 2;padding-left: 16rpx;padding-top: 10rpx;line-height: 45rpx;
          text{font-size: 34rpx;font-weight: 500;}
          small{color:rgb(184, 184, 184);font-weight: 100;font-size: 24rpx;}
          }
}

.rili{position: relative;height: 380rpx;padding-top: 78rpx;;
  .riliBg{position: absolute;left: 0;top: 0;height: 100%;width: 100%;}
  .riliMore{position: relative;z-index: 2;@include flexc;justify-content: space-between;padding: 0 25rpx 8rpx;}
  .riliMore .time{font-weight: 300;font-size: 34rpx;}
  .riliMore .more{font-weight: 100;font-size: 26rpx;color: rgb(184, 184, 184);}
  .riliTitle{position: absolute;z-index: 2;width: 100%;text-align: center;font-weight: 100;font-weight: 36rpx;top: 25rpx;}
}

.riliPrice{position: absolute;z-index: 2;width: 250rpx;text-align: center;bottom: -12rpx;margin-left: 16rpx;background: rgba(0, 0, 0, 0.199);font-weight: 100;font-size: 30rpx;color: #fff;}

.liriWarp{position: relative;z-index: 2;margin:0 25rpx;border-top-left-radius: 20rpx;border-top-right-radius: 20rpx;
  .riliTop{display:flex;justify-content: space-around;align-items: center;padding: 10rpx 0 12rpx;}
  .riliTop span{color: #666;border-bottom: 3px solid red;font-weight: 100;font-size: 32rpx;}
}

.riliWarp{display: flex;
  .Item{height: 250rpx;position: relative;}
    .Item img{width: 250rpx;height: 250rpx;margin: 15rpx;border-radius: 10rpx;}
    .posIco{position: absolute;left: -8%;top: -5rpx;margin-left: 32rpx;}
    .posIco img{width: 95rpx;height: 75rpx;}
    .posIco text{font-size: 26rpx;color: #fff}
}

/*公用头部*/
.freeTop{padding: 25rpx 20rpx 15rpx;}
.freeTop span{font-size: 36rpx;}
.freeTop p{font-weight: 100;color: #8e8e8e;font-size: 25rpx;}

.free{padding: 0 20rpx;margin-bottom: 25rpx;
  .freeBrand{height: 215rpx;margin-bottom: 20rpx;}
}

.freeList{position: relative;height: 360rpx;
  .freeListBg{position: absolute;top: 0;left: 0;height: 100%;width: 100%;}
}
.scrollItem{white-space:nowrap;display:block;position: relative;z-index: 2;
  .freeItemWarp{@include flexc;}
  .freeItem{height: 310rpx;background: #fff;border-radius: 15rpx;margin: 10rpx;padding-top: 15rpx;}
  .freeItem img{height: 215rpx;width: 82%;margin: auto;}
  .freeInfo{width: 260rpx;@include fontM;font-size: 26rpx;color: rgb(175, 175, 175);padding: 0 12rpx;}
  .loadMore{width: 100rpx;background: #fff;height: 310rpx;text-align: center;color:#8a8a8a;}
}
.freeMore{font-size: 28rpx;color:#aaa9a9;text-align: center;font-weight: 100;
  i{color:rgb(231,177,59);margin-left: 8rpx;font-size: 32rpx;}
}

.loadMore{border-radius: 16rpx;overflow: hidden;}
.MoerImg{border-radius: 16rpx;}
.bottomBrand{height: 150rpx;}
.footer{height: 80rpx;padding: 20rpx 30rpx 10rpx 0;}

//Css3动画移动
@keyframes kf-marque-animation{ 0% { transform: translateX(0); } 100% { transform: translateX(-53.3%); } }
.contentWarp{
     width: 100%;
    height: 64rpx;
    line-height:64rpx;
    background: #fff;
    border: none;
    display: block;
    margin: 0 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
    position: relative;
    font-size: 28rpx;
    font-weight: 100;
}

.contentWarp .box-content{display: inline-block;position: relative;padding-right: 0px;animation: kf-marque-animation 6s linear infinite;
    white-space: nowrap;
}

.tag{display: inline-block;width: 70rpx;}

</style>

