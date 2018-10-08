<template>
    <el-dialog title="测点信息" :visible.sync="dialogInfo.visible" width="600px" :append-to-body='true'>
        <el-scrollbar style="height:400px;" class="loncom_scrollbar">
        <div class="loncom_dialog_con">
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
    },
    mounted() {
      
    },
    data() {
        return {
            loading:true,
            returnData:false,
           form_info:{
               id:'',
               list:[],
           },
           formRules:{
                
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
            this.$api.post('/addr/ScAddrDevTree', {isHavePoint:true}, r => {
                 this.loading = false;
                if(r.err_code=="0"){
                    this.tree_data=r.data;
                    if(this.dialogInfo.data.length>0){
                        var arr=[];
                        for(var i=0;i<this.dialogInfo.data.length;i++){
                            arr.push(this.dialogInfo.data[i].id);
                        }
                        this.setChecked(arr);
                    }
                }
            }); 
        },
        //保存的操作
        dialogSure:function(formName){
            // this.$refs[formName].validate((valid) => {
            //     if(valid){
            //         this.dialogInfo.data=this.form_info.list;
            //         this.dialogInfo.visible=false;
            //     }
            // })
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
              for(var i=0;i<this.form_info.list.length;i++){
                if(this.form_info.list[i].map.type!="9"){
                    this.$message.warning("只能选择测点信息");
                    this.returnData=false;
                    return;
                }
              }
              this.returnData=true;
          }else{
              this.returnData=false;
          }
        },
        //获取树形勾选的
        getCheckedNodes:function(){

        },
        setChecked:function(keys){
            this.$refs.tree.setCheckedKeys(keys);
            var _this=this;
            setTimeout(function(){
                _this.changeTree();
            },800)
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

