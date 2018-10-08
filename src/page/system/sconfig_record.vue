<template>
    <div class="loncom_content">
        <div class="loncom_public_top">
            <div class="loncom_fl">档案管理</div>
        </div>
        <div class="loncom_public_con">
            <div class="loncom_public_add">
                <div class="loncom_public_add_title">
                    <span>鱼苗种类配置</span>
                    <div class="loncom_fr">
                        <el-button type="primary" size="mini" @click="addItem" v-if="$store.state.sconfig_record.add">新增种类</el-button>
                    </div>
                </div>
                <div class="loncom_public_add_con loncom_scroll_con">
                    <div style="max-width:500px;">
                        <el-form ref="formInfo" label-width="80px">
                            <el-row>
                                <div v-for="(item,index) in itemList">
                                    <el-col :span="18">
                                        <el-form-item prop="name" :label="'种类'+(index+1)" size="small">
                                            <el-input v-model="itemList[index].name" placeholder="种类名称"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" style="padding-left:10px;">
                                        <el-button-group>
                                        <el-button type="primary" @click="saveItem(index)" size="small" v-if="$store.state.sconfig_record.edit">保存</el-button>
                                        <el-button type="primary" @click="removeItem(index)" size="small" v-if="$store.state.sconfig_record.remove">删除</el-button>
                                        </el-button-group>
                                    </el-col>
                                </div>
                            </el-row>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    created () {
        this.getDic()
    },
    mounted() {
        scrollCon();
    },
    data() {
       return {
            itemList:[{name:'',id:''}]
       }
   },
    methods:{
        //获取鱼种信息
        getDic:function(){
            if(this.$store.state.sconfig_record.query){
                this.$api.post('/dictionaries/query', {id:'003'}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.itemList=r.data;
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            }
            
        },
       saveItem:function(index){
           if(this.itemList[index].name==""){
               this.$message.warning("请输入种类名称");
           }else{
               if(this.itemList[index].id==""){ //新增
                    this.$api.post('/dictionaries/add', {model:{obj:this.itemList[index]}}, r => {
                        console.log(r)
                        if(r.err_code=="0"){
                            this.$message.success(r.err_msg);
                        }else{
                            this.$message.warning(r.err_msg);
                        }
                    });
               }else{ //修改
                    this.$api.post('/dictionaries/update', {model:{obj:this.itemList[index]}}, r => {
                        console.log(r)
                        if(r.err_code=="0"){
                            this.$message.success(r.err_msg);
                        }else{
                            this.$message.warning(r.err_msg);
                        }
                    });
               }
           }
       },
       addItem:function(){
            this.itemList.splice(this.itemList.length,0,{name:'',id:''});
        },
        removeItem:function(index){
            if(this.itemList[index].id==""){
                this.itemList.splice(index,1);
            }else{ //删除已有的
                this.$confirm("确定删除?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning',
                }).then(() => {
                    this.$api.post('/dictionaries/delete', {id:this.itemList[index].id}, r => {
                        console.log(r)
                        if(r.err_code=="0"){
                            this.itemList.splice(index,1);
                            this.$message.success(r.err_msg);
                        }else{
                            this.$message.warning(r.err_msg);
                        }
                    });
                });
            }
            
        },
        
    },
    components:{}
}
</script>