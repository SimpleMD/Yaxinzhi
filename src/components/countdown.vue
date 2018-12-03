<template>
	<div class="bottomright">
		<span class="leavetime">{{countdown.days}}</span>
		<span class="maohao">天</span>
		<span class="leavetime">{{countdown.hours}}</span>
		<span class="maohao">：</span>
		<span class="leavetime">{{countdown.minutes}}</span>
		<span class="maohao">：</span>
		<span class="leavetime">{{countdown.seconds}}</span>
	</div>
</template>

<script>
import config from "@/config"
export default {
  props: ['countdown'],
  data () {
    return {
 
    }
    },
    methods: {

    }
}
</script>

<style scoped lang='scss'>
.bottomright{
	margin-top: 5rpx;
	.leavetime{
		display: inline-block;
		width: 40rpx;
		height: 40rpx;
		text-align: center;
		color: #fff;
		line-height: 40rpx;
		background: #fc9632;
		border-radius: 5rpx;
		font-size: 0.8em;
	}
	.maohao{
		color: #fc9632;
	}
}
</style>