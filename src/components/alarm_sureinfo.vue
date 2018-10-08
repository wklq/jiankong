<template>
    <el-dialog title="提示" :visible.sync="dialogInfo.visible" width="600px" :append-to-body='true'>
        <el-scrollbar style="height:150px;" class="loncom_scrollbar">
            <div class="loncom_dialog_con">
                <el-form :model="ruleForm" :rules="rules" ref="formInfo" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="确认内容" prop="cfm">
                        <el-input type="textarea" v-model="ruleForm.cfm"></el-input>
                    </el-form-item>
                </el-form>
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
       
    },
    mounted() {
        
    },
    data() {
        return {
            ruleForm:{
                cfm:''
            },
            
            //验证规则
            rules:{
                cfm:[
                    { required: true, message: '请输入结论', trigger: 'blur' }
                ],
              
            },
            
        }
    },
    methods:{
        //保存的操作
        dialogSure:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    this.dialogInfo.cfm=this.ruleForm.cfm;
                }
            })
        },
       
    },
    
    props:["dialogInfo"],
    components:{dialogBtnInfo}

}
</script>

