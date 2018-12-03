<template>
  <div class='mode' v-if="isMember">
    <div class='bcg'></div>
    <div class='loginmodel'>
      <div class='title'>需要您的授权</div>
      <div class='modeltip'>为了提供更好的服务请在稍后的提示框中点击允许</div>
      <button class='modelbtn' open-type="getUserInfo" @click="getUserInfo" @getuserinfo="bindGetUserInfo">我知道了</button> 
    </div> 
  </div>
</template>

<script>
  import Api from "@/utils/Api";
let api=new Api
export default {
  props: [],
  data () {
    return {
       isMember:false,
    }
    },
    mounted(){
 
    },
    methods: {
    getUserInfo(){   
      var that = this 
      if(that.memberId=="00"){
       wx.login({
        success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {         
             wx.getUserInfo({
              success: function (res_user) {
                console.log(res_user)
                api.weCatLogin(res.code,res_user.userInfo.avatarUrl,res_user.userInfo.nickName,res_user.userInfo.gender,res_user.userInfo.country,res_user.userInfo.province,res_user.userInfo.city).then(function(res){
                  if(res.data.code==0){
                    that.isMember=false
                    that.userLogin()
                  }
                }) 
              }
            }) 
           }
         }
       })
     }
   },
    async userLogin(){
        let that=this
        wx.showLoading({
          title: '加载中',
        })
       let memberRes=await api.getCode()
       wx.hideLoading()
       if (memberRes.data.memberDo != null) {
        wx.setStorageSync('memberId', memberRes.data.memberDo.memberId)
        wx.setStorageSync('point', memberRes.data.memberDo.point)
        wx.setStorageSync('memberIdlvId', memberRes.data.memberDo.lvId)
        wx.setStorageSync('isAgent', memberRes.data.memberDo.isAgent)
        wx.setStorageSync('uname', memberRes.data.memberDo.uname)
        wx.setStorageSync('face', memberRes.data.memberDo.face)
        wx.setStorageSync('openId',memberRes.data.memberDo.openId)
        wx.setStorageSync('advances',memberRes.data.memberDo.advance)
        // that.memberId=memberRes.data.memberDo.memberId
        // if(that.loginType=='C'){
        //      let friendCollageRes=await api.friendCollage(that.pingtuandetail.memberCollageId)
        //      if(friendCollageRes.data.code==0){
        //       // 说明可以参团并且获取拼团成功数据
        //       that.collageSucceed(that.pingtuandetail.productId,that.pingtuandetail.memberCollageId)     
        //     }
        //     else{
        //      wx.showToast({
        //        title: "团人数已满！",
        //        icon: "success",
        //        durantion: 2000
        //      })
        //      that.canJoin=false   
        //    }
        //  }else if(that.loginType=='K'){
        //   // 判断是否已经砍价
        //   that.params.helpMemberId = that.memberId;
        //   api.isHelp(that.params).then(function(res){
        //     if(res.data.code==200){
        //       if(res.data.cutData.isSuccess==1){

        //       }
        //     }
        //   })
        //  }
       



        }
        else {
          let memberId="00"
          that.memberId=memberId
          wx.setStorageSync('memberId', "00")
          that.isMember=true
          console.log(that.isMember);
        }
      },
    }
}
</script>

<style  scoped lang='scss'>
/* 登录模态框 */
.mode{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}
.bcg{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
}
.loginmodel{
  border-radius:10rpx; 
  width: 60%;
  height: 260rpx;
  background: #fff;
  position: absolute;
  top: 500rpx;
  left: 20%;
}
.title{
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
}
.modeltip{
  width: 90%;
  margin: 0 auto;
  font-size: 0.8em;
  text-indent: 20px;
  color: #8a8a8a;
  height: 100rpx;
}
.modelbtn{
  border: none;
  outline: 0;
  text-align: right;
  background: #fff;
  color: #3494ff
}
button::after {
  border: none;
}

</style>