import { api } from '~/utils/api'

export const LessonService = {
    createLesson: (body: LessonCreate) => api.post<Lessons>('/lessons', body),
    getDetailLesson: (id: number) => api.get<Lessons>(`/lessons/${id}`),
    submitLesson: (id: number, body: any) => api.post(`/lessons/${id}/submit`, body),
    getLessonSubmission: (id: number) => api.get<any>(`/lessons/${id}/submission`),
    listLessonSubmissions: (id: number) => api.get<any>(`/lessons/${id}/submissions`),
    gradeEssay: (id: number, body: any) => api.post<any>(`/lessons/${id}/grade-essay`, body),
    listLessonGrades: (id: number) => api.get<any>(`/lessons/${id}/grades`),
    approveGrade: (id: number, gradeId: number) =>
        api.post<any>(`/lessons/${id}/grades/${gradeId}/approve`),
    overrideGrade: (id: number, gradeId: number, body: any) =>
        api.post<any>(`/lessons/${id}/grades/${gradeId}/override`, body),
}