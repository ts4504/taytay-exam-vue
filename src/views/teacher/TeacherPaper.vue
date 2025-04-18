<script setup>
import { ref } from 'vue';
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { getPaperListService, manualCreatePaperService, autoCreatePaperService, deletePaperService } from '@/api/paper'
import { getAllTeachersService } from '@/api/user'
import { getCourseListService } from '@/api/course'
import { getQuestionByCourseService, getQuestionByPaperService } from '@/api/question'
import useUserInfoStore from '@/stores/userInfo'
import { ElMessage, ElMessageBox } from 'element-plus';

const userInfoStore = useUserInfoStore()

//教师列表
const teachers = ref([
    {
        'id': '',
        'username': ''
    }
])

//课程列表
const courses = ref([
    {
        'id': null,
        'courseName': '',
        'description': '',
        'teacherId': null,
        'createTime': ''
    }
])

//试题列表
//题目列表数据模型
const questions = ref([
    {
        'id': 0,
        'teacherId': 0,
        'courseId': 0,
        'type': '',
        'content': '',
        'options': {
            'A': '',
            'B': '',
            'C': '',
            'D': ''
        },
        'answer': '',
        'score': 0,
        'creatTime': ''
    }
])

//试卷列表
const papers = ref([{
    'id': '',
    'teacherId': '',
    'courseId': '',
    'paperName': '',
    'paperType': '',
    'totalScore': '',
    'description': '',
    'createTime': '',
    'updateTime': ''
}])


//获取教师列表
const getAllTeachers = async () => {
    let result = await getAllTeachersService();
    teachers.value = result.data;
}
getAllTeachers()

//获取课程
const getCourseList = async () => {
    let result = await getCourseListService()
    courses.value = result.data
}
getCourseList()




//获取试卷列表
const getPaperList = async () => {
    let result = await getPaperListService()
    papers.value = result.data;
    for (let i = 0; i < papers.value.length; i++) {
        let paper = papers.value[i]
        for (let j = 0; j < teachers.value.length; j++) {
            if (paper.teacherId === teachers.value[j].id) {
                paper.teacherName = teachers.value[j].username
            }
        }
    }
}
getPaperList()

//获取标签类型
const getType = (paperType) => {
    const typeMap = {
        '自动组卷': 'primary',
        '手动组卷': 'success'
    }
    return typeMap[paperType] || ''
}


//组卷试卷数据模型(questions是手动组卷时使用的，typeCount是自动组卷时指定，每个题型的题目数量的)
const paperModel = ref({
    "courseId": '',
    "paperName": '',
    "description": '',
    "paperType": '',
    "questions": '',//存放题目id的数组
    "typeCounts": [
        {
            "type": '判断题',
            "count": ''
        },
        {
            "type": '填空题',
            "count": ''
        },
        {
            "type": '单选题',
            "count": ''
        },
        {
            "type": '多选题',
            "count": ''
        },
        {
            "type": '简答题',
            "count": ''
        }
    ]
})

//清空模型
const clearPaperModel = () => {
    paperModel.value.courseId = ''
    paperModel.value.paperName = ''
    paperModel.value.description = ''
    paperModel.value.paperType = ''
    paperModel.value.questions.questionId = ''
    paperModel.value.questions.orderInPaper = ''
    paperModel.value.questions.questionScore = ''
    paperModel.value.typeCounts.type = ''
    paperModel.value.typeCounts.concat = ''
}

//获取指定课程的试题列表
const getQuestions = async () => {
    if (paperModel.value.courseId === null || paperModel.value.courseId === '') {
        ElMessage.error("请选择课程！")
        return;
    }
    let result = await getQuestionByCourseService(paperModel.value.courseId);
    questions.value = result.data
    console.log(questions.value);

}


// 抽屉可见控制
const visibleDraw = ref(false)
// 抽屉标题
const title = ref('')


//添加试卷
const addPaper = async () => {
    console.log(paperModel.value);

    if (paperModel.value.paperType === '手动组卷') {
        let result = await manualCreatePaperService(paperModel.value)
    } else {
        let result = await autoCreatePaperService(paperModel.value)
    }
    ElMessage.success("组卷成功！")
    getPaperList()
    visibleDraw.value = false
    clearPaperModel()
}

//根据试卷获取试题
const getQuestionsByPaper = async (id) => {
    let result = await getQuestionByPaperService(id)

    return result.data;
}

//删除试卷
const deletePaper = async (id) => {
    ElMessageBox.confirm(
        '即将删除该试卷，是否继续？',
        '温馨提示',
        {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        await deletePaperService(id);
        ElMessage({
            type: 'success',
            message: '删除成功！',
        })
        getPaperList()
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
                <span style="font-weight: bold;">试卷管理</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="visibleDraw = true; title = '新建试卷'; clearPaperModel()">添加试卷</el-button>
                </div>
            </div>
        </template>

        <!-- 试卷列表 -->
        <el-table :data="papers" style="width: 100%;">
            <el-table-column label="试卷名" prop="paperName"></el-table-column>
            <el-table-column label="试卷描述" prop="description"></el-table-column>
            <el-table-column label="组卷方式" prop="paperType">
                <template #default="{ row }">
                    <el-tag :type="getType(row.paperType)">{{ row.paperType }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建人" prop="teacherName"></el-table-column>
            <el-table-column label="总分值" prop="totalScore"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button type="danger" :icon="Delete" circle plain v-if="row.teacherId === userInfoStore.info.id || userInfoStore.info.role==='admin'"
                        @click="deletePaper(row.id)"></el-button>
                    <el-button type="danger" :icon="Delete" circle plain disabled v-else></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>


        </el-table>

        <!-- 抽屉 -->
        <el-drawer v-model="visibleDraw" :title="title" size="40%">
            <el-form :model="paperModel" label-width="100px">
                <el-form-item label="试卷名称：">
                    <el-input v-model="paperModel.paperName" placeholder="请输入试卷名称"></el-input>
                </el-form-item>
                <el-form-item label="试卷描述：">
                    <el-input v-model="paperModel.description" placeholder="请描述该试卷" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="课程：">
                    <el-select v-model="paperModel.courseId" placeholder="请选择课程">
                        <el-option v-for="c in courses" :key="c.id" :label="c.courseName" :value="c.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组卷方式：">
                    <el-select v-model="paperModel.paperType" placeholder="请选择组卷方式">
                        <el-option label="自动组卷" value="自动组卷"></el-option>
                        <el-option label="手动组卷" value="手动组卷"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="paperModel.paperType === '手动组卷'" label="请选择题目：">
                    <el-select v-model="paperModel.questions" placeholder="请选择题目" multiple @click="getQuestions()">
                        <el-option v-for="q in questions" :key="q.id" :label="q.content" :value="q.id"></el-option>
                    </el-select>
                </el-form-item>
                <div v-else-if="paperModel.paperType === '自动组卷'">
                    <el-form-item label="判断题：">
                        <el-input-number v-model="paperModel.typeCounts[0].count" placeholder="请选择"></el-input-number>
                    </el-form-item>
                    <el-form-item label="填空题：">
                        <el-input-number v-model="paperModel.typeCounts[1].count" placeholder="请选择"></el-input-number>
                    </el-form-item>
                    <el-form-item label="单选题：">
                        <el-input-number v-model="paperModel.typeCounts[2].count" placeholder="请选择"></el-input-number>
                    </el-form-item>
                    <el-form-item label="多选题：">
                        <el-input-number v-model="paperModel.typeCounts[3].count" placeholder="请选择"></el-input-number>
                    </el-form-item>
                    <el-form-item label="简答题：">
                        <el-input-number v-model="paperModel.typeCounts[4].count" placeholder="请选择"></el-input-number>
                    </el-form-item>

                </div>
                <el-form-item>
                    <el-button type="primary" @click="title === '新建试卷'?addPaper():updatePaper()">提交</el-button>
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
</style>