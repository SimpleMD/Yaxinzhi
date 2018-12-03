<template>
  <div class="store">
      <div class="header">
         <div class="left"><img :src="ImgList.map01"/> 当前位置</div>
         <div class="right">
           <span><text>{{addressInfo}}</text>  <i class="fa fa-angle-right" aria-hidden="true"></i></span> 
         </div>
      </div>
    <!--header end-->
    <div class="title">附近门店</div>
    <!--title end-->
    <div class="storeList" v-for="(item,index) in shopList" :key="item" :index="index" @click="chooseshop(index)">
      <div class="storeTitle">{{item.shopName}}</div>
      <div class="info"><text class="fontHidden1">{{item.address}}</text>
          <div class="inforight">
             <span class="jili"><img :src="ImgList.juli"/><text>{{item.distance>1000?item.distance/1000+'km':item.distance+'m'}}</text></span>
             <span> <icon type="circle" color='rgb(252,153,47)'  size='20' v-if="icoBool" /><icon type="success" color='rgb(252,153,47)' size='20' v-else/></span>
          </div>
      </div>
    </div>
    <!--storeList end-->

  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import globalLoca from  '@/utils/qqmap-wx-jssdk'
 let api=new Api
export default {
  components: {

     
  },
   
  data () {
    return {
     ImgList:{map01:config.imgUrl+'/address/map01.png',juli:config.imgUrl+'/address/juli.png'},
     icoBool:true,
     addressInfo:'',
     shopList:[],
     shopDetail:{}
    }
  },
  methods:{
    onLoadMap(){
      let that = this;
      var qqmapsdk = new globalLoca.QQMapWX({
        key: 'ARCBZ-73GW6-EEQS3-EPCSS-6Z6OJ-ONFUQ' // 必填
       });
         //1、获取当前位置坐标
      wx.getLocation({
          type: 'wgs84',
            success: function (res) {
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
              that.shopDetail=that.shopList[0]
            }).catch(function(reason){
              wx.showLoading({
                title: '网络错误',
              })
            });
              //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
              qqmapsdk.reverseGeocoder({
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                success: function (addressRes) {       
                  var address = addressRes.result.address_component.city;
                  that.addressInfo = addressRes.result.address
                }
              })
            }
        })
    },
    chooseshop:function(index){
      let that=this
      wx.setStorageSync('shopDetail',that.shopList[index])
      wx.navigateBack({
        delta: 1
      })
    },
    getDistance: function (lat1, lng1, lat2, lng2) {
      var rad1 = lat1 * Math.PI / 180.0;
      var rad2 = lat2 * Math.PI / 180.0;
      var a = rad1 - rad2;
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
      var r = 6378137;
      return parseInt(r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))) 
    },
  },
  mounted(){
   this.onLoadMap();
  },
  
  created () {
   
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
img{display: block;height: 100%;width: 100%;}

.header{@include flexc;justify-content: space-between;padding: 15rpx 20rpx;font-weight: 100;font-size: 32rpx;border-bottom: 1px solid rgb(249,249,249);
   .right{}
   .right text{color: rgb(252,153,47);font-size: 28rpx;padding-right: 15rpx;}
   .left{@include flexc;color: #666;}
   .left img{width: 45rpx;height: 55rpx;margin-right: 10rpx;}
}

.storeList{padding: 20rpx;border-bottom: 1px solid rgb(249,249,249);color: #666;font-size: 34rpx;}
.info{@include flexc;justify-content: space-between;font-size: 28rpx;color: #8e8e8e;
  .fontHidden1{width: 70%;justify-content: space-between;}
  .inforight{@include flexc;}
  .jili{@include flexc;margin-right: 20rpx;}
  .jili img{width: 40rpx;height: 40rpx;margin-right: 10rpx;}
  .jili text{font-size: 26rpx;}
}

.title{padding: 10rpx 25rpx;color: #666;font-size: 32rpx;border-bottom: 1px solid rgb(249,249,249);}


</style>
