import GMAPI from "../../script/api";

const app = getApp();
Page({
    data: {
        saveHidden:true,
        totalPrice:0,
        allSelect:true,
        noSelect:false,
        off_Bool:true,
        listID:0,
        title:'',
        scrollTop: 0,
        activeID: 0,
        height:null,
        imgURL:'',
        delBtnWidth:120,    //删除按钮宽度单位（rpx）
        strData:'',
        bonus_money:0,
        attr_id:[],
        bonus_list:[],
        coupon:[],
        bonus_id:'',
        checkboxValue:0,
        amount:0,
        amount_Pay:0,
        money:0,
        goods_use:'居家自用',
        pop_Bool:true,
        bonus:{
            bonus_Arr:[],
            width:0
        },
    },
    onLoad: function () {
        var that=this;
        wx.getSystemInfo({
            success: function(res) {
                var rpx=(res.windowWidth / 750);
                that.data.bonus.width=rpx;
                that.setData({
                    height:res.windowHeight,
                    bonus:{
                        width:rpx
                    }
                });
            }
        });
        wx.setNavigationBarTitle({
            title:'确认订单'
        });
        var numb=(wx.getStorageSync('direct_purchase').data.bonus_list.length==0?0:wx.getStorageSync('direct_purchase').data.bonus_list[0].bonus_money);
        this.setData({
            strData:wx.getStorageSync('direct_purchase').data,
            bonus_money:numb,
            address:wx.getStorageSync('direct_purchase').data.address_list,
            bonus_list:wx.getStorageSync('direct_purchase').data.bonus_list,
            amount:wx.getStorageSync('direct_purchase').data.goods_price-numb,
        });
    },
    onShow: function(){
        var that=this;
        var json={user_id:wx.getStorageSync('strWXID').strUserID,attr_id:(that.data.strData.attr_id.length==0?'':that.data.strData.attr_id),goods_id:that.data.strData.id,type:that.data.strData.type_id,goods_number:that.data.strData.goods_number,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
        GMAPI.doSendMsg('flow/zj_buy',json,'POST',that.onMsgCallBack_NewOrder);

    },
    onMsgCallBack_NewOrder:function(jsonBack){
        var that=this;
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.setStorage({
                key: 'direct_purchase',
                data:data
            });
            var numb=(data.data.bonus_list.length==0?0:data.data.bonus_list[0].bonus_money);
            this.setData({
                strData:data.data,
                attr_id:data.data.attr_id,
                bonus_id:(data.data.bonus_list.length==0?'':data.data.bonus_list[0].bonus_id),
                bonus_money:numb,
                address:data.data.address_list,
                bonus_list:data.data.bonus_list,
                amount:data.data.amount-numb,
                amount_Pay:data.data.amount
            });

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    onMsgCallBack_Coupon:function (jsonBack){
        var data=JSON.parse(jsonBack.data);


        if(data.code==200){
            this.data.bonus.bonus_Arr=JSON.parse(jsonBack.data).data.list;

            var list=JSON.parse(jsonBack.data).data.list;
            var coupon=this.data.coupon;
            for(var i=0;i<list.length;i++){
                coupon.push(list[i]);
            }
            this.setData({
                coupon:coupon
            });

        }else{
            // wx.showToast({
            //     title:data.msg,
            //     icon:'none',
            //     duration: 2000
            // });
        }
    },
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
        console.log(e.currentTarget.dataset.money);
        var that=this;
        var id=e.currentTarget.dataset.id;
        var money=parseInt(e.currentTarget.dataset.money);
        this.setData({
            pop_Bool:true,
            bonus_id:id,
            amount:that.data.strData.amount-money,
            bonus_money:money,
            money:money
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
    checkboxChange: function(e) {
        this.setData({
            checkboxValue:e.detail.value
        });
    },
    navTo:function(e){
        wx.navigateTo({
            url:'/pages/choose_details/choose_details?id='+e.currentTarget.dataset.index
        })
    },
    jump_Location:function(){
        wx.navigateTo({
            url: '/pages/my_location/my_location'
        });
    },
    tabClick: function (e) {
        this.setData({
            activeID: parseInt(e.currentTarget.dataset.index),
            goods_use:e.currentTarget.dataset.text
        });
    },
    //获取元素自适应后的实际宽度
    getEleWidth:function(w){
        var real = 0;
        try {
            var res = wx.getSystemInfoSync().windowWidth;
            var scale = (750/2)/(w/2);  //以宽度750px设计稿做宽度的自适应
            // console.log(scale);
            real = Math.floor(res/scale);
            return real;
        } catch (e) {
            return false;
        }
    },
    off:function (){
      var that=this;
      this.setData({
          off_Bool:!that.data.off_Bool
      })
    },

    /**
     *
     * 微信支付
     * **/
    toPay:function(e){
        var that=this;
        var data_goods=wx.getStorageSync('direct_purchase').data;
        var json={user_id:wx.getStorageSync('strWXID').strUserID,attr_id:that.data.attr_id,goods_id:data_goods.id,goods_number:data_goods.goods_number,bonus_id:that.data.bonus_id,goods_use:that.data.goods_use,type:data_goods.type_id, wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
        console.log(json);
        GMAPI.doSendMsg('flow/zj_buy_order',json,'POST',that.onMsgCallBack_PayOrder);
    },
    onMsgCallBack_PayOrder:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        var that=this;
        if(data.code==200){
            GMAPI.doSendMsg('wxpayment/pay',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_WXPay);
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    onMsgCallBack_WXPay:function (jsonBack){
        wx.hideLoading();
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
