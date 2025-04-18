import request from "@/utils/request.js"

//登录接口
export const userLoginService=(loginData)=>{
    const params = new URLSearchParams()
    for(let key in loginData){
        params.append(key,loginData[key])
    }
    return request.post('/user/login',params)
}
//注册接口
export const userRegisterService=(registerData)=>{
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key])
    }
    return request.post('/user/register',params)
}

export const getUserInfoService=()=>{
    return request.get('/user/info')
}

export const getAllTeachersService=()=>{
    return request.get('/user/allTeacher')
}

export const getAllStudentService=()=>{
    return request.get('/user/allStudent')
}

export const updateAvatarService=(imgUrl)=>{
    return request.patch('/user/updateAvatar?avatarUrl='+imgUrl)
}

export const updatePwdService=(resetPwdData)=>{
    return request.patch('/user/updatePwd',resetPwdData)
}

//更新用户信息
export const updateUserInfoService=(userData)=>{
    return request.put('/user/update',userData);
}

//获取所有管理员信息
export const getAllAdminService=()=>{
    return request.get('/user/allAdmin')
}

//管理员添加用户
export const addUserService=(userData)=>{
    return request.post('/user/add',userData)
}

//管理员删除用户
export const deleteUserService=(id)=>{
    return request.delete('/user?id='+id)
}