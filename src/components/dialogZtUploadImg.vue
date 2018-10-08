

<template>
  <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" :width="dialogInfo.width">
    <div class="loncom_public_table loncom_dialog_scroll" style="height:300px;padding:20px;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="上传图片" name="first">
          <div class="loncom_pt10">
            <el-upload
              class="upload-demo"
              list-type="picture-card"
              ref="upload"
              name="imgurl"
              :limit="1"
              :headers="config"
              action="/iSmacSite/ismacsite/upload"
              :file-list="fileList"
              :on-success="onSuccess"
              :on-error="onError"
              :on-change="onchange"
              :on-exceed="onexceed"
              :auto-upload="false">
              <i class="el-icon-plus"></i>
            </el-upload>

            <el-dialog :visible.sync="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

          </div>
        </el-tab-pane>
        <!--<el-tab-pane label="图片库" name="second">-->

        <!--</el-tab-pane>-->
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogCancel">取 消</el-button>
      <el-button type="primary" @click="dialogSure('formInfo')">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>

  export default {
    created () {

    },
    mounted() {

    },
    data() {
      return {
        dialog_info:this.dialogInfo,
        activeName:'first',
        //上传图片
        imageUrlList:[],
        fileList:[],
        dialogImageUrl: '',
        dialogVisible: false,
        config:{
          headers:{
            'Content-Type': 'multipart/form-data'
          }
        },
      }
    },
    methods:{
      //保存的操作
      dialogSure:function(){

        if(this.dialogImageUrl!=""){
          //this.$parent.canvas_img=this.dialogImageUrl;
          this.$refs.upload.submit();
          // console.log(this.imageUrlList)

           this.dialogInfo.visible=false;
          this.imageUrlList=[];
           this.dialogImageUrl="";
        }else{
          this.$message.warning("请上传图片或者选择图片!");
        }
      },
      //取消操作
      dialogCancel:function(){
        this.dialogInfo.visible=false;
      },
      //     //上传图片
      //     onSuccess:function(response, file, fileList){
      //       console.log(response)
      //       if(response.err_code=="0"){
      //         this.dialogImageUrl=response.data;
      //         this.imageUrlList[0].name=response.data;
      //         //this.submit();
      //       }else{
      //         this.$message.warning(r.err_msg);
      //       }
      //     },
      //   beforeUpload:function(file){
      //     var fileArry=file.name.split(".");
      //     var fileType=fileArry[fileArry.length-1];
      //     if(!(fileType=="png"||fileType=="jpg"||fileType=="PNG"||fileType=="JPG")){
      //       this.$message.error("图片格式只能为jpg或png!");
      //       return;
      //     }
      //     let config = {
      //       headers: {
      //         'Content-Type': 'multipart/form-data'
      //       }
      //     }; //添加请求头
      //     let fd = new FormData()
      //     fd.append('file', file)
      //     fd.append('headers', config)

      //     this.$api.post('/upload?templateid='+this.$parent.mapId,fd, r => {
      //       console.log(r)
      //       if(r.err_code=="0"){
      //         this.dialogImageUrl=r.data;
      //         this.imageUrlList.push({name:file.name,url:r.data})
      //       }
      //     });
      //   },
      //   handleRemove:function(file, fileList) {
      //         console.log(file, fileList);
      //     },
      //     handlePictureCardPreview:function(file) {
      //         this.dialogImageUrl = file.url;
      //         this.dialogVisible = true;
      //     },
      //     handleChange:function(file) {

      //         var fileArry=file.name.split(".");
      //         var fileType=fileArry[fileArry.length-1];
      //         if(fileType=="png"||fileType=="jpg"||fileType=="PNG"||fileType=="JPG"){
      //             this.dialogImageUrl=file.url;
      //             this.imageUrlList.push({name:file.name,url:file.url})
      //             // this.imageUrlList[0].name=file.name;
      //             // this.imageUrlList[0].url=file.url;
      //         }else{
      //             this.$message.error("图片格式只能为jpg或png!");
      //         }
      //    }
      onSuccess:function(response, file, fileList){
        console.log(response)
        if(response.err_code=="0"){
          this.$parent.canvas_img=response.data;

        }else{
          this.$message.warning(r.err_msg);
        }
      },
      onError:function(err, file, fileList){
        this.$message.warning(err);
      },
      onchange:function(file,fileList){
        var fileArry=file.name.split(".");
        var fileType=fileArry[fileArry.length-1];
        if(fileType=="png"||fileType=="jpg"||fileType=="PNG"||fileType=="JPG"){
          this.dialogImageUrl=file.url;
          this.imageUrlList.push({name:file.name,url:file.url})
          // this.imageUrlList[0].name=file.name;
          // this.imageUrlList[0].url=file.url;
        }else{
          this.$message.error("图片格式只能为jpg或png!");
        }
      },
      onexceed:function(){
        this.$message.warning("只能上传一张图片，如需更换图片，先去除已有图片");
      },

    },
    props:["dialogInfo"]
  }
</script>

