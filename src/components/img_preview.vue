<template>
    <el-dialog title="图片预览" :visible.sync="dialogInfo.visible" width="800px" :append-to-body='true'>
        <div style="text-align:center;width:100%;height:500px;line-height: 500px;">
            <img class="img_preview" :src="dialogInfo.url" alt="">
        </div>
    </el-dialog>
</template>
<style>
    .img_preview{
        max-width:100%;
        max-height:100%;
        vertical-align: middle;
    }
</style>
<script>
import dialogBtnInfo from './dialogBtnInfo.vue'
export default {
    created () {
       
    },
    mounted() {
        
    },
    data() {
        return {
           
        }
    },
    methods:{
        
    },
    
    props:["dialogInfo"],
    components:{dialogBtnInfo}

}
</script>

