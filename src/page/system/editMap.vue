<template>
<div class="loncom_content" style="position: relative">
      <div class="loncom_content" ref="loncom_zt_content">
        <div class="loncom_sidebar loncom_zt_sidebar" ref="sidebar">
          <el-tabs v-model="activeName">
            <el-tab-pane label="设备素材" name="first" class="el-tab-pane0">
              <div class="loncom_zt_edititem loncom_zt_sidebarcon0">
                <el-collapse v-model="activeItem" accordion>
                  <!--<el-collapse-item title="视频" name="first">-->
                  <!--<div class="loncom_zt_sidebarcon loncom_zt_item">-->
                  <!--<span v-for="item in video_list">-->
                  <!--<img data-setting='item.setting' :data-type="item.type" :data-devid="item.devid" :id='item.id' :src="item.img" draggable="true" @dragstart="drag($event)":data-setting='item.setting' :data-type="item.type" :data-devid="item.devid" :id='item.id' :src="item.img" draggable="true" @dragstart="drag($event)">-->
                  <!--</span>-->
                  <!--</div>-->
                  <!--</el-collapse-item>-->
                  <!--<el-collapse-item title="门禁" name="second">-->
                  <!--<div class="loncom_zt_sidebarcon loncom_zt_item">-->
                  <!--<span v-for="item in access_list">-->
                  <!--<img :data-setting='item.setting' :data-type="item.type" :data-devid="item.devid" :id='item.id' :src="item.img" draggable="true" @dragstart="drag($event)">-->
                  <!--</span>-->
                  <!--</div>-->
                  <!--</el-collapse-item>-->
                  <el-collapse-item class="loncom_zt_sidebarcon loncom_zt_item" title="组态图元">
                           <span style="margin-top:15px;">
                             <img  data-type="three"  src="static/zutai/images/pin.png" draggable="true" @dragstart="drag($event)" >
                           </span>
                  </el-collapse-item>
                </el-collapse>
              </div>

            </el-tab-pane>
          </el-tabs>
          <span class="loncom_zt_sidebar_btn" @click="navclick" ref="navbtnspan"><i class="fa fa-chevron-left" ref="navbtn"></i></span>

        </div>
        <div class="loncom_sidebar_right loncom_zt_edit_right" ref="content" style="margin-left:225px;">
          <div class="loncom_public_top loncom_ztright_top" style="width:100%;" ref="ztright">
            <div class="loncom_fr loncom_zt_editmap_btn">
              <el-tooltip class="item" content="返回" placement="top-end">
                <span @click="backPage"><i class="fa fa-chevron-left"></i></span>
              </el-tooltip>
              <!--<el-tooltip class="item" content="撤销(Ctrl+z)" placement="top-end">-->
                <!--<span @click="backout"><i class="fa fa-mail-reply"></i></span>-->
              <!--</el-tooltip>-->
              <!--<el-tooltip class="item" content="反撤销(Ctrl+y)" placement="top-end">-->
                <!--<span @click="returnBackout"><i class="fa fa-mail-forward"></i></span>-->
              <!--</el-tooltip>-->
              <el-tooltip class="item" content="删除控件(Delete)" placement="top-end">
                <span @click="removeDevice"><i class="fa fa-remove"></i></span>
              </el-tooltip>
              <el-tooltip class="item" content="保存操作(Ctrl+s)" placement="top-end">
                <span @click="saveDevice"><i class="fa fa-save"></i></span>
              </el-tooltip>
              <el-tooltip class="item" content="上传背景图" placement="top-end">
                <span @click="uploadImg"><i class="fa fa-cloud-upload"></i></span>
              </el-tooltip>
              <el-tooltip class="item" content="全屏预览" placement="top-end">
                <span @click="fullScreen" ><i class="fa fa-arrows-alt"></i></span>
              </el-tooltip>

            </div>
          </div>
          <div class="loncom_zt_backFull" ref="backFull" @click="backFullScreen"><el-button type="primary">退出全屏</el-button></div>
          <div id="canvas" ref="canvas" @click="hideDevice" class="loncom_zt_canvas loncom_zt_canvasedit"  @drop='drop($event)' @touchstart='drop($event)'  @dragover='allowDrop($event)' :style='{background:"url(static/upload/"+canvas_img+") center center / contain no-repeat"}'>
            <!--拖拽的设备详情-->
            <div class="device_detail loncom_zt_edititem loncom_public_tabbox1" ref="deviceShowDetail" @click="preventClick($event)">
              <div class="loncom_public_tabboxcon1">
              <el-form ref="form" :model="form" label-width="72px" >
                <el-collapse v-model="focusItem" accordion >
                  <el-collapse-item title="属性" name="first" >
                      <div class="device_detail_con " >

                      <el-form-item label="正常图片">
                        <el-upload
                          action="/iSmacSite/ismacsite/upload"
                          :on-remove="handleRemove.bind(this,'normal')"
                          :file-list="form.normalImg"
                          :on-change="handleChange.bind(this,'normal')"
                          :on-success="handlesuccess.bind(this,'normal')"
                          :limit="1"
                          list-type="picture">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                      </el-form-item>
                      <el-form-item label="告警图片">
                        <el-upload
                          action="/iSmacSite/ismacsite/upload"
                          :on-remove="handleRemove"
                          :file-list="form.alarmImg"
                          :on-success="handlesuccess.bind(this,'normal')"
                          :auto-upload="false"
                          :limit="1"
                          list-type="picture">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                      </el-form-item>
                      <el-form-item label="失联图片">
                        <el-upload
                          action="/iSmacSite/ismacsite/upload"
                          :on-remove="handleRemove"
                          :file-list="form.lostImg"
                          :auto-upload="false"
                          :on-success="handlesuccess.bind(this,'normal')"
                          :limit="1"
                          list-type="picture">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                      </el-form-item>
                      <el-form-item label="名称" class="loncom_mt20">
                        <el-input v-model="form.title" size="small"></el-input>
                      </el-form-item>
                      <el-form-item label="宽" class="loncom_mt20">
                        <el-input v-model="form.width" size="small"></el-input>
                      </el-form-item>
                      <el-form-item label="高" class="loncom_mt20">
                        <el-input v-model="form.height" size="small"></el-input>
                      </el-form-item>

                      <!--<el-form-item label="活动告警" class="loncom_mt20">-->
                      <!--<el-switch v-model="form.hisalarm"></el-switch>-->
                      <!--</el-form-item>-->
                      <!--<el-form-item label="告警设置" size="small" class="loncom_mt20">-->
                      <!--<el-color-picker v-model="form.color4"></el-color-picker>-->
                      <!--<el-color-picker v-model="form.color3"></el-color-picker>-->
                      <!--<el-color-picker v-model="form.color2"></el-color-picker>-->
                      <!--<el-color-picker v-model="form.color1"></el-color-picker>-->
                      <!--</el-form-item>-->



                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="数据" name="two">



                      <div class="device_detail_con loncom_public_tabbox1">
                      <el-form-item label="下穿页面" class="loncom_mt20">
                        <el-select  v-model="form.goHref.id" placeholder="选择站点地图" size="small">
                          <el-option v-for="item in map_list" :key="item.name" :label="item.name" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="绑定类型" class="loncom_mt20">
                        <el-radio-group v-model="form.dataType">
                          <el-radio label="0">地点</el-radio>
                         <!--  <el-radio label="1">设备点位</el-radio> -->
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="数据源" class="loncom_mt20">
                        <el-input v-model="form.dataSource.name" :title ="form.dataSource.name" placeholder="请选择数据源" @focus="getDataSource" ></el-input>
                      </el-form-item>

                    </div>

                  </el-collapse-item>
                </el-collapse>
                <!--<div class="device_detail_title">-->
                <!--<h2>属性</h2>-->
                <!--</div>-->
                <!--<el-form-item class="loncom_mt20">-->
                <!--<el-button type="primary" @click="onSubmit">保存</el-button>-->
                <!--</el-form-item>-->
              </el-form>
              </div>
            </div>
            <!--拖拽的设备-->
            <!--<span v-for="item in video_list" v-if="item.state"><ZtDevice v-bind:dialogInfo="item" v-on:initDevice="initDevice" v-on:showDetail="showDetail"></ZtDevice></span>-->
            <!--<span v-for="item in access_list" v-if="item.state"><ZtDevice v-bind:dialogInfo="item" v-on:initDevice="initDevice" v-on:showDetail="showDetail"></ZtDevice></span>-->
            <span v-for="(item,i) in three_list" v-if="item.state"><ZtThree v-bind:dialogInfo="item" v-on:initDevice="initDevice" v-on:showDetail="showDetail" v-bind:selected = 'selected' :ref = '"zthree"+i' ></ZtThree></span>

          </div>
        </div>
        <!--上传图片-->
        <DialogZtUploadImg v-bind:dialogInfo="upload_img"></DialogZtUploadImg>
        <!--树形弹窗-->
        <GetInfo v-bind:dialogInfo="getInfo" v-if="getInfo.visible" ></GetInfo>
      </div>
</div>
</template>
<style>
.loncom_zt_edit_right{
  width:calc(100% - 225px);
}
  .loncom_zt_edit_right{
    padding-top:0;
  }
  .loncom_zt_backFull{
    display: none;
  }
  .loncom_ztright_top{
    height:65px;

  }
  .loncom_zt_edititem .el-form-item__label,.loncom_zt_edititem .el-radio__label{
    color:#fff;
  }
  .loncom_zt_edititem .el-form-item__content{
    line-height: 40px;
  }
  .loncom_zt_edititem .el-radio+.el-radio{
    margin-left:18px;
  }
</style>
<script>
import DialogZtUploadImg from '@/components/dialogZtUploadImg.vue'
import GetInfo from '@/components/sconfig_scsi_get_zutai.vue'
import ZtThree from '@/components/ztThree.vue'
import Vue from 'vue'
const axios = require('axios')
export default {
    created () {
      //登录

      //获取teplateId;
      const obj = this.$route.query;
      let _this =this;
      this.mapId =obj.index;
      //查找该id是否已经有文件
      axios.get('static/zutai/template/'+this.mapId+'/temp.json').then(r=>{
        if(r.status==200){
          _this.temJson=r.data;
          _this.canvas_img =  _this.temJson.img;
          //读取站点地图信息
          if(_this.temJson){

            const deviceInfo=_this.temJson;
            console.log(deviceInfo)
          //  _this.video_list=deviceInfo.video;
           // _this.access_list=deviceInfo.access;

          //  this.three_list = deviceInfo.three;
            if(deviceInfo.jsonArr.length>0){  //初始化时有设备
              //   hasDeviceInfo(this.video_list);
              //  hasDeviceInfo(this.access_list);
              hasDeviceInfo();
            }else{
              //  noDeviceInfo(this.video_list);
              //  noDeviceInfo(this.access_list);
            }
            _this.canvas_img=deviceInfo.img;

          }
         // this.pieArr=r.data[1];
          //this.getTop();
          //this.getAlarm();
        }else{
          _this.temJson="";
          //this.$message.warning("配置文件读取失败");
        }
      });

        //初始化侧边设备
        //var _this=this;
        function hasDeviceInfo(list){
          if(list){
            for(var i=0;i<list.length;i++){
                for(var j=0;j<_this.temJson.jsonArr.length;j++){
                    if(_this.temJson.jsonArr[j].type==list[i].type&&_this.temJson.jsonArr[j].devid==list[i].devid){
                        Vue.set(list[i],'state',true);
                        Vue.set(list[i],'json',_this.temJson.jsonArr[j].json);
                        Vue.set(list[i],'index',i);
                        _this.device_arrinfo.push(_this.temJson.jsonArr[j]);
                        _this.init_device.push(_this.temJson.jsonArr[j]);

                        break;
                    }else{
                        defaultInfo(list,i);

                    }
                }
            }
          }else{
            let map_list=_this.temJson.jsonArr;
              if(map_list.length>0) {
                // _this.canvas_img = map_lis[_this.mapIndex].img;
                for (var i = 0; i < map_list.length; i++) {
                  switch (map_list[i].type) {
                    case "three":
                      _this.three_list.push(map_list[i]);
                      break;
                  }
                }
            }
          }
        }
        function defaultInfo(list,i){
            var imgUrl='';
            switch(list[i].type){
                case "video":
                    imgUrl='static/zutai/images/video.png';
                    break;
                case "access":
                    imgUrl='static/zutai/images/access.png';
                    break;
              case 'three':
                imgUrl='static/zutai/images/pin.png';
                break;
            }
            Vue.set(list[i],'state',false);
            Vue.set(list[i],'index',i);
            Vue.set(list[i],'json',{
                name:'',img:imgUrl,dataType:0,dataSource:{name:'',id:'',type:0},goHref:{name:'',id:""},
                pic_size:{width:60,height:60},data:[],
                pic_offset:{offsetX:'',offsetY:''},
                canvas_info:{width:'',height:''},
                canvas_bg_info:{width:'',height:''}
            });
        }
        function noDeviceInfo(list){
            for(var i=0;i<list.length;i++){
                defaultInfo(list,i);
            }
        }
      const scrollHeight=  $(this.$refs.deviceShowDetail).height() - 30;
      $(this.$refs.lomTab).css({
        height:scrollHeight+"px"
      });
    },
    mounted() {
        ztTabScroll(0)
        tabScroll(1)
        $("#canvas").resize(function () {
            ztTabScroll(0)
            tabScroll(1)
        });
        var _this=this;
        document.onkeydown=function(event){
          
          if (_this && _this._isDestroyed) {return}
            var ev = event || window.event || arguments.callee.caller.arguments[0];
            if(ev){
                switch(ev.keyCode){
                    case 46 :// 点击删除
                        _this.removeDevice();
                        break;
                    case 90:
                        if(ev.ctrlKey){ //撤销 ctrl+z
                            _this.backout();
                        }
                        break;
                    case 89:
                        if(ev.ctrlKey){ //反撤销  ctrl+y
                           _this.returnBackout();
                        }
                        break;
                    case 83:
                        ev.preventDefault();

                        if(ev.ctrlKey){
                            _this.saveDevice();
                        }
                        break;
                }
            }
        }
        //canvas_info width，height，背景图片大小
        this.canvas_info.width=$("#canvas").width();
        this.canvas_info.height=$("#canvas").height();
        this.canvas_bg_info=getBackgroundImageSize($("#canvas"));
        //将初始化的设备赋不同的地址
        var _arr=[];
        for(var i=0;i<this.init_device.length;i++){
            _arr.push(JSON.parse(JSON.stringify(this.init_device[i])));
        }
        this.init_device=_arr.slice(0);


    },
    data() {
       return {
          selected:false,
           //侧边点击显示或隐藏
           navbtn:'open',
           //侧边头部切换
           activeName: 'first',
          focusItem:'first',
           //手风琴切换
           activeItem: 'first',
           //存储拖拽过来的组件
           img_html:'',
           //开始拉取的设备的offset获取,点击设备时点击的那个点相对于自己的偏移量
           img_ev:'',
           //存储编辑的那个站点地图index   存本地库测试用到的
         mapId:'',
         //读取的json文件
         temJson:'',
           //视频侧边图片
           video_list:[
                // {
                //     id:'1',name:'',img:'static/zutai/images/video.png',setting:'admin@1234',type:'video',devid:'700000105',state:false,
                //     json:{
                //         name:'',img:'static/zutai/images/video.png',tipall:'',hisalarm:false,color1:'',color2:'',color3:'',color4:'',
                //         pic_size:{width:60,height:60},
                //         pic_offset:{offsetX:'',offsetY:''}
                //     }
                // },
           ],
         three_list:[],
           //门禁侧边图片
          access_list:[],
           //图片展示
           canvas_img:'',
           //上传图片
           upload_img:{
                title:'图片上传',
                visible:false,
                width:"500px",
           },
          //树形数据源选择
         getInfo:{
           title:"选择地点信息",
           visible:false,
           id:[],
           type:'',
           data:[],

         },
           //查看设备详情
           //设备点位
         map_list:[],//站点地图
           form: {
                title: '',
                width:'',
                height:'',
                dataType:'0',
                dataSource:{name:'',id:'',type:0},
             data:[],
                lostImg:[{name:'',url:''}],
                alarmImg:[{name:'',url:''}],
                normalImg:[{name:'',url:''}],
                img:[{name: '', url:''}],
                goHref:{name:'',id:""},//下穿页面
            },
            device_show:true,  //是否可以显示侧边详情
            //保存地图上的设备信息
            device_arrinfo:[],
            //width，height，canvas大小保存的时候要存入，因为跳转到index时要用到这个参数
            canvas_info:{},
            //width,height ，背景图片大小保存的时候要存入，因为跳转到index时要用到这个参数
            canvas_bg_info:{},
            //撤销的数组，撤销将数组最后一个元素去掉，在反撤销的最后增加这个元素，每一个设备，操作都要存入撤销数组
            backoutArr:[],
            //反撤销数组，反撤销将数组最后一个元素去掉，在撤销最后增加这个元素
            returnBackoutArr:[],
            //操作的次数，退出时判断是否保存了用的
            handle_num:'',
            //操作属性，退出时判断是否保存了用的 默认保存了的
            profile_save:true,
            //保存删除的设备删除之前的状态，删除时存储
            delete_device:[],
            //保存删除的设备删除之前的状态，撤销时存储
            return_delete_device:[],
            //保存初始化时已有的设备状态
            init_device:[],

       }
   },
    methods:{
        //点击隐藏显示侧边
        navclick:function(){
            if(this.navbtn=='open'){
                $(this.$refs.sidebar).css({
                    "margin-left":"-225px",

                    "transition":"all 0.4s ease-in"
                });
                $(this.$refs.content).css({
                    "margin-left":"0",
                    'width':"100%",
                    "transition":"all 0.4s ease-in"
                });
                $(this.$refs.navbtn).addClass("fa-chevron-right");
                this.navbtn='close';
            }else{
                $(this.$refs.sidebar).css({
                    "margin-left":"0",
                    "transition":"all 0.4s ease-in"
                });
                $(this.$refs.content).css({
                    "margin-left":"225px",
                     'width':"calc(100% - 225px)",
                    "transition":"all 0.4s ease-in"
                });
                $(this.$refs.navbtn).removeClass("fa-chevron-right");
                this.navbtn='open';
            }
          
        },

        //上传图片
        uploadImg:function(){
            this.upload_img.visible=true;
        },
      //数据源属性弹窗
      getDataSource:function(){
          this.getInfo.visible = true;
          this.getInfo.type = this.form.dataType;
        
          if( this.getInfo.type == 0){
             this.getInfo.title ='选择地点';
          }else{
             this.getInfo.title ='选择设备点位';
          }
       
          
          

      },
        //全屏
        fullScreen:function(){
            $(this.$refs.sidebar).css("margin-left","-225px");
            $(this.$refs.ztright).hide(100);
            $(this.$refs.canvas).css("height",'100%');
            $(this.$refs.backFull).css("top","0");
            $(this.$refs.content).css({
                "margin-left":"0",
                'width':"100%",
                "padding-top":"0",
            });
            $(this.$refs.navbtnspan).hide(500);
          $(this.$refs.backFull).show();
        },
        //退出全屏
        backFullScreen:function(){
            $(this.$refs.sidebar).css("margin-left","0");
            $(this.$refs.ztright).show();
          $(this.$refs.canvas).css("height",'calc(100% - 65px)');
            $(this.$refs.backFull).css("top","0px");
            $(this.$refs.content).css({
                "margin-left":"225px",
                'width':'calc(100% - 225px)',
                "padding-top":"0",
            });
            $(this.$refs.navbtnspan).show();
          $(this.$refs.backFull).hide(500);
            if(this.navbtn!="open"){
                $(this.$refs.navbtn).removeClass("fa-chevron-right");
                this.navbtn='open';
            }
        },
        //返回主页面
        backPage:function(){
            if(this.handle_num!=this.backoutArr.length||!this.profile_save){
                this.$message.warning('请保存操作');
                return;
            }
            this.$router.push({path:'/system/sconfig/scsi'});
        },
        //拖拽
        drag:function(ev){
            this.img_ev=ev;
            ev.dataTransfer.setData("id",ev.target.dataset.type+new Date().getTime());
            ev.dataTransfer.setData("type",ev.target.dataset.type);
           // ev.dataTransfer.setData("devid",ev.target.dataset.devid);
        },
        allowDrop:function (ev) {
            ev.preventDefault();
        },
        drop:function(ev){
            ev.preventDefault();
            const id = ev.dataTransfer.getData("id");
            const type=ev.dataTransfer.getData("type");
            const imgUrl ='static/zutai/images/pin.png'
            if(id){  //第一次拖进来的时候赋了id的
                let list_item = {json:{pic_offset:{},pic_size:{width:30,height:30},dataType:'0',data:[],dataSource:{name:'',id:'',type: 0},goHref:{name:'',id:""},normalImg:[imgUrl],alarmImg:['static/zutai/images/pin3.png'],
                    lostImg:['static/zutai/images/pin4.png']},id:id,type:type,imgUrl:imgUrl,state:true,width:30,height:30};
                //拖拽的设备点击的那个点相对于设备自己的偏移this.img_ev.offsetX,this.img_ev.offsetY
                //拖拽的设备点击的那个点相对于右边电子地图的偏移量，拖拽后放手的那刻ev.offsetX,ev.offsetY
                if(ev.offsetX-this.img_ev.offsetX<0){
                   list_item.json.pic_offset.offsetx=0;
                }else if(ev.offsetX+(list_item.width-this.img_ev.offsetX)>$("#canvas").width()){
                   list_item.json.pic_offset.offsetX=$("#canvas").width()-list_item.width;
                }else{
                   list_item.json.pic_offset.offsetX=ev.offsetX-this.img_ev.offsetX
                }
                if(ev.offsetY-this.img_ev.offsetY<0){
                   list_item.json.pic_offset.offsetY=0;
                }else if(ev.offsetY+(list_item.height-this.img_ev.offsetY)>$("#canvas").height()){
                   list_item.json.pic_offset.offsetY=$("#canvas").height()-list_item.json.pic_offset.height;
                }else{
                   list_item.json.pic_offset.offsetY=ev.offsetY-this.img_ev.offsetY
                }
                // this.canvas_info.width=$("#canvas").width();
                // this.canvas_info.height=$("#canvas").height();
                // this.canvas_bg_info=getBackgroundImageSize($("#canvas"));
                list_item.json.canvas_info=this.canvas_info;  //canvas的width和height
                list_item.json.canvas_bg_info=this.canvas_bg_info;  //背景图片的width和heihgt
                this.three_list.push(list_item);  //存储拖拽过来的组件
              //this.device_arrinfo.push(list_item);
                var _obj=JSON.parse(JSON.stringify(list_item));
                this.backoutArr.push(_obj);  //保存操作
                //this.backoutArr[this.backoutArr.length]=obj; //保存操作

            }else{ //在地图上拖拽
                //设备图片的偏移位置//设备图片最左边离电子地图最左边的距离，最头部的距离
                if(ev.offsetX-this.img_ev.offsetX<0){ //左边拖出地图了，或者向左拖动了一点点
                    if(ev.x+this.img_ev.offsetX>this.img_ev.x){ //向左移动了一点
                        this.img_html.dialogInfo.json.pic_offset.offsetX=this.img_html.dialogInfo.json.pic_offset.offsetX-(this.img_ev.offsetX-ev.offsetX);
                    }else{
                        this.img_html.dialogInfo.json.pic_offset.offsetX=0;
                    }
                }else{ //右边拖出地图了，或者向右拖动了一点点
                    if(ev.offsetX+(this.img_html.$el.offsetWidth-this.img_ev.offsetX)>$(this.$refs.canvas).width()){
                        this.img_html.dialogInfo.json.pic_offset.offsetX=$(this.$refs.canvas).width()-this.img_html.$el.offsetWidth;
                    }else if(ev.offsetX<this.img_html.dialogInfo.json.pic_size.width){
                        this.img_html.dialogInfo.json.pic_offset.offsetX=this.img_html.dialogInfo.json.pic_offset.offsetX+(ev.offsetX-this.img_ev.offsetX);
                    }else{
                        this.img_html.dialogInfo.json.pic_offset.offsetX=ev.offsetX-this.img_ev.offsetX
                    }
                }
                if(ev.offsetY-this.img_ev.offsetY<0){ //上边拖出地图了，或者向上拖动了一点点
                    if(ev.y+this.img_ev.offsetY>this.img_ev.y){ //向上移动了一点
                        this.img_html.dialogInfo.json.pic_offset.offsetY=this.img_html.dialogInfo.json.pic_offset.offsetY-(this.img_ev.offsetY-ev.offsetY);
                    }else{
                        this.img_html.dialogInfo.json.pic_offset.offsetY=0;
                    }
                }else{ //下边拖出地图了，或者向下拖动了一点点
                    if(ev.offsetY+(this.img_html.$el.offsetHeight-this.img_ev.offsetY)>$(this.$refs.canvas).height()){
                        this.img_html.dialogInfo.json.pic_offset.offsetY=$(this.$refs.canvas).height()-this.img_html.$el.offsetHeight;
                    }else if(ev.offsetY<this.img_html.dialogInfo.json.pic_size.height){
                        this.img_html.dialogInfo.json.pic_offset.offsetY=this.img_html.dialogInfo.json.pic_offset.offsetY+(ev.offsetY-this.img_ev.offsetY);
                    }else{
                        this.img_html.dialogInfo.json.pic_offset.offsetY=ev.offsetY-this.img_ev.offsetY
                    }
                }
              for(let i = 0; i++;i<this.three_list.length){
               if(this.three_list[i].id==this.img_html.dialogInfo.id){
                 this.three_list[i] = this.img_html.dialogInfo;
               }
              }
               //保存操作
                //this.backoutArr[this.backoutArr.length]=obj; //保存操作
            }


        },
        //查看设备详情
        showDetail:function(ev){
            ev.stopPropagation();
            this.getAllMap();
        
            console.log(this.img_html)
         
            this.form.title=this.img_html.dialogInfo.json.name;
            this.form.width=this.img_html.dialogInfo.width;
            this.form.height=this.img_html.dialogInfo.height;
            this.form.dataType = this.img_html.dialogInfo.json.dataType;
            this.form.dataSource = this.img_html.dialogInfo.json.dataSource;
            this.form.goHref = this.img_html.dialogInfo.json.goHref;
            this.form.normalImg=[{url:this.img_html.dialogInfo.json.normalImg[0],name:""}];
            this.form.alarmImg=[{url:this.img_html.dialogInfo.json.alarmImg[0],name:""}];
            this.form.lostImg=[{url:this.img_html.dialogInfo.json.lostImg[0],name:""}];
            if(this.device_show){
                $(this.$refs.deviceShowDetail).css("right","0");
                this.device_show=false;
                this.selected = true;
            }
        },
        //隐藏设备详情
        hideDevice:function(){
            if(!this.device_show){
                $(this.$refs.deviceShowDetail).css("right","-250px");
                this.device_show=true;
                  this.$children.map((item,i)=>{
                  item.selected = false;
               })
            }
        },
        //阻止事件
        preventClick:function(ev){
            ev.stopPropagation();
        },
        handleRemove:function(type,file,fileList){
          let defaultUrl = 'static/zutai/images/pin.png';
          if(type ==='lost'){
            defaultUrl = 'static/zutai/images/pin3.png';
          }else if(type === 'alarm'){
            defaultUrl = 'static/zutai/images/pin4.png'
          }
          this.img_html.dialogInfo.json[type+'Img']= [defaultUrl];
        },
      handleChange:function(type,fileList,file){

        var fileArry=file[0].name.split(".");
        var fileType=fileArry[fileArry.length-1];
        if(fileType=="png"||fileType=="jpg"||fileType=="PNG"||fileType=="JPG"){
          //this.dialogImageUrl=file.url;
          file[0].name='';
          this.form[type+'Img']= [{url:file[0].url,name:''}];
          // this.imageUrlList[0].name=file.name;
          // this.imageUrlList[0].url=file.url;
        }else{
          this.$message.error("图片格式只能为jpg或png!");
        }
   }
        ,
        handlesuccess:function(type,response, file, fileList){
          if(response.err_code=="0"){

            this.form[type+'Img']=[{url:'static/zutai/upload/'+response.data,name:''}];
          }else{
            this.$message.warning(r.err_msg);
          }
        },
        //确认修改
        onSubmit:function(){
            this.$confirm('确认提交修改?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.img_html.dialogInfo.json.name=this.form.title;
                this.img_html.dialogInfo.json.pic_size.width=this.form.width;
                this.img_html.dialogInfo.json.pic_size.height=this.form.height;
                this.img_html.dialogInfo.json.color1=this.form.color1;
                this.img_html.dialogInfo.json.color2=this.form.color2;
                this.img_html.dialogInfo.json.color3=this.form.color3;
                this.img_html.dialogInfo.json.color4=this.form.color4;
                this.img_html.dialogInfo.json.hisalarm=this.form.hisalarm;
                $(this.$refs.deviceShowDetail).css("right","-250px");
                this.device_show=true;
                this.profile_save=false;

               var _obj=this.img_html;
                 _obj.dialogInfo=JSON.parse(JSON.stringify(this.img_html.dialogInfo));
                 this.initDevice(_obj);

            });
        },
        //删除设备
        removeDevice:function(){
            console.log(this.img_html)
            if(this.img_html==""){
                this.$message.warning("请选择要删除的组件!");
                return;
            }
            this.$confirm('确认删除此组件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                switch (this.img_html.dialogInfo.type){
                    case "video"://视频
                        this.deleteDevice(this.video_list,this.img_html.dialogInfo.index,'static/zutai/images/video.png');
                        break;
                    case "access"://门禁
                        this.deleteDevice(this.access_list,this.img_html.dialogInfo.index,'static/zutai/images/access.png');
                        break;
                  case "three"://门禁
                    this.deleteDevice(this.three_list,this.img_html.dialogInfo.id,'static/zutai/images/pin.png');
                    break;
                }
                for(var i=0;i<this.device_arrinfo.length;i++){
                    if(this.device_arrinfo[i].type==this.img_html.dialogInfo.type&&this.device_arrinfo[i].devid==this.img_html.dialogInfo.devid){
                        var _obj=JSON.parse(JSON.stringify(this.device_arrinfo[i]));
                        this.delete_device.push(_obj);  //保存删除的设备删除之前的状态，撤销反撤销用
                        this.device_arrinfo.splice(i,1);  //先保存在删除
                    }
                }
                $(this.$refs.deviceShowDetail).css("right","-250px");
                this.device_show=true;

            });

        },
        //第一次拖进来的时候判断是否已经存在此设备
        judge:function(list){
           list.push({state:false,json:{name:'',img:'',tipall:'',hisalarm:true,color1:'',color2:'',color3:'',color4:'',
               pic_size:{width:60,height:60},
               pic_offset:{offsetX:'',offsetY:''}}})
        },
        //删除设备的函数
        deleteDevice:function(list,id,imgUrl){
            //list[index].state=false;
            let index = 0;
            list.map((item,i)=>{
              if(item.id===id){
                index = i;
              }
            });
            list.splice(index,1);
           /* list[index].json={
                name:'',img:imgUrl,tipall:'',hisalarm:true,color1:'',color2:'',color3:'',color4:'',
                pic_size:{width:60,height:60},
                pic_offset:{offsetX:'',offsetY:''}
            }*/
            // var _obj=JSON.parse(JSON.stringify(list[index]));
            // this.backoutArr.push(_obj);  //保存操作
            // console.log(this.backoutArr)
        },
        //保存操作
        saveDevice:function(){
           // var mapInfo=JSON.parse(localStorage.mapInfo);
          let mapInfo = {};
            mapInfo.jsonArr=[];
            mapInfo.jsonArr=this.three_list;
            mapInfo.img=this.canvas_img;
            //mapInfo.map_list[this.mapIndex].canvas_info=this.canvas_info; //首页用其实只用了背景，宽高不用，宽高存jsonArr中的json中了
           // localStorage.mapInfo = JSON.stringify(mapInfo);
          //保存字符串
          this.$api.post('/Template/AddJson',{id:this.mapId,data:mapInfo}, r => {
            if(r.err_code=="0"){
             // this.map_list=r.data;
              //this.dialogInfo.data={};
              this.$message.success('保存成功');
              this.handle_num=this.backoutArr.length;
              this.profile_save=true;
            }else{
              this.$message.warning(r.err_msg);
            }
          });

        },
        //撤销
        backout:function(){
            console.log(this.backoutArr)
            console.log(this.returnBackoutArr)
            if(this.backoutArr.length>0){
                var lastObj=this.backoutArr[this.backoutArr.length-1];
                var type=lastObj.type;
                var index=lastObj.index;
                var _obj=JSON.parse(JSON.stringify(lastObj));
                if(lastObj.state){ //最后一步是移动操作
                    var arr=[];
                    for(var i=0;i<this.backoutArr.length;i++){
                        if(this.backoutArr[i].type==lastObj.type&&this.backoutArr[i].devid==lastObj.devid){
                            arr.push(this.backoutArr[i]);
                        }
                    }
                    if(arr.length>1){  //等于1时就是第一次操作此设备
                        switch(type){
                            case "video":
                                this.video_list.splice(index,1,arr[arr.length-2]);
                            case "access":
                                this.access_list.splice(index,1,arr[arr.length-2]);
                        }
                    }else{  //此设备就只操作了这一次
                        //数组中只有一个此设备的状态了，判断是初始化就存在的设备还是拖进来的，初始化的就还原为初始化的状态,拖进来的就不显示了
                        var moveTo=true; //假设为拖进来的
                        for(var i=0;i<this.init_device.length;i++){
                            if(this.init_device[i].type==lastObj.type&&this.init_device[i].devid==lastObj.devid){ //初始化就有的
                                switch(type){
                                    case "video":
                                        this.video_list.splice(index,1,this.init_device[i]);
                                    case "access":
                                        this.access_list.splice(index,1,this.init_device[i]);

                                }
                                moveTo=false;
                            }
                        }
                        if(moveTo){ //拖进来的
                            switch(type){
                                case "video":
                                    if(this.video_list[index]){
                                        this.video_list[index].state=false;
                                    }
                                case "access":
                                    if(this.access_list[index]){ //不判断，如果this.access_list[index]不存在就找不到this.access_list[index].state就报错
                                        this.access_list[index].state=false;
                                    }
                            }
                        }
                    }
                }else{ //最后一步是删除设备操作
                    switch(type){  //先撤销回删除时的状态
                        case "video":
                            this.video_list.splice(index,1,this.delete_device[this.delete_device.length-1]);
                            break;
                        case "access":
                            this.access_list.splice(index,1,this.delete_device[this.delete_device.length-1]);
                          break;
                      case "three":
                        this.three.splice(index,1,this.delete_device[this.delete_device.length-1]);
                        break;
                    }
                    //再操作撤回后的数组状态
                    this.return_delete_device.push(this.delete_device[this.delete_device.length-1]);
                    this.delete_device.splice(this.delete_device.length-1,1);
                }

                this.returnBackoutArr.push(_obj);
                this.backoutArr.splice(this.backoutArr.length-1,1);

            }else{
                this.$message.warning('没有撤销的操作！');
            }
        },
        //反撤销
        returnBackout:function(){
            console.log(this.backoutArr)
            console.log(this.returnBackoutArr)
            if(this.returnBackoutArr.length>0){
                var lastObj=this.returnBackoutArr[this.returnBackoutArr.length-1];
                var type=lastObj.type;
                var index=lastObj.index;
                var _obj=JSON.parse(JSON.stringify(lastObj));
                switch(type){  //先撤销回删除时的状态
                    case "video":
                        this.video_list.splice(index,1,lastObj);
                        break;
                    case "access":
                    this.access_list.splice(index,1,lastObj);
                      break;
                  case "three":
                    this.three_list.splice(index,1,lastObj);
                    break;
                }

                this.backoutArr.push(_obj);
                this.returnBackoutArr.splice(this.returnBackoutArr.length-1,1);
            }else{
                this.$message.warning('没有反撤销的操作！');
            }
            console.log(this.backoutArr)
        },
        //改变浏览器和初始化用
        initDevice:function(_this){
            console.log(_this)

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
      //获取所有站点的地图
      getAllMap:function(){
        const _this = this;
        this.$api.get('/Template/query',{}, r => {
          if(r.err_code=="0"){
            _this.map_list=r.data;
           
             _this.map_list.unshift({id:'',name:''});
            //this.dialogInfo.data={};
          }else{
            _this.$message.warning(r.err_msg);
          }
        });
      }
    },
    watch:{
      form:{
        handler:function(val,oldval){
         
          this.img_html.dialogInfo.json.name=val.title||"";
          this.img_html.dialogInfo.json.dataType = val.dataType;
          this.img_html.dialogInfo.json.dataSource = val.dataSource;
          this.img_html.dialogInfo.json.goHref = val.goHref;
          this.img_html.dialogInfo.json.pic_size.width=val.width;
          this.img_html.dialogInfo.json.pic_size.height=val.height;
          this.img_html.dialogInfo.json.imgUrl = val.normalImg[0].url;
          this.img_html.dialogInfo.json.normalImg[0]=val.normalImg[0].url;
          this.img_html.dialogInfo.json.alarmImg[0]=val.alarmImg[0].url;
          this.img_html.dialogInfo.json.lostImg[0] = val.lostImg[0].url;
          for(let i = 0; i++;i<this.three_list.length){
            if(this.three_list[i].id==this.img_html.dialogInfo.id){
              this.three_list[i] = this.img_html.dialogInfo;
            }
          }

        },
        deep: true
      },
      'getInfo.data':{
        handler:function(val,oldval){
          let valName =[],
              valId =[],
              type=0;
          if(val.length>0){
            val.map((item,i)=>{
            if (item.map.type==="9") {
                valName.push(item.label);
                valId.push(item.parentId+'_'+item.id);
                type = item.map.type;
              }else{
               valName.push(item.label);
                valId.push(item.id);
                type = item.map.type;
              }

            })
          }
          this.form.dataSource ={name:valName.join(','),id:valId.join(','),type:type}
        }
      }
    },
    components:{DialogZtUploadImg,ZtThree,GetInfo}
}
</script>




