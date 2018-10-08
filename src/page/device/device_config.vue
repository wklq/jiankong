<template>
    <div class="loncom_content">
       <div class="loncom_public_top">
            <div class="loncom_fl">阀值配置</div>
        </div>
        <div class="loncom_public_con">
            <div class="loncom_tree">
                <div class="loncom_tree_title">
                    设备
                </div>
                <div class="loncom_tree_con numScroll0">
                    <div class="numScrollCon0">
                        <el-tree
                        ref="tree"
                        v-loading='treeLoading'
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
                        <el-tab-pane label="测点信息" name="first">
                            <div class="loncom_tabbox numScroll1">
                                <div class="loncom_tabbox_con numScrollCon1">
                                    <el-search-table-pagination  type="local"
                                        url=""
                                        list-field="list" 
                                        total-field="total"
                                        method='post' 
                                        :formOptions="table_forms"
                                        border :data="table_data" :columns="table_columns" ref="thisRef">   
                                        <el-table-column slot="prepend" type="selection"></el-table-column>       
                                        <template slot-scope="scope" slot="preview-alarm">
                                            <div v-if="scope.row.alarm=='0'||scope.row.alarm==0">
                                                <span style="color:#0f0">正常</span>
                                            </div>
                                            <div v-else><span style="color:#f00">告警</span></div>
                                        </template>
                                        <template slot-scope="scope" slot="preview-handle">
                                            <div>
                                                <a href="javascript:;" class="loncom_color" @click="set(scope.row)">设置阀值</a> 
                                                <em>|</em>
                                                <a href="javascript:;" class="loncom_color" @click="reportShow(scope.row)">报表</a> 
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
    </div>
</template>
<style>

</style>

<script>
import Config from '@/components/device_config.vue'
import Report from '@/components/device_report.vue'
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
                { prop: 'ch', label: '测点名称',minWidth:10},
                { prop: 'maxalarm2', label: '上限告警值',minWidth:10},
                { prop: 'minalarm2', label: '下限告警值',minWidth:10},
                { prop: 'value', label: '实时值',minWidth:10},
                { prop: 'alarm', label: '是否告警',minWidth:10,slotName:'preview-alarm'},
                { prop: 'marktime', label: '采集时间',minWidth:10},
                { prop: 'handle', label: '操作',slotName:'preview-handle',width:120},
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
            
       }
   },
    methods:{
        getTree:function(){
                this.$api.get('/addr/ScAddrDevTree', {isHavePoint:false}, r => {
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
            if(node.data.map.type!="8"){ //设备
                return;
            }
            this.nodeId=node.data.id;
            this.getList();
        },
        set:function(row){
            console.log(row)
            this.config.pid=row.id;
            this.config.mgrobjid=row.mgrobjid;
            this.config.visible=true;
            this.config.maxalarm=row.maxalarm;
            this.config.maxalarm2=row.maxalarm2;
            this.config.minalarm=row.minalarm;
            this.config.minalarm2=row.minalarm2;
        },
        getList:function(){
            this.$api.get('/devvou/query', {model:{datachar:"Analogy",mgrobjid:this.nodeId}}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.table_data=r.data;
                    for(var i=0;i<r.data.length;i++){
                        this.wskey.push(r.data[i].key)
                    }
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
        reportShow:function(row){
            this.report.pid=row.id;
            this.report.mgrobjid=row.mgrobjid;
            this.report.visible=true;
            this.report.devname=row.devname;
            this.report.ch=row.ch;
        },

    },
    watch: {
      
    },
    components:{Config,Report}
}
</script>