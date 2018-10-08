<template>
    <div class="loncom_content">
       <div class="loncom_public_top">
            <div class="loncom_fl">分析管理</div>
        </div>
        <div class="loncom_public_con" style="background:#fff;padding-bottom:0;">
              <div style="overflow:hidden;margin-bottom:15px;">
                <div class="loncom_fl loncom_mr10">
                  <el-date-picker
                    v-model="value7"
                    type="datetimerange"
                    align="right"
                    size="small"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2">
                  </el-date-picker>
                </div>
                <div class="loncom_fl loncom_mr10">
                  <el-input v-model="input2" placeholder="测点信息" readonly size="small" @focus="getPoint"></el-input>
                </div>
                <div class="loncom_fl">
                  <el-button type="primary" size="small" @click="search">搜索</el-button>
                </div>
                <div class="loncom_fr">
                  <el-button type="primary" size="small" @click="exp"  ><i class="fa fa-upload loncom_mr5"></i>导出</el-button>
                </div>
              </div>
              <div style="overflow:hidden;">
                <div style='float: left;line-height: 40px;width:80px;'>您已选择：</div>
                <el-scrollbar style="width:calc(100% - 80px);height:40px;float:left;" class="loncom_scrollbar">
                    <div>
                      <span v-for="(item,index) in get_point.data" style="margin-right:10px;display:inline-block;">
                      <el-button type="primary" size="small"  @click="remove(item)" plain style='float: left;'>{{item.map.templatename}}<i class="el-icon-close el-icon--right"></i></el-button>
                      </span>
                    </div>
                </el-scrollbar>
              </div>
              <el-tabs v-model="activeName" style="height:calc(100% - 87px)"  @tab-click="handleClick">
                <el-tab-pane label="表格分析" name="first" class="numScroll0">
                    <div class="numScrollCon0">
                        <div style="margin:10px 0;">
                          <el-radio-group v-model="pointradio" size="small">
                            <div v-for="item in nameArr" style="display:inline">
                            <el-radio-button :label="item.id">{{item.map.templatename}}</el-radio-button>
                            </div>
                          </el-radio-group>
                        </div>
                        <div>
                            <el-search-table-pagination 
                                  :url="rootUrl+'/analysis/querytable1'"
                                   list-field="data.items" 
                                    total-field="data.count"
                                  :params="table_forms.initParams"
                                  method='post'
                                  :formOptions="table_forms"
                                  border :data="table_data" :columns="table_columns" ref="thisRef">
                                  <!--
                                  <template  v-for="item in idsArr" slot-scope="scope" :slot="'preview-'+item">
                                      <div style="width:100%;" v-if='eidtState'>
                                          <el-input v-model="scope.row[item]" style="width:100%;"></el-input>
                                      </div>
                                      <div v-else>
                                        <span>{{scope.row[item]}}</span>
                                      </div>
                                  </template>
                                  -->
                                  <template slot-scope="scope" slot="preview-value">
                                      <div style="width:100%;" v-if='eidtState'>
                                          <el-input v-model="scope.row.value" style="width:100%;"></el-input>
                                      </div>
                                      <div v-else>
                                        <span>{{scope.row.value}}</span>
                                      </div>
                                  </template>
                                  <template slot-scope="scope" slot="preview-handle">
                                      <div style="width:100%;">
                                          <span @click="save(scope.row,scope.$index)" style="cursor:pointer">保存</span>
                                      </div>
                                  </template>
                              </el-search-table-pagination>
                        </div>
                      
                    </div>
                </el-tab-pane>
                <el-tab-pane label="曲线分析" name="second" class="numScroll1">
                    <div id="analyze" class="analyze_box"></div>
                    
                </el-tab-pane>
              </el-tabs>
       </div>
       <GetPool v-bind:dialogInfo="get_pool" v-if="get_pool.visible"></GetPool>
       <GetPoint v-bind:dialogInfo="get_point" v-if="get_point.visible"></GetPoint>
    </div>
</template>

<style>
  .analyze_box{
    width:100%;
    height: calc(100% - 20px);
  }
  .el-date-editor .el-range-separator{
    width:7%;
  }
</style>

<script>
import GetPool from '@/components/pool_get.vue'
import GetPoint from '@/components/record_analyze_point.vue'
const axios = require('axios');
export default {
    created () {
      
      this.eidtState = Boolean(this.$store.state.record_analyze.edit);
      this.rootUrl = rootUrl;
      //v-loading.fullscreen.lock="loading"
    },
    mounted() {
        numScroll("0");
      //numScroll("1");
        // var lineMore0=lineMore("analyze0")
        // var lineMore1=lineMore("analyze1")
        // var lineMore2=lineMore("analyze2")

    },
    data() {
       return {
        eidtState:'',//权限
         rootUrl:'',
          value7:'',
          input1:'',
          _input1:'',//池塘id
          input2:'',
          _input2:'',//测点id
          showtable:false, //显示table
          idsArr:[],  //测点slot数组
          nameArr:[],  //测点名称
          pointradio:'',  //点击测点切换表格
          pickerOptions2: {
            shortcuts: [{
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          activeName: 'first',
          radio2:1,
          table_data:[],
          table_forms: {
            inline: true,
            size:'small',
            initParams:{id:"",begintime:'',endtime:''},
            forms: []
          },
          table_columns:[
            { prop: 'devname', label: '设备名称',minWidth:10},
            { prop: 'addr', label: '位置',minWidth:30},
            { prop: "value", label: '采集值',minWidth:10,slotName:'preview-value'},
            { prop: "hdata", label: '采集时间',minWidth:10},
            { prop: 'handle', label: '操作',slotName:'preview-handle'},
            // { prop: "P1000000002", label: '采集值',minWidth:10},
            // { prop: "P1000000001", label: '采集时间',minWidth:30},
            // { prop: 'handle', label: '状态'},
          ],
          get_pool:{
            visible:false,
            data:[],
          },
          get_point:{
            visible:false,
            data:[],
          },
         line_data:[],
         yData:[],
         lineNums:[],
          tableClick:'折线分析',
         isSearch:false,
         loading:true,
         lineNum:'',
       }
   },
    methods:{
      save:function(row,index){
        console.log(row)
        console.log(index)
        this.$api.post("/analysis/updaterpt",row,r => {
            console.log(r)
          if(r.err_code=="0"){
           this.$message.success(r.err_msg);
          }else{
            this.$message.warning(r.err_msg);
          }
        })
      },
      getPool:function(){
          this.get_pool.visible=true;
      },
      getPoint:function(){
          this.get_point.visible=true;
          console.log(this.get_point)
      },
      search:function(){
          if(!this.value7){
            this.$message.warning('请选择查询的时间段');
            return;
          }else{
            this.table_forms.initParams.begintime=this.value7[0].Format('yyyy-MM-dd hh:mm:ss');
            this.table_forms.initParams.endtime=this.value7[1].Format('yyyy-MM-dd hh:mm:ss');
          }
          if(!this._input2){
            this.$message.warning('请选择查询的测点点位');
            return;
          }else{
            this.nameArr=Object.assign([], this.get_point.data);
            this.table_forms.initParams.id=this.pointradio=this.get_point.data[0].id;
          }
          // this.line_data = []
          // const lineNames = this.input2.split(','),
          //       ids = this._input2.split(',');
          // for(var i=0;i<ids.length;i++){
          //   this.idsArr.push('P'+ids[i])
          // }
          // this.table_columns= [
          //   { prop: 'hdata', label: '采集时间',minWidth:10},
          //   { prop: 'devname', label: '设备名称',minWidth:10},
          //   { prop: 'addr', label: '位置',minWidth:30}
          // ];
          // lineNames.forEach((item,i) => {
          //   this.line_data.push({id:ids[i],name:item})
          //   this.table_columns.push({ prop: 'P'+ids[i], label: item,minWidth:10,slotName:'preview-P'+ids[i]},)
          // })
          // if(this.eidtState){
          //   this.table_columns.push({prop:'handle',label:"操作",slotName:'preview-handle'})
          // }
          
          this.isSearch = true;
          // if(this.tableClick ==='折线分析'){
          //   this.drawLine();
          // }else{
          //   this.initTable();
          // }
          this.drawLine();

      },
      //画线
      drawLine:function(){
        let _this = this;
        this.$api.post("/analysis/queryrpt1",{begintime:this.value7[0].Format('yyyy-MM-dd hh:mm:ss'),
          endtime:this.value7[1].Format('yyyy-MM-dd hh:mm:ss'),id:this._input2},r => {
          console.log(r);
          console.log(this.nameArr)
          debugger;
          if(r.err_code=="0"){
            const datas = r.data;
            let xData = r.data.time;
            let yData = [];
            let lgData = [];
            for(var i=0;i<this.nameArr.length;i++){
              lgData.push(this.nameArr[i].map.templatename);
              for(var j=0;j<r.data.data.length;j++){
                if(this.nameArr[i].id==r.data.data[j].key){
                  var json={
                    name:this.nameArr[i].map.templatename,
                    type:'line',
                    smooth:"true", //平滑
                    symbol:"line", //不要圆圈
                    symbolSize:0, //平滑的时候设置为0
                    data:r.data.data[j].data
                  };
                  yData.push(json);
                  break;
                }
              }
            }
            this.lineNum = lineMore('analyze',xData,yData,lgData);
            $(".analyze_box").resize(function(){
              _this.lineNum.resize();
            })

            // _this.line_data.forEach((item,i)=>{
            //   let xData = [];
            //   let yData = [];
            //   let lgData = [];
            //   if(datas[item.id]){

            //     xData =datas[item.id].time;
            //     _this.yData.forEach((jtem,j) =>{
            //       if(datas[item.id][jtem.id]){
            //         jtem.data.data = datas[item.id][jtem.id];
            //         lgData.push(jtem.data.name);
            //         yData.push(jtem.data);
            //       }
            //     })

            //   }
            //   const lineNum  = lineMore('analyze'+i,item.name,xData,yData,lgData);
            //   _this.lineNums.push({id:item.id,canvasObj:lineNum});
            // })
            // $(".analyze_box").resize(function(){
            //   _this.lineNums.forEach((item,i) => {
            //     item.canvasObj.resize();
            //   })

            // })

          }else{
            this.$message.warning(r.err_msg);
          }
        })
      },
      //table加载
      initTable:function(){
        //用异步
        // let _this = this;
        // this.$api.get("/analysis/querytable",{addrid:this._input1,begintime:this.value7[0].Format('yyyy-MM-dd hh:mm:ss'),
        //   endtime:this.value7[1].Format('yyyy-MM-dd hh:mm:ss'),pid:this._input2},r => {
        //     console.log(r)
        //   if(r.err_code=="0"){
        //     //this.tableClick = false;
        //    _this.table_data = r.data;
        //     _this.loading=false;

        //   }else{
        //     this.$message.warning(r.err_msg);
        //   }
        // })
      },
      //标签切换
      handleClick:function(tab,event){
        
        if(tab.label ===this.tableClick){
          return;
        }
        this.tableClick = tab.label;
        if(!this.isSearch){
           this.loading=false;
          return;
        }
        // if(tab.label === "表格分析"){

        // //  this.initTable();
        // }else{

        //   this.drawLine();
        // }

      },
      //导出
      exp:function(){
            if(!this.isSearch){
              return;
            }
            if( this.tableClick ==='表格分析'){
              let downloadElement = document.createElement('a')
              let href=window.document.location.origin+rootUrl+ "/export/exportrpttablecount1?begintime="
              +this.value7[0].Format('yyyy-MM-dd hh:mm:ss')+'&endtime='+this.value7[1].Format('yyyy-MM-dd hh:mm:ss') +
                '&id='+this._input2;
              downloadElement.href = href
              document.body.appendChild(downloadElement)
              downloadElement.click()
              document.body.removeChild(downloadElement) // 下载完成移除元素
              window.URL.revokeObjectURL(href) // 释放掉blob对象



            }else{
              let postData = {begintime:this.value7[0].Format('yyyy-MM-dd hh:mm:ss'),
                endtime:this.value7[1].Format('yyyy-MM-dd hh:mm:ss'),id:this._input2};

              // this.lineNums.forEach((item,i) => {
              //   const a =  item.canvasObj.getDataURL();
              //   const aId = "P"+item.id;
              //   postData[aId] = a;
              // })

              postData.imgurl=this.lineNum.getDataURL();
              console.log(postData)
              debugger;
              this.$api.post("/export/rptcount1",postData,r => {
                console.log(r)
              if(r.err_code=="0"){
                let url = '/iSmacSite'+r.data;

                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                console.log(url);
                link.setAttribute('download', 'excel.xls')

                document.body.appendChild(link)
                link.click();
                window.URL.revokeObjectURL(link.href); // 释放URL 对象
                  document.body.removeChild(link);
              }else{
                this.$message.warning(r.err_msg);
              }

            })
          }
        },
        remove:function(item){
            for(var i=0;i<this.get_point.data.length;i++){
              if(this.get_point.data[i].id==item.id){
                this.get_point.data.splice(i,1);
                 this.pointFn(this.get_point.data);
                 break;
              }
            }
        },
        pointFn:function(val){
            console.log(val)
            this.get_point.data=val;
            var _id=[]
            var _name=[];
            for(var i=0;i<val.length;i++){
              _id.push(val[i].id)
              _name.push(val[i].label);
            }
            this.input2=_name.toString();
            this._input2=_id.toString();
        },
        
    },
    watch:{
        'get_pool.data':{
            handler:function(val,oldval){
              console.log(val)
              this.yData =[];
              var _id=[]
              var _name=[];
              for(var i=0;i<val.length;i++){
                _id.push(val[i].fworkshop);
                _name.push(val[i].fname);
                this.yData.push({id: val[i].fworkshop,data:{
                  name:val[i].fname,
                  type:'line',
                  smooth:"true", //平滑
                  symbol:"line", //不要圆圈
                  symbolSize:0, //平滑的时候设置为0
                  data:[]
                }})
              }
                this.input1=_name.toString();
                this._input1=_id.toString();

            },
            deep: true
        },
        'get_point.data':{
            handler:function(val,oldval){
              console.log(val)
              this.pointFn(val);
            },
            deep: true
        },
        pointradio:function(val){
            if(val!=""){
              this.table_forms.initParams.id=val;
            }
        },
        
    },
    components:{GetPool,GetPoint}
}
</script>
