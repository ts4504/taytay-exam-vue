<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { getAnnouncementListService,addAnnouncementService,updateAnnouncementService,deleteAnnouncementService } from '@/api/annnouncement'
import { getAllAdminService } from '@/api/user'
import { ref } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'

//公告列表
const announcements = ref([{
    "id": '',
    "title": '',
    "content": '',
    "adminId": '',
    "publishTime": ''
}])

//管理员列表
const admins = ref([{
    "id": '',
    "username": '',
    'avatar': '',
    "role": '',
}])

//获取所有管理员信息
const getAdminList = async () => {
    let result = await getAllAdminService()
    admins.value = result.data
    console.log(admins.value);

}

//获取所有公告
const getAnnouncementList = async () => {
    let result = await getAnnouncementListService()
    announcements.value = result.data

    //为announcements扩展createUserName属性
    for (let i = 0; i < announcements.value.length; i++) {
        let annnouncement = announcements.value[i]
        for (let j = 0; j < admins.value.length; j++) {
            if (annnouncement.adminId === admins.value[j].id) {
                annnouncement.createUserName = admins.value[j].username
            }
        }
    }
    console.log(announcements.value);

}
getAdminList()
getAnnouncementList()


const visibleDrawer = ref(false);
const title = ref('')

//公告表单
const announcementModel = ref({
    'id':'',
    "title": "",
    "content": "",
})

//清空公告表单
const clearAnnouncementModel = () => {
    announcementModel.value.id = ''
    announcementModel.value.title = ''
    announcementModel.value.content = ''
    announcementModel.value.publishTime = ''
}

//添加公告
const addAnnouncement=async()=>{
    await addAnnouncementService(announcementModel.value)
    ElMessage.success("添加成功！")
    getAnnouncementList()
    visibleDrawer.value = false
}

//弹出抽屉
const showDrawer = (row)=>{
    visibleDrawer.value = true
    announcementModel.value.id = row.id
    announcementModel.value.title = row.title
    announcementModel.value.content = row.content
}

//更新公告
const updateAnnouncement=async()=>{
    await updateAnnouncementService(announcementModel.value)
    ElMessage.success("修改成功！")
    getAnnouncementList()
    visibleDrawer.value = false
}

//删除管理员
const deleteAnnouncement = async(id)=>{
    
    ElMessageBox.confirm(
        '即将删除该公告，是否继续？',
        '温馨提示',
        {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        await deleteAnnouncementService(id);
        ElMessage({
            type: 'success',
            message: '删除成功！',
        })
        getAnnouncementList()
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '管理员取消删除',
        })
    })
}


</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">考试管理</span>
                <div class="extra">
                    <el-button type="primary" @click="title = '发布公告';visibleDrawer = true; clearAnnouncementModel()">发布公告</el-button>
                </div>
            </div>
        </template>

        <el-table :data="announcements">
            <el-table-column label="公告标题" prop="title"></el-table-column>
            <el-table-column label="内容" prop="content" width="800"></el-table-column>
            <el-table-column label="创建人" prop="createUserName"></el-table-column>
            <el-table-column label="发布时间" prop="publishTime"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button @click="showDrawer(row)" type="primary" :icon="Edit" circle plain></el-button>
                    <el-button @click="deleteAnnouncement(row.id)" type="danger" :icon="Delete" circle
                        plain></el-button>

                </template>
            </el-table-column>

            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <el-drawer :title="title" v-model="visibleDrawer" size="40%">
            <el-form :model="announcementModel" label-width="100px">
                <el-form-item label="标题：">
                    <el-input v-model="announcementModel.title" placeholder="请输入公告标题"></el-input>
                </el-form-item>
                <el-form-item label="内容：">
                    <el-input type="textarea" rows="8" v-model="announcementModel.content" placeholder="请输入公告内容"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="title==='发布公告'?addAnnouncement():updateAnnouncement()">提交</el-button>
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