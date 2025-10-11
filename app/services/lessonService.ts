import { api } from '~/utils/api'

export const LessonService = {
    createLesson: (body: LessonCreate) => api.post<Lessons>('/lessons', body),
}