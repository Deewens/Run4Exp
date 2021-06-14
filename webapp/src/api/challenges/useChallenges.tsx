import {useQuery, UseQueryOptions} from "react-query";
import {ChallengesApi, SortApi} from "../type";
import axios, {AxiosError} from 'axios'
import {Challenge} from "../entities/Challenge";
import {PagedEntities} from "../entities/PagedEntities";

type QueryParams = {
  page: number
  size?: number
  sort?: SortApi[]
  publishedOnly?: boolean
  adminOnly?: boolean
}

async function fetchChallenge(params: QueryParams): Promise<PagedEntities<Challenge>> {
  let input = `/challenges/?page=${params.page}`

  params.sort?.forEach((value) => {
    input = input + `&sort=${value.field},${value.order}`
  })

  if (params.size) input = input + `&size=${params.size}`

  if (params.publishedOnly) input = input + `&publishedOnly=${params.publishedOnly}`
  if (params.adminOnly) input = input + `&adminOnly=${params.adminOnly}`

  return await axios.get<ChallengesApi>(input)
    .then(response => {
      let challenges: Challenge[] = []
      if (response.data._embedded) {
        challenges = response.data._embedded.challengeResponseModelList.map(challengeApi => {
          return new Challenge(
            {
              name: challengeApi.name,
              description: challengeApi.description,
              shortDescription: challengeApi.shortDescription,
              administratorsId: challengeApi.administratorsId,
              published: challengeApi.published,
              creatorId: challengeApi.creatorId,
              scale: challengeApi.scale,
              checkpointsId: challengeApi.checkpointsId,
              segmentsId: challengeApi.segmentsId,
            }, challengeApi.id)
        })
      }

      return new PagedEntities<Challenge>(challenges, {
        pageSize: response.data.page.size,
        totalPages: response.data.page.totalPages,
        totalElements: response.data.page.totalElements,
        pageNumber: response.data.page.number
      })
    })
}

export default function useChallenges(params: QueryParams = {page: 0}, options?: UseQueryOptions<PagedEntities<Challenge>, AxiosError>) {
  return useQuery<PagedEntities<Challenge>, AxiosError>(
    ['challenges', params],
    () => fetchChallenge(params),
    options
  )
}