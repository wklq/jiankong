<template>
    <div class="title">
        <div class="loncom_fl loncom_mr10">用户列表</div>
        <div class="serach_list loncom_fl">
            <span class="all active" data-name="">全部</span>
            <span class="A" data-name="a">A</span>
            <span class="B" data-name="b">B</span>
            <span class="C" data-name="c">C</span>
            <span class="D" data-name="d">D</span>
            <span class="E" data-name="e">E</span>
            <span class="F" data-name="f">F</span>
            <span class="G" data-name="g">G</span>
            <span class="H" data-name="h">H</span>
            <span class="I" data-name="i">I</span>
            <span class="J" data-name="j">J</span>
            <span class="K" data-name="k">K</span>
            <span class="L" data-name="l">L</span>
            <span class="M" data-name="m">M</span>
            <span class="N" data-name="n">N</span>
            <span class="O" data-name="o">O</span>
            <span class="P" data-name="p">P</span>
            <span class="Q" data-name="q">Q</span>
            <span class="R" data-name="r">R</span>
            <span class="S" data-name="s">S</span>
            <span class="T" data-name="t">T</span>
            <span class="U" data-name="u">U</span>
            <span class="V" data-name="v">V</span>
            <span class="W" data-name="w">W</span>
            <span class="X" data-name="x">X</span>
            <span class="Y" data-name="y">Y</span>
            <span class="Z" data-name="z">Z</span>
        </div>
    </div>
</template>
<style>
    
</style>

<script>
export default {
    created () {
        
    },
    mounted() {
        var _this=this;
        $(".title").find("span").on("click",function(){
            _this.search=[];
            
            if($(this).hasClass("all")){
                $(".title").find("span").removeClass("active");
                $(this).addClass("active");
                this.search='';
            }else{
                if($(".title .all").hasClass("active")){
                    $(".title .all").removeClass("active");
                }
                if($(this).hasClass("active")){
                    if($(".title").find(".active").length==1){
                         $(".title .all").addClass("active");
                    }   
                    $(this).removeClass("active");
                }else{
                    $(this).addClass("active");
                }
            }
            var list=$(".title").find(".active");
            for(var i=0;i<list.length;i++){
                _this.search.push($(list[i]).data("name"));
            }
        })
    },
    data() {
       return {
          　search:[],
       }
   },
    methods:{
       getUser:function(){
           this.$emit('getUser',this.search.toString()); 
       },
    },
    watch:{
        search:{
          handler:function(val,oldval){
            this.getUser();
          },
          deep: true
        }
   },
    props:[],
    components:{}
}
</script>