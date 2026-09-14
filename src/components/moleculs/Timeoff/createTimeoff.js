import React, { useState, useEffect } from 'react'
import axios from '../../../lib/axios-ss.js'
import { MySwal } from '../../../lib/swal'
import { numberToDate } from '../../../helpers/numberToDate.js'
import { numberToTime } from '../../../helpers/numberToTime.js'

// Error Handler
import errorHandler from '../../../helpers/errorHandler.js';

// React date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Hooks
import { useFetchTimeoffTypes, useFetchConsultants } from '../../../hooks'

// Router
import { useHistory } from 'react-router-dom'

const CreateTimeoff = ({ executeFetchTimeoff }) => {

  const history = useHistory()
  const { timeoffTypes } = useFetchTimeoffTypes()
  const { consultants } = useFetchConsultants()

  const [dateFrom, setDateFrom] = useState()
  const [dateTo, setDateTo] = useState()
  const [requestType, setRequestType] = useState('fullday')
  const [halfdayType, setHalfdayType] = useState('beforeBreak')
  const [activityType, setActivityType] = useState('')
  const [consultant, setConsultant] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTimeoffType, setSelectedTimeoffType] = useState()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      // Check same schedules
      const checkAvailibility = await axios({
        url: `/schedules/checkAvailability`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `time-off`,
          policy: `read`
        },
        data: {
          startHours: new Date(dateFrom).getTime(),
          endHours: new Date(dateTo).getTime(),
          ConsultantId: consultant
        }
      })

      if (checkAvailibility.data.data.sameSchedules.length > 0) {
        const sameSchedulesSwal = checkAvailibility.data.data.sameSchedules.map(item => (
          `<tr>
            <td>${item?.Schedule?.Plot?.client}</td>
            <td>${item?.Schedule?.Plot?.topic}</td>
            <td>${numberToDate(item?.Schedule?.startHours)} ${numberToTime(item?.Schedule?.startHours)} s/d ${numberToTime(item?.Schedule?.endHours)}</td>
            <td>${item?.Schedule?.Plot?.group}</td>
          </tr>`
        ))
        const responseSwal = await MySwal.fire({
          icon: 'warning',
          title: 'Oops, Bentrok nih !',
          html: `
            <html>
              <head>
                <style>
                  table, tr, td, th {
                    border: 1px solid black;
                    font-size: 8px;
                    margin: auto;
                  }
                </style>
              </head>
    
              <body>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Topic</th>
                        <th>Time</th>
                        <th>APM</th>
                      </tr>
                    </thead>
    
                    <tbody>
                      ${sameSchedulesSwal}
                    </tbody>
                  </table>
                </div>
                <div style="margin-top: 18px; text-align: center;">
                  <p>Apakah Anda akan tetap menyimpan schedule ini ? Silahkan berdiskusi dulu dengan tim Anda.</p>
                </div>
              </body>
            </html>
          `,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Ya, lanjutkan',
          cancelButtonText: 'Tidak, saya mau diskusi dulu'
        })

        if (!responseSwal.isConfirmed) {
          // setDisabled(false)
          return false
        }
      }

      const options = {
        url: `/timeoff`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          appApiName: `scheduleSystem`,
          modApiName: `time-off`,
          policy: `read`
        },
        data: {
          ConsultantId: consultant,
          ActivityTypeId: activityType,
          startHours: new Date(dateFrom).getTime(),
          endHours: new Date(dateTo).getTime(),
          requestType,
          halfdayType,
          description
        }
      }

      await axios(options)

      MySwal.fire({
        icon: 'success',
        text: 'Time off has been created',
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
    <div style={{ position: 'absolute', top: '0', bottom: '0', left: '0', right: '0', backgroundColor: 'rgba(0, 0, 0, .9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '99' }}>
      <div className='card' style={{ width: '26rem' }}>
        <div className='card-header'>
          <h4>Create New Timeoff</h4>
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
  )
}

export default CreateTimeoff