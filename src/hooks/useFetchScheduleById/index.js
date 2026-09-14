import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";
import useUrlQueryString from '../useUrlQueryString/index.js'

const useFetchScheduleById = () => {
  const { queryString } = useUrlQueryString()

  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      const options = {
        url: `/schedules/${queryString.update}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `time-off`,
          policy: `read`
        }
      }
      setLoading(true)
      const { data } = await axios(options)
      setSchedule(data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    if (queryString?.update) {
      handleFetch()
    }
  }, [queryString])

  return { schedule, loadingFetchSchedule: loading }
}

export default useFetchScheduleById