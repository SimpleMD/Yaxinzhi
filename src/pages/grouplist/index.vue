<template>
  <div class="group">
    <div class="banner" v-if="Gallery.length==1">
    <img :src="Gallery[0].imageUrl"  mode="widthFix">
  </div>
  <div class="header" v-if="Gallery.length!=1">
   <swiper class="swiper" indicator-dots='true' autoplay='true'>
    <swiper-item v-for="(item,index) in Gallery" :key="item" :index="index"><img :src="item.imageUrl" mode="widthFix"></swiper-item>
  </swiper>
</div> 
   <Grouplist  :group_item="group_item"></Grouplist> 
   <div class="none" v-if="group_item.length==0">
    <div class="noneImg">
       <img :src="none">
    </div>
    <div class="tip">暂无数据</div>
   </div>
  </div>
</template>

<script>
import Api from "@/utils/Api";
import Grouplist from '@/components/grouplist'
import config from "@/config"
export default {
  data() {
    return {
      group_item:[],
      Gallery:[],
      none:config.imgUrl+'/group/none.png'
    }
  },
  async mounted(){
    let that=this
    let api= new Api 
    let res=await api.getGroupList()
    res.data.collageList=res.data.collageList.map((v)=>{
     let splitArry= v.productName.split('|')
     v.productName=splitArry[0];
     v.productSpace=splitArry[1]
     return v
    })
    that.group_item=res.data.collageList
    console.log(that.group_item);
    that.Gallery=res.data.adList
    console.log(that.Gallery);
  },
  components: {
   Grouplist,
  },
  methods: {

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
  width: 100%;
  margin: 20rpx auto;
  border-radius: 15rpx;
}
.none{
  width: 100%;
}
.noneImg{
  width: 200rpx;
  height: 200rpx;
  overflow: hidden;
  margin: 30rpx auto;
}
.tip{
  text-align: center;
  color: #ccc
}
</style>

