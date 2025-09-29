declare global {
    interface LmsClass {
        id: number
        title: string
        description?: string
        visibility: string
        code?: string
        creator: User
        created_at: Date | string
        updated_at?: Date | string

        // fe only
        color?: string 
    }
}
export {}