import GMAPI from "../../script/api";
var WxParse = require('../../wxParse/wxParse.js');
var area = require('../../utils/area.js');
var areaInfo = [];//所有省市区县数据
var provinces = [];//省
var citys = [];//城市
var countys = [];//区县
var index = [0, 0, 0];
var cellId;
var t = 0;
var show = false;
var moveY = 200;
const app = getApp();
Page({
    data: {
        goods_id:0,
        showView:false,
        show: show,
        provinces: provinces,
        citys: citys,
        countys: countys,
        value: [-1, -1, -1],
        off_Bool:true,
        newAddress_Bool:false,
        address_Bool:true,
        height:null,
        gouBox:true, // 弹出框
        zuBox:true, // 弹出框
        activeID:0,
        selected_Color:true,
        hua_Number:1,
        hua_price:0,
        ya_price:0,
        zj_price:0,
        amount:0,
        stock:0,
        attr_id:[],
        is_BuyOrRent:0,
        goods:'',
        goodsImg:'',
        goodsName:'',
        description:'',
        goodsPrice:'',
        goodsDesc:'',
        isRent:null,
        isBuy:null,
        rentPrice:null,
        top_IMGURL:app.data.imgURL,
        currentStatu:'open',
        count:0,
        zuhua_Bool:true,
        gou_Bool:false,
        gallery_list:[]
    },
    //滑动事件
    bindChange: function (e) {
        var val = e.detail.value;
        //判断滑动的是第几个column
        //若省份column做了滑动则定位到地级市和区县第一位
        if (index[0] != val[0]) {
            val[1] = 0;
            val[2] = 0;
            getCityArr(val[0], this);//获取地级市数据
            getCountyInfo(val[0], val[1], this);//获取区县数据
        } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
            if (index[1] != val[1]) {
                val[2] = 0;
                getCountyInfo(val[0], val[1], this);//获取区县数据
            }
        }
        index = val;
        //更新数据
        this.setData({
            value: [val[0], val[1], val[2]],
            province: provinces[val[0]].name,
            city: citys[val[1]].name,
            county: countys[val[2]].name
        })

    },
    onLoad:function (option) {
        var that=this;
        //获取省市区县数据
        area.getAreaInfo(function (arr) {
            areaInfo = arr;
            //获取省份数据
            getProvinceData(that);
        });
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    height:res.windowHeight,
                    goodsID:option.id
                });
            }
        });
        this.setData({
            goods_id:parseInt(option.id)
        });
        GMAPI.doSendMsg('home/goods_detail',{goods_id:parseInt(option.id),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID,type:''},'POST',that.onMsgCallBack_ProductDetails);

        // GMAPI.doSendMsg('addcart/cart_count', {user_id:wx.getStorageSync('strWXID').strUserID},'POST',that.onMsgCallBack_Count);
    },
    onMsgCallBack_Count:function(jsonBack){
        var data=JSON.parse(jsonBack.data);
        this.setData({
            count:data.data
        });
    },
    onMsgCallBack_ProductDetails:function (jsonBack){
        var obj=this;
        var data=JSON.parse(jsonBack.data).data;
        if(JSON.parse(jsonBack.data).code==200){
            this.setData({
                goods:data,
                isRent:data.detail.is_rent,
                isBuy:data.detail.is_buy,
                hua_price:data.detail.goods_price,
                ya_price:data.detail.deposit,
                amount:data.detail.amount,
                zj_price:data.detail.amount,
                stock:data.detail.goods_number,
                dataAttr:data.attr,
                gallery_list:data.gallery_list
            });
            var article = data.detail.goods_desc;
            WxParse.wxParse('article', 'html',article, obj, 5);
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
    /**
     * 协议框
     * **/
    agreedTo:function(e){
        var status=e.currentTarget.dataset.status;
        this.setData({
            agreement_Bool:true
        });

    },
    agreed_No:function(e){
        var status=e.currentTarget.dataset.status;
        this.setData({
            agreement_Bool:true
        });
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
    jump_Shop:function (){

    },
    jump_ZuHua:function (event){
        this.setData({
            zuhua_Bool:!this.data.zuhua_Bool
        });
    },
    choose_Specifications:function(e){
        this.setData({
            specifications_select:e.currentTarget.dataset.index
        })
    },
    tabClick: function (e) {
        var that = this;
        that.setData({
            selected:!that.data.selected
        })
    },
    /**
     * 根据规格改变价格
     * **/
    changePrice:function(e){
        var that=this;
        // var id=e.currentTarget.dataset.idx;
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
                ya_price:data.data.detail.amount,
                // zj_price:data.data.detail.goods_price,
                zj_price:data.data.detail.amount,
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
    //加
    appendBlock: function (e) {
        var that=this;
        this.setData({
            hua_Number:that.data.hua_Number+1,
            zj_price:(that.data.hua_Number+1)*that.data.amount
        });
    },
    //减
    decrease: function (e) {
        var that=this;
        this.setData({
            hua_Number:(that.data.hua_Number==1?1:that.data.hua_Number-1),
            zj_price:(that.data.hua_Number==1?1:that.data.hua_Number-1)*that.data.amount
        })
    },

    /**
     * 直接购买
     * **/
    directPurchase:function(e){
        var that=this;
        var list=this.data.dataAttr;
        var statu=e.currentTarget.dataset.statu;
        var ide=[];
        for (var i = 0; i < list.length; i++) {

            for (var j = 0; j < list[i].values.length; j++) {
                if (list[i].values[j].type == true) {
                    ide.push(list[i].values[j].goods_attr_id);
                }
            }
        }
        this.setData({
            attr_id: ide
        });

        var json = {
            user_id: wx.getStorageSync('strWXID').strUserID,
            attr_id: ide,
            goods_id: that.data.goods_id,
            type: statu,
            goods_number: that.data.hua_Number,
            wx_open_id: wx.getStorageSync('strWXID').strWXOpenID
        };
        GMAPI.doSendMsg('flow/zj_buy', json, 'POST', that.onMsgCallBack_AnOrder);
    },
    onMsgCallBack_AnOrder:function(jsonBack){
        var that=this;
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            this.setData({
                order:data.data
            });
            wx.setStorage({
                key: 'direct_purchase',
                data:data
            });
            this.util('close');
            wx.navigateTo({
                // url:'/pages/make_sure_order/make_sure_order'
                url:'/pages/zuhua/zuhua'
            })
            // var json={user_id:wx.getStorageSync('strWXID').strUserID,attr_id:that.data.attr_id,goods_id:that.data.goods_id,goods_number:1,bonus_id:'',goods_use:'',type:2, wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
            // console.log(json);
            // GMAPI.doSendMsg('flow/zj_buy_order',json,'POST',that.onMsgCallBack_PayOrder);
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
    onMsgCallBack_PayOrder:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data);
        var that=this;
        if(data.code==200){
            GMAPI.doSendMsg('wxpayment/pay',{user_id:wx.getStorageSync('strWXID').strUserID,order_id:data.order_id,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_WXPay);
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },

    onMsgCallBack_WXPay:function (jsonBack){
        wx.hideLoading();
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.requestPayment({
                'timeStamp': data.data.timeStamp,
                'nonceStr':data.data.nonceStr,
                'package': data.data.package,
                'signType': data.data.signType,
                'paySign':data.data.paySign,
                'success': function (res) {
                    wx.showToast({
                        title:data.msg,
                        icon:'none',
                        duration: 2000
                    });
                    if (res.errMsg = 'requestPayment:ok') {
                        wx.switchTab({
                            url: '/pages/my_index/my_index'
                        })
                    } else {
                    }
                },
                'fail': function (res) {
                    console.log(res);
                    wx.showToast({
                        title:data.msg,
                        icon:'none',
                        duration: 2000
                    });
                },
                'complete': function (res) {
                    // wx.showLoading({
                    //     title: '222...'
                    // });
                }
            })
        }
    },
    //拨打客服
    onMakePhoneCall:function (){
        wx.makePhoneCall({
            phoneNumber: '17521107021'
        })
    },
/**************************************/
    onReady: function () {
        this.animation = wx.createAnimation({
                transformOrigin: "50% 50%",
                duration: 0,
                timingFunction: "ease",
                delay: 0
            }
        )
        this.animation.translateY(200 + 'vh').step();
        this.setData({
            animation: this.animation.export(),
            show: show
        })
    },
    //移动按钮点击事件
    translate: function (e) {
        if (t == 0) {
            moveY = 0;
            show = false;
            t = 1;
        } else {
            moveY = 200;
            show = true;
            t = 0;
        }
        // this.animation.translate(arr[0], arr[1]).step();
        animationEvents(this,moveY, show);

    },
    //隐藏弹窗浮层
    hiddenFloatView(e){
        console.log(e);
        moveY = 200;
        show = true;
        t = 0;
        animationEvents(this,moveY, show);

    },
    //页面滑至底部事件
    onReachBottom: function () {
        // Do something when page reach bottom.
    },

    off:function (){
        var that=this;
        this.setData({
            off_Bool:!that.data.off_Bool
        })
    },
    address:function (){
        var that=this;
        this.setData({
            address_Bool:false,
            newAddress_Bool:true
        })
    },
    /*
    * **立即购买
    * */
    onBuy:function(){
        var that=this;
        var json={user_id:wx.getStorageSync('strWXID').strUserID,goods_id:[that.data.goods.id],goods_number:'1',wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
        GMAPI.doSendMsg('addcart/adddiy_cart',json,'POST',that.onMsgCallBack_Buy);
    },
    onMsgCallBack_Buy:function (jsonBack){
        var obj = this;
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
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
    /**
     *规格
     *
     */
    openPowerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        var index=e.currentTarget.dataset.index;
        var that=this;
        this.setData({
            gouBox:(index==0?false:true),
            zuBox:(index==1?false:true),
            hua_Number:1
        });

        if(wx.getStorageSync('strWXID').strWXOpenID==undefined){
            wx.switchTab({
                url: '/pages/my/index'
            })
        }else{
            GMAPI.doSendMsg('home/goods_detail', {
                goods_id: that.data.goods_id,
                wx_open_id: wx.getStorageSync('strWXID').strWXOpenID,
                type: (index == 0 ? '' : 'is_rent')
            }, 'POST', that.onMsgCallBack_ProductDetails);
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
        this.setData({
        })
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
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画
        setTimeout(function () {
            // 执行第二组动画
            animation.opacity(1).translateY(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
            this.setData({
                animationData: animation
            })

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
    }
});

//动画事件
function animationEvents(that,moveY,show){
    console.log("moveY:" + moveY + "\nshow:" + show);
    that.animation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 400,
            timingFunction: "ease",
            delay: 0
        }
    )
    that.animation.translateY(moveY + 'vh').step()

    that.setData({
        animation: that.animation.export(),
        show: show
    })

}

function getProvinceData(that) {
    var s;
    provinces = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
        s = areaInfo[i];
        if (s.di == "00" && s.xian == "00") {
            provinces[num] = s;
            num++;
        }
    }
    that.setData({
        provinces: provinces
    })

    //初始化调一次
    getCityArr(0, that);
    getCountyInfo(0, 0, that);
    that.setData({
        province: "请选择收货地区",
        city: "",
        county: "",
    })

}
// 获取地级市数据
function getCityArr(count, that) {
    var c;
    citys = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
        c = areaInfo[i];
        if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
            citys[num] = c;
            num++;
        }
    }
    if (citys.length == 0) {
        citys[0] = { name: '' };
    }

    that.setData({
        city: "",
        citys: citys,
        value: [count, 0, 0]
    })
}
// 获取区县数据
function getCountyInfo(column0, column1, that) {
    var c;
    countys = [];
    var num = 0;
    for (var i = 0; i < areaInfo.length; i++) {
        c = areaInfo[i];
        if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
            countys[num] = c;
            num++;
        }
    }
    if(countys.length == 0){
        countys[0] = {name:''};
    }
    that.setData({
        county: "",
        countys: countys,
        value: [column0, column1, 0]
    })
}