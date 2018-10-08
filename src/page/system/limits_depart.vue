<template>
    <div class="loncom_content limits_depart">
        <div class="loncom_public_top">
            <div class="loncom_fl">部门管理</div>
        </div>
       <div class="loncom_public_con">
            <div class="loncom_tree">
                <div class="loncom_tree_title">
                    部门
                </div>
                <div class="loncom_tree_con numScroll0">
                    <div class="numScrollCon0">
                        <el-button type="primary" size="small" style="width: 100%;margin-bottom:10px;" @click="addDepart" v-if="$store.state.limits_depart.add">添加部门</el-button>
                        <el-tree
                        ref="tree"
                        v-loading = 'treeLoading'
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
                <div class="depart_box1">
                    <div class="depart_box1_title">
                        <span class="loncom_fl">部门信息</span>
                        <div class="loncom_fr">
                            <el-button type="primary" size="small" @click="saveDepart('formInfo')" v-if="$store.state.limits_depart.add||$store.state.limits_depart.edit">保存</el-button>
                            <el-button type="primary" size="small" @click="deleteDepart" v-if="$store.state.limits_depart.remove">删除</el-button>
                        </div>
                    </div>
                    <div class="depart_box1_con">
                        <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="80px">
                            <el-row :gutter="60">
                                <el-col :span="12">
                                    <el-form-item prop="name" label="名称" size="small">
                                        <el-input v-model="form_info.name"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="parentname" label="上级部门" size="small">
                                        <el-input v-model="form_info.parentname" readonly @focus="getDepart"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="remarks" label="备注" size="small">
                                        <el-input v-model="form_info.remarks"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </div>
                <div class="depart_box">
                    <div class="search_sort">
                        <ABC v-on:getUser="getList"></ABC>
                        <span class="btn"><el-button type="primary" size="mini" @click="addUser" v-if="$store.state.limits_depart.add">添加用户</el-button></span>
                    </div>
                    <div class="search_table numScroll1">
                        <el-search-table-pagination  type="local" class="numScrollCon1"
                            url=""
                            list-field="list" 
                            total-field="total"
                            method='post' 
                            :formOptions="table_forms"
                            border :data="table_data" :columns="table_columns" ref="thisRef">
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
                                    <a href="javascript:;" class="loncom_color" @click="edit (scope.row)" v-if="$store.state.limits_depart.edit">编辑</a> 
                                    <em v-if="$store.state.limits_depart.edit&&$store.state.limits_depart.remove">|</em>
                                    <a href="javascript:;" class="loncom_color" @click="remove (scope.row)" v-if="$store.state.limits_depart.remove">删除</a>  
                                </div>
                            </template>
                        </el-search-table-pagination>
                    </div>
                </div>
            </div>
       </div>
       <DepartGet v-bind:dialogInfo="getInfo" v-if="getInfo.visible"></DepartGet>
       <Add v-bind:dialogInfo="addInfo" v-if="addInfo.visible"></Add>
    </div>
</template>

<style>
    .limits_depart .loncom_table{border:1px solid #e0e0e0;border-left:none;}
    .limits_depart .depart_box1{width:100%;height:auto;border-bottom:1px solid #e0e0e0;}
    .limits_depart .depart_box1_title{width:100%;height:40px;line-height:40px;padding:0 20px;}
    .limits_depart .depart_box1_con{padding:15px 20px 5px 20px;}
    .limits_depart .depart_box{padding:15px 20px 0 20px;height:calc(100% - 180px)}
    .limits_depart .search_table{height: calc(100% - 40px)}
</style>
<script>
import DepartGet from '@/components/limits_depart_get.vue'
import Add from '@/components/limits_user_add.vue'
import ABC from '@/components/limits_user_abc.vue'
export default {
    created () {
        this.getTree();  
        this.getList();  //用户列表
    },
    mounted() {
        numScroll(0);
        numScroll(1);
    },
    data() {
       return {
            treeLoading:true,
            tree_data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            //部门信息
            form_info:{
                id:'',
                name:'',
                parentid:'',
                parentname:'',
                remarks:'',
            },
            formRules:{
                name:[
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
            },
            
            table_data:[],
            table_forms: {
                inline: true,
                size:'small',
                initParams:{queryKey:""},
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
            //获取上级部门信息
            getInfo:{
                title:"获取上级部门信息",
                visible:false,
                id:'',
                data:{},
            },
            addInfo:{
                title:"新增用户",
                visible:false,
                id:'',
            },

       }
   },
    methods:{
        //获取部门树形
        getTree:function(){
            if(this.$store.state.limits_depart.query){
                this.$api.post('/organizationgroup/tree', {}, r => {
                    console.log(r)
                    this.treeLoading = false;
                    if(r.err_code=="0"){
                        this.tree_data=r.data;
                    }
                }); 
            }
            
        },
       //点击树形节点
        nodeClick:function(data,node){
            this.form_info.id=node.data.id;
            this.form_info.parentid=node.parent.data.id;
            this.form_info.name=node.data.label;
            this.form_info.parentname=node.parent.data.label;
            this.form_info.remarks=node.data.map.remarks;
            this.getList();
        },
        //清空
        clearInfo:function(){
            this.$refs['formInfo'].resetFields();
            this.form_info.id="";
            this.form_info.parentid="";
            console.log(this.form_info)
        },
        //添加部门
        addDepart:function(){
            this.clearInfo();
        },
        //保存操作
        saveDepart:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    console.log(this.form_info)
                    if(this.form_info.id==""){ //新增
                        this.form_info.parentid==""?this.form_info.parentid="0":this.form_info.parentid;
                        this.$api.post('/organizationgroup/add', {model:{obj:this.form_info}}, r => {
                            console.log(r)
                            if(r.err_code=="0"){
                                this.getTree();
                                this.clearInfo();
                                this.$message.success(r.err_msg);
                            }else{
                                this.$message.warning(r.err_msg);
                            }
                        }); 
                    }else{ //修改
                        this.$api.post('/organizationgroup/update', {model:{obj:this.form_info}}, r => {
                            console.log(r)
                            if(r.err_code=="0"){
                                this.getTree();
                                this.$message.success(r.err_msg);
                            }else{
                                this.$message.warning(r.err_msg);
                            }
                        }); 
                    }

                }
            })
        },
        //删除部门
        deleteDepart:function(){
            if(this.form_info.id!=""){
                this.$confirm("确定删除?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning',
                }).then(() => {
                    this.$api.post('/organizationgroup/delete', {id:this.form_info.id}, r => {
                        console.log(r)
                        if(r.err_code=="0"){
                            this.getTree();
                            this.clearInfo();
                            this.$message.success(r.err_msg);
                        }else{
                            this.$message.warning(r.err_msg);
                        }
                    }); 
                });
            }
            
        },
        //获取上级部门
        getDepart:function(){
            console.log(this.form_info)
            this.getInfo.visible=true;
            if(this.add_depart){
                this.getInfo.id='';
            }else{
                this.getInfo.id=this.form_info.parentid;
            }
        },
        //添加用户
        addUser:function(){
            this.addInfo.visible=true;
            //this.$router.push({path:'/system/limits/depart/adduser'});
        },
        //获取用户
        getList:function(search){
            if(this.$store.state.limits_depart.query){
                var orid=this.form_info.id;
                var letter=search?search:"";
                this.$api.post('/User/query', {model:{obj:{orid:orid,letter:letter}}}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                    this.table_data=r.data;
                    }
                });
            }
            
        },
        //删除用户
        remove:function(row){
           this.$confirm("确定删除?", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning',
            }).then(() => {
                this.$api.post('/User/delete', {id:row.id}, r => {
                    if(r.err_code=="0"){
                        this.getList();
                        this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            });
       },
       //编辑用户
       edit:function(row){
           this.addInfo.id=row.id;
           this.addInfo.title="编辑用户信息";
           this.addInfo.visible=true;
       },


    },
    watch:{
        tree_data:function(){
            if(!this.add_depart&&this.t_id==""){  //初始化用
                
            }
        },
        "getInfo.data":{
          handler:function(val,oldval){
              this.form_info.parentid=val.id;
              this.form_info.parentname=val.label;
          },
          deep: true
        }

    },
    components:{DepartGet,Add,ABC}
}
</script>