// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { WechatApi } from "../../apis/wechat.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setNavigationBarTitle({
      title: "众问会员"
    })
    this.Base.setMyData({
      seq:0,
      ischeck:true,
      money:0,
      platform:getApp().globalData.platform
    })
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.vouchercenter({},(vouchercenter)=>{
          vouchercenter.map((item)=>{
          item.money=Number(item.money).toFixed(1);
          })
       
      this.Base.setMyData({vouchercenter,money:vouchercenter[0].money})
    })
    instapi.quanyilist({},(quanyilist)=>{
      this.Base.setMyData({quanyilist})
    })
  }
  switchnav(e){
    var idx = e.currentTarget.id;
    var vouchercenter  = this.Base.getMyData().vouchercenter;
    var money = this.Base.getMyData().money;
    money=vouchercenter[idx].money;
    this.Base.setMyData({
      seq:idx,
      money
    })
  }
  tongyi(){
    var ischeck = this.Base.getMyData().ischeck;
    ischeck=ischeck?false:true;
    this.Base.setMyData({
      ischeck
    })
  }
  xieyi(){
    wx.navigateTo({
      url: '/pages/xieyi/xieyi',
    })
  }
  fuzhi(){
    var weixinkefu = this.Base.getMyData().instinfo.weixinkefu;
    wx.setClipboardData({
      data: weixinkefu,
      success:function(res){
        wx.getClipboardData({
          success: (option) => {
            wx.showToast({
              title: '复制成功',
              icon:'none'
            })
          },
        })
      }
    })
  }
  bindpay(){
    var wechatapi = new WechatApi();
    var seq = this.Base.getMyData().seq;
    var vouchercenter = this.Base.getMyData().vouchercenter;
    var id = vouchercenter[seq].id;
    var openid = AppBase.UserInfo.openid;
    var that = this;
    var url = this.Base.options.url;
    var type = this.Base.options.type;
    if(this.Base.getMyData().ischeck==false)
    {
      that.Base.toast('请勾选支付协议');
      return
    }
    wechatapi.prepay({id,openid},(payret)=>{
      payret.complete = function (e) {
        if (e.errMsg == "requestPayment:ok") {
          that.Base.toast('已成功开通会员！');
          if(url!=undefined){
            wx.navigateTo({
              url: '/pages/article/article?url=' + url+'&type=M'+'&id='+that.Base.options.id,
            })
          }
          if(type!=undefined){
            wx.navigateTo({
              url: '/pages/guzhi/guzhi?id='+that.Base.options.id,
            })
          }
        }
      }
      wx.requestPayment(payret)
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;
body.switchnav = content.switchnav;
body.tongyi = content.tongyi;
body.xieyi = content.xieyi;
body.fuzhi = content.fuzhi;
body.bindpay = content.bindpay;
Page(body)