<template>
  <div class="tab">
    <scroll-view class="find_item" scroll-x style="width: 100%">
   		<div class="find_item_list" v-for="(item, index) in find_item" :index="index" :key="key" :class="{'select':item.selected}" v-on:click="changTab(index)" :style="{width:wid}">
   			<span>{{item.name}}</span>
   		</div>
   	</scroll-view>
  </div>
</template>

<script>
export default {
  props: ['find_item','wid','scrollLeft'],
  data () {
    return {
    	
    }
    },
    methods: {
  		changTab:function(index){
		  	var that=this;
	  //     	for(var i=0;i<that.find_item.length;i++){
	  //     		that.find_item[i].selected=false;
	  //     	}
			// that.find_item[index].selected=true;
			//往父组件传值
			that.$emit("listenToChild",index)  
	    }
    }
}
</script>

<style>
.tab{
	height: 40px;
	overflow: hidden;
}
.find_item{
	/*border-bottom: 1px solid #FEFEFE;*/
	width:100%;
	white-space: nowrap;
	overflow-x:scroll; 
	height: 40px;
	display: flex;
	justify-content:center;
	align-items: center
}
.find_item_list{
	display: inline-block;
	text-align: center;
	height: 35px;
	line-height: 35px;
	font-size: 16px;
	/* min-width: 25%; */
	flex-grow: 1;
}
.select{
	font-weight: bold;
	font-size: 18px;
	color: #fc9632;
	border-bottom: 2rpx solid #fc9632;
}
</style>
