<template>
    <el-dialog title="组态模版预览" :visible.sync="dialogInfo.visible" :fullscreen="true">
     <ztShow v-bind:ztshow="ztshow" v-if="ztshow.id" ></ztShow>

        <!--<div slot="footer" class="dialog-footer">-->
            <!--<el-button @click="dialogCancel">取 消</el-button>-->
            <!--<el-button type="primary" @click="dialogSure('formInfo')">保 存</el-button>-->
        <!--</div>-->
    </el-dialog>
</template>
<style>
.el-dialog__body{
  height:100%;
}
</style>
<script>
  import ZtShow from '../components/ztShow.vue'
  const axios = require('axios')
export default {
    created () {
      this.ztshow=this.dialogInfo.data;

    },
    mounted() {

    },
    data() {
        return {
          ztshow:{
            id:'',
            name:''
          }
        }
    },
    methods:{



    },

    watch:{
        'dialog_info.data':function(val,oldVal){
            this.map_list=val;
        }
    },
    props:["dialogInfo"],
  components:{ZtShow}
}
</script>

