import GMAPI from "../../script/api";
const app = getApp();
Page({
    data: {
        off_Bool:true,
        height:null,
        location:[]
    },

    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    height:res.windowHeight
                });
            }
        });
        wx.setNavigationBarTitle({
            title:'我的地址'
        });
    },
    onShow:function(){
        var that = this;
        this.setData({
            location:[]
        });
        GMAPI.doSendMsg('home/address_list', {user_id:wx.getStorageSync('strWXID').strUserID},'POST',that.onMsgCallBack_DIY_Area);
    },
    onMsgCallBack_DIY_Area:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        console.log(data)
        if(data.code==200){
            this.setData({
                location:data.data
            });
        }
    },

    off:function (){
        var that=this;
        this.setData({
            off_Bool:!that.data.off_Bool
        })
    },
    setAddress:function (e){
        var id=e.currentTarget.dataset.id;
        var that = this;
        var json={user_id:wx.getStorageSync('strWXID').strUserID,address_id:id,is_default:1,wx_open_id:wx.getStorageSync('strWXID').strWXOpenID};
        GMAPI.doSendMsg('home/edit_address',json,'POST',that.onMsgCallBack_Area);
    },
    onMsgCallBack_Area:function (jsonBack){
        var data=JSON.parse(jsonBack.data);
        if(data.code==200){
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
    address:function (){
        wx.navigateTo({
            url: '/pages/new_address/new_address?status=0'
        });
    },
    modificationAddress:function (e){
        var index=e.currentTarget.dataset.index;
        var that=this;
        var list=this.data.location;
        for(var i=0;i<list.length;i++){
            if(list[index]){
                wx.setStorage({
                    key: 'address',
                    data:list[index]
                });
            }
        }
        wx.navigateTo({
            url: '/pages/new_address/new_address?status=1'
        });
    }
});
