<script setup>
import {
    Edit
} from '@element-plus/icons-vue'
import { ref } from 'vue';
import { getScoreListService, updateScoreService } from '@/api/score'
import { getAllExamService } from '@/api/exam'
import { getAllTeachersService, getAllStudentService } from '@/api/user'
import { getCourseListService } from '@/api/course'
import { ElMessage } from 'element-plus';



//成绩表格模型
const scores = ref([{
    'id': '',
    'studentId': '',
    'examId': '',
    'teacherId': '',
    'courseId': '',
    'score': '',
    'status': '',
    'updateTime': ''
}])

//考试表格模型
const exams = ref([{
    "examName": '',
    'courseId': '',
    'paperId': '',
    'startTime': '',
    'endTime': '',
    'location': '',
    'createUser': '',
    'duration': ''
}])

//教师表格模型
const teachers = ref([
    {
        'id': 0,
        'username': ''
    }
])

//学生表格模型
const students = ref([
    {
        'id': 0,
        'username': ''
    }
])

//课程表格模型
const courses = ref([
    {
        'id': 0,
        'courseName': '',
        'description': '',
        'teacherId': 0,
        'createTime': ''
    }
])

//获取课程
const getCourseList = async () => {
    let result = await getCourseListService()
    courses.value = result.data
}

//获取所有考试
const getAllExam = async () => {
    let result = await getAllExamService();
    exams.value = result.data;
}
//获取所有教师信息
const getAllTeachers = async () => {
    let result = await getAllTeachersService()
    teachers.value = result.data
}
//获取所有学生信息
const getAllStudent = async () => {
    let result = await getAllStudentService()
    students.value = result.data
}


const pageNum = ref(1)
const pageSize = ref(6)
const total = ref(10)
const studentId = ref(0)
const teacherId = ref(0)
const courseId = ref()
const status = ref('')


//获取所有成绩
const getScoreList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        studentId: studentId.value ? studentId.value : null,
        courseId: courseId.value ? courseId.value : null,
        teacherId: teacherId.value ? teacherId.value : null,
        status: status.value ? status.value : null
    }
    let result = await getScoreListService(params)
    scores.value = result.data.items
    total.value = result.data.total


    // 扩展examName
    for (let i = 0; i < scores.value.length; i++) {
        let score = scores.value[i]
        for (let j = 0; j < exams.value.length; j++) {
            if (score.examId === exams.value[j].id) {
                score.examName = exams.value[j].examName
            }
        }
    }

    // 扩展teacherName
    for (let i = 0; i < scores.value.length; i++) {
        let score = scores.value[i]
        for (let j = 0; j < teachers.value.length; j++) {
            if (score.teacherId === teachers.value[j].id) {
                score.teacherName = teachers.value[j].username
            }
        }
    }

    //扩展studentName
    for (let i = 0; i < scores.value.length; i++) {
        let score = scores.value[i]
        for (let j = 0; j < students.value.length; j++) {
            if (score.studentId === students.value[j].id) {
                score.studentName = students.value[j].username
            }
        }
    }

    //扩展courseName
    for (let i = 0; i < scores.value.length; i++) {
        let score = scores.value[i]
        for (let j = 0; j < courses.value.length; j++) {
            if (score.courseId === courses.value[j].id) {
                score.courseName = courses.value[j].courseName
            }
        }
    }

}
getAllExam()
getAllTeachers()
getAllStudent()
getCourseList()
getScoreList()

//当页码发生变化时，调用这个函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    getScoreList()
}
//当页大小发生变化时，调用这个函数
const onSizeChange = (size) => {
    pageSize.value = size
    getScoreList()
}

const getTagType = (type) => {
    const typeMap = {
        '待定': 'primary',
        '已发布': 'success',
    };
    return typeMap[type] || '';
}





</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">所有成绩</span>
            </div>
        </template>

        <!-- 搜索表单 -->
        <el-form inline class="demo-form-inline">
            <el-form-item label="课程名：">
                <el-select v-model="courseId" placeholder="请选择">
                    <el-option v-for="c in courses" :key="c.id" :label="c.courseName" :value="c.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发布状态：">
                <el-select v-model="status" placeholder="请选择">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="待定" value="待定"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getScoreList()">搜索</el-button>
                <el-button @click="status = ''; courseId = ''; getScoreList()">重置</el-button>
            </el-form-item>

        </el-form>


        <!-- 成绩列表 -->
        <el-table :data="scores">
            <el-table-column label="考试名称" prop="examName" width="400"></el-table-column>
            <el-table-column label="授课老师" prop="teacherName"></el-table-column>
            <el-table-column label="学生姓名" prop="studentName"></el-table-column>

            <el-table-column label="成绩状态" prop="status">
                <template #default="{ row }">
                    <el-tag :type="getTagType(row.status)">{{ row.status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="分数" prop="score">
                <template #default="{ row }">
                    <div v-if="row.score">{{ row.score }}</div>
                    <div v-else>未录入</div>
                </template>
            </el-table-column>
            <el-table-column>
                <template #empty>
                    <el-empty description="没有数据" />
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页条 -->
        <el-pagination :total="total" :current-page="pageNum" :page-size="pageSize" :page-sizes="[3, 6, 10, 15]"
            @size-change="onSizeChange" @current-change="onCurrentChange"
            layout="jumper, total, sizes, prev, pager, next" background
            style="margin-top: 20px; justify-content: flex-end;">
        </el-pagination>


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

.demo-form-inline .el-input {
    --el-input-width: 220px;
}

.demo-form-inline .el-select {
    --el-select-width: 220px;
}

:deep .el-dialog {
    // 对话框整体样式
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

    // 标题栏样式
    .el-dialog__header {
        border-bottom: 1px solid #f0f0f0;
        padding: 16px 20px;
        margin-right: 0;

        .el-dialog__title {
            font-size: 18px;
            color: #303133;
            font-weight: 600;
        }
    }

    // 内容区域样式
    .el-dialog__body {
        padding: 20px 24px;

        .el-form-item {
            margin-bottom: 22px;

            // 标签样式
            .el-form-item__label {
                font-size: 14px;
                color: #606266;
                font-weight: 500;
                padding-right: 20px;
            }



            // 展示字段样式
            &>div:not(.el-form-item__content) {
                font-size: 14px;
                color: #303133;
                padding-left: 12px;
            }
        }
    }

    // 底部按钮区域（如需添加按钮时）
    .el-dialog__footer {
        border-top: 1px solid #f0f0f0;
        padding: 16px 20px;
        text-align: right;
    }
}
</style>
