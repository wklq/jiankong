<template>
    <div class="loncom_content limits_user">
       <div class="loncom_public_top">
            <div class="loncom_fl">用户管理</div>
            <div class="loncom_fr">
                <el-button type="primary" size="mini" @click="adduser" v-if="$store.state.limits_user.add"><i class="fa fa-plus-circle loncom_mr5"></i>新建</el-button>
                <el-button type="primary" size="mini" @click="remove" v-if="$store.state.limits_user.remove"><i class="fa fa-minus-circle loncom_mr5"></i>删除</el-button>
            </div>
        </div>
        <div class="loncom_public_con">
            <div class="search_sort">
                <ABC v-on:getUser="getList"></ABC>
            </div>
            <div class="search_table numScroll1">
                <el-search-table-pagination  type="local" class="numScrollCon1"
                    url=""
                    list-field="list" 
                    total-field="total"
                    method='post' 
                    :formOptions="table_forms"
                    @selection-change="handleSelectionChange" 
                    border :data="table_data" :columns="table_columns" ref="thisRef">   
                    <el-table-column slot="prepend" type="selection"></el-table-column>   
                    <template slot-scope="scope" slot="preview-state">
                        <div v-if="scope.row.state=='1'">
                            启用
                        </div>
                        <div v-if="scope.row.state=='0'">
                            禁用
                        </div>
                    </template>
                    <template slot-scope="scope" slot="preview-handle">
                        <div>
                            <a href="javascript:;" class="loncom_color" @click="edit (scope.row)" v-if="$store.state.limits_user.edit">编辑</a> 
                            <em v-if="$store.state.limits_user.edit&&$store.state.limits_user.remove&&scope.row.id!='1'">|</em>
                            <a href="javascript:;" class="loncom_color" @click="remove (scope.row)" v-if="$store.state.limits_user.remove&&scope.row.id!='1'">删除</a>  
                        </div>
                    </template>
                </el-search-table-pagination>
            </div>
        </div>
        <Add v-bind:dialogInfo="addInfo" v-if="addInfo.visible"></Add>
    </div>
</template>
<style>
    .limits_user .search_table{height: calc(100% - 40px)}
</style>

<script>
import Add from '@/components/limits_user_add.vue'
import ABC from '@/components/limits_user_abc.vue'
export default {
    created () {
        this.getList();
    },
    mounted() {
        numScroll(1);
    },
    data() {
       return {
          　table_data:[],
            table_forms: {
                inline: true,
                size:'small',
                forms: []
            },
            table_columns:[
              { prop: 'name', label: '姓名',minWidth:10},
              { prop: 'userid', label: '账号',minWidth:10},
              { prop: 'state', label: '状态',minWidth:10,slotName:'preview-state'},
              { prop: 'phone', label: '手机',minWidth:20},
              { prop: 'email', label: '邮箱',minWidth:20},
              { prop: 'orname', label: '部门',minWidth:20},
              { prop: 'rolename', label: '角色',minWidth:20},
              { prop: 'handle', label: '操作',slotName:'preview-handle',width:100},
            ],
            addInfo:{
                title:"新增用户",
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
        getList:function(search){
            var letter=search?search:"";
            this.$api.post('/User/query', {model:{obj:{letter:letter}}}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.table_data=r.data; 
                }else{
                    this.$message.warning(r.err_msg);
                }
            }); 
        },
        adduser:function(){
            //this.$router.push({path:'/system/limits/user/adduser'});
            this.addInfo.id="";
            this.addInfo.title="新增用户";
            this.addInfo.visible=true;
        },
       detail:function(row){
           this.$router.push({path:'/system/limits/user/adduser',query:{id:row.id}});
       },
       edit:function(row){
           this.addInfo.id=row.id;
           this.addInfo.title="编辑用户信息";
           this.addInfo.visible=true;
       },
       remove:function(row){
           var ids=[];
            if(row!=undefined&&row.id!=undefined){ //单条删除
               ids.push(row.id);
           }else{  //多条删除
                if(this.multipleSelection.length>0){
                    for(var i=0;i<this.multipleSelection.length;i++){
                        if(this.multipleSelection[i]=='1'){
                            this.$message.warning("管理员admin账号不能删除");
                            return;
                        }
                    }
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
                this.$api.post('/User/delete', {id:ids.toString()}, r => {
                    if(r.err_code=="0"){
                        this.getList();
                        this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            });
       },
    },
    components:{Add,ABC}
}
</script>