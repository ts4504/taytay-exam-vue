import { createRouter, createWebHistory } from 'vue-router'



import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import NotFoundVue from '@/views/NotFound.vue'
//学生页面
import StudentStartVue from '@/views/student/StudentStart.vue'
import StudentCourseVue from '@/views/student/StudentCourse.vue'
import StudentExamVue from '@/views/student/StudentExam.vue'
import StudentGradeVue from '@/views/student/StudentGrade.vue'

//教师页面
import TeacherStartVue from '@/views/teacher/TeacherStart.vue'
import TeacherQuestionVue from '@/views/teacher/TeacherQuestion.vue'
import TeacherExamVue from '@/views/teacher/TeacherExam.vue'
import TeacherCourseVue from '@/views/teacher/TeacherCourse.vue'
import TeacherPaperVue from '@/views/teacher/TeacherPaper.vue'
import TeacherGradeVue from '@/views/teacher/TeacherGrade.vue'



//管理员组件
import AdminAnnounceVue from '@/views/admin/AdminAnnounce.vue'
import AdminStudentsVue from '@/views/admin/AdminStudent.vue'
import AdminTeachersVue from '@/views/admin/AdminTeachers.vue'
import AdminsVue from '@/views/admin/Admins.vue'


//用户组件
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import ResetPasswordVue from '@/views/user/ResetPassword.vue'


const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/', component: LayoutVue, redirect:'/userInfo',
        children: [
            //教师组件
            { path: '/teacher/course', component: TeacherCourseVue },
            { path: '/teacher/exam', component: TeacherExamVue },
            { path: '/teacher/start', component: TeacherStartVue },
            { path: '/teacher/question', component: TeacherQuestionVue },
            { path: '/teacher/paper', component: TeacherPaperVue },
            { path: '/teacher/grade', component: TeacherGradeVue },

            //学生组件
            { path: '/student/course', component: StudentCourseVue },
            { path: '/student/exam', component: StudentExamVue },
            { path: '/student/start', component: StudentStartVue },
            { path: '/student/grade', component: StudentGradeVue },
            
            //用户组件
            { path: '/userInfo', component: UserInfoVue },
            { path: '/avatar', component: UserAvatarVue },
            { path: '/reset', component: ResetPasswordVue },

            //管理员组件
            {path:'/admin/announcement',component:AdminAnnounceVue},
            {path:'/admin/teachers',component:AdminTeachersVue},
            {path:'/admin/students',component:AdminStudentsVue},
            {path:'/admins',component:AdminsVue}


        ]
    },
    { path: '/:pathMatch(.*)*', component: NotFoundVue }
]


const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router