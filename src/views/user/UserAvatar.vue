<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useTokenStore } from '@/stores/token';
import useUserInfoStore from '@/stores/userInfo'
import {updateAvatarService} from '@/api/user'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();

const imgUrl = ref(userInfoStore.info.avatar)

//图片上传成功时，将图片地址赋值
const uploadSuccess = (result)=>{
    imgUrl.value = result.data;
}

//上传头像
const updateAvatar=async()=>{
    const result = await updateAvatarService(imgUrl.value);
    ElMessage.success('上传成功！')
    userInfoStore.info.avatar = imgUrl.value
}

const uploadRef = ref();
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span style="font-weight: bold;">更换头像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload ref="uploadRef" class="avatar-uploader" :show-file-list="false" :auto-upload="true"
                    action="/api/upload" name="file" :headers="{ 'Authorization': tokenStore.token }"
                    :on-success="uploadSuccess">
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <img v-else :src="avatar" width="278" />
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large"
                    @click="uploadRef.$el.querySelector('input').click()">
                    选择图片
                </el-button>
                <el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
                    上传头像
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>