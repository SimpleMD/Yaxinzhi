<template>
	<div class="group">
		<div class="grouplist" v-for="(item,index) in group_item" :index="index" :key="item" @click="jumpgroupdetail(item.collageGoodsId,item.goodsId,item.productId)">
			<div class="groupimg">
				<img :src="item.thumbnail">
			</div>
			<div class="groupdetail">
				<div class="grouptop"> 
					<div class="groupname">
						{{item.productName}}
					</div>
				</div>
				<div class="groupcenter">
          <div class="intro">{{item.productSpace}}</div>
          <div>{{item.collagePersons}}人团</div>
        </div>
				<div class="groupbottom"> 
					<div class="groupprice"> 
						<div class="groupprice">拼团价:{{item.activityPrice}}</div>
						<div class="price">零售价{{item.productPrice}}</div>
					</div>
					<!-- <div class="icon">
						<div class="title">立即开团</div>
					</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import config from "@/config"
export default {
  props: ['group_item'],
  data () {
    return {
    }
    },
    methods: {
  		jumpgroupdetail:function(collageGoodsId,goodsId,productId){
         wx.navigateTo({
           url: '../groupdetail/main?collageGoodsId=' + collageGoodsId + '&goodsId=' + goodsId+'&productId='+productId,
        })
      }
    }
}
</script>

<style  scoped lang='scss'>
img{
  width: 100%;
  height: 100%;
  overflow:hidden;
}
.grouplist{
  display: flex;
  width:95%;
  margin: 0 auto;
  border-bottom: 1rpx solid #f4f4f4;
  .groupimg{
    width: 250rpx;
    height: 250rpx;
    overflow: hidden;
  }
  .groupdetail{
    flex-grow:1;
    padding-left: 10rpx;
    box-sizing: border-box;
    .grouptop{
     .groupname{
       display: -webkit-box;
        width: 400rpx;
        line-height: 1.5;
        font-size: 0.9em;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .intro{
        font-size: 0.7em;
        color:#fc9632;
      }
    }
    .groupcenter{
      display: flex;
      justify-content: space-between;
      color:#fc9632;
      font-size: 0.9em;
      .intro{
        color:#8e8e8e;
      }
    }
    .groupbottom{
      display: flex;
      justify-content: space-between;
      font-size: 0.8em;
      .groupprice{
        .groupprice{
          color: #fc9632;
        }
        .price{
          color:#999;
          font-size: 0.7em;
        }
      }
      .icon{
        width: 100px;
        height: 30px;
        position: relative;
        overflow: hidden;
        .bcgImg{
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .title{
          width: 100%;
          height: 30px;
          line-height: 30px;
          color: #fc9632;
          text-align: center;
          
        }
      }
    }
  }
}
</style>