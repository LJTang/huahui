import GMAPI from "../../script/api";
var app = getApp();
var server = require('../../utils/server');
Page({
    data: {
        banner_Img: [],
        imgURL:app.data.imgURL,
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        goods:[],
        goodsList:[],
        cart: {
            count: 0,
            total: 0
        },
        cart_List:[],
        showCartDetail: false,
        height: null,
        classifySeleted:0,
        listID:0,
        cart_Number:0
    },
    onLoad: function (options) {
        var that=this;
        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight - (rpx*100+rpx*20)-180
                });

            }
        });
        that.onGetConnect();
        GMAPI.doSendMsg('home/diy_banner', '','POST',that.onMsgCallBack_DIY_Banner);
    },
    onShow: function () {
        this.setData({
            classifySeleted: 0
        });
    },
    //请求数据
    onGetConnect:function (){
        this.setData({
            noMoreHidden: true,
            loadMoreHidden: true,
            inLoadHidden: false
        });
        var that=this;
        var carID=that.data.listID;
        GMAPI.doSendMsg('home/diy', {cat_id:carID,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_DIY_Area);
    },
    onMsgCallBack_DIY_Area:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            // var list=JSON.parse(jsonBack.data).data.goods_list;
            this.setData({
                goods:data.data.goods_list,
                goodsList:data.data.cat
            });

        }
    },
//轮播图
    onMsgCallBack_DIY_Banner:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                banner_Img:data.data
            });
        }
    },
    //  加减按钮
    tapAddCart: function (e) {
        var that=this;
        var id=e.currentTarget.dataset.id;
        var index=e.currentTarget.dataset.index;
        var goods = this.data.goods[index];
        goods.quantity =1;
        var arr=this.data.cart_List;
        var is_chongfu = false;
        if(arr.length!=0){
            for(var i=0;i<arr.length;i++){
                if(arr[i].id==id){
                    arr[i].quantity = parseInt(arr[i].quantity)+parseInt(1);
                    is_chongfu = true;
                }
            }
            if(!is_chongfu){
                arr.push(goods);
            }
        }else{
            arr.push(goods);
        }
        this.setData({
            cart_List:arr,
        });
        this.addCart();
    },
    addCart: function () {
        var list=this.data.cart_List;
        var count=0,total = 0;
        for(var i=0;i<list.length;i++){
            count+= parseInt(list[i].quantity);
            total+= parseInt(list[i].quantity)*list[i].goods_price;
        }
        this.data.cart.count = count;
        this.data.cart.total = this.toDecimal(total);
        this.setData({
            cart: this.data.cart
        });

    },
    //  弹出框减按钮
    tapReduceCart: function (e) {
        this.reduceCart(e.currentTarget.dataset.index);
    },
    reduceCart: function (index) {
        var list=this.data.cart_List;
         var count=this.data.cart.count;
         var total=this.data.cart.total;
        list[index].quantity = list[index].quantity -1;
        total = total - parseInt(list[index].goods_price);
        count = count -1;

        if(list[index].quantity ==0){
            list.splice(index,1);
        }
        this.data.cart.count = count;
        this.data.cart.total = this.toDecimal(total);
        this.setData({
            cart: this.data.cart,
            cart_List:list
        });
    },
    //保留两位小数
    toDecimal:function(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    },
    follow: function () {
            this.setData({
                followed: !this.data.followed
            });
        },
    //Scroll 滑动
    onGoodsScroll: function (e) {
        if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
            this.setData({
                scrollDown: true
            });
        } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
            this.setData({
                scrollDown: false
            });
        }

        var scale = e.detail.scrollWidth / 570,
            scrollTop = e.detail.scrollTop / scale,
            h = 0,
            classifySeleted,
            len = this.data.goodsList.length;
        this.data.goodsList.forEach(function (classify, i) {
            var _h = 70 + classify.goods.length * (46 * 3 + 20 * 2);
            if (scrollTop >= h - 100 / scale) {
                classifySeleted = classify.id;
            }
            h += _h;
        });
        this.setData({
            classifySeleted: classifySeleted
        });
    },
    // 左边栏按钮事件
    tapClassify: function (e) {
        var id =e.currentTarget.dataset.id;
        var index =e.currentTarget.dataset.statu;
        this.setData({
            classifySeleted:index,
            listID:id,
            goods:[]
        });
        // var self = this;
        // setTimeout(function () {
        //     self.setData({
        //         classifySeleted: index,
        //         listID:id
        //     });
        // }, 100);
        this.onGetConnect();
    },
    //弹出框隐藏显示
    showCartDetail: function () {
        this.setData({
            showCartDetail: !this.data.showCartDetail
        });
    },
    hideCartDetail: function () {
        this.setData({
            showCartDetail: false
        });
    },
    submit: function (e) {
        var that=this;
        this.setData({
            showCartDetail: false
        });
        var list=this.data.cart_List;
        var count=[],cart_ListID = [];
        if(wx.getStorageSync('strWXID').strWXOpenID==undefined){
            wx.switchTab({
                url: '/pages/my/index'
            })
        }else {
            for (var i = 0; i < list.length; i++) {
                count.push(list[i].quantity);
                cart_ListID.push(list[i].id);
            }
            wx.showLoading({
                title: '加载中',
            });
            GMAPI.doSendMsg('addcart/adddiy_cart', {
                user_id: wx.getStorageSync('strWXID').strUserID,
                goods_id: cart_ListID,
                goods_number: count,
                wx_open_id: wx.getStorageSync('strWXID').strWXOpenID
            }, 'POST', that.onMsgCallBack_Submit);
        }
    },
    onMsgCallBack_Submit:function(jsonBack){
        wx.hideLoading();
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            wx.switchTab({
                url: '/pages/shopping/shopping'
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    jump_Search:function (e){
        wx.navigateTo({
            url:'/pages/search/search'
        })
    }
});

