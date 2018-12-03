<template>
  <div class="bargain">
     <Tabs :find_item='Tabs' @listenToChild='onselect' :wid='width' ></Tabs>

     <div class="ListWarp">
         <div class="Item" v-for="(item,index) in VoucherMap" :index='index' :key='item'>
             <div class="title fontHidden1">{{item.voucherName}}(满{{item.conditionAmount}}可用) </div>
             <div class="info">有效时间 <text>{{item.begintime}}</text>-<text>{{item.endtime}}</text></div>
             <div class="btn"><span>{{item.faceValue}}元优惠券</span> <text @click="Linqu(item.voucherId)">{{btnName}}</text> </div>
             <div class="tag">ps：此劵不参加拼团、限时、砍价、和特价产品</div>
         </div>
     </div>
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import Lib from "@/utils/lib"
 import config from "@/config"
 import Discountlist from "@/components/discountlist"
 import Tabs from "@/components/tab"
 import formatTime from "@/utils/index"

 let api=new Api
export default {
  components: {
    Discountlist,
    Tabs
  },

  data () {
    return {
          ImgList:{brand:config.imgUrl+'/group/header01.jpg',ShopImg:config.imgUrl+'/cart/shopimg01.jpg',
          },
          Tabs:[{name:'待领取',selected:true},{name:'未使用',selected:false},{name:'已使用',selected:false},{name:'已过期',selected:false}],
          width:'25%',
          VoucherMap:[],
          conList:[],
          btnName:'去领取',
          tu:'',
          memberId:'',
          memberIdlvId:''
    }
  },
  methods:{
   //选项点击加载   
  async onselect(index){
     console.log("序号",index)
        let that = this;
        that.Tabs=that.Tabs.map((item)=>{
            item.selected=false;
            return item
        })
        that.Tabs[index].selected=true
        if(index == 0){
            that.btnName = "去领取"
            that.onCoupon(index)
        }else if(index == 1){
            that.btnName = "点击使用"
            let datas = {
                memberId:that.memberId,
                state:2,
                isend:2
            }
            that.Used(index,datas)
        }else if(index == 2){
            that.btnName = "已使用"
            let datas = {
                memberId:that.memberId,
                state:1
            }
            that.Used(index,datas)
        }else if(index == 3){
            that.btnName = "已过期"
            let res = await api.CloseCoupont(that.memberId)
            that.VoucherMap = res.data.VoucherMap.map(v =>{
                v.begintime = formatTime.formatTime(v.begintime)
                v.endtime = formatTime.formatTime(v.endtime)   
                return v
            })
        }
   },

  async onCoupon(index){
       let that = this;
        let res = await api.onCoupont(that.memberIdlvId)
        that.VoucherMap = res.data.VoucherMap.map(v =>{
            v.begintime = formatTime.formatTime(v.begintime)
            v.endtime = formatTime.formatTime(v.endtime)   
            return v
        })
        that.conList[index] = that.VoucherMap
        console.log(" 输出优惠券",that.VoucherMap)
     
   },
   
   //tab选项卡请求
   async Used(index,datas){
        console.log("参数显示",datas)
        let that = this;
         let res = await api.LiquCoupont(datas)
         that.VoucherMap = res.data.VoucherMap.map(v =>{
            v.begintime = formatTime.formatTime(v.begintime)
            v.endtime = formatTime.formatTime(v.endtime)   
            return v
         })
         that.conList[index] = that.VoucherMap
         console.log("我有优惠券",that.conList)
  
   },

   //领取优惠券
   async Linqu(voucherId){
       let that = this;  
       let res = await api.LiquCouponts(that.memberId,voucherId)
       if(res.data.code == 1){
         that.tu = 2
         Lib.Show("领取次数已达上限","领取次数已达上限",1000)
       }else{
         that.tu = 1
         Lib.Show("领取成功","领取成功",1000)
       }
   }
  },
  async onLoad() {
    let that=this;
    that.memberId = wx.getStorageSync('memberId')
    that.memberIdlvId = wx.getStorageSync('memberIdlvId')
    that.onCoupon();

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

.ListWarp{margin: 15rpx 0;
 .Item{margin: 25rpx;box-shadow: 0 0 35rpx rgba(0, 0, 0, 0.15);font-weight: 100;padding: 25rpx;}
 .title{font-size: 32rpx;margin-bottom: 15rpx;}
 .info,.tag{font-size: 26rpx;color: #8e8e8e;}
 .btn{@include flexc;justify-content:space-between;}
 .btn span{font-size: 32rpx;color: rgb(252,153,47);}
 .btn text{display: inline-block;padding: 6rpx 15rpx;height: 40rpx;font-size: 26rpx;border-radius: 15rpx;line-height: 40rpx;text-align: right;
       border-bottom: 1px dashed rgba(0, 0, 0, 0.13);background: rgb(252,153,47);color: #fff;
 }
}


</style>
