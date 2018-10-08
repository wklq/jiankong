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
        }
    },
    mounted() {
        
    },
    data() {
       return {
           obj:'',
            Info:{
               addrid:'',
               backUrl:'/control/scsi/garden',
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