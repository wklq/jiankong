<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" :width="dialogInfo.width" :append-to-body='true'>
        <div class="loncom_dialog_con record_pool_add" style="height:400px;overflow:auto;">
            <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="80px">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item prop="code" label="池塘编号" size="small">
                            <el-input v-model="form_info.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="fname" label="池塘名称" size="small">
                            <el-input v-model="form_info.fname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="fworkshopname" label="关联站点" size="small">
                            <el-input v-model="form_info.fworkshopname" readonly placeholder="输选择关联站点" @focus="getScsi"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="farea" label="水域面积" size="small" >
                            <el-input v-model="form_info.farea" placeholder="填数字，单位默认平方米"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="养殖物种" size="small">
                            <div class="itembox" v-for="(item,index) in itemList">
                                <el-col :span="10" style="padding-right:0;">
                                    <el-form-item label="物种名称" size="small">
                                        <el-select v-model="item.fingerid" placeholder="请选择物种">
                                            <el-option
                                                v-for="item in type_data"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                                </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10" style="padding:0 0 0 40px;">
                                    <el-form-item label="数量" size="small">
                                        <el-input v-model="item.number"></el-input>
                                        <div class="el-form-item__error" v-if="itemListCheck[index]">必须为数字值</div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4" style="padding-right:0;">
                                    <el-button-group>
                                    <el-button type="primary" @click="addItem(index)">+</el-button>
                                    <el-button type="primary" @click="minusItem(index)">-</el-button>
                                    </el-button-group>
                                </el-col>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-form-item label="池塘图片" size="small">
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
                                        <el-button style="display:inline-block;" slot="trigger" size="small" type="primary">选取</el-button>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-button size="small" type="primary" @click="preview" v-show="imgPreview_info.url!=''">预览</el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                   <el-col :span="24">
                        <el-form-item label="说明" size="small">
                            <el-input type="textarea" v-model="form_info.fmemo"></el-input>
                        </el-form-item>
                   </el-col>
                </el-row>
            </el-form>
        </div>
        <dialogBtnInfo v-bind:dialogInfobtn="dialogInfo" v-on:dialogSure="dialogSure('formInfo')"></dialogBtnInfo>
        <GetInfo v-bind:dialogInfo="getInfo" v-if="getInfo.visible"></GetInfo>
        <imgPreview :dialogInfo="imgPreview_info" v-if="imgPreview_info.visible"></imgPreview>
    </el-dialog>
</template>
<style>
    .record_pool_add .el-upload {
        float: right;
    }
    .record_pool_add .el-upload-list{
        float: left;
        border: 1px solid #dcdfe6;
        width: calc(100% - 64px);
        height: 32px;
        border-radius: 4px;
    }
    .record_pool_add .el-upload-list__item:first-child{
        margin-top:0px;
        line-height: 2.1;
    }
    .record_pool_add textarea{height: 100px}
</style>
<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
import GetInfo from '@/components/sconfig_scsi_get.vue'
import imgPreview from '@/components/img_preview.vue'
export default {
    created () {
        //获取鱼苗物种
        this.$api.post('/fingerling/query', {}, r => {
            if(r.err_code=="0"){
                this.type_data=r.data;
            }else{
                this.$message.warning(r.err_msg);
            }
        });
        //编辑
        if(this.dialogInfo.id!=""){
            this.$api.post('/scinfo/details', {id:this.dialogInfo.id}, r => {
                console.log(r)

                if(r.err_code=="0"){
                    for(var item in this.form_info){
                      // if(item==="farea"){
                      //   this.form_info[item]=Number(r.data[item]);
                      // }else{
                        this.form_info[item]=r.data[item];
                     // }

                        this.itemList=r.data.item;
                        if(r.data.imgurl!=""){
                            this.fileList=[{name:r.data.imgurl}]
                            this.imgPreview_info.url='static/upload/'+r.data.imgurl;
                        }
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
       var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          var reg = new RegExp("^[0-9]*$");
          for(var i=0;i<this.itemList.length;i++){

              if(reg.test(value)){
                callback();
              }else{
                callback("必须为数字");

            }
          }
        //  callback();
        }
      };
        return {
            rootUrl:'',
            form_info:{
                    id:'',
                    code:'',
                    fname:'',
                    fworkshop:'',
                    fworkshopname:'',
                    imgurl:'',
                    farea:'',
                    fmemo:'',
            },
            itemList:[{fingerid:'',number:''}],
            itemListCheck:[false],
            formRules:{
                    code:[
                        { required: true, message: '请输入编号', trigger: 'blur' },
                    ],
                    fname:[
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],
                    fworkshopname:[
                        { message: '请选择管理站点', trigger: 'change' },
                    ],
                    farea:[
                        { validator: validatePass, trigger: 'blur'}
                    ]
            },
            type_data:[],
            fileList:[],
            config:{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            },
            //关联站点
            getInfo:{
                title:"管理站点信息",
                visible:false,
                id:'',
                type:'',
                data:{},
            },
            imgPreview_info:{
                visible:false,
                url:'',
            }

        }
    },
    methods:{
        //获取站点信息
        getScsi:function(){
            this.getInfo.visible=true;
            this.getInfo.id=this.form_info.fworkshop;
        },
        //保存的操作
        dialogSure:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    for(var i=0;i<this.itemListCheck.length;i++){
                        if(this.itemListCheck[i]){
                            return;
                        }
                    }
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
                console.log(this.form_info)
                this.$api.post('/scinfo/add', {model:{obj:this.form_info,item:this.itemList}}, r => {
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
                this.$api.post('/scinfo/update', {model:{obj:this.form_info,item:this.itemList}}, r => {
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
        handleRemove:function(file, fileList){
            this.fileList=[];
            this.imgPreview_info.url="";
        },
        onexceed:function(){
            this.$message.warning("只能上传一张图片，如需更换图片，先去除已有图片");
        },
        //新增养殖物种条目
        addItem:function(index){
            this.itemList.splice(index+1,0,{fingerid:'',number:''});
            this.itemListCheck.splice(index+1,0,false);
        },
        minusItem:function(index){
            if(this.itemList.length>1){
                this.itemList.splice(index,1);
                this.itemListCheck.splice(index,1);
            }else{
                this.$message.warning("至少保留一条信息");
            }
        },
        preview:function(){
            this.imgPreview_info.visible=true;
        },

    },
    watch:{
        'getInfo.data':{
            handler:function(val,oldval){

                 if(val){
                    this.form_info.fworkshop=val.id;
                    this.form_info.fworkshopname=val.label;
                }else{
                  this.form_info.fworkshop="0";
                this.form_info.fworkshopname="";
                }
            },
            deep: true
        },
        itemList:{
          handler:function(val,oldval){
              var reg = new RegExp("^[0-9]*$");
              for(var i=0;i<this.itemList.length;i++){
                  if(this.itemList[i].number!=""){
                        if(reg.test(this.itemList[i].number)){
                            this.itemListCheck[i]=false;
                        }else{
                            this.itemListCheck[i]=true;
                        }
                  }
              }
          },
          deep: true
        }
    },
    props:["dialogInfo"],
    components:{dialogBtnInfo,GetInfo,imgPreview}

}
</script>

