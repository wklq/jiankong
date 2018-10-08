<template>
    <el-dialog title="测点信息" :visible.sync="dialogInfo.visible" width="600px" :append-to-body='true'>
        <div class="loncom_dialog_con" style="height:400px;overflow:auto;">
            <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="80px">
                <el-tree
                    :data="tree_data"
                    node-key="ID"
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
            </el-form>
        </div>
        <dialogBtnInfo v-bind:dialogInfobtn="dialogInfo" v-on:dialogSure="dialogSure('formInfo')"></dialogBtnInfo>
    </el-dialog>
</template>
<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
export default {
    created () {
        this.getTree();
    },
    mounted() {

    },
    data() {
        return {
            treeLoading:true,
            returnData:false,
           form_info:{
               list:[],
           },
           formRules:{
           },
           tree_data: [],
           defaultProps: {
                children: 'children',
                label: 'CH'
            },

        }
    },
    methods:{
        getTree:function(){
            this.tree_data=[];
            this.$api.post('/devvou/queryrpts',{}, r => {
                console.log(r)
                this.treeLoading = false;
                if(r.err_code=="0"){
                    this.tree_data=r.data;
                    
                    if(this.dialogInfo.data.length>0){
                        var arr=[];
                        for(var i=0;i<this.dialogInfo.data.length;i++){
                            arr.push(this.dialogInfo.data[i].ID);
                        }
                        this.setChecked(arr);
                    }
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
        //保存的操作
        dialogSure:function(formName){
            if(this.returnData){
                this.dialogInfo.data=this.form_info.list;
                console.log(this.dialogInfo.data)
                this.dialogInfo.visible=false;
            }else{
                this.$message.warning("请选择测点信息！")

            }
        },
        changeTree:function(){
              
          this.form_info.list=this.$refs.tree.getCheckedNodes();
          if(this.form_info.list.length>0){
              this.returnData=true;
          }else{
              this.returnData=false;
          }
        },
        //获取树形勾选的
        getCheckedNodes:function(){

        },
        setCheckNodes:function(){

        },
        setChecked:function(keys){
            this.$refs.tree.setCheckedKeys(keys);
            var _this=this;
            setTimeout(function(){
                _this.changeTree();
            },800)
        },
        checkSelect:function(){

        },

    },
    watch:{
        //监听树形数据变化
        'form_info.list':function(val,oldval){

        },
   },
    props:["dialogInfo"],
    components:{dialogBtnInfo}

}
</script>

