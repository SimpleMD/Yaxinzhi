<template>
  <div class="ComWarp">

    <div class="listWarp">
        <scroll-view  lower-threshold="0" class="scroll" scroll-y bindscrolltolower="loadMore">
            <div class="btn" @click="OnClick"><text>产品分类</text> <i class="fa fa-angle-down" aria-hidden="true"></i></div>

            <div class="List">
                <div class="item" v-for="(item,index) in GoodsList" :index='index' :key='item' @click="toPage(item.goodsId)">
                    <div class="topImg"><img :src="item.thumbnail" /></div>
                    <div class="title fontHidden">{{item.name}}</div>
                    <div class="Price"><text>￥{{item.price}}</text><img :src="ImgList.fen"/></div>
                </div>
            </div>
        </scroll-view>
 
        <div class="ModelMask" v-show="modelShow" @click="Close"></div>
        <div class="Model" v-show="modelShow" :animation='Animation'>
            <div class="ModelTile" @click="Close"><text>产品分类</text> <i class="fa fa-angle-down" aria-hidden="true"></i></div>
            <div class="ModelWarp">
                <text v-for="(item,index) in Cars" :index='index' :key='item' @click="onCars(item.catId)">{{item.name}}</text>
            </div>
        </div>
        <!--model end-->
    </div>
<!--List end-->
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import Lib from "@/utils/lib"
 import config from "@/config"


 let api= new Api 
export default {
  components: {
  
  },

  data () {
    return {
     ImgList:{fruImg1:config.imgUrl+'/index/fruImg1.png', fen:config.imgUrl+'/distribe/fen.png',
                fruShop:config.imgUrl+'/index/fruilShop.jpg', },
     Animation:{},
     modelShow:false,
     GoodsList:[],
     Cars:[],
     limit:6,
     index:0,
     catId:''
    }
  },
  //事件
   methods:{
    async onLoads(){
        let that = this;
        let res = await api.DistribeGoods()
        that.GoodsList = res.data.goodsList

        let Cars = await api.Distribecats()
        that.Cars = Cars.data.cats

    },
    
    async onCars(catId){
        // console.log("asdsada",catId)
        // if()
        let that = this;
        let oldcatId =  that.catId
        that.catId = catId
        let params = {}

        if(oldcatId != catId){
           //判定第一次选项初始数据初始化
            params.offset = 0
            params.limit = 6
            params.catId = catId
        }else{
            params.offset = that.index
            params.limit = that.limit
            params.catId = that.catId 
        }
        Lib.Loading("请稍等")
        let carsList = await api.DistribeListGoods(params)
        if(carsList.data.code == 1){
           Lib.Show("暂无数据",'loading',1000)
        }else if(carsList.data.code == 0){
            if(oldcatId != catId){
                wx.hideLoading()
                that.GoodsList = carsList.data.page.rows
            }else{
                wx.hideLoading()
                that.GoodsList = that.GoodList.concat(carsList.data.page.rows) 
            }
        }
    },

    OnClick(){
        let that = this;
        let animation = wx.createAnimation({
            duration: 200, timingFunction: 'linear', delay: 100,  transformOrigin: 'left top 0',
            success: function(res) {
                console.log(res)
                }
        })
        animation.translateY(-300).step()
        that.Animation=animation.export()
        that.modelShow=true;
        setTimeout(function () {
            animation.translateY(0).step()
            that.Animation=animation.export()
        }.bind(that), 100)
    },
    Close(){
        let that = this;
        that.modelShow = false;

    },
    //跳转
    toPage(id){
        let that = this;
        console.log(id,"sdasd")
        wx.navigateTo({ url: '../shopInfo/main?goodsId='+id});
    }
    
  },
  //初始化加载
  onShow(){
   let that = this;

    //初始化商品
    that.onLoads();
  },

   //上拉事件
    onReachBottom:function(){
        console.log("666666")
        let that = this;
        that.index += 1
        that.onCars(that.catId)

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

.listWarp{padding-top: 15rpx; }
.ComWarp{min-height: 100vh;background: #f8f8f8;}

.List{@include flexc;justify-content: space-between;flex-wrap: wrap;margin: 20rpx 35rpx;
    .item{padding: 20rpx;margin-bottom: 20rpx;width: 42.5%;border-radius: 6rpx;background: #fff;box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.15);font-weight: 100;}
    .item .title{font-size: 30rpx;height: 92rpx;}
    .topImg{text-align: center;}
    .topImg img{height: 250rpx;width: 250rpx;margin: auto;}
    .Price{@include flexc;justify-content: space-between;margin-top: 20rpx;color: rgb(255,134,111);}
    .Price img{z-index: 3;width: 50rpx;height: 50rpx;}
}

.btn{@include flexc;justify-content: center;font-weight: 100;line-height: 58rpx;font-size: 28rpx;background: #fff;margin-top: 15rpx;
    width: 90%;border-radius: 25rpx;margin: auto;box-shadow: 0 0 25rpx rgba(0, 0, 0, 0.11)}
.ModelMask{position: fixed;top: 0;left: 0;height: 100vh;width: 100%;z-index: 2;background: rgba(0, 0, 0, 0.184);}
.Model{position: fixed;width: 100%;top: 0;left: 0;z-index: 3;background: #fff;border-bottom-left-radius: 20rpx;border-bottom-right-radius: 20rpx;}
.ModelTile{text-align: center;font-weight: 100;font-size: 28rpx;}
.ModelWarp{padding: 20rpx 0rpx;
   text{display: inline-block;padding: 10rpx 0;font-size: 32rpx;color: #666;width: 33.3%;text-align: center;}
} 


</style>
