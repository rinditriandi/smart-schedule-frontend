import { useState, useEffect } from "react";
import axios from '../../lib/axios-ss.js'
import errorHandler from "../../helpers/errorHandler.js";

const useFilterMonth = () => {
  const [selectedMonth, setSelectedMonth] = useState('')

  useEffect(() => {
    const currentDate = new Date()
    setSelectedMonth(`${currentDate.getMonth()}`)
  }, [])

  return { selectedMonth, setSelectedMonth }
}

export default useFilterMonth