<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo'
const userInfoStore = useUserInfoStore()

//---------获取所有教师信息
import { getAllTeachersService } from '@/api/user'
const teachers = ref([
    {
        'id': 0,
        'username': ''
    }
])
const getAllTeachers = async () => {
    let result = await getAllTeachersService()
    teachers.value = result.data
}
getAllTeachers()


//课程表格模型
const courses = ref([
    {
        'id': 0,
        'courseName': '',
        'description': '',
        'teacherId': 0,
        'createTime': '',
        'image': ''
    }
])

//获取课程
import { getCourseListService, addCourseService, updateCourseService,deleteCourseService } from '@/api/course'
const getCourseList = async () => {
    let result = await getCourseListService();
    courses.value = result.data

    //-------把教师id替换为教师名
    for (let i = 0; i < courses.value.length; i++) {
        let course = courses.value[i]
        for (let j = 0; j < teachers.value.length; j++) {
            if (course.teacherId === teachers.value[j].id) {
                course.teacherName = teachers.value[j].username
            }
        }
    }
    console.log(courses.value);

}
getCourseList()

import { Picture as IconPicture } from '@element-plus/icons-vue'

// 抽屉
//课程表单模型
const courseModel = ref({
    "courseName": "",
    "description": '',
    "image": ''
})
//清空表单模型
const clearCourseModel = () => {
    courseModel.value.courseName = ''
    courseModel.value.description = ''
    courseModel.value.image = ''
}
const visibleDraw = ref(false);
import { Plus } from '@element-plus/icons-vue'
import { useTokenStore } from '@/stores/token.js'
import { ElMessage,ElMessageBox } from 'element-plus'
const tokenStore = useTokenStore()

//图片上传成功后执行函数：
const uploadSuccess = (result) => {
    courseModel.value.image = result.data
    console.log(courseModel.value.image);

}


//创建课程
const addCourse = async () => {
    let result = await addCourseService(courseModel.value);
    ElMessage.success("添加成功！")
    visibleDraw.value = false
    getCourseList()
}


const title = ref('')

const showDrawer = (row) => {
    title.value = '编辑课程'
    courseModel.value.courseName = row.courseName
    courseModel.value.description = row.description
    courseModel.value.image = row.image
    courseModel.value.id = row.id
    visibleDraw.value = true
}

//更新课程方法
const updateCourse = async () => {
    let result = await updateCourseService(courseModel.value);
    ElMessage.success("修改成功！")
    getCourseList()
    visibleDraw.value = false
}

//删除课程的方法
const deleteCourse = async(id)=>{
    
    ElMessageBox.confirm(
        '即将删除该课程，是否继续？',
        '温馨提示',
        {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        await deleteCourseService(id);
        ElMessage({
            type: 'success',
            message: '删除成功！',
        })
        getCourseList()
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '用户取消删除',
        })
    })
}


</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">课程管理</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="clearCourseModel(), title = '新建课程', visibleDraw = true">新建课程</el-button>
                </div>
            </div>
        </template>

        <!-- 课程列表 -->
        <el-table :data="courses" style="width: 100%;">
            <el-table-column label="序号" width="80" type="index"></el-table-column>
            <el-table-column label="课程封面" prop="image" width="150">
                <template #default="{ row }">
                    <el-image :src="row.image" fit="cover" style="width: 120px;border-radius: 8px;"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="课程名称" prop="courseName"></el-table-column>
            <el-table-column label="课程描述" prop="description" show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="授课老师" prop="teacherName"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button type="primary" :icon="Edit" circle plain v-if="row.teacherId === userInfoStore.info.id"
                        @click="showDrawer(row)"></el-button>
                    <el-button type="primary" :icon="Edit" circle plain disabled v-else></el-button>
                    <el-button type="danger" :icon="Delete" circle plain
                        v-if="row.teacherId === userInfoStore.info.id" @click="deleteCourse(row.id)"></el-button>
                    <el-button type="danger" :icon="Delete" circle plain disabled v-else></el-button>

                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 抽屉 -->
        <el-drawer v-model="visibleDraw" size="40%" :title="title">
            <el-form :model="courseModel" label-width="100px">
                <el-form-item label="课程名称：">
                    <el-input v-model="courseModel.courseName" placeholder="请输入课程名称"></el-input>
                </el-form-item>
                <el-form-item label="课程封面：">
                    <!-- 
                        auto-upload：设置是否自动上传
                        action：设置服务器接口路径
                        name：设置上传的文件字段名
                        headers：设置上传的请求头（需要导入token）
                        on-success：设置上传成功的回调函数
                    -->
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="courseModel.image" :src="courseModel.image" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="课程描述：">
                    <el-input v-model="courseModel.description" placeholder="请描述改课程。" type="textarea"
                        rows="8"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title === '新建课程' ? addCourse() : updateCourse()">提交</el-button>
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