<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'



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


//--------获取所有课程信息
import { getCourseListService } from '@/api/course'
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
getCourseList()


//筛选条件模型
const courseId = ref()//课程
const type = ref('')//题目类型

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


//页码，页大小，页总数
const pageNum = ref(1)
const pageSize = ref(6)
const total = ref(10)



//获取所有文章
import { getQuestionListservice, addQuestionService, updateQuestionService, deleteQuestionService } from '@/api/question'
import { ElMessage, ElMessageBox } from 'element-plus'

//获取题目列表
const getQuestionList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        courseId: courseId.value ? courseId.value : null,
        type: type.value ? type.value : null
    }
    let result = await getQuestionListservice(params)
    questions.value = result.data.items
    //打印一下
    console.log(result.data.items);

    //---------将教师id替换为教师名
    for (let i = 0; i < questions.value.length; i++) {
        let question = questions.value[i]
        for (let j = 0; j < teachers.value.length; j++) {
            if (question.teacherId === teachers.value[j].id) {
                question.teacherName = teachers.value[j].username
            }
        }
    }
    total.value = result.data.total


    //--------将课程id替换为课程名
    for (let i = 0; i < questions.value.length; i++) {
        let question = questions.value[i]
        for (let j = 0; j < courses.value.length; j++) {
            if (question.courseId === courses.value[j].id) {
                question.courseName = courses.value[j].courseName
            }
        }
    }

}
getQuestionList()

//当页码发生变化时，调用这个函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    getQuestionList()
}
//当页大小发生变化时，调用这个函数
const onSizeChange = (size) => {
    pageSize.value = size
    getQuestionList()
}

//抽屉的显示
const visibeleDialog = ref(false)

//添加题目表单
const questionModel = ref({
    'courseId': '',
    'content': '',
    'type': '',
    'options': {
        'A': '',
        'B': '',
        'C': '',
        'D': ''
    },
    'answer': '',
    'score': ''
})

//添加题目表单校验规则
const questionRules = {
    courseId: [{ required: true, trigger: 'blur', message: '课程不能为空！' }],
    content: [{ required: true, trigger: 'blur', message: '题目不能为空！' }],
    type: [{ required: true, trigger: 'blur', message: '题目类型不能为空！' }],
    options: {
        A: [{ required: true, trigger: 'blur', message: 'A选项不能为空！' }],
        B: [{ required: true, trigger: 'blur', message: 'B选项不能为空！' }],
        C: [{ required: true, trigger: 'blur', message: 'C选项不能为空！' }],
        D: [{ required: true, trigger: 'blur', message: 'D选项不能为空！' }],

    },
    score: [{ required: true, trigger: 'blur', message: '分值不能为空！' }],
    answer: [{ required: true, trigger: 'blur', message: '答案不能为空！' }],
}



//清空题目表单
const clearQuestionModel = () => {
    questionModel.value.courseId = ''
    questionModel.value.content = ''
    questionModel.value.type = ''
    questionModel.value.options = ''
    questionModel.value.score = ''
    questionModel.value.answer = ''
}
//发送添加题目的请求
const submitQuestion = async () => {
    if (questionModel.value.type === '判断题' || questionModel.value.type === '简答题') {
        questionModel.value.options = null
    }
    if (questionModel.value.answer === '' || questionModel.value.type === '' || questionModel.value.content === '' || questionModel.value.courseId === '') {
        ElMessage.error('缺少必要的参数！')
    } else {
        await addQuestionService(questionModel.value);
        ElMessage.success('添加成功！');
        visibeleDialog.value = false
        clearQuestionModel()
    }
    getQuestionList()
}

const title = ref('')

//弹出弹窗
const showDialog = (row) => {
    visibeleDialog.value = true
    title.value = '编辑题目'
    //扩展id属性
    questionModel.value.id = row.id
    questionModel.value.courseId = row.courseId
    questionModel.value.content = row.content
    questionModel.value.answer = row.answer
    questionModel.value.type = row.type
    questionModel.value.options = row.options
    questionModel.value.score = row.score
}
//修改题目请求
const updateQuestion = async () => {

    if (questionModel.value.type === '判断题' || questionModel.value.type === '简答题') {
        questionModel.value.options = null
    }
    if (questionModel.value.answer === '' || questionModel.value.type === '' || questionModel.value.content === '' || questionModel.value.courseId === '') {
        ElMessage.error('缺少必要的参数！')
    } else {
        await updateQuestionService(questionModel.value);
        ElMessage.success('修改成功！');
        visibeleDialog.value = false
        clearQuestionModel()
    }
    getQuestionList()
}

//删除题目的请求
const deleteQuestion = (id) => {
    ElMessageBox.confirm(
        '即将删除该题目，是否继续？',
        '温馨提示',
        {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        await deleteQuestionService(id)
        ElMessage({
            type: 'success',
            message: '删除成功！',
        })
        getQuestionList()
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '用户取消删除',
        })
    })

}


const getTagType = (type) => {
    const typeMap = {
        '判断题': 'primary',
        '单选题': 'success',
        '多选题': 'warning',
        '简答题': 'danger',
        '填空题': 'info'
    };
    return typeMap[type] || '';
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">题库管理</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="clearQuestionModel(), title = '添加题目', visibeleDialog = true">添加题目</el-button>
                </div>
            </div>
        </template>

        <!-- 搜索表单 -->
        <el-form inline class="demo-form-inline">
            <el-form-item label="课程名：">
                <el-select v-model="courseId" placeholder="请选择">
                    <el-option v-for="c in courses" :key="c.id" :label="c.courseName" :value="c.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="题型：">
                <el-select v-model="type" placeholder="请选择">
                    <el-option label="判断题" value="判断题"></el-option>
                    <el-option label="单选题" value="单选题"></el-option>
                    <el-option label="多选题" value="多选题"></el-option>
                    <el-option label="简答题" value="简答题"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="getQuestionList()">搜索</el-button>
                <el-button @click="courseId = ''; type = ''; getQuestionList()">重置</el-button>
            </el-form-item>

        </el-form>

        <!-- 题目列表 -->
        <el-table :data="questions" style="width: 100%;">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="题目" width="300" prop="content" show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="课程名称" prop="courseName"></el-table-column>
            <el-table-column label="授课老师" prop="teacherName"></el-table-column>
            <el-table-column label="题型" prop="type">
                <template #default="{ row }">
                    <el-tag :type="getTagType(row.type)">{{ row.type }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="分值" prop="score"></el-table-column>
            <el-table-column label="选项" prop="options">
                <template #default="{ row }">
                    <div v-if="row.options && ['单选题', '多选题'].includes(row.type)">
                        <div v-for="(value, key) in row.options" :key="key">
                            <span class="option-key">{{ key }}.</span>
                            {{ value }}
                        </div>
                    </div>
                    <span v-else class="no-options">-</span>
                </template>
            </el-table-column>
            <el-table-column label="答案" prop="answer" show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button @click="showDialog(row)" type="primary" :icon="Edit" circle plain></el-button>
                    <el-button @click="deleteQuestion(row.id)" type="danger" :icon="Delete" circle plain></el-button>

                </template>
                <template #empty>
                    <el-empty description="没有数据" />
                </template>
            </el-table-column>


        </el-table>


        <!-- 分页条 -->
        <el-pagination :total="total" :current-page="pageNum" :page-size="pageSize" @current-change="onCurrentChange"
            :page-sizes="[3, 6, 10, 15]" @size-change="onSizeChange" layout="jumper, total, sizes, prev, pager, next"
            background style="margin-top: 20px; justify-content: flex-end;">
        </el-pagination>

        <!-- 对话框 -->
        <el-dialog v-model="visibeleDialog" :title="title" width="600">
            <el-form :model="questionModel" label-width="100px" style="margin: 30px;" :rules="questionRules"
                label-position="left">
                <el-form-item label="选择课程：" prop="courseId">
                    <el-select v-model="questionModel.courseId" placeholder="请选择">
                        <el-option v-for="c in courses" :key="c.id" :label="c.courseName" :value="c.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="题目内容：" prop="content">
                    <el-input v-model="questionModel.content" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="题目类型：" prop="type">
                    <el-select v-model="questionModel.type" placeholder="请选择">
                        <el-option label="判断题" value="判断题"></el-option>
                        <el-option label="单选题" value="单选题"></el-option>
                        <el-option label="多选题" value="多选题"></el-option>
                        <el-option label="简答题" value="简答题"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="questionModel.type === '单选题' || questionModel.type === '多选题'">
                    <el-form-item label="选项A：" prop="options.A">
                        <el-input v-model="questionModel.options.A"></el-input>
                    </el-form-item>
                    <el-form-item label="选项B：" prop="options.B">
                        <el-input v-model="questionModel.options.B"></el-input>
                    </el-form-item>
                    <el-form-item label="选项C：" prop="options.C">
                        <el-input v-model="questionModel.options.C"></el-input>
                    </el-form-item>
                    <el-form-item label="选项D：" prop="options.D">
                        <el-input v-model="questionModel.options.D"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="推荐分值：" prop="score">
                    <el-input-number v-model="questionModel.score" precision="1"></el-input-number>
                </el-form-item>
                <el-form-item label="题目答案：" prop="answer">
                    <el-input v-if="questionModel.type === '简答题'" v-model="questionModel.answer" type="textarea"
                        :rows="5"></el-input>
                    <el-select v-else-if="questionModel.type === '判断题'" v-model="questionModel.answer"
                        placeholder="请选择">
                        <el-option label="正确" value="正确"></el-option>
                        <el-option label="错误" value="错误"></el-option>
                    </el-select>
                    <el-input v-else v-model="questionModel.answer"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="default" @click="clearQuestionModel(), visibeleDialog = false">取消</el-button>
                <el-button type="primary"
                    @click="title === '添加题目' ? submitQuestion() : updateQuestion();">确认</el-button>
            </template>
        </el-dialog>
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


/*选项样式 */
.option-key {
    display: inline-block;
    width: 24px;
    color: #409eff;
    font-weight: 500;
}

/* 空状态提示 */
.no-options {
    color: #999;
    font-size: 14px;
}


.demo-form-inline .el-input {
    --el-input-width: 220px;
}

.demo-form-inline .el-select {
    --el-select-width: 220px;
}
</style>