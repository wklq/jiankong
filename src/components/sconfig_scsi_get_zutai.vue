<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="600px" :append-to-body='true'>
        <div class="loncom_dialog_con" style="height:400px;overflow:auto;">
            <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="80px">
                <el-tree
                    :data="tree_data"
                    node-key="id"
                    v-loading = 'treeLoading'
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
        this.form_info.id=this.dialogInfo.id;
        this.form_info.list = [];
        this.getTree();
    },
    mounted() {

    },
    data() {
        return {
            treeLoading:true,
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

        }
    },
    methods:{
        getTree:function(type){
            var _this = this;
            this.tree_data=[];
            let getUrl = '/addr/tree',
                getCanshu = {};
            if(this.dialogInfo.type==1){
              getUrl ='addr/ScAddrDevTree';
              getCanshu ={isHavePoint:true};
            }
          ///addr/ScAddrDevTree isHavePoint:true
            this.$api.post(getUrl, getCanshu, r => {
                console.log(r)
                this.treeLoading = false;
                if(r.err_code=="0"){
                    _this.tree_data=r.data;
                
                    if(Array.isArray(_this.dialogInfo.data) &&_this.dialogInfo.data.length>0){
                   _this.form_info.list = _this.dialogInfo.data
                        _this.dialogInfo.data.map((item,i)=>{
                            _this.setChecked(item.id);
                        })
                    }
                   
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
        //保存的操作
        dialogSure:function(formName){     
                this.dialogInfo.data=this.form_info.list;
                this.dialogInfo.visible=false;        
        },
        changeTree:function(data,checked, node){
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
        setCheckNodes:function(){

        },
        setChecked:function(keys){
            this.$refs.tree.setCheckedKeys([keys]);
        },
        checkSelect:function(){
            console.log(this.dialogInfo.type)
            switch(this.dialogInfo.type){
                case '0':

                  break;
                case '1':
                    if(this.form_info.list[0].map.type!="9"){
                        this.$message.warning("只能选择设备点位类型！");
                        this.$refs.tree.setCheckedKeys([]);
                        return;
                    }else{break;}
                case 'device':
                    if(this.form_info.list[0].map.type!="3"){
                        this.$message.warning("只能选择池塘点位类型！");
                        this.$refs.tree.setCheckedKeys([]);
                        return;
                    }else{break;}
            }
        },

    },
    watch:{
        //监听树形数据变化
        'form_info.list':function(val,oldval){
            console.log(val)
          if(this.dialogInfo.type==0) {
            if(val.length==1){
                this.checkSelect();
                this.returnData=true;
            // }else{
            //     this.returnData=false;

                  // if (val.length > 1) {
                  //   this.$refs.tree.setCheckedKeys([this.form_info.list[0].id]);
                  //   this.$message.warning("只能选择一条信息！");
                   }
                
            }else{
            this.checkSelect();
            this.returnData=true;
          }



        },
   },
    props:["dialogInfo"],
    components:{dialogBtnInfo}

}
</script>

