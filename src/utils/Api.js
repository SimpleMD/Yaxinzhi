 import Fly from "flyio/dist/npm/wx";
export default class Api{
  constructor() {
     // this.baseUrl = "https://www.guqinjiujiang.xyz:8444/guqinzhen"
     // this.baseUrl = "https://www.etuetf.com"
     // this.baseUrl = "http://192.168.2.208/guoranhuiwei" 
     //this.baseUrl = "http://192.168.2.208/guoranhuiwei" 

     this.baseUrl = "http://192.168.2.111/guoranhuiwei" 
     // this.baseUrl = "http://192.168.2.208/guoranhuiwei" 

    // this.baseUrl = "http://192.168.2.131/guoranhuiwei" 
    this.fly = new Fly;
    // this.fly.config.baseUrl=
  }

  //获取首页轮播图
  getTopIndex(){
	return new Promise((resolve, reject) => {
      let topIndexRes=this.fly.get(this.baseUrl +'/api/index/topIndex')
      resolve(topIndexRes)
	})   
  }

  // 获取时令日历
  getseasonalCalendar(){
  return new Promise((resolve, reject) => {
      let seasonalCalendarRes=this.fly.get(this.baseUrl +'/api/index/seasonalCalendar')
      resolve(seasonalCalendarRes)
  })   
  }
  // 获取楼层分类以及商品列表
  getadvertisingIndex(){
    return new Promise((resolve, reject) => {
      let advertisingIndexRes=this.fly.get(this.baseUrl +'/api/index/advertisingIndex')
      resolve(advertisingIndexRes)
    })   
  }
  //获取拼团列表
  getGroupList(){
    return new Promise((resolve, reject) => {
      let res=this.fly.get(this.baseUrl +'/api/collage/collageGoodsList')
      resolve(res)
  })   
  }
  // 获取商品详情
  getGoods(goodsId,memberId){
    return new Promise((resolve, reject) => {
      let goodsParms = {}
      goodsParms.goodsId = goodsId
      goodsParms.memberId = memberId
      let res=this.fly.get(this.baseUrl +'/api/Goods/getGoods',{params:JSON.stringify(goodsParms)})
      resolve(res)
    })
  }
  // 获取货品详情
  getProduct(goodsId,memberId){
    let goodsParms = {}
    goodsParms.goodsId = goodsId
    goodsParms.memberId = memberId
    let res=this.fly.get(this.baseUrl +'/api/Goods/getProduct',{parms:JSON.stringify(goodsParms)})
    resolve(res)
  }
  //获取拼团详细数据
  getseleCollGoods(collageGoodsId){
    return new Promise((resolve, reject) => {
      let res=this.fly.get(this.baseUrl +'/api/collage/seleCollGoods/'+collageGoodsId)
      resolve(res)
    })
  }
  // 获取所有正在拼团的数据
  getallStartCollage(productId){
     return new Promise((resolve, reject) => {
      let res=this.fly.get(this.baseUrl +'/api/collage/allStartCollage',{productId:productId})
      resolve(res)
    })
  }
  // 获取限时活动的列表
  getLimit(offset,limit){
    return new Promise((resolve, reject) => {
       let params={}
       params.offset=offset
       params.limit=limit
       let limitRes=this.fly.get(this.baseUrl +'/api/activity/limit',{params:JSON.stringify(params)})
       resolve(limitRes)
    })
  }
  // 获取砍价列表
  getCutlist(){
    return new Promise((resolve, reject) => {
     let cutlistRes=this.fly.get(this.baseUrl +'/api/cut/cutList')
       resolve(cutlistRes)
    })
  }
   // 根据cutID查找砍价商品详情
   getByCutId(cutId){
      return new Promise((resolve, reject) => {
        let cutDetailRes=this.fly.get(this.baseUrl+'/api/cut/findCut?cutId=' + cutId)
        resolve(cutDetailRes)
      })
   }
  // 判断是否参过团
  isJoin(memberId,cutId){
     return new Promise((resolve, reject) => {
        let cutparm = {}
        cutparm.memberId = memberId
        cutparm.cutId = cutId
        let cutDetailRes=this.fly.get(this.baseUrl+'/api/cut/isJoin',{params:JSON.stringify(cutparm)})
        resolve(cutDetailRes)
     })
  }
  startCut(startcutparm){
      return new Promise((resolve, reject) => {
         let startCutRes=this.fly.get(this.baseUrl+'/api/cut/startCut',{params:JSON.stringify(startcutparm)})
        resolve(startCutRes)
      })
  }
  // 根据code判断是否是会员
  getCode(){
   return new Promise((resolve, reject) => {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          let memberRes=that.fly.get(that.baseUrl +'/api/byCode',{code:res.code})
          resolve(memberRes) 
        }
      }
    })
   })
  }
  // 获取用户信息并且注册会员
  weCatLogin(code,avatarUrl,nickName,gender,country,province,city){
    return new Promise((resolve, reject) => {
      let weLoginRes=this.fly.get(this.baseUrl +'/api/weCatLogin',{
                      code: code,//获取openid的话 需要向后台传递code,利用code请求api获取openid
                      headurl:avatarUrl,//这些是用户的图片信息
                      nickname:nickName,//获取昵称
                      sex:gender,//获取性别
                      country:country,//获取国家
                      province:province,//获取省份
                      city:city//获取城市
                    })
      resolve(weLoginRes) 
    })
  }
  // 获取会员信息
  getMemberInfo(memberId){
    return new Promise((resolve, reject) => {
    let userParms = {}
    userParms.memberId = memberId
    let userInfoRes=this.fly.get(this.baseUrl +'/api/member/memberIndex',{parms:JSON.stringify(userParms)})
    resolve(userInfoRes)
    })
  }
  // 收藏收藏
  addCollection(parms){
   return new Promise((resolve, reject) => {
    let collecparm={}
    collecparm.favorite=parms
    let addCollectionRes=this.fly.post(this.baseUrl +'/api/favorite/add',{parms:JSON.stringify(collecparm)},{headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }})
    resolve(addCollectionRes)
   })
  }
  // 取消收藏
  delCollection(parms){
   return new Promise((resolve, reject) => {
    let collecparm={}
    collecparm.favorite=parms
    let delCollectionRes=this.fly.post(this.baseUrl +'/api/favorite/delete',{parms:JSON.stringify(collecparm)},{headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }})
    resolve(delCollectionRes)
   })
  }
  //获取积分
  getPoint(memberId){
    return new Promise((resolve, reject) => {
    let pointRes=this.fly.get(this.baseUrl +'/api/member/point',{memberId:memberId})
    resolve(pointRes)
   })
  }
   
  //签到
  Signin(memberId,cutpoint){
    return new Promise((resolve, reject) => {
      let params={}
      params.memberId=memberId;
      params.cutpoint=cutpoint;
      let signinRes=this.fly.post(this.baseUrl +'/api/member/upMemberLv',{params:JSON.stringify(params)},{headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }})
      resolve(signinRes)
    })
  }
  // 获取商品分类
  getGoodKind(){
     return new Promise((resolve, reject) => {
      let kindRes=this.fly.get(this.baseUrl +'/api/Goods/GoodCatAll')
      resolve(kindRes)
     })
  }
  // 根据商品分类获取商品
  getGoodsAll(catId){
     return new Promise((resolve, reject) => {
      let params={}
      params.catId = catId
      let moreGoodRes=this.fly.get(this.baseUrl +'/api/Goods/getGoodsAll',{params:JSON.stringify(params)})
      resolve(moreGoodRes)
     })
   }
  //获取订单全部列表
  AllGoodList(parms){
    return new Promise((resolve,reject) => {
       let GoodList = this.fly.get(this.baseUrl +'/api/order/apiSelectOrderList',{params:JSON.stringify(parms)})
       resolve(GoodList)
    })
  }
  //根据状态查询订单
  OrderSelectList(parms){
    return new Promise((resolve,reject) => {
      let OrderList = this.fly.get(this.baseUrl +'/api/order/orderList',{params:JSON.stringify(parms)})
      resolve(OrderList)
    })
  }
  
  //取消订单
  OrderCancel(parms){
    return new Promise((resolve,reject) => {
      let Orderres = this.fly.put(this.baseUrl +'/api/order/synthesize',{params:JSON.stringify(parms)},{headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
       }})
      resolve(Orderres)
    })
  }

  //确认付款
  ConfirmPay(parms,code){
    return new Promise((resolve,reject) =>{
      let Pay = this.fly.get(this.baseUrl +'/api/pay/prepay',{parms:JSON.stringify(parms),code: code})
      resolve(Pay)
    })
  }
   //支付成功后
   PaypassOrder(params){
    return new Promise((resolve,reject) => {
      let Orderres = this.fly.put(this.baseUrl +'/api/order/passOrder',{params:JSON.stringify(params)},{headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
       }})
      resolve(Orderres)
    })
  }
  // 获取默认地址
  getdefaultAddr(parms){
    return new Promise((resolve,reject) => {
      let addressRes = this.fly.get(this.baseUrl +'/api/address/defutaddress',{parms:JSON.stringify(parms)})
      resolve(addressRes)
    })
  }
  addAddress(parms){
   return new Promise((resolve,reject) => {
      let addressRes = this.fly.post(this.baseUrl +'/api/address/add',{parms:JSON.stringify(parms)},{headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
       }})
      resolve(addressRes)
    }) 
  }
  getAllAddress(memberId){
     return new Promise((resolve,reject) => {
      let params={}
      params.memberId=memberId
      let allAddressRes = this.fly.get(this.baseUrl +'/api/address/addressAll',{parms:JSON.stringify(params)})
      resolve(allAddressRes)
    }) 
  }
    //购物车所有订单
    CartList(memberId){
      return new Promise((resolve,reject) =>{
        let CartList = this.fly.get(this.baseUrl +'/api/shoppingCart/select',{memberId:memberId})
        resolve(CartList)
      })
    }

    //购物车所有订单数量加减
    CartOrderNum(parms){
      return new Promise((resolve,reject) =>{
        let CartOrderNum = this.fly.put(this.baseUrl + '/api/shoppingCart/modification',{params:JSON.stringify(parms)},{headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
         }})
        resolve(CartOrderNum)
      })
    }
    
    //购物车商品删除
    CartOrderDele(parms){
      return new Promise((resolve, reject) => {
        let CartOrderDele=this.fly.post(this.baseUrl +'/api/shoppingCart/deleteAll',{params:JSON.stringify(parms)},{headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }})
        resolve(CartOrderDele)
      })
    }

    
    //获取地址
    SelectAddre(addParms){
      return new Promise((resolve, reject) =>{
        let SelectAddre = this.fly.get(this.baseUrl +'/api/address/defutaddress',{parms:JSON.stringify(addParms)})
        resolve(SelectAddre)
      })
    }
    // 根据addrId获取地址详情
    getAddrById(addrId){
      return new Promise((resolve, reject) =>{
        let params={}
        params.addrId=addrId
        let detailAddre = this.fly.get(this.baseUrl +'/api/address/get',{parms:JSON.stringify(params)})
        resolve(detailAddre)
      })
    }
    // 修改地址
    editAddr(params){
      return new Promise((resolve, reject) =>{
        let editAddre = this.fly.put(this.baseUrl +'/api/address/update',{parms:JSON.stringify(params)},{headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
       }})
        resolve(editAddre)
      })
    }
  // 删除地址
    deleteAddress(params){
      return new Promise((resolve, reject) =>{
        let delAddre = this.fly.post(this.baseUrl +'/api/address/deleteAddress',{parms:JSON.stringify(params)},{headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
       }})
        resolve(delAddre)
      }) 
    }
    //加载优惠券
    onCoupont(memberIdlvId){
      return new Promise((resolve, reject) =>{
        let onCoupont = this.fly.get(this.baseUrl +'/api/vocher/unclosed',{fitMemberType:JSON.stringify(memberIdlvId)})
        resolve(onCoupont)
      })
    }

    //领取优惠券
    LiquCoupont(data){
      return new Promise((resolve, reject) =>{
        let LiquCoupont = this.fly.get(this.baseUrl +'/api/vocher/used',data)
        resolve(LiquCoupont)
      })
    }

    //领取优惠券
    LiquCouponts(memberId,voucherId){
      return new Promise((resolve, reject) =>{
        let LiquCouponts = this.fly.post(this.baseUrl +'/api/vocher/received',{memberId:memberId,voucherId:voucherId},{headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
         }})
        resolve(LiquCouponts)
      })
    }

    //已过期优惠券
    CloseCoupont(memberId){
      return new Promise((resolve, reject) =>{
        let CloseCoupont = this.fly.get(this.baseUrl +'/api/vocher/closeUsed',{memberId:memberId})
        resolve(CloseCoupont)
      })
    }

    //获取商品信息
    // getGoodsInfo(goodparms){
    //   return new Promise((resolve, reject) =>{
    //     let getGoodsInfo = this.fly.get(this.baseUrl +'/api/Goods/getGoods',{parms:JSON.stringify(goodparms) })
    //     resolve(getGoodsInfo)
    //   })
    // }

    //获取商品信息
    GetProduct(goodparms){
      return new Promise((resolve, reject) =>{
        let GetProduct = this.fly.get(this.baseUrl +'/api/Goods/getProduct',{parms:JSON.stringify(goodparms) })
        resolve(GetProduct)
      })
    }
    
    //提交购物车
    toCartSave(cartparms){
      return new Promise((resolve, reject) =>{
        let toCartSave = this.fly.post(this.baseUrl +'/api/shoppingCart/save',{params:JSON.stringify(cartparms)},{headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
       }})
        resolve(toCartSave)
      }) 
    }
    //订单提交
    oderSave(orderParam){
     return new Promise((resolve, reject) =>{
      let orderSave = this.fly.post(this.baseUrl +'/api/order/save',{order:JSON.stringify(orderParam)},{headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      }})
      resolve(orderSave)
    }) 
    }
    // 获取店铺
    getshopList(){
      return new Promise((resolve, reject) =>{
        let listShopRes=this.fly.get(this.baseUrl +'/api/index/listShop')
        resolve(listShopRes)
      })
    }
    // 微信支付
    prepay(code,params){
      return new Promise((resolve, reject) =>{
        let prepayRes=this.fly.get(this.baseUrl +'/api/pay/prepay',{code:code,parms:JSON.stringify(params)})
        resolve(prepayRes)
      })
    }
    // 开团
    openCollage(orderparams){
      return new Promise((resolve, reject) =>{
        let openCollageRes=this.fly.get(this.baseUrl +'/api/collage/openCollage',{params:JSON.stringify(orderparams)})
        resolve(openCollageRes)
      })
    }
    //订单页提交订单
    OrderSave(bean){
      return new Promise((resolve, reject) =>{
        let toCartSave = this.fly.post(this.baseUrl +'/api/order/save',{ order:JSON.stringify(bean)},{headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
        }})
        resolve(toCartSave)
      }) 
    }
    // 开团成功回调修改订单状态
    collagePayReturn(params){
        return new Promise((resolve, reject) =>{
        let collagePayReturn = this.fly.put(this.baseUrl +'/api/order/collagePayReturn',{ params:JSON.stringify(params)},{headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
        }})
        resolve(collagePayReturn)
      }) 
    }
    // 判断能否参团
    joinCollageRepetition(params){
       return new Promise((resolve, reject) =>{
        let toCartSave = this.fly.post(this.baseUrl +'/api/collage/joinCollageRepetition',{ params:JSON.stringify(params)},{headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
        }})
        resolve(toCartSave)
      }) 
    }
    // 判断是否成团
    judgeIsCollaged(memberCollageId){
      return new Promise((resolve, reject) =>{
        let judgeIsCollagedRes=this.fly.get(this.baseUrl +'/api/collage/judgeIsCollaged',{memberCollageId:memberCollageId})
        resolve(judgeIsCollagedRes)
      })
    }
    // 支付成功后参团
    joinCollage(cantuanorderparams){
      return new Promise((resolve, reject) =>{
        let joinCollage=this.fly.get(this.baseUrl +'/api/collage/joinCollage',{ params:JSON.stringify(cantuanorderparams)})
        resolve(joinCollage)
      })
    }
     //排行榜分页
     RanKing(params){
      return new Promise((resolve, reject) =>{
        let RanKing = this.fly.get(this.baseUrl +'/api/index/listFruit',{ params:JSON.stringify(params)})
        resolve(RanKing)
      }) 
    }
     //时令日历查看全部
     RiliListAll(params){
      return new Promise((resolve, reject) =>{
        let RiliListAll = this.fly.get(this.baseUrl +'/api/index/seasonalCalendarAll',{ params:JSON.stringify(params)})
        resolve(RiliListAll)
      }) 
    }

    //水果专区列表数据
    FruList(params){
      return new Promise((resolve, reject) =>{
        let FruList = this.fly.get(this.baseUrl +'/api/index/advertisementGoods',{ params:JSON.stringify(params)})
        resolve(FruList)
      }) 
    }
    // 获取拼团成功数据
    collageSucceed(params){
       return new Promise((resolve, reject) =>{
        let collageSucceedRes = this.fly.get(this.baseUrl +'/api/collage/collageSucceed',{ params:JSON.stringify(params)})
        resolve(collageSucceedRes)
      }) 
    }
    // 获取我的所有参团数据
    allMemberCollage(memberId,collageType){
      return new Promise((resolve, reject) =>{
        let allMemberCollageRes = this.fly.get(this.baseUrl +'/api/collage/allMemberCollage',{ memberId:memberId,collageType:collageType})
        resolve(allMemberCollageRes)
      }) 
    }
    // 好友参团
    friendCollage(memberCollageId){
      return new Promise((resolve, reject) =>{
        let params={}
        params.memberCollageId=memberCollageId
        let friendCollageRes = this.fly.get(this.baseUrl +'/api/collage/friendCollage',{params:JSON.stringify(params)})
        resolve(friendCollageRes)
      }) 
      
    }
     //微分销会员列表
     MemberLvList(params){
      return new Promise((resolve, reject) =>{
        let MemberLvList = this.fly.get(this.baseUrl +'/api/distribe/memberLvList')
        resolve(MemberLvList)
      }) 
    }

      //微分销信息提交
      SubmitDistribeApply(params){
        return new Promise((resolve, reject) =>{
          let SubmitDistribeApply = this.fly.post(this.baseUrl +'/api/distribe/submitDistribeApply',{ params:JSON.stringify(params)},{headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }})
          resolve(SubmitDistribeApply)
        }) 
      }

      //微分销信息提交订单
      PayOrder(params){
        return new Promise((resolve, reject) =>{
          let PayOrder = this.fly.post(this.baseUrl +'/api/distribe/payOrder',{ params:JSON.stringify(params)},{headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }})
          resolve(PayOrder)
        })  
      }

         //判断微分销是否提交
    WhetherDistribe(memberId){
      return new Promise((resolve, reject) =>{
        let WhetherDistribe = this.fly.get(this.baseUrl +'/api/distribe/whetherDistribe',{memberId:memberId})
        resolve(WhetherDistribe)
      }) 
    }

    //微分销详情页
    DistribeInfo(memberId){
      return new Promise((resolve, reject) =>{
        let DistribeInfo = this.fly.get(this.baseUrl +'/api/distribe/distribe',{memberId:memberId})
        resolve(DistribeInfo)
      }) 
    }
    
    //分销商品
    DistribeGoods(){
      return new Promise((resolve, reject) =>{
        let DistribeGoods = this.fly.get(this.baseUrl +'/api/distribe/goodsList')
        resolve(DistribeGoods)
      }) 
    }

    //分销分类商品
    DistribeListGoods(params){
      return new Promise((resolve, reject) =>{
        let DistribeListGoods = this.fly.get(this.baseUrl +'/api/distribe/goods',{ params:JSON.stringify(params)})
        resolve(DistribeListGoods)
      }) 
    }

    //分销分类
    Distribecats(){
      return new Promise((resolve, reject) =>{
        let Distribecats = this.fly.get(this.baseUrl +'/api/distribe/cats')
        resolve(Distribecats)
      }) 
    }

      //微分销提现
      Withdraw(params){
        return new Promise((resolve, reject) =>{
          let Withdraw = this.fly.post(this.baseUrl +'/api/distribe/withdraw',{params:JSON.stringify(params)},{headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }})
          resolve(Withdraw)
        }) 
      }
      //微分销获取小程序二维码

      GetShare(page,scene){
        return new Promise((resolve, reject) =>{
          let GetShare = this.fly.get('https://www.guqinet.com:8444/uploadGuoran/getShare',{page:page,scene:scene})
          resolve(GetShare)
        }) 
      }
      // 获取充值列表
      accountSettingList(){
          return new Promise((resolve, reject) =>{
          let accountSettingListRes = this.fly.get(this.baseUrl+'/api/member/accountSettingList')
          resolve(accountSettingListRes)
        }) 
      }
      // 会员充值
      topUp(memberId,id,shopId){
        return new Promise((resolve, reject) =>{
          let topUpRes = this.fly.post(this.baseUrl +'/api/member/topUp',{memberId:memberId,id:id,shopId:shopId},{headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }})
          resolve(topUpRes)
        }) 
      }

      //微分销提现记录
      AccountManagement(memberId){
      return new Promise((resolve, reject) =>{
        let AccountManagement = this.fly.get(this.baseUrl +'/api/distribe/accountManagement',{memberId:memberId})
        resolve(AccountManagement)
      }) 
      }
      // 判断是否已经砍价
      isHelp(params){
        return new Promise((resolve, reject) =>{
          let isHelpRes = this.fly.get(this.baseUrl +'/api/cut/isHelp',{params:JSON.stringify(params)})
          resolve(isHelpRes)
        }) 
      }
      // 好友帮忙砍价
      helpCut(params){
       return new Promise((resolve, reject) =>{
          let helpCutRes = this.fly.get(this.baseUrl +'/api/cut/helpCut',{params:JSON.stringify(params)})
          resolve(helpCutRes)
        }) 
      }
      //获取优惠券
      VoucherUsed(params){
        return new Promise((resolve, reject) =>{
          let VoucherUsed = this.fly.get(this.baseUrl +'/api/vocher/voucherUsed',{params:JSON.stringify(params)})
          resolve(VoucherUsed)
        }) 
        }

      //搜索页标签数据初始化
      GetSearchList(memberId){
        return new Promise((resolve, reject) =>{
          let GetSearchList = this.fly.get(this.baseUrl +'/api/brand/getSearchList',{memberId:memberId})
          resolve(GetSearchList)
        }) 
        }

         //检索商品
      SelectIndexGoods(parms){
        return new Promise((resolve, reject) =>{
          let SelectIndexGoods = this.fly.get(this.baseUrl +'/api/Goods/selectIndexGoods',{parms:JSON.stringify(parms)})
          resolve(SelectIndexGoods)
        }) 
        }

      //搜索页换一批
      RandomList(parms){
        return new Promise((resolve, reject) =>{
          let RandomList = this.fly.get(this.baseUrl +'/api/brand/randomList')
          resolve(RandomList)
        }) 
        }
      // 砍价成功后购买商品修改砍价状态
      finishCut(startCutId){
        return new Promise((resolve, reject) =>{
          let finishCutRes = this.fly.post(this.baseUrl +'/api/cut/finishCut',{startCutId:startCutId},{headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            }})
          resolve(finishCutRes)
        }) 
      }
       //线下核销
        BelowConsume(params){
          return new Promise((resolve, reject) =>{
            let BelowConsume = this.fly.post(this.baseUrl +'/api/member/belowConsume',{params:JSON.stringify(params)},{headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
              }})
            resolve(BelowConsume)
          }) 
        }
      
         //商品分润
         ShareProfit(fenrunParm){
          return new Promise((resolve, reject) =>{
            let ShareProfit = this.fly.post(this.baseUrl +'/api/distribe/shareProfit',{params:JSON.stringify(fenrunParm)},{headers:{
              'Content-Type': 'application/x-www-form-urlencoded'
              }})
            resolve(ShareProfit)
          }) 
        }

        //订单详情
        OrderIntRo(params){
          return new Promise((resolve, reject) =>{
            let OrderIntRo = this.fly.get(this.baseUrl +'/api/order/orderIntRo',{params:JSON.stringify(params)})
            resolve(OrderIntRo)
          }) 
        }

          //订单详情
          SlfLifting(memberId){
            return new Promise((resolve, reject) =>{
              let SlfLifting = this.fly.get(this.baseUrl +'/api/order/slfLifting',{memberId:memberId})
              resolve(SlfLifting)
            }) 
          }

          //存储fromId
          SaveFormid(memberId,formid){
            return new Promise((resolve, reject) =>{
              let SaveFormid = this.fly.post(this.baseUrl +'/api/push/saveFormid',{memberId:memberId,formid:formid},{headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
                }})
              resolve(SaveFormid)
            }) 
          }
      

}
