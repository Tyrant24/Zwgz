// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { ApiUtil } from "../../apis/apiutil";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: "支付记录"
    })
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.chongzhilist({},(chongzhilist)=>{
      for(let item of chongzhilist){
        item.riqi1=ApiUtil.updatetime(item.shijian_dateformat);
        var arr = item.shijian_formatting.split(" ");
        item.times = arr[1];
        item.riqi = item.riqi1+' '+item.times;
      }
      this.Base.setMyData({chongzhilist})
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
Page(body)