<template>
    <div class="loncom_content control_gis">
        <div class="loncom_public_top">
            <div class="search loncom_fl">
                <el-input placeholder="请输入养殖基地名称" v-model="searchInfo" size="mini">
                    <el-button slot="append" icon="el-icon-search" id="search_btn"></el-button>
                </el-input>
            </div>
            <div class="loncom_fl loncom_ml15">
                自定义
            </div>
            <div class="loncom_fl loncom_ml15">
                <el-select v-model="accuracy" placeholder="请选择" size="mini">
                    <el-option
                        v-for="item in accuracy_list"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="gis_sort loncom_fr">
                <ul ref="gis_sort">
                    <li class="active" data-name="all">全部</li>
                    <li class="warning" data-name="warning"><em></em>危险</li>
                    <li class="lost" data-name="lost"><em></em>失联</li>
                    <li class="normal" data-name="normal"><em></em>健康</li>
                </ul>
                
            </div>
        </div>
         <div class="loncom_tree" id="treeBox" style="position:relative">
                <div class="loncom_tree_title">
                    GIS地点
                </div>
                <div class="loncom_tree_con numScroll0" style="height:calc(100% - 80px)">
                  <div class="numScrollCon0">
                    <el-tree
                      ref="tree"
                      v-loading='treeLoading'
                      :props="defaultProps"
                      :data="tree_data"
                      node-key="id"
                      default-expand-all
                      @node-click="nodeClick"
                    >
                    </el-tree>
                  </div>
                </div>
                <span class="open-arrow" @click='arrowHandle'></span>
            </div>
       <div class="gis">
            <el-radio-group v-model="map_type" size="small" style="position:absolute;right:15px;top:10px;z-index:9;">
                <el-radio-button label="街道地图"></el-radio-button>
                <el-radio-button label="卫星地图"></el-radio-button>
            </el-radio-group>
            <div id="container" class="loncom_content"></div>
            <div class="gis_alarm_list" ref="gis_alarm_list">
                <alarmTop v-bind:Info="Info" v-on:getAlarm="getAlarm" v-if="Info.visible"></alarmTop>
                <el-scrollbar style="height:360px;">
                    <el-search-table-pagination  type="local"
                        url=""
                        list-field="list"
                        total-field="total"
                        method='post'
                        :show-pagination="false"
                        :page-sizes="[10000]"
                        :formOptions="table_forms"
                        border :data="table_data" :columns="table_columns" ref="thisRef">
                        <el-table-column slot="prepend" type="selection"></el-table-column>
                        <template slot-scope="scope" slot="preview-level">
                            <div v-if="scope.row.level>=4||scope.row.level=='4'">
                                <span class="alarm_one_color"><i class="fa fa-exclamation-triangle loncom_mr5"></i>一级</span>
                            </div>
                            <div v-if="scope.row.level==3||scope.row.level=='3'">
                                <span class="alarm_two_color"><i class="fa fa-exclamation-circle loncom_mr5"></i>二级</span>
                            </div>
                            <div v-if="scope.row.level==2||scope.row.level=='2'">
                                <span class="alarm_three_color"><i class="fa fa-exclamation-circle loncom_mr5"></i>三级</span>
                            </div>
                            <div v-if="scope.row.level==1||scope.row.level=='1'">
                                <span class="alarm_four_color"><i class="fa fa-exclamation-circle loncom_mr5"></i>四级</span>
                            </div>
                        </template>
                        <template slot-scope="scope" slot="preview-handle">
                            <div v-if="scope.row.cfmoper==''">
                                <a href="javascript:;" class="loncom_color" @click="sure(scope.row)">确认</a>
                            </div>
                            <div v-else>
                                <span class="loncom_color999">已确认</span>
                            </div>
                        </template>
                    </el-search-table-pagination>
                </el-scrollbar>
            </div>
       </div>
       <Show v-bind:dialogInfo="showInfo" v-if="showInfo.visible"></Show>
    </div>
</template>
<style>
    .control_gis .gis{
        float:left;
        width:calc(100% - 250px);
        position:relative;
        height: calc(100% - 40px);
    }
    .control_gis .loncom_map_box{
        min-width: 385px;
        height: auto;
      
        box-shadow: 1px 1px 3px #ccc;
        background: #fff;
        margin-bottom: 25px;
    }
    .loncom_content .arrow{
        width: 0; 
        height: 0; 
        font-size: 0px; 
        line-height: 0px; 
        border-width:10px;
       border-color:#ddd transparent transparent transparent;
       border-style:solid;
        position: absolute;
        bottom:4px;
        left:47%;
     }
     .loncom_content .arrow::after{
        position: absolute;
       content: '';
        width: 0;
        height: 0;
        border-width:10px;
        border-color:#fff transparent transparent transparent;
        border-style:solid;
        position: absolute;
        top: -12px;
        margin-left: -10px;
        border-style: solid;
     }
    .control_gis .loncom_map_boxtop {
        width: 100%;
        height: 40px;
        line-height: 40px;
        background: #12AE67;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #fff;
    }
    .control_gis .loncom_map_box_warning .loncom_map_boxtop,
    .control_gis .loncom_map_box_warning .loncom_map_boxinfo{
        background: #4889E9;
    }
    .control_gis .loncom_map_box_lost .loncom_map_boxtop,
    .control_gis .loncom_map_box_lost .loncom_map_boxinfo{
        background: #999;
    }
    .control_gis .loncom_map_boxtop em{
        font-size: 12px;
        margin-left: 5px;
        cursor:pointer;
    }
    .control_gis .loncom_map_boxinfo {
        width: 100%;
        height: 100px;
        background: #12AE67;
        padding: 10px;
        color: #fff;
        font-size: 12px;
        line-height: 25px;
    }
    .control_gis .loncom_map_boxinfo .img{
        width: 120px;
        height:80px;
        float:left;

    }
    .control_gis .loncom_map_boxinfo .img img{
        width: 100%;
        max-height: 80px;
    }
    .control_gis .loncom_map_boxinfo .info{
        width:calc(100% - 160px);
        float:left;

        margin-left: 40px;
        padding-left: 20px;
    }
    .control_gis .loncom_map_coninfo .video{
        width: 120px;
        height:100%;
     
        float:left;
        margin-top:30px;
        text-align:center;
    }
    .control_gis .loncom_map_coninfo .video img{
        max-width: 60px;
        max-height: 60px;
    }
    .control_gis .loncom_map_boxcon {
        padding: 10px;
        font-size: 12px;
    }
    .control_gis .loncom_map_coninfo{
        padding:15px 20px;
        overflow: hidden;
        line-height:24px;
        cursor:pointer;
    }
   .control_gis .loncom_map_coninfo .alarm_box{
    width:calc(100% - 120px);
    height:100%;
    float:left;
       border-right: 1px solid #eee;
   }
   .control_gis .loncom_map_coninfo .alarm_box .alarm_four{
    float:left;
    width:50%;
    margin-top:10px;
   }
    .control_gis .loncom_map_coninfo p{
        width:100%;
        height:24px;
       /* background:#f00;*/
        color:#000;
        text-align:center;
        margin:0px;
      
        border-radius: 3px;
        font-size: 12px;
    }
    .control_gis .loncom_map_coninfo .one p{
        color:#C5051B;
    }
    .control_gis .loncom_map_coninfo .two p{
        color:#FF1A07;
    }
    .control_gis .loncom_map_coninfo .three p{
        color:#FF7B00;
    }
    .control_gis .loncom_map_coninfo .four p{
        color:#FFA300;
    }
    /*箭头*/
    .control_gis .loncom_tree{
        transition: all .5s linear;
        -moz-transition: all .5s linear;
        -webkit-transition: all .5s linear;
    }
    .loncom_tree .open-arrow{
            width: 0; 
            height: 0; 
            font-size: 0px; 
            line-height: 0px; 
            border-width:10px;
        border-color:transparent #B2DFE6 transparent transparent;
        border-style:solid;
            position: absolute;
            bottom:50%;
            margin-top:-5px;
            right:0px;
            cursor: pointer;
    }
    .loncom_tree .close-arrow{
            width: 0; 
            height: 0; 
            font-size: 0px; 
            line-height: 0px; 
            border-width:10px;
        border-color:transparent transparent transparent  #B2DFE6;
        border-style:solid;
            position: absolute;
            bottom:50%;
            margin-top:-5px;
            right:-20px;
            z-index: 2;
    }
</style>
<script>
import alarmTop from '@/components/alarm_top.vue'
import Show from '@/components/video_gis_show.vue'
export default {

    created () {
        this.Info._export=this.$store.state.control_gis.export;
        sessionStorage.removeItem("zt_nav");
        this.getTree();
    },
    mounted() {
        console.log(map_url);
        this.getMap();
       numScroll(0);
        var _this=this;
        // 百度地图API功能
        
        // this.map = new BMap.Map("container");
        // //this.map.centerAndZoom(new BMap.Point(119.045403, 31.69525), 13); //初始化地图,设置中心点坐标和地图级别3-19
        // this.map.centerAndZoom(new BMap.Point(109.733755, 19.180501),9);
        // this.map.enableScrollWheelZoom();

        $(".gis_sort").find("li").on("click", function () {

            $(this).siblings("li").removeClass("active");
            $(this).addClass("active");
            var _name=$(this).data("name");
           
            if(_name=="all"){
                _this.searchType='';
            }else if(_name=="warning"){
                _this.searchType=1;
            }else if(_name=="lost"){
                _this.searchType=-1;
            }else{
                _this.searchType=0;
            }
            _this.getMap();

        })
        //搜索
        $("#search_btn").on("click",function(){
            _this.getMap();
        })
        
        


    },
    data() {
       return {
           map_type:'街道地图',
            gisInter:0,
            treeLoading:true,
            arrowState:'true',
            tree_data: [],
            defaultProps: {
            children: 'children',
            label: 'label'
            },
           searchInfo:'',
           searchType:'',
           accuracy_list:[
               {value:'1'},{value:'2'},{value:'3'},{value:'4'},{value:'5'},{value:'6'},{value:'7'},{value:'8'},
                {value:'9'},{value:'10'},{value:'11'},{value:'12'},{value:'13'},{value:'14'},{value:'15'},{value:'16'},{value:'17'}
            ],  //地图显示精度
            accuracy:'9', //地图显示精度
          　map:'',
            Info:{
               title:'实时事件',
               his:false,
               _export:'',
               id:'',
               data:[],
               visible:false,
            },
            addrIdArr: [],
            //基地信息
            addr_info:[],
            gis_info:[],  //存储gis所有的信息
            table_data:[],
            table_forms: {
                inline: true,
                size:'small',
                initParams:{queryKey:""},
                forms: []
            },
            table_columns:[
              { prop: 'level', label: '告警等级',minWidth:10,slotName:'preview-level'},
              { prop: 'eventname', label: '事件名称',minWidth:10},
              { prop: 'content1', label: '事件定位',minWidth:30},
              { prop: 'alarmtime', label: '告警时间',minWidth:15},
              { prop: 'cfmoper', label: '确认人',minWidth:10},
              { prop: 'cfmtime', label: '确认时间',minWidth:15},
              { prop: 'handle', label: '告警处理',slotName:'preview-handle',width:100},
            ],
            showInfo:{
                title:"视频预览",
                visible:false,
                row:{},
                data:[],
            },
            allmap:'',
            alarm_id:'',  //点击那个基地的id，获取告警列表用
            // mappoint:{
            //     lng:109.733755,
            //     lat:19.180501
            // }
            change_lat:0.2

       }
   },
    methods:{
        //树形框的操作
        arrowHandle: function(){
           
            if(this.arrowState){
                this.arrowState = false;
                $("#treeBox").css("margin-left",'-250px');
                $("#treeBox").find(".open-arrow").addClass("close-arrow")
                 $('.gis').css("width",'100%');
            }else{
                 this.arrowState = true;
                 $("#treeBox").css("margin-left",'0');
                  $("#treeBox").find(".open-arrow").removeClass("close-arrow")
                   $('.gis').css("width",'calc(100% - 250px)');
            }
        },
        getTree:function(){
        this.$api.get('/addr/GisAddrTree',{}, r => {
          console.log(r)
          this.treeLoading = false;
          if(r.err_code=="0"){
            this.tree_data=r.data;
          }else{
            this.$message.warning(r.err_msg);
          }
        });
      },
      nodeClick:function (data,node) {
 
        if(data.map &&　data.map.latitude &&data.map.longitude){
                this.map.centerAndZoom(new BMap.Point(data.map.longitude, data.map.latitude), this.accuracy);
         
        }else if(data.map && data.map.type ==2 && data.map.templateid && data.map.templatename){
            this.$router.push({path:'/control/gis/detail',query:{id:data.map.templateid,name:data.map.templatename}});

        }else if(data.map && data.map.type==3 && data.id ){
            if(data.map.scinfo == 1){
                this.$router.push({path:'/control/list/detail',query:{addrid:data.id,backUrl:'/control/gis'}});
            }else{
                this.$message.warning("该地点未关联池塘！");
            }
           
        }

      },
        getMap:function(){
          
            if(!this.$store.state.control_gis.query){
                return;
            }
            var _this=this;
            

            // //筛选代码
            // BMap.Icon.prototype.name = "";
            // BMap.Icon.prototype.setName = function (name) {
            //     this.name = name;
            // }
            // BMap.Icon.prototype.searchName = "";
            // BMap.Icon.prototype.setSearchName = function (searchName) {
            //     this.searchName = searchName;
            // }
            return new Promise(function(resolve, reject){
                _this.$api.post('/gis/addrlist', {type:_this.searchType,fname:_this.searchInfo}, r => {
                    if(r.err_code=="0"){
                        _this.addr_info=r.data;
                        resolve(true);
                    }else{
                        _this.$message.warning(r.err_msg);
                    }
                });
            }).then(function(data){
                console.log(_this.addr_info)
               
                _this.map = new BMap.Map("container");
                //this.map.centerAndZoom(new BMap.Point(119.045403, 31.69525), 13); //初始化地图,设置中心点坐标和地图级别3-19
                if(_this.addr_info.length>0){
                    _this.map.centerAndZoom(new BMap.Point(_this.addr_info[0].longitude, _this.addr_info[0].latitude),_this.accuracy);
                }else{
                    _this.map.centerAndZoom(new BMap.Point(110.34259, 19.786845), 9);
                }
                _this.map.enableScrollWheelZoom();
                _this.map.addEventListener("zoomend", function(evt){
                    _this.accuracy = _this.map.getZoom();
                })
 /*注册事件*/
 // if(document.addEventListener){
 //     document.addEventListener('DOMMouseScroll',scrollFunc,false);
 // }//W3C
 // window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome
                _this.map.clearOverlays();
                //去掉地铁线
                _this.map.setMapStyle({
                    styleJson: [
                        {
                            "featureType": "subway",
                            "elementType": "all",
                            "stylers": {
                                "visibility": "off"
                            }
                        }
                    ]
                });
                if(_this.addr_info.length>0){
                for(var i=0;i<_this.addr_info.length;i++){
                    var iconurl = "";
                    var point = new BMap.Point(_this.addr_info[i].longitude, _this.addr_info[i].latitude);
                    if (_this.addr_info[i].commstatus > 0) { //故障
                        iconurl = new BMap.Icon("static/images/jz_warning.gif", new BMap.Size(38, 40));
                       // iconurl.setName("warning");
                    } else if (_this.addr_info[i].commstatus < 0) { //失联
                        iconurl = new BMap.Icon("static/images/jz_lost.svg", new BMap.Size(38, 40));
                       // iconurl.setName("lost");
                    } else if (_this.addr_info[i].commstatus == 0) { //正常
                        iconurl = new BMap.Icon("static/images/jz_normal.svg", new BMap.Size(38, 40));
                        //iconurl.setName("normal");
                    }
                   // iconurl.setSearchName(_this.addr_info[i].p_name); //名称
                    var marker = new BMap.Marker(point, { icon: iconurl });
                    marker.id=_this.addr_info[i].id;
                    _this.map.addOverlay(marker);
                    _this.addClickHandler(marker, _this.addr_info[i].id,_this.addr_info[i].templateid,_this.addr_info[i].templatename)
                    _this.addrIdArr.push(_this.addr_info[i].id);
                }
}
                var allmap = _this.map.getOverlays();
                _this.allmap=allmap;
                _this.changeState();
                // //头部切换
                // $(".gis_sort").find("li").on("click", function () {
                //     $(this).siblings("li").removeClass("active");
                //     $(this).addClass("active");
                //     var _name=$(this).data("name");
                //     if(_name=="all"){
                //         for(var i=0;i<allmap.length;i++){
                //             if(allmap[i].toString() == "[object Marker]"){  //要是marker的才可以
                //                 allmap[i].show()
                //             }
                //         }
                //     }else{
                //         for(var i=0;i<allmap.length;i++){
                //             if(allmap[i].toString() == "[object Marker]"){  //要是marker的才可以
                //                 if(allmap[i].z.uj.name == _name){
                //                     allmap[i].show();
                //                 }else{
                //                     allmap[i].hide();
                //                 }
                //             }
                //         }
                //     }

                // })
                // //搜索
                // $("#search_btn").on("click",function(){
                //     for(var i=0;i<allmap.length;i++){
                //         if(allmap[i].toString() == "[object Marker]"){
                //             if(allmap[i].z.uj.searchName==_this.searchInfo){
                //                 _this.map.centerAndZoom(new BMap.Point(allmap[i].point.lng,allmap[i].point.lat),19);
                //             }
                //         }
                //     }
                // })

            });

        },
        //点击gis
        addClickHandler:function(marker,id,templateid,templatename){
            var _this=this;
            marker.addEventListener("click", function () {
                console.log(id)
                _this.$api.post('/gis/alarmlevelall', {addrid:id}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        _this.map.centerAndZoom(new BMap.Point(marker.point.lng,marker.point.lat+_this.change_lat),_this.accuracy);
                        // _this.mappoint.lng=marker.point.lng;
                        // _this.mappoint.lat=marker.point.lat;
                        var info={};
                        for(var i=0;i<_this.addr_info.length;i++){
                            if(_this.addr_info[i].id==id){
                                info=_this.addr_info[i];
                                info.row=r.data;
                                break;
                            }
                        }
                        var content = '';
                        var oneClass = info.row.level4>0?"one":"";
                         var twoClass = info.row.level3>0?"two":"";
                          var threeClass = info.row.level2>0?"three":"";
                           var fourClass = info.row.level1>0?"four":"";
                        var incontent = '<div class="loncom_map_boxtop">' +
                                        '<i style="margin:0 5px 0 10px;" class="fa fa-wifi"></i><span>' + info.p_name +'<em class="showAlarm" >告警详情</em></span>' +
                                    '</div>' +
                                    '<div class="loncom_map_boxinfo">' +
                                        '<div class="img"><img src="static/upload/'+info.p_img+'"></div>'+
                                        '<div class="info">'+
                                            '<p style="margin:10px 0">基地面积：<span>'+info.row.fareasum+'平方米</span></p>'+
                                            '<p>池塘数：<span>'+info.row.fcount+'</span></p>'+
                                        '</div>'+
                                       
                                    '</div>'+
                                    '<div class="loncom_map_coninfo">'+
                                       '<div class="alarm_box">'+
                                        '<div class="alarm_four '+oneClass+'">'+
                                             '<p >一级告警</p>'+
                                            '<p >'+info.row.level4+'条</p></div>'+
                                         '<div class="alarm_four '+twoClass+'">'+
                                             '<p >二级告警</p>'+
                                            '<p >'+info.row.level3+'条</p></div>'+
                                       
                                         '<div class="alarm_four '+threeClass+'">'+
                                             '<p >三级告警</p>'+
                                            '<p >'+info.row.level2+'条</p></div>'+
                                       
                                         '<div class="alarm_four '+fourClass+'">'+
                                             '<p >四级告警</p>'+
                                            '<p >'+info.row.level1+'条</p></div>'+
                                        
                                            // '<p class="two">二级告警：<span>'+info.row.level3+'条</span></p>'+
                                            // '<p class="three">三级告警：<span>'+info.row.level2+'条</span></p>'+
                                            // '<p class="four">四级告警：<span>'+info.row.level1+'条</span></p>'+
                                            '</div>'+
                                             '<div class="video">'+

                                                '<img src="static/images/shiping.png">'+
                                            '</div>'+
                                        
                                    '</div>';
                        if (info.commstatus > 0) { //故障
                            content = '<div class="loncom_map_box loncom_map_box_warning">' + incontent + '<span class="arrow"></span></div>';
                        } else if (info.commstatus < 0) { //失联
                            content = '<div class="loncom_map_box loncom_map_box_lost">' + incontent + '<span class="arrow"></span></div>';
                        } else if (info.commstatus == 0) { //正常
                            content = '<div class="loncom_map_box">' + incontent + '<span class="arrow"></span></div>';
                        }
                        var infoBox = new BMapLib.InfoBox(_this.map, content);
                        infoBox.open(this)
                     // $(infoBox.V).append()
                        $(infoBox.V).find(".showAlarm").on("click",function(){
                            _this.showAlarm(info.id);
                        })
                        $(infoBox.V).find(".video").on("click",function(){
                            _this.showVideo(info.id);
                        })
                    }else{
                        _this.$message.warning(r.err_msg);
                    }
                });

            })
            marker.addEventListener("dblclick",function(){
                if(templatename!=""&&templatename!=null&&templateid!=""&&templateid!=null){
                    _this.$router.push({path:'/control/gis/detail',query:{id:templateid,name:templatename}});
                }else{
                    _this.$message.warning("没有绑定模板！");
                }
                
            })


        },
        //点击显示底部告警
        showAlarm:function(id){
            console.log(id)
            this.alarm_id=id;
            this.Info.id=id;
            this.Info.visible=true;
            $(this.$refs.gis_alarm_list).css({"bottom":"0px"});
            this.getAlarm();
        },
        //底部获取告警
        getAlarm:function(info){
            var level=info?info:"";
            this.$api.post('/gis/getaddridalarmall', {addrid:this.alarm_id,level:level}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.table_data=r.data;
                    this.Info.data=r.data;
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
        //gis点击视频展示
        showVideo:function(id){
            this.$api.post('/gis/getaddridvideall', {addrid:id}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    if(r.data.length>0){
                    this.showInfo.data=r.data;
                    this.showInfo.visible=true;
                }else{
                    this.$message.warning("无视频监控!"); 
                }
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
        },
        //确认告警
        sure:function(row){
           console.log(row)
           if(this.$store.state.control_gis.alarm){
               this.$confirm("确定删除?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning',
                }).then(() => {
                    var ids=row.mgrobjid+"%"+row.id+"%"+row.eventbm;
                    this.$api.post('/Alarmstrategy/alarmconfirm', {ids:ids,cfm:""}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.getAlarm();
                        this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
                });

           }else{
               this.$message.warning("您没有权限确认告警");
           }

       },
        // changeState:function(){
        //     console.log(this.allmap)

        //     BMap.Icon.prototype.setName = function (name) {
        //         this.name = name;
        //     }
        //     BMap.Icon.prototype.setSearchName = function(searchName){
        //         this.searchName = searchName;
        //     }
        //     for(var i=0;i<this.allmap.length;i++){
        //         if(this.allmap[i].id=="5602753736"){
        //             var iconurl = new BMap.Icon("/static/images/jz_lost.svg", new BMap.Size(38, 40));
        //             this.allmap[i].setIcon(iconurl);
        //         }
        //     }
        //     $(this.allmap).each(function(){
        //         console.log(this)

        //     });


        // },
        changeState:function(){
            var _this = this;
             if (this && this._isDestroyed) {return}
             this.$api.post('/gis/addrlistalarm', {addrid:this.addrIdArr.join(",")}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                         var result=r.data;
                        if(result.length>0){
                            for(var i=0;i<result.length;i++){
                                for(var j=0;j<_this.allmap.length;j++){
                                if(_this.allmap[j].id==result[i].id){
                                        var iconurl = "";
                                        if(result[i].alarmcount==0){
                                            iconurl = new BMap.Icon("static/images/jz_normal.svg", new BMap.Size(38, 40));
                                        }else if(result[i].alarmcount>0){
                                            iconurl = new BMap.Icon("static/images/jz_warning.gif", new BMap.Size(38, 40));
                                }else if(result[i].alarmcount<0){
                                            iconurl = new BMap.Icon("static/images/jz_lost.svg", new BMap.Size(38, 40));
                                        }
                                        _this.allmap[j].setIcon(iconurl);
                                    }
                                }
                            }
                        }
                        clearInterval(_this.gisInter);
                        _this.gisInter = setInterval(()=>{_this.changeState()},3000);
                        // setTimeout(()=>{_this.changeState()},3000);
                       // this.getAlarm();
                        //this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
        }
    },
    watch:{
        // map:function(val,oldval){
        //     this.getMap();
        // },
        map_type:function(val){
            if(val=="街道地图"){
                map_url="static/map/tiles/";
            }else{
                map_url="static/map/tiles1/";
            }
            this.getMap();
        },
        searchInfo:function(){
            this.getMap();
        },
        addr_info:function(val){
            var _this=this;
            var arr=[];
            for(var i=0;i<val.length;i++){
                arr.push(val[i].id);
            }
            // wsConnection({cmd:"getaddrstate",data:arr},function(r){
            //     var result=JSON.parse(r.data);
            //     if(result[0].cmd=="addrstate"){
            //         for(var i=0;i<result[0].data.length;i++){
            //             for(var j=0;j<_this.allmap.length;j++){
            //                 if(_this.allmap[j].id==result[0].data[i].key){
            //                     var iconurl = "";
            //                     if(result[0].data[i].commstart==0){
            //                         iconurl = new BMap.Icon("static/images/jz_normal.svg", new BMap.Size(38, 40));
            //                     }else if(result[0].data[i].commstart>0){
            //                         iconurl = new BMap.Icon("static/images/jz_warning.gif", new BMap.Size(38, 40));
            //                     }else if(result[0].data[i].commstart<0){
            //                         iconurl = new BMap.Icon("static/images/jz_lost.svg", new BMap.Size(38, 40));
            //                     }
            //                     _this.allmap[j].setIcon(iconurl);
            //                 }
            //             }
            //         }
            //     }
            // })
        },
        accuracy:function(val){
            console.log(val)
            if(val<=10){  //不同层级点击弹窗定位用
                this.change_lat=0.2;
            }else if(val<=13){
                this.change_lat=0.04;
            }else if(val<=15){
                this.change_lat=0.01;
            }else{
                this.change_lat=0;
            }
            // var cp=this.map.getBounds();
            // console.log(cp)
            // console.log(cp.getCenter())
            console.log(this.addr_info[0].longitude);
            this.map.centerAndZoom(new BMap.Point(this.addr_info[0].longitude, this.addr_info[0].latitude),this.accuracy);
        }

    },
    components:{alarmTop,Show}
}
</script>
