<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" :width="dialogInfo.width" :append-to-body='true'>
        <el-scrollbar style="height:400px;" class="loncom_scrollbar">
            <div class="loncom_dialog_con">
                <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="100px">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item prop="name" label="策略名称" size="small">
                                <el-input v-model="form_info.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="inpointname" label="判断测点" size="small">
                                <el-input v-model="form_info.inpointname" readonly  @focus="getPoint(true,'1')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="symbol" label="运算符" size="small">
                                <el-select v-model="form_info.symbol" placeholder="请选择">
                                    <el-option value=">">></el-option>
                                    <el-option value="<="><=</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="compareval" label="判断值" size="small">
                                <el-input v-model="form_info.compareval"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="outpointname" label="执行测点" size="small">
                                <el-input v-model="form_info.outpointname" readonly @focus="getPoint(true,'2')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="outpointval" label="执行发送值" size="small">
                                <el-input v-model="form_info.outpointval"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="isallpoint" label="是否同步" size="small">
                                <el-radio-group v-model="form_info.isallpoint">
                                    <el-radio label="1">同步</el-radio>
                                    <el-radio label="0">单个</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="form_info.isallpoint==0">
                            <el-form-item prop="devname" label="设备" size="small">
                                <el-input v-model="form_info.devname" readonly  @focus="getPoint(false,'3')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="isvalidate" label="启停用" size="small">
                                <el-radio-group v-model="form_info.isvalidate">
                                    <el-radio label="1">启用</el-radio>
                                    <el-radio label="0">停用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-scrollbar>
        <dialogBtnInfo v-bind:dialogInfobtn="dialogInfo" v-on:dialogSure="dialogSure('formInfo')"></dialogBtnInfo>
        <Point v-bind:dialogInfo="pointInfo" v-if="pointInfo.visible"></Point>
        <Device v-bind:dialogInfo ='deviceInfo' v-if='deviceInfo.visible'></Device>
    </el-dialog>
</template>
<style>
 
</style>
<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
import Point from './system_point_get.vue'
import Device from './system_strategy_point.vue'
export default {
    created () {
       if(this.dialogInfo.id!=""){
           this.$api.post('/strategy/query', {model:{obj:{id:this.dialogInfo.id}}}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.form_info=r.data[0];
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
            rootUrl:'',
           form_info:{
                id:'',
                name:'',
                inpointid:'',
                inpointname:'',
                devid:'',
                devname:'',
                isallpoint:'1',
                symbol:'',
                compareval:'',
                outpointid:'',
                ouutpointname:'',
                outpointval:'',
                isvalidate:'1',
           },
           formRules:{
                name:[
                    { required: true, message: '请输入策略名称', trigger: 'blur' },
                ],
                inpointname:[
                    { required: true, message: '请选择策略测点', trigger: 'change' },
                ],
                devname:[
                    { required: true, message: '请选择设备', trigger: 'change' },
                ],
                isallpoint:[
                    { required: true, message: '请选择设备', trigger: 'change' },
                ],
                symbol:[
                    { required: true, message: '请选择运算符', trigger: 'change' },
                ],
                compareval:[
                    { required: true, message: '请输入判断值', trigger: 'blur' },
                ],
                outpointname:[
                    { required: true, message: '请选择执行测点', trigger: 'change' },
                ],
                outpointval:[
                    { required: true, message: '请输入执行发送', trigger: 'blur' },
                ],
                isvalidate:[
                    { required: true, message: '请选择起停用', trigger: 'change' },
                ],
                
           },
           //策略测点及设备，point:true,为测点，false为设备
           pointInfo:{
               visible:false,
               type:'1',
               id:'',
               data:[],
           },
           deviceInfo:{
             visible:false,
               type:'1',
               id:'',
               data:[],
           
           }
           
        }
    },
    methods:{
        
        dialogSure:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    if(this.form_info.id==""){ //新增
                        console.log(this.form_info)
                        this.$api.post('/strategy/add', {model:{obj:this.form_info}}, r => {
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
                        this.$api.post('/strategy/update', {model:{obj:this.form_info}}, r => {
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
        //获取策略测点及设备信息
        getPoint:function(flag,type){
            if(flag){ //测点
                this.pointInfo.title="测点信息"
                if(type=='1'){
                    this.pointInfo.id=this.form_info.inpointid;
                }else if(type=='2'){
                    this.pointInfo.id=this.form_info.outpointid;
                }
                this.pointInfo.point=true;
                   this.pointInfo.type=type;
                this.pointInfo.data=[];
                this.pointInfo.visible=true;
            }else{
                this.deviceInfo.title="设备信息"
                this.deviceInfo.id=this.form_info.devid;
                this.deviceInfo.point=false;
                   this.deviceInfo.type=type;
            this.deviceInfo.data=[];
            this.deviceInfo.visible=true;
            }
         
        },

       
    },
    watch:{
        'pointInfo.data':{
            handler:function(val,oldval){
                if(this.pointInfo.type=='1'&&this.pointInfo.data.length>0){  //inpointid 策略测点
                    debugger;
                    this.form_info.inpointid=val[0].ID;
                    this.form_info.inpointname=val[0].CH;
                }else if(this.pointInfo.type=='2'&&this.pointInfo.data.length>0){  //outpointid 执行测点
                    this.form_info.outpointid=val[0].ID;
                    this.form_info.outpointname=val[0].CH;
                }else if(this.pointInfo.type=='3'&&this.pointInfo.data.length>0){  //devid 设备
                    this.form_info.devid=val[0].id;
                    this.form_info.devname=val[0].label;
                }
            },
            deep: true
        },
        'deviceInfo.data':{
            handler:function(val,oldval){
               
                    this.form_info.devid=val[0].id;
                    this.form_info.devname=val[0].label;
                
            },
            deep: true
        },
    },
    props:["dialogInfo"],
    components:{dialogBtnInfo,Point,Device}

}
</script>

