<template>
    <el-dialog title="报表展示" :visible.sync="dialogInfo.visible" width="1200px" :append-to-body='true'>
        <el-scrollbar style="height:500px;" class="loncom_scrollbar">
            <div class="loncom_dialog_con">
                <div>
                    <el-date-picker
                        v-model="value5"
                        size="small"
                        type="datetimerange"
                        :picker-options="pickerOptions2"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                    </el-date-picker>
                    <el-button type="primary" size="small" icon="el-icon-search" @click="show">搜索</el-button>
                    <div class="loncom_fr">
                        <el-button type="primary" size="small" icon="el-icon-upload2" @click="exp">导出</el-button>
                    </div>
                </div>
                <div id="report" style="width:100%;height:400px;margin-top:15px;"></div>
            </div>
        </el-scrollbar>
    </el-dialog>
</template>
<style>

</style>
<script>
export default {
    created () {
       
    },
    mounted() {
        
    },
    data() {
        
        return {
            pickerOptions2: {
                shortcuts: [{
                    text: '今日',
                    onClick(picker) {
                        const theDate = new Date();
                        const start=theDate.Format("yyyy-MM-dd 00:00:00");
                        const end=theDate.Format("yyyy-MM-dd 23:59:59");
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '本周',
                    onClick(picker) {
                        const theDate = new Date();
                        const nowDay=theDate.getDay();
                        let start=null;
                        let end=null;
                        if(nowDay!=0){
                            start=new Date(theDate.getTime()-3600*1000*24*(nowDay-1)).Format("yyyy-MM-dd 00:00:00");
                            end=new Date(theDate.getTime()+3600*1000*24*(7-nowDay)).Format("yyyy-MM-dd 23:59:59");
                        }else{
                            start=new Date(theDate.getTime()-3600*1000*24*6).Format("yyyy-MM-dd 00:00:00");
                            end=theDate.Format("yyyy-MM-dd 23:59:59");
                        }
                        picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '本月',
                    onClick(picker) {
                        const theDate = new Date();
                        let theMonth=theDate.getMonth();
                        const start = new Date(theDate.getFullYear(),theMonth,1).Format("yyyy-MM-dd 00:00:00");
                        let nextMonth=theMonth+1;
                        const end=new Date(new Date(theDate.getFullYear(),nextMonth,1)-1000*60*60*24).Format("yyyy-MM-dd 23:59:59");
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            value5:'',

        }
    },
    methods:{
        show:function(){
            
            if(this.value5==null||this.value5==''){
                this.$message.warning("请选择时间段");
                return;
            }
            var btime=new Date(this.value5[0]).Format("yyyy-MM-dd hh:mm:ss");
            var etime=new Date(this.value5[1]).Format("yyyy-MM-dd hh:mm:ss");
            console.log(this.dialogInfo)
            this.$api.post('/Dev/getdevpidhis', {pid:this.dialogInfo.pid,mgrobjid:this.dialogInfo.mgrobjid,begintime:btime,endtime:etime}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    var xData = [];
                    var yData = [];
                    for(var i=0;i<r.data[0].data.length;i++){
                        xData.push(r.data[0].data[i].TIME);
                        yData.push(r.data[0].data[i].VALUE);
                    }
                    lineZoom("report",this.dialogInfo.devname+"_"+this.dialogInfo.ch,xData,yData)
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
        exp:function(){
            if(this.value5==''||this.value5==null){
                this.$message.warning("请选择时间段");
                return;
            }
            var btime=new Date(this.value5[0]).Format("yyyy-MM-dd hh:mm:ss");
            var etime=new Date(this.value5[1]).Format("yyyy-MM-dd hh:mm:ss");
            let downloadElement = document.createElement('a')
            let href=window.document.location.origin+rootUrl+ "/export/report?begintime="+btime+"&endtime="+etime+"&pid="+this.dialogInfo.pid+"&mgrobjid="+this.dialogInfo.mgrobjid;
            downloadElement.href = href
            document.body.appendChild(downloadElement)
            downloadElement.click()
            document.body.removeChild(downloadElement) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
        },
       
    },
    
    props:["dialogInfo"],
    components:{}

}
</script>

