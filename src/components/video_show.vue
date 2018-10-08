<template>
    <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="1000px" :append-to-body='true':before-close="bclose">
        <div class="loncom_dialog_con video_show" style="height:500px;overflow:hidden;">
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
        </div>
    </el-dialog>
</template>
<style>
    .video_show .show_box,
    .video_show .show_title{
        height: 100%;
    }

</style>
<script>
export default {
    created () {
       

    },
    mounted() {
        this.show();
    },
    data() {
        return {
            
        }
    },
    methods:{
        //00202：海康，00201：大华
        //format("登录用户名称","密码","IP","端口号","通道")
        getVideoRTSP:function(type){
            switch (type) {
                case "00202":
                    return "rtsp://"+this.dialogInfo.row.userid+":"+this.dialogInfo.row.paswd+"@"+this.dialogInfo.row.ip+":"+this.dialogInfo.row.port+"/Streaming/Channels/"+this.dialogInfo.row.code+"01";
                    break;
                case "00201":
                    return "rtsp://"+this.dialogInfo.row.userid+":"+this.dialogInfo.row.paswd+"@"+this.dialogInfo.row.ip+":"+this.dialogInfo.row.port+"/cam/realmonitor?channel="+this.dialogInfo.row.code+"&subtype=1";
                    break;
                case 3:
                    break;
                default:
                    break;
            }
        },
        
        show:function(){
            var _this=this;
            if(!this ||!this._isDestroyed){
                  clearInterval(pageTimer["timeobj"]);
            }
            var mtime=this.dialogInfo.row.mtime?this.dialogInfo.row.mtime:5000;
            var vlc = document.getElementById("vlcs");
            if(vlc!=undefined&&vlc!=null){
                var rtspTemplate=this.getVideoRTSP(this.dialogInfo.row.type);
                vlc.playlist.clear();
                var id = vlc.playlist.add(rtspTemplate);
                vlc.playlist.playItem(id);
                vlc.playlist.play();
            }
            pageTimer["timeobj"] = setInterval(function () {
                var vlc = document.getElementById("vlcs");
                if(vlc.input){
                if (vlc.input.state == 0 || vlc.input.state == 7 || vlc.input.state == 6 || vlc.playlist.isPlaying==false) {
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

    
    props:["dialogInfo"],
    components:{}

}
</script>

