import { api } from '~/utils/api'

export const classService = {
    myclass: () => api.get<{data: LmsClass[]}>('/classes/my')
}