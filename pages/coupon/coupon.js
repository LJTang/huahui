//获取应用实例
import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        imgURL:'http://hua.guangzhoubaidu.com',
        coupon:[]
    },
    onLoad:function(){
        wx.setNavigationBarTitle({
            title:'我的优惠劵'
        });
    },
    onShow:function(){
        var that=this;
        this.setData({
            goods:[]
        });
        GMAPI.doSendMsg('user/my_coupon',{user_id:wx.getStorageSync('strWXID').strUserID,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Coupon);
    },

    onMsgCallBack_Coupon:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            var list=JSON.parse(jsonBack.data).data.list;
            var coupon=[];

            for(var i=0;i<list.length;i++){
                coupon.push(list[i]);
            }
            this.setData({
                coupon:coupon
            });

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    employ:function(e){
        var that=this;
        var id=e.currentTarget.dataset.id;
        GMAPI.doSendMsg('home/lq_coupon',{user_id:wx.getStorageSync('strWXID').strUserID,bouns_id:id},'POST',that.onMsgCallBack_Bonus);
    },
    onMsgCallBack_Bonus:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data)
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    // merchandise
    tabClick: function (e) {
        this.setData({
            activeID: parseInt(e.currentTarget.dataset.index)
        });
        var that=this;
        if(parseInt(e.currentTarget.dataset.index)==0){
            this.setData({
                goods:[]
            });
            GMAPI.doSendMsg('Home/tehui',{wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''},'GET',that.onMsgCallBack_Home);
        }else if(parseInt(e.currentTarget.dataset.index)==1){
            wx.navigateTo({
                url:'/pages/merchandise/merchandise'
            })
        }else if(parseInt(e.currentTarget.dataset.index)==2){
            wx.navigateTo({
                // url:'/pages/choose_details/choose_details?id=5'
                // url:'/pages/yuyue/yuyue'
                url:'/pages/shalong/shalong'
            })
        }else if(parseInt(e.currentTarget.dataset.index)==3){
            wx.navigateTo({
                url:'/pages/DIY_area/DIY_area'
            })
        }else{

        }
    },
    navTo:function(e){
        wx.navigateTo({
            url:'/pages/product_details/product_details?id='+e.currentTarget.dataset.id
        })
    },
    onClickValue:function (e){
        console.log(e.currentTarget.dataset.id)
    }
});
