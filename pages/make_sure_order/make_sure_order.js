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
        goods_number:[],
        goods:[],
        bonus_id:'',
        bonus_list:[],
        bonus_money:0,
        strData:'',
        address:'',
        off_Bool:false,
        pop_Bool:true,
        bonus:{
            bonus_Arr:[],
            width:0
        },
        amout:0
    },
    onLoad:function (option) {
        var that=this;
        this.setData({
            rec_id:[option.rec_id],
            goods_number:[option.numb]
        });
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.data.bonus.width=rpx;
                that.setData({
                    height: res.windowHeight - (rpx*200)-51,
                    bonus:{
                        width:rpx
                    }
                });

            }
        });

    },
    onShow:function(){
        var that=this;
        that.setData({ goods:[]});
        GMAPI.doSendMsg('flow/checkinfo',{user_id:wx.getStorageSync('strWXID').strUserID,rec_id:that.data.rec_id,goods_number:that.data.goods_number,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Make);
    },
    onMsgCallBack_Make:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
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
            bonus_money:money
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
       console.log(1111)
        var that=this;
        var list = this.data.goods;
        var arr = [];
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            if(curItem.active){
                arr.push(list[i].rec_id)
            }
        }
        GMAPI.doSendMsg('flow/order_info',{goods_use:'',user_id:wx.getStorageSync('strWXID').strUserID,rec_id:that.data.rec_id,goods_number:that.data.goods_number,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_A);
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
                    wx.switchTab({
                        url: '/pages/my/index'
                    })
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