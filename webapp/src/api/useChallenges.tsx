import {useQuery, UseQueryOptions} from "react-query";
import {ChallengeApi, ErrorApi, SortApi} from "./type";
import axios, {AxiosError} from 'axios'
import {Challenge} from "./entities/Challenge";
import {PagedEntities} from "./entities/PagedEntities";

async function fetchChallenge(page = 0, sort?: SortApi[]): Promise<PagedEntities<Challenge>> {
  let key = ['challenges', page]
  let input = `/challenges?page=${page}`
  sort?.forEach((value) => {
    input = input + `&sort=${value.field},${value.order}`
    key.push(value.field, value.order)
  })

  return await axios.get<ChallengeApi>(input)
    .then(response => {
      let challenges: Challenge[] = []
      if (response.data._embedded) {
        challenges = response.data._embedded.challengeResponseModelList.map(challengeApi => {
          return new Challenge(
            {
              name: challengeApi.name,
              description: challengeApi.description,
              administratorsId: challengeApi.administratorsId
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

export default function useChallenges(page = 0, sort?: SortApi[]) {
  return useQuery<PagedEntities<Challenge>, AxiosError>(
    ['challenges', page, sort],
    () => fetchChallenge(page, sort),
  )
}