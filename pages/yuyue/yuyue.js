import GMAPI from "../../script/api";

const app = getApp();
Page({
    data: {
        yuyueData:'',
        amount:0,
        price:0,
        scrollTop: 0,
        activeID: 0,
        height:null,
        imgURL:'',
        hua_Number: 1,
        delBtnWidth:120,    //删除按钮宽度单位（rpx）
        userName:'',
        people:1,
        userPhone:'',
        phone:'',
        note:'',
        goods_id:'',
        strData:'',
        bonus_money:0,
        money:0,
        pop_Bool:true,
        bonus:{
            bonus_Arr:[]
        },
    },
    onLoad: function (option) {
        this.setData({
            goods_id:parseInt(option.id)
        });
        var that=this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    height:res.windowHeight
                });
            }
        });
     },
    onShow: function(){
        var that=this;
        var json={user_id:wx.getStorageSync('strWXID').strUserID,attr_id:'',goods_id:that.data.goods_id,type:3,goods_number:that.data.hua_Number,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
        GMAPI.doSendMsg('flow/zj_buy',json,'POST',that.onMsgCallBack_Desc);
    },
    onYuYue: function(){
        var that=this;
        if(that.data.yourName==''){
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration:2000
            });
        }else if(GMAPI.checkPhone(that.data.phone)==false){
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration:2000
            });
        }else{
            var json={user_id:wx.getStorageSync('strWXID').strUserID,attr_id:'',goods_id:that.data.goods_id,type:3,goods_number:that.data.hua_Number,bonus_id:'',name:that.data.yourName,mobile:that.data.phone,remarks:that.data.note,goods_use:'',wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
            GMAPI.doSendMsg('flow/zj_buy_order',json,'POST',that.onMsgCallBack_YuYue);
        }

    },
    onMsgCallBack_Desc:function (jsonBack){
        var that = this;
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            var numb=(data.data.bonus_list.length==0?0:data.data.bonus_list[0].bonus_money);
            console.log(numb);
            this.setData({
                strData:data.data,
                price:data.data.goods_price,
                amount:data.data.goods_price-numb,
                address:data.data.address_list,
                bonus_list:data.data.bonus_list,
                bonus_money:numb,
                money:numb
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    onMsgCallBack_YuYue:function (jsonBack){
        var that = this;
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        if(data.code==200){
            this.setData({
                yuyueData:data.order_id
            });
            GMAPI.doSendMsg('wxpayment/pay',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Pay);
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    //支付
    onMsgCallBack_Pay:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        var that=this;
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
                    } else{
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
    },

    getFocus_Name: function (e) {
        this.setData({
            yourName: e.detail.value
        });
    },
    getFocus_Phone: function (e) {
        this.setData({
            phone: e.detail.value
        });
    },
    getFocus_Note: function (e) {
        this.setData({
            note: e.detail.value
        });
    },

    //加
    appendBlock: function (e) {
        var that=this;
        this.setData({
            hua_Number:that.data.hua_Number+1,
            amount:that.data.price*parseInt(that.data.hua_Number+1)
        });
    },
    //减
    decrease: function (e) {
        var that=this;
        this.setData({
            hua_Number:(that.data.hua_Number==1?1:that.data.hua_Number-1),
            amount:that.data.price*(that.data.hua_Number==1?1:that.data.hua_Number-1)
        });
    },

    tabClick: function (e) {
        this.setData({
            activeID: parseInt(e.currentTarget.dataset.index)
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
    }

});
