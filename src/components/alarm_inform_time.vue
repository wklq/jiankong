<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="600px" :append-to-body='true'>
        <el-scrollbar style="height:400px;" class="loncom_scrollbar alarm_inform_time">
            <div class="loncom_dialog_con">
                
                <div class="loncom_sysinfo_box loncom_dialog_system_informtop">
                    提醒：设置告警提醒时间。
                </div>
                <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="100px">
                    <el-form-item prop="week" label="周范围" size="small">
                        <el-checkbox-group v-model="form_info.week">
                            <el-checkbox label="1">周一</el-checkbox>
                            <el-checkbox label="2">周二</el-checkbox>
                            <el-checkbox label="3">周三</el-checkbox>
                            <el-checkbox label="4">周四</el-checkbox>
                            <el-checkbox label="5">周五</el-checkbox>
                            <el-checkbox label="6">周六</el-checkbox>
                            <el-checkbox label="7">周日</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item prop="time" label="时间范围" size="small">
                        <div>
                            <el-radio-group v-model="form_info.time">
                                <el-radio label="1">全天</el-radio>
                                <el-radio label="2">以下时间段</el-radio>
                            </el-radio-group>
                        </div>
                    </el-form-item>
                    <el-form-item prop="value" v-if="form_info.time==2||form_info.time=='2'">
                        <el-time-picker
                            is-range
                            v-model="form_info.value"
                            :picker-options="pickerOptions"
                            format="HH:mm"
                            value-format="HH:mm"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            size="mini"
                            >
                        </el-time-picker>
                    </el-form-item>
                </el-form>
            <!--结束-->
            </div>
        </el-scrollbar>
        <dialogBtnInfo v-bind:dialogInfobtn="dialogInfo" v-on:dialogSure="dialogSure('formInfo')"></dialogBtnInfo>
    </el-dialog>
</template>
<style>
    .alarm_inform_time .el-checkbox+.el-checkbox{
        margin-left: 18px;
    }
    .alarm_inform_time .el-checkbox__label{
        padding-left:5px;
    }
</style>
<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
export default {
    created () {
       if(this.dialogInfo.id!=""){
            this.$api.post('/Alarmstrategy/getTimeDetail', {timeid:this.dialogInfo.id}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    for(var i=0;i<r.data.length;i++){
                        this.form_info.week.push(r.data[i].timenum)
                    }
                    if(r.data[0].begintime=="00:00"&&r.data[0].endtime=="23:59"){
                        this.form_info.time="1";
                    }else{
                        this.form_info.time="2";
                        this.form_info.value=[r.data[0].begintime,r.data[0].endtime];
                    }
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
       }
    },
    mounted() {
        
    },
    data() {
        var validatePass = (rule, value, callback) => {
            console.log(value)
            if (this.form_info.time==='2') {
                if(value===''||value===null){
                    callback("请选择时间范围");
                }else{
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            form_info:{
               week:[],
               time:'1',
               value:'',
            },
            formRules:{
                week:[
                    { required: true, message: '请选择周范围', trigger: 'change' },
                ],
                time:[
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],
                value:[
                    { required: true,validator: validatePass, trigger: 'change' }
                ],
               
            },
            //时间范围
            pickerOptions: {
                shortcuts: [{
                    text: '全天',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
           
        }
    },
    methods:{
        //保存的操作
        dialogSure:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    console.log(this.form_info)
                    var arr=[];
                    var begintime="";
                    var endtime="";
                    if(this.form_info.time=="1"){
                        begintime="00:00";
                        endtime="23:59";
                    }else{
                        begintime=this.form_info.value[0];
                        endtime=this.form_info.value[1];
                    }
                    for(var i=0;i<this.form_info.week.length;i++){
                        var obj={};
                        obj.timenum=this.form_info.week[i];
                        obj.begintime=begintime;
                        obj.endtime=endtime;
                        arr.push(obj);
                    }
                    this.dialogInfo.data=arr;
                    this.dialogInfo.visible=false;
                }
            })
        },
       
    },
    
    props:["dialogInfo"],
    components:{dialogBtnInfo}

}
</script>

