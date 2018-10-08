<template>
    <div class="loncom_content sconfig_scsi">
       <div class="loncom_public_top">
            <div class="loncom_fl">空间配置</div>
        </div>
       <div class="loncom_public_con">
            <div class="loncom_tree">
                <div class="loncom_tree_title">
                    站点信息
                </div>
                <div class="loncom_tree_con numScroll0">
                    <div class="numScrollCon0">
                        <el-button type="primary" size="small" style="width: 100%;margin-bottom:10px;" @click="addSite" v-if="$store.state.sconfig_scsi.add">添加空间地点</el-button>
                        <el-tree
                        ref="tree"
                        v-loading = 'treeLoading'
                        :props="defaultProps"
                        :data="tree_data"
                        node-key="id"
                        default-expand-all
                        @node-click="nodeClick"
                        >
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="loncom_table">
                <div class="loncom_tab">
                    <div class="loncom_tab_btn">
                        <el-button type="primary" size="mini" @click="save('formInfo')" v-if="$store.state.sconfig_scsi.add||$store.state.sconfig_scsi.edit">保存</el-button>
                        <el-button type="primary" size="mini" @click="remove" v-if="$store.state.sconfig_scsi.remove">删除</el-button>
                    </div>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="空间信息" name="first">
                            <div class="loncom_tabbox numScroll1">
                                <div class="loncom_tabbox_con numScrollCon1">
                                    <div style="padding-top:30px;">
                                        <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="120px">
                                            <div style="width:450px;">
                                                <el-form-item prop="p_name" label="名称" size="small">
                                                    <el-input v-model="form_info.p_name"></el-input>
                                                </el-form-item>
                                                <el-form-item label="图片" size="small">
                                                    <div style="width:calc(100% - 64px);float:left;">
                                                        <el-upload
                                                            class="upload-demo"
                                                            ref="upload"
                                                            name="p_img"
                                                            :limit="1"
                                                            :headers="config"
                                                            :action="rootUrl+'/upload'"
                                                            :file-list="fileList"
                                                            :on-success="onSuccess"                             
                                                            :on-error="onError"
                                                            :on-change="onchange"
                                                            :on-exceed="onexceed"
                                                            :auto-upload="false">
                                                            <el-button slot="trigger" size="small" type="primary">选取</el-button>
                                                        </el-upload>
                                                    </div>
                                                    <span style="float:left;margin-left:5px;"><el-button size="small" type="primary" @click="preview" v-show="imgPreview_info.url!=''">预览</el-button></span>
                                                </el-form-item>
                                                <el-form-item prop="type" label="类型" size="small">
                                                        <el-radio v-if='parentid == 1' disabled v-model="form_info.type" label="0">根节点</el-radio>
                                                        <el-radio v-model="form_info.type" label="1">养殖基地</el-radio>
                                                        <el-radio v-model="form_info.type" label="2">车间</el-radio>
                                                        <el-radio v-model="form_info.type" label="3">池塘</el-radio>
                                                </el-form-item>
                                                <el-form-item prop="parentname" label="上级空间" size="small" v-if="form_info.type!='0'&&form_info.type!=''">
                                                    <el-input v-model="form_info.parentname" readonly @focus="getScsi"></el-input>
                                                </el-form-item>
                                                <el-form-item prop="templatename" label="模板绑定" size="small" v-if="form_info.type!='0'&&form_info.type!=''">
                                                    <el-input v-model="form_info.templatename" readonly @focus="getTemplate"></el-input>
                                                </el-form-item>
                                                <el-form-item prop="details" label="备注" size="small">
                                                    <el-input v-model="form_info.details" type="textarea"></el-input>
                                                </el-form-item>
                                                <div v-if="form_info.type=='1'">
                                                    <el-form-item label="经度" prop="longitude">
                                                        <el-input v-model="form_info.longitude" @blur='centerZoom' size="small" placeholder="经度"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="纬度" prop="latitude">
                                                        <el-input v-model="form_info.latitude" @blur='centerZoom' size="small" placeholder="纬度"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="地图精度">
                                                        <el-select v-model="accuracy" placeholder="请选择" size="small">
                                                            <el-option
                                                                v-for="item in accuracy_list"
                                                                :key="item.value"
                                                                :label="item.value"
                                                                :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                            <!-- v-show="form_info.type=='1'" -->
                                            <div style="padding-bottom:10px;position:relative;display:none"  id='mapCon'>
                                                <el-input v-model="address" placeholder="输入地址搜索获取经纬坐标" style="display:none;" size="small" class="input-with-select">
                                                    <el-button slot="append" icon="el-icon-search" id="search"></el-button>
                                                </el-input>
                                                <el-radio-group v-model="map_type" size="small" style="position:absolute;right:15px;top:10px;z-index:9999;">
                                                    <el-radio-button label="街道地图"></el-radio-button>
                                                    <el-radio-button label="卫星地图"></el-radio-button>
                                                </el-radio-group>
                                                <div id="container1" style="width:100%;height:500px;border:1px solid #ccc;"></div>
                                            </div>
                                        </el-form>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
       </div>
       <GetInfo v-bind:dialogInfo="getInfo" v-if="getInfo.visible"></GetInfo>
       <GetTem v-bind:dialogInfo="getTem" v-if="getTem.visible"></GetTem>
       <imgPreview :dialogInfo="imgPreview_info" v-if="imgPreview_info.visible"></imgPreview>
    </div>
</template>

<style>
    .sconfig_scsi .el-radio+.el-radio{margin-left:20px;}
    .sconfig_scsi .el-upload {
        float: right;
    }
    .sconfig_scsi .el-upload-list{
        float: left;
        border: 1px solid #dcdfe6;
        width: calc(100% - 64px);
        height: 32px;
        border-radius: 4px;
    }
    .sconfig_scsi .el-upload-list__item:first-child{
        margin-top:0px;
        line-height: 2.1;
    }
    .sconfig_scsi .input-with-select{
        position: absolute;
        z-index: 9;
        top: 10px;
        left: 10px;
        width: 300px;
    }
</style>
<script>
import GetInfo from '@/components/sconfig_scsi_get.vue'
import GetTem from '@/components/sconfig_template_get.vue'
import imgPreview from '@/components/img_preview.vue'
export default {
    created () {
        this.getTree();
    },
    mounted() {
        numScroll(0);
        $('.numScroll1').niceScroll(".numScrollCon1",{
            cursorcolor: "#ccc",//#CC0071 光标颜色
            cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
            touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
            enablemousewheel: false, //禁用滚轮滚动
            cursorwidth: "8px", //像素光标的宽度
            cursorborder: "0", // 游标边框css定义
            cursorborderradius: "3px",//以像素为光标边界半径
            autohidemode: false //是否隐藏滚动条
        });
        
        this.rootUrl=rootUrl;
        //地图信息
       

    },
    data() {
       var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入名称'));
        } else {
          if(this.editname==""){ //新增
                this.$api.post('/addr/asy', {p_name:this.form_info.p_name,type:this.form_info.type}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        if(r.data=="false"){
                            callback(new Error('名称重复了'));
                        }else{
                            callback()
                        }
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
          }else{ //编辑
                if(this.editname!=this.form_info.p_name){
                    this.$api.post('/addr/asy', {p_name:this.form_info.p_name,type:this.form_info.type}, r => {
                        console.log(r)
                        if(r.err_code=="0"){
                            if(r.data=="false"){
                                callback(new Error('名称重复了'));
                            }else{
                                callback()
                            }
                        }else{
                            this.$message.warning(r.err_msg);
                        }
                    });
                }else{
                     callback()
                }
          }
          //callback();
        }
      };
       return {
           editname:'',  //编辑的时候存储名称，用于验证名称重复性用
           map_type:'街道地图',
            treeLoading:true,
            parentid:'',//根节点的显示与隐藏
           map:'',
           activeName:'first',
           rootUrl:'',  //图片上传用
          　tree_data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            address:'',
            accuracy:'9', //地图显示精度
            accuracy_list:[
                {value:'9'},{value:'10'},{value:'11'},{value:'12'},{value:'13'},{value:'14'},{value:'15'},{value:'16'},{value:'17'}],  //地图显示精度
            form_info:{
                id:'',
                p_name:'',
                p_img:'',
                type:'0',
                parentid:'',  //上级空间
                parentname:'',
                templateid:'', //模板名称
                templatename:'', 
                longitude:'',
                latitude:'',
                details:'',
            },
            formRules:{
                p_name:[
                    { validator: validatePass,required: true,trigger: 'blur' },
                ],
                parentname:[
                    { required: true, message: '请选择上级空间', trigger: 'change' },
                ],
                type:[
                    { required: true, message: '请选择类型', trigger: 'change' },
                ],
                longitude:[
                    { required: true, message: '请点击地图获取经坐标', trigger: 'change' },
                ],
                latitude:[
                    { required: true, message: '请点击地图获取纬坐标', trigger: 'change' },
                ]
            },
            getInfo:{
                title:"获取上级空间信息",
                visible:false,
                id:'',
                type:'',
                data:{},
            },
            getTem:{
                title:"获取模板信息",
                visible:false,
                id:'',
                type:'',
                data:{},
            },
            //图片用
            fileList:[],
            config:{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            },
            imgPreview_info:{
                visible:false,
                url:'',
            }

       }
   },
    methods:{
        //加载地图
        initMap:function(){
            $("#mapCon").show();
            var _this=this;
            var map = this.map = new BMap.Map("container1");

            //var myGeo = new BMap.Geocoder();  
            map.centerAndZoom(new BMap.Point(109.733755, 19.180501),9);   
            //map.addControl(new BMap.NavigationControl());
            var marker = new BMap.Marker(new BMap.Point(109.733755, 19.180501));  
            //map.centerAndZoom("北京",13);
        
            if(this.form_info.longitude!=""&&this.form_info.latitude!=""){
                map.centerAndZoom(new BMap.Point(this.form_info.longitude, this.form_info.latitude), 9); 
                moveOverlay({lng:this.form_info.longitude, lat:this.form_info.latitude})
            }else{
                map.centerAndZoom(new BMap.Point(108.445369,20.386525),9);   
            }//109.733755, 19.180501
            map.enableScrollWheelZoom();
            map.addEventListener("click",function(e){
                setPoint(e.point);
            });  
            
            $("#search").on('click', function () {  
                var searchTxt = _this.address;  
                myGeo.getPoint(searchTxt, function (point) {  
                    console.log(point)
                    map.centerAndZoom(point, 13); 
                    setPoint(point);  
                }, "全国");  
            }); 
            function setPoint(point) {  
                if (point) {  
                    //坐标赋值  
                    _this.form_info.longitude=point.lng;
                    _this.form_info.latitude=point.lat;
                    //Geocoder(point);  
                    map.centerAndZoom(new BMap.Point(point.lng, point.lat),_this.accuracy);   
                    moveOverlay(point);
                    
                }  
            }
            function moveOverlay(point){
                map.clearOverlays();
                var marker = new BMap.Marker(point);  
                map.addOverlay(marker);  
                marker.enableDragging();//可以拖动   
                //拖动监听  
                marker.addEventListener("dragend", function (e) {  
                    //坐标赋值  
                    _this.form_info.longitude=e.point.lng;
                    _this.form_info.latitude=e.point.lat;
                    //Geocoder(e.point);  
                });  
            }  
            function Geocoder(point) {  
                var gc = new BMap.Geocoder();  
                gc.getLocation(point, function (rs) {  
                    console.log(rs)
                    var addComp = rs.addressComponents;  
                });  
            } 
            document.onkeyup = function (event) {
                if (event.keyCode == 13) {
                var searchTxt = _this.address;  
                    myGeo.getPoint(searchTxt, function (point) {  
                        map.centerAndZoom(point, 13); 
                        setPoint(point);  
                    }, "全国");  
                }
            }

        },
        clearInfo:function(){
            for(var item in this.form_info){
               this.form_info[item]='';
            }
            this.form_info.type='0';
            this.fileList=[];
        },
        addSite:function(){
           this.clearInfo();
           this.$refs.formInfo.clearValidate();
           this.editname=""; //新增的时候清空name，判断名称重复用
        },
       //获取树形
        getTree:function(){
            if(this.$store.state.sconfig_scsi.query){
                this.$api.post('/addr/tree', {}, r => {
                    console.log(r)
                    this.treeLoading = false;
                    if(r.err_code=="0"){
                        this.tree_data=r.data;
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            }
             
        },
       //点击树形节点获取详情
        nodeClick:function(data,node){
            console.log(node)
            this.parentid = node.level;
            this.$refs.formInfo.clearValidate();
            this.$api.post('/addr/details', {id:node.data.id}, r => {
                console.log(r)
                if(r.err_code=="0"){
                   $("#mapCon").hide();
                    this.form_info=r.data[0];
                    this.editname=r.data[0].p_name; //编辑的时候判断name重复性用
                    if(r.data[0].p_img!=""&&r.data[0].p_img!=null){
                        this.fileList=[{name:r.data[0].p_img}]
                        this.imgPreview_info.url='static/upload/'+r.data[0].p_img;
                    }
                }else{
                    this.$message.warning(r.err_msg);
                }
            }); 
        },
        //获取上级空间
        getScsi:function(){
            this.getInfo.visible=true;
            this.getInfo.type=this.form_info.type;
            this.getInfo.id=this.form_info.parentid;
            console.log(this.getInfo.type)
        },
        //获取模板
        getTemplate:function(){
            this.getTem.visible=true;
            this.getTem.type=this.form_info.type;
            this.getTem.id=this.form_info.templateid;
        },
        save:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){
                    console.log(this.fileList)
                    if(this.fileList.length>0&&this.fileList[0].size){
                        this.$refs.upload.submit();
                    }else{
                        this.submit();
                    }
                    
                }
            })
        },
        submit:function(){
            if(this.form_info.id==""){ //新增
                this.$api.post('/addr/add', {model:{obj:this.form_info}}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.getTree();
                        this.clearInfo();
                        this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                }); 
            }else{ //修改
                if(this.fileList.length=0){
                    this.form_info.p_img='';
                }
                this.$api.post('/addr/update', {model:{obj:this.form_info}}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.getTree();
                        this.$message.success(r.err_msg);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                }); 
            }
        },
        onSuccess:function(response, file, fileList){
            console.log(response)
        
            if(response.err_code=="0"){
                this.form_info.p_img=response.data;
                this.fileList[0].name=response.data;
                this.submit();
            }else{
                this.$message.warning(r.err_msg);
            }
        },
        onError:function(err, file, fileList){
            this.$message.warning(err);
        },
        onchange:function(file,fileList){
            console.log(fileList)
            var fileArry=file.name.split(".");
            var fileType=fileArry[fileArry.length-1];
            if(fileType=="png"||fileType=="jpg"||fileType=="PNG"||fileType=="JPG"){
                if(file.size&&file.size>512000){
                    this.$message.warning("图片超过500KB!");
                    this.fileList=[];
                }else{
                    this.fileList=fileList;
                    this.imgPreview_info.url = file.url;
                }
            }else{
                this.$message.error("图片格式只能为png或jpg");
                this.fileList=[];
            }
        },
        onexceed:function(files, fileList){
			 this.$message.warning("只能上传一张图片，如需更换图片，先去除已有图片");
        },
        handleRemove:function(file, fileList){
            this.fileList=[];
            this.imgPreview_info.url="";
        },
        remove:function(){
            if(this.form_info.id==""){
                this.$message.warning("请选择要删除的节点");
            }else{
                this.$confirm("确定删除?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning',
                }).then(() => {
                    this.$api.post('/addr/delete', {id:this.form_info.id}, r => {
                        if(r.err_code=="0"){
                            this.clearInfo();
                            this.getTree();
                            this.$message.success(r.err_msg);
                        }else{
                            this.$message.warning(r.err_msg);
                        }
                    });
                });
            }
            
        },
        centerZoom:function(){
            var _this =this;
            if(this.form_info.longitude!="" && this.form_info.latitude!=''){
              
                 var point =  new BMap.Point(this.form_info.longitude, this.form_info.latitude); 
                 this.map.centerAndZoom(point, this.accuracy); 
                   this.map.clearOverlays();
            var marker = new BMap.Marker(point);  
            this.map.addOverlay(marker);  
            marker.enableDragging();//可以拖动   
            //拖动监听  
            marker.addEventListener("dragend", function (e) {  
                //坐标赋值  
                _this.form_info.longitude=e.point.lng;
                _this.form_info.latitude=e.point.lat;
                //Geocoder(e.point);  
            });  
            }
        },
        preview:function(){
            this.imgPreview_info.visible=true;
        },

    },
    watch:{
        'getInfo.data':{
            handler:function(val,oldval){
                this.form_info.parentid=val.id;
                this.form_info.parentname=val.label;
            },
            deep: true
        },
        'getTem.data':{
            handler:function(val,oldval){
                this.form_info.templateid=val.id;
                this.form_info.templatename=val.name;
            },
            deep: true
        },
        accuracy:function(val){
            if(this.form_info.longitude!=""&&this.form_info.latitude!=""){
                this.map.centerAndZoom(new BMap.Point(this.form_info.longitude, this.form_info.latitude), val); 
            }else{
                this.map.centerAndZoom(new BMap.Point(109.733755, 19.180501),val);   
            }

        },
        'form_info.type':{
            handler:function(){
                if(this.form_info.type=='1'){
                    this.initMap();
                }else{
                    $("#mapCon").hide();
                }
            },
            deep: true
        },
        map_type:function(val){
            if(val=="街道地图"){
                map_url="static/map/tiles/";
            }else{
                map_url="static/map/tiles1/";
            }
            this.initMap();
        },

    },
    components:{GetInfo,GetTem,imgPreview}
}
</script>