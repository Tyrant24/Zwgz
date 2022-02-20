// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: "分析"
    })
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.articlelist({},(articlelist)=>{
      this.Base.setMyData({articlelist})
    })
  }
  todetails(e){
    var id = e.currentTarget.id;
    var item = e.currentTarget.dataset.item;
    var memberinfo = this.Base.getMyData().memberinfo;
    var ismember = memberinfo.ismember_value;

    var url = item.url;
    url = encodeURIComponent(url);

    if(ismember=='Y'){
 
      wx.navigateTo({
        url: '/pages/article/article?url=' + url+'&id='+item.id,
      })
    }else {

      if(item.wzstatus=='B'){
      
        wx.navigateTo({
          url: '/pages/article/article?url=' + url+'&id='+item.id,
        })
      }else {
        wx.navigateTo({
          url: '/pages/chongzhi/chongzhi?url='+url+'&id='+item.id,
        })
      }

    }
   
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.todetails = content.todetails;
Page(body)