<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style lang='scss'>
/* .container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
} */
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}

@mixin flexc{
display: flex;align-items: center;
}

.fontHidden{
  white-space:normal;overflow: hidden;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
}

.fontHidden1{
  white-space:normal;overflow: hidden;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;
}

.footerBnt{background: #fff;}
.font26rpx{
  font-weight: 100;font-size: 26rpx
}
.font28rpx{
  font-weight: 100;font-size: 28rpx
}

.font30rpx{
  font-weight: 100;font-size: 30rpx
}

.font34rpx{
  font-weight: 100;font-size: 34rpx; 
}

.margin815rpx{
  margin: 8rpx 15rpx;
}

.padding815rpx{
  padding: 8rpx 15rpx
}

.padding015rpx{
  padding: 0rpx 15rpx
}

</style>
