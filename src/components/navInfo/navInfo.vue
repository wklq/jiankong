<template>
    <div class="loncom_content">
        <div class="loncom_topnav">
            <div class="loncom_topnav_logo loncom_fl">
                <router-link to="/index">
                    <img src="static/images/logo.png">
                </router-link>
            </div>
            <ul class="loncom_fl" ref="nav_list">
                <li v-for="(item,index) in navList">
                    <router-link :to="item.url" exact v-if="item.url=='/'">
                        <em><img :src="item.icon"></em>
                        <p>{{item.name}}</p>
                    </router-link>
                    <router-link :to="item.url" v-else>
                        <em><img :src="item.icon"></em>
                        <p>{{item.name}}</p>
                    </router-link>
                </li>
            </ul>
            <div class="loncom_fr loncom_topnav_span">
                <span style="cursor:pointer;" @click="showAlarm">
                    <el-badge :value="alarmcount" :max="99" class="item">
                        <i class="fa fa-bell-o"></i>
                    </el-badge>
                </span>
                <span>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <i class="fa fa-user-circle-o"></i><i class="fa fa-caret-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>{{loginInfo.username}}</el-dropdown-item>
                            <span @click="logout">
                            <el-dropdown-item style="text-align:center"><i class="fa fa-power-off loncom_mr5"></i>退出</el-dropdown-item>
                            </span>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
            </div>
        </div>
        <div class="loncom_con">
            <div class="loncom_con_left" ref="loncom_con_left">
                <div class="loncom_left_navtop" @click="navClick" ref="loncom_left_navtop" v-if="leftShow">
                    <i class="fa fa-bars" ref="bars"></i>
                </div>
                <div class="loncom_left_navcon" ref="sidebar_list">
                    <ul>
                        <li v-for="item in leftNavList">
                            <router-link :to="item.url" ref="lon_link">
                                <div class="lon_nav" ref="lon_nav" @click="moreNav(item)">
                                    <em><img :src="item.icon"></em>
                                    <span v-if="navbtn=='close'">{{item.name}}</span>
                                    <span v-if="navbtn=='open'">{{item.fullname}}</span>
                                    <!--<i v-if="navbtn=='open'&&item.item&&item.item.length>0"><img src="static/images/sanjiao.png"></i>-->
                                </div>
                                <dl v-show="navbtn=='open'">
                                    <dd v-for="inItem in item.item">
                                        <router-link :to="inItem.url">
                                            <em><img :src="inItem.icon"></em>
                                            <span>{{inItem.fullname}}</span>
                                        </router-link>
                                    </dd>
                                </dl>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loncom_con_right" ref="loncom_con_right">
                <router-view v-if="isRouterAlive"></router-view>
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
    created () {
        this.navList=this.$store.state.navList;
        //获取活动告警条数
       this.getAlarmCounts();
        
    },
    mounted() {
       this.loginInfo=sessionStorage.loginInfo?JSON.parse(sessionStorage.loginInfo):{};
        if(JSON.stringify(this.loginInfo) == "{}"){
            this.$message.warning("请登录系统");
            this.$router.push({path:'/login'});
            return;
        }else{
            this.Init();   
        }

        var _this=this;
        var loginInfo={};
        if(sessionStorage.loginInfo){
            loginInfo=JSON.parse(sessionStorage.loginInfo);
        }
        // wsConnection({cmd:"getalarm",data:[loginInfo.roleid]},function(r){
        //     var data=JSON.parse(r.data);
        //     if(data[0].cmd=="alramcount"){
        //         _this.alarmcount=data[0].data[0];
        //     }
        // })


    },
    computed:{
      ...mapGetters([
        'getNavInfo'
      ])
    },
    data(){
      return {
          alarmcount:0,
          loginInfo:{},
            navbtn:'close',
            navList:[],
            leftNavList:[],
            isRouterAlive:true,  //默认view-router显示的，点击刷新用
            leftShow:false,
      }
    },
    methods:{
        //获取告警铃铛
        getAlarmCounts:function(){
            var _this = this;
              if (this && this._isDestroyed) {return}
         this.$api.post('/Alarmstrategy/alarmcount', {}, r => {
                    if(r.err_code=="0"){
                        this.alarmcount=r.data.alarmcount;
                        setTimeout(()=>{_this.getAlarmCounts()},2000);
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                });
        },
        //点击告警跳转
        showAlarm:function(){
            this.$router.push({path:"/alarm/realtime"});
        },
        Init(){
            var path=this.$route.path;
            var hasPath=false;
            for(var i=0;i<this.navList.length;i++){
                for(var j=0;j<this.navList[i].item.length;j++){
                    if(path.indexOf(this.navList[i].item[j].url)!=-1){
                        hasPath=true; //有子菜单
                        this.leftNavList=this.navList[i].item;
                        break;
                    }
                }
            }
            if(!hasPath){ //没有子菜单
                this.leftNavList=[];
                this.leftShow=false;
                $(this.$refs.loncom_con_right).css({"padding-left":"0"});
            }else{

                this.leftShow=true;
            }
            if(JSON.stringify(sessionStorage.navInfo) == undefined){
                sessionStorage.navInfo = JSON.stringify({navbtn:'close'});
            }else{
                this.navbtn = JSON.parse(sessionStorage.navInfo).navbtn;
            }
            
        },
        //初始化侧边菜单
        InitLeft:function(){
           
            if(this.leftShow){
                if(this.navbtn==='close'){
                    $(this.$refs.loncom_con_left).css("width","60px");
                    $(this.$refs.loncom_con_right).css({
                        "padding-left":"60px",
                        
                    });
                    $(this.$refs.bars).css({
                        'transform':'rotate(0deg)'
                    })
                    $(".loncom_left_navcon").find("span").css({
                        "display":"block",
                        "text-align":'center'
                    });
                }else{
                    $(this.$refs.loncom_con_left).css({"width":"200px"});
                    $(this.$refs.loncom_con_right).css({
                        "padding-left":"200px",
                    });
                    $(this.$refs.bars).css({
                        'transform':'rotate(90deg)'
                    })
                    $(".loncom_left_navcon").find("span").css({
                        "display":"inline-block",
                        "text-align":'left'
                    });
                }
            }else{
                $(this.$refs.loncom_con_left).css({"width":"0px"});
                $(this.$refs.loncom_con_right).css({
                    "padding-left":"0px",
                });
            }
            
        },
        //切换宽窄侧边导航
        navClick:function(){
            var navInfo = JSON.parse(sessionStorage.navInfo);
            if(this.navbtn=='open'){
                $(this.$refs.loncom_con_left).css("width","60px");
                $(this.$refs.loncom_con_right).css({
                    "padding-left":"60px",
                });
                $(this.$refs.bars).css({
                    'transform':'rotate(0deg)'
                })
                $(".loncom_left_navcon").find("span").css({
                    "display":"block",
                    "text-align":'center'
                });
                this.navbtn='close';
                navInfo.navbtn='close';
            }else{
                $(this.$refs.loncom_con_left).css("width","200px");
                $(this.$refs.loncom_con_right).css({
                    "padding-left":"200px",
                });
                $(this.$refs.bars).css({
                    'transform':'rotate(90deg)'
                })
                $(".loncom_left_navcon").find("span").css({
                    "display":"inline-block",
                    "text-align":'left'
                });
                this.navbtn='open';
                navInfo.navbtn='open';
            }
            sessionStorage.navInfo = JSON.stringify(navInfo);
       },
       //点击是否显示三级导航
       moreNav:function(item){
        var navInfo = JSON.parse(sessionStorage.navInfo);
            if(item.item.length>0 &&   this.navbtn!=='open'){
                $(this.$refs.loncom_con_left).css("width","200px");
                $(this.$refs.loncom_con_right).css({
                    "padding-left":"200px",
                });
                $(this.$refs.bars).css({
                    'transform':'rotate(90deg)'
                })
                $(".loncom_left_navcon").find("span").css({
                    "display":"inline-block",
                    "text-align":'left'
                });
                this.navbtn='open';
                navInfo.navbtn='open';
            }
            sessionStorage.navInfo = JSON.stringify(navInfo);
       },
       trans:function(){
           return false
       },
       //点击刷新
        reload:function() {
            this.isRouterAlive = false
            this.$nextTick(() => {
                this.isRouterAlive = true
            })
        },   
        //注销登录
        logout:function(){
           this.$confirm("确定注销登录?", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type:'warning',
	        }).then(() => {
		    	 this.$api.post('/User/out', {}, r => {
                    if(r.err_code=="0"){
                        this.$message.success(r.err_msg);
                        this.$store.commit('resetModel',{})
                        this.$router.push({path:'/login'});
                        if(sessionStorage.loginInfo){
                            sessionStorage.removeItem('loginInfo');
                        }
                    }else{
                        this.$message.warning(r.err_msg);
                    }
                }); 
                
            });
        },

    }, 
    watch:{
        getNavInfo: function(val) { 
            this.navList=val;
        },
        leftNavList:{
          handler:function(val,oldval){
              this.InitLeft();
          },
          deep: true
        },
        navList:function(val,oldval){
            var _this=this;
            this.$nextTick(function(){
                $(this.$refs.sidebar_list).find("a").on("click",function(){
                    _this.reload()
                })
                $(this.$refs.nav_list).find("a").on("click",function(){
                    _this.reload()
                })
            })
        },
        "$route": function(val){
            var _this=this;
            // console.log(topAlarm)
            // if(topAlarm){
            //     clearInterval(topAlarm);
            // }
            map_url="static/map/tiles/";
            this.$nextTick(() => {
                this.Init();
            })
            
        }
    } 
}
</script>

