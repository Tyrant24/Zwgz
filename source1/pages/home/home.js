// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  MemberApi
} from "../../apis/member.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: "众问估值"
    })
  console.log(this.test(1));  
     
  }
  test(num){
    
     if(num>=100)
     return 100
     return this.test(num+1) +num

  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    this.Base.setMyData({
      pd: 1
    })
    instapi.indexbanner({
      position: "home"
    }, (indexbanner) => {
      this.Base.setMyData({
        indexbanner
      });
    });
    var api = new MemberApi();
    api.memberguzhilist({}, (memberguzhilist) => {

      memberguzhilist.map((item) => {
        item.guzhi.BB = Number(item.guzhi.BB).toFixed(1);

        item.mubiaojia = parseInt(item.company_danqianjia * item.guzhi.V / item.company_shizhi);
      })

      this.Base.setMyData({

        memberguzhilist

      })
    })

    setTimeout(() => {
      this.Base.setMyData({
        pd: 2
      })
    }, 6000)
  }
  guanli() {
    if (!this.cc()) {
      return
    }
    wx.navigateTo({
      url: '/pages/gupiaoguanli/gupiaoguanli',
    })
  }
  search() {
    if (!this.cc()) {
      return
    }
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
  gaopeilv() {
    if (!this.cc()) {
      return
    }
    wx.navigateTo({
      url: '/pages/gaopeilv/gaopeilv',
    })
  }
  gaoshenglv() {
    if (!this.cc()) {
      return
    }
    wx.navigateTo({
      url: '/pages/gaoshenglv/gaoshenglv',
    })
  }
  companyinfo(e) {
    if (!this.cc()) {
      return
    }
    wx.navigateTo({
      url: '/pages/companyinfo/companyinfo?id=' + e.currentTarget.dataset.id,
    })
  }
  quedin() {
    if (!this.cc()) {
      return
    }
    wx.navigateTo({
      url: '/pages/search/search',
    })

  }
  activities(e) {
    if (!this.cc()) {
      return
    }
   
    var id = e.currentTarget.id;
    console.log(e)
    if (id == 'A') {
      wx.navigateTo({
        url: '/pages/activities/activities',
      })
    }
    if (id == 'B') {
      wx.navigateTo({
        url: '/pages/recommend/recommend',
      })
    }
    if (id == 'C') {
      
      var url = e.currentTarget.dataset.url;

      url = encodeURIComponent(url);
      wx.navigateTo({
        url: '/pages/article/article?url=' + url,
      })
    }

  }
  cc() {
    var memberinfo = this.Base.getMyData().memberinfo;
    console.log(memberinfo);
    if (memberinfo == undefined || memberinfo.avatarUrl == '') {
      // wx.switchTab({
      //   url: '/pages/mine/mine',
      // })
      return true
    } else {

      return true

    }

  }
  onShareAppMessage(e) {


    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.onShareTimeline();
  }

  onShareTimeline() {
    console.log("asda")

  }
  hanyepeizhi(){
    wx.navigateTo({
      url: '/pages/recommend/recommend',
    })
  }
  zuhefenxi(){
    wx.navigateTo({
      url: '/pages/zuhefenxi/zuhefenxi',
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.guanli = content.guanli;
body.search = content.search;
body.gaopeilv = content.gaopeilv;
body.gaoshenglv = content.gaoshenglv;
body.companyinfo = content.companyinfo;
body.quedin = content.quedin;
body.cc = content.cc;
body.activities = content.activities;
body.onshareAppMessage = content.onshareAppMessage;
body.onShareTimeline = content.onShareTimeline;
body.hanyepeizhi=content.hanyepeizhi;
body.zuhefenxi=content.zuhefenxi;
body.test=content.test;
Page(body)