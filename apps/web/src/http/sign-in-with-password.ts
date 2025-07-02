import { api } from './api-client'

interface signInWithPasswordRequest {
  email: string
  password: string
}

interface signInWithPasswordResponse {
  token: string
}

export async function signInWithPassword({
  email,
  password,
}: signInWithPasswordRequest): Promise<signInWithPasswordResponse> {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password: String(password),
      },
    })
    .json<signInWithPasswordResponse>()

  return result
}
