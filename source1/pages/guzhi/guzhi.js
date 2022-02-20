// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  
    this.Base.setMyData({
      value: 4,
      value2: 10,
      value3: 10,
      value4: 50,
      value5: 50,
      value6: 50,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      CF: 0,
    })
    wx.hideShareMenu({

    })
  }
  onMyShow() {
    var that = this;
    var api = new MemberApi();
    this.Base.setMyData({
      btnshow:true
    })
    api.guzhiinfo({ company_id: this.Base.options.id }, (guzhiinfo) => {
      if (guzhiinfo != null) {
        this.Base.setMyData({
          value: Number(guzhiinfo.r * 1000 / 10),
          value2: Number(guzhiinfo.g1 * 1000 / 10),
          value3: Number(guzhiinfo.g2 * 1000 / 10),
          value4: Number(guzhiinfo.a * 1000 / 10),
          value5: Number(guzhiinfo.b * 1000 / 10),
          value6: Number(guzhiinfo.c * 1000 / 10),
          guzhiinfo,
         
        })
      }
    })

    api.companydata({ company_id: this.Base.options.id }, (companydata) => {
      console.log(companydata.g)
      companydata.g=  Number(companydata.g).toFixed(2);
      wx.setNavigationBarTitle({
        title: companydata.company_name
      })
      this.Base.setMyData({
        companydata, CF: parseInt(companydata.CF / 100)
      })
    })

  }
  sliderchange(e) {
    console.log(e);
  }
  tiaozhen(e) {
    var id = e.currentTarget.dataset.id;
    console.log(e.currentTarget.dataset.id);
    if (id == 1) {
      this.Base.setMyData({
        show1: !this.Base.getMyData().show1,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        show6: false,
      })
    }
    if (id == 2) {
      this.Base.setMyData({
        show2: !this.Base.getMyData().show2,
        show1: false,
        show3: false,
        show4: false,
        show5: false,
        show6: false,
      })
    }
    if (id == 3) {
      this.Base.setMyData({
        show3: !this.Base.getMyData().show3,
        show1: false,
        show2: false,
        show4: false,
        show5: false,
        show6: false,
      })
    }
    if (id == 4) {
      this.Base.setMyData({
        show4: !this.Base.getMyData().show4,
        show1: false,
        show2: false,
        show3: false,
        show5: false,
        show6: false,
      })
    }
    if (id == 5) {
      this.Base.setMyData({
        show5: !this.Base.getMyData().show5,
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        show6: false,
      })
    }
    if (id == 6) {
      this.Base.setMyData({
        show6: !this.Base.getMyData().show6,
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
      })
    }
  }
  xz(e) {
    console.log(e);
    this.Base.setMyData({
      CF: e.detail.value
    })
  }
  quedin() {
    var that = this;
    this.Base.setMyData({
      btnshow:false
    })
    var r = this.Base.getMyData().value / 100
    var g1 = this.Base.getMyData().value2 / 100;
    var g2 = this.Base.getMyData().value3 / 100;
    var a = this.Base.getMyData().value4 / 100;
    var b = this.Base.getMyData().value5 / 100;
    var c = this.Base.getMyData().value6 / 100;
    var CF = this.Base.getMyData().CF;
    console.log(this.Base.getMyData().value5 / 100);
    console.log(this.Base.getMyData().value6 / 100);
      
    var api = new MemberApi();
    if (this.Base.getMyData().guzhiinfo == null) {
      api.updatememberguzhi({ company_id: this.Base.options.id, r: r, g1: g1, g2: g2, a: a, b: b, c: c, CF: CF }, (ret) => {

        api.guzhi({ id: ret.return }, (guzhi) => {

          if (guzhi.code == 0) {
            wx.reLaunch({
              url: '/pages/companyinfo/companyinfo?id=' + that.Base.options.id,
            })
          }

        })


      })
    }
    else {
      api.updatememberguzhi({ primary_id: this.Base.getMyData().guzhiinfo.id, company_id: this.Base.options.id, r: r, g1: g1, g2: g2, a: a, b: b, c: c, CF: CF }, (ret) => {

        api.guzhi({ id: ret.return }, (guzhi) => {

          if (guzhi.code == 0) {
            wx.reLaunch({
              url: '/pages/companyinfo/companyinfo?id=' + that.Base.options.id,
            })
          }

        })


      })
    }

  }
  phonenoCallback(phoneno, e) {
    console.log(phoneno);


    var memberapi = new MemberApi();
    memberapi.updatemobile({
      mobile: phoneno,
      member_id: this.Base.getMyData().memberinfo.id
    }, () => {
      var memberapi = new MemberApi();

      var that = this;
      memberapi.info({}, (info) => {
        this.Base.setMyData({
          memberinfo: info
        });

      

        wx.showToast({
          title: '获取成功',
          icon: 'none'
        })

      });
    })

  

  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.sliderchange = content.sliderchange;
body.tiaozhen = content.tiaozhen;
body.quedin = content.quedin;
body.xz = content.xz;
body.getUserProfile=content.getUserProfile;
Page(body)