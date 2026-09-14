import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useFetchContactRoles = ({ opportunityId }) => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [contactRoles, setContactRoles] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    try {
      const options = {
        url: `/opportunities/contactRoles/${opportunityId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `settingManagement`,
          modApiName: `application`,
          policy: `read`
        }
      }
      setLoading(true)
      const { data } = await axios(options)
      setContactRoles(data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(err?.response?.data)
      setContactRoles([])
    }
  }

  useEffect(() => {
    if (opportunityId) {
      handleFetch()
    }
  }, [opportunityId])

  return { contactRoles, loadingFetchContactRoles: loading }
}

export default useFetchContactRoles