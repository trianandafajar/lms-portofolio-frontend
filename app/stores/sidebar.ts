// ~/stores/sidebar.ts
export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    collapsed: false,
    classListOpen: true,
  }),

  actions: {
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
    toggleClassList() {
      this.classListOpen = !this.classListOpen
    },
  },

  persist: true
})
