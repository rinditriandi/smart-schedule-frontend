import React, { useState, useEffect } from 'react'
import axios from '../../../lib/axios-ss.js'
import { MySwal } from '../../../lib/swal.js'
import { numberToDate } from '../../../helpers/numberToDate.js'
import { numberToTime } from '../../../helpers/numberToTime.js'

// Error Handler
import errorHandler from '../../../helpers/errorHandler.js';

// React date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Hooks
import { useFetchTimeoffTypes, useFetchConsultants, useFetchScheduleById } from '../../../hooks/index.js'

// Router
import { useHistory } from 'react-router-dom'

import Loading from '../Loading'

const UpdateTimeoff = ({ executeFetchTimeoff }) => {

  const history = useHistory()
  const { timeoffTypes } = useFetchTimeoffTypes()
  const { consultants } = useFetchConsultants()
  const { schedule, loadingFetchSchedule } = useFetchScheduleById()

  const [dateFrom, setDateFrom] = useState()
  const [dateTo, setDateTo] = useState()
  const [requestType, setRequestType] = useState('fullday')
  const [halfdayType, setHalfdayType] = useState('beforeBreak')
  const [activityType, setActivityType] = useState('')
  const [consultant, setConsultant] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTimeoffType, setSelectedTimeoffType] = useState()

  useEffect(() => {
    if (schedule) {
      setDateFrom(new Date(Number(schedule.startHours)))
      setDateTo(new Date(Number(schedule.endHours)))
      setActivityType(schedule.ActivityTypeId)
      setConsultant(schedule.Consultants[0].id)
      setDescription(schedule.description)
    }
  }, [schedule])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const options = {
        url: `/schedules/${schedule.id}`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `time-off`,
          policy: `read`
        },
        data: {
          sendEmailGcal: false,
          gcalSummary: 'timeoff',
          ActivityTypeId: activityType,
          startHours: new Date(dateFrom).getTime(),
          endHours: new Date(dateTo).getTime(),
          ClassTypeId: 3,
          description,
          consultants: [
            {
              ConsultantId: consultant,
              ConsultantTypeId: 9
            }
          ],
          breakDuration: 0
        }
      }

      await axios(options)

      MySwal.fire({
        icon: 'success',
        text: 'Time off has been updated',
        timer: 1500,
        showCancelButton: false,
        showConfirmButton: false,
        position: 'top-end'
      })

      executeFetchTimeoff(true)
      history.push('/time-off')
    } catch (err) {
      errorHandler({ err: err?.response?.data || err })
    }
  }

  useEffect(() => {
    let dateFrom_ = new Date()
    dateFrom_.setHours(0, 0, 0, 0)
    let dateTo_ = new Date()
    dateTo_.setHours(23, 59, 0, 0)

    setDateFrom(dateFrom_)
    setDateTo(dateTo_)
  }, [])

  useEffect(() => {
    if (timeoffTypes.length > 0) {
      const findTimeoff = timeoffTypes.find(item => item.ActivityTypeId == activityType)

      if (findTimeoff?.apiName === 'cutibesar' || findTimeoff?.apiName === 'cutitahunan') {
        setRequestType('fullday')
      }

      setSelectedTimeoffType(findTimeoff)
    }
  }, [activityType, timeoffTypes])

  return (
    <>
      <div style={{ position: 'absolute', top: '0', bottom: '0', left: '0', right: '0', backgroundColor: 'rgba(0, 0, 0, .9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '99' }}>
        <div className='card' style={{ width: '26rem' }}>
          {
            loadingFetchSchedule && <Loading />
          }
          <div className='card-header'>
            <h4>Update Timeoff</h4>
          </div>
          <div className='card-body'>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label'>Consultant</label>
                <select
                  className='form-select'
                  value={consultant}
                  onChange={e => setConsultant(e.target.value)}
                >
                  <option value="">Select Consultant</option>
                  {
                    consultants.map(consultant => (
                      <option key={consultant.id} value={consultant.id}>{consultant.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className='mb-3'>
                <label className='form-label'>Type</label>
                <select
                  className='form-select'
                  value={activityType}
                  onChange={e => setActivityType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  {
                    timeoffTypes.map(typeItem => (
                      <option key={typeItem.id} value={typeItem.ActivityTypeId}>{typeItem.label}</option>
                    ))
                  }
                </select>
              </div>
              <div className='mb-3'>
                <label className='form-label'>Request Type</label>
                {
                  selectedTimeoffType?.apiName === 'cutibesar' || selectedTimeoffType?.apiName === 'cutitahunan' ?
                    <input
                      readOnly
                      value={requestType}
                      className='form-control'
                    />
                    :
                    <select
                      className='form-select'
                      value={requestType}
                      onChange={e => setRequestType(e.target.value)}
                    >
                      <option value="fullday">fullday</option>
                      <option value="halfday">halfday</option>
                    </select>
                }
              </div>
              {
                requestType !== 'halfday' ?
                  null
                  :
                  <div className='mb-3'>
                    <label className='form-label'>Halfday Type</label>
                    <select
                      className='form-select'
                      value={halfdayType}
                      onChange={e => setHalfdayType(e.target.value)}
                    >
                      <option value="beforeBreak">Before Break</option>
                      <option value="afterBreak">After Break</option>
                    </select>
                  </div>
              }
              <div className='mb-3'>
                <label className='form-label'>Date From</label>
                <DatePicker
                  selected={dateFrom}
                  onChange={date => {
                    let date_ = new Date(date)
                    date_.setHours(0, 0, 0, 0)
                    setDateFrom(date_)
                  }}
                  className='form-control'
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className='mb-3'>
                <label className='form-label'>Date To</label>
                <DatePicker
                  selected={dateTo}
                  onChange={date => {
                    let date_ = new Date(date)
                    date_.setHours(23, 59, 0, 0)
                    setDateTo(date_)
                  }}
                  className='form-control'
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className='mb-3'>
                <label className='form-label'>Note</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className='mb-3 text-center'>
                <button
                  type="button"
                  className='btn btn-sm btn-secondary mx-2'
                  onClick={() => history.push('/time-off')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className='btn btn-sm btn-primary mx-2'
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateTimeoff