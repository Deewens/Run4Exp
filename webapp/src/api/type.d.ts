type ErrorApi = {
  slug: string
  timestamp: string
  code: number
  error: string
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
  superAdmin: boolean
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
  id: number
  name: string
  scale: number
  description: string
  shortDescription: string
  administratorsId: number[]
  segmentsId: number[]
  checkpointsId: number[]
  published: boolean
  creatorId: number
}

export type ChallengesApi = {
  content: {
    id: number
    name: string
    description: string
    shortDescription: string
    administratorsId: number[]
    published: boolean
    creatorId: number
    checkpointsId: number[]
    segmentsId: number[]
    scale: number
  }[],
  last: boolean
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export type ChallengeCreated = {
  id: number
  name: string
  description: string
  shortDescription: string
  scale: number
  endpoints: []
}

export type ChallengeCreate = {
  name: string
  description: string
  shortDescription: string
  scale: number
}

export type ChallengeUpdate = ChallengeCreate & {
  id: number,
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

// UserSession
export type UserSessionDetailless = {
  challengeId: number
  userId: number
  id: number
}

export type UserSessionApi = {
  advancement: number,
  currentSegmentId: number,
  id: number,
  isEnd: boolean,
  isIntersection: boolean,
  obstacleId: number,
  totalAdvancement: number
}

export type UserSessionRun = {
  userSessionId: number
  startDate: string
  endDate: string | null
  advancement: number
}

type UserStatisticsApi = {
  totalDistance: number
  totalTime: number
  ongoingChallenges: number
  finishedChallenges: number
  abandonnedChallenges: number
  dailyDistance: {day: string, distance: number}[]
}

type UserStatisticsDailyDistance = {
  day: Date,
  distance: number
}

type UserStatistics = {
  totalDistance: number
  totalTime: number
  ongoingChallenges: number
  finishedChallenges: number
  abandonedChallenges: number
  dailyDistance: UserStatisticsDailyDistance[]
}