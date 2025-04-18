import request from '@/utils/request'

export const getAllExamService=()=>{
    return request.get('/exam/list')
}

//选增考试接口
export const addExamService=(exam)=>{
    return request.post('/exam/add',exam)
}