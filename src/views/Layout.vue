<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    House,
    Reading,
    Collection,
    Files,
    Edit,
    Coin,
    Finished,
    CopyDocument,
    Menu
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'


import useUserInfoStore from '@/stores/userInfo';
import { useTokenStore } from '@/stores/token';
import {getUserInfoService} from '@/api/user'
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router';
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
//获取用户信息
const getUserInfo=async()=>{
    let result = await getUserInfoService();
    userInfoStore.setInfo(result.data)    
}
getUserInfo()

//将英文替换一下
const getRole=()=>{
    console.log(userInfoStore.info.role);
    
    if(userInfoStore.info.role === 'student'){
        return '学生'
    }else if(userInfoStore.info.role === 'teacher'){
        return '教师'
    }else{
        return '管理员'
    }
}

const handleCommand=(command)=>{
    //判断指令
    if(command === 'logout'){
        ElMessageBox.confirm(
            '您确认要退出登录吗？',
            '温馨提示',
            {
                confirmButtonText:'确认',
                cancelButtonText:'取消',
                type:'warning'
            }
        ).then(async()=>{
            userInfoStore.removeInfo()
            tokenStore.removeToken();
            router.push('/login')
            ElMessage.success({
                type:'success',
                message:'退出成功！'
            })
        }).catch(()=>{
            ElMessage({
                type:"info",
                message:'用户取消了退出登录'
            })
        })
    }else{
        //路由
        router.push('/'+command)
    }

}

</script>

<template>
    <el-container class="layout-container">

        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#5965C9" text-color="#fff" router>
                <!-- 教师菜单项 -->
                <el-menu-item index="/teacher/start" v-if="userInfoStore.info.role === 'teacher'">
                    <el-icon><House /></el-icon>
                    <span>首页</span>
                </el-menu-item>
                <el-menu-item index="/teacher/course" v-if="userInfoStore.info.role === 'teacher'">
                    <el-icon><Reading /></el-icon>
                    <span>课程管理</span>
                </el-menu-item>
                <el-sub-menu index="exam-management" v-if="userInfoStore.info.role === 'teacher'">
                    <template #title>
                        <el-icon><Collection /></el-icon>
                        <span>考务管理</span>
                    </template>
                    <el-menu-item index="/teacher/question">
                        <el-icon><Coin/></el-icon>
                        <span>题库管理</span>
                    </el-menu-item>
                    <el-menu-item index="/teacher/paper">
                        <el-icon><Files/></el-icon>
                        <span>试卷管理</span>
                    </el-menu-item>
                    <el-menu-item index="/teacher/exam">
                        <el-icon><Promotion/></el-icon>
                        <span>考试管理</span>
                    </el-menu-item>
                    <el-menu-item index="/teacher/grade">
                        <el-icon><Edit /></el-icon>
                        <span>成绩管理</span>
                    </el-menu-item>
                </el-sub-menu>


                <!-- 学生菜单项 -->
                <el-menu-item index="/student/start" v-if="userInfoStore.info.role === 'student'">
                    <el-icon><House /></el-icon>
                    <span>首页</span>
                </el-menu-item>
                <el-menu-item index="/student/course" v-if="userInfoStore.info.role === 'student'">
                    <el-icon><Reading /></el-icon>
                    <span>课程</span>
                </el-menu-item>
                <el-menu-item index="/student/exam" v-if="userInfoStore.info.role === 'student'">
                    <el-icon><Promotion /></el-icon>
                    <span>考试</span>
                </el-menu-item>
                <el-menu-item index="/student/grade" v-if="userInfoStore.info.role === 'student'">
                    <el-icon><Finished /></el-icon>
                    <span>成绩</span>
                </el-menu-item>


                <!-- 管理员菜单项 -->
                <el-menu-item index="/admin/announcement">
                    <el-icon><Menu /></el-icon>
                    <span>公告管理</span>
                </el-menu-item>
                <el-menu-item index="/teacher/course" v-if="userInfoStore.info.role === 'admin'">
                    <el-icon><Reading /></el-icon>
                    <span>课程管理</span>
                </el-menu-item>
                <el-sub-menu index="exam-management" v-if="userInfoStore.info.role === 'admin'">
                    <template #title>
                        <el-icon><Collection /></el-icon>
                        <span>考务管理</span>
                    </template>
                    <el-menu-item index="/teacher/question">
                        <el-icon><Coin/></el-icon>
                        <span>题库管理</span>
                    </el-menu-item>
                    <el-menu-item index="/teacher/paper">
                        <el-icon><Files/></el-icon>
                        <span>试卷管理</span>
                    </el-menu-item>
                    <el-menu-item index="/teacher/exam">
                        <el-icon><Promotion/></el-icon>
                        <span>考试管理</span>
                    </el-menu-item>
                    <el-menu-item index="/teacher/grade">
                        <el-icon><Edit /></el-icon>
                        <span>成绩管理</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="user-management" v-if="userInfoStore.info.role === 'admin'">
                    <template #title>
                        <el-icon><CopyDocument /></el-icon>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/admin/students">
                        <span>学生信息</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/teachers">
                        <span>教师信息</span>
                    </el-menu-item>
                    <el-menu-item index="/admins">
                        <span>管理员信息</span>
                    </el-menu-item>
                </el-sub-menu>


                
                <!-- 公共菜单项--个人信息 -->
                <el-sub-menu index="user-center">
                    <template #title>
                        <el-icon><UserFilled /></el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/userInfo">
                        <el-icon><User /></el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/avatar">
                        <el-icon><Crop /></el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/reset">
                        <el-icon><EditPen /></el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>


                


            </el-menu>
        </el-aside>


        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>{{ getRole() }}：<strong>{{ userInfoStore.info.username }}</strong></div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.avatar?userInfoStore.info.avatar:avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="userInfo" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="reset" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <div style="width: 1450px; height: 570px;;">
                    <router-view></router-view>
                </div>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>大学生考试系统 ©2025 Created by 周彤-毕设</el-footer>
        </el-container>


    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #5965C9;

        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>