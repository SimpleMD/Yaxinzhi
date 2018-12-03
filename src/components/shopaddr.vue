<template>
  <div class="addr">
   <div class="topImg"><img :src="topImg"/></div><text>{{shopname}}</text>
  </div>
</template>

<script>
import config from "@/config"
export default {
  props: ['shopname'],
  data () {
    return {
      topImg:config.imgUrl+'/cart/home.jpg'	
    }
    },
    methods: {
  		
    }
}
</script>

<style scoped lang='scss'>
img{
  width: 100%;
  height: 100%;
  display: block;
}
.addr{display: flex;align-items: center;
font-size: 27rpx;font-weight: 100;color: rgb(170, 170, 170);height: 78rpx;padding: 0 10rpx;border-bottom: 6rpx solid rgb(243,243,243);
   .topImg{height: 45rpx;width: 45rpx;margin-left: 10rpx;margin-right: 10rpx;}
   small{display: inline-block;margin-left: 6rpx;color: rgb(236,189,87);}
}
</style>
