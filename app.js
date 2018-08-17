//app.js
App({
    data:{
      kefu_Phone:'',
      apiURL:'https://hua.guangzhoubaidu.com/api/',
      imgURL:'http://hua.guangzhoubaidu.com'
    },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res.code)
          wx.setStorage({
              key: 'log',
              data: {code:res.code,sessionKey:''}
          });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
      userInfo: null,
      hasLogin: false,
      shops: [{
      id: 1,
          img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/shop_1.jpg',
          distance: 1.8,
          sales: 1475,
          logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_1.jpg',
          name: '杨国福麻辣烫(东四店)',
          desc: '满25减8；满35减10；满60减15（在线支付专享）'
      },
          {
            id: 2,
              img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/shop_2.jpg',
              distance: 2.4,
              sales: 1284,
              logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_2.jpg',
              name: '忠友麻辣烫(东四店)',
              desc: '满25减8；满35减10；满60减15（在线支付专享）'
          },
          {
            id: 3,
              img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/shop_3.jpg',
              distance: 2.3,
              sales: 2039,
              logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_3.jpg',
              name: '粥面故事(东大桥店)',
              desc: '满25减8；满35减10；满60减15（在线支付专享）'
          },
          {
            id: 4,
              img: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/shop_4.jpg',
              distance: 3.4,
              sales: 400,
              logo: 'http://wxapp.im20.com.cn/impublic/waimai/imgs/shops/logo_4.jpg',
              name: '兄鸡',
              desc: '满25减8；满35减10；满60减15（在线支付专享）'
          }]
      }

})