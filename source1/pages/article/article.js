import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.needauth = false;
    this.Base.setMyData({url:decodeURIComponent(options.url)})
    
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    if(this.Base.options.id!=undefined){
      instapi.addliulan({article_id:this.Base.options.id},()=>{})
    }
    
  }
  checkPermission() {

  }
  onUnload(){
    if(this.Base.options.type=='M'){
      wx.switchTab({
        url: '/pages/member/member',
      })
    }
  }
  
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.getUserInfo = content.getUserInfo;
Page(body)