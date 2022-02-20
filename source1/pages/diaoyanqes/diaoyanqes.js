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
      company_name:this.Base.options.company_name,
      xainshi:'A',
      zongjie:'',
      isadd:false,
      istijiao:false,
      cop_id:this.Base.options.cop_id,
      timu:this.Base.options.timu
    })
    wx.setNavigationBarTitle({
      title: this.Base.options.company_name
    })
  }

  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.diaoyanqeslist({diaoyan_id:this.Base.options.id,cop_id:this.Base.getMyData().cop_id},(diaoyanqeslist)=>{
      
      this.Base.setMyData({diaoyanqeslist})
    })
    
  }


  onShareAppMessage(res) {
    let that = this;
    var company_name = this.Base.options.company_name;
    var id = this.Base.options.id;
    var url = '/pages/diaoyanqes/diaoyanqes?id='+this.Base.options.id+'&cop_id='+this.Base.options.cop_id+'&company_name='+this.Base.options.company_name+'&timu='+this.Base.options.timu;
    return {
      title: '',
      path:url,
      success: function(res) {
        console.log(res, "转发成功")
      },
      fail: function(res) {
        console.log(res, "转发失败")
      }
    }

  }
 
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
Page(body)