<template>
    <div class="loncom_content">
        <div class="control_list_detail">
            <div class="loncom_public_top">
                <div class="loncom_fl" @click="back" style="cursor:pointer;">返回</div>
                <div class="loncom_fr">
                    <el-button type="primary" size="mini" @click="showAlarm"><i class="el-icon-info loncom_mr5"></i>告警信息</el-button>
                </div>
            </div>
            <div class="loncom_public_con loncom_scroll_con">
                <div class="map_detail_top">
                    <div class="map_detail_box map_detail_top_left">
                        <div class="map_detail_title">
                            <span></span>基本信息
                        </div>
                        <div class="map_detail_con map_detail_top_left_con">
                            <p><span>池塘名称：</span><em>{{form_info.fname}}</em></p>
                            <p><span>池塘面积：</span><em>{{form_info.farea}}平方米</em></p>
                            <p><span>养殖物种：</span>
                            <span style="width:calc(100% - 100px);height:100%" class="numScroll1"><span class="numScrollCon1"><em v-for='item in wuzhongArr' class="wuzhong_name"  :title="item.fingername" @click='showWuzhong(item.fingerid)'>{{item.fingername}}</em></span></span></p>
                        </div>
                    </div>
                    <div class="map_detail_box map_detail_top_right">
                        <div class="map_detail_title">
                            <span></span>池塘概况
                        </div>
                        <div class="map_detail_con">
                            <div class="map_detail_top_rightl">
                                <div class="map_detail_top_rightl_img">
                                    <img :src="'static/upload/'+form_info.imgurl" style="width:180px;height:90px;">
                                </div>
                                <div class="loncom_fl map_detail_top_rightc">
                                    <div class="map_detail_controlcon" v-for="item in state">
                                        <div class="map_detail_controlinfo">
                                            <div class="map_detail_controlbox">
                                                <span  :class='item.className' v-if="item.data.alarm>0" >{{item.data.value}}</span>
                                                <span v-else>{{item.data.value}}</span>
                                                <p>{{item.title}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="map_detail_top_rightr">
                                <div class="loncom_map_boxconb_infovideo">
                                    <img src="static/images/shiping.png" @click="enterVideo()">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="map_detail_bottom map_detail_box">
                    <div class="map_detail_title">
                        <span></span>监控信息
                    </div>
                    <div class="map_detail_echar">
                        <div class="map_detail_echarbox" v-for="(item,index) in pieline">
                            <div class="map_detail_echarbox_con">
                            <div class="map_detail_echarbox_left" :id="'gauge'+index"></div>
                            <div class="map_detail_echarbox_right">
                                <div class="picker">
                                    <el-date-picker
                                    size="small"
                                    v-model="time[index]"
                                    type="datetimerange"
                                    :picker-options="pickerOptions"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right">
                                    </el-date-picker>
                                </div>
                                <div :id="'lineZoom'+index" class="linechar"></div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="gis_alarm_list" ref="gis_alarm_list">
                <alarmTop v-bind:Info="Info" v-on:getAlarm="getAlarm"></alarmTop>
                <el-scrollbar style="height:360px;">
                    <el-search-table-pagination  type="local"
                        url=""
                        list-field="list" 
                        total-field="total"
                        method='post' 
                        :formOptions="table_forms"
                        :show-pagination="false"
                        :page-sizes="[10000]"
                        border :data="table_data" :columns="table_columns" ref="thisRef">   
                        <el-table-column slot="prepend" type="selection"></el-table-column>                                     
                        <template slot-scope="scope" slot="preview-level">
                            <div v-if="scope.row.level>=4||scope.row.level=='4'">
                                <span class="alarm_one_color"><i class="fa fa-exclamation-triangle loncom_mr5"></i>一级</span>
                            </div>
                            <div v-if="scope.row.level==3||scope.row.level=='3'">
                                <span class="alarm_two_color"><i class="fa fa-exclamation-circle loncom_mr5"></i>二级</span>
                            </div>
                            <div v-if="scope.row.level==2||scope.row.level=='2'">
                                <span class="alarm_three_color"><i class="fa fa-exclamation-circle loncom_mr5"></i>三级</span>
                            </div>
                            <div v-if="scope.row.level==1||scope.row.level=='1'">
                                <span class="alarm_four_color"><i class="fa fa-exclamation-circle loncom_mr5"></i>四级</span>
                            </div>
                        </template>
                        <template slot-scope="scope" slot="preview-handle">
                            <div>
                                <a href="javascript:;" class="loncom_color" @click="sure(scope.row)">确认</a> 
                            </div>
                        </template>
                    </el-search-table-pagination>
                </el-scrollbar>
            </div>
        </div>
        <Show v-bind:dialogInfo="showInfo" v-if="showInfo.visible"></Show>
         <WuZhong v-bind:dialogInfo="wuzhongInfo" v-if="wuzhongInfo.visible"></WuZhong>
    </div>
</template>
<style>
    .control_list_detail{
        width:100%;
        height:100%;
        position:relative;
    }
    .control_list_detail .map_detail_top{
        width: 100%;
        height: 150px;
        margin-bottom: 15px;
    }
    .control_list_detail .map_detail_title{
        height: 35px;
        line-height: 35px;
        padding: 0 10px;
        font-size: 14px;
        color: #000;
    }
    .control_list_detail .map_detail_title span{
        width: 18px;
        height: 18px;
        display: inline-block;
        border: 4px solid #00B15F;
        border-radius: 50%;
        margin-right: 8px;
        vertical-align: middle;
    }
    .control_list_detail .map_detail_con{
        padding: 0 20px 20px 20px;
        height: calc(100% - 35px);
    }
    .control_list_detail .map_detail_box{
        background: #fff;
        border-radius: 5px;
    }
    .control_list_detail .map_detail_top_left{
        width: 35%;
        height: 100%;
        float: left;
        margin-right: 15px;
    }
    .control_list_detail .map_detail_top_left_con p{
        height: 30px;
        line-height: 30px;
        color: #333;
        font-size: 14px;
        overflow: hidden;
    }
    .control_list_detail .map_detail_top_left_con p span{
        display: inline-block;
        color: #999;
        width: 100px;
        float:left;
    }
        .control_list_detail .map_detail_top_left_con p span.numScrollCon1{
            width:100%;
            height:auto;
        }
    .control_list_detail .map_detail_top_right{
        width: calc(65% - 15px);
        height: 100%;
        float:left;
    }
    .control_list_detail .map_detail_top_rightl{
        width: 80%;
        height: 100%;
        border-right: 1px solid #ddd;
    }
    .control_list_detail .map_detail_top_rightl,
    .control_list_detail .map_detail_top_rightr,
    .control_list_detail .map_detail_controlcon,
    .control_list_detail .map_detail_controlimg{
        float:left;
    }
    .control_list_detail .map_detail_top_rightl_img{
        width:180px;
        margin-right: 10px;
        float:left;
        padding-top: 10px;
    }
    .control_list_detail .map_detail_top_rightc{
        width: calc(100% - 190px);
        height: 100%;
    }
    .control_list_detail .map_detail_controlimg{
        height: 100%;
        width:40px;
        text-align:center;
    }
    .control_list_detail .map_detail_controlimg img{
        margin-top: 15px;
        max-width: 40px;
    }
    .control_list_detail .map_detail_controlcon{
        height: 55px;
        width: 50%;
    }
    .control_list_detail .map_detail_controlbox{
        width: 120px;
        text-align:center;
        margin: 0 auto;
    }
    .control_list_detail .map_detail_controlbox p{
        color: #999;
        margin-bottom: 5px;
    }
    .control_list_detail .map_detail_controlbox span{
        padding: 4px 15px;
        text-align: center;
        min-width: 80px;
        display:inline-block;
        margin: 0 auto;
        color: #fff;
        background: #13AE2F;
        border-radius: 14px;
        font-size: 14px;
    }
    .control_list_detail .map_detail_controlbox span.alarm{
        background:#F00;
    }
    .control_list_detail .map_detail_controlbox span.alarm_one_bg{
    background: #C5051B;
    }
    .control_list_detail .map_detail_controlbox span.alarm_two_bg{
    background: #FF1A07;
    }
    .control_list_detail .map_detail_controlbox span.alarm_three_bg{
    background: #FF7B00;
    }
    .control_list_detail .map_detail_controlbox span.alarm_four_bg{
    background: #FFA300;
    }
    .control_list_detail .map_detail_top_rightr{
        width: 20%;
        height: 100%;
        padding: 10px 0 0 10px;
        position:relative;
    }
    .control_list_detail .map_detail_controlinfor{
        width: calc(100% - 40px);
    }
    .control_list_detail .map_detail_controlinfor .map_detail_controlbox{
        float:left;
        margin-bottom: 20px;
    }
    .control_list_detail .map_detail_yibiaopan{
        padding-top: 10px;
    }
    .control_list_detail .map_detail_echarbox{
        width: 100%;
        height: 220px;
        margin-bottom: 20px;
    }
    .control_list_detail .map_detail_echarbox_con{
        width: 100%;
        height: 100%;
    }
    .control_list_detail .map_detail_echarbox_left{
        width: 120px;
        height: 100%;
        float:left;
    }
    .control_list_detail .map_detail_echarbox_right{
        width: calc(100% - 120px);
        height: 100%;
        overflow:hidden;
        float:left;
    }
    .control_list_detail .map_detail_echarbox_right .picker{
        height:35px;
        text-align:right;
    }
    .control_list_detail .map_detail_echarbox_right .linechar{
        width: 100%;
        height: calc(100% - 35px);
    }
    .control_list_detail .map_detail_top_rightr_info{
        clear:both;
        padding:10px 0 0 10px;
    }
    .control_list_detail .map_detail_top_rightr_info p{
        height: 26px;
        line-height:26px;
    }
    .loncom_map_boxconb_infovideo{
        width: 60px;
        margin:0 auto;
        cursor:pointer;
    }
    .loncom_map_boxconb_infovideo img{
        width: 100%;
    }
    .control_list_detail .map_detail_bottom {
        width:100%;
    }
    .control_list_detail .map_detail_echar{
        width: 100%;
        padding: 0 20px;
    }
    .control_list_detail .wuzhong_name{
        margin-left:4px;
        color:#13AD2F;
        cursor:pointer;
    }
    .control_list_detail .wuzhong_name:hover{
        color:#333;
    }
</style>

<script>
var axios = require('axios')
import alarmTop from '@/components/alarm_top.vue'
import Show from '@/components/video_gis_show.vue'
import WuZhong from '@/components/record_finger_detail.vue'
export default {
    created () {
        this.Info.id=this.publicInfo.addrid;
        this.$api.post('/scinfo/details', {addrid:this.publicInfo.addrid}, r => {
            console.log(r)
            if(r.err_code=="0"){
                this.form_info=r.data;
                if(r.data.item.length>0){
                   this.wuzhongArr = r.data.item;
                }
                this.title=r.data.fname+"详情";
            }else{
                this.$message.warning(r.err_msg);
            }
        });
        this.Info._export=this.$store.state.control_list.export;
        this.getConfig();
    },
    mounted() {
        scrollCon();
numScroll(1);
		
    },
    data() {
       return {
          　title:'',
            Info:{
               title:'实时事件',
               his:false,
               _export:'',
               id:'',
               visible:false,
            },
            form_info:{
                fname:'',
                farea:'',
                imgurl:'',

            },  //详情
            wuzhongArr:[],
            wuzhongInfo:{
                id:'',
               title:'鱼种详情',
                visible:false
            },
            table_data:[],
            table_forms: {
                inline: true,
                size:'small',
                initParams:{queryKey:""},
                forms: []
            },
            table_columns:[
                { prop: 'level', label: '告警等级',minWidth:10,slotName:'preview-level'},
                { prop: 'eventname', label: '事件名称',minWidth:10},
                { prop: 'content1', label: '事件定位',minWidth:30},
                { prop: 'alarmtime', label: '告警时间',minWidth:15},
                { prop: 'cfmoper', label: '确认人',minWidth:10},
                { prop: 'cfmtime', label: '确认时间',minWidth:15},
                { prop: 'handle', label: '告警处理',slotName:'preview-handle',width:100},
            ],
            pickerOptions: {
                shortcuts: [{
                    text: '今日',
                    onClick(picker) {
                        const theDate = new Date();
                        const start=theDate.Format("yyyy-MM-dd 00:00:00");
                        const end=theDate.Format("yyyy-MM-dd 23:59:59");
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '本周',
                    onClick(picker) {
                        const theDate = new Date();
                        const nowDay=theDate.getDay();
                        let start=null;
                        let end=null;
                        if(nowDay!=0){
                            start=new Date(theDate.getTime()-3600*1000*24*(nowDay-1)).Format("yyyy-MM-dd 00:00:00");
                            end=new Date(theDate.getTime()+3600*1000*24*(7-nowDay)).Format("yyyy-MM-dd 23:59:59");
                        }else{
                            start=new Date(theDate.getTime()-3600*1000*24*6).Format("yyyy-MM-dd 00:00:00");
                            end=theDate.Format("yyyy-MM-dd 23:59:59");
                        }
                        picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '本月',
                    onClick(picker) {
                        const theDate = new Date();
                        let theMonth=theDate.getMonth();
                        const start = new Date(theDate.getFullYear(),theMonth,1).Format("yyyy-MM-dd 00:00:00");
                        let nextMonth=theMonth+1;
                        const end=new Date(new Date(theDate.getFullYear(),nextMonth,1)-1000*60*60*24).Format("yyyy-MM-dd 23:59:59");
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

            //池塘状态
            state:[],
            pieline:[], //仪表盘 折线
            time:[],
            otime:[], //折线切换时间用
            showInfo:{
                title:"视频预览",
                visible:false,
                row:{},
                data:[],
            },
       }
   },
    methods:{
        showWuzhong:function(id){
              this.wuzhongInfo.id = id;
              this.wuzhongInfo.visible = true;
        },
        back:function(){
           
            this.$router.push({path:this.publicInfo.backUrl});
        },
        //获取池塘状态
        getState:function(){
            if (this && this._isDestroyed) {return}
            var arr=[];
            for(var i=0;i<this.state.length;i++){
                arr.push(this.state[i].pointid);
            }
            this.$api.post('/gis/querydevvalue', {pointid:arr.toString(),addrid:this.publicInfo.addrid}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    for(var i=0;i<this.state.length;i++){
                        let alarmLevel = "";
                        if(JSON.stringify(r.data) == "{}" ){
                            alarmLevel = "";
                        }else{
                            this.state[i].data=r.data[this.state[i].pointid];
                            alarmLevel = r.data[this.state[i].pointid].alarm;
                        }
                        this.state[i].className = alarmLevel==1?'alarm_four_bg':alarmLevel==2?"alarm_three_bg":alarmLevel==3?"alarm_two_bg":alarmLevel==4?'alarm_one_bg':'';
                    }
                    setTimeout(()=>{
                        this.getState();
                    },2000)
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
        //获取监控信息配置文件
        getConfig:function(){
            axios.get('static/config/gis.json').then(r=>{
                console.log(r)
                if(r.status==200){
                    this.state=r.data[0];
                    this.pieline=r.data[1];
                    for(var i=0;i<r.data[1].length;i++){
                        this.time.push([]);
                        this.otime.push([]);
                    }
                    console.log(this.time)
                }else{
                    this.$message.warning("配置文件读取失败");
                }
            });
        },
        //获取折线图
        getLine:function(pointid,btime,etime){
            this.$api.post('/Dev/getaddrpidhis1', {pid:pointid,addrid:this.publicInfo.addrid,begintime:btime,endtime:etime}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    for(var i=0;i<r.data.length;i++){ 
                        for(var j=0;j<this.pieline.length;j++){
                            if(r.data[i].ch==this.pieline[j].pointid){
                                gaugeChar("gauge"+j, this.pieline[j].title, r.data[i].value,this.pieline[j].min,this.pieline[j].max);
                                var xData = [];
                                var yData = [];
                                if(r.data[i].data.length>0){
                                    for(var k=0;k<r.data[i].data.length;k++){
                                        xData.push(r.data[i].data[k].TIME);
                                        yData.push(r.data[i].data[k].VALUE);
                                    }
                                }else{
                                    xData.push(new Date().Format("yyyy-MM-dd hh:mm:ss"))
                                    yData.push(0);
                                }
                                lineZoom("lineZoom"+j, this.pieline[j].title, xData, yData,r.data[i].type,this.pieline[j].unit); 
                            }
                        }
                    }
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
        
        showAlarm:function(){
            $(this.$refs.gis_alarm_list).css({"bottom":"0px"});
            this.Info.visible=true;
            this.getAlarm();
        },
       //底部获取告警
        getAlarm:function(info){
            var level=info?info:"";
            this.$api.post('/gis/getaddridalarmall', {addrid:this.publicInfo.addrid,level:level}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.table_data=r.data;
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
       //确认告警
        sure:function(row){
           console.log(row)
           if(this.$store.state.control_list.alarm){
               this.$confirm("确定删除?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning',
                }).then(() => {
                    var ids=row.mgrobjid+"%"+row.id+"%"+row.eventbm;
                    this.$api.post('/Alarmstrategy/alarmconfirm', {ids:ids,cfm:""}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.getAlarm();
                        this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
                });
               
           }else{
               this.$message.warning("您没有权限确认告警");
           }
           
        },
        enterVideo:function(){
            this.$api.post('/gis/getaddridvideall', {addrid:this.publicInfo.addrid}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    if(r.data.length>0){
                        this.showInfo.data=r.data;
                        this.showInfo.visible=true;
                    }else{
                        this.$message.info("无视频监控");
                    }
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
    },
    watch:{
        state:function(){
            this.getState();
        },
        pieline:function(){
            var arr=[];
            for(var i=0;i<this.pieline.length;i++){
                arr.push(this.pieline[i].pointid);
            }
            this.getLine(arr.toString(),new Date().Format("yyyy-MM-dd 00:00:00"),new Date().Format("yyyy-MM-dd hh:mm:ss"))
        },
        time:{
          handler:function(val,oldval){
              for(var i=0;i<this.pieline.length;i++){
                  if(this.time[i]!=null&&this.time[i].length>0){
                      if(new Date(val[i][0]).getTime()!=new Date(this.otime[i][0]).getTime()&&new Date(val[i][1]).getTime()!=new Date(this.otime[i][1]).getTime()){
                          this.getLine(this.pieline[i].pointid,new Date(val[i][0]).Format("yyyy-MM-dd hh:mm:ss"),new Date(val[i][1]).Format("yyyy-MM-dd hh:mm:ss"))
                          this.otime[i]=val[i];
                      }
                  }
              }
          },
          deep: true
        },
    },
    props:["publicInfo"],
    components:{alarmTop,Show,WuZhong}
}
</script>