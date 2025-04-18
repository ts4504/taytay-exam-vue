import request from '@/utils/request'

//获取所有试卷
export const getPaperListService=()=>{
    return request.get("/paper/list")
}

//根据课程获取试卷列表
export const getPaperListByCourseIdService=(courseId)=>{
    return request.get('/paper/findByCourse?courseId='+courseId);
}

//手动组卷
export const manualCreatePaperService=(paperData)=>{
    return request.post('/paper/manual',paperData)
}

//自动组卷
export const autoCreatePaperService=(paperData)=>{
    return request.post('/paper/auto',paperData)

}

//删除试卷
export const deletePaperService=(id)=>{
    return request.delete('/paper?id='+id);
}

