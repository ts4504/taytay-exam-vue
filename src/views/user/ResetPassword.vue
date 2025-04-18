<script setup>
import { ref } from 'vue';
import useUserInfoStore from '@/stores/userInfo';
import {updatePwdService} from '@/api/user'
import { ElMessage } from 'element-plus';
const userInfoStore = useUserInfoStore()

//表单模型
const resetForm = ref({
    username:'',
    oldPwd:'',
    newPwd:'',
    rePwd:''
})
resetForm.value.username = userInfoStore.info.username

//自定义确认密码的校验规则
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码！'))
    } else if (value !== resetForm.value.newPwd) {
        callback(new Error('两次密码不一致！'))
    } else {
        callback()
    }
}

//定义表单校验规则
const resetFormrules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
        { min: 5, max: 16, message: '用户名必须是5-16位非空字符', trigger: 'blur' }
    ],
    oldPwd: [
        { required: true, message: '原密码不能为空', trigger: 'blur' },
        { min: 5, max: 16, message: '密码必须是5-16位非空字符', trigger: 'blur' }
    ],
    newPwd: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 5, max: 16, message: '密码必须是5-16位非空字符', trigger: 'blur' }
    ],
    rePwd: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

//调用修改密码的接口方法
const updatePwd = async () => {
    let result = await updatePwdService(resetForm.value)
    ElMessage.success(result.messsge || '修改成功！')
}


</script>

<template>
        <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">重置密码</span>
            </div>
        </template>

        <el-row>
            <el-col :span="12">
                <el-form :model="resetForm" :rules="resetFormrules" label-width="100px" size="large">
                    <el-form-item label="登录名称：">
                        <el-input v-model="resetForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="原密码：" prop="oldPwd">
                        <el-input v-model="resetForm.oldPwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码：" prop="newPwd">
                        <el-input v-model="resetForm.newPwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="rePwd">
                        <el-input v-model="resetForm.rePwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePwd()">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>