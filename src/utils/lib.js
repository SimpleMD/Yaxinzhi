//封装一个弹出框
const Show=(text,icon,Num)=>{
    wx.showToast({
        title: text,
        icon: icon,
        duration: Num
      })
}

const Loading = (text) =>{
    wx.showLoading({
        title: text,
      })
      
}

const ShopModel=(title,content)=>{
   return new Promise((resolve, reject) =>{
    wx.showModal({
        title: title, //提示的标题,
        content: content, //提示的内容,
        success: res => {
            resolve(res)
        }
      });
   }) 
}

  //缓存图片
  function locaImg(v){
    return new Promise(function (resolve, reject) { 
      wx.getImageInfo({   //  小程序获取图片信息API
        src: v,
        success: function (res) {
          // locaArr.push(res.path)
          resolve(res.path) 
        }
      })
    })
  }
  async function getlocaImg(arr){
       let locaArr=[];
       
      for(var i=0;i<arr.length;i++){
        locaArr.push(await locaImg(arr[i]))
      }
      
      return locaArr
  }

  const getImageInfo=(arrimg)=>{    //  图片缓存本地的方法
    return new Promise(function (resolve, reject) { 
      resolve(getlocaImg(arrimg))
    })
  }

const Lib={
    Show,
    ShopModel,
    Loading,
    getImageInfo
}


export default Lib