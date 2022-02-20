//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力

    const e = wx.getSystemInfoSync();

        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        this.globalData.platform=e.platform;
     
        if (capsule) {
          console.log(1);
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          console.log(2);
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }



      
  

  },
  globalData: {
    userInfo: null
  }
})