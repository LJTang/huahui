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
        console.log(parseInt(option.id));
        var text='',that=this;
        if(option.id==0){
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
            listID:parseInt(option.id)
            // title:text
        });
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight-(rpx*170)
                });

            }
        });
        GMAPI.doSendMsg('Home/cat_goods',
            {cat_id:parseInt(option.id),sort:'new_asc',wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''}
            ,'POST',that.onMsgCallBack_ChooseDetails);

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
                title:data.data.cat_name,
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
        GMAPI.doSendMsg('Home/cat_goods',
            {cat_id:that.data.listID,sort:(imgURL_Bool?'new_asc':'new_desc'),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''},
            'POST',that.onMsgCallBack_ChooseDetails);


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

        GMAPI.doSendMsg('Home/cat_goods',
            {cat_id:that.data.listID,sort:(imgURL_Bool2?'price_asc':'price_desc'),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''},
            'POST',that.onMsgCallBack_ChooseDetails);
    },
    jump_ProductDetails: function (e) {
        var that=this;
        console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
            url:'/pages/product_details/product_details?id='+e.currentTarget.dataset.id
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
