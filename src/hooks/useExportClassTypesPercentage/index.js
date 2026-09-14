import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";
import queryParams from "../../helpers/queryParams.js";

// Router
import { useHistory, useLocation } from "react-router-dom"

const useExportClassTypesPercentage = ({ dateFrom, dateTo, isSyncSap, isGcalSync }) => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];
  const [execute, setExecute] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleExportExcel = async () => {
    try {
      setLoading(true)
      console.log('export report class types percentage', dateFrom, dateTo)
      const { data } = await axios({
        url: `/reports/classTypesPersen`,
        method: 'POST',
        data: {
          startHours: new Date(dateFrom).getTime(),
          endHours: new Date(dateTo).getTime(),
          isSyncSap: isSyncSap,
          isGcalSync: isGcalSync,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `${segment_1}`,
          policy: `read`
        }
      })
      setExecute(false)
      setLoading(false)

      window.open(data.data.link)
    } catch (err) {
      console.log(err?.response?.data || err)
      setLoading(false)
      setExecute(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    if (execute) {
      handleExportExcel()
    }
  }, [execute])

  return { executeExportReports: setExecute, loadingExportReports: loading }
}

export default useExportClassTypesPercentage