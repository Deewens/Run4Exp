import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {UserStatistics, UserStatisticsApi} from "../type";

async function getStatistics() {
  return await axios.get<UserStatisticsApi>('/users/statistics')
    .then(response => {
      let data = response.data
      return {
        abandonedChallenges: data.abandonnedChallenges,
        dailyDistance: data.dailyDistance,
        finishedChallenges: data.finishedChallenges,
        ongoingChallenges: data.ongoingChallenges,
        totalDistance: data.totalDistance,
        totalTime: data.totalTime
      } as UserStatistics
    })
}

export default function useStatistics() {
  return useQuery<UserStatistics, AxiosError>(
    ['statistics'],
    () => getStatistics())
}