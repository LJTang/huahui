import GMAPI from "../../script/api";

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
        show: show,
        provinces: provinces,
        citys: citys,
        countys: countys,
        value: [-1, -1, -1],
        listID:0,
        title:'',
        off_Bool:true,
        height:null,
        addCity:'',
        address_id:'',
        status:0
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
    onLoad: function (options) {
        var status = parseInt(options.status);
        var that = this;
        var date = new Date();
        // console.log(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日");
        //获取省市区县数据
        area.getAreaInfo(function (arr) {
            areaInfo = arr;
            //获取省份数据
            getProvinceData(that);
        });
        wx.setNavigationBarTitle({
            title:(status==0?'新增地址':'修改地址')
        });
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    height:res.windowHeight
                });
            }
        });
        if(status==1){
            console.log(wx.getStorageSync('address'));

            this.setData({
                status:status,
                address_id:wx.getStorageSync('address').address_id,
                mobile:wx.getStorageSync('address').mobile,
                address:wx.getStorageSync('address').address,
                consignee:wx.getStorageSync('address').consignee,
                city:wx.getStorageSync('address').city
            });
        }
        // GMAPI.doSendMsg('home/diy', {cat_id:carID,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID},'POST',that.onMsgCallBack_DIY_Area);
    },
    onMsgCallBack_DIY_Area:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            var list=JSON.parse(jsonBack.data).data.goods_list;
            this.setData({
                goods:JSON.parse(jsonBack.data).data.goods_list,
                goodsList:JSON.parse(jsonBack.data).data.cat
            });

        }
    },
    // input值
    getFocus: function (e) {
        var statu=e.currentTarget.dataset.statu;
        if(statu=='consignee') {
            this.setData({
                consignee: e.detail.value
            });
        }else if(statu=='mobile'){
            this.setData({
                mobile: e.detail.value
            });
        }else if(statu=='textarea'){
            this.setData({
                address: e.detail.value
            });
        }else{

        }
    },
    //保存
    onSave:function(){
        var that=this;
        var addCity=that.data.province+','+(that.data.city=='市辖区'||that.data.city=='县'?'':that.data.city)+(this.data.city==''?'':',')+(that.data.county=='市辖区'?'':that.data.county);
        if(that.data.consignee=='') {
            wx.showToast({
                title: '请输入收货人',
                icon: 'none',
                duration: 2000
            });
        }else if(that.data.mobile==''||GMAPI.checkPhone(that.data.mobile)==false){
            wx.showToast({
                title: '请输入正确的手机号码',
                icon: 'none',
                duration: 2000
            });
        }else if(addCity==''){
            wx.showToast({
                title: '请选择收货地区',
                icon: 'none',
                duration: 2000
            });
        }else if(that.data.textarea==''){
            wx.showToast({
                title: '请输入详细地址',
                icon: 'none',
                duration: 2000
            });
        }else{
            var json={user_id:wx.getStorageSync('strWXID').strUserID,consignee:that.data.consignee,city:addCity,address:that.data.address,mobile:that.data.mobile,is_default:(that.data.off_Bool==true?1:0),wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
            console.log(json);
            if(that.data.status==0){
                GMAPI.doSendMsg('home/add_address',json,'POST',that.onMsgCallBack_Save);
            }else{
                var jsons={user_id:wx.getStorageSync('strWXID').strUserID,address_id:that.data.address_id,is_default:1,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
                GMAPI.doSendMsg('home/edit_address',jsons,'POST',that.onMsgCallBack_SetArea);
            }
        }

    },
    onMsgCallBack_Save:function(jsonBack){
        var that=this;
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            wx.navigateBack({
                delta:1
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },

    onMsgCallBack_SetArea:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
            wx.navigateBack({
                delta:1
            })
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },
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
    );
    that.animation.translateY(moveY + 'vh').step();

    that.setData({
        animation: that.animation.export(),
        show: show
    })

}
// ---------------- 分割线 ----------------
//获取省份数据
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
        province: "",
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
