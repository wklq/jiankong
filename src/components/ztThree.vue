<template>
    <div :style='{
            width:dialogInfo.json.pic_size.width+"px",
            height:dialogInfo.json.pic_size.height+"px",
            left:dialogInfo.json.pic_offset.offsetX+"px",
            top:dialogInfo.json.pic_offset.offsetY+"px",
            border:selected?"1px solid #085576":"0"}'
        class="loncom_canvas_smallimg" >
        <img
        :data-setting='dialogInfo.setting'
        :data-type="dialogInfo.type"

        :id='dialogInfo.json.id||dialogInfo.id'
        :src="dialogInfo.json.imgUrl||dialogInfo.imgUrl"
        :ref='dialogInfo.json.id||dialogInfo.id'
        draggable="true" @dragstart="drag($event)" @click="showDetail($event)"
        >
    </div>
  <!--:data-devid="dialogInfo.devid"-->
</template>


<script>

export default {
    created () {
       
        this.canvasWidth = $("#canvas").width();
        
    },
    mounted() {
        var _this=this;
        $("#canvas").resize(function () {
         
            _this.nowOffset();
        });
        this.nowOffset();
    },
    data() {
       return {
        canvasWidth:'',
       selected:false,
       }
   },
    methods:{
       //拖拽
        drag:function(ev){
            this.$parent.img_ev=ev;
            this.$parent.img_html=this;
        },

        nowOffset:function(){
            this.$emit('initDevice',this);
        },
        //点击查询设备详情
        showDetail:function(event){
             this.$parent.$children.map((item,i)=>{
                  item.selected = false;
               })
            this.selected = true;
            this.$parent.img_html=this;
            this.$emit('showDetail',event);
        },

    },
    props:["dialogInfo","navClick"],
}
</script>




