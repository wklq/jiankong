<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="600px" :append-to-body='true'>
        <el-scrollbar style="height:400px;" class="loncom_scrollbar">
        <div class="loncom_dialog_con">
            <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="80px">
                <el-tree
                    :data="tree_data"
                    node-key="id"
                    v-loading = 'loading'
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
            if (value === '') {
                this.$message.warning("请选择一条信息");
            } else {
                callback();
            }
        };
        return {
            loading:true,
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
            list:[],

        }
    },
    methods:{
        //获取树形
        getTree:function(){
            this.tree_data=[];
            this.$api.post('/addr/ScAddrDevTree', {isHavePoint:this.dialogInfo.point}, r => {
                
                 this.loading = false;
                if(r.err_code=="0"){

                    this.tree_data=r.data;
                    this.setChecked(this.dialogInfo.id);
                }
            }); 
        },
        //保存的操作
        dialogSure:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    this.dialogInfo.data=this.form_info.list;
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
        getCheckedNodes:function(){

        },
        setChecked:function(keys){
            this.$refs.tree.setCheckedKeys([keys]);
            // var _this=this;
            // setTimeout(function(){
            //     _this.changeTree();
            // },800)
        },
       
    },
    watch:{
        //监听树形数据变化
        'form_info.list':function(val,oldval){
            if(val.length>0){
                if(val.length>1){
                    this.form_info.id='';
                }else{
                    console.log(val[0].map.type)
                    if(this.dialogInfo.point){ //测点信息
                        if(val[0].map.type!="9"){
                            this.$message.warning("请选择一条测点信息");
                            this.form_info.id='';
                        }else{
                            this.form_info.id=val[0].id;
                        }
                    }else{ //设备信息
                        if(val[0].map.type!="8"){
                              this.$refs.tree.setCheckedNodes([]);
                            this.$message.warning("请选择一条设备信息");
                            this.form_info.id='';
                        }else{
                            this.form_info.id=val[0].id;
                        }
                    }
                    
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

