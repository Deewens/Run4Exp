import {useInfiniteQuery, useQuery} from "react-query";
import {ChallengesApi, SortApi} from "../../type";
import axios, {AxiosError} from 'axios'
import {Challenge} from "../../entities/Challenge";
import {PagedEntities} from "../../entities/PagedEntities";

interface QueryKeyType {
  size?: number
  sort?: SortApi[]
  publishedOnly?: boolean
}

async function fetchChallenges({pageParam = 0, queryKey }: {pageParam?: number, queryKey: [string, QueryKeyType?]}): Promise<PagedEntities<Challenge>> {
  let params = queryKey[1]

  let input = `/challenges/?page=${pageParam}`

  if (params) {
    params.sort?.forEach((value) => {
      input = input + `&sort=${value.field},${value.order}`
    })

    if (params.size) input = input + `&size=${params.size}`

    if (params.publishedOnly) input = input + `&publishedOnly=${params.publishedOnly}`
  }

  return await axios.get<ChallengesApi>(input)
  .then(response => {
    let challenges: Challenge[] = []
    if (response.data.content) {
      challenges = response.data.content.map(challengeApi => {
        return new Challenge(
          {
            name: challengeApi.name,
            description: challengeApi.description,
            shortDescription: challengeApi.shortDescription,
            administratorsId: challengeApi.administratorsId,
            published: challengeApi.published,
          }, challengeApi.id)
      })
    }

    return new PagedEntities<Challenge>(challenges, {
      pageSize: response.data.size,
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
      pageNumber: response.data.number
    })
  })
}

/**
 * Get the list of challenge accessible by the connected user by doing an infinite query.
 *
 * This query is paginated and this query is used to infinite fetch until there is not page left
 *
 * @param key filters used to perform the query
 */
export default function useChallengesInfinite(key?: QueryKeyType) {
  return useInfiniteQuery<PagedEntities<Challenge>, AxiosError, PagedEntities<Challenge>, [string, QueryKeyType?]>(
    ['challengesInfinite', key],
    fetchChallenges,
    {
      getNextPageParam: lastPage => {
        return lastPage.page.totalPages > 0 && lastPage.page.pageNumber+1 === lastPage.page.totalPages ? false : lastPage.page.pageNumber+1
      },

    }
  )
}