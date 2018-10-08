<template>
    <div class="loncom_content control_list">
       <div class="loncom_public_top">
            <div class="search loncom_fl">
                <el-input placeholder="请输入池塘名称" v-model="searchInfo" size="mini">
                    <el-button slot="append" icon="el-icon-search" id="search_btn"></el-button>
                </el-input>
            </div>
            <div class="sort loncom_fr">
                <ul>
                    <li class="active" data-name="all">全部</li>
                    <li class="warning" data-name="warning"><em></em>危险池塘</li>
                    <li class="lost" data-name="lost"><em></em>失联池塘</li>
                    <li class="normal" data-name="normal"><em></em>健康池塘</li>
                </ul>
            </div>
        </div>
       <div class="loncom_public_con loncom_scroll_con">
            <ul class="list_ul">
                <li v-for="item in list_data">
                    <div v-if="item.commstart>0&&(show=='all'||show=='warning')">
                        <div class="list_con list_con_warning" @click="detail(item)">
                            <div class="list_con_title">{{item.fname}}</div>
                            <div class="list_content">
                                <div class="list_content_left">
                                    <p>监控状态：<span class="state">异常</span>
                                    </p>
                                    <p>池塘面积：<span>{{item.farea}}</span></p>
                                    <p style="height:45px;overflow:hidden;">鱼苗：<span :title="item.ftype">{{item.ftype}}</span></p>
                                </div>
                                <div class="list_content_right">
                                    <img :src="'static/upload/'+item.fimageurl">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.commstart<0&&(show=='all'||show=='lost')">
                        <div class="list_con list_con_lost" @click="detail(item)">
                            <div class="list_con_title">{{item.fname}}</div>
                            <div class="list_content">
                                <div class="list_content_left">
                                    <p>监控状态：<span class="state">失联</span>
                                    </p>
                                    <p>池塘面积：<span>{{item.farea}}</span></p>
                                    <p style="height:45px;overflow:hidden;">鱼苗：<span :title="item.ftype">{{item.ftype}}</span></p>
                                </div>
                                <div class="list_content_right">
                                    <img :src="'static/upload/'+item.fimageurl">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.commstart==0&&(show=='all'||show=='normal')" >
                        <div class="list_con" @click="detail(item)">
                            <div class="list_con_title">{{item.fname}}</div>
                            <div class="list_content">
                                <div class="list_content_left">
                                    <p>监控状态：<span class="state">正常</span>
                                    </p>
                                    <p>池塘面积：<span>{{item.farea}}</span></p>
                                    <p style="height:45px;overflow:hidden;">鱼苗：<span :title="item.ftype">{{item.ftype}}</span></p>
                                </div>
                                <div class="list_content_right">
                                    <img :src="'static/upload/'+item.fimageurl">
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
       </div>
    </div>
</template>
<style>
    .control_list .search{
        width: 250px;
    }
    .control_list .sort ul{
        border: 1px solid #D5D4D1;
        border-radius: 4px;
        background: #fff;
        overflow:hidden;
    }
    .control_list .sort li{
        width:80px;
        height: 28px;
        float: left;
        text-align: center;
        line-height: 28px;
        font-size:12px;
        border-right: 1px solid #D5D4D1;
        cursor: pointer;
    }
    .control_list .sort li:nth-last-of-type(1){
        border: none;
    }
    .control_list .sort li.active{
        color: #fff;
        background:#13AE67;
    }
    .control_list .sort li em{
        width: 14px;
        height: 20px;
        display: inline-block;
        margin-right: 5px;
        vertical-align: middle;
    }
    .control_list .sort li.warning em{
        background: url(../../../static/images/sli_warning.svg) no-repeat;
    }
    .control_list .sort li.lost em{
        background: url(../../../static/images/sli_lost.svg) no-repeat;
    }
    .control_list .sort li.normal em{
        background: url(../../../static/images/sli_normal.svg) no-repeat;
    }
    .control_list .loncom_public_con{
        width: 100%;
        padding:15px;
        height: calc(100% - 40px);
    }
    .control_list .loncom_public_con li{
        width: 25%;
        float: left;
    }
    .control_list .loncom_public_con li>div{
        padding: 15px;
    }
    .control_list .list_con{
        width: 100%;
        height: auto;
        overflow:hidden;
        border-radius:5px;
        box-shadow: 0px 1px 7px #ccc;
        cursor:pointer;
    }
    .control_list .list_con_title{
        width: 100%;
        height: 35px;
        line-height: 35px;
        background: #12AE67;
        color: #fff;
        text-indent: 10px;
    }
    .control_list .list_con_lost .list_con_title{
        background: #919191;
    }
    .control_list .list_con_warning .list_con_title{
        background: #C50000;
    }
    .control_list .list_content{
        padding: 10px;
        overflow: hidden;
    }
    .control_list .list_content_left{
        line-height:24px;
        font-size: 12px;
        float:left;
        width:calc(100% - 120px);
    }
    .control_list .list_content_right{
        width:120px;
        height:auto;
        float: left;
    }
    .control_list .list_content_right img{
        width: 120px;
        height: 100px;
        /*max-height: 100px;*/
    }
    .control_list .state{
        color: #12AE67;
    }
    .control_list .list_con_lost .state{
        color: #919191;
    }
    .control_list .list_con_warning .state{
        color:#C50000;
    }


</style>

<script>
import controlTop from '@/components/control_top.vue'
export default {
    created () {
        this.getList();

    },
    mounted() {
        scrollCon();
        //搜索
        var _this=this;
        $("#search_btn").on("click",function(){
            _this.getList();
        })
        //头部切换
        $(".sort").find("li").on("click", function () {
            $(this).siblings("li").removeClass("active");
            $(this).addClass("active");
            _this.show=$(this).data("name");
        })



    },
    data() {
       return {
          searchInfo:'',
          list_data:[],
          show:'all',
       }
   },
    methods:{
       getList:function(){
      if (this && this._isDestroyed) {return}
           if(this.$store.state.control_list.query){
               this.$api.post('/gis/queryscinfoall', {fname:this.searchInfo}, r => {
                    if(r.err_code=="0"){
                        this.list_data=r.data;
                        setTimeout(()=>{this.getList()},2000);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
           }
       },
       detail:function(item){
           if(this.$store.state.control_list.details){
            if(item.fworkshop){
                this.$router.push({path:'/control/list/detail',query:{addrid:item.fworkshop}});

            }else{
                  this.$message.warning("该地点未关联池塘！");
            }
               
            
            
           }
       },

    },
    watch:{
        searchInfo:function(val,oldval){
            this.getList();
        },
        list_data:function(val){
            var _this=this;
            var arr=[];
            for(var i=0;i<val.length;i++){
                arr.push(val[i].fworkshop);
            }
            // wsConnection({cmd:"getaddrstate",data:arr},function(r){
            //     var result=JSON.parse(r.data);
            //     console.log(result)
            //     if(result[0].cmd=="addrstate"){
            //         for(var i=0;i<result[0].data.length;i++){
            //             for(var j=0;j<_this.list_data.length;j++){
            //                 if(_this.list_data[j].fworkshop==result[0].data[i].key){
            //                     _this.list_data[j].commstart=result[0].data[i].commstart;
            //                 }
            //             }
            //         }
            //     }
            // })
        },
    },
    components:{controlTop}
}
</script>
