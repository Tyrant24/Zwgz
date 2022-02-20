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
      istijiao:false
    })
    wx.setNavigationBarTitle({
      title: this.Base.options.company_name
    })
  }

  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.diaoyanlist({},(diaoyanlist)=>{
      for(let item of diaoyanlist){
        item.daan='';
      }
      this.Base.setMyData({diaoyanlist})
    })
    var memberapi = new MemberApi();
    memberapi.memberdiaoyanlist({company_id:this.Base.options.id},(list)=>{
      for(let item of list){
        item.shou = false;
        item.company_danqianjia=Number(item.company_danqianjia).toFixed(0);
      }
      this.Base.setMyData({
        list,
        istijiao:false,
        zongjie:''
      })
    })
  }
  xianshi(e){
    var idx = e.currentTarget.id;
    console.log(idx);
    var list = this.Base.getMyData().list;
    list[idx].shou=list[idx].shou==false?true:false;
    this.Base.setMyData({
      list
    })
  }
  dianzan(e){
    var id = e.currentTarget.id;
    var idx = e.currentTarget.dataset.idx;
    var list = this.Base.getMyData().list;
    if(list[idx].dianzan=='1'){
      list[idx].dianzan='0';
    }else {
      list[idx].dianzan='1';
    }
    var memberapi = new MemberApi();
    memberapi.adddianzan({
      memberdiaoyan_id:id
    },(ret)=>{
      if(ret.code=='0'){
        this.Base.toast(ret.result);
        this.Base.setMyData({
          list
        })
      }else {
        this.Base.toast(ret.result);
      }
    })
  }
  adddiaoyan(){
    this.Base.setMyData({
      isadd:true
    })
  }
  quxiao(){
    this.Base.setMyData({
      isadd:false
    })
  }
  dananFn(e){
    var idx =  e.currentTarget.id;
    console.log(e)
    var diaoyanlist  =  this.Base.getMyData().diaoyanlist;
    diaoyanlist[idx].daan=e.detail.value;
    this.Base.setMyData({
      diaoyanlist
    })
  }
  zongjieFn(e){
    this.Base.setMyData({
      zongjie:e.detail.value
    })
  }
  xianshiFn(){
    var xainshi = this.Base.getMyData().xainshi;
    xainshi=xainshi=='A'?'B':'A';
    this.Base.setMyData({
      xainshi
    })
  }
  tijiao(){
    
    var diaoyanlist = this.Base.getMyData().diaoyanlist;
    var arr = [];
    for(let item of diaoyanlist){
      if(item.daan!=''){
        arr.push(item);
      }
    }
    var json = {};
    if(arr.length!=diaoyanlist.length){
      this.Base.toast('请填完');
      return
      
    }
    var istijiao  =  this.Base.getMyData().istijiao;
    if(istijiao==true){
      return
    }
    json.arr=JSON.stringify(arr);
    json.zongjie=this.Base.getMyData().zongjie;
    json.xainshi=this.Base.getMyData().xainshi;
    json.company_id=this.Base.options.id;
    var datajson =  JSON.stringify(arr);
    var memberapi = new MemberApi();
    this.Base.setMyData({
      istijiao:true
    })
    memberapi.addmemberdiaoyan(json,(ret)=>{
      if(ret.code=='0'){

        memberapi.adddiaoyan({datajson:datajson,memberdiaoyan_id:ret.return},()=>{});
        this.Base.toast('提交成功');
        this.onMyShow();
        this.Base.setMyData({
          isadd:false,
          zongjie:"",
          xainshi:'A',
          istijiao:false
        })
      }else if(ret.code=='-2'){
        this.Base.toast("您发送的文字包含敏感内容,请重新编辑");
        this.Base.setMyData({
          istijiao:false
        })
      }else {
        this.Base.toast(res.result);
        this.Base.setMyData({
          istijiao:false
        })
      }
    })
  }
  onShareAppMessage(res) {
    let that = this;
    var company_name = this.Base.options.company_name;
    var id = this.Base.options.id;
    var url = '/pages/diaoyan/diaoyan?id='+id+'&company_name='+company_name;
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
  toanswers(e){
    var id = e.currentTarget.id;
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/diaoyanqes/diaoyanqes?id='+id+'&cop_id='+this.Base.options.id+'&company_name='+this.Base.options.company_name+'&timu='+item.timu,
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.xianshi = content.xianshi;
body.dianzan = content.dianzan;
body.adddiaoyan = content.adddiaoyan;
body.dananFn = content.dananFn;
body.zongjieFn = content.zongjieFn;
body.xianshiFn = content.xianshiFn;
body.tijiao = content.tijiao;
body.quxiao = content.quxiao;
body.toanswers = content.toanswers;
Page(body)