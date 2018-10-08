<template>
    <el-dialog title="阀值设置" :visible.sync="dialogInfo.visible" width="600px" :append-to-body='true'>
        <el-scrollbar style="height:350px;" class="loncom_scrollbar" v-loading="loading">
            <div class="loncom_dialog_con device_config">
                <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="90px">
                    <h2 class="loncom_mb20">上限告警</h2>
                    <el-form-item prop="maxevent" label="事件编码">
                        <el-select v-model="form_info.maxevent" placeholder="请选择" size="small" style="width:80%">
                            <el-option
                            v-for="item in options"
                            :key="item.bm"
                            :label="item.content"
                            :value="item.bm">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="maxalarm4" label="一级告警">
                        <el-input v-model="form_info.maxalarm4" size="small" placeholder="请输入一级告警值" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item prop="maxalarm3" label="二级告警">
                        <el-input v-model="form_info.maxalarm3" size="small" placeholder="请输入二级告警值" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item prop="maxalarm2" label="三级告警">
                        <el-input v-model="form_info.maxalarm2" size="small" placeholder="请输入三级告警值" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item prop="maxalarm" label="四级告警">
                        <el-input v-model="form_info.maxalarm" size="small" placeholder="请输入四级告警值" style="width:80%"></el-input><span>(预警值)</span>
                    </el-form-item>
                    <h2 class="loncom_mb20">下限告警</h2>
                    <el-form-item prop="minevent" label="事件编码">
                        <el-select v-model="form_info.minevent" placeholder="请选择" size="small" style="width:80%">
                            <el-option
                            v-for="item in options"
                            :key="item.bm"
                            :label="item.content"
                            :value="item.bm">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="minalarm4" label="一级告警">
                        <el-input v-model="form_info.minalarm4" size="small" placeholder="请输入一级告警值" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item prop="minalarm3" label="二级告警">
                        <el-input v-model="form_info.minalarm3" size="small" placeholder="请输入二级告警值" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item prop="minalarm2" label="三级告警">
                        <el-input v-model="form_info.minalarm2" size="small" placeholder="请输入三级告警值" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item prop="minalarm" label="四级告警">
                        <el-input v-model="form_info.minalarm" size="small" placeholder="请输入四级告警值" style="width:80%"></el-input><span>(预警值)</span>
                    </el-form-item>
                </el-form>
            <!--结束-->
            </div>
        </el-scrollbar>
        <dialogBtnInfo v-bind:dialogInfobtn="dialogInfo" v-on:dialogSure="dialogSure('formInfo')"></dialogBtnInfo>
    </el-dialog>
</template>
<style>
    
</style>
<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
export default {
    created () {
    
       this.form_info=Object.assign({}, this.dialogInfo);
       this.$api.post('/eventdir/query', {}, r => {
            console.log(r);
            if(r.err_code=="0"){
                this.options=r.data;
            }else{
                this.$message.error(r.err_msg);
            }
        }); 
    },
    mounted() {
        
    },
    data() {
        var maxalarmPass = (rule, value, callback) => {
            if (value === ''||value==undefined) {
              
                callback(new Error('请输入上限四级告警值'));
            } else {
                if(parseInt(value)>=parseInt(this.form_info.maxalarm2)){
                    callback(new Error('上限四级告警值必须小于上限三级告警值'));
                }
                if(parseInt(value)<=parseInt(this.form_info.minalarm)){
                    callback(new Error('上限四级告警值必须大于下限四级告警值'));
                }
                callback();
            }
        };
        var maxalarmPass2 = (rule, value, callback) => {
            if (value === ''||value==undefined) {
                callback(new Error('请输入上限三级告警值'));
            } else {
                if(parseInt(value)>=parseInt(this.form_info.maxalarm3)){
                    callback(new Error('上限三级告警值必须小于上限二级告警值'));
                }
                if(parseInt(value)<=parseInt(this.form_info.minalarm) ){
                    callback(new Error('上限三级告警值必须大于下限四级告警值'));
                }
                callback();
            }
        };
        var maxalarmPass3 = (rule, value, callback) => {
            if (value === ''||value==undefined) {
                callback(new Error('请输入上限二级告警值'));
            } else {
                if(parseInt(value)>=parseInt(this.form_info.maxalarm4)){
                    callback(new Error('上限二级告警值必须小于上限一级告警值'));
                }
                if(parseInt(value)<=parseInt(this.form_info.minalarm)){
                    callback(new Error('上限二级告警值必须大于下限四级告警值'));
                }
                callback();
            }
        };
        var minalarmPass = (rule, value, callback) => {
            if (value === ''||value==undefined) {
                callback(new Error('请输入下限四级告警值'));
            } else {
                if(parseInt(value)<=parseInt(this.form_info.minalarm2)){
                    callback(new Error('下限四级告警值必须大于下限三级告警值'));
                }
                callback();
            }
        };
        var minalarmPass2 = (rule, value, callback) => {
            if (value === ''||value==undefined) {
                callback(new Error('请输入下限三级告警值'));
            } else {
                if(parseInt(value)<=parseInt(this.form_info.minalarm3)){
                    callback(new Error('下限三级告警值必须大于下限二级告警值'));
                }
                callback();
            }
        };
        var minalarmPass3 = (rule, value, callback) => {
            if (value === ''||value==undefined) {
                callback(new Error('请输入下限二级告警值'));
            } else {
                if(parseInt(value)<=parseInt(this.form_info.minalarm4)){
                    callback(new Error('下限二级告警值必须大于下限一级告警值'));
                }
                callback();
            }
        };
        return {
            loading:false,
            options:[],
            form_info:{
                visible:true,
                pid:'',
                maxevent:'',
                mgrobjid:'',
                maxalarm:'',
                maxalarm2:'',
                maxalarm3:'',
                maxalarm4:'',
                minalarm:'',
                minalarm2:'',
                minalarm3:'',
                minalarm4:'',
                minevent:''
            },
            //验证规则
            formRules:{
                maxevent:[
                    { required: true, message: '请选择事件编码', trigger: 'change' },
                ],
                minevent:[
                    { required: true, message: '请选择事件编码', trigger: 'change' },
                ],
                maxalarm:[
                    { required: true,validator: maxalarmPass, trigger: 'blur' }
                ],
                maxalarm2:[
                    { required: true,validator: maxalarmPass2, trigger: 'blur' }
                ],
                maxalarm3:[
                    { required: true,validator: maxalarmPass3, trigger: 'blur' }
                ],
                maxalarm4:[
                    { required: true, message: '请输入上限一级告警值', trigger: 'blur' },
                ],
                minalarm:[
                    { required: true,validator: minalarmPass, trigger: 'blur' }
                ],
                minalarm2:[
                    { required: true,validator: minalarmPass2, trigger: 'blur' }
                ],
                minalarm3:[
                    { required: true,validator: minalarmPass3, trigger: 'blur' }
                ],
                minalarm4:[
                    { required: true, message: '请输入下限一级告警值', trigger: 'blur' },
                ],
            },
            
        }
    },
    methods:{
        // //编辑进入
        // editInit:function(){
        //     if(this.dialogInfo){
                
        //     }
        // },
        //保存的操作
        dialogSure:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    this.loading=true;
                    this.$api.post('/Dev/updatehhxx', this.form_info, r => {
                        console.log(r);
                        this.loading=false;
                        if(r.err_code=="0"){
                            this.$message.success(r.err_msg);
                            this.dialogInfo.visible=false;
                            this.$parent.getList();
                        }else{
                            this.$message.error(r.err_msg);
                        }
                    }); 
                }
            })
        },
       
    },
    
    props:["dialogInfo"],
    components:{dialogBtnInfo}

}
</script>

