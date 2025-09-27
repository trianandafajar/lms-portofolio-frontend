declare global {
  interface AuthLogin {
    email: string
    password: string
  }

  interface AuthBearerResponse {
    type: 'Bearer'
    token: string
  }

  interface AuthRegister extends AuthLogin {
    is_active: boolean
  }

  interface UserMe extends User {
    permissions: string[],
    roles: string[]
    profile: {
      avatar_file_id: string | null,
      bio: string
      display_name: string
      extra: string
    } | null
  }
}

export {}