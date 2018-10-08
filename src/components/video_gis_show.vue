<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="1000px" :append-to-body='true' :before-close="bclose">
        <div class="loncom_dialog_con video_gis_show" style="height:500px;overflow:hidden;">
            <div class="show_box">
                <object type='application/x-vlc-plugin' ref="vlcs" id='vlcs' events='True' width="100%" height="100%" pluginspage="http://www.videolan.org" codebase="http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz">
                    <param name='mrl' />
                    <param name="ShowDisplay" value="true" />
                    <param name='volume' value='50' />
                    <param name='autoplay' value='true' />
                    <param name='loop' value='false' />
                    <param name='fullscreen' value='true' />
                    <EMBED pluginspage="http://www.videolan.org"
                    type="application/x-vlc-plugin"
                    version="VideoLAN.VLCPlugin.2"
                    width="100%"
                    height="100%"
                    text="Waiting for video"
                    name="vlcs"
                    ></EMBED>
                </object>
            </div>
            <el-scrollbar class="loncom_scrollbar">
                <ul class="title">
                    <li v-for="(item,i) in this.dialogInfo.data">
                        <el-radio v-model="index" :label="i">{{item.servername}}</el-radio>
                    </li>
                </ul>
            </el-scrollbar>
        </div>
    </el-dialog>
</template>
<style>
    .video_gis_show .show_box,
    .video_gis_show .loncom_scrollbar{
        height: 100%;
    }
    .video_gis_show .show_box{
        width: 800px;
        float:left;
    }
    .video_gis_show .loncom_scrollbar{
        width: calc(100% - 800px);
        padding-left: 15px;
        float:left;
    }
    .video_gis_show .title li{
        height:30px;
    }

</style>
<script>
export default {
    created () {
       console.log(this.dialogInfo)
       this.row=this.dialogInfo.data[0];
    },
    mounted() {
        var _this=this;
        $(this.$refs.title).find("li").on("click",function(){
            $(_this.$refs.title).find("span").removeClass("active");
            $(this).find("span").addClass("active");
        });
    },
    data() {
        return {
            index:0,
            row:{}
        }
    },
    methods:{
        changeShow:function(item){
            this.row=item;
        },
        //00202：海康，00201：大华
        //format("登录用户名称","密码","IP","端口号","通道")
        getVideoRTSP:function(type){
            switch (type) {
                case "00202":
                    return "rtsp://"+this.row.userid+":"+this.row.paswd+"@"+this.row.ip+":"+this.row.port+"/Streaming/Channels/"+this.row.code+"01";
                    break;
                case "00201":
                    return "rtsp://"+this.row.userid+":"+this.row.paswd+"@"+this.row.ip+":"+this.row.port+"/cam/realmonitor?channel="+this.row.code+"&subtype=1";
                    break;
                case 3:
                    break;
                default:
                    break;
            }
        },
        
        show:function(){
            console.log(1)
            var _this=this;
            var mtime=this.row.mtime?this.row.mtime:5000;
            var vlc = document.getElementById("vlcs");
            if(vlc!=undefined&&vlc!=null){
                var rtspTemplate=this.getVideoRTSP(this.row.type);
                vlc.playlist.clear();
                var id = vlc.playlist.add(rtspTemplate);
                vlc.playlist.playItem(id);
                vlc.playlist.play();
            }
            pageTimer["timeobj"] = setInterval(function () {
                var vlc = document.getElementById("vlcs");
               
                if(vlc.input){
                if ( vlc.input.state && (vlc.input.state == 0 || vlc.input.state == 7 || vlc.input.state == 6 || vlc.playlist.isPlaying==false)) {
                    clearInterval(pageTimer["timeobj"]);
                    _this.show();
                }
            }
            },mtime);


        },
        bclose:function(){
            for(var each in pageTimer){
                clearInterval(pageTimer[each]);
            }
            this.dialogInfo.visible=false;
        },

    },

    watch:{
        index:function(val){
            this.row=this.dialogInfo.data[val];
            console.log(this.row)
        },
        row:function(val,oldval){
            this.show();
        },
        "dialogInfo.visible":function(){
            console.log(timeobj)
        }
    },
    props:["dialogInfo"],
    components:{}

}
</script>

