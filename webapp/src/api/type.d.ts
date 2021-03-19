export type ErrorApi = {
  message: string
  status: number
}

type SortApi = {
  field: string
  order: 'asc' | 'desc'
}

/*
 * /users
 */
export type User = {
  id: number
  name: string
  firstName: string
  email: string
}

export type UserSignup = {
  name: string
  firstName: string
  email: string
  password: string
  passwordConfirmation: string
}

export type UserSignin = {
  email: string
  password: string
}

export interface UserWithToken extends User {
  token: string
}

/*
 * /challenges
 */

export type ChallengeApi = {
  _embedded: {
    challengeResponseModelList: {
      id: number
      name: string
      description: string
      administratorsId: number[]
    }[],
  },
  page: PageApi,
}

export type ChallengeCreated = {
  id: number
  name: string
  description: string
  scale: number
  endpoints: []
}

export type ChallengeCreate = {
  name: string
  description: string
}

export type PageApi = {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export type Page = {
  pageSize: number
  totalElements: number
  totalPages: number
  pageNumber: number
}

// Checkpoint
