var rootUrl="/iSmacSite/ismacsite";
var _rootUrl="/iSmacSite";
var pageTimer = {}; //视频用
// var topAlarm;  //告警头部的条数
var heartws;
//超出滚动
function scrollCon(){
	$('.loncom_scroll_con').niceScroll({
        cursorcolor: "#ccc",//#CC0071 光标颜色
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
        cursorwidth: "5px", //像素光标的宽度
        cursorborder: "0", // 游标边框css定义
        cursorborderradius: "2px",//以像素为光标边界半径
        autohidemode: true //是否隐藏滚动条
    });
}

$(window).resize(function () {
	scrollCon();
});
function numScroll(num){
    $('.numScroll'+num).niceScroll(".numScrollCon"+num,{
        cursorcolor: "#ccc",//#CC0071 光标颜色
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
        cursorwidth: "5px", //像素光标的宽度
        cursorborder: "0", // 游标边框css定义
        cursorborderradius: "2px",//以像素为光标边界半径
        autohidemode: true //是否隐藏滚动条
    });
}
//日期格式化
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//var url="192.168.16.115"
//var port="8080";
var url = location.host.indexOf("/")!=-1?location.host.slice(0, location.host.indexOf("/")):location.host
//websocket的连接函数
function heartwsConnection(callback) {

    try {
        var SOCKECT_ADDR = "ws://" + url+'/iSmacSite/websocket';
        heartws = new WebSocket(SOCKECT_ADDR);
        heartws.onopen = function (event) {
            callback();
        };
        //heartws.onmessage = callback;
        heartws.onclose = function (event) {
        };
        heartws.onerror = function (event) {
           // console("WebSocket异常！" + event.toString());
        };
    } catch (ex) {

    }
}
function wsConnection(json,callback) {
    console.log(json)
    try {
        var SOCKECT_ADDR = "ws://" + url+'/iSmacSite/websocket';
        var ws = new WebSocket(SOCKECT_ADDR);
        ws.onopen = function (event) {
            console.log("已经与服务器建立了连接\r\n当前连接状态：" + this.readyState);
            ws.send(JSON.stringify(json));
        };

        ws.onmessage = callback;
        ws.onclose = function (event) {
        };
        ws.onerror = function (event) {
           // console("WebSocket异常！" + event.toString());
        };
    } catch (ex) {
        console(ex.message);
    }
}

function hbarChar(ID,yData,oneData,twoData,threeData,fourData){
    // var yData=['1号池塘','2号池塘','3号池塘','4号池塘','5号池塘','6号池塘','7号池塘'];
    var myChart = echarts.init(document.getElementById(ID));

    var option = {
        color: ['#C5051B','#FF1A07','#FF7B00','#FFA300'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            //formatter: '{b}：{c}'
        },
        grid: {
            top: '50px',
            bottom: '20px',
            left: '15px',
            right: '5px',
            containLabel: true
        },
        legend: {
            top:'0px',
            right:'15px',
            textStyle:{
                color:"#000",
            },
            data: ['一级告警', '二级告警','三级告警','四级告警']
        },
        xAxis:  {
            type: 'category',
            axisTick: {
                show: false
            },
            axisLabel: {
                color: "#000"
            },
            splitLine: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: "#666",
                    width: 1,
                }
            },
            axisLabel: {
                interval: 0,
                rotate: -50,
                color: "#000"
            },
            data: yData,
        },
        yAxis: {

            type: 'value',
            axisLabel: {
                color: "#ccc"
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: "#666",
                    width: 1,
                }
            },
        },
        series: [
            {
                name: '一级告警',
                type: 'bar',
                stack: 'all',
                barWidth: '30%',
                //data: [0, 302, 0, 0, 0, 0, 400]
                data:oneData
            },
            {
                name: '二级告警',
                type: 'bar',
                stack: 'all',
                barWidth: '30%',
                data:twoData
            },
            {
                name: '三级告警',
                type: 'bar',
                stack: 'all',
                barWidth: '30%',
                data:threeData
            },
            {
                name: '四级告警',
                type: 'bar',
                stack: 'all',
                barWidth: '30%',
                data:fourData
            }
        ]
    };
    myChart.setOption(option, true);
    return myChart;
}

//首页当前告警统计
function piemoreChar(ID, xData, yData, color) {
    var myChart = echarts.init(document.getElementById(ID));
    var _color = ["#00DCB8", "#00E1FF", "#A3E8DE", "#579CFF"];
    if (color) {
        for (var i = 0; i < color.length; i++) {
            if (color[i] != "") {
                _color[i] = color[i];
            }
        }
    }
    var option = {
        color: _color,
        // title: {
        //     text: "告警总数：" + allAlarm,
        //     top: 15,
        //     left: 15,
        //     textStyle: {
        //         color: _color[0],
        //     },
        // },
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        legend: {
            y: 'center',
            orient: 'vertical',
            x: '20px',
            textStyle: {
                color: '#000'
            },
            data: xData
        },
        series: [
            {
                type: 'pie',
                radius: ['70%', '80%'],
                center:['60%','50%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: yData
            }
        ]
    };
    myChart.setOption(option, true);
    return myChart;
}

//gis列表详情 ，报表
function lineZoom(ID, name, xData, yData,type,unit) {
    var unit=unit?unit:'';
    var myChart = echarts.init(document.getElementById(ID));
    var option = {
        color: ["#13AD2F"],
        grid: {
            left: '45',
            right: '15',
            top: '10',
            bottom: '10',
            containLabel: true
        },
        tooltip : {
            trigger: 'axis'
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: "#999",
                        width: 1,
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: "#666",
                    formatter:function(params){
                        if(type=="1"){
                            return new Date(params).Format('hh:mm:ss')
                        }else if(type=="2"){
                            return new Date(params).Format('yyyy-MM-dd')
                        }else{
                            return new Date(params).Format('yyyy-MM-dd hh:mm:ss')
                        }
                        
                    }
                },
                data: xData
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitLine: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: "#999",
                        width: 1,
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: "#1c3042",
                        width: 1,
                        type: "dashed",
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: "#666",
                    formatter: '{value} '+unit
                }
            }
        ],
        series: [
                {
                    name: name,
                    type: 'line',
                    smooth: "true", //平滑
                    symbol:"line", //不要圆圈
                    symbolSize: 0,
                    data: yData
                },
        ]
    };
    myChart.setOption(option, true);
    return myChart;
}
function gaugeChar(ID,name,value,min,max) {
    var min=min?min:0;
    var max=max?max:100;
    var myChart = echarts.init(document.getElementById(ID));
    var option = {

        tooltip: {
            formatter: "{a} : {c}"
        },
        series: [
            {
                name:name,
                type: 'gauge',
                radius: '98%',
                min: min,
                max: max,
                splitNumber: 0,
                axisLine: {
                    lineStyle: {
                        color: [[1, '#13AD2F']],
                        width: '10',
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                pointer: {
                    length: '75%',
                    width: '4%'
                },
                itemStyle: {
                    normal: {
                        color: '#13AD2F'
                    }
                },
                title: {
                    show: true
                },
                detail: {
                    show: true,
                    textStyle: {
                        fontSize: 12,
                        color: '#13AD2F',
                    },
                    formatter: name+'=' + '{value}',
                    offsetCenter: [0, '88%'],


                },
                data: [{ value: value }]
            }
        ]
    };
    myChart.setOption(option, true);
    return myChart;
}
//统计

function lineMore(ID,xData, yData,lgData) {
    // var xData=["09:00", "09:03", "09:13", "09:14", "09:24","09:34","09:44","09:54","10:04","10:14","10:24"];
    // var yData=[
    //      {
    //         name:'池塘一',
    //         type:'line',
    //         smooth:"true", //平滑
    //         symbol:"line", //不要圆圈
    //         symbolSize:0, //平滑的时候设置为0
    //         data:[320, 232, 301, 234, 390, 230, 310,18, 391, 234, 290, 343, 310]
    //     },
    //     {
    //         name:'池塘二',
    //         type:'line',
    //         smooth:"true", //平滑
    //         symbol:"line", //不要圆圈
    //         symbolSize:0, //平滑的时候设置为0
    //         data:[220, 18, 391, 234, 290, 343, 310, 301, 234, 390, 230, 310,18]
    //     },
    // ];
    var myChart = echarts.init(document.getElementById(ID));
    var option = {
        color:["#4472C5","#ED7C30",'#9BA5AF',"#FFC302",'#6297CB','#70AD46','#70AD46'],
        //  title: {
        //     text: name,
        //     top:5,
        //     left:10,
        //     textStyle:{
        //         color:"#000",
        //         verticalAlign:'top',
        //         fontWeight:'normal',
        //         fontSize:'14'
        //     }
        // },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            bottom: 10,
            textStyle:{
                color:"#000"
            },
            data:lgData
        },
        grid: {
            left: '15px',
            right: '30px',
            top:'15%',
            bottom: '15%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                axisLine:{
                    lineStyle:{
                        color:"#999",
                        width:1,
                    }
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    color:"#999"
                },
                data :xData
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitLine:{
                    show:false,
                },
                axisLine:{
                    lineStyle:{
                        color:"#999",
                        width:1,
                    }
                },
                 splitLine:{
                    show:true,
                    lineStyle:{
                        color:"#aaa",
                        width:1,
                        type:"dashed",
                    }
                },
                axisTick:{
                    show:false
                },
                axisLabel:{
                    color:"#999",
					formatter: '{value}'
                }
            }
        ],
        series : yData
    };
    myChart.setOption(option, true);
    return myChart;
}
function open_ajax(url, parameter, request,type, error, async) {
    type = type ? type : "Get";
    $.ajax({
        type: type,
        url: url,
        data: parameter,
        async: async ? async : true,
        cache:false,
        error: function () {
            if (error != null && error != "") {
                error();
            }
        },
        success: function (msg) {
            if (request)
                request(msg);
        }
    });
}
























