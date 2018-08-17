import GMAPI from "../../script/api";

const app = getApp();
Page({
    data: {
        listID:0,
        title:'',
        activeID:0,
        view_Boole:true,
        imgURL_Bool:true,
        imgURL_Bool2:true,
        imgURL:'/images/down.png',
        imgURL2:'/images/du.png',
        inputVal:'',
        goods:[],
        hot:[]
    },
    onLoad:function (option) {
        var that=this;
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight - 98
                });

            }
        });
        var that=this;
        this.setData({
            hot:[],
            goods:[]
        });
        // GMAPI.doSendMsg('search/goods',{keywords:carID,keywords:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_DIY_Search);
        GMAPI.doSendMsg('search/hot_search','','POST',that.onMsgCallBack_Hot_Search);

    },
    onShow:function () {
        // var that=this;
        // this.setData({
        //     hot:[],
        //     goods:[]
        // });
        // GMAPI.doSendMsg('search/goods',{keywords:carID,keywords:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_DIY_Search);
        // GMAPI.doSendMsg('search/hot_search','','POST',that.onMsgCallBack_Hot_Search);

        // GMAPI.doSendMsg('search/goods',{keywords:that.data.inputVal,type:1},'POST',that.onMsgCallBack_Search);

    },
    onMsgCallBack_Hot_Search:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                // goods:data.data.list,
                hot:data.data.list
            });

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    onMsgCallBack_Search:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            var list=data.data.goods_list;
            var goods=[];
            for(var i=0;i<list.length;i++){
                goods.push(list[i]);
            }
            this.setData({
                goods:goods,
            });

        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    clearInput: function (){
        this.setData({
            inputVal:'',
            strSearchValue:'',
            inputShowed: true
        });
        // this.onSearch();
    },
    getFocus: function (e) {
        this.setData({
            inputVal: e.detail.value,
            strSearchValue: e.detail.value
        });
    },
    searchBtn:function (e){
        this.hide_Or_Show();
        // this.onSearch();
    },
    onGetConnect:function (){
        this.setData({
            noMoreHidden: true,
            loadMoreHidden: true,
            inLoadHidden: false
        });
    },
    onSearch:function (e){
        var text=e.currentTarget.dataset.text;
        this.setData({
            inputVal:text
        });
        this.hide_Or_Show();
        // var strMsgSend = GCMAPI.doCreate_gcmMsg_116_GetConnect(0,0,parseInt(this.data.cityTextID),this.data.intPageIndex,1,parseInt(this.data.cityText2ID),this.data.strSearchValue,wx.getStorageSync('strWXOpenID'));
        // GZK_Coder.doSendMsgWXSMA(strMsgSend,this.onMsgCallBack_116);
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
    scroll: function(){},
    tap: function (e){},
    tapMove: function (e){},
    time_TabClick: function (e) {
        var that=this;
        var imgURL_Bool=!that.data.imgURL_Bool;
        this.setData({
            imgURL_Bool:!that.data.imgURL_Bool,
            imgURL:(imgURL_Bool==true?'/images/down.png':'/images/up.png'),
            imgURL2:'/images/du.png'
        });
        // GMAPI.doSendMsg('home/cat_goods',{cat_id:that.data.listID,sort:(imgURL_Bool?'new_asc':'new_desc'),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''},'POST',that.onMsgCallBack_Search);
        GMAPI.doSendMsg('search/goods',{keywords:that.data.inputVal,type:1,sort:(imgURL_Bool?'new_asc':'new_desc')},'POST',that.onMsgCallBack_Search);
        },
    price_TabClick: function (e) {
        var that=this;
        var imgURL_Bool2=!that.data.imgURL_Bool2;
        this.setData({
            imgURL_Bool2:!that.data.imgURL_Bool2,
            imgURL:'/images/du.png',
            imgURL2:(imgURL_Bool2==true?'/images/down.png':'/images/up.png')
        });
        // GMAPI.doSendMsg('home/cat_goods',{cat_id:that.data.listID,sort:(imgURL_Bool2?'price_asc':'price_desc'),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''}, 'POST',that.onMsgCallBack_Search);
        GMAPI.doSendMsg('search/goods',{keywords:that.data.inputVal,type:1,sort:(imgURL_Bool2?'price_asc':'price_desc')},'POST',that.onMsgCallBack_Search);
    },
    jump_Details: function (e) {
        var that=this;
        wx.navigateTo({
            url:'/pages/product_details/product_details?id='+e.currentTarget.dataset.id
        })
    },
    tabClick: function (e) {
        var index=parseInt(e.currentTarget.dataset.index);
        this.setData({
            activeID: parseInt(e.currentTarget.dataset.index),
            imgURL:(index==0?'/images/down.png':'/images.du.png')
        });
    },
    hide_Or_Show: function (e) {
        var that=this;
        this.setData({
            view_Boole:false
        });
        GMAPI.doSendMsg('search/goods',{keywords:that.data.inputVal,type:1,sort:''},'POST',that.onMsgCallBack_Search);
    }

});
