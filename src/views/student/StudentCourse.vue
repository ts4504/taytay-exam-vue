<script setup>
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
    console.log(result.data);

}
getCourseList()


</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">我的选课</span>
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
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>
</template>

<style>

</style>