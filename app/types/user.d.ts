declare global {
  interface User {
    id: number
    name: string
    email: string
    is_active: boolean
    created_at: string 
    updated_at: string
  }

  interface CreateUserDto {
    name: string
    email: string
    is_active?: boolean
  }

  interface UpdateUserDto {
    id: number
    name?: string
    email?: string
    is_active?: boolean
  }
}

export {}
