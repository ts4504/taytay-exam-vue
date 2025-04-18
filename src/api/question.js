import request from '@/utils/request'

//获取所有题目的接口
export const getQuestionListservice=(params)=>{
    return request.get('/question/list',{params:params})
}
//添加题目的接口
export const addQuestionService=(questionData)=>{
    return request.post('/question',questionData)
}
//更新题目的接口
export const updateQuestionService=(questionData)=>{
    return request.put('/question',questionData)
}
//删除题目的接口
export const deleteQuestionService=(id)=>{
    return request.delete('/question'+'?id='+id)
}

//获取指定课程的试题
export const getQuestionByCourseService=(courseId)=>{
    return request.get('/question/findByCourse?courseId='+courseId);
}

//获取指定试卷的试题
export const getQuestionByPaperService=(id)=>{
    
    return request.get('/question/findByPaper?id='+id);
}