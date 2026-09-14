import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useFetchOpportunityById = ({ opportunityId }) => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      const options = {
        url: `/opportunities/${opportunityId}`,
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
      setOpportunity(data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    if (opportunityId) {
      handleFetch()
    }
  }, [opportunityId])

  return { opportunity, loadingFetchOpportunity: loading }
}

export default useFetchOpportunityById