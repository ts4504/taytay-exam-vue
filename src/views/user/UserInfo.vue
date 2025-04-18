<script setup>
import useUserInfoStore from '@/stores/userInfo';
import {updateUserInfoService} from '@/api/user'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
const userInfoStore = useUserInfoStore()


//更新用户信息
const updateUserInfo=async()=>{
    console.log(userInfoStore.info);
    let result = await updateUserInfoService(userInfoStore.info)
    ElMessage.success("修改成功！")
}


</script>

<template>
<el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfoStore" :rules="rules" label-width="100px" size="large" label-position="right">
                    <el-form-item label="用户名">
                        <el-input v-model="userInfoStore.info.username" disabled></el-input>
                    </el-form-item>
                   
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userInfoStore.info.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="userInfoStore.info.phone"></el-input>
                    </el-form-item>
                    <!-- 教师 -->
                    <el-form-item label="工号" prop="number" v-if="userInfoStore.info.role === 'teacher'">
                        <el-input v-model="userInfoStore.info.teacherNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="学院" prop="department" v-if="userInfoStore.info.role === 'teacher'">
                        <el-input v-model="userInfoStore.info.department"></el-input>
                    </el-form-item>
                    <el-form-item label="职称" prop="title" v-if="userInfoStore.info.role === 'teacher'">
                        <el-input v-model="userInfoStore.info.title"></el-input>
                    </el-form-item>
                    <!-- 学生 -->
                    <el-form-item label="学号" prop="number" v-if="userInfoStore.info.role === 'student'">
                        <el-input v-model="userInfoStore.info.studentNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="年级" prop="grade" v-if="userInfoStore.info.role === 'student'">
                        <el-input v-model="userInfoStore.info.grade"></el-input>
                    </el-form-item>
                    <el-form-item label="专业" prop="major" v-if="userInfoStore.info.role === 'student'">
                        <el-input v-model="userInfoStore.info.major"></el-input>
                    </el-form-item>
                    <el-form-item label="班级" prop="clazz" v-if="userInfoStore.info.role === 'student'">
                        <el-input v-model="userInfoStore.info.clazz"></el-input>
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo()" >提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>