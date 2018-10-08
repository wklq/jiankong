<template>
    <Pool v-bind:publicInfo="Info"></Pool>
</template>

<script>
import Pool from '@/page/public/pool.vue'
export default {
    created () {
        this.obj = this.$route.query;
        if(JSON.stringify(this.obj) != "{}"){ //
            this.Info.addrid=this.obj.addrid;
           this.obj.backUrl &&(this.Info.backUrl=this.obj.backUrl);
        }
    },
    mounted() {
        
    },
    data() {
       return {
           obj:'',
            Info:{
                id:'',  //池塘id
               addrid:'',
               backUrl:'/control/list',
            },
       }
   },
    methods:{
        
    },
    watch:{
        
    },
    components:{Pool}
}
</script>