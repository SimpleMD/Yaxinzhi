<template>
  <div class="distriBePay">
     <div class="List">
        <div class="Item" @click="change(1)"><text>待打款提现申请</text> 
          <i class="fa fa-angle-down" aria-hidden="true" v-if="indexSelect == 1"></i>
          <i class="fa fa-angle-right" aria-hidden="true" v-else></i>
        </div>
        <div class="ItemWarp" v-show="indexSelect == 1">
          <div class="WarpItem" v-for="(item,index) in statusNo" :index='index' :key='item'>
            <text>{{item.withdrawId}}</text> <text>{{item.amount}}元</text><text>{{item.withdrawTime}}</text>
          </div>
        </div>

        <div class="Item"  @click="change(2)"><text>已打款提现申请</text> 
          <i class="fa fa-angle-down" aria-hidden="true" v-if="indexSelect == 2"></i>
          <i class="fa fa-angle-right" aria-hidden="true" v-else></i>
         
        </div>
          <div class="ItemWarp" v-show="indexSelect == 2">
            <div class="WarpItem" v-for="(item,index) in statusFail" :index='index' :key='item'>
            <text>{{item.withdrawId}}</text> <text>{{item.amount}}元</text><text>{{item.withdrawTime}}</text>
            </div>
          </div>

        <div class="Item" @click="change(3)"><text>无效提现申请</text> 
          <i class="fa fa-angle-down" aria-hidden="true" v-if="indexSelect == 3"></i>
          <i class="fa fa-angle-right" aria-hidden="true" v-else></i>
        </div>
          <div class="ItemWarp" v-show="indexSelect == 3">
            <div class="WarpItem" v-for="(item,index) in statusSucceed" :index='index' :key='item'>
            <text>{{item.withdrawId}}</text> <text>{{item.amount}}元</text><text>{{item.withdrawTime}}</text>
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
           item01:config.imgUrl+'/distribe/item01.png',item02:config.imgUrl+'/distribe/item02.png',
           item03:config.imgUrl+'/distribe/item03.png',
       },
    memberId:'',
    statusNo:[],
    statusFail:[],
    statusSucceed:[],
    indexSelect:0
    }
  },
  methods:{
     async onLoads(){
         let that = this;
         let res = await api.AccountManagement(that.memberId)
         that.statusNo = res.data.statusNo;
         that.statusFail = res.data.statusFail
         that.statusSucceed = res.data.statusSucceed
     },
     change(index){
       let that = this;
       that.indexSelect = index
     }

  },
   onLoad(options) {
     let that = this;
     that.memberId = wx.getStorageSync('memberId')
     
    //初始化请求数据
    that.onLoads();
  }
}
</script>

<style scoped lang='scss'>
@mixin flexc{
    display: flex;align-items: center;
}

img{display: block;height: 100%;width: 100%}

.distriBePay{padding-top: 1rpx;height: 100vh;background: #f6f6f6;
  .List{background: #fff;}
  .List .Item{@include flexc;justify-content:space-between;padding: 35rpx;border-bottom: 1px solid #f6f6f6;}
  .Item text{font-weight: 100;font-size: 32rpx;}
}

.ItemWarp{background: #f8f8f8;}
.WarpItem{@include flexc;justify-content: space-around;padding: 15rpx;
  text{font-size: 30rpx;font-weight: 100;}
}

</style>
