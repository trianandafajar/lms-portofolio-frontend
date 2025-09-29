import { classService } from "~/services/classService"

interface State {
  clases: LmsClass[] | null
}

export const useLmsClassStore = defineStore('lmsclass', {
  state: (): State => ({
    clases: null
  }),
  actions: {
    async getMyClass() {
      try {
        const res = await classService.myclass()
        this.clases = res.data
        return res
      } catch (error) {
        throw error
      }
    },

    clearClasses() {
      this.clases = null
    },
  },
  persist: true
})
