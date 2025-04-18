<script setup>
import { getAllExamService ,addExamService} from '@/api/exam';
import {getPaperListService} from '@/api/paper'
import {getCourseListService} from '@/api/course'
import { ref } from 'vue';

//---------------数据准备----------------
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

//考试列表
const exams = ref([{
    "examName":'',
    'courseId':'',
    'paperId':'',
    'startTime':'',
    'endTime':'',
    'location':'',
    'createUser':'',
    'duration':''
}])

//获取所有课程
const getAllCourse=async()=>{
    let result = await getCourseListService();
    courses.value = result.data
}

//获取所有试卷
const getAllPaper=async()=>{
    let result = await getPaperListService()
    papers.value = result.data
}

//获取所有考试
const getAllExam=async()=>{
    let result = await getAllExamService();
    exams.value = result.data;
    console.log(exams.value);

    
    //为exam扩展paperName属性
    for (let i = 0;i<exams.value.length;i++) {
        let exam = exams.value[i]
        for(let j = 0;j<papers.value.length;j++){
            if(exam.paperId === papers.value[j].id){
                exam.paperName = papers.value[j].paperName
            }
        }
    }

    //为exam扩展courseName属性
    for (let i = 0;i<exams.value.length;i++) {
        let exam = exams.value[i]
        for(let j = 0;j<courses.value.length;j++){
            if(exam.courseId === courses.value[j].id){
                exam.courseName = courses.value[j].courseName
            }
        }
    }
    
}

getAllCourse();
getAllPaper();
getAllExam();

//---------------功能扩展----------------
//弹窗显示
const dialogVisible = ref(false)

//考试表单模型
const examModel=ref({
    "examName":'',
    "courseId":'',
    "paperId":'',
    "startTime":'',
    "endTime":'',
    "location":''
})

//清空表单模型
const clearExamModel=()=>{
    examModel.value.examName = ''
    examModel.value.courseId = ''
    examModel.value.paperId = ''
    examModel.value.startTime = ''
    examModel.value.endTime = ''
    examModel.value.location = ''
}
//当课程选改变时，清空paper，以及已选的paper
const clearPapers=()=>{
    for(let i = 0;i<papers.value.length;i++){
        papers.value[i].paperName = ''
        papers.value[i].id = ''
        examModel.value.paperId=''
        examModel.value.paperName = ''
    }
}

import {getPaperListByCourseIdService} from '@/api/paper'
import { ElMessage } from 'element-plus';
//根据课程获取试卷
const getPapers=async()=>{
    if(examModel.value.courseId === null || examModel.value.courseId === ''){
        clearPapers()
        ElMessage.error("请选择课程！")
        return;
    }
    let result = await getPaperListByCourseIdService(examModel.value.courseId)
    papers.value = result.data;
}

//创建考试
const addExam =async()=>{
    let result = await addExamService(examModel.value)
    ElMessage.success("创建成功！");
    
    dialogVisible.value = false
    clearExamModel()
    getAllExam()
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">考试管理</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true;clearExamModel()">新建考试</el-button>
                </div>
            </div>
        </template>

        <el-table :data="exams" style="width: 100%;">
          <el-table-column label="考试名称" prop="examName"  width="300"></el-table-column>
          <el-table-column label="所属课程" prop="courseName"></el-table-column>
          <el-table-column label="所用试卷" prop="paperName"></el-table-column>
          <el-table-column label="开始时间" prop="startTime"></el-table-column>
          <el-table-column label="结束时间" prop="endTime"></el-table-column>
          <el-table-column label="考点" prop="location"></el-table-column>

          <template #empty>
            <el-empty description="您还没有创建考试哦！"/>
          </template>
        </el-table>

        <!-- 弹窗 -->
        <el-dialog title="创建考试" v-model="dialogVisible" width="600">
            <el-form :model="examModel" label-width="100px" style="margin: 30px;">
              <el-form-item label="试卷名称：">
                <el-input v-model="examModel.examName" placeholder="请输入试卷名称"></el-input>
              </el-form-item>
              <el-form-item label="所属课程：">
                <el-select v-model="examModel.courseId" placeholder="请选择课程" @change="clearPapers()">
                  <el-option v-for="c in courses" :key="c.id" :label="c.courseName" :value="c.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="请选择试卷：" @click="getPapers()">
                <el-select v-model="examModel.paperId" placeholder="请选择试卷">
                  <el-option v-for="p in papers" :key="p.id" :label="p.paperName" :value="p.id"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="开始时间：">
                <el-date-picker v-model="examModel.startTime" placeholder="请选择考试开始时间" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间：">
                <el-date-picker v-model="examModel.endTime" placeholder="请选择考试结束时间" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
              </el-form-item>
              <el-form-item label="考试地点：">
                <el-input v-model="examModel.location" placeholder="请输入地点"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="addExam()">提交</el-button>
                <el-button type="info" @click="dialogVisible = false">取消</el-button>
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
</style>