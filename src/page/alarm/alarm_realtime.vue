<template>
    <div class="loncom_content">
       <alarmTop v-bind:Info="Info" v-on:getAlarm="getAlarm" ref="runChildFun"></alarmTop>
       <div class="loncom_public_con loncom_scroll_con">
            <el-search-table-pagination  type="local"
                url=""
                list-field="list"
                total-field="total"
                method='post'
                :formOptions="table_forms"
                :show-pagination="false"
                :page-sizes="[10000]"
                border :data="table_data" :columns="table_columns" ref="thisRef">
              <!--   <el-table-column slot="prepend" type="selection"></el-table-column> -->
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
                <template slot-scope="scope" slot="preview-con">
                    <div style="cursor:pointer;" @click="detail(scope.row.addrid)">
                        {{scope.row.content1}}
                    </div>
                </template>
                <template slot-scope="scope" slot="preview-alarmtime">
                    <div v-if="scope.row.alarmtime!=''&&scope.row.alarmtime!=null">
                        {{new Date(scope.row.alarmtime).Format('yyyy-MM-dd hh:mm:ss')}}
                    </div>
                </template>
                <template slot-scope="scope" slot="preview-cfmtime">
                    <div v-if="scope.row.cfmtime!=''&&scope.row.cfmtime!=null">
                        {{new Date(scope.row.cfmtime).Format('yyyy-MM-dd hh:mm:ss')}}
                    </div>
                </template>
                <template slot-scope="scope" slot="preview-handle">

                    <div v-if="scope.row.cfmoper==''">
                        <a href="javascript:;" v-if='$store.state.alarm_realtime.alarm' class="loncom_color" @click="sure(scope.row)">确认</a>
                    </div>
                    <div v-else>
                        <span class="loncom_color999">已确认</span>
                    </div>
                </template>
            </el-search-table-pagination>
         <el-dialog
           title="提示"
           :visible.sync="centerDialogVisible"
           width="30%">
           <div class="loncom_list_boxform" style="margin-top:20px;overflow: hidden">
             <div class="loncom_list_box_left" style="width:20%;text-align:right;margin-right:10px;">
               确认内容
             </div>
             <div class="loncom_list_box_right" style="width:70%">
               <textarea style="height: 100px;" placeholder="请输入内容" v-model="cfm"> </textarea>
             </div>
           </div>
           <div slot="footer" class="dialog-footer">
             <el-button @click="centerDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="dialogSure">确 定</el-button>
           </div>
           <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="sure">确 定</el-button>-->
  <!--</span>-->
         </el-dialog>
       </div>
    </div>
</template>
<style>
  .loncom_list_box_right,.loncom_list_box_left{
  float:left;
}
</style>

<script>
import alarmTop from '@/components/alarm_top.vue'
var axios = require('axios');
export default {
    created () {
       if(this.$route.query.pid){
          this.pid = this.$route.query.pid;
        }
        this.Info._export=this.$store.state.alarm_realtime.export;
      //  this.Info._sure = this.$store.state.alarm_realtime.alarm;
        this.getAlarm();

       
       

    },
    mounted() {
        scrollCon();
        var _this=this;
        var loginInfo={};
        if(sessionStorage.loginInfo){
            loginInfo=JSON.parse(sessionStorage.loginInfo);
        }
        // wsConnection({cmd:"getalarm",data:[loginInfo.roleid]},function(r){
        //     var data=JSON.parse(r.data);
        //     for(var i=0;i<data.length;i++){
        //         if(data[i].cmd=="alarm"){

        //             for(var j=0;j<data[i].data.length;j++){
        //                 if(data[i].data[j].isAlarm){ //表示新增更新
        //                     var has=false;
        //                     for(var n=0;n<_this.table_data.length;n++){
        //                         if(data[i].data[j].key==_this.table_data[n].key){
        //                             has=true;
        //                         }
        //                     }
        //                     if(has){
        //                         _this.table_data.splice(0,0,data[i].data[j]);
        //                     }else{
        //                         _this.table_data.splice(0,1,data[i].data[j]);
        //                     }

        //                 }else{ //表示删除
        //                     for(var k=0;k<_this.table_data.length;k++){
        //                         if(data[i].data[j].key==_this.table_data[k].key){
        //                             _this.table_data.splice(k,1);
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // })
    },
    data() {
       return {
          listCounts:0,
          timeoutState:false,
          pid:'',//参数
           Info:{
               title:'实时告警',
               his:false,
               _export:'',
               real:true,  //实时的不显示关闭按钮和导出按钮
               ws:true,  //需要ws请求
           },
         centerDialogVisible:false,
         now_row:"",
         cfm:'',//告警确认
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
              { prop: 'content1', label: '事件定位',minWidth:30,slotName:'preview-con'},
              { prop: 'alarmtime', label: '告警时间',minWidth:15,slotName:'preview-alarmtime'},
              { prop: 'cfmoper', label: '确认人',minWidth:10},
              { prop: 'cfmtime', label: '确认时间',minWidth:15,slotName:'preview-cfmtime'},
              { prop: 'cfm', label: '确认内容',minWidth:15},
              { prop: 'handle', label: '告警处理',slotName:'preview-handle',width:100},
          ],
       }
   },
    methods:{
       getAlarm:function(info){
           var level=info?info:"";
           var pid = this.pid?this.pid:"";
           this.$api.post('/Alarmstrategy/getALLAlarm', {level:level,pid:pid}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.table_data=r.data;
                   if(this.listCounts == 0){ this.longAlarm();this.listCounts = 1}
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
       },
       //长轮询
       longAlarm:function(){//pid:pid
        if (this && this._isDestroyed) {this.listCounts = 0;return}
          this.listCounts = 1;  
        var pid = this.pid?this.pid:"";
             this.$api.post('/asyn/alarm',{pid:pid,count:this.table_data.length} , r => {
             
                if(r.err_code=="0"){
                  if(Array.isArray(r.data) && r.data.length >0){
                      this.table_data=r.data;
                  }     
                       
                    setTimeout(()=>{
                      this.longAlarm();
                    },2000)
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
  //            axios({
  //   method: 'POST',
  //   url: '/iSmacSite/asyn',
  //   data: {pid:pid},
  //   withCredentials: true
  // })
  // .then(function (res) {
  //   debugger;
  //   if(res.data.err_code=="0"){

  //   }
  // })
// open_ajax('/iSmacSite/asyn',{},function(res){
// debugger;
// },'post')
       },
       sure:function(row){
         this.cfm ="";
           if(this.$store.state.alarm_realtime.alarm){
             this.centerDialogVisible = true;
          this.now_row = row;
               // this.$confirm("确定确认告警?", '提示', {
               //      confirmButtonText: '确定',
               //      cancelButtonText: '取消',
               //      type:'warning',
               //  }).then(() => {
               //      var ids=row.mgrobjid+"%"+row.id+"%"+row.eventbm;
               //      this.$api.post('/Alarmstrategy/alarmconfirm', {ids:ids,cfm:""}, r => {
               //      console.log(r)
               //      if(r.err_code=="0"){
               //          //this.getAlarm();
               //          this.$message.success(r.err_msg);
               //      }else{
               //          this.$message.warning(r.err_msg);
               //      }
               //  });
               //  });

           }else{
               this.$message.warning("您没有权限确认告警");
           }

       },
      dialogSure:function(){
         const _this = this;
        var ids=this.now_row.mgrobjid+"%"+this.now_row.id+"%"+this.now_row.eventbm;
         
             this.$api.post('/Alarmstrategy/alarmconfirm', {ids:ids,cfm:_this.cfm}, r => {
             console.log(r)

             if(r.err_code=="0"){

               this.centerDialogVisible = false;

                 this.getAlarm();
                 this.$message.success(r.err_msg);
             }else{
                 this.$message.warning(r.err_msg);
             }
         });
      },
       detail:function(addrid){
           if(this.$store.state.alarm_realtime.details){
               this.$router.push({path:'/alarm/realtime/detail',query:{addrid:addrid}});
           }
       },
    },
    watch:{
        // table_data:function(){
        //     //this.$refs.runChildFun.getTop()
        // },
    },
    components:{alarmTop}
}
</script>
