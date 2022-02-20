// components/canvas-ring/canvas-ring.js
var windWidth = wx.getSystemInfoSync().windowWidth;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //画布的宽度 默认占屏幕宽度的0.4倍
    canvasWidth: {
      type: Number,
      value: windWidth * 0.4
    },
    //线条宽度 默认10
    lineWidth: {
      type: Number,
      value: 10
    },
    //线条颜色 默认"#393"
    lineColor: {
      type: String,
      value: "#FBCD1E"
    },
    //标题 默认“完成率”
    title: {
      type: String,
      value: "完成率"
    },
    //当前的值 默认45
    value: {
      type: Number,
      value: 45
    },
    //值的颜色 默认"#ff9c07"
    valueColor:{
      type: String,
      value: "#FBCD1E"
    },
    //最大值 默认100
    maxValue: {
      type: Number,
      value: 100
    },
    //最小值 默认0
    minValue: {
      type: Number,
      value: 0
    },
    //当前值的后缀名
    suffix: {
      type: null,
      value: "%"
    },
    //从什么角度开始 0~360之间 （12点方向为0,18点方向为180,0点方向为360）
    startDegree: {
      type: Number,
      value: 0
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    canvasWidth: windWidth * 0.4,
    isMarginTop: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showCanvasRing() {
     



    }
  }
})