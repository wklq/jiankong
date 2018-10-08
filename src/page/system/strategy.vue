<template>
    <div class="loncom_content">
       <div class="loncom_public_top">
            <div class="loncom_fl">策略管理</div>
            <div class="loncom_fr">
                <el-button type="primary" size="mini" @click="add" v-if="$store.state.system_strategy.add"><i class="fa fa-plus-circle loncom_mr5"></i>新建</el-button>
                <el-button type="primary" size="mini" @click="remove" v-if="$store.state.system_strategy.remove"><i class="fa fa-minus-circle loncom_mr5"></i>删除</el-button>
            </div>
        </div>
        <div class="loncom_public_con loncom_scroll_con">
            <div style="background:#fff;padding:10px;">
                <el-input v-model="name" size="small" placeholder="策略名称" style="width:200px;"></el-input>
                <el-button type="primary" size="small" @click="getList">搜索</el-button>
                </div>
            <el-search-table-pagination  type="local"
                url=""
                list-field="list" 
                total-field="total"
                method='post' 
                v-loading="loading"
                :formOptions="table_forms"
                 @selection-change="handleSelectionChange" 
                border :data="table_data" :columns="table_columns" ref="thisRef">   
                <el-table-column slot="prepend" type="selection"></el-table-column>   
                <template slot-scope="scope" slot="preview-valid">
                    <span v-if="scope.row.isvalidate=='1'||scope.row.isvalidate==1">
                        启用
                    </span>
                    <span v-if="scope.row.isvalidate=='0'||scope.row.isvalidate==0">
                        停用
                    </span>
                </template>
                <template slot-scope="scope" slot="preview-handle">
                    <div>
                        <a href="javascript:;" class="loncom_color" @click="edit (scope.row)" v-if="$store.state.system_strategy.edit">编辑</a> 
                        <em v-if="$store.state.system_strategy.edit&&$store.state.system_strategy.remove">|</em>
                        <a href="javascript:;" class="loncom_color" @click="remove (scope.row)" v-if="$store.state.system_strategy.remove">删除</a> 
                    </div>
                </template>
            </el-search-table-pagination>
       </div>
       <Add v-bind:dialogInfo="addInfo" v-if="addInfo.visible"></Add>
    </div>
</template>


<script>
import Add from '@/components/system_strategy_add.vue'
export default {
    created () {
        this.getList()
    },
    mounted() {
        scrollCon();
    },
    data() {
       return {
           loading:true,
           name:'',
          　table_data:[],
            table_forms: {
                inline: true,
                size:'small',
                forms: [
                    // { prop: 'fname', label: '',placeholder:'名称' },
                ]
            },
            table_columns:[
              { prop: 'name', label: '策略名称',minWidth:10},
              { prop: 'inpointname', label: '策略测点',minWidth:10},
              { prop: 'devname', label: '设备名称',minWidth:10},
              { prop: 'outpointname', label: '执行测点',minWidth:10},
              { prop: 'isvalidate', label: '启停用',minWidth:10,slotName:'preview-valid'},
              { prop: 'handle', label: '操作',slotName:'preview-handle',width:100},
            ],
            addInfo:{
                title:"新增策略信息",
                visible:false,
                id:'',
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
        //获取
        getList:function(){
            if(this.$store.state.system_strategy.query){
                this.$api.post('/strategy/query', {model:{obj:{name:this.name}}}, r => {
                    console.log(r)
                    this.loading=false;
                    if(r.err_code=="0"){
                        this.table_data=r.data;
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            }
        },
       add:function(){
           this.addInfo.title="新增策略信息";
           this.addInfo.visible=true;
           this.addInfo.id="";
       },
       remove:function(row){
           console.log(row)
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
                this.$api.post('/strategy/delete', {id:ids.toString()}, r => {
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
           console.log(row)
           this.addInfo.title="编辑策略信息";
           this.addInfo.visible=true;
           this.addInfo.id=row.id;
       },
       
    },
    watch:{
        name:function(val){
            if(val==""){
                this.getList();
            }
        }
    },
    components:{Add}
}
</script>