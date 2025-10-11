declare global {
    interface Lessons {
        id: number,
        class_id: number
        title: string,
        summary: string
        content: any
        content_json: any
        author_id: any,
        is_published: boolean
    }

    interface LessonCreate {
        class_id: number
        title: string,
        summary: string
        content: any
        content_json: any
        author_id: any,
        is_published: boolean
    }
}
export {}