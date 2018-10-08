<template>
    <div class="loncom_content control_gis">
        <div class="loncom_public_top">
            <div class="search loncom_fl">
                组态视图
            </div>
        </div>
        <div class="loncom_public_con" style="padding:0;">
          <div class="loncom_tree">
            <div class="loncom_tree_title">
              组态站点
            </div>
            <div class="loncom_tree_con numScroll0">
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
          </div>
          <div class=" loncom_scroll_con" style="height:100%;text-align:center;position:relative;float:left;margin:0 auto;width:calc(100% - 250px)">
            <ztShow v-bind:ztshow="ztshow" v-if="ztshow.id" ></ztShow>

          </div>
      </div>
    </div>
</template>

<style>

</style>

<script>
var axios = require('axios')
import ZtShow from '../../components/ztShow.vue'
export default {

    created () {
      this.getTree()
    },
    mounted() {
       scrollCon()
       numScroll(0);
        //获取配置文件
        axios.get('static/config/zutai.json').then(r=>{
            if(r.status==200){
                this.title=r.data.title;
            }else{
                this.$message.warning("配置文件读取失败");
            }
        });
    },
    data() {
       return {
        treeLoading:true,
           title:'',
         tree_data: [],
         defaultProps: {
           children: 'children',
           label: 'label'
         },
         ztshow:{id:'',name:''}
       }
   },
    methods:{
      getTree:function(){
        ///addr/ScAddrDevTree
        this.$api.get('/addr/GisAddrTree', {isHavePoint:false}, r => {
          console.log(r)
          this.treeLoading= false;
          if(r.err_code=="0"){
            this.tree_data=r.data;
          }else{
            this.$message.warning(r.err_msg);
          }
        });
      },
        enter:function(){
            this.$router.push({path:'/control/scsi/garden'});
        },
      nodeClick:function (data,node) {

        if(data.map && data.map.templateid){
          this.ztshow = {id:data.map.templateid,name:data.map.templatename};
        }else{
          this.ztshow = {id:'',name:''};
        }
      }

    },
    watch:{


    },
    components:{ZtShow}
}
</script>
