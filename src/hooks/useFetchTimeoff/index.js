import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useFetchTimeoff = ({ dateFrom = '', dateTo = '', ConsultantId = '', activityType }) => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [timeoff, setTimeoff] = useState([])
  const [loading, setLoading] = useState(false)
  const [execute, setExecute] = useState(false)

  const handleFetch = async () => {
    try {
      const options = {
        url: `/timeoff?dateFrom=${dateFrom}&dateTo=${dateTo}&ConsultantId=${ConsultantId}&ActivityTypeId=${activityType}`,
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
      setTimeoff(data.data)
      setLoading(false)
      setExecute(false)
    } catch (err) {
      setExecute(false)
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    if (dateFrom && dateTo) {
      handleFetch()
    }
  }, [dateFrom, dateTo, ConsultantId, activityType])

  useEffect(() => {
    if (execute) {
      handleFetch()
    }
  }, [execute])

  return { timeoff, loadingFetchTimeoff: loading, executeFetchTimeoff: setExecute }
}

export default useFetchTimeoff