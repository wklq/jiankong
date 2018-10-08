<template>
    <div class="loncom_content limits_role">
       <div class="loncom_public_top">
            <div class="loncom_fl">角色管理</div>
        </div>
        <div class="loncom_public_con">
            <div class="loncom_tree">
                <div class="loncom_tree_title">
                    角色
                </div>
                <div class="loncom_tree_con numScroll0">
                    <div class="numScrollCon0">
                        <el-button type="primary" size="small" style="width: 100%;margin-bottom:10px;" @click="addRole" v-if="$store.state.limits_role.add">添加角色</el-button>
                        <div class="search loncom_mb10" style="width:100%;">
                            <el-input placeholder="请输入角色名称" v-model="searchInfo" size="mini">
                                <el-button slot="append" icon="el-icon-search" size="mini"></el-button>
                            </el-input>
                        </div>
                        <el-tree
                        ref="tree"
                        v-loading = 'treeLoading'
                        :props="{'label': 'name'}"
                        :data="tree_data"
                        node-key="id"
                        default-expand-all
                        @node-click="nodeClick"
                        :filter-node-method="filterNode"
                        >
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="loncom_table">
                <div class="loncom_tab">
                    <div class="loncom_tab_btn">
                        <el-button type="primary" size="mini" @click="save('formInfo')" v-if="$store.state.limits_role.add||$store.state.limits_role.edit">保存</el-button>
                        <el-button type="primary" size="mini" @click="remove" v-if="$store.state.limits_role.remove">删除</el-button>
                    </div>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="基本信息" name="first">
                            <div class="loncom_tabbox numScroll1">
                                <div class="loncom_tabbox_con numScrollCon1">
                                    <div style="width:450px;padding-top:30px;">
                                        <el-form :model="form_info" :rules="formRules" ref="formInfo" label-width="120px">
                                            <el-form-item prop="name" label="名称" size="small">
                                                <el-input v-model="form_info.name"></el-input>
                                            </el-form-item>
                                            <el-form-item prop="type" label="角色级别" size="small">
                                                <el-radio-group v-model="form_info.type">
                                                    <el-radio label="1">管理员</el-radio>
                                                    <el-radio label="2">普通</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                            <el-form-item prop="state" label="是否启用" size="small">
                                                <el-radio v-model="form_info.state" value="1" label="1">启用</el-radio>
                                                <el-radio v-model="form_info.state" value="0" label="0">禁用</el-radio>
                                            </el-form-item>
                                            <el-form-item prop="details" label="备注" size="small">
                                                <el-input v-model="form_info.details" type="textarea"></el-input>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="权限" name="second">
                            <div class="loncom_tabbox">
                                <div class="loncom_tabbox_con tabtree">
                                    <el-row style="height:100%;">
                                        <el-col :span="10" :offset="2" style="height:100%;">
                                            <h2>管理域</h2>
                                            <el-scrollbar style="height:calc(100% - 40px)">
                                            <el-tree
                                            ref="tree1"
                                            show-checkbox
                                          
                                            :props="defaultProps"
                                            :data="tree_data1"
                                            node-key="id"
                                            @check-change="changeSite"
                                            default-expand-all
                                            >
                                            </el-tree>
                                            </el-scrollbar>
                                        </el-col>
                                        <el-col :span="10" style="height:100%;">
                                            <h2>操作菜单</h2>
                                            <el-scrollbar style="height:calc(100% - 40px)">
                                            <el-tree
                                            ref="tree2"
                                            show-checkbox
                                            :props="defaultProps"
                                            :data="tree_data2"
                                            @check-change="changeNav"
                                            node-key="id"
                                           
                                            >
                                            </el-tree>
                                            </el-scrollbar>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    .limits_role .tabtree{padding-top:30px;height:100%;}
    .limits_role .tabtree h2{height:40px;line-height:40px;color:#0096BA}
</style>

<script>
export default {
    created () {
        this.getRole();
        this.getSite();
        this.getNav();
    },
    mounted() {
        numScroll(0);
        numScroll(1);
        numScroll(2);
    },
    data() {
       return {
            treeLoading:true,
           searchInfo:'',
          　tree_data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            activeName: 'first',
            getInfo:{
                title:"获取用户信息",
                visible:false,
                id:'',
                data:[],
            },
            form_info:{
                id:'',
                name:'',
                type:'1', //是否管理员
                state:'1',
                details:'',
            },
            formRules:{
                name:[
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                type:[
                    { required: true, message: '请选择级别', trigger: 'change' },
                ],
                state:[
                    { required: true, message: '请选择是否启用', trigger: 'change' },
                ],
            },

            tree_data1: [],
            tree_data2: [],
            site:[],
            nav:[],
            navchecked:[],
            navhalfchecked:[],

       }
   },
    methods:{
        //获取角色
        getRole:function(){
            if(this.$store.state.limits_role.query){
                this.$api.post('/role/query', {}, r => {
                    this.treeLoading= false;
                    if(r.err_code=="0"){
                        this.tree_data=r.data;
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
            }
            
        },
        nodeClick:function(data,node){
            this.form_info=Object.assign({}, node.data);
            this.$api.post('/role/addrquery', {roleid:node.data.id}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    var arr=[];
                    for(var i=0;i<r.data.length;i++){
                        arr.push(r.data[i].addrid);
                    }
                    this.$refs.tree1.setCheckedKeys(arr);
                }else{
                    this.$message.warning(r.err_msg);
                }
            });
            this.$api.post('/role/rolemenu', {roleid:node.data.id}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.$refs.tree2.setCheckedKeys(r.data);
                }else{
                    this.$message.warning(r.err_msg);
                }
            });

        },
        //点击新增角色,重置填写
        addRole:function(){
            this.form_info.id="";
            this.$refs['formInfo'].resetFields();
            this.$refs.tree1.setCheckedKeys([]);
            this.$refs.tree2.setCheckedKeys([]);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        handleClick(tab, event) {
            
        },
        //删除角色
        remove:function(){
            if(this.form_info.id==""){
                this.$message.warning("请选择点击需要删除的角色");
            }else{
                this.$confirm("确定删除?", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning',
                }).then(() => {
                    this.$api.post('/role/delete', {id:this.form_info.id}, r => {
                        console.log(r)
                        if(r.err_code=="0"){
                            this.$message.success(r.err_msg);
                            this.$refs['formInfo'].resetFields();
                            this.getRole();
                        }else{
                            this.$message.warning(r.err_msg);
                        }
                    });
                });
                
            }
        },
        save:function(formName){
            this.$refs[formName].validate((valid) => {
                if(valid){

                    this.changeNav();
                    this.lastNav();  //菜单勾选的
                    console.log(this.nav);
                    console.log(this.site);
                    if(this.form_info.id==""){//新增角色
                        if(this.$store.state.limits_role.add){
                            this.$api.post('/role/add', {model:{obj:this.form_info,itemr:this.site,item:this.nav}}, r => {
                                if(r.err_code=="0"){
                                    this.$message.success(r.err_msg);
                                    this.addRole();
                                    this.getRole();
                                }else{
                                    this.$message.warning(r.err_msg);
                                }
                            });
                        }else{
                            this.$message.warning("您没有新增权限");
                        }
                        
                    }else{ //修改角色
                        if(this.$store.state.limits_role.edit){
                            this.$api.post('/role/update', {model:{obj:this.form_info,itemr:this.site,item:this.nav}}, r => {
                                if(r.err_code=="0"){
                                    this.$message.success(r.err_msg);
                                    this.getRole();
                                }else{
                                    this.$message.warning(r.err_msg);
                                }
                            });
                        }else{
                            this.$message.warning("您没有修改权限");
                        }
                        
                    }
                }
            })
        },
        //获取站点域
        getSite:function(){
            this.$api.post('/addr/tree', {}, r => {
                console.log(r)
                if(r.err_code=="0"){
                    this.tree_data1=r.data;
                }else{
                    this.$message.warning(r.err_msg);
                }
            }); 
        },
        changeSite:function(){
            this.site=this.$refs.tree1.getCheckedNodes();
            for(let a = 0;a<this.site.length;a++){
                this.site[a].half = 0;
            }
            var halfSite= this.$refs.tree1.getHalfCheckedNodes();
            if(halfSite.length>0){
                for(let i = 0;i<halfSite.length;i++){
                    halfSite[i].half = 1;
                    this.site.push(halfSite[i]);
                }
            }

        },
        //获取菜单
        getNav:function(){
            this.$api.post('/SysBase/tree', {}, r => {
                if(r.err_code=="0"){
                    this.tree_data2=r.data;
                }else{
                    this.$message.warning(r.err_msg);
                }
            }); 
        },
        changeNav:function(){
            this.navchecked=this.$refs.tree2.getCheckedNodes(true);
            this.navhalfchecked  = this.$refs.tree2.getHalfCheckedNodes();
           
            
        },
        lastNav:function(){
            this.nav =[];
           
            if(this.navchecked.length>0){
            for(let i=0;i<this.navchecked.length;i++){              
                var node=this.$refs.tree2.getNode(this.navchecked[i].id);
                // var vid = node.this.navchecked[i].map.vid;
                this.setNav(node.parent,node.data.map.vid);
            }
            // if(this.navhalfchecked.length>0){
            //    for(let a=0;a<this.navhalfchecked.length;a++){
            //     this.navhalfchecked[a].half = 1;
            //   this.nav.push(this.navhalfchecked[a]);
            // } 
            // }
        }
        
        },
        setNav:function(node,vid){
          
            var flag=true;
            var sameSate =false;
            if(this.navhalfchecked.length>0){
            for(var i=0;i<this.navhalfchecked.length;i++){
                if(this.navhalfchecked[i].id==node.data.id){
                    flag=false;
                   
                    // if(vid){
                    //     var arr=[this.nav[i].roperid];
                    //     arr.push(vid);
                    //     this.nav[i].roperid=arr.toString();
                    // }
                }
            }
        }
        if(this.nav.length>0){
           for(var b=0;b<this.nav.length;b++){
                if(this.nav[b].id==node.data.id){
                 
                   sameSate = true;
                    if(vid){
                        var arr=[this.nav[b].roperid];
                        arr.push(vid);
                        this.nav[b].roperid=arr.toString();
                    }
                }
            } 
        }
            if(flag){
                node.data.half = 0;
            }else{
                node.data.half = 1;
            }
                
                if(!sameSate){
                    if(vid){
                        node.data.roperid=vid;
                    }else{
                        node.data.roperid="";
                    }
                 this.nav.push(node.data);}
               
            
            if(node.parent.level!=0){
                this.setNav(node.parent)
            }

        },

    },
    watch: {
      searchInfo(val) {
        this.$refs.tree.filter(val);
      }
    },
    components:{}
}
</script>