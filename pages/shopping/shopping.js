import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        saveHidden:true,
        totalPrice:0,
        allSelect:true,
        noSelect:false,
        view_Bool:true,
        view_Bool2:true,
        listID:0,
        title:'',
        scrollTop: 0,
        activeID: 0,
        height:null,
        imgURL:app.data.imgURL,
        goods:[],
        rec:[],
        goods_number:[],
        delBtnWidth:120
    },
    onLoad: function () {
        this.initEleWidth();
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
        GMAPI.doSendMsg('addcart/cart_list',{user_id:wx.getStorageSync('strWXID').strUserID,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Shop);
        var shopList =this.data.goods;
        this.setGoodsList(this.getSaveHide(),that.data.totalPrice,true,false,shopList);
    },
    onMsgCallBack_Shop:function (jsonBack){
        var that=this;
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            if(data.data.cart_list.length==0){
                that.setGoodsList(that.getSaveHide(),0,false,true,[]);
            }else{
                this.setData({
                    view_Bool2:(data.data.cart_list.length==0?false:true),
                    view_Bool:false
                });
                this.setData({
                    totalPrice:data.data.money,
                    goods:data.data.cart_list
                });
            }

        }else{
            this.setData({
                view_Bool:true,
                view_Bool2:false
            });
            // wx.showToast({
            //     title:data.msg,
            //     icon:'none',
            //     duration: 2000
            // });
        }
    },
    upper: function(e) {},
    lower: function(e) {},
    scroll: function(e) {},
    tap: function(e){},
    tapMove: function(e) {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    },
    navTo:function(e){
        wx.navigateTo({
            url:'/pages/choose_details/choose_details?id='+e.currentTarget.dataset.index
        })
    },
    tabClick: function (e) {
        this.setData({
            activeID: parseInt(e.currentTarget.dataset.index)
        });
    },
    //获取元素自适应后的实际宽度
    getEleWidth:function(w){
        var real = 0;
        try{
            var res = wx.getSystemInfoSync().windowWidth;
            var scale = (750/2)/(w/2);  //以宽度750px设计稿做宽度的自适应
            real = Math.floor(res/scale);
            return real;
        } catch (e) {
            return false;
        }
    },
    initEleWidth:function(){
        var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
        this.setData({
            delBtnWidth:delBtnWidth
        });
    },
    toIndexPage:function(){
        wx.switchTab({
            url: "/pages/index/index"
        });
    },

    // 删除购物车
    delItem:function(e){
        var id = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        var that=this;
        GMAPI.doSendMsg('addcart/del_cart',{rec_id:id},'POST',that.onMsgCallBack_DeleteShop);
        // var list = this.data.goods;
        // list.splice(index,1);
        // this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
    },
    onMsgCallBack_DeleteShop:function(jsonBack){
        var that=this;
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            GMAPI.doSendMsg('addcart/cart_list',{user_id:wx.getStorageSync('strWXID').strUserID,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_Shop);
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    selectTap:function(e){
        var index = e.currentTarget.dataset.index;
        var list = this.data.goods;
        if(index!=="" && index != null){
            list[parseInt(index)].active = !list[parseInt(index)].active ;
            this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
        }
    },
    totalPrice:function(){
        var list = this.data.goods;
        var total = 0;
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            if(curItem.active){
                total+= parseFloat(curItem.goods_price)*curItem.goods_number;
            }
        }
        total = parseFloat(total.toFixed(2));//js浮点计算bug，取两位小数精度
        return total;
    },
    allSelect:function(){
        var list = this.data.goods;
        var allSelect = true;
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            if(curItem.active){
                allSelect = true;
            }else{
                allSelect = false;
                break;
            }
        }
        return allSelect;
    },
    noSelect:function(){
        var list = this.data.goods;
        var noSelect = 0;
        for(var i = 0 ; i < list.length;i++){
            var curItem = list[i];
            if(!curItem.active){
                noSelect++;
            }
        }

        if(noSelect==list.length){
            return true;
        }else{
            return false;
        }
    },
    setGoodsList:function(saveHidden,total,allSelect,noSelect,list){
        this.setData({
            saveHidden:saveHidden,
            totalPrice:total,
            allSelect:allSelect,
            noSelect:noSelect,
            goods:list
        });
        var shopCarInfo = {};
        var tempNumber = 0;
        shopCarInfo.goods = list;
        for(var i = 0;i<list.length;i++){
            tempNumber = tempNumber + list[i].goods_number
        }
        shopCarInfo.shopNum = tempNumber;
        wx.setStorage({
            key:"shopCarInfo",
            data:shopCarInfo
        })
    },
    bindAllSelect:function(){
        var currentAllSelect = this.data.allSelect;
        var list = this.data.goods;
        if(currentAllSelect){
            for(var i = 0 ; i < list.length ; i++){
                var curItem = list[i];
                curItem.active = false;
            }
        }else{
            for(var i = 0 ; i < list.length ; i++){
                var curItem = list[i];
                curItem.active = true;
            }
        }

        this.setGoodsList(this.getSaveHide(),this.totalPrice(),!currentAllSelect,this.noSelect(),list);
    },
    jiaBtnTap:function(e){
        var index = e.currentTarget.dataset.index;
        var list = this.data.goods;
        if(index!=="" && index != null){
            // if(list[parseInt(index)].goods_number<10){
                list[parseInt(index)].goods_number++;
                this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
            // }
        }

    },
    jianBtnTap:function(e){
        var index = e.currentTarget.dataset.index;
        var list = this.data.goods;
        if(index!=="" && index != null){
            if(list[parseInt(index)].goods_number>1){
                list[parseInt(index)].goods_number-- ;
                this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
            }
        }
    },
    editTap:function(){
        var list = this.data.goods;
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = false;
        }
        this.setGoodsList(!this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
    },
    saveTap:function(){
        var list = this.data.goods;
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = true;
        }
        this.setGoodsList(!this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
    },
    getSaveHide:function(){
        var saveHidden = this.data.saveHidden;
        return saveHidden;
    },
    deleteSelected:function(){
        var list = this.data.goods;
        list = list.filter(function(curGoods) {
            return !curGoods.active;
        });
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
    },
    /*
    * 结算
    * */
    toPayOrder:function(){
        // wx.showLoading();
        var that=this;
        var list = this.data.goods;
        var numb = this.data.goods_number;
        var arr = [],arr_number=[];
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            if(curItem.active){
                arr.push(list[i].rec_id);
                arr_number.push(list[i].goods_number)
            }
        }
        this.setData({
            rec:arr,
            goods_number:arr_number
        });

        GMAPI.doSendMsg('flow/checkinfo',{user_id:wx.getStorageSync('strWXID').strUserID,rec_id:arr,goods_number:that.data.goods_number,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_toPayOrder);
    },
    onMsgCallBack_toPayOrder:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        var that=this;
        if(data.code==200){
            console.log(that.data.rec);
            wx.navigateTo({
                url: '/pages/make_sure_order/make_sure_order?rec_id='+that.data.rec+'&numb='+that.data.goods_number
            })
        }else{
            if(data.data.error==1){
                wx.navigateTo({
                    url: '/pages/my_location/my_location'
                });
            }else{
                wx.showToast({
                    title:data.msg,
                    icon:'none',
                    duration: 2000
                });
            }

        }
    }
});
