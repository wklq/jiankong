<template>
    <div class="loncom_content">
       <div class="loncom_public_top">
            <div class="loncom_fl">设备配置</div>
            <div class="loncom_sysinfo_box">
                    提示：操作设备配置后，需要同步设备后，才能生效！
                    </div>
             <div class="loncom_fr">
                <el-button type="primary" size="mini" @click="tongbu" v-loading.fullscreen.lock="fullscreenLoading"><i class="el-icon-sort loncom_mr5"></i>同步设备</el-button>
                <el-button type="primary" size="mini" @click="add" ><i class="fa fa-plus-circle loncom_mr5"></i>新增</el-button>
               <!--  <el-button type="primary" size="mini" @click="remove" ><i class="fa fa-minus-circle loncom_mr5"></i>删除</el-button> -->
            </div>
        </div>
        <div class="loncom_public_con">
            <div class="loncom_tree">
                <div class="loncom_tree_title">
                    地点
                </div>
                <div class="loncom_tree_con numScroll0">
                    <div class="numScrollCon0">
                        <el-tree
                        ref="tree"
                        v-loading ='treeLoading'
                        :props="defaultProps"
                        :data="tree_data"
                        node-key="id"
                        default-expand-all
                        @node-click="nodeClick"
                        >
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="loncom_table">
                <div class="loncom_tab">
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="设备信息" name="first">
                            <div class="loncom_tabbox numScroll1">
                                <div class="loncom_tabbox_con numScrollCon1">
                                    <el-search-table-pagination  type="local"
                                        url=""
                                        list-field="list" 
                                        total-field="total"
                                        method='post' 
                                        :formOptions="table_forms"
                                        border :data="table_data" :columns="table_columns" ref="thisRef">   
                                        <el-table-column slot="prepend" type="selection"></el-table-column> <template slot-scope="scope" slot="preview-state">
                                            <div v-if="scope.row.state==='0'">
                                                <span >停用</span>
                                            </div>
                                            <div v-else><span >启用</span></div>
                                        </template>      
                                        <template slot-scope="scope" slot="preview-alarmcount">
                                            <div v-if="scope.row.alarmcount==='0'">
                                                <span style="color:#0f0">正常</span>
                                            </div>
                                            <div v-else><span style="color:#f00">告警</span></div>
                                        </template>
                                         <template slot-scope="scope" slot="preview-addrid">
                                           <div  v-if="scope.row.addrid">
                                               <span>{{addrName}}</span>
                                           </div>
                                        </template>
                                        <template slot-scope="scope" slot="preview-handle">
                                            <div>
                                                 <a href="javascript:;" class="loncom_color" @click="update(scope.row)">编辑</a> 
                                                  <em>|</em>
                                                <a v-if="scope.row.state==='1'" href="javascript:;" class="loncom_color" @click="devControl(scope.row)">停用</a> 
                                                <a v-else href="javascript:;" class="loncom_color" @click="devControl(scope.row)">启用</a> 
                                                <em>|</em>
                                                <a href="javascript:;" class="loncom_color" @click="delDev(scope.row)">删除</a> 
                                            </div>
                                        </template>
                                    </el-search-table-pagination>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <Config v-bind:dialogInfo="config" v-if="config.visible"></Config>
        <Report v-bind:dialogInfo="report" v-if="report.visible"></Report>
        <Add v-bind:dialogInfo='addInfo' v-if='addInfo.visible'></Add>
    </div>
</template>
<style>
.loncom_content .loncom_sysinfo_box{
    float:left;
    height: 26px;
    line-height: 26px;
    text-indent: 15px;
    color: #8E7D5D;
    font-size: 12px;
    margin-left:60px;
    background: #F9F6E4;
}
</style>

<script>
import Config from '@/components/device_config.vue'
import Report from '@/components/device_report.vue'
import Add from '@/components/record_device_add.vue'
export default {
    created () {
        this.getTree()
    },
    mounted() {
        numScroll(0);
        numScroll(1);
        // wsConnection({cmd:"getdata",data:this.wskey},function(r){
        //     var data=JSON.parse(r.data);
        //     console.log(data)
           
        // })
    },
    data() {
       return {
        treeLoading:true,
            fullscreenLoading:false,  //全屏loading
            addrName:'',
            tree_data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            nodeId:'',  //点击的树形id
            activeName: 'first',
            table_data:[],
            table_forms: {
                inline: true,
                size:'small',
                initParams:{queryKey:""},
                forms: []
            },
            table_columns:[
                { prop: 'devname', label: '设备名称',minWidth:10},
                { prop: 'state', label: '是否启用',minWidth:10,slotName:'preview-state'},
                { prop: 'alarmcount', label: '是否告警',minWidth:10,slotName:'preview-alarmcount'},
                { prop: 'comsetting', label: '通讯参数',minWidth:10},
                { prop: 'addrid', label: '所属地点',minWidth:10,slotName:'preview-addrid'},
                // { prop: 'value', label: '实时值',minWidth:10},
                // { prop: 'alarm', label: '是否告警',minWidth:10,slotName:'preview-alarm'},
                // { prop: 'marktime', label: '采集时间',minWidth:20},
                 { prop: 'handle', label: '操作',slotName:'preview-handle',width:150},
            ],
            config:{
                visible:false,
                pid:'',
                mgrobjid:'',
                maxalarm:'',
                maxalarm2:'',
                minalarm:'',
                minalarm2:'',
            },
            wskey:[],
            report:{
                visible:false,
                pid:'',
                mgrobjid:'',
                devname:'',
                ch:''
            },
            addInfo:{
                title:'新增设备',
                id:'',
                successState:false,
                visible:false,
                width:"600px",
                data:{}
            },
       }
   },
    methods:{
         add:function(){
           this.addInfo.visible=true;
           this.addInfo.title = '新增设备';
           this.addInfo.id="";
            this.addInfo.successState = false;
           this.addInfo.data = {};
       },
       // remove:function(row){
       //     console.log(row)
       //     var ids=[];
       //      if(row!=undefined&&row.id!=undefined){ //单条删除
       //         ids.push(row.id);
       //     }else{  //多条删除
       //          if(this.multipleSelection.length>0){
       //              ids=this.multipleSelection;
       //          }else{
       //              this.$message.warning("请勾选需要删除的项");
       //              return;
       //          }
       //     }
       //     this.$confirm("确定删除?", '提示', {
       //          confirmButtonText: '确定',
       //          cancelButtonText: '取消',
       //          type:'warning',
       //      }).then(() => {
       //          this.$api.post('/fingerling/delete', {id:ids.toString()}, r => {
       //              if(r.err_code=="0"){
       //                  this.getList();
       //                  this.$message.success(r.err_msg);
       //              }else{
       //                  this.$message.warning(r.err_msg);
       //              }
       //          });
       //      });
           
       // },
        getTree:function(){
               this.$api.post('/addr/tree', {}, r => {
                    console.log(r)
                    this.treeLoading = false;
                    if(r.err_code=="0"){
                        this.tree_data=r.data;
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
        },
        nodeClick:function(data,node){
            console.log(node)
            if(node.data.map.type!="3"){ //设备
                   this.table_data =[];
                return;
            }
           
            this.addrName = node.data.label;
            this.nodeId=node.data.id;
            this.getList();
        },
        update:function(row){
            this.addInfo.visible = true;
            this.addInfo.title = "编辑设备信息";
            this.addInfo.data = row;
            this.addInfo.data.addr = this.addrName;
            this.addInfo.successState = false;
            //this.addInfo.
        },
        devControl:function(row){
            var state = row.state==1?0:1;
            var stateStr = state==1?"确定启用设备?":"确定停用设备?"; 
             this.$confirm(stateStr, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning',
            }).then(() => {
                this.$api.post('/Dev/updatestart', {mgrobjid:row.mgrobjid,name:row.devname,state:state}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        if(r.data === 'true'){
                        this.$message.success(r.err_msg);
                   // this.$refs['thisRef'].searchHandler(false);
                        this.getList();
                    }
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            });
        },
        getList:function(){
             this.$api.get('/Dev/addrquery', {addr:this.nodeId}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.table_data=r.data;
                    // for(var i=0;i<r.data.length;i++){
                    //     this.wskey.push(r.data[i].key)
                    // }
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
        delDev:function(row){
           if(row.state ==1){
              this.$message.warning('停用设备后才能删除设备！');
              return;
           }
            this.$confirm("确定删除?", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning',
            }).then(() => {
                this.$api.post('/Dev/delete', {mgrobjid:row.mgrobjid}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        if(r.data === 'true'){
                        this.$message.success(r.err_msg);
                   // this.$refs['thisRef'].searchHandler(false);
                        this.getList();
                    }
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            });
            
        },
        //同步设备
        tongbu:function(){
            this.fullscreenLoading = true;
            this.$api.post('/Dev/syncdev', {agentbm:'3'}, r => {
                this.fullscreenLoading=false;
               if(r.err_code == "0" ){
                 this.$message.success(r.data);
                this.$api.post('/Dev/ReStart',{agentbm:3},r=>{

                })
                   
               }else{
                 this.$message.warning(r.data);
               }
                  
                    
               
            });
        },

    },
    watch: {
      'addInfo.successState':function(value,old){

            if(value ==true){
                this.getList();
            }
        },

    },
    components:{Config,Report,Add}
}
</script>
