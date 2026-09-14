import { useState, useEffect } from 'react'
import axios from '../../lib/axios-ss.js'
import errorHandler from '../../helpers/errorHandler.js'

// Router
import { useHistory, useLocation } from "react-router-dom"

const useExportExcelLearningHoursForApm = ({ startHours, endHours, group, profitCenter, wbsCode, consultantId, isSyncSap }) => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  const [executeExportExcel, setExecuteExportExcel] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleExportExcel = async () => {
    try {
      if (new Date(endHours).getTime() - new Date(startHours).getTime() > 5270400000) throw { code: '400', errors: ['export excel is available in range 61 day'] }

      const requestBody = {
        startHours: new Date(startHours).getTime(),
        endHours: new Date(endHours).getTime(),
        group,
        profitCenter,
        wbsCode,
        consultantId,
        isSyncSap
      }

      setLoading(true)
      const { data } = await axios({
        url: `/reports/learningHoursForApm`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `${segment_1}`,
          policy: `read`
        },
        data: requestBody
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

export default useExportExcelLearningHoursForApm