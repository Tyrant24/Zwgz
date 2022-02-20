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
      title: "股票管理"
    })
    this.Base.setMyData({
      value: ''
    })
  }
  onMyShow() {
    var that = this;
  }
  search() {
    console.log(this.Base.getMyData().value);
    var api = new MemberApi();
    var value = this.Base.getMyData().value;
    if (value == '') {
      this.Base.setMyData({companylist:[]})
      return
    }
    api.search({ sousuo: value, limit: "0,7" }, (companylist) => {
      this.Base.setMyData({companylist})
      console.log(companylist);
    })
  }
  guzhi(e){
   
    var item=e.currentTarget.dataset.id;
    if(item.isjinron>0)
    {
      return
    }


    var instinfo = this.Base.getMyData().instinfo;
    var memberinfo = this.Base.getMyData().memberinfo;
    if(memberinfo.ismember_value!='Y' && Number(instinfo.gegunum)>0 && Number(instinfo.gegunum)<=Number(memberinfo.gegu)){
      if(item.member_id==this.Base.getMyData().memberinfo.id){
        wx.navigateTo({
          url: '/pages/companyinfo/companyinfo?id='+item.stockid,
        })
      }
      wx.navigateTo({
        url: '/pages/chongzhi/chongzhi?type=G&id='+item.stockid,
      })
        
      return
    }

    if(item.member_id!=this.Base.getMyData().memberinfo.id)
    {
      wx.navigateTo({
        url: '/pages/guzhi/guzhi?id='+item.stockid,
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/companyinfo/companyinfo?id='+item.stockid,
      })
    }
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.search = content.search;
body.guzhi=content.guzhi;
Page(body)