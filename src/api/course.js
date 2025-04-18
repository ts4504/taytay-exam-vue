import request from '@/utils/request'

export const getCourseListService=()=>{
    return request.get('/course/list')
}

export const addCourseService=(courseData)=>{
    return request.post('/course/add',courseData);
}

export const updateCourseService=(courseData)=>{
    return request.put('/course/update',courseData)
}

export const deleteCourseService=(id)=>{
    return request.delete('/course'+'?id='+id)
}