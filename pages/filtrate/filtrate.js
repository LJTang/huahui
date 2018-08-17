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
        inputVal:''
    },
    onLoad:function (option) {

        var text='',that=this;
        if(option==0){
           text='开业花篮';
        }else if(option.id==1){
            text='花束';
        }else if(option.id==2){
            text='礼盒';
        }else if(option.id==3){
            text='报桶';
        }else{
            text='专区';
        }
        this.setData({
            title:text
        });
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight - 98
                });

            }
        });
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
        var strMsgSend = GCMAPI.doCreate_gcmMsg_116_GetConnect(0,0,parseInt(this.data.cityTextID),this.data.intPageIndex,1,parseInt(this.data.cityText2ID),this.data.strSearchValue,wx.getStorageSync('strWXOpenID'));
        GZK_Coder.doSendMsgWXSMA(strMsgSend,this.onMsgCallBack_116);
    },
    onSearch:function (){
        this.data.intPageIndex=0;
        this.setData({
            cars:[],
            scrollTop:0,
            noMoreHidden: true,
            loadMoreHidden: true,
            inLoadHidden: false
        });

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
    },
    price_TabClick: function (e) {
        var that=this;
        var imgURL_Bool2=!that.data.imgURL_Bool2;
        this.setData({
            imgURL_Bool2:!that.data.imgURL_Bool2,
            imgURL:'/images/du.png',
            imgURL2:(imgURL_Bool2==true?'/images/down.png':'/images/up.png'),

        });
    },
    jump: function (e) {
        var that=this;
        wx.navigateTo({
            url:'/pages/product_details/product_details'
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
        this.setData({
            view_Boole:false
        })
    }

});
