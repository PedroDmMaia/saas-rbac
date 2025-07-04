import { api } from './api-client'

interface signInWithGithubRequest {
  code: string
}

interface signInWithGithubResponse {
  token: string
}

export async function signInWithGithub({
  code,
}: signInWithGithubRequest): Promise<signInWithGithubResponse> {
  const result = await api
    .post('sessions/github', {
      json: {
        code,
      },
    })
    .json<signInWithGithubResponse>()

  return result
}
