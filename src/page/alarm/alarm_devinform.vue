<template>
    <div class="loncom_content">
       <div class="loncom_public_top">
            <div class="loncom_fl">设备通知</div>
        </div>
        <div class="loncom_public_con loncom_scroll_con">
            <el-search-table-pagination  type="local"
                url=""
                list-field="list" 
                total-field="total"
                method='post' 
                
                border :data="table_data" :columns="table_columns" ref="thisRef">   
                <el-table-column slot="prepend" type="selection"></el-table-column>   
               
                <template slot-scope="scope" slot="preview-handle">
                    <div>
                        <a href="javascript:;" class="loncom_color" @click="edit (scope.row)" v-if="$store.state.record_pool.edit">编辑</a> 
                        <em v-if="$store.state.record_pool.edit&&$store.state.record_pool.remove">|</em>
                        <a href="javascript:;" class="loncom_color" @click="remove (scope.row)" v-if="$store.state.record_pool.remove">删除</a> 
                    </div>
                </template>
            </el-search-table-pagination>
       </div>
    </div>
</template>


<script>
export default {
    created () {
        this.getList()
    },
    mounted() {
        scrollCon();
    },
    data() {
       return {
          　table_data:[],
            table_columns:[
              { prop: 'use_id', label: '用户名',minWidth:10},
              { prop: 'outtime', label: '告警时间',minWidth:10},
              { prop: 'content', label: '告警内容',minWidth:30},
              { prop: 'isout', label: '发送状态',minWidth:10},
            ],
            
            multipleSelection:[],


       }
   },
    methods:{
        
        //获取
        getList:function(){
            if(this.$store.state.alarm_devInform.query){
                this.$api.post('/alarmsendout/query', {}, r => {
                    console.log(r)
                    if(r.err_code=="0"){
                        this.table_data=r.data;
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            }
        },
       
    },
    components:{}
}
</script>