<script setup>
import { userLoginService, userRegisterService } from '@/api/user'
import router from '@/router'
import { useTokenStore } from '@/stores/token'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage, roleTypes } from 'element-plus'
import { ref } from 'vue'


//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)

const registerForm = ref({
    username: '',
    password: '',
    rePassword: '',
    role: ''
})

//rePassword的自定义校验规则
const checkRePwd = (rule, value, callback) => {
    if (value === '') {
        callback(new Error("请再次确认密码！"))
    } if (value !== registerForm.value.password) {
        callback(new Error("两次密码不一致！"))
    } else {
        callback()
    }
}

//验证规则
const registerRule = {
    username: [
        { required: true, message: "用户名不能为空", trigger: 'blur' },
    ],
    password: [
        { required: true, message: "密码不能为空", trigger: 'blur' },
        { min: 5, max: 16, message: "字符长度必须是5-16位之间", trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkRePwd, trigger: 'blur' }
    ],
    role: [
        { required: true, message: "请选择角色", trigger: 'blur' }
    ]
}

const clearForm = () => {
    registerForm.value.username = ''
    registerForm.value.password = ''
    registerForm.value.rePassword = ''
    registerForm.value.role = ''
}


const tokenStore = useTokenStore()
//登录函数
const login = async () => {
    let result = await userLoginService(registerForm.value)
    ElMessage.success("登录成功！");
    tokenStore.setToken(result.data);
    router.push('/')
    clearForm()
}

//注册函数
const register = async () => {
    let result = await userRegisterService(registerForm.value)
    ElMessage.success("注册成功！请登录");
    clearForm()
    isRegister.value = false

}

</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">


            <!-- 注册表单 -->
            <el-form :model="registerForm" ref="form" size="large" autocomplete="off" v-if="isRegister"
                :rules="registerRule">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="registerForm.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="registerForm.password" :prefix-icon="Lock" type="password"
                        placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input v-model="registerForm.rePassword" :prefix-icon="Lock" type="password"
                        placeholder="请输入再次密码"></el-input>
                </el-form-item>
                <el-form-item prop="role">
                    <el-select v-model="registerForm.role" placeholder="请选择角色">
                        <el-option label="学生" value="student" />
                        <el-option label="教师" value="teacher" />
                        <el-option label="管理员" value="admin" />
                    </el-select>
                </el-form-item>

                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register()">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false; clearForm()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>


            <!-- 登录表单 -->
            <el-form :model="registerForm" :rules="registerRule" ref="form" size="large" autocomplete="off" v-else>
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="registerForm.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="registerForm.password" name="password" :prefix-icon="Lock" type="password"
                        placeholder="请输入密码"></el-input>
                </el-form-item>


                <el-form-item prop="role">
                    <el-select v-model="registerForm.role" placeholder="请选择角色">
                        <el-option label="学生" value="student" />
                        <el-option label="教师" value="teacher" />
                        <el-option label="管理员" value="admin" />
                    </el-select>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login()">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true; clearForm()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 400px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>