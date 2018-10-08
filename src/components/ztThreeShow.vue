
<template>

    <div :style='{
            width:dialogInfo.json.pic_size.width+"px",
            height:dialogInfo.json.pic_size.height+"px",
            left:dialogInfo.json.pic_offset.offsetX+"px",
            top:dialogInfo.json.pic_offset.offsetY+"px"}'
        class="loncom_canvas_smallimg ">
        <el-tooltip placement="top" effect="light" :disabled="true">
        <img
        :data-setting='dialogInfo.setting'
        :data-type="dialogInfo.type"

        :id='dialogInfo.json.id||dialogInfo.id'
        :src="dialogInfo.json.imgUrl||dialogInfo.imgUrl"
        :ref='dialogInfo.json.id||dialogInfo.id'
        draggable="true" @dragstart="drag($event)" @click="showDetail" @dblclick="showGoHref"
        >
        <div slot="content"  style="width: 200px;"><p v-for="item in dialogInfo.json.data"><span>{{item.ch}}</span><span style="color:#09c;margin-left:20px;">{{item.value+item.unit}}</span></p></div>
        </el-tooltip>
      <div class="loncom_dialog_con" v-if="dialogState" v-bind:style="{top: dialogTop+'px',left:dialogLeft+'px',textAlign:'center'}">
        <i id="dialogClose" @click="closeDialog" class="el-icon-close" style="cursor:pointer;color:#fff;position: absolute;top:2px;right:2px;"></i>
        <div class="loncom_map_boxtop" style="color:#fff;background: #4889E9;border: 0;padding:0 20px;text-align: left;">
          <i style="margin:0 5px 0 10px;" class="fa fa-wifi"></i><span>{{info.p_name}}<em class="showAlarm" @click="showAlarm()" style="font-size:12px;margin-left:5px;cursor:pointer;">详情</em></span>
        </div>
        <div class="loncom_map_boxinfo" style="color:#fff;padding:0 10px;background: #4889E9;" v-if="info.fish.length>0">

          <div class="img"><img :src="'static/upload/'+info.fish[0].imgurl" style="width:100%;height:80px;"></div>
          <div class="info" style="width:calc(100% - 120px)">
            <p style="margin:10px 0">生物品种：<span>{{info.fish[0].fingername}}</span></p>
            <p style="margin:10px 0">池塘面积：<span>{{info.farea}}㎡</span></p>
          </div>
        </div>
        <div class="loncom_map_boxinfo" style="height:150px;background: #efefef;color:#333;padding:20px 0;">
          <div class="info_left" style="border-right:2px solid #ddd" >
            <div class="info_four" v-for="item in state">
              <p>
                <span class="info_value" v-if="item.data.alarm>0" style="color:#f00">{{item.data.value}}{{item.unit}}</span>
                <span class="info_value" v-else>{{item.data.value}}{{item.unit}}</span>
              </p>
              <p>{{item.title}}</p>
            </div>
          </div>
          <div class="info_right">
            <div class="loncom_map_boxconb_infovideo" style="text-align: center;"><img src="static/zutai/images/shiping.png" @click="enterVideo" style="width:60%;margin-top:20%;" ></div>
          </div>
        </div>
      </div>
    </div>
</template>
<style>

  .loncom_canvas_smallimg .loncom_map_boxtop {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #12AE67;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #fff;
  }
  .loncom_canvas_smallimg .loncom_dialog_con{
    width:320px;
    padding:0;
    position:absolute;
    z-index:1000;

  }
  .loncom_canvas_smallimg .loncom_map_boxinfo {
    width: 100%;
    height: 100px;
    background: #12AE67;
    padding: 10px;
    color: #fff;
    font-size: 12px;
    line-height: 25px;
  }
  .loncom_canvas_smallimg .loncom_map_boxinfo .img{
    width: 120px;
    height:80px;
    float:left;
  }

  .loncom_canvas_smallimg .info_four{
    width:50%;
    float:left;

  }
  .loncom_canvas_smallimg .info_four .info_value{
    font-size:18px;
  }
  .loncom_canvas_smallimg .img,.loncom_canvas_smallimg .info{
    float:left;
  }
  .loncom_canvas_smallimg .img{
    width:120px;
  }
  .loncom_canvas_smallimg .info_four p{
    line-height:1.5;
  }
  .loncom_canvas_smallimg .info_left{
    width:70%;
    float:left;
  }
  .loncom_canvas_smallimg .info_left .info_four:nth-child(1),.loncom_canvas_smallimg .info_left .info_four:nth-child(2){
    margin-bottom:15px;
  }
  .loncom_canvas_smallimg .info_right{
    width:30%;
    float:right;

  }
</style>

<script>
  const axios = require('axios')
export default {
    created () {
 
    },
    mounted() {

        var _this=this;
        $("#canvas").resize(function () {
            _this.init();
            _this.initDevice();
        });
        
        this.init();
     this.getConfig();
    },
    data() {
       return {
            //video弹窗
            videoInfo:{
                title:'门禁详情',
                visible:false,
                width:"800px",
                data:{},
            },
         state:[],
          dialogState:false,
         dialogTop:0,
         dialogLeft:0,
         info:{
           p_name:'',
           p_img:'',
           farea:'',
           fish:[
             {}
           ],
           temp:'',
           DO:'',
           PH:'',
           NH:''
         },
         showInfo:{
           title:"视频预览",
           visible:false,
           row:{},
           data:[],
         },

       }
   },
    methods:{
        //改变浏览器用到的信息
        init:function(){
            this.$emit('init',this);
            this.initDevice();
        },
       showGoHref:function(){
        console.log('goHref'+this.dialogInfo.json.goHref)
        if(this.dialogInfo.json.goHref && this.dialogInfo.json.goHref.id){
           this.$parent.$parent.ztshow = this.dialogInfo.json.goHref;
         }else{
          return;
         }
      //   //  this.$route.push({path:'/index',query:})
       },
      getConfig:function(){
        axios.get('static/zutai/config/gis.json').then(r=>{

          if(r.status==200){

            this.state=r.data[0];
          }else{
            this.$message.warning("配置文件读取失败");
          }
        });
      },
      closeDialog(){
        this.dialogState = false;
      },
      showDetail:function() {
    
        if(this.dialogInfo.json.dataSource.type !=3){
            return;
        }
        this.$parent.$children.map((item,i)=>{
          item.dialogState =false;
        })
       // $(".loncom_dialog_con").hide();.map((item,i)=>{
        //   item.dialogState = false;
        // })
        // console.log( this.$parent.three_list);
        // console.log(this.dialogInfo)

        if(event.target.offsetTop>300){
          this.dialogTop = event.target.offsetTop-300;
          this.dialogLeft = event.target.offsetLeft;
        }else{
          this.dialogTop = event.target.offsetTop+20;
          this.dialogLeft = event.target.offsetLeft;
        }
        const _this = this;
        const id = this.dialogInfo.json.dataSource.id;
        if(!id){
          return;
        }
        this.$api.post('/scinfo/details', {addrid: id}, r => {

          if (r.err_code == "0") {

            _this.dialogState = true;
            _this.info.p_name = r.data.fname;
            _this.info.farea = r.data.farea;
            _this.info.fish = r.data.item;
            _this.addrId = r.data.fworkshop;
            var arr=[];
            for(var i=0;i<_this.state.length;i++){
              arr.push(_this.state[i].pointid);
            }
            this.$api.post('/gis/querydevvalue', {pointid:arr.toString(),addrid:_this.addrId}, r => {

              if(r.err_code=="0"){
                for(var i=0;i<_this.state.length;i++){
                  _this.state[i].data=r.data[_this.state[i].pointid];
                }
              }else{
                this.$message.warning(r.err_msg);
              }
            });
          } else {
            _this.dialogState = false;
            this.$message.warning(r.err_msg);
          }
        });


      },
      showAlarm:function(){
        console.log()
        this.$router.push({path:'/control/scsi/detail',query:{addrid:this.addrId}});
        // $(this.$refs.gis_alarm_list).css({"bottom":"0px"});
        // this.getAlarm();

      },
      // //底部获取告警
      // getAlarm:function(info){
      //   var level=info?info:"";
      //   this.$api.post('/gis/getaddridalarmall', {addrid:this.addrId,level:level}, r => {
      //     console.log(r)
      //     if(r.err_code=="0"){
      //       this.table_data=r.data;
      //     }else{
      //       this.$message.warning(r.err_msg);
      //     }
      //   });
      // },
      enterVideo:function(){
        this.$api.post('/gis/getaddridvideall', {addrid:this.addrId}, r => {
          console.log(r)
          if(r.err_code=="0"){
            if(r.data.length>0){

              this.showInfo.data=r.data;
              this.showInfo.visible=true;
            }else{
              this.$message.info("此池塘下无视频监控");
            }
          }else{
            this.$message.warning(r.err_msg);
          }
        });
      },
  //改变浏览器和初始化用
        initDevice:function(){
            var _this = this;

            var now_back={
                width: $("#canvas").width(),
                height: $("#canvas").height()
            }
             var canvas_bg_info1=getBackgroundImageSize($("#canvas"));
            var loc = nowLocation(_this.dialogInfo.json.canvas_info, _this.dialogInfo.json.pic_offset,canvas_bg_info1,now_back,_this.dialogInfo.json.pic_size);
            // _this.dialogInfo.width = loc.width.toFixed(2);
            //   _this.dialogInfo.height = loc.height.toFixed(2);
            $(_this.$el).css({
                "left":loc.x.toFixed(2)+"px",
                "top":loc.y.toFixed(2)+"px",
                "width":loc.width.toFixed(2)+"px",
                "height":loc.height.toFixed(2)+"px"
            });
        },
    },
    props:["dialogInfo"],
    components:{}
}
</script>




