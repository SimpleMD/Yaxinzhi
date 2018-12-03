<template>
  <div class="address">
     <div class="item"><text>收货人</text><input type="text" placeholder="请输入收货人" placeholder-style='font-size:26rpx;font-weight: 100;color:#8e8e8e;' v-model="username"/></div> 
     <div class="item"><text>手机号码</text><input type="text" placeholder="请输入手机号码" placeholder-style='font-size:26rpx;font-weight: 100;color:#8e8e8e;' v-model="userphone" /></div> 
     <div class="item itemModel"><text>所在地区</text><span @click="selectAddress">请选择地区</span></div> 
       <div class="AddressModel">
            <textarea placeholder='请选择地址' :value='addres'   placeholder-style='font-size:26rpx;font-weight: 100;color:#8e8e8e;' v-model="addr"></textarea>
       </div>
    <div class="item"><text>详细地址：</text><input type="text" :value="addresInfo" placeholder="门牌号、街区号、单元号楼层" placeholder-style='font-size:26rpx;font-weight: 100;color:#8e8e8e;' v-model="detailaddr"/></div> 
    <div class="ico">
      <span>默认收货地址</span> <switch :checked="switch1Checked" @change="switch1Change" color='#F44156'/></div>
    <div class="SubBtn" @click="addAddress"><text>{{tip}}</text></div>
  </div>
</template>

<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import Barlist from "@/components/bargainlist"
let api=new Api
export default {
  components: {
    Barlist
  },

  data () {
    return {
          switch1Checked: false,
          addresInfo:'',
          isDeafult:0,
          username:'',
          userphone:'',
          addr:'',
          detailaddr:'',
          memberId:'',
          Type:'',
          tip:'新增地址',
          addrId:''

    }
  },
 methods:{
    //switch点击事件
    switch1Change(e){
      this.isDeafult=e.mp.detail.value ? 1:0
    },
    //selectAddress选择地址
    selectAddress(){
      let that = this;
      wx.chooseLocation({
        success: function (res) {
          that.addr = res.address;
        }
      })
    },
    async addAddress(){
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      let that=this
      if(that.username==''){
        wx.showToast({
          icon:'none',
          title: '用户名不能为空',
        })
      }
      else if(!myreg.test(that.userphone)){
        wx.showToast({
          icon:'none',
          title: '手机号格式不正确',
        })
      }
      else if(that.addr==''){
        wx.showToast({
          icon:'none',
          title: '地址不能为空',
        })
      }
      else if(that.detailaddr==''){
        wx.showToast({
          icon:'none',
          title: '详细地址不能为空',
        })
      }
      else{
        let parms = {}
        let address = {} 
        parms.memberId = that.memberId
        address.memberId = that.memberId
        address.defAddr = that.isDeafult
        address.name = that.username
        address.mobile = that.userphone
        address.addr = that.addr
        address.region = that.detailaddr
        address.province = ''
        address.city = ''
        parms.address=address
        if(that.Type=='edit'){
         address.addrId= that.addrId 
          let editAddr=await api.editAddr(parms)
          if(editAddr.data.code==0){
           wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500
          })
         }
        }
        else{
         let addrresRes=await api.addAddress(parms)
         if(addrresRes.data.code=='0'){
           wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500
          })
         }
        }
        wx.navigateBack({
          delta: 1
        })
        //  wx.navigateTo({
        //   url: '../addressList/main',
        // })
      }

    },
    async getAddrById(addrId){
      let that=this
     let addrDetail=await api.getAddrById(addrId)
     if(addrDetail.data.code==0){
      console.log(addrDetail.data)
      that.addrId = addrDetail.data.getaddr.addrId
      that.username=addrDetail.data.getaddr.name
      that.userphone = addrDetail.data.getaddr.mobile
      that.addr = addrDetail.data.getaddr.addr
      that.detailaddr = addrDetail.data.getaddr.region
      that.switch1Checked=addrDetail.data.getaddr.defAddr==1?true:false
     }
   
    }
 },
  onLoad(options) {
    let that=this
    that.memberId = wx.getStorageSync('memberId')
    if(options.addrId!=undefined){
      that.getAddrById(options.addrId)
      that.Type='edit'
      that.tip="修改地址"
      wx.setNavigationBarTitle({
       title: "修改地址"//页面标题为路由参数
     })
    }
    else{
      that.addrId = ''
      that.username=''
      that.userphone = ''
      that.addr = ''
      that.detailaddr = ''
      that.switch1Checked=false 
    }
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

.input-placeholder{font-size:20rpx;font-weight: 100;color:#8e8e8e;}
input,textarea{font-size: 32rpx;font-weight: 100;color: #000;}
.address{
    .item{@include flexc;font-size: 32rpx;font-weight: 100;padding: 10rpx 20rpx;}
    .item text{width: 25%;}
    .item input{width: 75%;}

}

.itemModel{justify-content: space-between;
 span{font-size: 26rpx;color: #fff;background:rgb(252,154,47);border-radius: 26rpx;padding: 0 10rpx;}
}
.ico{display: flex;justify-content: space-between;padding: 10rpx 20rpx;font-size: 32rpx;}

.SubBtn{text-align: center;margin-top: 30rpx;
    text{display: inline-block;background: rgb(252,154,47);color: #fff;width: 90%;text-align: center;line-height: 80rpx;line-height: 80rpx;border-radius: 50rpx;}
}

.AddressModel{padding: 10rpx 30rpx;
    textarea{width: 100%;height: 75rpx;}
}


</style>
