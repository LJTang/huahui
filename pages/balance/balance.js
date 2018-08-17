//index.js
//获取应用实例
const app = getApp();

Page({
    data: {
        hide_Bool:false,
        show_Bool:true,
        height:null,
        imgURL:''
    },
    onLoad:function(){
        var that=this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    height: res.windowHeight
                });

            }
        });
        wx.setNavigationBarTitle({
            title:'押金'
        });
        this.setData({
            userInfo:wx.getStorageSync('getUserInfo'),
            my_UserInfo:(wx.getStorageSync('getUserInfo')==true?false:true),
            imgURL:app.globalData.userInfo.avatarUrl
        });
    },
    tapClick: function (e) {
        this.setData({
            hide_Bool:true,
            show_Bool:false
        });
    },
    close: function (e) {
        this.setData({
            hide_Bool:false,
            show_Bool:true
        });
    }
})
