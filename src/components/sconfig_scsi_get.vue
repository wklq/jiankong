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
        getTree:function(){
            this.tree_data=[];
            var _this = this;
            this.$api.post('/addr/tree', {}, r => {
                console.log(r)
            this. treeLoading = false;
                if(r.err_code=="0"){
                    _this.tree_data=r.data;
                    if(_this.dialogInfo.id){
                      
                         _this.setChecked(_this.dialogInfo.id);
                    }
                   
                   
                
                }else{
                    this.$message.warning(r.err_msg);
                }
            }); 
        },
        //保存的操作
        dialogSure:function(formName){
            if(this.returnData){
                if(this.form_info.list.length===0){
                    this.dialogInfo.data = '';
                }else{
                    this.dialogInfo.data=this.form_info.list[0];
                }
                
                this.dialogInfo.visible=false;
            }else{
                this.$message.warning("请选择一条信息！")
                
            }
        },
        changeTree:function(data,checked, node){
            this.returnData = true;
           
            if(this.$refs.tree.getCheckedNodes().length%2==0){
                if(checked){
                    this.$refs.tree.setCheckedNodes([]);
                    if(data.map.type !=3 && this.dialogInfo.title!=="获取上级空间信息"){
                         this.$message.warning("请关联池塘站点")
                        return;
                    }
                    if(data.map.scinfo ==='0' || this.dialogInfo.title==="获取上级空间信息"){
                    this.$refs.tree.setCheckedNodes([data]);
                }else {
                    
                    this.$message.warning("所选池塘已绑定站点")
                    this.dialogInfo.id  && this.setChecked(this.dialogInfo.id);
                }   
                    //交叉点击节点
                }else{
                    this.$refs.tree.setCheckedNodes([]);
                    //点击已经选中的节点，置空
                }
            }else{
                 if(checked){
                    this.$refs.tree.setCheckedNodes([]);
                    if(data.map.type !=3 && this.dialogInfo.title!=="获取上级空间信息"){
                         this.$message.warning("请关联池塘站点")
                         return;
                    }
                        if(data.map.scinfo ==='0' || this.dialogInfo.title==="获取上级空间信息"){
                        this.$refs.tree.setCheckedNodes([data]);
                    }else{
                  
                       this.dialogInfo.id  && this.setChecked(this.dialogInfo.id);
                        this.$message.warning("所选池塘已绑定站点")
                    }
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
                case '1':
                    if(this.form_info.list[0].map.type!="0"){
                        this.$message.warning("你选择的数据中心类型，只能挂在根节点上！");
                        this.$refs.tree.setCheckedKeys([]);
                        return;
                    }else{break;}
                case '2':
                    if(this.form_info.list[0].map.type!="1"){
                        this.$message.warning("你选择的车间类型，只能挂在数据中心节点上！");
                        this.$refs.tree.setCheckedKeys([]);
                        return;
                    }else{break;}
                case '3':
                    if(this.form_info.list[0].map.type!="2"){
                        this.$message.warning("你选择的池塘类型，只能挂在车间节点上！");
                        this.$refs.tree.setCheckedKeys([]);
                        return;
                    }else{break;}
                case 'video': //视频中的地点
                    if(this.form_info.list[0].map.type=="0"){
                        this.$message.warning("视频所属区域不能挂在根节点上！");
                        this.$refs.tree.setCheckedKeys([]);
                        return;
                    }else{break;}
                default:
                    if(this.form_info.list[0].map.type!="3"){ //添加池塘关联站点用
                        this.$message.warning("池塘管理站点只能选择池塘类型！");
                        this.$refs.tree.setCheckedKeys([]);
                        return;
                    }else{break;}
            }
        },
       
    },
    watch:{
        // //监听树形数据变化
        // 'form_info.list':function(val,oldval){
        //     console.log(val)
        //     if(val.length==1){
        //         this.checkSelect();
        //         this.returnData=true;
        //     }else{
        //         this.returnData=false;
        //         if(val.length>1){
        //             this.$refs.tree.setCheckedKeys([this.form_info.list[1].id]);
        //             // this.$message.warning("只能选择一条信息！");
        //         }
        //     }
            
            
            
       // },
   },
    props:["dialogInfo"],
    components:{dialogBtnInfo}

}
</script>

