import { api } from '~/utils/api'

export const classService = {
    myclass: () => api.get<{data: LmsClass[]}>('/classes/my'),
    createClass: (body: CreateLmsClass) => api.post<{data: LmsClass}>('/classes', body)
}