import { LessonService } from "~/services/lessonService"


interface State {
  lesson: Lessons | null
  loading: boolean
  error: string | null
}

export const useLessonStore = defineStore('lesson', {
  state: (): State => ({
    lesson: null,
    loading: false,
    error: null,
  }),
  actions: {
    async createLesson(payload: LessonCreate) {
      this.loading = true
      this.error = null
      try {
        const res = await LessonService.createLesson(payload)
        
        return res
      } catch (err: any) {
        this.error = err?.response?.data?.message || err.message || "Failed to create class"
        throw err
      } finally {
        this.loading = false
      }
    },


    clearLessons() {
      this.lesson = null
      this.error = null
    },
  },
  persist: true
})
