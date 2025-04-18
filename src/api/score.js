import request from '@/utils/request'

export const getScoreListService=(params)=>{
    return request.get('/score/list',{params:params})
}

export const updateScoreService=(id,score,status)=>{
    
    return request.put('/score?id='+id+'&score='+score+'&status='+status)
}