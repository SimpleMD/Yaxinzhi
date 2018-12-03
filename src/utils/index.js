function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (timestamp) {
  var date = new Date(timestamp);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

//发送消息
const sendMsg=(paypackage, orderid, ordertime, ordername, payorderamount)=>{
  wx.request({
    url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc6a44ea909442b31&secret=6e6100c9782769ef1ce582ad687d3e76",
    method: 'GET',
    success: function (res) {
      let openId = wx.getStorageSync('openId');
      let _access_token = res.data.access_token;
      let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token;
      let form_id = paypackage.split("=")[1];
      let _jsonData = {
        access_token: _access_token,
        touser: openId,
        template_id: 'grPG-SjF9uTDVRmS-KathfL0xa2vwZUX-YDFENtQpMQ',
        form_id: form_id,
        page: "pages/fivefahuo/fivefahuo?currentTarget=2",
        data: {
          "keyword1": { "value": orderid, "color": "#173177" },
          "keyword2": { "value": ordertime, "color": "#173177" },
          "keyword3": { "value": ordername, "color": "#173177" },
          "keyword4": { "value": payorderamount.toString(), "color": "#173177" },
          "keyword5": { "value": "待发货", "color": "#173177" },
          "keyword6": { "value": "微信支付", "color": "#173177" },
        }
      }
      wx.request({
        url: url,
        data: _jsonData,
        method: 'POST',
        success: function (res) {
          console.log(res)
        },
        fail: function (err) {
          console.log('request fail ', err);
        },
        complete: function (res) {
          console.log("request completed!");
        }

      })
    }
  })
}


export default {
  formatNumber,
  formatTime,
  sendMsg
}
