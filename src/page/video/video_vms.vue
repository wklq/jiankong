<template>
    <div class="loncom_content">
       <div class="loncom_public_top">
            <div class="loncom_fl">视频管理</div>
            <div class="loncom_fr">
                <el-button type="primary" size="mini" @click="add" v-if="$store.state.video_vms.add"><i class="fa fa-plus-circle loncom_mr5"></i>新建</el-button>
                <el-button type="primary" size="mini" @click="remove" v-if="$store.state.video_vms.remove"><i class="fa fa-minus-circle loncom_mr5"></i>删除</el-button>
            </div>
        </div>
        <div class="loncom_public_con loncom_scroll_con">
            <el-search-table-pagination  type="local"
                url=""
                list-field="list" 
                total-field="total"
                method='post' 
                :formOptions="table_forms"
                @selection-change="handleSelectionChange" 
                border :data="table_data" :columns="table_columns" ref="thisRef">   
                <el-table-column slot="prepend" type="selection"></el-table-column>   
                <template slot-scope="scope" slot="preview-type">
                    <div v-for="item in data_type">
                        <span v-if="item.id==scope.row.type">{{item.name}}</span>
                    </div>
                </template>
                <template slot-scope="scope" slot="preview-handle">
                    <div>
                        <a href="javascript:;" class="loncom_color" @click="show (scope.row)" v-if="$store.state.video_vms.details">预览</a> 
                        <em v-if="$store.state.video_vms.details">|</em>
                        <a href="javascript:;" class="loncom_color" @click="edit (scope.row)" v-if="$store.state.video_vms.edit">编辑</a> 
                        <em v-if="$store.state.video_vms.edit">|</em>
                        <a href="javascript:;" class="loncom_color" @click="remove (scope.row)" v-if="$store.state.video_vms.remove">删除</a> 
                    </div>
                </template>
            </el-search-table-pagination>
       </div>
       <Add v-bind:dialogInfo="addInfo" v-if="addInfo.visible"></Add>
       <Show v-bind:dialogInfo="showInfo" v-if="showInfo.visible"></Show>
    </div>
</template>


<script>
import Add from '@/components/video_vms_add.vue'
import Show from '@/components/video_show.vue'
export default {
    created () {
        
         //获取品牌类型
        this.$api.post('/dictionaries/query', {id:'002'}, r => {
            console.log(r)
            if(r.err_code=="0"){
                this.data_type=r.data;
            }else{
                this.$message.warning(r.err_msg);
            }
        });

        this.getList();
    },
    mounted() {
        scrollCon();
        console.log("##########################################")
    },
    data() {
       return {
           data_type:[], //品牌类型
          　table_data:[],
            table_forms: {
                inline: true,
                size:'small',
                initParams:{queryKey:""},
                forms: []
            },
            table_columns:[
              { prop: 'servername', label: '摄像头名称',minWidth:10},
              { prop: 'ip', label: 'ip地址',minWidth:10},
              { prop: 'port', label: '端口',minWidth:10},
              { prop: 'type', label: '品牌类型',minWidth:10,slotName:'preview-type'},
              { prop: 'addrname', label: '所属区域',minWidth:10},
              { prop: 'handle', label: '操作',slotName:'preview-handle',width:130},
            ],
            addInfo:{
                title:"新增视频信息",
                visible:false,
                id:'',
            },
            showInfo:{
                title:"视频预览",
                visible:false,
                row:{},
                data:[],
            },
             //勾选的
            multipleSelection:[],


       }
   },
    methods:{
        //勾选框
        handleSelectionChange:function(val){
            this.multipleSelection=[];
            for(var i=0;i<val.length;i++){
                this.multipleSelection.push(val[i].id);
            }
        },
        getList:function(){
            this.$api.post('/videoserver/query', {}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.table_data=r.data;
                }else{
                    this.$message.warning(r.err_msg);
                }
            }); 
        },
       add:function(){
           this.addInfo.visible=true;
           this.addInfo.id="";
       },
       remove:function(row){
           var ids=[];
            if(row!=undefined&&row.id!=undefined){ //单条删除
               ids.push(row.id);
           }else{  //多条删除
                if(this.multipleSelection.length>0){
                    ids=this.multipleSelection;
                }else{
                    this.$message.warning("请勾选需要删除的项");
                    return;
                }
           }
           this.$confirm("确定删除?", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning',
            }).then(() => {
                this.$api.post('/videoserver/delete', {id:ids.toString()}, r => {
                    if(r.err_code=="0"){
                        this.getList();
                        this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            });
       },
       edit:function(row){
           this.addInfo.visible=true;
           this.addInfo.title="编辑视频信息";
           this.addInfo.id=row.id;
       },
       //预览视频
       show:function(row){
           console.log(row)
           this.showInfo.visible=true;
           this.showInfo.row=row;
       }
       
    },
    components:{Add,Show}
}
</script>