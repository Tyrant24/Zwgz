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
      title: "众问组合分析表"
    })
  }
  onMyShow() {
    var that = this;
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
}
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
Page(body)