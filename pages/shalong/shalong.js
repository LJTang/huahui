import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        listID:0,
        list_IMGURL:app.data.imgURL,
        goods:[],
        title:'',
        activeID:0,
        imgURL_Bool:true,
        imgURL_Bool2:true,
        imgURL:'/images/down.png',
        imgURL2:'/images/du.png'
    },
    onLoad:function (option) {
        var that=this;

        this.setData({
            listID:0
        });
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight-(rpx*170)
                });

            }
        });
        GMAPI.doSendMsg('home/salon', {sort:'',wx_open_id:wx.getStorageSync('strWXID').strWXOpenID}
        ,'POST',that.onMsgCallBack_SaLong);

    },
    onMsgCallBack_SaLong:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        if(data.code==200){
            var list=data.data.goods_list;
            var goods=this.data.goods;

            for(var i=0;i<list.length;i++){
                goods.push(list[i]);
            }
            this.setData({
                goods:goods
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
        // this.onGetConnect();
    },
    scroll: function() {
        // this.setData({
        //     noMoreHidden: true,
        //     loadMoreHidden: true,
        //     inLoadHidden: false
        // });
    },
    tap: function (e){},
    tapMove: function (e){},
    //时间
    time_TabClick: function (e) {
        var that=this;
        var imgURL_Bool=!that.data.imgURL_Bool;
        this.setData({
            goods:[],
            imgURL_Bool:!that.data.imgURL_Bool,
            imgURL:(imgURL_Bool==true?'/images/down.png':'/images/up.png'),
            imgURL2:'/images/du.png'
        });
        GMAPI.doSendMsg('home/salon', {sort:(imgURL_Bool?'new_asc':'new_desc'),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''}, 'POST',that.onMsgCallBack_ChooseDetails);


    },
    //价格
    price_TabClick: function (e) {
        var that=this;
        var imgURL_Bool2=!that.data.imgURL_Bool2;
        this.setData({
            goods:[],
            imgURL_Bool2:!that.data.imgURL_Bool2,
            imgURL:'/images/du.png',
            imgURL2:(imgURL_Bool2==true?'/images/down.png':'/images/up.png'),
        });

        GMAPI.doSendMsg('home/salon',{sort:(imgURL_Bool2?'price_asc':'price_desc'),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''},
            'POST',that.onMsgCallBack_ChooseDetails);
    },
    jump_ProductDetails: function (e) {
        var that=this;
        wx.navigateTo({
            url:'/pages/shalong_details/shalong_details?id='+e.currentTarget.dataset.id
        })
    },
    jump_Filtrate: function (e) {
        wx.navigateTo({
            url:'/pages/filtrate/filtrate'
        })
    },
    tabClick: function (e) {
        var index=parseInt(e.currentTarget.dataset.index);
        this.setData({
            activeID: parseInt(e.currentTarget.dataset.index),
            imgURL:(index==0?'/images/down.png':'/images.du.png')
        });
    },

});
