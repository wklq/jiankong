<template>
    <div class="loncom_content control_scsi_garden">
        <div class="loncom_public_top">
            <div class="search loncom_fl">
                组态视图>园区
            </div>
        </div>
        <div class="loncom_public_con loncom_scroll_con" style="text-align:center;position:relative; margin:0 auto;width:1300px;">
          <img src="static/images/chejian_02.png" style="height:100%;vertical-align: top">
            <i class="el-icon-location" style="font-size: 20px;position: absolute;top: 14%;left: 64.5%;color: #00ffde;cursor:pointer" @click="showChitang(0)"></i>
             <i class="el-icon-location" style="font-size: 20px;position: absolute;top: 19%;left: 44%;color: #00ffde;cursor:pointer" @click="showChitang(1)"></i>
            <i class="el-icon-location" style="font-size: 20px;position: absolute;top: 27%;left: 32.5%;color: #00ffde;cursor:pointer" @click="showChitang(2)"></i>    
            <i class="el-icon-location" style="font-size: 20px;position: absolute;top: 36%;left: 63.5%;color: #00ffde;cursor:pointer" @click="showChitang(3)"></i>
          <i class="el-icon-location" style="font-size: 20px;position: absolute;top: 42%;left: 34%;color: #00ffde;cursor:pointer" @click="showChitang(4)"></i>
          <i class="el-icon-location" style="font-size: 20px;position: absolute;top: 53%;left: 53%;color: #00ffde;cursor:pointer" @click="showChitang(5)"></i>
            <i class="el-icon-location" style="font-size: 14px;position: absolute;top: 68%;left: 53.2%;color: #00ffde;cursor:pointer" @click="showChitang(6)"></i>
          <div class="loncom_dialog_con" v-show="dialogState" v-bind:style="{top: dialogTop+'px',left:dialogLeft+'px'}">
            <i id="dialogClose" @click="closeDialog()" class="el-icon-close" style="cursor:pointer;color:#fff;position: absolute;top:2px;right:2px;"></i>
           <div class="loncom_map_boxtop" style="color:#fff;background: #4889E9;border: 0;padding:0 20px;text-align: left;">
            <i style="margin:0 5px 0 10px;" class="fa fa-wifi"></i><span>{{info.p_name}}<em class="showAlarm" @click="showAlarm()" style="font-size:12px;margin-left:5px;cursor:pointer;">详情</em></span>
            </div>
           <div class="loncom_map_boxinfo" style="color:#fff;padding:0 10px;background: #4889E9;" v-if="info.fish.length>0">

            <div class="img"><img :src="'static/upload/'+info.fish[0].imgurl" style="width:100%;height:80px;"></div>
            <div class="info" style="width:calc(100% - 120px)">
              <p style="margin:10px 0">生物品种：<span>{{info.fish[0].fingername}}</span></p>
              <p style="margin:10px 0">池塘面积：<span>{{info.farea}}㎡</span></p>
            </div>
          </div>
            <div class="loncom_map_boxinfo" style="height:150px;background: #fff;color:#333;padding:20px 0;">
              <div class="info_left" style="border-right:2px solid #ddd" >
                <div class="info_four" v-for="item in state">
                  <p>
                  <span class="info_value" v-if="item.data.alarm>0" style="color:#f00">{{item.data.value}}{{item.unit}}</span>
                  <span class="info_value" v-else>{{item.data.value}}{{item.unit}}</span>
                  </p>
                  <p>{{item.title}}</p>
                </div>

              </div>
              <div class="info_right">
                <div class="loncom_map_boxconb_infovideo" style="text-align: center;"><img src="static/images/shiping.png" @click="enterVideo" style="width:40%;margin-top:30%;" ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="gis_alarm_list" ref="gis_alarm_list">
          <alarmTop v-bind:Info="Info"></alarmTop>
          <el-scrollbar style="height:360px;">
            <el-search-table-pagination  type="local"
                                         url=""
                                         list-field="list"
                                         total-field="total"
                                         method='post'
                                         :formOptions="table_forms"
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
        <Show v-bind:dialogInfo="showInfo" v-if="showInfo.visible"></Show>
    </div>


</template>

<style>
  .control_scsi_garden .loncom_map_box{
    min-width: 385px;
    height: auto;
    overflow: hidden;
    box-shadow: 1px 1px 3px #ccc;
    background: #fff;
    margin-bottom: 25px;
  }
  .control_scsi_garden .loncom_map_boxtop {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #12AE67;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #fff;
  }
  .control_scsi_garden .loncom_dialog_con{
  width:320px;
  padding:0;
  position:absolute;
  }
  .control_scsi_garden .loncom_map_boxinfo {
    width: 100%;
    height: 100px;
    background: #12AE67;
    padding: 10px;
    color: #fff;
    font-size: 12px;
    line-height: 25px;
  }
  .control_scsi_garden .loncom_map_boxinfo .img{
    width: 120px;
    height:80px;
    float:left;
  }

  .control_scsi_garden .info_four{
  width:50%;
  float:left;

  }
  .control_scsi_garden .info_four .info_value{
  font-size:18px;
  }
  .control_scsi_garden .img,.control_scsi_garden .info{
  float:left;
  }
  .control_scsi_garden .img{
  width:120px;
  }
  .control_scsi_garden .info_four p{
  line-height:1.5;
  }
  .control_scsi_garden .info_left{
  width:70%;
  float:left;
  }
  .control_scsi_garden .info_left .info_four:nth-child(1),.control_scsi_garden .info_left .info_four:nth-child(2){
  margin-bottom:15px;
  }
  .control_scsi_garden .info_right{
  width:30%;
  float:right;

  }

</style>

<script>
  var axios = require('axios')
  import alarmTop from '@/components/alarm_top.vue'
  import Show from '@/components/video_gis_show.vue'
export default {

    created () {

    },
    mounted() {
       scrollCon()

      axios.get('static/config/chitang.json').then(r=>{
        if(r.status==200){
          this.chitangIds=r.data;
        }else{
          this.$message.warning("配置文件读取失败");
        }
      });
       this.getConfig();
    },
    data() {
       return {
         addrId:'',
         state:[],
         chitang:[],
         Info:{
           title:'实时事件',
           his:false,
           _export:'',
           id:'',
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
         chitangIds:[],
         dialogState:false,
         dialogTop:0,
         dialogLeft:0,
        info:{
          p_name:'',
          p_img:'',
          farea:'',
          fish:[
            {}
            ],
          temp:'',
          DO:'',
          PH:'',
          NH:''
        },
         showInfo:{
           title:"视频预览",
           visible:false,
           row:{},
           data:[],
         },

       }
   },
    methods:{
      getConfig:function(){
        axios.get('static/config/gis.json').then(r=>{

          if(r.status==200){

            this.state=r.data[0];
          }else{
            this.$message.warning("配置文件读取失败");
          }
        });
      },
      closeDialog(){
        this.dialogState = false;
      },
      showChitang:function(i) {
        if(typeof (i)!=="number"){
          return;
        }
        this.dialogState = false;
        if(event.target.offsetTop>300){
          this.dialogTop = event.target.offsetTop-300;
          this.dialogLeft = event.target.offsetLeft;
        }else{
          this.dialogTop = event.target.offsetTop+20;
          this.dialogLeft = event.target.offsetLeft;
        }
        const _this = this;
        const id = this.chitangIds[i].id;
        this.$api.post('/scinfo/details', {id: id}, r => {
          console.log(r)
          if (r.err_code == "0") {
            _this.dialogState = true;
            _this.info.p_name = r.data.fname;
            _this.info.farea = r.data.farea;
            _this.info.fish = r.data.item;
            _this.addrId = r.data.fworkshop;
            var arr=[];
            for(var i=0;i<_this.state.length;i++){
              arr.push(_this.state[i].pointid);
            }
            this.$api.post('/gis/querydevvalue', {pointid:arr.toString(),addrid:_this.addrId}, r => {

              if(r.err_code=="0"){
                for(var i=0;i<_this.state.length;i++){
                  _this.state[i].data=r.data[_this.state[i].pointid];
                }
              }else{
                this.$message.warning(r.err_msg);
              }
            });
          } else {
            _this.dialogState = false;
            this.$message.warning(r.err_msg);
          }
        });


      },
      showAlarm:function(){
        console.log()
        this.$router.push({path:'/control/scsi/detail',query:{addrid:this.addrId}});
        // $(this.$refs.gis_alarm_list).css({"bottom":"0px"});
        // this.getAlarm();

      },
      // //底部获取告警
      // getAlarm:function(info){
      //   var level=info?info:"";
      //   this.$api.post('/gis/getaddridalarmall', {addrid:this.addrId,level:level}, r => {
      //     console.log(r)
      //     if(r.err_code=="0"){
      //       this.table_data=r.data;
      //     }else{
      //       this.$message.warning(r.err_msg);
      //     }
      //   });
      // },
      enterVideo:function(){
        this.$api.post('/gis/getaddridvideall', {addrid:this.addrId}, r => {
          console.log(r)
          if(r.err_code=="0"){
            if(r.data.length>0){

              this.showInfo.data=r.data;
              this.showInfo.visible=true;
            }else{
              this.$message.info("此池塘下无视频监控");
            }
          }else{
            this.$message.warning(r.err_msg);
          }
        });
      },

    },
    watch:{


    },
    components:{alarmTop,Show}
}
</script>
