<template>
    <el-dialog title="告警导出" :visible.sync="dialogInfo.visible" width="600px" :append-to-body='true'>
        <el-scrollbar style="height:100px;" class="loncom_scrollbar">
            <div class="loncom_dialog_con">
                <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="120px">
                    <el-form-item prop="export_time" label="导出时间段">
                        <el-date-picker
                    v-model="form_info.export_time"
                    type="datetimerange"
                    align="right"
                    size="small"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
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
       
    },
    mounted() {
        
    },
    data() {
        var timeCheck = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入导出的时间段"));
        }
        callback();
    };
        return {
            fullscreenLoading:false,  //全屏loading
            form_info:{
                visible:true,
              // export_time:'',
                 alarmtimebegin:'',
                alarmtimeend:'',
                export_time:'',
            },
            
            //验证规则
            formRules:{
                export_time:[
                    { required: true,validator: timeCheck, trigger: 'blur' }
                ],
              
            },
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
                    // const loading = this.$loading({
                    // lock: true,
                    // spinner: 'el-icon-loading',
                    // background: 'rgba(0, 0, 0, 0.7)'
                    // });
                    console.log(this.form_info.export_time);
                    this.form_info.alarmtimebegin = this.form_info.export_time[0].Format('yyyy-MM-dd hh:mm:ss');
                    this.form_info.alarmtimeend = this.form_info.export_time[1].Format('yyyy-MM-dd hh:mm:ss');
                    console.log(this.form_info);
                    let downloadElement = document.createElement('a');
                    let href=window.document.location.origin+rootUrl+ "/export/hisalarm?level="+this.form_info.level+'&alarmtimebegin='+this.form_info.alarmtimebegin+'&alarmtimeend='+this.form_info.alarmtimeend;
                    downloadElement.href = href
                    document.body.appendChild(downloadElement)
                    downloadElement.click()
                    document.body.removeChild(downloadElement) // 下载完成移除元素
                    window.URL.revokeObjectURL(href);// 释放掉blob对象
                    this.dialogInfo.visible = false;
                    //loading.close();
                    // this.$api.post('/Dev/updatehhxx', this.form_info, r => {
                    //     console.log(r);
                    //     if(r.err_code=="0"){
                    //         this.$message.success(r.err_msg);
                    //         this.dialogInfo.visible=false;
                    //         this.$parent.getList();
                    //     }else{
                    //         this.$message.error(r.err_msg);
                    //     }
                    // }); 
                }
            })
        },
       
    },
    
    props:["dialogInfo"],
    components:{dialogBtnInfo}

}
</script>

