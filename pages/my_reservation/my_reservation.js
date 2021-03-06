/*
import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        hide_Bool:false,
        show_Bool:true,
        height:null,
        imgURL:'',
        order:[],
        strOrder:'',
        goods:[]
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
        this.setData({
            userInfo:wx.getStorageSync('getUserInfo'),
            my_UserInfo:(wx.getStorageSync('getUserInfo')==true?false:true),
            imgURL:app.globalData.userInfo.avatarUrl
        });
    },
    onShow:function (){
        var that=this;
        this.setData({
            order:[],
            goods:[]
        });
        GMAPI.doSendMsg('user/order_list',{user_id:wx.getStorageSync('strWXID').strUserID,status:0,order_info:3,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_MyReservation);

    },
    onMsgCallBack_MyReservation:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        var that=this;
        if(data.code==200){
            that.setData({
                strOrder:data.data,
                order:data.data.order_list,
                goods:data.data.goods_list
            });

        }else{
            that.setData({
                isData:data.data.length
            });
            // wx.showToast({
            //     title:data.msg,
            //     icon:'none',
            //     duration: 2000
            // });
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
*/

import GMAPI from '../../script/api.js';
//获取应用实例
const app = getApp();
Page({
    data: {
        imgURL:app.data.imgURL,
        indicatorDots: true,
        getUserInfo:false,
        intervarID:'',
        clock: '',
        strData: '',
        goods: [],
        height:null,
        activeID:0,
        isData:null,
        loadingHidden: false,
        noMoreHidden: true,
        loadMoreHidden: true,
        inLoadHidden: false
    },
    onLoad:function () {
        var that=this;
        wx.setNavigationBarTitle({
            title:'我的预约'
        });
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight -51
                });

            }
        });

        this.data.intervarID= setInterval(function () {
            var leftTime = (new Date(2018, 8-1, 28, 17, 40, 0)) - (new Date()); //计算剩余的毫秒数
            var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
            var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
            days = checkTime(days);
            hours = checkTime(hours);
            minutes = checkTime(minutes);
            seconds = checkTime(seconds);
            that.setData({
                clock: minutes + "分" + seconds + "秒"
            })
            if (days == '00' && hours == '00' && minutes == '00' && seconds=='00') {
                clearInterval(that.data.intervarID);}
        },1000)
    },
    onShow:function (){
        var that=this;
        this.setData({
            goods:[]
        });
        GMAPI.doSendMsg('user/order_list',{user_id:wx.getStorageSync('strWXID').strUserID,status:that.data.activeID,type:3,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Order);
    },
    upper: function(e) {},
    lower: function(e) {
        this.setData({
            noMoreHidden: true,
            loadMoreHidden: true,
            inLoadHidden: false
        });
        // this.onGetConnect();
    },
    scroll: function() {},
    tap: function (e){},
    tapMove: function (e){},
    /*
    ***导航栏点击
     */
    tabToggle: function (e) {
        var that=this;
        this.setData({
            activeID: parseInt(e.currentTarget.dataset.index),
            goods:[]
        });
        // GMAPI.doSendMsg('home/order_list',{user_id:wx.getStorageSync('strWXID').strUserID,order_info:parseInt(e.currentTarget.dataset.index)},'POST',that.onMsgCallBack_Order);
        GMAPI.doSendMsg('user/order_list',{user_id:wx.getStorageSync('strWXID').strUserID,status:parseInt(e.currentTarget.dataset.index),type:3,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Order);
    },
    nacTo:function(){
        wx.navigateTo({
            url: '/pages/vip/vip'
        })
    },
    onMsgCallBack_Order:function (jsonBack){
        // wx.hideLoading();
        var data=JSON.parse(jsonBack.data);
        console.log(data)
        var that=this;
        if(data.code==200){
            that.setData({
                isData:data.data.order_list.length,
                strData:data.data,
                goods:data.data.order_list
            });

        }else{
            that.setData({
                isData:data.data.length
            });
            // wx.showToast({
            //     title:data.msg,
            //     icon:'none',
            //     duration: 2000
            // });
        }
    },
    jump_StayPlay:function(e){
        wx.navigateTo({
            // url: '/pages/booking_details/booking_details?order_id='+e.currentTarget.dataset.id
            url: '/pages/yuyue_more/yuyue_more?order_id='+e.currentTarget.dataset.id
        })
    },
    onGotUserInfo: function(e) {
        var that=this;
        if(e.detail.errMsg=='getUserInfo:ok'){
            wx.setStorage({
                key: 'getUserInfo',
                data: true
            });
            this.setData({
                userInfo:true,
                my_UserInfo:false,
                imgURL:e.detail.userInfo.avatarUrl
            });
            wx.login({
                success: res => {
                    wx.setStorage({
                        key: 'log',
                        data: {code:res.code,sessionKey:''}
                    });
                }
            });
            // this.globalData.userInfo = e.detail.userInfo;
            GMAPI.doSendMsg('loginwx/authlogin',{code:wx.getStorageSync('log').code,rawData:e.detail.rawData,signature:e.detail.signature,iv:e.detail.iv,encryptedData:e.detail.encryptedData,session_id:''},'GET',that.onMsgCallBack);
        }
    },
    onMsgCallBack:function (jsonBack){
        var strData=JSON.parse(jsonBack.data);

        if(strData.code==200){
            wx.setStorage({
                key: 'strWXID',
                data: {sessionID:strData.data.session_id,strWXOpenID:strData.data.open_id,strUserID:strData.data.user_id}
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    //确认收货
    onConfirmReceipt:function(e){
        var that=this;
        GMAPI.doSendMsg('user/affirm_received',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:e.currentTarget.dataset.id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_ConfirmReceipt);
    },
    onMsgCallBack_ConfirmReceipt:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        var that=this;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });

            wx.navigateBack({
                delta:1
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    //退款
    onRefund:function(e){
        var that=this;
        GMAPI.doSendMsg('user/back_order',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:e.currentTarget.dataset.id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Refund);
    },
    onMsgCallBack_Refund:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        var that=this;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });

            wx.navigateBack({
                delta:1
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },

    onOrderPay:function (e) {
        var that=this;
        GMAPI.doSendMsg('wxpayment/pay',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:e.currentTarget.dataset.id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_OrderPay);
    },
    onMsgCallBack_OrderPay:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.requestPayment({
                'timeStamp': data.data.timeStamp,
                'nonceStr':data.data.nonceStr,
                'package': data.data.package,
                'signType': data.data.signType,
                'paySign':data.data.paySign,
                'success': function (res) {
                    if (res.errMsg = 'requestPayment:ok') {
                        wx.switchTab({
                            url: '/pages/my/index'
                        })
                    } else {
                        wx.switchTab({
                            url: '/pages/my/index'
                        })
                    }
                },
                'fail': function (res) {

                },
                'complete': function (res) {

                }
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    }
});
function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10)  {
        i = "0" + i;
    }
    return i;
}
