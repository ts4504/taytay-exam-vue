import request from '@/utils/request'

export const addAnnouncementService=(announcementData)=>{
    return request.post('/announcement/add',announcementData)
}

export const getAnnouncementListService=()=>{
    return request.get('/announcement/list')
}

export const updateAnnouncementService=(announcementData)=>{
    return request.put('/announcement',announcementData)
}

export const deleteAnnouncementService=(id)=>{
    return request.delete('/announcement?id='+id)
}