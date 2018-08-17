import GMAPI from "../../script/api";

const app = getApp();
Page({
    data: {
        listID:0,
        imgURL:app.data.imgURL,
        parent_Array:[],
        goods:[],
        pageID:null,
        title:'',
        scrollTop: 0,
        selected: true,
        selected2: true,
        currentStatu:'open',
        count:0,
        detail:'',
        zuhua_Bool:true,
        gou_Bool:false,
        specifications_select:null,
        goods_id:null,

        gouBox:false, // 弹出框
        zuBox:true, // 弹出框
        activeID:0,
        selected_Color:true,
        hua_Number:1,
        hua_price:0,
        stock:0,
        attr_id:[],
        dataAttr:[],
        isRent:0,
        isBuy:0,
        ya_price:0,
        buy_price:0,
        zj_price:0,
        amount:0,


    },
    onLoad:function (option) {
        var that=this;

    },
    onShow:function (option) {
        var that=this;
        GMAPI.doSendMsg('Home/shop',{wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,session_id:''},'GET',that.onMsgCallBack_ShangPin);
        GMAPI.doSendMsg('addcart/cart_count', {user_id:wx.getStorageSync('strWXID').strUserID},'POST',that.onMsgCallBack_Count);

    },
    onMsgCallBack_ShangPin:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            var list=JSON.parse(jsonBack.data).data;
            var goods=[];
            for(var i=0;i<list.length;i++){
                goods.push(list[i]);
            }
            this.setData({
                parent_Array:goods,
                loadingHidden:true
            });
        }
    },
    onMsgCallBack_Count:function(jsonBack){
        var data=JSON.parse(jsonBack.data);
        this.setData({
            count:data.data
        });
    },
    upper: function(e) {},
    lower: function(e){},
    scroll: function(e) {},
    tap: function(e){},
    tapMove: function(e) {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    },
    jump_ChooseDetails:function(e){
        wx.navigateTo({
            url:'/pages/choose_details/choose_details?id='+e.currentTarget.dataset.id
        })
    },
    jump_ZuHua:function(e){
        wx.navigateTo({
            url:'/pages/zuhua_details/zuhua_details'
        })
    },

    choose_Specifications:function(e){
        this.setData({
            specifications_select:e.currentTarget.dataset.index
        })
    },
    // tabClick: function (e) {
    //     this.setData({
    //         activeID: parseInt(e.currentTarget.dataset.index)
    //     });
    // },
    tabClick: function (e) {
        var that = this;
        that.setData({
            selected:!that.data.selected
        })
    },
    tabClick2: function (e) {
        var that = this;
        that.setData({
            selected2:!that.data.selected2
        })
    },
    jump_Search:function (e){
        wx.navigateTo({
            url:'/pages/search/search'
        })
    },
    jump_Shop:function (){
        wx.switchTab({
            url:'/pages/shopping/shopping'
        })
    },

    onMsgCallBack_ProductDetails:function (jsonBack){
        var data=JSON.parse(jsonBack.data).data;
        if(JSON.parse(jsonBack.data).code==200){
            this.setData({
                goods:data,
                isRent:data.detail.is_rent,
                isBuy:data.detail.is_buy,
                buy_price:data.detail.amount,
                zj_price:data.detail.amount,
                amount:data.detail.deposit,
                unitPrice:data.detail.goods_price,
                stock:data.detail.goods_number,
                dataAttr:data.attr
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    /**
     * ***改变显示
     * **/
    transform:function(e){
        var status=e.currentTarget.dataset.statu;
        var that=this;
        this.setData({
            gouBox:(status==1?false:true),
            zuBox:(status==0?false:true),
            hua_Number:1
        });
        GMAPI.doSendMsg('home/goods_detail',{goods_id:that.data.goods_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,type:(status==1?'':'is_rent')},'POST',that.onMsgCallBack_ProductDetails);
    },
    /**
     * 根据规格改变价格
     * **/
    changePrice:function(e){
        var that=this;
        var attr_id=e.currentTarget.dataset.id;
        var index=e.currentTarget.dataset.index;
        var list=this.data.dataAttr;
        var ide=[];
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list[i].values.length;j++){
                if(attr_id == list[index].values[j].goods_attr_id){
                    list[index].values[j].type = true;
                }else{
                    list[index].values[j].type = false;
                }
                if( list[i].values[j].type == true){
                    ide.push(list[i].values[j].goods_attr_id);
                }
            }
        }
        this.setData({
            specifications_select:e.currentTarget.dataset.index,
            selected_Color:e.currentTarget.dataset.index,
            dataAttr:list
        });

        var json={goods_id:that.data.goods_id,attr_id:ide,type:(that.data.gouBox==true?'is_rent':'')};
        GMAPI.doSendMsg('home/change_price',json,'POST',that.onMsgCallBack_changePrice);
    },
    onMsgCallBack_changePrice:function(jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                amount:data.data.detail.amount,
                zj_price:data.data.detail.amount,
                yu_price:data.data.detail.spec_price,
                unitPrice:data.data.detail.goods_price,
                stock:data.data.detail.stock
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration:2000
            });
        }
    },
    //选择颜色
    selectedColor: function (e) {
        var that=this;
        this.setData({
            selected_Color:!that.data.selected_Color
        });
    },
    //天数
    onDays: function (e) {
        var that = this;
        this.setData({
            activeID: parseInt(e.currentTarget.dataset.index)
        });
    },
    appendBlock: function (e) {
        var that=this;
        this.setData({
            hua_Number:that.data.hua_Number+1,
            zj_price:(that.data.hua_Number+1)*that.data.buy_price
        });
    },
    //减
    decrease: function (e) {
        var that=this;
        this.setData({
            hua_Number:(that.data.hua_Number==1?1:that.data.hua_Number-1),
            zj_price:(that.data.hua_Number==1?1:that.data.hua_Number-1)*that.data.buy_price
        })
    },
    /**
     * 直接购买
     * **/
    directPurchase:function(e){
        var list=this.data.dataAttr;
        var statu=e.currentTarget.dataset.statu;
        var ide=[];
        for(var i=0;i<list.length;i++){

            for(var j=0;j<list[i].values.length;j++){
                if( list[i].values[j].type == true){
                    ide.push(list[i].values[j].goods_attr_id);
                }
            }
        }
        this.setData({
            attr_id:ide
        });
        var that=this;
        var json={user_id:wx.getStorageSync('strWXID').strUserID,attr_id:ide,goods_id:that.data.goods_id,type:statu,goods_number:that.data.hua_Number,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
        GMAPI.doSendMsg('flow/zj_buy',json,'POST',that.onMsgCallBack_AnOrder);
    },
    onMsgCallBack_AnOrder:function(jsonBack){
        var that=this;
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.setStorage({
                key: 'direct_purchase',
                data:data
            });
            this.util('close');
            wx.navigateTo({
                url:'/pages/zuhua/zuhua'
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
    },
    //拨打客服
    onMakePhoneCall:function (){
        wx.makePhoneCall({
            phoneNumber: '17521107021'
        })
    },
    /** 弹出框 **/
    openPowerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        var index=e.currentTarget.dataset.index;
        var id=e.currentTarget.dataset.id;
        var that=this;
        this.setData({
            goods_id:id,
            hua_Number:1
        });

        if(wx.getStorageSync('strWXID').strWXOpenID==undefined){
            wx.switchTab({
                url: '/pages/my/index'
            })
        }else {
            GMAPI.doSendMsg('home/goods_detail', {goods_id: id, wx_open_id: wx.getStorageSync('strWXID').strWXOpenID,type:(index == 0 ? '' : 'is_rent')}, 'POST', that.onMsgCallBack_ProductDetails);
            this.util(currentStatu);
        }
    },
    powerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        if (currentStatu == "open") {
            this.util(currentStatu);
            this.setData({
                currentStatu:'close'
            });
        }else{
            this.util(currentStatu);
            this.setData({
                currentStatu:'open'
            });
        }
    },
    util: function(currentStatu){
        /* 动画部分 */
        // 第1步：创建动画实例
        var animation = wx.createAnimation({
            duration: 200, //动画时长
            timingFunction: "linear", //线性
            delay: 0 //0则不延迟
        });
        // 第2步：这个动画实例赋给当前的动画实例
        this.animation = animation;

        // 第3步：执行第一组动画
        animation.opacity(0).translateY(200).step();

        // 第4步：导出动画对象赋给数据对象储存
        this.setData({
            animationData: animation.export()
        });

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function () {
            // 执行第二组动画
            animation.opacity(1).translateY(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            });

            //关闭
            if (currentStatu == "close") {
                this.setData({
                    vehicleParameters: false
                });
            }
        }.bind(this), 200);
        // 显示
        if (currentStatu == "open") {
            this.setData({
                vehicleParameters: true,
                remark_Hide: true
            });
        }
    },


    onMsgCallBack_Specification:function(jsonBack){
        var data=JSON.parse(jsonBack.data);

        if(data.code==200){
            this.setData({
                detail:data.data.detail,
                hua_price:data.data.detail.between_price,
                stock:data.data.detail.goods_number,
                dataAttr:data.data.attr
            });
        }else{

        }
    },

    /**
     * 直接购买
     * **/
    /*
    directPurchase:function(){
        var that=this;
        var json={user_id:wx.getStorageSync('strWXID').strUserID,attr_id:[],goods_id:that.data.goods_id,type:1,goods_number:1,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
        GMAPI.doSendMsg('flow/zj_buy',json,'POST',that.onMsgCallBack_AnOrder);

    },
    onMsgCallBack_AnOrder:function(jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                order:data.data
            });
            wx.setStorage({
                key: 'direct_purchase',
                data:data
            });
            wx.navigateTo({
                url:'/pages/zuhua/zuhua'
            })


        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    */

});
