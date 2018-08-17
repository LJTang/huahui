import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        text:'',
        height:null,
        activeID:0,
        imgURL_Bool:true,
        imgURL_Bool2:true,
        imgURL:'/images/down.png',
        imgURL2:'/images/du.png',
        view_Hide:false,
        choose_List:[],
        goods:[]
    },
    onLoad:function () {
        var that=this;
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight-(rpx*170)
                });
            }
        });

        GMAPI.doSendMsg('home/xg_cat', '','POST',that.onMsgCallBack_Choose);
    },
    onMsgCallBack_Choose:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        if(data.code==200){
            var list=JSON.parse(jsonBack.data).data;
            var choose_List=this.data.choose_List;

            for(var i=0;i<list.length;i++){
                choose_List.push(list[i]);
            }
            this.setData({
                choose_List:choose_List
                // title:data.data.cat_name
            });
        }
    },

    jump_View:function(e){
        var that=this;
        var id=e.currentTarget.dataset.id;

        // GMAPI.doSendMsg('Home/cat_goods',
        //     {cat_id:that.data.listID,sort:'new_asc',
        //         wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''},
        //     'POST',that.onMsgCallBack_ChooseDetails);
        wx.navigateTo({
            url:'/pages/choose_details/choose_details?id='+e.currentTarget.dataset.id
        });
    },
    onMsgCallBack_ChooseDetails:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data.data.goods_list);
        if(data.code==200){
            var list=JSON.parse(jsonBack.data).data.goods_list;
            var goods=this.data.goods;

            for(var i=0;i<list.length;i++){
                goods.push(list[i]);
            }
            this.setData({
                goods:goods,
                text:data.data.cat_name,
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
        }
    },

    time_TabClick: function (e) {
        var that=this;
        var imgURL_Bool=!that.data.imgURL_Bool;
        this.setData({
            imgURL_Bool:!that.data.imgURL_Bool,
            imgURL:(imgURL_Bool==true?'/images/down.png':'/images/up.png'),
            imgURL2:'/images/du.png'
        });
        GMAPI.doSendMsg('Home/cat_goods',
            {cat_id:that.data.listID,sort:(imgURL_Bool?'new_asc':'new_desc'),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''}
            ,'POST',that.onMsgCallBack_ChooseDetails);
    },
    price_TabClick: function (e) {
        var that=this;
        var imgURL_Bool2=!that.data.imgURL_Bool2;
        this.setData({
            imgURL_Bool2:!that.data.imgURL_Bool2,
            imgURL:'/images/du.png',
            imgURL2:(imgURL_Bool2==true?'/images/down.png':'/images/up.png')
        });
        GMAPI.doSendMsg('Home/cat_goods',
            {cat_id:that.data.listID,sort:(imgURL_Bool2?'price_asc':'price_desc'),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''},
            'POST',that.onMsgCallBack_ChooseDetails);
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
    jump_Search:function (e){
        wx.navigateTo({
            url:'/pages/search/search'
        })
    },
    jump_Shop:function (e){
        wx.switchTab({
            url:'/pages/shopping/shopping'
        })
    }
});
