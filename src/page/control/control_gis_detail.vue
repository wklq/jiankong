<template>
    <div class="loncom_content control_gis">
        <div class="loncom_public_top">
            <div class="loncom_fl">
                <div class="zt_nav">
                    <router-link :to="{ path: '/' }">首页</router-link>
                    <span v-for="item in zt_nav">
                        <i @click="change(item)" style="cursor:pointer">{{item.name}}</i>
                    </span>
                </div>
            </div>
        </div>
        <div class="loncom_public_con loncom_scroll_con">
            <ZtShow v-bind:ztshow="ztshow" v-if="ztshow.id" ></ZtShow>
        </div>
    </div>
</template>

<style>
    .zt_nav span{
        margin-left: 10px;
        padding-left: 15px;
        position: relative;
    }
    .zt_nav span:before{
        content:'/';
        position:absolute;
        left:0;
    }
    .zt_nav span i{
        font-style:normal;
    }
</style>

<script>
var axios = require('axios')
import ZtShow from '@/components/ztShow.vue'
export default {

    created () {
        
        let obj = this.$route.query;
        this.zt_nav=sessionStorage.zt_nav?JSON.parse(sessionStorage.zt_nav):[];
        console.log(this.zt_nav)
        if(this.zt_nav.length==0){
            this.ztshow=obj;
            this.zt_nav.push(obj);
        }else{
            this.ztshow=this.zt_nav[this.zt_nav.length-1];
        }
    },
    mounted() {
       scrollCon()
        
    },
    data() {
       return {
            zt_nav:[],
            ztshow:{
                id:'',
                name:''
            }
       }
   },
    methods:{
        change:function(item){
            console.log(item)
            this.ztshow=item;
        },

    },
    watch:{
        ztshow:function(val){
            let has=false;
            let index=0;
            for(var i=0;i<this.zt_nav.length;i++){
                if(this.zt_nav[i].id==val.id){
                    has=true;
                    index=i+1;
                    break;
                }
            }
            if(has){
                this.zt_nav=this.zt_nav.slice(0,index);
            }else{
                this.zt_nav.push(val)
            }
            console.log(this.zt_nav)
            sessionStorage.zt_nav=JSON.stringify(this.zt_nav);

        },

    },
    components:{ZtShow}
}
</script>
