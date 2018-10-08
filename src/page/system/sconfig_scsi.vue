<template>
    <div class="loncom_content record_scsi">
       <div class="loncom_public_top">
            <div class="loncom_fl">组态配置</div>
        </div>
        <div class="loncom_public_con">
          <div class="loncom_zt_sidebarcon loncom_zt_sidebarcon1">
            <el-row :gutter="20">
              <!--<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>-->
              <!--<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>-->
              <!--<el-col :span="6"><div class="grid-content bg-purple"></div></el-col>-->

                <div v-for="(item,index) in map_list">
                <el-col :span="6">
                    <div class="loncom_zt_sidebarbox" >
                    <div class="loncom_zt_maptitle" @dblclick="showMap(item.id,item.name)">{{item.name}}</div>
                    <div class="loncom_zt_mapimg" @dblclick="showMap(item.id,item.name)">
                        <img :src="item.img?'static/upload/'+item.img:''">
                    </div>
                    <div class="loncom_zt_map_btn">
                        <span @click="editItem(item,index)"><i class="fa fa-edit"></i></span>
                        <span><i class="fa fa-pencil" @click="editMap(item,index)"></i></span>
                        <span><i class="fa fa-trash" @click="removeMap(item,index)"></i></span>
                    </div>
                    </div>
                </el-col>
                </div>


              <el-col :span="6">
                <div class="loncom_zt_sidebarbox loncom_zt_mapadd" @click="addMap">
                  <i class="fa fa-plus"></i>
                </div>
              </el-col>
            </el-row>
          </div>


          <!--<div class="loncom_sidebar_right loncom_zt_sidebar_right" ref="content">-->
          <!--<ZtShow v-bind:ztshow="ztshow" v-if="ztshow.id"></ZtShow>-->
          <!--</div>-->
          <!--电子地图新增编辑-->
          <DialogZtMapAdd v-bind:dialogInfo="mapInfo" v-on:getMap="getMap" ></DialogZtMapAdd>
          <DialogZtIndex v-bind:dialogInfo="ztShow"></DialogZtIndex>
        </div>
    </div>
</template>
<style>
  .record_scsi .loncom_zt_maptitle{
    font-size:14px;
    font-weight:bold;
    padding:10px;
  }
  .record_scsi .loncom_zt_sidebarbox{
    height:200px;
  }
  .record_scsi .loncom_zt_mapimg{
    height:100px;
    margin:10px 0;
  }
  .record_scsi .loncom_zt_map_btn{
    height:30px;
    line-height:30px;
    margin-bottom:10px;
  }
</style>

<script>
  import DialogZtMapAdd from '@/components/dialogZtMapAdd.vue'
  import DialogZtIndex from '@/components/dialogZtIndex.vue'
  const axios = require('axios')
export default {
    created () {

    },
    mounted() {
      this.getMap();//获取站点模板
    },
    data() {
      return {
        //侧边点击显示或隐藏
        navbtn:'open',
        //侧边头部切换
        activeName: 'second',
        //电子地图列表
        map_list:[],
        //新增电子地图
        mapInfo:{
          visible:false,
          width:"500px",
          data:{},
        },
        //mapIndex显示那个电子地图
        mapId:'',
        ztShow:{visible:false,width:'100%',
          data:{id:'',name:''}}
        // //canvas_img电子地图背景图片
        // canvas_img:'',
        // //width，height，背景图片大小
        // canvas_info:{},
        // //设备信息
        // video_list:[],
        // //门禁信息
        // access_list:[],
        // //  三态图
        // three_list:[],


      }
   },
    methods:{
      //新增电子地图
      addMap:function(){
        this.mapInfo.title="新增模板";
        this.mapInfo.type="add";
        this.mapInfo.visible=true;
        this.mapInfo.data ={};
      },
      //编辑电子地图
      editItem:function(item,index){
        this.mapInfo.title="编辑模板";
        this.mapInfo.type="edit";
        this.mapInfo.index=index;
        this.mapInfo.visible=true;
        // var _item=JSON.parse(JSON.stringify(item));
        var _item=Object.assign({}, item);
        this.mapInfo.data=_item;
      },
      //编辑电子地图
      editMap:function(item,index){
        this.$router.push({path:'/system/sconfig/scsi/editMap',query:{index:item.id}});
      },
      //删除电子地图
      removeMap:function(item,index){
        //ev.stopPropagation();
        const _this = this;
        this.$confirm("删除此模板?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.post('/Template/delete',{id:item.id}, r => {
            if (r.err_code == "0") {
              //this.map_list=r.data;
              _this.map_list.splice(index, 1);
              //this.dialogInfo.data={};
            } else {
              this.$message.warning(r.err_msg);
            }
          })

        });

      },
      // //设备组件改变时
      // init:function(_this){
      //     var now_back={
      //         width: $("#canvas").width(),
      //         height: $("#canvas").height()
      //     }
      //     var loc = nowLocation(_this.dialogInfo.json.canvas_info, _this.dialogInfo.json.pic_offset,_this.dialogInfo.json.canvas_bg_info,now_back,_this.dialogInfo.json.pic_size);
      //     $(_this.$el).css({
      //         "left":loc.x.toFixed(2)+"px",
      //         "top":loc.y.toFixed(2)+"px",
      //         "width":loc.width.toFixed(2)+"px",
      //         "height":loc.height.toFixed(2)+"px"
      //     });
      // },
      //点击切换地图
       showMap:function(id,name){
         //this.initMap(id)
      //   console.log(id)
      //   this.ztshow.id=id;
        // this.ztShow.title="";
         //this.ztShow.type="add";
         this.ztShow.visible=true;

         this.ztShow.data.id= id;
         this.ztShow.data.name = name;
      },
      //获取电子地图信息
      getMap:function(){
        const _this = this;
        this.$api.get('/Template/query',{}, r => {
          if(r.err_code=="0"){
            _this.map_list=r.data;
            // if(_this.map_list.length>0) {
            //   _this.mapId = _this.map_list[0].id;
            //   //_this.initMap(_this.mapId);
            //   _this.ztshow.id=_this.mapId;
            // }
            //this.dialogInfo.data={};
          }else{
            _this.$message.warning(r.err_msg);
          }
        });
      },

    },
    watch: {

    },
    components:{DialogZtMapAdd,DialogZtIndex}
}
</script>
