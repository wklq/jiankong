<template>
    <div class="loncom_public_top alarm_top">
        <div class="loncom_fl">{{Info.title}}</div>
        <div class="loncom_fl sort">
            <el-checkbox v-model="form_info.allAlarm" label="全部" border size="mini" @click.native="allClick"></el-checkbox>
            <el-checkbox v-model="form_info.oneAlarm_4" label="一级" border size="mini">
                <span class="alarm_one_color"><i class="fa fa-exclamation-triangle loncom_mr5"></i>一级</span><em v-if="!Info.his">({{level_info.level_4}})</em>
            </el-checkbox>
            <el-checkbox v-model="form_info.twoAlarm_3"  label="二级" border size="mini">
                <span class="alarm_two_color"><i class="fa fa-exclamation-circle loncom_mr5"></i>二级</span><em v-if="!Info.his">({{level_info.level_3}})</em>
            </el-checkbox>
            <el-checkbox v-model="form_info.threeAlarm_2"  label="三级" border size="mini">
                <span class="alarm_three_color"><i class="fa fa-exclamation-circle loncom_mr5"></i>三级</span><em v-if="!Info.his">({{level_info.level_2}})</em>
            </el-checkbox>
            <el-checkbox v-model="form_info.fourAlarm_1"  label="四级" border size="mini">
                <span class="alarm_four_color"><i class="fa fa-exclamation-circle loncom_mr5"></i>四级</span><em v-if="!Info.his">({{level_info.level_1}})</em>
            </el-checkbox>
        </div>
        <div class="loncom_fr" v-if="Info.his&&Info._export">
            <el-button type="primary" size="mini" @click="_export"><i class="fa fa-upload loncom_mr5"></i>导出</el-button>
        </div>
        <div class="loncom_fr" v-if="!Info.his&&!Info.real">
            <i class="el-icon-circle-close" style="font-size:20px;color:#0096ba;cursor:pointer;" @click="closeAlarm"></i>
        </div>
        <AlarmExp v-bind:dialogInfo="alarm_export" v-if="alarm_export.visible"></AlarmExp>
    </div>
</template>
<style>
    .alarm_top .sort{margin-left: 30px;}
    .alarm_top .sort span.title{
        margin: 0 5px;
    }
    .alarm_top .sort label{background:#fff;}
</style>

<script>
import AlarmExp from '@/components/alarm_export.vue';
export default {
    created () {
       if(this.$route.query.pid){
          this.pid = this.$route.query.pid;
        }
       
        //告警条数
        this.getTop();
        
    },
    mounted() {
        
    },
    data() {
       return {
            pid:"",//参数
            form_info:{
                allAlarm:true,
                oneAlarm_4:false,
                twoAlarm_3:false,
                threeAlarm_2:false,
                fourAlarm_1:false,
            },
            level_info:{
                level_1:0,
                level_2:0,
                level_3:0,
                level_4:0,
            },
            level:[],  //存储筛选的
          alarm_export:{
            visible:false,
            level:'',
            alarmtimebegin:'',
            alarmtimeend:'',

          }
       }
   },
    methods:{
        getTop:function(){
           if (this && this._isDestroyed) {return}
            if(this.Info.id){
              var _this = this;
                this.$api.post('/Alarmstrategy/getAlarm', {addrid:this.Info.id,pid:this.pid}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.level_info=r.data;
                        
                         
                        setTimeout(() => {
                            if (_this && !_this._isDestroyed)
                                _this.getTop();
                        }, 2000);
                    
                        
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            }else{ //告警
                if(this.Info.ws){ //实时告警
                    this.$api.post('/Alarmstrategy/getAlarm', {pid:this.pid}, r => {
                        if(r.err_code=="0"){
                            this.level_info=r.data;
                           
                          
                        setTimeout(() => {
                            if (_this && !_this._isDestroyed)
                                _this.getTop();
                        }, 2000);
                     
                        }else{
                            this.$message.warning(r.err_msg);
                        }
                    });
                    var _this=this;
                    var loginInfo={};
                    if(sessionStorage.loginInfo){
                        loginInfo=JSON.parse(sessionStorage.loginInfo);
                    }
                    // wsConnection({cmd:"alarmlevel",data:[loginInfo.roleid]},function(r){
                    //     var data=JSON.parse(r.data);
                    //     if(data[0].cmd=="alarmlevel"){
                    //         for(var item in _this.level_info){
                    //             _this.level_info[item]=data[0].data[0][item];
                    //         }
                    //     }
                    // })
                }
            }
        },
       closeAlarm:function(){
           $(this.$parent.$refs.gis_alarm_list).css({"bottom":"-400px"});
           this.Info.visible=false;
       },
       allClick:function(){
           for(var item in this.form_info){
               if(item=="allAlarm"){
                   this.form_info[item]=true;
               }else{
                   this.form_info[item]=false;
               }
           }
       },
        search:function(){
            this.level=[];
            for(var item in this.form_info){
                if(item!="allAlarm"&&this.form_info[item]){
                    this.level.push(item.split('_')[1]);
                }
            }
            this.$emit('getAlarm',this.level.toString());  //如果有参数带出
        },
        //导出
        _export:function(){
          this.alarm_export.visible = true;
          this.alarm_export.level = this.level.length>0?this.level.toString():"";
            //var level=this.level.length>0?this.level.toString():"";
        //     let downloadElement = document.createElement('a')
        //     let href=window.document.location.origin+rootUrl+ "/export/hisalarm?level="+level;
        //     downloadElement.href = href
        //     document.body.appendChild(downloadElement)
        //     downloadElement.click()
        //     document.body.removeChild(downloadElement) // 下载完成移除元素
        //     window.URL.revokeObjectURL(href) // 释放掉blob对象
         },
    },
    watch:{
        form_info:{
          handler:function(val,oldval){
              this.search();
              var flag=false;
              for(var item in val){
                  if(item!="allAlarm"&&val[item]){
                      flag=true;
                  }
              }
              if(flag){
                  this.form_info.allAlarm=false;
              }else{
                  this.form_info.allAlarm=true;
              }
              if(!this.Info.ws){ //实时告警推送
                  this.getTop();
              }
          },
          deep: true
        },
    },
    props:["Info"],
    components:{AlarmExp}
}
</script>