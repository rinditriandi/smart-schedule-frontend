import { useState, useEffect } from 'react'
import axios from '../../lib/axios-ss.js'
import errorHandler from '../../helpers/errorHandler.js'

// Router
import { useHistory, useLocation } from "react-router-dom"

const useExportExcelLearningHoursByApm = ({ year }) => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [executeExportExcel, setExecuteExportExcel] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleExportExcel = async () => {
    try {
      setLoading(true)
      const { data } = await axios({
        url: `/reports/learningHoursByApm`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `learning-hours`,
          policy: `read`
        },
        data: { year }
      })

      setLoading(false)
      setExecuteExportExcel(false)

      window.open(data.data.link)
    } catch (err) {
      setExecuteExportExcel(false)
      setLoading(false)
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    if (executeExportExcel) {
      handleExportExcel()
    }
  }, [executeExportExcel])

  return { setExecuteExportExcel, loadingExportExcel: loading }
}

export default useExportExcelLearningHoursByApm