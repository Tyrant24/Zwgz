// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { BrokerApi } from "../../apis/broker.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    wx.setBackgroundColor({
      backgroundColorTop: '#FD7144', // 顶部窗口的背景色为白色
      backgroundColorBottom: '#FD7144', // 底部窗口的背景色为白色
    })
    this.Base.setMyData({
      brokerlist:[], value: '',clientHeight:0,firstnum:0,lastnunm:7
    })
   

  }
  onMyShow() {
    var that = this;

    var brokerApi = new BrokerApi()
    brokerApi.brokerlist({
      limit: "0,7"
    },(brokerlist)=>{
      this.Base.setMyData({brokerlist})
       //计算窗口高度
     wx.getSystemInfo({
      success: function(res) {
        that.Base.setMyData({
          clientHeight: res.windowHeight
        });
        console.log(res.windowHeight,'clientHeight1111')
      }
    })

    })

    


  }
  search(){
     
console.log(this.Base.getMyData().value,'value')
var value=this.Base.getMyData().value
var lastnunm =this.Base.getMyData().lastnunm.toString()
    var firstnum =this.Base.getMyData().firstnum.toString()
var limit=firstnum+','+lastnunm

var brokerApi = new BrokerApi()
if (value=='') {
    brokerApi.brokerlist({
      limit
    },(brokerlist)=>{
      this.Base.setMyData({brokerlist})
    })
}else{
  brokerApi.brokerlist({
    companyname:value,
    limit
  },(brokerlist)=>{
    this.Base.setMyData({brokerlist})
  })

}

  }
  scrolltolower(){
    var lastnunm =this.Base.getMyData().lastnunm
    var firstnum =this.Base.getMyData().firstnum
    lastnunm=lastnunm*1+7
    this.Base.setMyData({lastnunm})
this.search()

    console.log(2222)
  }

}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad; 
body.onMyShow = content.onMyShow;

body.search = content.search;
body.scrolltolower = content.scrolltolower;

Page(body)