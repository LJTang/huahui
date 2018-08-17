//index.js
//获取应用实例
import GMAPI from "../../script/api";

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
    onShow:function(){
        var that=this;
        // wx.showLoading();
        // GMAPI.doSendMsg('wxpayment/pay',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_CashPledge);
    },
    onMsgCallBack_CashPledge:function (jsonBack){
        // wx.hideLoading();
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    /*
    * zf
    * */
    cashPledge_Pay:function(){
        var that=this;
        GMAPI.doSendMsg('wxpayment/pay',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_CashPledge_Pay);
    },
    onMsgCallBack_CashPledge_Pay:function (jsonBack){
        wx.hideLoading();
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        if(data.code==200){
            wx.requestPayment({
                'timeStamp': data.data.timeStamp,
                'nonceStr':data.data.nonceStr,
                'package': data.data.package,
                'signType': data.data.signType,
                'paySign':data.data.paySign,
                'success': function (res) {
                    wx.showToast({
                        title:data.msg,
                        icon:'none',
                        duration: 2000
                    });
                    if (res.errMsg = 'requestPayment:ok') {
                        wx.switchTab({
                            url: '/pages/my_index/my_index'
                        })
                    } else {
                    }
                },
                'fail': function (res) {
                    console.log(res);
                    wx.showToast({
                        title:data.msg,
                        icon:'none',
                        duration: 2000
                    });
                },
                'complete': function (res) {
                    // wx.showLoading({
                    //     title: '222...'
                    // });
                }
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
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
