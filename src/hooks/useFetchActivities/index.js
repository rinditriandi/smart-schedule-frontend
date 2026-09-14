import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useFetchActivities = () => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      const options = {
        url: `/activityTypes`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `learning-hours`,
          policy: `read`
        }
      }
      setLoading(true)
      const { data } = await axios(options)
      setActivities(data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    handleFetch()
  }, [])

  return { activities, loadingFetchActivities: loading }
}

export default useFetchActivities