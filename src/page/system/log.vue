<template>
    <div class="loncom_content log">
        <div class="loncom_public_top">
            <div class="loncom_fl">操作日志</div>
        </div>
        <div class="loncom_public_con loncom_scroll_con">
            <!--
            <div style="background:#fff;padding:10px;">
                时间段 <el-date-picker
                    v-model="info.time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="small">
                    </el-date-picker>
                账户 <el-input v-model="info.userid" size="small" style="width:200px;"></el-input>
                <el-button type="primary" size="small" @click="search">搜索</el-button>
                </div>
                -->
            <el-search-table-pagination 
                
                :url="url+'/syslog/query'"
                list-field="data.items" 
                total-field="data.count"
                method='post'

                :formOptions="table_forms"
                border :columns="table_columns" ref="thisRef">   
                <el-table-column slot="prepend" type="selection"></el-table-column>   
                <el-table-column slot="prepend" type="index" label="序号" width="50px;"></el-table-column>   
            </el-search-table-pagination>
        </div>
    </div>
</template>
<style>
    .log .el-form{padding-left:10px;}
</style>

<script>
export default {
    created () {
        this.url=rootUrl;
        //this.getList();
    },
    mounted() {
        scrollCon();
    },
    data() {
       return {
            url:'',
            info:{
                time:'',
                userid:''
            },
            loading:true,
            form_info:{
                begintime:'',
                endtime:'',
                userid:'',
            },
          　table_data:[
                // {ip:'192.168.16.6',userid:'admin',createtime:'2018-10-11 12:22:12',details:'删除账号'},
            ],
            table_forms: {
                inline: true,
                size:'small',
                forms: [
                    { prop: 'begintime-endtime', label: '时间段',placeholder:'时间',itemType: 'datetimerange' },
                    { prop: 'userid', label: '账户' ,placeholder:'账户'},
                ]
            },
            table_columns:[
              { prop: 'ip', label: '登录IP',minWidth:10},
              { prop: 'userid', label: '登录账号',minWidth:10},
              { prop: 'createtime', label: '操作时间',minWidth:20},
              { prop: 'details', label: '操作内容',minWidth:30},
            ],
       }
   },
    methods:{
       getList:function(){
           if(this.$store.state.system_log.query){
               this.$api.post('/syslog/query', this.form_info, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.table_data=r.data;
                        this.loading=false;
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                }); 
           }
       },
       search:function(){
           this.loading=true;
           if(this.info.time!=null&&this.info.time!=""){
               this.form_info.begintime=new Date(this.info.time[0]).Format('yyyy-MM-dd hh:mm:ss');
               this.form_info.endtime=new Date(this.info.time[1]).Format('yyyy-MM-dd hh:mm:ss');
           }else{
               this.form_info.begintime="";
               this.form_info.endtime="";
           }
           this.form_info.userid=this.info.userid;
           this.getList();
       },
    },
    watch:{
        // info:{
        //   handler:function(val,oldval){
        //       if(val.userid==""&&(val.time==null||val.time=="")){
        //           this.form_info.begintime='';
        //           this.form_info.endtime="";
        //           this.form_info.userid="";
        //           this.loading=true;
        //           this.getList();
        //       }
        //   },
        //   deep: true
        // }
    },
    components:{}
}
</script>