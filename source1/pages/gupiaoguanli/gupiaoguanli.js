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
      value: '',
      bianji: false,
      quanxuan: false,
    })
  }
  onMyShow() {
    var that = this;
    var api = new MemberApi();
    api.memberguzhilist({}, (memberguzhilist) => {
      memberguzhilist.map((item)=>{
        item.guzhi.BB=  Number(item.guzhi.BB).toFixed(1);
        item.mubiaojia= parseInt(item.company_danqianjia*item.guzhi.V/item.company_shizhi);
     })
      memberguzhilist.map((item) => {
        item.xz = false
      })

      this.Base.setMyData({

        memberguzhilist

      })
    })
  }
  search() {
    console.log(this.Base.getMyData().value);
    var api = new MemberApi();
    var value = this.Base.getMyData().value;
    if (value == '') {
      this.toast("请输入搜索内容");
      return
    }
    api.search({ sousuo: value, limit: "0,7" }, (companylist) => {
      console.log(companylist);
    })
  }
  bianji() {

    this.Base.setMyData({
      bianji: true
    })

  }

  xz(e) {
    if(this.Base.getMyData().bianji==false)
    {
      return
    }
    var id = e.currentTarget.dataset.id;
    var list = this.Base.getMyData().memberguzhilist;
    list[id].xz = !list[id].xz;
    console.log(list);
    this.Base.setMyData({
      memberguzhilist: list
    })

  }
  quanxuan() {
    var quanxuan = this.Base.getMyData().quanxuan;

    var list = this.Base.getMyData().memberguzhilist;
    list.map((item) => {
      item.xz = !quanxuan
    })
    this.Base.setMyData({
      quanxuan: !quanxuan,
      memberguzhilist: list
    })
  }
  shanchu() {
    var list = this.Base.getMyData().memberguzhilist;
    var can = [];
    list.map((item) => {
      if (item.xz == true) {
        can.push(item);
      }
    })

    console.log(can);

    can = JSON.stringify(can);
    console.log(can);
    var api = new MemberApi();
    api.deletezixuan({ datajson: can }, () => {
      this.onMyShow();
    })


  }
  wanchen(){
    this.Base.setMyData({
      bianji:false
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.search = content.search;
body.bianji = content.bianji;
body.xz = content.xz;
body.quanxuan = content.quanxuan;
body.shanchu = content.shanchu;
body.wanchen=content.wanchen;
Page(body)