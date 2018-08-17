//获取应用实例
import GMAPI from "../../script/api";

const app = getApp();
Page({
    data: {
        imgURL:'',
        indicatorDots: true,
        getUserInfo:false,
        userInfo:wx.getStorageSync('getUserInfo'),
        my_UserInfo:(wx.getStorageSync('getUserInfo')==true?false:true),
        intervarID:'',
        clock: '',
        height:null,
        activeID:0,
        isData:true,
        loadingHidden: false,
        noMoreHidden: true,
        loadMoreHidden: true,
        inLoadHidden: false,
        rec_id:[],
        goods:[],
        bonus_id:'',
        bonus_list:[],
        bonus_money:0,
        strData:'',
        address:'',
        off_Bool:false,
        pop_Bool:true,
        bonus:{
            bonus_Arr:[]
        },
        amout:0
    },
    onLoad:function (option) {
        var that=this;
        this.setData({
            rec_id:[option.rec_id]
        });
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight - (rpx*200)-51
                });

            }
        });
        // console.log(new Date(2017, 6-1, 28, 17, 40, 0))
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
            });
            if (days == '00' && hours == '00' && minutes == '00' && seconds=='00') {
                clearInterval(that.data.intervarID);}
            },1000);


    },
    onShow:function(){
        var that=this;
        that.setData({ goods:[]});
        // GMAPI.doSendMsg('flow/checkinfo',{user_id:wx.getStorageSync('strWXID').strUserID,rec_id:that.data.rec_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Stay);
        // GMAPI.doSendMsg('checkinfo',{user_id:wx.getStorageSync('strWXID').strUserID,rec_id:that.data.rec_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Stay);
        GMAPI.doSendMsg('flow/checkinfo',{user_id:wx.getStorageSync('strWXID').strUserID,rec_id:that.data.rec_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Make);
    },
    onMsgCallBack_Make:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        var that=this;
        if(data.code==200){
            var numb=(data.data.bonus_list.length==0?0:data.data.bonus_list[0].bonus_money);
            this.setData({
                imgURL:data.url,
                strData:data.data,
                amout:data.data.amout-numb,
                address:data.data.address_list,
                goods:data.data.goods_list,
                bonus_list:data.data.bonus_list,
                bonus_money:numb
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },

    upper: function(e) {},
    lower: function(e) {
        this.setData({
            noMoreHidden: true,
            loadMoreHidden: true,
            inLoadHidden: false
        });
    },
    scroll: function() {},
    tap: function (e){},
    tapMove: function (e){},

    /**
     * 优惠券
     * **/
    coupons_PopUp:function (){
        var that=this;
        var list=this.data.bonus_list;
        var arr_List=[];
        for(var i=0;i<list.length;i++){
            arr_List.push(list[i]);
        }
        this.data.bonus.bonus_Arr=arr_List;
        this.setData({
            pop_Bool:false,
            bonus:{
                bonus_Arr:arr_List
            }
        })
    },
    /*
    *优惠券点击取值
     */
    onClickValue:function (e){
        console.log(e.currentTarget.dataset.id);
        var that=this;
        var id=e.currentTarget.dataset.id;
        var money=parseInt(e.currentTarget.dataset.money);
        this.setData({
            pop_Bool:true,
            bonus_id:id,
            amout:that.data.strData.amout-money,
        })
    },
    /*
   *关闭优惠券
    */
    close_Pop:function (e){
        this.setData({
            pop_Bool:true,
        })
    },


    off:function (){
        var that=this;
        this.setData({
            off_Bool:!that.data.off_Bool
        })
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
        var list = this.data.goods;
        var arr = [];
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            if(curItem.active){
                arr.push(list[i].rec_id)
            }
        }
        GMAPI.doSendMsg('flow/order_info',{goods_use:'',user_id:wx.getStorageSync('strWXID').strUserID,rec_id:that.data.rec_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_A);
        // GMAPI.doSendMsg('wxpayment/pay','','POST',that.onMsgCallBack_Pay);
    },
    onMsgCallBack_A:function (jsonBack){
        // wx.hideLoading();
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        var that=this;
        if(data.code==200){
            GMAPI.doSendMsg('wxpayment/pay',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Pay);
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
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
        }
    }
});
function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10)  {
        i = "0" + i;
    }
    return i;
}