import GMAPI from "../../script/api";
var WxParse = require('../../wxParse/wxParse.js');

const app = getApp();
Page({
    data: {
        ke_id:0,
        keData:'',
        height:null,
        gallery_list:[],
        yuyueID:null
    },
    //滑动事件
    onLoad:function (option) {
        var that=this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    height:res.windowHeight,
                    ke_id:option.id
                });
            }
        });
        // GMAPI.doSendMsg('home/ke_detail', {ke_id:parseInt(option.id),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_SholongDetails);
        GMAPI.doSendMsg('home/goods_detail',{goods_id:parseInt(option.id),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,type:''},'POST',that.onMsgCallBack_SholongDetails);

    },
    onMsgCallBack_SholongDetails:function (jsonBack){
        var obj = this;
        var data=JSON.parse(jsonBack.data);

        if(data.code==200){
            this.setData({
                yuyueID:data.data.detail.id,
                keData:data.data,
                gallery_list:data.data.gallery_list
            });
            var article = data.data.detail.goods_desc;
            WxParse.wxParse('article', 'html', article, obj, 5);
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },

    off:function (){
        var that=this;
        this.setData({
            off_Bool:!that.data.off_Bool
        })
    },
    address:function (){
        var that=this;
        this.setData({
            address_Bool:false,
            newAddress_Bool:true
        })
    },
    /*
    ***加入购物车
     */
    makeAnAppointment :function (e) {
        var that=this;
        if(wx.getStorageSync('strWXID').strWXOpenID==undefined){
            wx.switchTab({
                url: '/pages/my/index'
            })
        }else {
            wx.navigateTo({
                url: '/pages/yuyue/yuyue?id=' + that.data.yuyueID
            });
        }
    }

});