<template>
    <div class="loncom_content">
       <div class="loncom_public_top">
            <div class="loncom_fl">池塘管理</div>
            <div class="loncom_fr">
                <el-button type="primary" size="mini" @click="add" v-if="$store.state.record_pool.add"><i class="fa fa-plus-circle loncom_mr5"></i>新建</el-button>
                <el-button type="primary" size="mini" @click="remove" v-if="$store.state.record_pool.remove"><i class="fa fa-minus-circle loncom_mr5"></i>删除</el-button>
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
                <template slot-scope="scope" slot="preview-item">
                    <span v-for="(i,index) in scope.row.item">
                        <em v-if="index==0">{{i.fingername}}</em>
                        <em v-else>、{{i.fingername}}</em>
                    </span>
                </template>
                <template slot-scope="scope" slot="preview-handle">
                    <div>
                        <a href="javascript:;" class="loncom_color" @click="edit (scope.row)" v-if="$store.state.record_pool.edit">编辑</a> 
                        <em v-if="$store.state.record_pool.edit&&$store.state.record_pool.remove">|</em>
                        <a href="javascript:;" class="loncom_color" @click="remove (scope.row)" v-if="$store.state.record_pool.remove">删除</a> 
                    </div>
                </template>
            </el-search-table-pagination>
       </div>
       <Add v-bind:dialogInfo="addInfo" v-if="addInfo.visible"></Add>
    </div>
</template>


<script>
import Add from '@/components/record_pool_add.vue'
export default {
    created () {
        this.getList()
    },
    mounted() {
        scrollCon();
    },
    data() {
       return {
          　table_data:[],
            table_forms: {
                inline: true,
                size:'small',
                forms: [
                    // { prop: 'fname', label: '',placeholder:'名称' },
                ]
            },
            table_columns:[
              { prop: 'code', label: '池塘编码',minWidth:10},
              { prop: 'fname', label: '池塘名称',minWidth:10},
              { prop: 'item', label: '养殖物种',minWidth:10,slotName:'preview-item'},
              { prop: 'farea', label: '水域面积',minWidth:10},
              { prop: 'fmemo', label: '说明',minWidth:30},
              { prop: 'handle', label: '操作',slotName:'preview-handle',width:100},
            ],
            addInfo:{
                title:"新增池塘信息",
                width:'850px',
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
        //获取鱼苗
        getList:function(){
            if(this.$store.state.record_pool.query){
                this.$api.post('/scinfo/query', {}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.table_data=r.data;
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            }
        },
       add:function(){
           this.addInfo.visible=true;
           this.addInfo.title="新增池塘信息";
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
                this.$api.post('/scinfo/delete', {id:ids.toString()}, r => {
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
           this.addInfo.title="编辑池塘信息";
           this.addInfo.visible=true;
           this.addInfo.id=row.id;
       }
    },
    components:{Add}
}
</script>