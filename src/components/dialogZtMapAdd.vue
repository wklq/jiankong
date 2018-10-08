<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" :width="dialogInfo.width" @before-close="closeDialog">
        <div class="loncom_public_table loncom_dialog_scroll" style="height:300px;">
            <el-form :model="map_list" :rules="formRules" ref="formInfo">
                <div class="loncom_list_boxform">
                    <div class="loncom_list_box_left">
                        <em>*</em>模板名称
                    </div>
                    <div class="loncom_list_box_right">
                        <el-form-item prop="name">
                            <el-input size="small" v-model="map_list.name"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <!--<div class="loncom_list_boxform">-->
                    <!--<div class="loncom_list_box_left">-->
                        <!--<em>*</em>站点-->
                    <!--</div>-->
                    <!--<div class="loncom_list_box_right">-->
                        <!--<el-form-item prop="addr">-->
                            <!--<el-select v-model="map_list.addrid" placeholder="请选择">-->
                                <!--<el-option-->
                                <!--v-for="item in addr_info"-->
                                <!--:key="item.value"-->
                                <!--:label="item.label"-->
                                <!--:value="item.value">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</el-form-item>-->
                    <!--</div>-->
                <!--</div>-->
                <div class="loncom_list_boxform">
                    <div class="loncom_list_box_left">
                        详情
                    </div>
                    <div class="loncom_list_box_right">
                        <textarea style="height: 100px;" placeholder="请输入内容" v-model="map_list.descr"> </textarea>
                    </div>
                </div>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCancel">取 消</el-button>
            <el-button type="primary" @click="dialogSure('formInfo')">保 存</el-button>
        </div>
    </el-dialog>
</template>
<style>
  .loncom_public_table{
    padding: 20px 20px 0 20px;
    height: auto;
    width: 100%;
  }
  .loncom_list_box{
    width: 100%;
    min-height: 32px;
    line-height: 32px;
    margin-bottom: 15px;
    font-size: 12px;
  }
  .loncom_list_boxform{
    width: 100%;
    min-height: 32px;
    line-height: 32px;
    padding-bottom: 20px;
    font-size: 12px;
    overflow: hidden;
  }
  .loncom_list_box_left{
    width: 18%;
    margin-right: 2%;
    float: left;
    color: #666;
    text-align: right;
  }
  .loncom_list_box_left em {
    color: #fb0101;
    margin-right: 5px;
  }
  .loncom_list_box_right {
    width: 80%;
    float: left;
    color: #666;
  }
  .loncom_list_box_rightform{
    width: 80%;
    float: left;
    color: #666;
    padding-right: 130px;
  }
  .loncom_list_box_info{
    color: #999;
  }
  .loncom_list_box_right .loncom_public_check,.loncom_list_box_right .loncom_public_radio{
    margin: 9px 5px 0 0;
  }
  /*勾选框*/
  .loncom_public_check_input, .loncom_public_radio_input{
    display:none;
  }
  .loncom_public_check_input+label {
    border: 1px solid #b3b3b3;
    width: 12px;
    height: 12px;
    display: block;
    position: relative;
    margin: 0;
    line-height: 14px;
    text-align: center;
    float:left;
  }
  .loncom_public_check_input:checked+label:after {
    content: '\2714';
    font-size: 12px;
    width: 14px;
    height: 14px;
    background: #409eff;
    position: absolute;
    top: -1px;
    left: -1px;
    color: #fff;
  }
  .loncom_public_radio_input+label{
    border: 1px solid #b3b3b3;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: block;
    position: relative;
    margin: 0;
  }
  .loncom_public_radio_input:checked+label{
    border-color: #409eff;
  }
  .loncom_public_radio_input:checked+label:after{
    content: "";
    width: 8px;
    height: 8px;
    background: #409eff;
    position: absolute;
    border-radius: 50%;
    top: 50%;
    margin-top: -4px;
    left: 50%;
    margin-left: -4px;
  }
</style>
<script>

export default {
    created () {
      this.map_list = this.dialog_info.data;
    },
    mounted() {

    },
    data() {
        return {
            dialog_info:this.dialogInfo,
            map_list:{},
            formRules:{
                name:[
                    { required: true, message: '请填写模板名称', trigger: 'blur' },
                ],
                addrid:[
                    { required: true, message: '请选择站点', trigger: 'blur' },
                ]
            },
            // addr_info:[
            //     {
            //     value: '数据机房',
            //     label: '数据机房'
            //     }, {
            //     value: '数据机房1',
            //     label: '数据机房1'
            //     },
            // ],

        }
    },
    methods:{
        //保存的操作
        dialogSure:function(formName){
            this.$refs[formName].validate((valid) => {
              const _this = this;
              let postUrl ='/Template/Add';
                if(valid){ //验证通过
                    this.dialogInfo.visible=false;
                  let postData = {obj:
                      {name:_this.map_list.name,addrid:_this.map_list.addrid,descr:_this.map_list.descr}};

                   if(this.dialogInfo.type=="edit"){
                     postUrl = '/Template/update';
                     postData.obj.id=this.map_list.id;
                   }
                  //
                  //   this.$parent.map_list.splice(this.dialogInfo.index,1,this.map_list);
                  //   var mapInfo=JSON.parse(localStorage.mapInfo);
                  //   mapInfo.map_list[this.dialogInfo.index].name=this.map_list.name;
                  //   mapInfo.map_list[this.dialogInfo.index].addr=this.map_list.addr;
                  //   mapInfo.map_list[this.dialogInfo.index].descriotion=this.map_list.descriotion;
                  //   localStorage.mapInfo = JSON.stringify(mapInfo);
                  // }else {
                  //
                  //   this.$parent.map_list.push(this.map_list);
                  //   var list = this.map_list;
                  //   list.img = '';
                  //   list.jsonArr = [];
                  //   var mapInfo = JSON.parse(localStorage.mapInfo);
                  //   mapInfo.map_list.push(list);
                  //   localStorage.mapInfo = JSON.stringify(mapInfo);
                  //
                  // }
                  this.$api.post(postUrl, {model:postData}, r => {
                    if(r.err_code=="0"){
                      this.$emit('getMap');  //如果有参数带
                      this.map_list={};
                      this.dialogInfo.data={};
                    }else{
                      this.$message.warning(r.err_msg);
                    }
                  });

                  this.map_list={};
                    this.dialogInfo.data={};
                }
            })
        },
        //取消操作
        dialogCancel:function(){
            this.map_list={};
            this.dialogInfo.data={};
            this.dialogInfo.visible=false;
        },
        //关闭dialog
        closeDialog:function(){
            this.map_list={};
            this.dialogInfo.data={};
        },


    },

    watch:{
        'dialog_info.data':function(val,oldVal){
            this.map_list=val;
        }
    },
    props:["dialogInfo"]
}
</script>

