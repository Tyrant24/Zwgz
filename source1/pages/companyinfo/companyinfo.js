// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";
import { TargetpriceApi } from "../../apis/targetprice.api.js";
import { HealthApi } from "../../apis/health.api.js";

import * as echarts from '../../ec-canvas/echarts'
let chart = null;
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
      select: 0,
      kuai1: true,
      kuai2: false,
      kuai3: false,
      kuai4: false,
      a: '',
      type: 'ri',
      type1: 'ri',
      biao:false,
      targetlist:[],
      tarlength:0,
      healthlong:0,healthlist:[],
      health:false
    })


    wx.hideShareMenu({

    })



  }
  onHide() {
    clearInterval(this.Base.getMyData().t);
  }
  onUnload() {
    clearInterval(this.Base.getMyData().t);
  }
  onMyShow() {
    this.Base.setMyData({
      daan1: 0,
      daan2: 0,
    })  
    var that = this;
    var api = new MemberApi();
    api.companyinfo({ id: this.Base.options.id }, (companyinfo) => {
      console.log(companyinfo);

      companyinfo.mubiaojia= parseInt(companyinfo.danqianjia*companyinfo.guzhi.V/companyinfo.shizhi);


      if (companyinfo.tiaozhen != "") {
        var time = new Date(companyinfo.tiaozhen.time.replace(/-/g, '/')).getTime() + this.Base.getMyData().instinfo.time * 1000;

        var time1 = new Date().getTime();
        var a = this.toHHmmss(time - time1)
        if (time - time1 <= 0) {

        }
        else {
          let t = setInterval(() => {

            time1 = new Date().getTime();

            a = this.toHHmmss(time - time1)
            if (time - time1 > 0) {
              that.Base.setMyData({ a: a, t: t })
            }
            else {
              that.Base.setMyData({ a: "", })
              clearInterval(t);
            }


          }, 1000)
        }

      }
      this.showecharts1(companyinfo.guzhi.CF, companyinfo.guzhi.g1, companyinfo.guzhi.g2);

      this.Base.setMyData({
        companyinfo
      })


    })
    api.getecharts1({ company_id: this.Base.options.id }, (ress) => {
      console.log(ress);
      console.log(ress.yueavgcf);
      console.log("111111");
      this.Base.setMyData({
        ress
      })
      this.showecharts();
      this.showecharts2();
    })


    var targetpriceApi = new TargetpriceApi()
    targetpriceApi.targetlist({id:this.Base.options.id ,orderby:'year'},(targetlist)=>{
      var tarlength=targetlist.length-1
      this.Base.setMyData({targetlist,tarlength})
    })

    var healthApi =  new HealthApi()
    healthApi.healthlist({id:this.Base.options.id },(healthlist)=>{
      this.Base.setMyData({healthlist,healthlong:healthlist.length-1})
    })
    
  }
  chart = '';

  showecharts() {
    var that = this;
    var ress = this.Base.getMyData().ress;
    var type = this.Base.getMyData().type;
    var list = [];
    var shizhi = [];

    var retunlist = [];

    if (type == 'ri') {
      shizhi = ress.rishizhi;
      ress.riavgcf.map((item) => {
        list.push(item.money);

      })
      retunlist = ress.rilist;
    }
    else {
      shizhi = ress.yueshizhi;
      ress.yueavgcf.map((item) => {
        list.push(item.money);

      })

      retunlist = content.getyue(ress.yueavgcf.length);
    }



    function initChart(canvas, width, height, dpr) {

      chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });



      canvas.setChart(chart);

      var option = {
        // ----  标题 -----
        title: {
          text: '估值记录',
          padding: 10
        },

        tooltip: {
          show: true,   // 是否显示提示框，默认为true
          trigger: 'item', // 数据项图形触发
          axisPointer: {   // 指示样式
            type: 'shadow',
            axis: 'auto'
          },
          padding: 5,
          textStyle: {   // 提示框内容的样式
            color: '#fff'
          }
        },
        // ---- gird区域 ---
        grid: {
          x: 60,
          top: 50,
          x2: 40,
          y2: 30,
        },
        //  ------  X轴 ------
        xAxis: {
          show: true,  // 是否显示
          position: 'bottom',  // x轴的位置
          offset: 0, // x轴相对于默认位置的偏移
          type: 'category',   // 轴类型， 默认为 'category'
          name: '',    // 轴名称
          nameLocation: 'end',  // 轴名称相对位置
          nameTextStyle: {   // 坐标轴名称样式
            color: '#999999',
            padding: [5, 0, 0, -5]
          },
          nameGap: 15, // 坐标轴名称与轴线之间的距离
          nameRotate: 0,  // 坐标轴名字旋转

          axisTick: {    // 坐标轴 刻度
            show: true,  // 是否显示
            inside: true,  // 是否朝内
            length: 3,     // 长度
            lineStyle: {   // 默认取轴线的样式
              color: '#999999',
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {    // 坐标轴标签
            show: true,  // 是否显示
            inside: false, // 是否朝内
            rotate: 0, // 旋转角度
            margin: 5, // 刻度标签与轴线之间的距离
            color: '#999999'  // 默认取轴线的颜色 
          },
          splitLine: {    // gird区域中的分割线
            show: false,  // 是否显示
            lineStyle: {
              // color: '#999999',
              // width: 1,
              // type: 'solid'
            }
          },
          splitArea: {    // 网格区域
            show: false  // 是否显示，默认为false
          },
          data: retunlist
        },
        //   ------   y轴  ----------
        yAxis: {

          show: true,  // 是否显示
          position: 'left', // y轴位置
          offset: 0, // y轴相对于默认位置的偏移
          type: 'value',  // 轴类型，默认为 ‘category’
          // 轴名称
          nameLocation: 'end', // 轴名称相对位置value
          nameTextStyle: {    // 坐标轴名称样式
            color: '#fff',
            padding: [5, 0, 0, 5]  // 坐标轴名称相对位置
          },
          nameGap: 15, // 坐标轴名称与轴线之间的距离
          nameRotate: 270,  // 坐标轴名字旋转


          axisTick: {      // 坐标轴的刻度
            show: true,    // 是否显示
            inside: true,  // 是否朝内
            length: 3,      // 长度
            lineStyle: {
              color: '#999999',  // 默认取轴线的颜色
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {      // 坐标轴的标签
            show: true,    // 是否显示
            inside: false,  // 是否朝内
            rotate: 0,     // 旋转角度
            margin: 8,     // 刻度标签与轴线之间的距离
            color: '#999999',  // 默认轴线的颜色
          },
          splitLine: {    // gird 区域中的分割线
            show: true,   // 是否显示
            lineStyle: {
              color: '#E6E6E6',
              width: 1,
              type: 'dashed'
            }
          },
          splitArea: {     // 网格区域
            show: false   // 是否显示，默认为false
          }
        },
        //  -------   内容数据 -------
        series: [
          {
            name: '估值',      // 序列名称
            type: 'bar',      // 类型
            legendHoverLink: true,  // 是否启用图列 hover 时的联动高亮
            label: {   // 图形上的文本标签
              show: false,
              position: 'insideTop', // 相对位置
              rotate: 0,  // 旋转角度
              color: '#999999'
            },
            itemStyle: {    // 图形的形状
              barBorderRadius: [12, 12, 12, 12],
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#DB2026' },
                  { offset: 1, color: '#FF7646' }
                ]
              ),

            },
            barWidth: 10,  // 柱形的宽度
            barCategoryGap: '20%',  // 柱形的间距
            data: list
          },
          {
            name: '市值',
            type: 'line',
            symbol: 'circle',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#FEAB2F'
                }
              }
            },
            data: shizhi,

          }
        ]
      };

      console.log("--------22222222-----------------");
      chart.setOption(option);
      console.log(chart);
      return chart;
    }


    this.Base.setMyData({
      ec: {
        onInit: initChart
      }
    })
  }
  chart2 = '';
  showecharts2() {
    var that = this;
    var ress = this.Base.getMyData().ress;
    var type = this.Base.getMyData().type;
    var list = [];
    var shizhi = [];

    var retunlist = [];

    if (type == 'ri') {
      shizhi = ress.rishizhi;
      ress.riavgcf.map((item) => {
        list.push(item.shenglv*100);

      })
      retunlist = ress.rilist;
    }
    else {
      shizhi = ress.yueshizhi;
      ress.yueavgcf.map((item) => {
        list.push(item.money);

      })

      retunlist = content.getyue(ress.yueavgcf.length);
    }

    console.log(retunlist);
    console.log(list);


    function initChart(canvas, width, height, dpr) {

      chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });



      canvas.setChart(chart);

      var option = {
        // ----  标题 -----
        title: {
          text: '评分记录',
          padding: 10
        },

        tooltip: {
          show: true,   // 是否显示提示框，默认为true
          trigger: 'item', // 数据项图形触发
          axisPointer: {   // 指示样式
            type: 'shadow',
            axis: 'auto'
          },
          padding: 5,
          textStyle: {   // 提示框内容的样式
            color: '#fff'
          }
        },
        // ---- gird区域 ---
        grid: {
          x: 40,
          top: 50,
          x2: 40,
          y2: 30,
        },
        //  ------  X轴 ------
        xAxis: {
          show: true,  // 是否显示
          position: 'bottom',  // x轴的位置
          offset: 0, // x轴相对于默认位置的偏移
          type: 'category',   // 轴类型， 默认为 'category'
          name: '',    // 轴名称
          nameLocation: 'end',  // 轴名称相对位置
          nameTextStyle: {   // 坐标轴名称样式
            color: '#999999',
            padding: [5, 0, 0, -5]
          },
          nameGap: 15, // 坐标轴名称与轴线之间的距离
          nameRotate: 0,  // 坐标轴名字旋转

          axisTick: {    // 坐标轴 刻度
            show: true,  // 是否显示
            inside: true,  // 是否朝内
            length: 3,     // 长度
            lineStyle: {   // 默认取轴线的样式
              color: '#999999',
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {    // 坐标轴标签
            show: true,  // 是否显示
            inside: false, // 是否朝内
            rotate: 0, // 旋转角度
            margin: 5, // 刻度标签与轴线之间的距离
            color: '#999999'  // 默认取轴线的颜色 
          },
          splitLine: {    // gird区域中的分割线
            show: false,  // 是否显示
            lineStyle: {
              // color: '#999999',
              // width: 1,
              // type: 'solid'
            }
          },
          splitArea: {    // 网格区域
            show: false  // 是否显示，默认为false
          },
          data: retunlist
        },
        //   ------   y轴  ----------
        yAxis: {
          max: 100,
          show: true,  // 是否显示
          position: 'left', // y轴位置
          offset: 0, // y轴相对于默认位置的偏移
          type: 'value',  // 轴类型，默认为 ‘category’
          // 轴名称
          nameLocation: 'end', // 轴名称相对位置value
          nameTextStyle: {    // 坐标轴名称样式
            color: '#fff',
            padding: [5, 0, 0, 5]  // 坐标轴名称相对位置
          },
          nameGap: 15, // 坐标轴名称与轴线之间的距离
          nameRotate: 270,  // 坐标轴名字旋转


          axisTick: {      // 坐标轴的刻度
            show: true,    // 是否显示
            inside: true,  // 是否朝内
            length: 3,      // 长度
            lineStyle: {
              color: '#999999',  // 默认取轴线的颜色
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {      // 坐标轴的标签
            show: true,    // 是否显示
            inside: false,  // 是否朝内
            rotate: 0,     // 旋转角度
            margin: 8,     // 刻度标签与轴线之间的距离
            color: '#999999',  // 默认轴线的颜色
          },
          splitLine: {    // gird 区域中的分割线
            show: true,   // 是否显示
            lineStyle: {
              color: '#E6E6E6',
              width: 1,
              type: 'dashed'
            }
          },
          splitArea: {     // 网格区域
            show: false   // 是否显示，默认为false
          }
        },
        //  -------   内容数据 -------
        series: [

          {
            name: '胜率',
            type: 'line',
            symbol: 'circle',
            smooth: false,
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: "#FEAB2F" // 0% 处的颜色
                  }, {
                    offset: 0.7,
                    color: "rgba(254, 171, 47, 0)" // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#FEAB2F'
                }
              }
            },
            data: list,

          }
        ]
      };

      console.log("--------22222222-----------------");
      chart.setOption(option);
      console.log(chart);
      return chart;
    }


    this.Base.setMyData({
      ec2: {
        onInit: initChart
      }
    })
  }
  showecharts1(CF, g1, g2) {

    var time = new Date().getFullYear();
    console.log(time);
    var g1 = Number(1 + Number(g1));
    var g2 = Number(1 + Number(g2));
    console.log(Math.pow(g1, 3));
    var list = [Math.trunc(CF * g1), Math.trunc(CF * Math.pow(g1, 2)), Math.trunc(CF * Math.pow(g1, 3)), Math.trunc(CF * Math.pow(g1, 3) * (g2)),
    Math.trunc(CF * Math.pow((g1), 3) * Math.pow((g2), 2))];


    console.log(list);
    var that = this;
    function initChart(canvas, width, height, dpr) {
      console.log("-------------------------");

      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      console.log("1111");


      canvas.setChart(chart);

      var option = {
        xAxis: {

          show: true,  // 是否显示
          position: 'bottom',  // x轴的位置
          offset: 0, // x轴相对于默认位置的偏移
          type: 'category',   // 轴类型， 默认为 'category'
          name: '',    // 轴名称
          nameLocation: 'end',
          data: [time, time + 1, time + 2, time + 3, time + 4],
          nameTextStyle: {   // 坐标轴名称样式
            color: '#999999',
            padding: [5, 0, 0, -5],
            fontSize: 10
          },

        },
        grid: {
          x: 60,
          y: 20,

          y2: 30,
        },
        yAxis: {
          type: 'value',
          axisTick: {      // 坐标轴的刻度
            show: false,    // 是否显示
            inside: true,  // 是否朝内
            length: 3,      // 长度
            lineStyle: {
              color: '#999999',  // 默认取轴线的颜色
              width: 1,
              type: 'dashed'
            }
          },
        },
        series: [{
          data: list,
          type: 'bar',
          barWidth: 10,
          itemStyle: {    // 图形的形状
            barBorderRadius: [12, 12, 12, 12],
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#DB2026' },
                { offset: 1, color: '#FF7646' }
              ]
            ),

          },
        }]
      };


      console.log("--------333333333-----------------");
      chart.setOption(option);
      console.log(chart);
      return chart;
    }

    console.log("那真的牛逼");
    this.Base.setMyData({
      ec1: {
        onInit: initChart
      }
    })
  }
  select(e) {
    if(e.currentTarget.dataset.id=='2'){
      wx.navigateTo({
        url: '/pages/diaoyan/diaoyan?id='+this.Base.options.id+'&company_name='+this.Base.getMyData().companyinfo.name,
      })
      return
    }
    this.Base.setMyData({
      select: e.currentTarget.dataset.id
    })
  }

  daan1(e) {

    this.Base.setMyData({
      daan1: e.currentTarget.dataset.id
    })
    this.dawan();
  }
  daan2(e) {

    this.Base.setMyData({
      daan2: e.currentTarget.dataset.id
    })
    this.dawan();

  }
  dawan() {
    var daan1 = this.Base.getMyData().daan1;
    var daan2 = this.Base.getMyData().daan2;
    if (daan1 == 0 || daan2 == 0) {
      return
    }
    else {
      var api = new MemberApi();
      var instinfo = this.Base.getMyData().instinfo;
      var h1 = '';
      var h2 = '';
      if (daan1 == 1) {
        h1 = instinfo.D1;
      }
      if (daan1 == 2) {
        h1 = instinfo.D2;
      }
      if (daan1 == 3) {
        h1 = instinfo.D3;
      }
      if (daan1 == 4) {
        h1 = instinfo.D4;
      }
      if (daan2 == 1) {
        h2 = instinfo.D1;
      }
      if (daan2 == 2) {
        h2 = instinfo.D2;
      }
      if (daan2 == 3) {
        h2 = instinfo.D3;
      }
      if (daan2 == 4) {
        h2 = instinfo.D4;
      }
      console.log(h1, h2);

      api.adddati({ company_id: this.Base.options.id, xz1: daan1, xz2: daan2, information_id: this.Base.getMyData().companyinfo.zixun[0].id }, () => {
        api.guzhi2({ company_id: this.Base.options.id, h1: h1, h2: h2, type: this.Base.getMyData().companyinfo.zixun[0].type }, (ress) => {
          this.onMyShow();
        })
      })


    }
  }
  tiaozhen() {
    var api = new MemberApi();
    var a = this.Base.getMyData().a;
    console.log(a);
    if (a == '') {
      api.tiaozhencanshu({ company_id: this.Base.options.id }, (ress) => {
        wx.navigateTo({
          url: '/pages/guzhi/guzhi?id=' + this.Base.options.id,
        })
      })
    }
    else {
      this.Base.info("过一会，每次调整都有时间间隔的");
    }


  }
  toHHmmss(data) {
    var s;
    var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = parseInt((data % (1000 * 60)) / 1000);
    console.log(seconds);
    s = (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
    return s;
  };
  genduo() {
    wx.navigateTo({
      url: '/pages/zixunlist/zixunlist?id=' + this.Base.options.id,
    })
  }
  kuai4() {
    this.Base.setMyData({
      kuai4: !this.Base.getMyData().kuai4
    })
  }
  kuai3() {
    this.Base.setMyData({
      kuai3: !this.Base.getMyData().kuai3
    })
  }
  kuai2() {
    this.Base.setMyData({
      kuai2: !this.Base.getMyData().kuai2
    })
  }
  kuai1() {
    this.Base.setMyData({
      kuai1: !this.Base.getMyData().kuai1
    })
  }
  getyue(length) {
    var time = new Date();

    var list = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    var retunlist = [];

    for (var i = length - 1; i >= 0; i--) {
      var yueindex = time.getMonth() - i;
      if (yueindex < 0) {
        yueindex += 12;
      }
      retunlist.push(list[yueindex]);
    }
    console.log(retunlist);
    return retunlist
  }
  getri() {

  }
  konzhi(e) {
    console.log(e.currentTarget.dataset.id);
    this.Base.setMyData({
      type: e.currentTarget.dataset.id
    })
    var that = this;
    var ress = this.Base.getMyData().ress;
    var type = this.Base.getMyData().type;
    var list = [];
    var shizhi = [];

    var retunlist = [];

    if (type == 'ri') {
      shizhi = ress.rishizhi;
      ress.riavgcf.map((item) => {
        list.push(item.money);

      })
      retunlist = ress.rilist;
    }
    else {
      shizhi = ress.yueshizhi;
      ress.yueavgcf.map((item) => {
        list.push(item.money);

      })

      retunlist = content.getyue(ress.yueavgcf.length);
    }
    console.log('ssss',retunlist)
    console.log('ssss',list)
    var option = {
      // ----  标题 -----
      title: {
        text: '估值记录',
        padding: 10
      },

      tooltip: {
        show: true,   // 是否显示提示框，默认为true
        trigger: 'item', // 数据项图形触发
        axisPointer: {   // 指示样式
          type: 'shadow',
          axis: 'auto'
        },
        padding: 5,
        textStyle: {   // 提示框内容的样式
          color: '#fff'
        }
      },
      // ---- gird区域 ---
      grid: {
        x: 60,
        top: 50,
        x2: 40,
        y2: 30,
      },
      //  ------  X轴 ------
      xAxis: {
        show: true,  // 是否显示
        position: 'bottom',  // x轴的位置
        offset: 0, // x轴相对于默认位置的偏移
        type: 'category',   // 轴类型， 默认为 'category'
        name: '',    // 轴名称
        nameLocation: 'end',  // 轴名称相对位置
        nameTextStyle: {   // 坐标轴名称样式
          color: '#999999',
          padding: [5, 0, 0, -5]
        },
        nameGap: 15, // 坐标轴名称与轴线之间的距离
        nameRotate: 0,  // 坐标轴名字旋转

        axisTick: {    // 坐标轴 刻度
          show: true,  // 是否显示
          inside: true,  // 是否朝内
          length: 3,     // 长度
          lineStyle: {   // 默认取轴线的样式
            color: '#999999',
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: {    // 坐标轴标签
          show: true,  // 是否显示
          inside: false, // 是否朝内
          rotate: 0, // 旋转角度
          margin: 5, // 刻度标签与轴线之间的距离
          color: '#999999'  // 默认取轴线的颜色 
        },
        splitLine: {    // gird区域中的分割线
          show: false,  // 是否显示
          lineStyle: {
            // color: '#999999',
            // width: 1,
            // type: 'solid'
          }
        },
        splitArea: {    // 网格区域
          show: false  // 是否显示，默认为false
        },
        data: retunlist
      },
      //   ------   y轴  ----------
      yAxis: {

        show: true,  // 是否显示
        position: 'left', // y轴位置
        offset: 0, // y轴相对于默认位置的偏移
        type: 'value',  // 轴类型，默认为 ‘category’
        // 轴名称
        nameLocation: 'end', // 轴名称相对位置value
        nameTextStyle: {    // 坐标轴名称样式
          color: '#fff',
          padding: [5, 0, 0, 5]  // 坐标轴名称相对位置
        },
        nameGap: 15, // 坐标轴名称与轴线之间的距离
        nameRotate: 270,  // 坐标轴名字旋转


        axisTick: {      // 坐标轴的刻度
          show: true,    // 是否显示
          inside: true,  // 是否朝内
          length: 3,      // 长度
          lineStyle: {
            color: '#999999',  // 默认取轴线的颜色
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: {      // 坐标轴的标签
          show: true,    // 是否显示
          inside: false,  // 是否朝内
          rotate: 0,     // 旋转角度
          margin: 8,     // 刻度标签与轴线之间的距离
          color: '#999999',  // 默认轴线的颜色
        },
        splitLine: {    // gird 区域中的分割线
          show: true,   // 是否显示
          lineStyle: {
            color: '#E6E6E6',
            width: 1,
            type: 'dashed'
          }
        },
        splitArea: {     // 网格区域
          show: false   // 是否显示，默认为false
        }
      },
      //  -------   内容数据 -------
      series: [
        {
          name: '估值',      // 序列名称
          type: 'bar',      // 类型
          legendHoverLink: true,  // 是否启用图列 hover 时的联动高亮
          label: {   // 图形上的文本标签
            show: false,
            position: 'insideTop', // 相对位置
            rotate: 0,  // 旋转角度
            color: '#999999'
          },
          itemStyle: {    // 图形的形状
            barBorderRadius: [12, 12, 12, 12],
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#DB2026' },
                { offset: 1, color: '#FF7646' }
              ]
            ),

          },
          barWidth: 10,  // 柱形的宽度
          barCategoryGap: '20%',  // 柱形的间距
          data: list
        },
        {
          name: '市值',
          type: 'line',
          symbol: 'circle',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#FEAB2F'
              }
            }
          },
          data: shizhi,

        }
      ]
    };

    console.log("--------22222222-----------------");
    chart.setOption(option);
    console.log(chart);
  }
  konzhi1(e) {
    console.log(e.currentTarget.dataset.id);
    this.Base.setMyData({
      type1: e.currentTarget.dataset.id
    })
    var that = this;
    var ress = this.Base.getMyData().ress;
    var type = this.Base.getMyData().type1;
    var list = [];
    var shizhi = [];

    var retunlist = [];

    if (type == 'ri') {
      shizhi = ress.rishizhi;
      ress.riavgcf.map((item) => {
        list.push(item.shenglv*100);

      })
      retunlist = ress.rilist;
    }
    else {
      shizhi = ress.yueshizhi;
      ress.yueavgcf.map((item) => {
        list.push(item.shenglv*100);

      })

      retunlist = content.getyue(ress.yueavgcf.length);
    }
    console.log('ssss',retunlist)
    console.log('ssss',list)
    var option = {
      // ----  标题 -----
      title: {
        text: '评分记录',
        padding: 10
      },

      tooltip: {
        show: true,   // 是否显示提示框，默认为true
        trigger: 'item', // 数据项图形触发
        axisPointer: {   // 指示样式
          type: 'shadow',
          axis: 'auto'
        },
        padding: 5,
        textStyle: {   // 提示框内容的样式
          color: '#fff'
        }
      },
      // ---- gird区域 ---
      grid: {
        x: 40,
        top: 50,
        x2: 40,
        y2: 30,
      },
      //  ------  X轴 ------
      xAxis: {
        show: true,  // 是否显示
        position: 'bottom',  // x轴的位置
        offset: 0, // x轴相对于默认位置的偏移
        type: 'category',   // 轴类型， 默认为 'category'
        name: '',    // 轴名称
        nameLocation: 'end',  // 轴名称相对位置
        nameTextStyle: {   // 坐标轴名称样式
          color: '#999999',
          padding: [5, 0, 0, -5]
        },
        nameGap: 15, // 坐标轴名称与轴线之间的距离
        nameRotate: 0,  // 坐标轴名字旋转

        axisTick: {    // 坐标轴 刻度
          show: true,  // 是否显示
          inside: true,  // 是否朝内
          length: 3,     // 长度
          lineStyle: {   // 默认取轴线的样式
            color: '#999999',
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: {    // 坐标轴标签
          show: true,  // 是否显示
          inside: false, // 是否朝内
          rotate: 0, // 旋转角度
          margin: 5, // 刻度标签与轴线之间的距离
          color: '#999999'  // 默认取轴线的颜色 
        },
        splitLine: {    // gird区域中的分割线
          show: false,  // 是否显示
          lineStyle: {
            // color: '#999999',
            // width: 1,
            // type: 'solid'
          }
        },
        splitArea: {    // 网格区域
          show: false  // 是否显示，默认为false
        },
        data: retunlist
      },
      //   ------   y轴  ----------
      yAxis: {
        max: 100,
        show: true,  // 是否显示
        position: 'left', // y轴位置
        offset: 0, // y轴相对于默认位置的偏移
        type: 'value',  // 轴类型，默认为 ‘category’
        // 轴名称
        nameLocation: 'end', // 轴名称相对位置value
        nameTextStyle: {    // 坐标轴名称样式
          color: '#fff',
          padding: [5, 0, 0, 5]  // 坐标轴名称相对位置
        },
        nameGap: 15, // 坐标轴名称与轴线之间的距离
        nameRotate: 270,  // 坐标轴名字旋转


        axisTick: {      // 坐标轴的刻度
          show: true,    // 是否显示
          inside: true,  // 是否朝内
          length: 3,      // 长度
          lineStyle: {
            color: '#999999',  // 默认取轴线的颜色
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: {      // 坐标轴的标签
          show: true,    // 是否显示
          inside: false,  // 是否朝内
          rotate: 0,     // 旋转角度
          margin: 8,     // 刻度标签与轴线之间的距离
          color: '#999999',  // 默认轴线的颜色
        },
        splitLine: {    // gird 区域中的分割线
          show: true,   // 是否显示
          lineStyle: {
            color: '#E6E6E6',
            width: 1,
            type: 'dashed'
          }
        },
        splitArea: {     // 网格区域
          show: false   // 是否显示，默认为false
        }
      },
      //  -------   内容数据 -------
      series: [

        {
          name: '胜率',
          type: 'line',
          symbol: 'circle',
          smooth: false,
          areaStyle: {
            normal: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: "#FEAB2F" // 0% 处的颜色
                }, {
                  offset: 0.7,
                  color: "rgba(254, 171, 47, 0)" // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#FEAB2F'
              }
            }
          },
          data: list,

        }
      ]
    };

    console.log("--------22222222-----------------");
    chart.setOption(option);
    console.log(chart);
  }
  shouqi(e){
    var id = e.currentTarget.id;
    if(id==1){
var biao = this.Base.getMyData().biao
    if (biao==false) {
      this.Base.setMyData({biao:true})
    }else{
      this.Base.setMyData({biao:false})
    }
    }else{

      var health = this.Base.getMyData().health
    if (health==false) {
      this.Base.setMyData({health:true})
    }else{
      this.Base.setMyData({health:false})
    }

    }
    

  }
}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.select = content.select;
body.initChart = content.initChart;
body.getyue = content.getyue;
body.daan1 = content.daan1;
body.daan2 = content.daan2;
body.tiaozhen = content.tiaozhen;
body.toHHmmss = content.toHHmmss;
body.dawan = content.dawan;
body.genduo = content.genduo;
body.kuai4 = content.kuai4;
body.kuai3 = content.kuai3;
body.kuai2 = content.kuai2;
body.kuai1 = content.kuai1;
body.showecharts = content.showecharts;
body.showecharts1 = content.showecharts1;
body.showecharts2 = content.showecharts2;
body.konzhi = content.konzhi;
body.konzhi1 = content.konzhi1;
body.getri = content.getri;
body.shouqi = content.shouqi;

Page(body)