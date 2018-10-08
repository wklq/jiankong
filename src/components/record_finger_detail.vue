<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" :width="dialogInfo.width" :append-to-body='true'>
        <div class="loncom_dialog_con record_finger_detail" style="height:400px;overflow:auto;">
                <el-row :gutter="40">
                    <el-col :span="12">
                    <div class="fin_item">
                        <span >鱼种编号：</span>
                        <span >{{form_info.code}}</span>
                    </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="fin_item">
                        <span>鱼种名称：</span>
                        <span>{{form_info.name}}</span>
                    </div>
                    </el-col>
                    <el-col :span="12">
                         <div class="fin_item">
                        <span>种类：</span>
                        <span>{{form_info.typename}}</span>
                    </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="fin_item">
                        <span>图片：</span>
                        <span class="img_box"><img :src='"static/upload/"+form_info.imgurl'></span>
                    </div>
                    </el-col>
                   <el-col :span="24">
                        <div class="fin_item">
                        <span>说明：</span>
                        <span>{{form_info.details}}</span>
                    </div>
                   </el-col>
                </el-row>
        </div>
        
    </el-dialog>
</template>
<style>
    .record_finger_detail .fin_item{
        margin-bottom:15px;
         height:32px;
        line-height: 32px;   
        }
    .fin_item span{
        float:left;
        margin-right:10px;
    }
    .fin_item .img_box{
        width:calc(100% - 200px);
    }
    .fin_item .img_box img{
        width:100%;
    }
</style>
<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
export default {
    created () {
       //获取物种
        // this.$api.post('/dictionaries/query', {id:'003'}, r => {
        //     if(r.err_code=="0"){
        //         this.type_data=r.data;
        //     }else{
        //         this.$message.warning(r.err_msg);
        //     }
        // });
        //编辑
        if(this.dialogInfo.id!=""){
            this.$api.post('/fingerling/details', {id:this.dialogInfo.id}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.form_info=r.data; 
                    if(r.data.imgurl!=""){
                        this.fileList=[{name:r.data.imgurl}];
                    }
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        }

    },
    mounted() {
        this.rootUrl=rootUrl;
    },
    data() {
        return {
            rootUrl:'',
           form_info:{
                id:'',
                code:'',
                name:'',
                imgurl:'',
                type:'',
                details:'',
           },
           formRules:{
                code:[
                    { required: true, message: '请输入编号', trigger: 'blur' },
                ],
                name:[
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
           },
           type_data:[],
           fileList:[],
           config:{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            },


        }
    },
    methods:{
       
       
    },
    props:["dialogInfo"],
    components:{dialogBtnInfo}

}
</script>

