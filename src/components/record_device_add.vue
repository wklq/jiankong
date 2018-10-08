<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" :width="dialogInfo.width" :append-to-body='true'>
        
            <div class="loncom_dialog_con">
            <div class="loncom_public_tab">
                <el-tabs v-model="ActiveName">
                    <el-tab-pane label="基本信息" name="first">
                        <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="110px">
                            <el-row :gutter="40">
                                <el-col :span="24">
                                    <el-form-item prop="devname" label="设备名称" size="small">
                                        <el-input :readonly='inputDisabled' v-model="form_info.devname"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item prop="com" label='协议类型' size="small">
                                        <el-select v-model="form_info.comBef">
                                            <el-option value='TCPSRV' label='TCPSRV'></el-option>
                                        </el-select>
                                        
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item prop="comsetting" label="通讯参数" size="small">
                                        <el-input v-model="form_info.comsetting"  type='number'></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item prop="addr" label="设备所属地点" size="small">
                                        <el-input v-model="form_info.addr"  @focus='getAddr'></el-input>
                                    </el-form-item>
                                </el-col>
                        </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="测点信息" v-if='!inputDisabled' name="second">
                        <div class="loncom_public_tabbox loncom_public_tabbox1">
                            <div class="loncom_equipment_addelibrary loncom_public_table loncom_public_tabboxcon1">
                                <div class="loncom_mb10 loncom_overflow_hidden">
                                    <el-upload
                                        class="loncom_fl"
                                        action

                                        multiple
                                        :before-upload="beforeUpload"
                                        :limit="1">
                                        <el-button size="mini">导入测点</el-button>
                                    </el-upload>
                                    <el-button size="small" class="loncom_fr" @click="downTem">下载模板</el-button>
                                </div>
                                <el-scrollbar class="loncom_scrollbar" style="height:186px">
                                <el-search-table-pagination type="local" :show-pagination="true" border 
                                :data="table_info" :columns="table_info_columns" >
                                    <template slot-scope="scope" slot="preview-datachar">

                                        <el-select v-model='scope.row.datachar'>
                                            <el-option value='Analogy' label='数值'></el-option>
                                            <el-option value='Digital' label='状态'></el-option>
                                            <el-option value='CommStatus' label='通讯'></el-option>
                                            <el-option value='Control' label='控制'></el-option>
                                        </el-select>
                                        <!-- <span v-if="scope.row.datachar=='Analogy'">
                                            数字
                                        </span>
                                        <span v-else-if="scope.row.datachar=='Digital'">
                                            状态
                                        </span>
                                        <span v-else-if="scope.row.datachar=='CommStatus'">
                                            通讯
                                        </span>
                                            <span v-else-if="scope.row.datachar=='Control'">
                                            控制
                                        </span> -->
                                    </template>
                                    <template slot-scope="scope" slot="preview-ch">
                                        <el-input v-model='scope.row.ch'></el-input>
                                    </template>
                                    <template slot-scope="scope" slot="preview-report">
                                        <span style="height:40px">
                                            <el-switch
                                                style="display: block"
                                                v-model="scope.row.report"
                                                active-color="#13ce66"
                                                inactive-color="#ff4949"
                                                active-value="1"
                                                inactive-value="0"
                                                active-text="是"
                                                inactive-text="否">
                                            </el-switch>
                                        </span>
                                    </template>
                                    <!-- <template slot-scope="scope" slot="preview-alarm">
                                        <span @click="alarmDeploy(scope.row)" class="loncom_pointer">
                                            配置
                                        </span>
                                    </template>
                                    <template slot-scope="scope" slot="preview-store">
                                        <span @click="storeDeploy(scope.row)" class="loncom_pointer">
                                            配置
                                        </span>
                                    </template> -->
                                    <template slot-scope="scope" slot="preview-state">
                                        <span style="height:40px">
                                            <el-switch
                                                style="display: block"
                                                v-model="scope.row.enablekpi"
                                                active-color="#13ce66"
                                                inactive-color="#ff4949"
                                                active-value="1"
                                                inactive-value="0"
                                                active-text="是"
                                                inactive-text="否">
                                            </el-switch>
                                        </span>
                                    </template>
                                    <template slot-scope="scope" slot="preview-signal">
                                        <span>
                                            <el-input size="small" v-model="scope.row.signal_group"></el-input>
                                        </span>
                                    </template>
                                    <template slot-scope="scope" slot="preview-target">
                                        <span>
                                            <el-input size="small" v-model="scope.row.indicator_group"></el-input>
                                        </span>
                                    </template>
                                </el-search-table-pagination>
                              </el-scrollbar>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            </div>
       
     
        <dialogBtnInfo v-bind:dialogInfobtn="dialogInfo" v-on:dialogSure="dialogSure('formInfo')"></dialogBtnInfo>
        <Addr v-bind:dialogInfo='getInfo' v-if='getInfo.visible'></Addr> 
        <temp :dialogInfo="temp_info" v-if="temp_info.visible"></temp>
    </el-dialog>
     
</template>


<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
import Addr from './sconfig_scsi_get_zutai.vue'
import temp from './point_template.vue'
var axios = require('axios')
export default {

  created () {
    this.editInit();
   // var obj = this.$route.query;
   //  if(JSON.stringify(obj) == "{}"){
   //      this.topInfo="添加设备库";
   //  }else{
   //      this.topInfo="编辑设备库";
   //      this.activeBtn=true;
   //      console.log(obj);
   //      this.$api.get('/templte/query_details', {"id":obj.id}, r => {
   //          console.log(r)
   //          if(r.err_code=="0"){
   //              this.elibrary_info.templatename=r.data.templatelist[0].templatename;
   //              this.elibrary_info.explain=r.data.templatelist[0].explain;
   //              this.elibrary_info.com=r.data.templatelist[0].com;
   //              this.elibrary_info.name=r.data.templatelist[0].brandname;
   //              this.elibrary_info.serierl_code=r.data.templatelist[0].brandser;
   //              this.elibrary_info.label=r.data.templatelist[0].label;
   //              this.elibrary_info.brandid=r.data.templatelist[0].brandid;
   //              this.elibrary_info.label=r.data.templatelist[0].brandlabel;
   //              this.classifyInfo.data.push({id:r.data.templatelist[0].devtype,label:r.data.templatelist[0].mgname});
   //              this.uiTemplateInfo.data.push({id:r.data.templatelist[0].htmlurl,label:r.data.templatelist[0].htmlname})
   //              this.id=obj.id;

   //              this.table_info=r.data.templatedevvoulist;

   //          }else{
   //              this.$message({
   //                  message: "获取信息失败",
   //                  type: 'warning'
   //              });
   //          }
   //      });
        //获取到的赋给 elibrary_info  字段根据后台需求匹配正确
    //
  },
  mounted() {
    scrollCon();

    tabScroll("0");
    tabScroll("1");
  },
   data() {
        var comsetValit = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入通讯参数'));
        } else {
        
            if(this.form_info.comsetting === this.oldComsetting){
              this.form_info.comsetting = this.oldComsetting;
              callback();
              return;
            }
            this.$api.post('/Dev/portisbl',{comsetting:this.form_info.comsetting}, r => {
                 console.log(r);
                
                 if(r.err_code=="0"){
                    if(r.data === "true"){
                        this.form_info.comsetting  = this.form_info.comsetting;
                        callback();

                    }else{
                        callback("通讯参数已被使用！");
                       // this.form_info.comSetting = '';
                    }
                    // this.form_info.comSetting=r.data.devvou;
                    // this.point_devhead=r.data.devhead[0];
                 }
            });
          
        }
      };
       return {
           id:'',  ///编辑id
           //新增编辑控制器头部显示
           topInfo:'',
           oldComsetting:'',//编辑状态下的初始通讯参数
           oldCom:'',//编辑下的通讯协议
           formRules:{
                comBef:[
                    { required: true, message: '请选择协议类型', trigger: 'blur' },
                ],
                comsetting:[
                    { required: true,validator:comsetValit, trigger: 'blur' },
                ],
                devname:[
                    { required: true, message: '请填写设备名称', trigger: 'blur' },
                ],
                addr:[
                    { required: true, message: '请选择所属地点', trigger: 'change' },
                ],
                // label:[
                //     { required: true, message: '请选择标签', trigger: 'blur' },
                // ],
                // templatename:[
                //     { required: true, message: '请填写模板名称', trigger: 'blur' },
                // ],
                // ui_template:[
                //     { required: true, message: '请选择界面模板', trigger: 'blur' },
                // ]
           },
           //新增设备编辑设备显示不同的按钮信息
           activeBtn:false,
           inputDisabled:false,
           ActiveName: 'first',  //选项卡头部切换信息
           //总线类型
           trunkOptions:[
                {id:'MODBUS_COM',name:'MODBUS_COM'},
                {id:'MODBUS_TCP',name:'MODBUS_TCP'},
                {id:'SNMP',name:'SNMP'},
           ],
           //品牌型号
           brandOptions:[],
           //测点信息table
           form_info:{
                devname:'',
                com:'',
                comsetting:'',
                comBef:'TCPSRV',
                addr:'',
                addrid:'',
                agentbm:"3",
                state:"1",
                txend:"<JBUS>", 
               datatype:"HEX",
               init:"01"
                // {datachar:'模拟量',ch:'A相电压',unit:'V',state:'1',alarm:'配置',store:'配置',signal_group:'',indicator_group:''},
                // {datachar:'模拟量',ch:'A相电压',unit:'V',state:'0',alarm:'配置',store:'配置',signal_group:'',indicator_group:''},
            },
            table_info:[],
            table_info_columns:[
                { prop: 'datachar', label: '类型',minWidth:100,slotName:'preview-datachar'},
                { prop: 'ch', label: '测点名称',minWidth:100,slotName:'preview-ch'},

                { prop: 'state', label: '是否启用',minWidth:100,slotName:'preview-state'},
                { prop: 'report', label: '是否存储报表',minWidth:100,slotName:'preview-report'},
                // { prop: 'store', label: '存储参数',slotName:'preview-store'},
                // { prop: 'signal_group', label: '信号分组',slotName:'preview-signal'},
                // { prop: 'indicator_group', label: '指标分组',slotName:'preview-target'},
            ],
            //编辑设备分类的弹窗
            //导入测点时的devhead信息,templateDev用的
            point_devhead:{},
            getInfo:{
                visible:false,
                type:'device',
                data:[],
            },
            temp_info:{
                visible:false
            },


       }
   },
   methods:{
       //  下载模板
       downTem:function(){
           this.temp_info.visible=true;
       },
     editInit:function(){

       if(this.dialogInfo.data.devname){
        this.inputDisabled = true;
        this.oldComsetting = this.dialogInfo.data.comsetting;
        this.oldCom = this.dialogInfo.data.com;
        this.form_info.devname = this.dialogInfo.data.devname;
        this.form_info.com = this.dialogInfo.data.com;
        this.form_info.comsetting = this.dialogInfo.data.comsetting;
        this.form_info.addrid = this.dialogInfo.data.addrid;
        this.form_info.addr = this.dialogInfo.data.addr;
       } 
    },//编辑进来
    comsetRule:function(){
        if(this.form_info.comsetting){
            this.$api.post('/Dev/portisbl',{comsetting:this.form_info.comsetting}, r => {
                 console.log(r);
                
                 if(r.err_code=="0"){
                    if(r.data === "true"){
                        this.form_info.comsetting  = this.form_info.comsetting;
                    }else{
                        this.form_info.comsetting = '';
                    }
                    // this.form_info.comSetting=r.data.devvou;
                    // this.point_devhead=r.data.devhead[0];
                 }
            });
        }
    },
        //获取地点树形
        getAddr:function(){
 
            this.getInfo.visible=true;
             this.getInfo.title="选择设备所属地点";
            if(this.form_info.addrid){
            this.getInfo.data  = [{id:this.form_info.addrid,label:this.form_info.addr}];
                }
            //.getInfo.type = 'device'
            //this.getInfo.id=this.form_info.orid;
        
        },
       //编辑设备分类
       editClassify:function(){
            this.classifyInfo.visible=true;
       },
       //选择界面模板
       selectUiTemplate:function(){
           this.uiTemplateInfo.visible=true;
       },
       //导入测点
       beforeUpload:function(file){
            let _this = this;
           let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }; //添加请求头
         
            let fd = new FormData();
            fd.append('file', file)
            fd.append('headers', config)
            // $.ajax({
            //     url:,
            // })
            // hits.$api.post(,, r => {
            //      console.log(r);
            //      debugger;
            //      if(r.err_code=="0"){
            //         this.table_info=r.data.devvou;
            //         this.point_devhead=r.data.devhead[0];
            //      }
            // });
            axios({
    method: "POST",
    url: '/upload/xls',
    data: fd,
    headers: {'Content-Type':'multipart/form-data'},
    baseURL: rootUrl,
    withCredentials: true
  })
  .then(function (res) {
    if(res.data.err_code=="-1"){
        ElementUI.Message.warning("请登录系统");
        router.push({path:'/login'});
        if(sessionStorage.loginInfo){
          sessionStorage.removeItem('loginInfo');
        }
    }else if(res.data.err_code=="0"){
        _this.table_info=res.data.data.devvou;
      //  _this.point_devhead=res.data.devhead[0];
}
    
    
  })
       },
       //配置告警参数
       alarmDeploy:function(row){
           console.log(row)
           console.log(this.table_info)
            this.deployAlarmInfo.visible=true;
            this.deployAlarmInfo.data=row;
            this.deployAlarmInfo.datas=Object.assign({}, row);
       },
       //配置存储参数
       storeDeploy:function(row){
        console.log(row)
            this.deployStoreInfo.visible=true;
            this.deployStoreInfo.data=row;
       },
       //验证协议
       isCom:function(callback){
            var _this = this;
            var com = "";
            if (this && this._isDestroyed) {return}
            if(!this.form_info.com){
                    com = this.form_info.comBef+'_'+ Math.round(Math.random()*1000);
                    this.$api.post('/Dev/comisbl',{com:com}, r => {
                       
                         if(r.err_code=="0"){
                            if(r.data === "true"){
                                _this.form_info.com  = com;
                                callback();
                            }else{
                                this.form_info.com = "";
                                _this.isCom(callback);

                            }
                        }
                    })
            }else{
                if(this.oldCom === this.form_info.com){
                    callback();
                }
            }
       },
       //提交数据
       submitBtn:function(){
        var postUrl ='/Dev/add';
        var titleStr= '新增设备成功！';
             if(this.inputDisabled){
              postUrl  = '/Dev/update';
              titleStr= '编辑设备成功！';
             }
            this.$api.post(postUrl,{model:{itme:this.table_info,obj:this.form_info}},r =>{
                if(r.err_code == '0'){
                    if(r.data ==="true"){
                    this.dialogInfo.successState = true;
                    this.dialogInfo.visible = false;
                     this.$message.success(titleStr);
                   }
                }else{
                    this.$message.warning(r.err_msg);
                }
            })
            
       },
       //新增
        dialogSure:function(formName){
            var _this = this;
           
            this.$refs[formName].validate((valid) => {
                if(valid){
                    if(!this.inputDisabled){
                       if(this.table_info.length==0){
                           this.$message.warning("请导入测点");
                       } else{
                           _this.isCom(_this.submitBtn);
                       }
                    }else{
                        _this.isCom(_this.submitBtn);
                    }
                     
                    //_this.isCom(_this.submitBtn);
                    // this.form_info.comSetting=r.data.devvou;
                    // this.point_devhead=r.data.devhead[0];
                 }
            });
        
                   
        },
        //放弃编辑
        giveUp:function(){
            this.$router.push({path:'/loncom/equipment'});
        }

   },
   watch:{
        'getInfo.data':{
            handler:function(val,oldval){
                this.form_info.addrid=val[0].id;
                this.form_info.addr=val[0].label;
            },
            deep: true
        },
        //监听界面模板变化
        'uiTemplateInfo.data':function(val,oldval){
            this.elibrary_info.ui_template=val[0].label;
        },
   },
    props:["dialogInfo"],
    components:{dialogBtnInfo,Addr,temp}
}
</script>