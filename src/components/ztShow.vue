<template>
    <div id="canvas" class="loncom_zt_canvas" :style='{background:"url("+canvas_img+") center center / contain no-repeat"}'>
        <span v-for="item in three_list" v-if="item.state"><ztThreeShow  v-bind:dialogInfo="item" v-on:init="init"></ztThreeShow></span>
    </div>
</template>


<script>
import ZtThreeShow from './ztThreeShow.vue'
const axios = require('axios')
export default {
    created () {
        this.initMap();
    },
    mounted() {
      var _this = this;


    },
    data() {
       return {
            //canvas_img电子地图背景图片
            canvas_img:'',
            //width，height，背景图片大小
            canvas_info:{},
            //  三态图
            three_list:[],
            addr_list:[],
            timeoutCount:0,
       }
   },
    methods:{

        //设备组件改变时
        init:function(_this){
            var now_back={
                width: $("#canvas").width(),
                height: $("#canvas").height()
            }
            var loc = nowLocation(_this.dialogInfo.json.canvas_info, _this.dialogInfo.json.pic_offset,_this.dialogInfo.json.canvas_bg_info,now_back,_this.dialogInfo.json.pic_size);
            $(_this.$el).css({
                "left":loc.x.toFixed(2)+"px",
                "top":loc.y.toFixed(2)+"px",
                "width":loc.width.toFixed(2)+"px",
                "height":loc.height.toFixed(2)+"px"
            });
        },
      //根据template渲染地图
      initMap:function(){
        let _this = this;
        _this.three_list = [];
        _this.canvas_img = '';
        if(!this.ztshow.id){
          $("#canvas").hide();
          return;
        }else{
          $("#canvas").show();
        }
        axios.get('static/zutai/template/'+this.ztshow.id+'/temp.json').then(r=>{

          if(r.status==200){
            const temJson=r.data;

            console.log(temJson)
            //读取站点地图信息
            if(temJson) {
              _this.canvas_img = "static/upload/"+temJson.img;
              if (temJson.jsonArr.length > 0) {  //初始化时有设备
                let map_list=temJson.jsonArr;
                if(map_list.length>0) {
                  for (var i = 0; i < map_list.length; i++) {
                    switch (map_list[i].type) {
                      case "three":
                        _this.three_list.push(map_list[i]);
                        if(map_list[i].json.dataType==="0") {
                          _this.addr_list.push(map_list[i].id+'_'+map_list[i].json.dataSource.id);
                        }
                        break;
                    }
                  }
                }
              }
              _this.classData();
              // wsConnection({cmd:"getconfigure",data:this.addr_list},function(r){
              //   const data=JSON.parse(r.data)[0].data;
              //   console.dir(data);
              //   if(data.length>0){
              //     for(let i=0;i<data.length;i++){
              //       _this.three_list.map(function(val,j){
              //         if(val.id === data[i].emtid){
              //           if(data[i].alarm === -1) {
              //             val.imgUrl = val.json.imgUrl =val.json.lostImg[0];
              //           }else if(data[i].alarm ===0){
              //             val.imgUrl = val.json.imgUrl =val.json.normalImg[0];
              //           }else{
              //             val.imgUrl = val.json.imgUrl =val.json.alarmImg[0];
              //           }
              //         }
              //       })
              //     }
              //   }

              // })
            }
          }
        });
      },
      //数据接口
      classData:function() {
        var _this = this;
       if (this && this._isDestroyed) {return}
        
        if (this.three_list.length > 0) {
          let classDataArr = [];
          for (let i = 0;  i < this.three_list.length;i++) {
            classDataArr.push({
              id: this.three_list[i].id, type: this.three_list[i].json.dataType, pointId:
              this.three_list[i].json.dataSource.id
            })
          }
          this.$api.post('/gis/getZutaiAlarm', {data:classDataArr}, r => {
            if (r.err_code == "0") {
              clearInterval(_this.timeoutCount);
            _this.timeoutCount=setInterval(()=>{
              _this.classData();
            },2000);
              if(r.data.length>0){
                for(let i = 0;i<r.data.length;i++){
                  if(r.data[i].type ==0){
                      _this.three_list.map(function(val,j){
                        if(val.id === r.data[i].id){
                          if(r.data[i].alarmValue === -1) {
                           val.imgUrl = val.json.imgUrl =val.json.lostImg[0];
                          }else if(r.data[i].alarmValue ===0){
                            val.imgUrl = val.json.imgUrl =val.json.normalImg[0];
                          }else{
                            val.imgUrl = val.json.imgUrl =val.json.alarmImg[0];
                          }
                        }
                      })
                  }else{
                    _this.three_list.map(function(val,j){
                      if(val.id === r.data[i].id){

                        val.json.data = r.data[i].pointBean;
                      }
                    })
                  }
                }
              }

              console.log(r.data);
              //this.map_list=r.data;
              //this.map_list.splice(index, 1);
              //this.dialogInfo.data={};
            } else {
              this.$message.warning(r.err_msg);
            }
          })

        }

      }
    },

  //websoket更新数据
    updateVal:function(){

    },
    watch:{
        'ztshow.id':function(){
           
            this.initMap();
        },
    },
    props:["ztshow"],
    components:{ZtThreeShow}
}
</script>




