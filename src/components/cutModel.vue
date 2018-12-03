<template>
	<div class="cutModel">
		<div class="bcgmodel"></div>
		<div class="cutModel">     
			<div class="bcg">
				<img :src="bcg" mode="widthFix">
			</div>
			<div class="cutMoney">
				<span>{{cutPersAmount}}</span>元 
			</div>
			<div class="cutbtn" v-if="cutType=='C'">
				<button open-type='share'></button>
			</div>
			<div class="cutbtn" @click='jumpcut' v-if="cutType=='H'">
			   
			</div>
			<div class="close"  @click="close"><img src="/static/images/close.png"></div>
		</div>
	</div>
</template>

<script>
import config from "@/config"
export default {
  props: ['bcg','cutPersAmount','cutType'],
  data () {
    return {
 
    }
    },
    methods: {
    	close(){
    	 this.$emit("listenToChild")
    	},
    	jumpcut(){
    		wx.switchTab({
    			url: '../index/main',
    		})
    	}
    }
}
</script>

<style scoped lang='scss'>
img{
	width: 100%;
	height: 100%;
	display: block;
}
.bcgmodel{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background: #000;
    opacity: 0.5;
    overflow: hidden;
  }
.cutModel{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  .bcg{ 
    position: fixed;
    width: 80%;
    top:200rpx;
    left:10%;
  }
  .cutMoney{
    position: absolute;
    top: 390rpx;
    // left:15%;
    width: 100%;
    text-align: center;
    font-size: 1.5em;
    z-index: 30;
    span{
      font-size: 2em;
      font: bold "Microsoft YaHei";
      text-shadow: 4rpx 4rpx 5rpx #421a00;
    }
  }
  .cutbtn{
    position: absolute;
    top: 850rpx;
    width: 300rpx;
    height: 100rpx;
    left: 30%;
    button{
      background: none;border:none;width: 100%;height: 100%;
    }
  }
  .close{
    width: 40rpx;
    height: 40rpx;
    overflow: hidden;
    position: absolute;
    top:340rpx;
    right: 18%;
  }

}

button::after {
  border: none;
}
</style>