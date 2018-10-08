<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" :width="dialogInfo.width" :append-to-body='true'>
        <div class="loncom_dialog_con record_finger_add" style="height:400px;overflow:auto;">
            <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="80px">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item prop="code" label="鱼种编号" size="small">
                            <el-input v-model="form_info.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="name" label="鱼种名称" size="small">
                            <el-input v-model="form_info.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="种类" size="small">
                            <el-select v-model="form_info.type" placeholder="请选择种类">
                                 <el-option
                                v-for="item in type_data"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="图片" size="small">
                             <div style="width:calc(100% - 64px);float:left;">
                                <el-upload
                                    class="upload-demo"
                                    ref="upload"
                                    name="imgurl"
                                    :limit="1"
                                    :headers="config"
                                    :action="rootUrl+'/upload'"
                                    :file-list="fileList"
                                    :on-success="onSuccess"
                                    :on-remove="handleRemove"
                                    :on-error="onError"
                                    :on-change="onchange"
                                    :on-exceed="onexceed"
                                    :auto-upload="false">
                                    <el-button slot="trigger" size="small" type="primary" class="loncom_fl">选取</el-button>
                                </el-upload>
                             </div>
                            <span class="loncom_fr" @click="preview" v-show="imgPreview_info.url!=''"><el-button class="loncom_fr" size="small" type="primary">预览</el-button></span>
                        </el-form-item>
                    </el-col>
                   <el-col :span="24">
                        <el-form-item label="说明" size="small">
                            <el-input type="textarea" v-model="form_info.details"></el-input>
                        </el-form-item>
                   </el-col>
                </el-row>
            </el-form>
        </div>
        <dialogBtnInfo v-bind:dialogInfobtn="dialogInfo" v-on:dialogSure="dialogSure('formInfo')"></dialogBtnInfo>
        <imgPreview :dialogInfo="imgPreview_info" v-if="imgPreview_info.visible"></imgPreview>
    </el-dialog>
</template>
<style>
    .record_finger_add .el-upload {
        float: right;
    }
    .record_finger_add .el-upload-list{
        float: left;
        border: 1px solid #dcdfe6;
        width: calc(100% - 64px);
        height: 32px;
        border-radius: 4px;
    }
    .record_finger_add .el-upload-list__item:first-child{
        margin-top:0px;
        line-height: 2.1;
    }
    .record_finger_add textarea{height: 150px}
</style>
<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
import imgPreview from '@/components/img_preview.vue'
export default {
    created () {
       //获取物种
        this.$api.post('/dictionaries/query', {id:'003'}, r => {
            if(r.err_code=="0"){
                this.type_data=r.data;
            }else{
                this.$message.warning(r.err_msg);
            }
        });
        //编辑
        if(this.dialogInfo.id!=""){
            this.$api.post('/fingerling/details', {id:this.dialogInfo.id}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.form_info=r.data; 
                    if(r.data.imgurl!=""){
                        this.fileList=[{name:r.data.imgurl}];
                        this.imgPreview_info.url='static/upload/'+r.data.imgurl;
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
            imgPreview_info:{
                visible:false,
                url:'',
            }


        }
    },
    methods:{
        //保存的操作
        dialogSure:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    if(this.fileList.length>0&&this.fileList[0].size){
                        this.$refs.upload.submit();
                    }else{
                        this.submit();
                    }
                }
            })
        },
        submit:function(){
            if(this.form_info.id==""){ //新增
                this.$api.post('/fingerling/add', {model:{obj:this.form_info}}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.dialogInfo.visible=false;
                        this.$parent.getList();
                        this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            }else{
                if(this.fileList.length=0){
                    this.form_info.imgurl='';
                }
                this.$api.post('/fingerling/update', {model:{obj:this.form_info}}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.dialogInfo.visible=false;
                        this.$parent.getList();
                        this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                }); 
            }
            
        },
        onSuccess:function(response, file, fileList){
            console.log(response)
            if(response.err_code=="0"){
                this.form_info.imgurl=response.data;
                this.fileList[0].name=response.data;
                this.submit();
            }else{
                this.$message.warning(r.err_msg);
            }
        },
        onError:function(err, file, fileList){
            this.$message.warning(err);
        },
        onchange:function(file,fileList){
            console.log(fileList)
            var fileArry=file.name.split(".");
            var fileType=fileArry[fileArry.length-1];
            if(fileType=="png"||fileType=="jpg"||fileType=="PNG"||fileType=="JPG"){
                if(file.size&&file.size>512000){
                    this.$message.warning("图片超过500KB!");
                    this.fileList=[];
                }else{
                    this.fileList=fileList;
                    this.imgPreview_info.url = file.url;
                }
            }else{
                this.$message.error("图片格式只能为png或jpg");
                this.fileList=[];
            }
        },
        onexceed:function(){
            this.$message.warning("只能上传一张图片，如需更换图片，先去除已有图片");
        },
        handleRemove:function(file, fileList){
            this.fileList=[];
            this.imgPreview_info.url="";
        },
        preview:function(){
            this.imgPreview_info.visible=true;
        },
       
    },
    props:["dialogInfo"],
    components:{dialogBtnInfo,imgPreview}

}
</script>

