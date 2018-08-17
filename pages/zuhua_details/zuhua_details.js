const app = getApp();
Page({
    data: {
        off_Bool:true,
        selected:false,
        title:'',
        activeID: 0,
        hua_Number: 1,
        height:null,
        imgURL:'',
        list:[
            {name:'头像',number:2,price:25,label:'',active:true,left:''},
            {name:'头像',number:2,price:35,label:'',active:true,left:''}
        ],
        delBtnWidth:120    //删除按钮宽度单位（rpx）
    },
    onLoad: function () {
        this.onShow();

        this.setData({
            // imgURL:app.globalData.userInfo.avatarUrl
        });
        var that=this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    height:res.windowHeight
                });
            }
        });
        console.log(app.globalData.userInfo);
    },
    onShow: function(){},
    upper: function(e) {},
    lower: function(e) {},
    scroll: function(e) {},
    tap: function(e){},
    tapMove: function(e) {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    },
    jump_ZuHua:function(e){
        wx.navigateTo({
            url:'/pages/zuhua/zuhua'
        })
    },
    jump_Home:function(e){
        wx.reLaunch({
            url:'/pages/index/index'
        })
    },
    tabClick: function (e) {
        this.setData({
            activeID: parseInt(e.currentTarget.dataset.index)
        });
    },
    selectedColor: function (e) {
        var that=this;
        this.setData({
            selected:!that.data.selected
        });
    },
    appendBlock: function (e) {
        var that=this;
        this.setData({
            hua_Number:that.data.hua_Number+1
        });
    },
    decrease: function (e) {
        var that=this;
        this.setData({
            hua_Number:(that.data.hua_Number==1?1:that.data.hua_Number-1)
        })
    },
    //获取元素自适应后的实际宽度
    getEleWidth:function(w){
        var real = 0;
        try {
            var res = wx.getSystemInfoSync().windowWidth;
            var scale = (750/2)/(w/2);  //以宽度750px设计稿做宽度的自适应
            // console.log(scale);
            real = Math.floor(res/scale);
            return real;
        } catch (e) {
            return false;
        }
    },
    off:function (){
      var that=this;
      this.setData({
          off_Bool:!that.data.off_Bool
      })
    }

});
