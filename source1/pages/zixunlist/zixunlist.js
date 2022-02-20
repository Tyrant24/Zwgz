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
    wx.setNavigationBarTitle({
      title: "资讯"
    })
  }
  onMyShow() {
    var that = this;
    var api = new MemberApi();
    var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    api.getzixun({company_id:this.Base.options.id}, (zixun) => {
      zixun.map((item) => {
        item.daan1 = item.xz1;
        item.daan2 = item.xz2;
        item.xz = false;
        item.mubiaojia= parseInt(item.danqianjia*item.guzhi/item.shizhi);
        var myDate = new Date(Date.parse(item.riqi));
        console.log(myDate);
        item.xinqi = weekDay[myDate.getDay()]  // 星期五
      })
      this.fenzu(zixun);
      this.Base.setMyData({
        zixun
      })
    })
  }
  daan1(e) {
    var zixun = this.Base.getMyData().list;
    var item = e.currentTarget.dataset.item;
    var item1 = e.currentTarget.dataset.item1;
    var a = zixun[item1].subList[item].a;
    var tt = zixun[item1].subList[item].tt;
    var time = new Date(tt.replace(/-/g, '/')).getTime() + 3600 * 24 * 1000 - new Date().getTime();
    if (time > 0) {
      this.Base.toast("一天后才能修改");
      return
    }
    if (time < 0 && zixun[item1].subList[item].ccc == undefined) {
      zixun[item1].subList[item].ccc = 1;
      zixun[item1].subList[item].daan2 = '';
    }
    zixun[item1].subList[item].daan1 = e.currentTarget.dataset.id;
    this.Base.setMyData({
      list: zixun
    })
    this.dawan(item, item1);
  }
  daan2(e) {
    var zixun = this.Base.getMyData().list;
    var item = e.currentTarget.dataset.item;
    var item1 = e.currentTarget.dataset.item1;
    var a = zixun[item1].subList[item].a;
    var tt = zixun[item1].subList[item].tt;
    var time = new Date(tt.replace(/-/g, '/')).getTime() + 3600 * 24 * 1000 - new Date().getTime();
    if (time > 0) {
      this.Base.toast("一天后才能修改");
      return
    }
    if (time < 0 && zixun[item1].subList[item].ccc == undefined) {
      console.log(zixun[item1].subList[item].ccc);
      zixun[item1].subList[item].ccc = 1;
      zixun[item1].subList[item].daan1 = '';
    }
    zixun[item1].subList[item].daan2 = e.currentTarget.dataset.id;
    this.Base.setMyData({
      list: zixun
    })
    this.dawan(item, item1);
  }
  zhankai(e) {
    var zixun = this.Base.getMyData().list;
    zixun[e.currentTarget.dataset.item1].subList[e.currentTarget.dataset.item].xz = !zixun[e.currentTarget.dataset.item1].subList[e.currentTarget.dataset.item].xz;
    this.Base.setMyData({
      list: zixun
    })

  }
  dawan(item, item1) {

    var zixun = this.Base.getMyData().list[item1].subList[item];
    var daan1 = zixun.daan1;
    var daan2 = zixun.daan2;
    var type=zixun.type;
    console.log(zixun);
    console.log(daan1, daan2);
    console.log(daan1 > 0 && daan2 > 0);
    if (!(daan1 > 0 && daan2 > 0)) {
      console.log("错了");
      return
    }
    else {
      var api = new MemberApi();
      var instinfo = this.Base.getMyData().instinfo;
      var h1 = '';
      var h2 = '';
      if (daan1 == 1) {
        h1 = instinfo.D1;
      }
      if (daan1 == 2) {
        h1 = instinfo.D2;
      }
      if (daan1 == 3) {
        h1 = instinfo.D3;
      }
      if (daan1 == 4) {
        h1 = instinfo.D4;
      }
      if (daan2 == 1) {
        h2 = instinfo.D1;
      }
      if (daan2 == 2) {
        h2 = instinfo.D2;
      }
      if (daan2 == 3) {
        h2 = instinfo.D3;
      }
      if (daan2 == 4) {
        h2 = instinfo.D4;
      }
      console.log(h1, h2);

      api.adddati({ xz1: daan1, xz2: daan2, information_id: zixun.id }, () => {
        api.guzhi2({ company_id: zixun.company_id, h1: h1, h2: h2,type:type  }, (res) => {
          this.onMyShow();
        })
      })


    }



  }
  quedin() {

    wx.navigateTo({
      url: '/pages/search/search',
    })

  }
  fenzu(list) {
    let newArr = [];
    // var   _list=[{createtime:'2019-07-29',content:'哈哈哈'},{createtime:'2019-07-23',content:'哈哈哈'}];
    list.forEach((item, i) => {
      let index = -1;
      let isExists = newArr.some((newItem, j) => {
        if (item.riqi == newItem.riqi) {
          index = j;
          return true;
        }
      })
      if (!isExists) {
        newArr.push({
          riqi: item.riqi,
          xinqi: item.xinqi,
          timeMonth: item.timeMonth,
          xianshiriqi: this.fmtcndate(item.createTime),
          subList: [item]
        })
      } else {
        newArr[index].subList.push(item);
      }
    })
    this.Base.setMyData({
      list: newArr
    })


  }
  fmtcndate(cndateStr) {
    var da = new Date(cndateStr.replace(/-/g, '/')).getTime();

    da = new Date(da);

    var year = da.getFullYear() + '年';

    var month = da.getMonth() + 1 + '月';

    var date = da.getDate() + '日';

    return [year, month, date].join('')

  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.daan1 = content.daan1;
body.daan2 = content.daan2;
body.zhankai = content.zhankai;
body.dawan = content.dawan;
body.quedin = content.quedin;
body.fenzu = content.fenzu;
body.fmtcndate = content.fmtcndate;
Page(body)