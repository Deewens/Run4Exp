import {useQuery} from "react-query";
import axios, {AxiosError} from "axios";
import {UserStatistics, UserStatisticsApi, UserStatisticsDailyDistance} from "../type";

async function getStatistics() {
  return await axios.get<UserStatisticsApi>('/users/statistics')
    .then(response => {
      let data = response.data
      let dailyDistance: UserStatisticsDailyDistance[] = []
      data.dailyDistance.forEach(item => {
        dailyDistance.push({
          day: new Date(item.day),
          distance: item.distance,
        })
      })

      return {
        abandonedChallenges: data.abandonnedChallenges,
        dailyDistance: dailyDistance,
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