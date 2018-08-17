//获取应用实例
import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        indicatorDots: true,
        intervarID:'',
        clock: '',
        height:null,
        activeID:0,
        isData:true,
        loadingHidden: false,
        noMoreHidden: true,
        loadMoreHidden: true,
        inLoadHidden: false,
        order_id:[],
        goods:[],
        strData:'',
        strDataTime:'',
        address:''
    },
    onLoad:function (option) {
        var that=this;
        this.setData({
            order_id:parseInt(option.order_id)
        });
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight - (rpx*200)-51
                });

            }
        });
    },
    onShow:function(){
        var that=this;
        that.setData({ goods:[]});
        GMAPI.doSendMsg('user/order_detail',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Stay);
    },
    onMsgCallBack_Stay:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        var that=this;
        if(data.code==200){
            this.setData({
                strData:data.data.order_detail,
                strDataTime:GMAPI.formatTime(data.data.order_detail.add_time,'Y-M-D h:m:s'),
                goods:data.data.goods_list,
                times:data.data.order_detail.end_time
            });
            console.log(Date.parse(new Date()),data.data.order_detail.end_time);
            if(Date.parse(new Date())<data.data.order_detail.end_time){
                that.countdown(data.data.order_detail.end_time);
                this.setData({
                    times_Bool:true
                });
            }else{
                this.setData({
                    times_Bool:false
                });
            }

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    countdown:function(){
        var that=this;
        this.data.intervarID= setInterval(function () {
            var leftTime = (new Date(that.data.times)) - (new Date()); //计算剩余的毫秒数
            var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
            var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
            days = checkTime(days);
            hours = checkTime(hours);
            that.setData({
                clock: minutes + "分" + seconds + "秒"
            });
            if (days == '00' && hours == '00' && minutes == '00' && seconds=='00') {
                clearInterval(that.data.intervarID);
            }
        },1000)
    },

    tabClick: function (e) {
        this.setData({
            activeID: parseInt(e.currentTarget.dataset.index)
        });
    },
    jump_Location:function(){
        wx.navigateTo({
            url: '/pages/my_location/my_location'
        })
    },
    onGotUserInfo: function(e) {
        if(e.detail.errMsg=='getUserInfo:ok'){
            wx.setStorage({
                key: 'getUserInfo',
                data: true
            });
            this.setData({
                userInfo:true,
                my_UserInfo:false
            });
            this.globalData.userInfo = e.detail.userInfo;
        }
    },
    onPayOrder:function(){
        wx.showLoading();
        var that=this;
        GMAPI.doSendMsg('wxpayment/pay',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Pay);

    },
    onMsgCallBack_Pay:function (jsonBack){
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
                    if (res.errMsg = 'requestPayment:ok') {
                        wx.switchTab({
                            url: '/pages/my_index/my_index'
                        })
                    } else {
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
    },
    //取消订单
    closeOrder:function(){
        var that=this;
        GMAPI.doSendMsg('user/cancel_order',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_CloseOrder);
    },
    onMsgCallBack_CloseOrder:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        var that=this;
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            setTimeout(function(){
                wx.navigateBack({
                    delta:1
                });
            },2000);

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },

    //确认收货
    onConfirmReceipt:function(){
        var that=this;
        GMAPI.doSendMsg('user/affirm_received',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_ConfirmReceipt);
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
    onRefund:function(){
        var that=this;
        GMAPI.doSendMsg('user/back_order',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Refund);
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

    onOrderPay:function () {
        var that=this;
        GMAPI.doSendMsg('wxpayment/pay',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:that.data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_OrderPay);
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
                    console.log(res)
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
        }
    }

});
function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10)  {
        i = "0" + i;
    }
    return i;
}