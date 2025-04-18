<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { getAllStudentService, addUserService, deleteUserService, updateUserInfoService } from '@/api/user'
import { useTokenStore } from '@/stores/token'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import avatar from '@/assets/default.png'

const tokenStore = useTokenStore()

//管理员列表
const students = ref([{
    "id": '',
    "username": '',
    "role": "student",
    "email": '',
    "phone": '',
    "createTime": '',
    "updateTime": '',
    "avatar": "",
    "studentNumber": null,
    "grade": null,
    "major": null,
    "clazz": null,
    "teacherNumber": null,
    "department": null,
    "title": null
}])

//获取所有管理员信息
const getStudentList = async () => {
    let result = await getAllStudentService()
    students.value = result.data
    console.log('--------获取管理员信息');

    console.log(students.value);

}
getStudentList()

//抽屉的可视
const visibleDrawer = ref(false)
//抽屉标题
const title = ref('')

//管理员信息表单
const studentModel = ref({
    'id': '',
    'username': '',
    'role': 'student',
    'avatar': '',
    'phone': '',
    'email': '',
    'createTime': '',
    'grade': '',
    'clazz': '',
    'major': ''
})

//清空表单
const clearStudentModel = () => {
    studentModel.value.username = ''
    studentModel.value.avatar = ''
    studentModel.value.phone = ''
    studentModel.value.email = ''
    studentModel.value.grade = ''
    studentModel.value.clazz = ''
    studentModel.value.major = ''
    studentModel.value.studentNumber = ''
}
//图片上传成功后执行：
const uploadSuccess = (result) => {
    studentModel.value.avatar = result.data
}

//添加管理员方法
const addStudent = async () => {
    console.log(studentModel.value);

    await addUserService(studentModel.value)
    ElMessage.success('添加成功！')
    getStudentList()
}


//删除管理员
const deleteStudent = async (id) => {

    ElMessageBox.confirm(
        '即将删除该用户，是否继续？',
        '温馨提示',
        {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        await deleteUserService(id);
        ElMessage({
            type: 'success',
            message: '删除成功！',
        })
        getStudentList()
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '管理员取消删除',
        })
    })
}

//更新信息抽屉
const showDrawer = (row) => {
    title.value = '修改用户信息'
    visibleDrawer.value = true
    studentModel.value.id = row.id
    studentModel.value.username = row.username
    studentModel.value.role = row.role
    studentModel.value.avatar = row.avatar
    studentModel.value.phone = row.phone
    studentModel.value.email = row.email
    studentModel.value.grade = row.grade
    studentModel.value.clazz = row.clazz
    studentModel.value.major = row.major
    studentModel.value.studentNumber = row.studentNumber
}

//更新管理员信息方法
const updateStudent = async () => {
    let result = await updateUserInfoService(studentModel.value)
    ElMessage.success('修改成功！')
    visibleDrawer.value = false
    clearStudentModel()
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">学生列表</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="clearStudentModel(); title = '添加学生'; visibleDrawer = true">添加学生</el-button>
                </div>
            </div>
        </template>

        <el-table :data="students">
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="头像" prop="avatar">
                <template #default="{ row }">
                    <el-avatar :src="row.avatar?row.avatar:avatar"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone" ></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="学号" prop="studentNumber">
                <template #default="{ row }">
                    <div v-if="row.studentNumber">{{ row.studentNumber }}</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column label="专业" prop="major">
                <template #default="{ row }">
                    <div v-if="row.major">{{ row.major }}</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column label="年级" prop="grade">
                <template #default="{ row }">
                    <div v-if="row.grade">{{ row.grade }}</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column label="班级" prop="clazz">
                <template #default="{ row }">
                    <div v-if="row.clazz">{{ row.clazz }}</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>

            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="primary" circle :icon="Edit" plain @click="showDrawer(row)"></el-button>
                    <el-button type="danger" circle :icon="Delete" plain @click="deleteStudent(row.id)"></el-button>
                </template>

            </el-table-column>

            <template #empty>
                <el-empty description="暂无学生哦" />
            </template>
        </el-table>


        <el-drawer :title="title" v-model="visibleDrawer" size="40%">
            <el-form :model="studentModel" label-width="100px">
                <el-form-item label="用户名：">
                    <el-input v-model="studentModel.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="角色：">学生</el-form-item>
                <el-form-item label="上传头像：">
                    <el-upload action="/api/upload" class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="studentModel.avatar" :src="studentModel.avatar" class="avatar">
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="studentModel.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input v-model="studentModel.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="学号：">
                    <el-input v-model="studentModel.studentNumber" placeholder="请输入学号"></el-input>
                </el-form-item> 
                <el-form-item label="专业：">
                    <el-input v-model="studentModel.major" placeholder="请输入专业"></el-input>
                </el-form-item> 
                <el-form-item label="年级：">
                    <el-input v-model="studentModel.grade" placeholder="请输入年级"></el-input>
                </el-form-item>
                <el-form-item label="班级：">
                    <el-input v-model="studentModel.clazz" placeholder="请输入班级"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title === '添加管理员' ? addStudent() : updateStudent()">提交</el-button>
                    <el-button type="info">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}


.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;

}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    border: 1px dashed var(--el-border-color);
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 178px;
    text-align: center;
}
</style>