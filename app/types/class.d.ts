declare global {
    interface LmsClass {
        id: number
        title: string
        description?: string
        visibility: string
        code?: string
        creator: User
        member_count: number
        created_at: Date | string
        updated_at?: Date | string

        // fe only
        color?: string 
    }

    interface CreateLmsClass {
        title: string
        description?: string
    }
}
export {}