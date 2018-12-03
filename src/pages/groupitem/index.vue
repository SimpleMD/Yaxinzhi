<template>
  <div class="groupitem">
    <div class="tab"><Tabs @listenToChild="fromChild" :find_item='find_item' :wid='width'></Tabs></div>
    <div class="box">
      <div class='boxlist' v-for="(item,index) in mytuanData" :key="key" :index="index">
        <div class="time">{{item.collageStarttime}}</div>
        <div class="spell-down" @click='pin'>
          <div class="spell-left">
            <image :src="item.thumbnail"></image>
          </div>
          <div class="spell-right">
            <div class="spell-top">
              <text class='spelltext'>{{item.goodsName}}</text>
            </div>
            <div class=" spell-bottom">
              <div class="spe-left">
                <text class=" spetext-one">￥{{item.activityPrice}}</text>
                <text class=" spetext-two">￥{{item.goodsPrice}}</text>
              </div>
              <block v-if="item.isCollage==0">
                <div class="spell-btn" style="color:#ccc">
                  拼团失败
                </div>
              </block>
              <block v-if="item.isCollage==1">
                <div class="spell-btn" style="color:red">
                  拼团成功
                </div>
              </block>
              <block v-if="item.isCollage==2">
                <div class="spell-btn" style="color:#59d867">
                  等待拼团
                </div>
              </block>
            </div>
            <div class="collage">
              <div class="total">{{item.collagePersons}}人团</div>
              <div class="need">还差{{item.shortPerson}}人成团</div>
            </div>
          </div>
        </div>
        <div class='clustering'>
          <div class='clustering-left'></div>
          <div class='clustering-right'>
            <div class='btn-details'  @click='jumpGroup(index)'>拼团详情</div>
          <!-- <block wx:if="{{item.isCollage==0}}">
            <button class='btn-attend' @click='qing'>再次开团</button>
          </block>
          <block wx:if="{{item.isCollage==1}}">
            <button class='btn-attend' @click='qing'>再次开团</button>
          </block>
          <block wx:if="{{item.isCollage==2}}">
            <button class='btn-attend' open-type='share'>邀请好友</button>
          </block> -->
        </div>
      </div>
    </div>
  </div>

  <div class="ordercontentno" v-if="mytuanData.length==0">
    <image :src="nothingimg"></image>  
  </div>
</div>
</template>

<script>
 import Api from "@/utils/Api"
 import config from "@/config"
 import Tabs from "@/components/tab.vue"
 import formatTime from "@/utils/index"
 let api=new Api
export default {
  components: {
    Tabs
  },

  data () {
    return {
    find_item:[{name:"全部",selected:true},{name:"等待拼团",selected:false},{name:"拼团成功",selected:false},{name:"拼团失败",selected:false}],
    width:"25%",
    mytuanData:{},
    memberId:''
    }
  },
  methods:{
    jumpGroup(index){
      let that=this
     let pingtuanObj = that.mytuanData[index]
     let params = {}
     params.price = pingtuanObj.goodsPrice
     params.activityPrice = pingtuanObj.activityPrice
     params.goodsId = pingtuanObj.goodsId
     params.productId = pingtuanObj.productId
     params.goodsName = pingtuanObj.goodsName
     params.iscollage = pingtuanObj.isCollage
     params.memberCollageId = pingtuanObj.memberCollageId
     params.img = pingtuanObj.thumbnail
     params.shortPerson = pingtuanObj.shortPerson
     params.collageGoodsId = pingtuanObj.collageGoodsId
     params= JSON.stringify(params)
      wx.navigateTo({
        url: '../group/main?shops= ' + params,
      })
    },
   //选项点击加载   
    async fromChild(data){
      var that=this
      that.indexdata=data;
       that.shopitem=[]
       that.find_item=that.find_item.map((item)=>{
         item.selected=false;
         return item
        })
       that.find_item[data].selected=true
       switch(data){
        case 0:
        that.getcollage(3)
        break;
        case 1:
        that.getcollage(2)
        break;
        case 2:
        that.getcollage(1)
        break;
        case 3:
        that.getcollage(0)
        break;
       }
    },
    async getcollage(collageType){ 
    let that=this;
    api.allMemberCollage(that.memberId,collageType).then(function(allMemberCollageRes){
      allMemberCollageRes.data=allMemberCollageRes.data.map((v)=>{
        v.collageStarttime=formatTime.formatTime(v.collageStarttime)
        return v
      })
      that.mytuanData=allMemberCollageRes.data 
     })  
    }
  },
  async onLoad() {
    let that=this
    that.memberId = wx.getStorageSync('memberId')
    that.getcollage(3)
  }
}
</script>

<style scoped lang='scss'>
.box{
  min-height: 93vh;
  background: #f4f4f4;
  width: 100%;
  padding-top: 10rpx;
  box-sizing: border-box;
}
.boxlist{
  width: 95%;
  margin: 10rpx auto;
}
.time{
  background: #fff;
  color:#8e8e8e;
  font-size: 0.8em;
  padding: 5rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid #eee;
}
.collage{
  display: flex;
  font-size: 0.8em;
}
.total{
  background:linear-gradient(to right,#f8784b,#ef3e44);
  width: 120rpx;
  height:50rpx;
  line-height: 50rpx;
  text-align: center;
  color:#fff;
  border-radius: 25rpx 0rpx 25rpx 25rpx;
  margin-right: 20rpx;
}
.need{
  color:#fc9632;
}
image{
  width: 100%;
  height: 100%;
  display: block;
}
.ordercontentno{
  width: 400rpx;
  height: 400rpx;
  margin: 100rpx auto;
  margin-bottom: 0rpx;
}
.ordertip{
  margin-top: 20rpx;
  text-align: center;
  color:#8A8890;
}
.spell-down{
  background: #fff;
  height: 200rpx;
  display: flex;
  justify-content: space-between;
}
.spell-left{
  width: 200rpx;
  height: 200rpx;
  padding:20rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.spelltext{
  display:-webkit-box;
word-break:break-all;
text-overflow:ellipsis;
overflow:hidden;
-webkit-box-orient:vertical;
-webkit-line-clamp:2;

}
.spot{
  width: 80rpx;
  height: 80rpx;
  background: #ff4546;
  color: #fff;
  border-radius: 50%;
  font-size: 28rpx;
  text-align: center;
  line-height: 80rpx;
  position: absolute;
  left: 20rpx;
  top: 18rpx;
}
.spell-right{
 padding: 10rpx 0;
 display: flex;
 flex-direction: column;
 flex: 1;
 justify-content: space-around;
}

.spell-top{
  width: 70%;
  /* height: 100rpx; */
  font-size: 32rpx;
}
.spell-conten{
  width: 30%;
  font-size:30rpx;
  color: #2f96fd;
}
.spell-bottom{
  height: 80rpx;
  line-height: 80rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.spetext-one{
 font-size: 32rpx;
 color: red;
}
.spetext-two{
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #ccc;
  text-decoration:line-through;
}
.spell-btn{
  width: 35%;
  font-size: 30rpx;
  color: #59d867;
}

.spe-left{
 width:56%;
}
/*订单喊人按钮 */
.clustering{
height: 100rpx;
background: #fff;
display: flex;
justify-content: center;
align-items: center;
border-top:1rpx solid #eee;
}
.clustering-left{
width: 43%;
margin-left: 20rpx;
font-size:30rpx;
}
.clustering-left text{
 color: #ff3e3f;
}
.clustering-right{
width: 57%;
padding-left:20rpx;
box-sizing: border-box; 
align-items: center;
}
.btn-details{
width: 40%;
height: 60rpx;
font-size: 28rpx;
text-align: center;
line-height:58rpx;
border: 2rpx solid #b4b4b4;
border-radius: 45rpx;
float: right;
margin-right:40rpx; 
}
.btn-attend{
width: 40%;
height: 60rpx;
font-size: 28rpx;
text-align: center;
line-height: 58rpx;
border-radius: 45rpx;
background: #3394ff;
color: #fff;
padding: 0;
}
.textone{
color: #ff3e3f;
}
.texttwo{
  color: #ccc;
}
.right-details{
width: 57%;
display: flex;
justify-content: flex-end;
align-items: center;
}
.btn-deta{
width: 40%;
height: 58rpx;
font-size: 28rpx;
text-align: center;
line-height: 60rpx;
border: 2rpx solid #b4b4b4;
border-radius: 45rpx;
margin-right: 20rpx;
}
.swbox{
  height: 200rpx;
  }
</style>
