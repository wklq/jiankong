<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="850px" :append-to-body='true'>
        <el-scrollbar style="height:400px;" class="loncom_scrollbar">
        <div class="loncom_dialog_con limits_depart_get">
            <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="80px">
                <el-tree
                    :data="tree_data"
                    node-key="id"
                    v-loading='treeLoading'
                    ref="tree"
                    show-checkbox
                    check-strictly
                    :props="defaultProps"
                    :getCheckedNodes="getCheckedNodes"
                    @check-change="changeTree"
                    :expand-on-click-node="true"
                    default-expand-all
                    >
                </el-tree>
                <el-form-item prop="id">
                    <el-input v-model="form_info.id" size="small" style="display:none;"></el-input>
                </el-form-item>
            </el-form>
        </div>
        </el-scrollbar>
        <dialogBtnInfo v-bind:dialogInfobtn="dialogInfo" v-on:dialogSure="dialogSure('formInfo')"></dialogBtnInfo>
    </el-dialog>
</template>
<style>
    .limits_depart_get .el-form-item__content{height:0}
</style>
<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
export default {
    created () {
       this.getTree();
        this.form_info.id=this.dialogInfo.id;
    },
    mounted() {
        
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if(this.dialogInfo.title === "获取上级部门信息"){
                callback();
            }else{
                 if (value === '') {
                this.$message.warning("请选择一条信息");
                } else {
                callback();
            }
            }
           
        };
        return {
            treeLoading:true,
           form_info:{
               id:'',
               list:[],
           },
           formRules:{
                id:[
                    { validator: validatePass, trigger: 'change' }
                ],
           },
           tree_data: [],
           defaultProps: {
                children: 'children',
                label: 'label'
            },
          
        }
    },
    methods:{
        //获取部门树形
        getTree:function(){
            this.tree_data=[];
            this.$api.post('/organizationgroup/tree', {}, r => {
                console.log(r)
                this.treeLoading = false;
                if(r.err_code=="0"){
                    this.tree_data=r.data;
                    if(this.dialogInfo.id!=undefined&&this.dialogInfo.id!=''){
                        this.setChecked(this.dialogInfo.id);
                    }
                }
            }); 
        },
        //保存的操作
        dialogSure:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    if(this.form_info.list.length>0){
                        this.dialogInfo.data=this.form_info.list[0];
                    }else{
                         this.dialogInfo.data = {id:'',list:[]};
                    }
                    
                    this.dialogInfo.visible=false;
                }
            })
        },
        changeTree:function(data,checked,node){
             if(this.$refs.tree.getCheckedNodes().length%2===0){
                if(checked){
                    this.$refs.tree.setCheckedNodes([]);
                    this.$refs.tree.setCheckedNodes([data]);
                }else{
                    this.$refs.tree.setCheckedNodes([]);
                }        
            }
          this.form_info.list=this.$refs.tree.getCheckedNodes();
        },
        //获取树形勾选的
        // getCheckedNodes:function(){

        // },
        setChecked:function(keys){
            this.$refs.tree.setCheckedKeys([keys]);
            var _this=this;
            setTimeout(function(){
                _this.changeTree();
            },800)
        },
       
    },
    watch:{
        //监听树形数据变化
        'form_info.list':function(val,oldval){
            if(val.length>0){
                if(val.length>1){
                    this.form_info.id='';
                }else{
                    this.form_info.id=val[0].id;
                }
            }else{
                this.form_info.id='';
            }
            
        },
   },
    props:["dialogInfo"],
    components:{dialogBtnInfo}

}
</script>

