<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { getAllTeachersService, addUserService, deleteUserService, updateUserInfoService } from '@/api/user'
import { useTokenStore } from '@/stores/token'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const tokenStore = useTokenStore()

//管理员列表
const teachers = ref([{
    "id": '',
    "username": '',
    'avatar': '',
    "role": '',
    'phone': '',
    'email': '',
    'createTime': ''
}])

//获取所有管理员信息
const getTeacherList = async () => {
    let result = await getAllTeachersService()
    teachers.value = result.data
    console.log('--------获取管理员信息');

    console.log(teachers.value);

}
getTeacherList()

//抽屉的可视
const visibleDrawer = ref(false)
//抽屉标题
const title = ref('')

//管理员信息表单
const teacherModel = ref({
    "id": '',
    "username": "",
    "role": "teacher",
    "email": "",
    "phone": "",
    "createTime": "",
    "updateTime": "",
    "avatar": "",
    "studentNumber": null,
    "grade": null,
    "major": null,
    "clazz": null,
    "teacherNumber": "",
    "department": "",
    "title": ""
})

//清空表单
const clearTeacherModel = () => {
    teacherModel.value.username = ''
    teacherModel.value.avatar = ''
    teacherModel.value.phone = ''
    teacherModel.value.email = ''
    teacherModel.value.department = ''
    teacherModel.value.title = ''
    teacherModel.value.teacherNumber = ''
}

//图片上传成功后执行：
const uploadSuccess = (result) => {
    teacherModel.value.avatar = result.data
}

//添加管理员方法
const addTeacher = async () => {
    console.log(teacherModel.value);

    await addUserService(teacherModel.value)
    ElMessage.success('添加成功！')
    getTeacherList()
}


//删除管理员
const deleteTeacher = async (id) => {

    ElMessageBox.confirm(
        '即将删除该该用户，是否继续？',
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
        getTeacherList()
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
    teacherModel.value.id = row.id
    teacherModel.value.username = row.username
    teacherModel.value.role = row.role
    teacherModel.value.avatar = row.avatar
    teacherModel.value.phone = row.phone
    teacherModel.value.email = row.email
    teacherModel.value.department = row.department
    teacherModel.value.title = row.title
    teacherModel.value.teacherNumber = row.teacherNumber
}

//更新管理员信息方法
const updateTeacher = async () => {
    let result = await updateUserInfoService(teacherModel.value)
    ElMessage.success('修改成功！')
    visibleDrawer.value = false
    clearTeacherModel()
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">教师列表</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="clearTeacherModel(); title = '添加教师'; visibleDrawer = true">添加教师</el-button>
                </div>
            </div>
        </template>

        <el-table :data="teachers">
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="头像" prop="avatar">
                <template #default="{ row }">
                    <el-avatar :src="row.avatar?row.avatar:avatar"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>

            <el-table-column label="工号" prop="teacherNumber">
                <template #default="{ row }">
                    <div v-if="row.teacherNumber">{{ row.teacherNumber }}</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column label="学院" prop="department">
                <template #default="{ row }">
                    <div v-if="row.department">{{ row.department }}</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column label="职称" prop="title">
                <template #default="{ row }">
                    <div v-if="row.title">{{ row.title }}</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="primary" circle :icon="Edit" plain @click="showDrawer(row)"></el-button>
                    <el-button type="danger" circle :icon="Delete" plain @click="deleteTeacher(row.id)"></el-button>
                </template>

            </el-table-column>

            <template #empty>
                <el-empty description="暂无教师哦" />
            </template>
        </el-table>


        <el-drawer :title="title" v-model="visibleDrawer" size="40%">
            <el-form :model="teacherModel" label-width="100px">
                <el-form-item label="用户名：">
                    <el-input v-model="teacherModel.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="角色：">教师</el-form-item>
                <el-form-item label="上传头像：">
                    <el-upload action="/api/upload" class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="teacherModel.avatar" :src="teacherModel.avatar" class="avatar">
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-model="teacherModel.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input v-model="teacherModel.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="工号：">
                    <el-input v-model="teacherModel.teacherNumber" placeholder="请输入工号"></el-input>
                </el-form-item>
                <el-form-item label="学院：">
                    <el-input v-model="teacherModel.department" placeholder="请输入学院"></el-input>
                </el-form-item>
                <el-form-item label="职称：">
                    <el-input v-model="teacherModel.title" placeholder="请输入职称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title === '添加管理员' ? addTeacher() : updateTeacher()">提交</el-button>
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