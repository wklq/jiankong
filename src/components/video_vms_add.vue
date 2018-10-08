<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="1000px" :append-to-body='true'>
        <div class="loncom_dialog_con" style="height:400px;overflow:auto;">
            <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="100px">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item prop="servername" label="摄像头名称" size="small">
                            <el-input v-model="form_info.servername"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="ip" label="连接ip" size="small">
                            <el-input v-model="form_info.ip"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="port" label="连接端口号" size="small">
                            <el-input v-model="form_info.port"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="port" label="品牌类型" size="small">
                            <el-select v-model="form_info.type" placeholder="请选择品牌类型">
                                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in $parent.data_type"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="userid" label="连接用户名" size="small">
                            <el-input v-model="form_info.userid"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="paswd" label="连接密码" size="small">
                            <el-input v-model="form_info.paswd"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="mtime" label="监测时间" size="small">
                            <el-input v-model="form_info.mtime" placeholder="单位毫秒"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="code" label="通道编码" size="small">
                            <el-input v-model="form_info.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="addrname" label="所属区域" size="small">
                            <el-input v-model="form_info.addrname" readonly  @focus="getScsi"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <dialogBtnInfo v-bind:dialogInfobtn="dialogInfo" v-on:dialogSure="dialogSure('formInfo')"></dialogBtnInfo>
        <GetInfo v-bind:dialogInfo="getInfo" v-if="getInfo.visible"></GetInfo>
    </el-dialog>
</template>
<style>
    
</style>
<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
import GetInfo from '@/components/sconfig_scsi_get_vedio.vue'
export default {
    created () {
       if(this.dialogInfo.id!=""){ //编辑
            this.$api.post('/videoserver/details', {id:this.dialogInfo.id}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.form_info=r.data;
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
       }
    },
    mounted() {
        
    },
    data() {
        return {
           
           form_info:{
                id:'',
                servername:'',
                ip:'',
                port:'',
                userid:'',
                paswd:'',
                type:'',
                mtime:'',
                code:'',
                addrid:'',
                addrname:'',
            },
            formRules:{
                servername:[
                    { required: true, message: '请输入摄像头名称', trigger: 'blur' },
                ],
                ip:[
                    { required: true, message: '请输入连接ip', trigger: 'blur' },
                ],
                port:[
                    { required: true, message: '请输入连接端口号', trigger: 'blur' },
                ],
                type:[
                    { required: true, message: '请选择品牌类型', trigger: 'change' },
                ],
                user:[
                    { required: true, message: '请输入连接账号', trigger: 'blur' },
                ],
                paswd:[
                    { required: true, message: '请输入连接密码', trigger: 'blur' },
                ],
                code:[
                    { required: true, message: '请输入通道编码', trigger: 'blur' },
                ],
                addrname:[
                    { required: true, message: '请选择所属区域', trigger: 'change' },
                ],
                
            },
            getInfo:{
                title:"管理站点信息",
                visible:false,
                id:'',
                type:'video',
                data:{},
            },

        }
    },
    methods:{
        getScsi:function(){
            this.getInfo.visible=true;
            this.getInfo.id=this.form_info.addrid;
        },
        //保存的操作
        dialogSure:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                   if(this.form_info.id==""){  //新增
                       this.$api.post('/videoserver/add', {model:{obj:this.form_info}}, r => {
                            console.log(r)
                            if(r.err_code=="0"){
                                this.dialogInfo.visible=false;
                                this.$parent.getList();
                                this.$message.success(r.err_msg);
                            }else{
                                this.$message.warning(r.err_msg);
                            }
                        }); 
                   }else{  //编辑
                        this.$api.post('/videoserver/update', {model:{obj:this.form_info}}, r => {
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
                }
            })
        },
       
    },
    watch:{
        'getInfo.data':{
            handler:function(val,oldval){
                this.form_info.addrid=val.id
                this.form_info.addrname=val.label;
            },
            deep: true
        }
    },
    props:["dialogInfo"],
    components:{dialogBtnInfo,GetInfo}

}
</script>

