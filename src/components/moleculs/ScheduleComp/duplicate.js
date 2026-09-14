import React, { useState, useEffect } from 'react'
import axios from '../../../lib/axios-ss.js'
import { MySwal } from '../../../lib/swal'
import { convertMinuteToMs } from "../../../helpers/convertMinuteToMs";

import { numberToTime } from '../../../helpers/numberToTime.js';
import { numberToDate } from '../../../helpers/numberToDate.js';
import { numberToDateTime } from '../../../helpers/numberToDateTime.js';

import AsyncSelect from 'react-select/async';
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

// Hooks
import { useFetchUsers } from '../../../hooks'

// Error Handler
import errorHandler from '../../../helpers/errorHandler.js';

const DuplicateComp = (props) => {

	const date = new Date();
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	const currentUrl = window.location.pathname.split("/");
	const segment_1 = currentUrl[1];

	const [disabled, setDisabled] = useState(false)
	const [syncGcal, setSyncGcal] = useState(false)
	const [sendEmailGcal, setSendEmailGcal] = useState(false)
	const [plots, setPlots] = useState([])
	const [plotId, setPlotId] = useState({
		label: '',
		value: '',
	})
	const [rc, setRc] = useState([])
	const [activities, setActivities] = useState([])
	const [classTypes, setClassTypes] = useState([])
	// const [consultants, setConsultants] = useState([])
	const [activityTypeId, setActivityTypeId] = useState('')
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const [classTypeId, setClassTypeId] = useState('')
	const [location, setLocation] = useState('')
	const [description, setDescription] = useState('')
	const [breakDuration, setBreakDuration] = useState('')
	// const [plotId, setPlotId] = useState('')
	const [titleGcal, setTitleGcal] = useState('')
	const [rows, setRows] = useState([])
	const [listEmailRc, setListEmailRc] = useState([])
	const [rowsRc, setRowsRc] = useState(null)
	console.log(rowsRc)

	const { users, loadingFetchUsers } = useFetchUsers()
	// console.log(users)

	const handleSearchWbs = inputValue => {
		return new Promise(async (resolve, reject) => {
			try {
				if (!inputValue) return
				const options = {
					url: `/plots?search=${inputValue}`,
					method: 'GET',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						appApiName: `scheduleSystem`,
						modApiName: `${segment_1}`,
						policy: `read`
					}
				}
				const { data } = await axios(options)

				resolve(data.data.items.map(item => {
					return {
						value: item.id,
						label: `${item.name} ${item.topic}`
					}
				}))
			} catch (err) {
				console.log(err?.response?.data || err)
				errorHandler({ err: err?.response?.data || err })
			}
		})
	}

	const fetchRc = async () => {
		try {
			const options = {
				url: `/consultants`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `scheduleSystem`,
					modApiName: `${segment_1}`,
					policy: `read`
				}
			}
			const { data } = await axios(options)
			// console.log(data.data)
			setRc(data.data)

		} catch (err) {
			console.log(err)
			errorHandler({ err: err?.response?.data || err })
		}
	}

	const fetchActivities = async () => {
		try {
			const options = {
				url: `/activityTypes`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `scheduleSystem`,
					modApiName: `${segment_1}`,
					policy: `read`
				}
			}
			const { data } = await axios(options)
			// console.log(data.data)
			setActivities(data.data)

		} catch (err) {
			console.log(err?.response?.data || err)
			errorHandler({ err: err?.response?.data || err })
		}
	}

	const fetchClassTypes = async () => {
		try {
			const options = {
				url: `/classTypes`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `scheduleSystem`,
					modApiName: `${segment_1}`,
					policy: `read`
				}
			}
			const { data } = await axios(options)
			// console.log(data.data)
			setClassTypes(data.data)

		} catch (err) {
			console.log(err?.response?.data || err)
			errorHandler({ err: err?.response?.data || err })
		}
	}

	const fetchScheduleById = async () => {
		try {
			const options = {
				url: `/schedules/${props.lgShowDuplicate}`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `scheduleSystem`,
					modApiName: `schedule-detail`,
					policy: `read`
				}
			}
			const { data } = await axios(options)
			setPlotId({
				value: data.data.PlotId,
				label: data.data.Plot.name
			})
			setDescription(data.data.description)
			setActivityTypeId(data.data.ActivityType.id)
			setClassTypeId(data.data.ClassType.id)
			setLocation(data.data.location)
			setTitleGcal(data.data.gcalSummary)

			data.data.ScheduleAttendees.map((item, idx) => (
				setRows(rows => [...rows, { email: item.email }])
			))

			setDateFrom(numberToDateTime(data.data.startHours))
			setDateTo(numberToDateTime(data.data.endHours))

		} catch (err) {
			console.log(err?.response?.data || err)
			errorHandler({ err: err?.response?.data || err })
		}
	}

	const handleAdd = async () => {
		setDisabled(true)

		const checkAvailibility = await axios({
			url: `/schedules/checkAvailability`,
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				appApiName: `settingManagement`,
				modApiName: `application`,
				policy: `read`
			},
			data: {
				startHours: new Date(dateFrom).getTime(),
				endHours: new Date(dateTo).getTime(),
				ConsultantId: rowsRc[0].ConsultantId
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
				setDisabled(false)
				return false
			}
		}

		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				appApiName: `settingManagement`,
				modApiName: `application`,
				policy: `read`
			}
		}

		const fixGuest = [...rows]

		const requestBody = {
			PlotId: plotId.value,
			gcalSync: syncGcal === "true" ? true : false,
			sendEmailGcal: true,
			gcalSummary: titleGcal,
			consultants: rowsRc,
			ActivityTypeId: activityTypeId,
			startHours: new Date(dateFrom).getTime(),
			endHours: new Date(dateTo).getTime(),
			ClassTypeId: classTypeId,
			location: location,
			description: description,
			breakDuration: breakDuration ? convertMinuteToMs(breakDuration) : null,
			attendees: fixGuest
		}
		axios.post(`/schedules`, requestBody, config)
			.then(res => {
				// console.log(res)
				if (res.status === 201) {
					setDisabled(false)

					MySwal.fire({
						icon: 'success',
						title: 'Success',
						text: 'Schedule has been created successfully!',
					})
						.then(() => {
							props.fetch(firstDay.getTime(), lastDay.getTime())
							props.close()
						})
				}
			})
			.catch(err => {
				console.log(err?.response?.data || err)
				errorHandler({ err: err?.response?.data || err })
			})

	}

	const handleChangeDate = (date) => {
		setDateFrom(date)
		setDateTo(date)
	}

	useEffect(() => {
		// fetchPlot()
		fetchScheduleById()
		fetchRc()
		fetchActivities()
		fetchClassTypes()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<div className='row'>
				<div className='col'>
					<label className='form-label required'>Consultants</label>
					{
						rc.length > 0 ?
							<Select
								options={rc.map(item => {
									return {
										label: item.name,
										value: item.id,
										type: 9
									}
								})}
								onChange={e => setRowsRc(e.map(item => {
									return {
										ConsultantId: item.value,
										ConsultantTypeId: item.type
									}
								}))}
								isMulti
							/>
							:
							null
					}
				</div>
			</div>
			<div className='row'>
				<div className="row form-group">
					<div className="col-12 mb-3">
						<label className="form-label col-12 col-form-label required">WBS</label>
						<div className="col">
							<AsyncSelect
								cacheOptions
								defaultOptions
								loadOptions={handleSearchWbs}
								value={plotId}
								onChange={e => setPlotId({
									value: e.value,
									label: e.label
								})}
							/>
						</div>
					</div>
					<div className="col-lg-6 col-12 mb-3">
						<label className="form-label col-12 col-form-label required">Date from</label>
						<div className="col">
							<input type="datetime-local" className='form-control' onChange={e => handleChangeDate(e.target.value)} value={dateFrom} />
						</div>
					</div>
					<div className="col-lg-6 col-12 mb-3">
						<label className="form-label col-12 col-form-label required">Date to</label>
						<div className="col">
							<input type="datetime-local" className='form-control' onChange={e => setDateTo(e.target.value)} value={dateTo} />
						</div>
					</div>
					<div className="col-lg-4 col-12 mb-3">
						<label className="form-label col-12 col-form-label required">Activities</label>
						<div className="col">
							<select value={activityTypeId} className='form-control' onChange={e => setActivityTypeId(e.target.value)}>
								<option selected>- Choose -</option>
								{
									activities.map((item, idx) => (
										<option value={item.id}>{item.label}</option>
									))
								}
							</select>
						</div>
					</div>
					<div className="col-lg-4 col-12 mb-3">
						<label className="form-label col-12 col-form-label required">Class Type</label>
						<div className="col">
							<select className='form-control' value={classTypeId} onChange={e => setClassTypeId(e.target.value)}>
								<option selected>- Choose -</option>
								{
									classTypes.map((item, idx) => (
										<option key={idx} value={item.id}>{item.label}</option>
									))
								}
							</select>
						</div>
					</div>
					<div className="col-lg-4 col-12 mb-3">
						<label className="form-label col-12 col-form-label required">Gcal Sync</label>
						<div className="col">
							<select className='form-control' onChange={e => setSyncGcal(e.target.value)}>
								<option selected>- Choose -</option>
								<option value={true}>Yes</option>
								<option value={false}>No</option>
							</select>
						</div>
					</div>
					<div className="col-lg-6 col-12 mb-3">
						<label className="form-label col-12 col-form-label">Location</label>
						<div className="col">
							<input type='text' className='form-control' value={location} onChange={e => setLocation(e.target.value)} />
						</div>
					</div>
					<div className="col-lg-6 col-12 mb-3">
						<label className="form-label col-12 col-form-label">Break Duration (Minutes)</label>
						<div className="col">
							<input type='text' className='form-control' value={breakDuration} onChange={e => setBreakDuration(e.target.value)} placeholder="90" />
						</div>
					</div>
					<div className="col-12 mb-3">
						<label className="form-label col-12 col-form-label required">Title Invitation G-Cal</label>
						<div className="col">
							<input type='text' className='form-control' onChange={e => setTitleGcal(e.target.value)} value={titleGcal} />
						</div>
					</div>
					<div className="col-lg-12 col-12 mb-3">
						<label className="form-label col-12 col-form-label">Notes</label>
						<div className="col">
							<textarea row="3" className='form-control' value={description} onChange={e => setDescription(e.target.value)}></textarea>
						</div>
					</div>
				</div>
				<hr />
				<div className="row form-group">
					<h6 className='mb-2 mt-3' style={{ color: 'red' }}>*Tambah email attendees untuk event ini, selain email Anda & Pengajar.</h6>
					{
						users.length > 0 ?
							<CreatableSelect
								value={rows.map(item => {
									return {
										label: item.email,
										value: item.email,
										email: item.email
									}
								})}
								options={users.map(item => {
									return {
										label: item.email,
										value: item.email
									}
								})}
								onChange={e => setRows(e.map(item => {
									return {
										email: item.label
									}
								}))}
								isMulti
							/>
							:
							null
					}
				</div>

				<div className="form-footer">
					<button onClick={handleAdd} type="button" className="btn btn-ghost-primary" disabled={disabled}>{disabled === true ? 'Saving..' : 'Save'}</button>
				</div>
			</div >
		</>
	)
}

export default DuplicateComp
