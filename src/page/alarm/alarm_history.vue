<template>
    <div class="loncom_content">
       <alarmTop v-bind:Info="Info" v-on:getAlarm="getAlarm"></alarmTop>
       <div class="loncom_public_con loncom_scroll_con">
            <el-search-table-pagination 
                :url="url+'/Alarmstrategy/hisalarm'"
                list-field="data.items"
                total-field="data.count"
                method='post'
                :params="table_forms.initParams"
                :formOptions="table_forms"
                border :data="table_data" :columns="table_columns" ref="thisRef">
               <!--  <el-table-column slot="prepend" type="selection"></el-table-column> -->
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
                    <div>
                        <a href="javascript:;" class="loncom_color" v-if="$store.state.alarm_history.remove" @click="remove(scope.row)">删除</a> 
                        <em>|</em>
                        <a href="javascript:;" class="loncom_color" v-if="$store.state.alarm_history.alarm" @click="sure(scope.row)">确认</a> 
                    </div>
                </template>
            </el-search-table-pagination>
       </div>
       <alarmsureInfo :dialogInfo="sure_info" v-if="sure_info.visible"></alarmsureInfo>
    </div>
</template>
<style>

</style>

<script>
import alarmTop from '@/components/alarm_top.vue'
import alarmsureInfo from '@/components/alarm_sureinfo.vue'
export default {
    created () {
        this.url=rootUrl;
        this.Info._export=this.$store.state.alarm_history.export;
        //this.getAlarm();
    },
    mounted() {
        scrollCon();
    },
    data() {
       return {
           url:'',
           Info:{
               title:'历史告警',
               his:true,
               _export:'',
           },
           table_data:[],
           table_forms: {
            inline: true,
            size:'small',
            initParams:{alarmlevel:""},
            forms: []
            },
           table_columns:[
              { prop: 'level', label: '告警等级',minWidth:10,slotName:'preview-level'},
              { prop: 'eventname', label: '事件名称',minWidth:10},
              { prop: 'content1', label: '事件定位',minWidth:30},
              { prop: 'alarmtime', label: '告警时间',minWidth:15,slotName:'preview-alarmtime'},
              { prop: 'cfmoper', label: '确认人',minWidth:10},
              { prop: 'cfmtime', label: '确认时间',minWidth:15,slotName:'preview-cfmtime'},
              { prop: 'removetime', label: '解除时间',minWidth:15},
              { prop: 'cfm', label: '确认内容',minWidth:15},
              { prop: 'handle', label: '操作',width:100,slotName:'preview-handle'},
          ],
          sure_info:{
              visible:false,
              data:{},
              cfm:'',
          }
       }
   },
    methods:{
        //删除
        remove:function(row){
            console.log(row)
            this.$confirm("确定删除?", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning',
            }).then(() => {
                this.$api.post('/alarm/delete', {orderno:row.orderno}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.$message.success(r.err_msg);
                    this.$refs['thisRef'].searchHandler(false);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            });
            
        },
       getAlarm:function(info){
           this.table_forms.initParams.alarmlevel=info?info:"";
        //    var level=info?info:"";
        //    this.$api.post('/Alarmstrategy/hisalarm', {level:level}, r => {
        //         console.log(r)
        //         if(r.err_code=="0"){
        //             this.table_data=r.data;
        //         }else{
        //             this.$message.warning(r.err_msg);
        //         }
        //     });
       },
       sure:function(row){
           this.sure_info.visible=true;
           this.sure_info.data=row;
           this.sure_info.cfm="";
            // this.$confirm("确定确认告警?", '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type:'warning',
            //     }).then(() => {
            //         var ids=row.mgrobjid+"%"+row.id+"%"+row.eventbm;
            //         this.$api.post('/Alarmstrategy/hisalarmconfirm', {ids:ids,cfm:""}, r => {
            //         console.log(r)
            //         if(r.err_code=="0"){
            //             //this.getAlarm();
            //             this.$message.success(r.err_msg);
            //         }else{
            //             this.$message.warning(r.err_msg);
            //         }
            //     });
            // });
       },
    },
    watch:{
        "table_forms.initParams.alarmlevel":function(){
            this.$refs['thisRef'].searchHandler(false);
        },
        "sure_info.cfm":function(val){
            if(val!=""){
                this.$api.post('/Alarmstrategy/hisalarmconfirm', {ids:this.sure_info.data.orderno,cfm:this.sure_info.cfm}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        //this.getAlarm();
                        this.sure_info.visible=false;
                        this.$refs['thisRef'].searchHandler(false);
                        this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            }
        },
    },
    components:{alarmTop,alarmsureInfo}
}
</script>
