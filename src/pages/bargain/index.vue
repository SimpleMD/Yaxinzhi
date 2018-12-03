<template>
  <div class="bargain">
     <div class="banner" v-if="Gallery.length==1">
      <img :src="Gallery[0].imageUrl"  mode="widthFix">
    </div>
    <div class="header" v-if="Gallery.length!=1">
     <swiper class="swiper" indicator-dots='true' autoplay='true'>
      <swiper-item v-for="(item,index) in Gallery" :key="item" :index="index"><img :src="item.imageUrl" mode="widthFix"></swiper-item>
    </swiper>
  </div> 
  <Barlist :Shop_item='cutList'></Barlist>
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import Barlist from "@/components/bargainlist"
let api= new Api 
export default {
  components: {
    Barlist
  },

  data () {
    return {
     cutList:[],
     Gallery:[]
    }
  },
   async onLoad(){
    let that=this
    let cutlistRes=await api.getCutlist()
    console.log(cutlistRes.data)
    that.cutList=cutlistRes.data.cutList
    that.Gallery=cutlistRes.data.adList


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
.header{

}



</style>
