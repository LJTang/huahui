//获取应用实例
import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        imgURL:'http://hua.guangzhoubaidu.com',
        imgUrls: [
            '/images/list1.png', '/images/list1.png', '/images/list1.png'
        ],
        goods:[],
        intPageIndex:0,
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        activeID:0,
        coupon:[],
        banner_IMG:[],
        pop_up:{
            up:[{name:'不知道',id:1},{name:'不知道2',id:2},{name:'不知道3',id:3}]
        }
    },
    onLoad:function(){
        var that=this;
        // GMAPI.doSendMsg('home/coupon','','POST',that.onMsgCallBack_Coupon);
        GMAPI.doSendMsg('home/banner','','POST',that.onMsgCallBack_Banner);
    },
    onShow:function(){
        // var that=this;
        // GMAPI.doSendMsg('loginwx/authlogin',{code:wx.getStorageSync('log').code,rawData:e.detail.rawData,signature:e.detail.signature,iv:e.detail.iv,encryptedData:e.detail.encryptedData,session_id:''},that.onMsgCallBack_Home);
        var that=this;
        this.setData({
            goods:[],
            coupon:[]
        });
        GMAPI.doSendMsg('Home/tehui',{uid:wx.getStorageSync('strWXID').strUserID,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''},'GET',that.onMsgCallBack_Home);
        GMAPI.doSendMsg('search/kefu','','POST',that.onMsgCallBack_KeFu);

    },

    onMsgCallBack_Home:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            var list=JSON.parse(jsonBack.data).data.goods_list;
            var coupon=JSON.parse(jsonBack.data).data.bonus_list;
            var goods=this.data.goods;

            for(var i=0;i<list.length;i++){
                goods.push(list[i]);
            }
            this.setData({
                goods:goods,
                coupon:coupon,
                loadingHidden:true
            });

            if(list.length==0){
                this.setData({
                    noMoreHidden: false,
                    loadMoreHidden: true,
                    inLoadHidden: true
                });
            }else{
                this.data.intPageIndex++;
                var that=this;
                that.setData({
                    noMoreHidden: true,
                    loadMoreHidden: false,
                    inLoadHidden: true
                })
            }
        }else{
            wx.showToast({
              title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    onMsgCallBack_KeFu:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
           app.data.kefu_Phone=data.data.value
        }
    },
    onMsgCallBack_Coupon:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            var list=JSON.parse(jsonBack.data).data.bouns_list;
            var coupon=this.data.coupon;

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
    onMsgCallBack_Banner:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                banner_IMG:data.data
            });

        }else{
        }
    },
    bonus:function(e){
        var that=this;
        var id=e.currentTarget.dataset.id;
        if(wx.getStorageSync('strWXID').strWXOpenID==undefined){
            wx.switchTab({
                url: '/pages/my/index'
            })
        }else {
            GMAPI.doSendMsg('home/lq_coupon', {
                user_id: wx.getStorageSync('strWXID').strUserID,
                bouns_id: id
            }, 'POST', that.onMsgCallBack_Bonus);
        }
    },
    onMsgCallBack_Bonus:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                goods:[],
                coupon:[]
            });
            GMAPI.doSendMsg('Home/tehui',{uid:wx.getStorageSync('strWXID').strUserID,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''},'GET',that.onMsgCallBack_Home);
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
})
