<script setup>
import { getAllExamService } from '@/api/exam'
import { getCourseListService } from '@/api/course'
import { getAllTeachersService } from '@/api/user'
import {getAnnouncementListService} from '@/api/annnouncement'
import { ref } from 'vue';

//---------------数据准备----------------

//课程列表
const courses = ref([
    {
        'id': null,
        'courseName': '',
        'description': '',
        'teacherId': null,
        'createTime': '',
        'image': ''
    }
])

//教师列表
const teachers = ref([
    {
        'id': 0,
        'username': '',
        'avatar': ''
    }
])

//考试列表
const exams = ref([{
    "id": '',
    "examName": '',
    'courseId': '',
    'paperId': '',
    'startTime': '',
    'endTime': '',
    'location': '',
    'createUser': '',
    'duration': ''
}])

//获取所有课程
const getAllCourse = async () => {
    let result = await getCourseListService();
    courses.value = result.data
}
const getAllTeachers = async () => {
    let result = await getAllTeachersService()
    teachers.value = result.data
}

//获取所有考试
const getAllExam = async () => {
    let result = await getAllExamService();
    exams.value = result.data;

    //为exam扩展courseName属性
    for (let i = 0; i < exams.value.length; i++) {
        let exam = exams.value[i]
        for (let j = 0; j < courses.value.length; j++) {
            if (exam.courseId === courses.value[j].id) {
                exam.courseName = courses.value[j].courseName
            }
        }
    }
    //为exam扩展课程封面属性courseImg
    for (let i = 0; i < exams.value.length; i++) {
        let exam = exams.value[i]
        for (let j = 0; j < courses.value.length; j++) {
            if (exam.courseId === courses.value[j].id) {
                exam.courseImg = courses.value[j].image
            }
        }
    }
    //为exam扩展teacherName、avatar
    for (let i = 0; i < exams.value.length; i++) {
        let exam = exams.value[i]
        for (let j = 0; j < teachers.value.length; j++) {
            if (exam.createUser === teachers.value[j].id) {
                exam.teacherName = teachers.value[j].username
                exam.teacherAvatar = teachers.value[j].avatar
            }
        }
    }

    console.log(exams.value);
}
getAllTeachers()
getAllCourse();
getAllExam();

const announcements = ref([{
    'id':'',
    'title':'',
    'content':'',
    'publishTime':''
}])

//获取公告
const getAnnouncementList=async()=>{
    let result = await getAnnouncementListService();
    announcements.value = result.data
}
getAnnouncementList()


//-----------------功能---------------

//判断某一场考试的状态，并返回
let status = ref()

const getExamStatus = (start, end) => {
    const now = new Date();
    // 将传入的时间字符串中的空格替换为'T'以符合ISO 8601格式
    const startTime = new Date(start.replace(' ', 'T')).getTime();
    const endTime = new Date(end.replace(' ', 'T')).getTime();
    const currentTime = now.getTime();


    if (currentTime < startTime) {
        status.value = '未开始'
    } else if (currentTime > endTime) {
        status.value = '已结束'
    } else {
        status.value = '进行中'
    }

    const typeMap = {
        '未开始': 'info',
        '进行中': 'success',
        '已结束': 'danger'
    }
    console.log(typeMap[status.value]);

    return typeMap[status.value]

}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">全部考试</span>
            </div>
        </template>

        <el-row>
            <el-col :span="6" v-for="e in exams" :key="e.id" :xs="24" :sm="12" :md="8" :lg="6">
                <el-card class="exam-card">

                    <el-image :src="e.courseImg" class="image"></el-image>
                    <div>{{ e.examName }}</div>
                    <div class="user-item">
                        <el-avatar :src="e.teacherAvatar" :size="30"></el-avatar>
                        <span>{{ e.teacherName }}</span>
                        <el-tag :type="getExamStatus(e.startTime, e.endTime)">
                            {{ status }}
                        </el-tag>
                    </div>
                    <div>课程名称：{{ e.courseName }}</div>
                    <div>开始时间：{{ e.startTime }}</div>
                    <div>结束时间：{{ e.endTime }}</div>
                </el-card>
            </el-col>
        </el-row>
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

.exam-card {
    transition: transform 0.3s, box-shadow 0.3s; // 添加过渡动画
    border-radius: 12px !important;
    margin: 10px;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }

    .user-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 0;
        border-bottom: 1px solid #ebeef5; // 添加分割线

        .el-avatar {
            border: 2px solid #fff; // 头像描边
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

    }

    el-tag {
        margin-left: auto;
    }

    div {
        margin: 8px 0;
        font-size: 14px;
        color: #606266;

        &:first-of-type {
            // 考试名称特殊样式
            font-size: 16px;
            font-weight: 500;
            color: #303133;
            min-height: 44px; // 固定标题高度
            display: flex;
            align-items: center;
        }
    }

    // 时间信息特殊样式
    div:nth-last-child(2),
    div:nth-last-child(1) {
        font-size: 13px;
        color: #909399;
    }

}

.image {
    width: 80%;
    height: 160px;
    border-radius: 8px;
    object-fit: cover; // 保持图片比例
    margin-bottom: 12px;
}
</style>