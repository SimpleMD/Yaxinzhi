<template>
  <div class="WeiStart">
    <div class="header"><img :src="listImg.headerImg" mode='aspectFit'/></div>
    <!--header END-->

    <div class="List">
        <div class="Item" v-for="(item,index) in memberLvList" :index='index' :key='item'>
            <div class="itemTitle">{{item.name}}</div>
            <div class="itemInfo">开通会员享受更多优惠</div>
            <div class="tag"><span>会员身份VIP</span><span class="tagC">会员身份VIP</span><span>会员身份VIP</span></div>
            <div class="Btn" @click="toPage('../distribefrom/main?money='+item.point+'&ivid='+item.lvId)"><img :src="listImg.weiBtn"  mode='aspectFit'/><text>开通</text></div>
        </div>
    </div>
   <!--List END-->
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import Shopaddr from '@/components/shopaddr'
 import OrderList from '@/components/shopList'
 import formatTime from "@/utils/index"
 let api=new Api
export default {
  components: {
     OrderList,
     Shopaddr,
   
  },
  data () {
    return {
       listImg:{headerImg:config.imgUrl+'/distribe/headerImg.jpg',weiBtn:config.imgUrl+'/distribe/weiBtn.jpg',
       },
       memberLvList:[]
    }
  },
  methods:{
   async onLoads(){
        let that = this;
        let res = await api.MemberLvList()
        console.log("查看分销会员",res)
        that.memberLvList = res.data.memberLvList
    },
    
    toPage(url){
        wx.navigateTo({ url: url });
    }
  },
  async onLoad(){
    let that=this
    that.onLoads();
  
  }
}
</script>

<style scoped lang='scss'>
/*局部水平居中*/
@mixin flexc{
display: flex;align-items: center;
}

.d-flex{
    @include flexc;justify-content: center;
}
/*文本换行省略*/
@mixin fontM{
white-space:normal;overflow: hidden;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
}
img{display: block;height: 100%;width: 100%;}
.header{height: 310rpx;}

.List{
    div{text-align: center;}
    .itemTitle{font-weight: 600;font-size: 36rpx;color: #666;}
    .Item{font-size: 32rpx;font-weight: 100;color: rgb(121, 121, 121);border-bottom: 10rpx solid rgb(244,244,244);padding: 35rpx 0;}
    .tag{margin-top: 20rpx;}
    .tag span{display: inline-block;padding: 0 30rpx;font-size: 26rpx;}
    .tagC{border-left: 1px solid #ccc;border-right: 1px solid #ccc;}
}
.Btn{margin-top: 30rpx;position: relative;
   img{height: 47rpx;}
   text{position: absolute;top: 0rpx;left: 50%;display: block;margin-left: -35rpx;color: #fff;width: 70rpx;font-weight: 100;}
}



</style>
