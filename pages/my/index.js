import GMAPI from '../../script/api.js';
//获取应用实例
const app = getApp();
Page({
    data: {
        imgURL:app.data.imgURL,
        indicatorDots: true,
        getUserInfo:false,
        wxName:'',
        userInfo:wx.getStorageSync('getUserInfo'),
        my_UserInfo:(wx.getStorageSync('getUserInfo')==true?false:true),
        intervarID:'',
        clock: '',
        goods: [],
        height:null,
        activeID:0,
        isData:null,
        loadingHidden: false,
        noMoreHidden: true,
        loadMoreHidden: true,
        inLoadHidden: false
    },
    onLoad:function () {
        var that=this;
        this.setData({
            userInfo:wx.getStorageSync('getUserInfo'),
            my_UserInfo:(wx.getStorageSync('getUserInfo')==true?false:true),
            imgURL:(wx.getStorageSync('getUserInfo')==true?app.globalData.userInfo.avatarUrl:''),
            wxName:(wx.getStorageSync('getUserInfo')==true?app.globalData.userInfo.nickName:'')
        });

        wx.getSystemInfo({
            success: function (res) {
                var rpx=(res.windowWidth / 750);
                that.setData({
                    height: res.windowHeight - (rpx*200)-51
                });

            }
        });

    },
    onShow:function (){
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
    scroll: function() {},
    tap: function (e){},
    tapMove: function (e){},

    nacTo:function(){
        wx.navigateTo({
            url: '/pages/vip/vip'
        })
    },

    onGotUserInfo: function(e) {
        var that=this;
        if(e.detail.errMsg=='getUserInfo:ok'){
            wx.setStorage({
                key: 'getUserInfo',
                data: true
            });
            this.setData({
                userInfo:true,
                my_UserInfo:false,
                imgURL:e.detail.userInfo.avatarUrl
            });
            wx.login({
                success: res => {
                    wx.setStorage({
                        key: 'log',
                        data: {code:res.code,sessionKey:''}
                    });
                }
            });
            // this.globalData.userInfo = e.detail.userInfo;
            GMAPI.doSendMsg('loginwx/authlogin',{code:wx.getStorageSync('log').code,rawData:e.detail.rawData,signature:e.detail.signature,iv:e.detail.iv,encryptedData:e.detail.encryptedData,session_id:''},'GET',that.onMsgCallBack);
        }
    },
    onMsgCallBack:function (jsonBack){
        var strData=JSON.parse(jsonBack.data);

        if(strData.code==200){
            wx.setStorage({
                key: 'strWXID',
                data: {sessionID:strData.data.session_id,strWXOpenID:strData.data.open_id,strUserID:strData.data.user_id}
            });
        }else{
            wx.showToast({
                title:data.msg,
                icon:'none',
                duration: 2000
            });
        }
    },

    onMakePhoneCall:function (){
        var that=this;
        wx.makePhoneCall({
            phoneNumber:app.data.kefu_Phone
        })
    },
});
function checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10)  {
        i = "0" + i;
    }
    return i;
}