import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useFetchProgramScheduleById = ({ programScheduleId }) => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [programSchedule, setProgramSchedule] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      const options = {
        url: `/programSchedules/${programScheduleId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `${segment_1}`,
          policy: `read`
        }
      }
      setLoading(true)
      const { data } = await axios(options)
      setProgramSchedule(data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setProgramSchedule(null)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    if (programScheduleId) {
      handleFetch()
    }
  }, [programScheduleId])

  return { programSchedule, loadingFetchProgramSchedule: loading }
}

export default useFetchProgramScheduleById