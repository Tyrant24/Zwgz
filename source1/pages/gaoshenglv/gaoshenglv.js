// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: "高胜率"
    })
  }
  onMyShow() {
    var that = this;

    var api=new MemberApi();
     api.guzhipaihan({orderby:'r_main.P desc',limit:'0,20'},(memberguzhilist)=>{
          this.Base.setMyData({

            memberguzhilist

          })
     })
  }
  guanli(){
    wx.navigateTo({
      url: '/pages/gupiaoguanli/gupiaoguanli',
    })
  }
  search(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
  guzhi(e){
    var item=e.currentTarget.dataset.id;


    var instinfo = this.Base.getMyData().instinfo;
    var memberinfo = this.Base.getMyData().memberinfo;
    if(memberinfo.ismember_value!='Y' && Number(instinfo.gegunum)>0 && Number(instinfo.gegunum)<=Number(memberinfo.gegu)){
      if(item.member_id==this.Base.getMyData().memberinfo.id){
        wx.navigateTo({
          url: '/pages/companyinfo/companyinfo?id='+item.company_id,
        })
      }
      wx.navigateTo({
        url: '/pages/chongzhi/chongzhi?type=G&id='+item.company_id,
      })
        
      return
    }


    if(item.member_id!=this.Base.getMyData().memberinfo.id)
    {
      wx.navigateTo({
        url: '/pages/guzhi/guzhi?id='+item.company_id,
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/companyinfo/companyinfo?id='+item.company_id,
      })
    }
    
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.guanli=content.guanli;
body.search=content.search;
body.gaopeilv=content.gaopeilv;
body.gaoshenglv=content.gaoshenglv;
body.guzhi=content.guzhi;
Page(body)