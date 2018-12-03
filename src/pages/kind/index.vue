<template>
<div class="kind">
  <div style="height:7vh">
    <Tab :find_item="find_item"  @listenToChild="fromChild" :wid="width"></Tab>
  </div>
  <scroll-view style="height: 93vh;" scroll-y='true' @scrolltolower='getMore' @scroll="pageScroll" :scroll-top="scrollTop">
    <div class="banner" @click="jumpGooddetail(find_item[indexdata].goodsId)">
      <img :src="find_item[indexdata].image" mode="widthFix">
    </div>  
    <Goodlist :good_item="shopitem" :toView="toView"></Goodlist>
  </scroll-view>
</div>
</template>

<script>
import Tab from '@/components/tab';
import Api from "@/utils/Api"
import Goodlist from '@/components/goodlist';
import config from "@/config"

let api=new Api
export default {
  components: {
   Tab,
   Goodlist
  },

  data () {
    return {
     find_item:[{image:''}],
     gooditem:[],
     shopitem:[],
     current:0,
     goodlength:0,
     index:0,
     scrollTop:0,
     temp:[],
     gooditemIndex:0,
     width:'25%',
     indexdata:0
    }
  },
  methods:{
    async fromChild(data){
      var that=this
      that.indexdata=data;
       that.shopitem=[]
       that.find_item=that.find_item.map((item)=>{
         item.selected=false;
         return item
        })
        
       that.find_item[data].selected=true
      if(that.gooditem[data]==undefined){
        let moreKindRes=await api.getGoodsAll(that.find_item[data].catId)
        that.gooditem[data]=moreKindRes.data.Goods  
        that.shopitem=moreKindRes.data.Goods   
      }
      else{
        that.shopitem=that.gooditem[data]
      }   
    },
    jumpGooddetail(goodsId){
      let that = this;
      if(goodsId!=undefined){
        wx.navigateTo({ url: '/pages/shopInfo/main?goodsId='+goodsId });
      }
    }
     // async getMore(){
     //    let that=this
     //    wx.showLoading({  
     //    title: '玩命加载中',  
     //    })  
     //    console.log(that.gooditemIndex)
     //    that.gooditemIndex+=1
     //    let moreKindRes=await api.getGoodsAll(that.find_item[that.gooditemIndex].catId)
     //    that.goodlength=moreKindRes.data.Goods.length
     //    that.gooditem[that.gooditemIndex]=moreKindRes.data.Goods
     //    wx.hideLoading();
     //    console.log(that.gooditem)
     //  }, 
      // pageScroll(e){
      //   let that=this
      //   let index=0
      //   let topAll=0
      //   for(var i in that.gooditem){
      //     that.temp[i]=(that.gooditem[i].length*138+110)  
      //   }
      //   console.log(that.temp)
      //   for(var j in that.temp){
      //     topAll+=that.temp[j]
      //     if(topAll>e.mp.detail.scrollTop){
      //       index=j
      //       break
      //     }
      //   }
      //   if(index!=that.index){
      //     that.index=index
      //     that.find_item=that.find_item.map((item)=>{
      //      item.selected=false
      //      return item
      //     })
      //     // if(that.index*103.5>310){
      //     //   that.scrollLeft=(that.index-2)*103.5
      //     // }
      //     // else{
      //     //    that.scrollLeft=0
      //     // } 
      //     that.find_item[that.index].selected=true
      //   }
      //   // for(var j in )
      //   // if(e.mp.detail.scrollTop>100*(that.goodlength-5)){
      //   //   console.log("加载了下一个类别")
      //   // }
      // }
  },
  async onShow() {
    let that=this
    let kindRes=await api.getGoodKind()
    that.find_item=kindRes.data.GoodCatAll.map((item)=>{
       item.selected=false;
       return item
    })
          console.log("商品分类123",that.shopitem,kindRes)
    that.goodlength=that.find_item.length
    that.gooditem[0]=kindRes.data.Goods
    that.shopitem=kindRes.data.Goods
    // that.temp[0]=(that.gooditem[0].length*138+110)
    that.find_item[0].selected=true

    console.log("查看商品信息",that.find_item)
  }
}
</script>

<style scoped lang='scss'>
img{
  width: 100%;
  height: 100%;
  overflow:hidden;
}
.banner{
 
  margin: 0rpx auto;
  border-radius: 15rpx;
  .banner img{
    width: 100%;
    display: block;
  }
}

</style>