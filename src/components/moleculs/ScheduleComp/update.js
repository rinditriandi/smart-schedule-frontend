import React, { useState, useEffect } from 'react'
import axios from '../../../lib/axios-ss.js'
import { MySwal } from '../../../lib/swal'
import { numberToDateTime } from '../../../helpers/numberToDateTime'
import { convertMsToMinute } from '../../../helpers/convertMsToMinute.js'
import { convertMinuteToMs } from '../../../helpers/convertMinuteToMs.js'
import loadingImg from '../../../assets/images/loading.gif'
import AsyncSelect from 'react-select/async';
import errorHandler from '../../../helpers/errorHandler.js';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable'

import { numberToTime } from '../../../helpers/numberToTime.js';
import { numberToDate } from '../../../helpers/numberToDate.js';

// Hooks
import { useFetchUsers, useFetchActivities } from '../../../hooks'

const UpdateScheduleComp = (props) => {
	// console.log(props)
	const currentUrl = window.location.pathname.split("/");
	const segment_1 = currentUrl[1];
	const date = new Date();
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	const [schedule, setSchedule] = useState([])
	const { activities, loadingFetchActivities } = useFetchActivities()

	const [sendEmailGcal, setSendEmailGcal] = useState('false')
	const [classTypes, setClassTypes] = useState([])
	const [plotId, setPlotId] = useState({
		label: '',
		value: '',
	})
	const [activityTypeId, setActivityTypeId] = useState('')
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const [classTypeId, setClassTypeId] = useState('')
	const [location, setLocation] = useState('')
	const [description, setDescription] = useState('')
	const [breakDuration, setBreakDuration] = useState('')
	const [rows, setRows] = useState([])
	const [rowsRc, setRowsRc] = useState([])
	const [rc, setRc] = useState([])
	const [listEmailRc, setListEmailRc] = useState([])
	const [loading, setLoading] = useState(false)
	const [titleGcal, setTitleGcal] = useState('')

	const { users, loadingFetchUsers } = useFetchUsers()

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

	const handleChangeDate = (date) => {
		setDateFrom(date)
		setDateTo(date)
	}

	const fetchRc = async () => {
		try {
			const options = {
				url: `/consultants`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `scheduleSystem`,
					modApiName: `schedule-detail`,
					policy: `read`
				}
			}
			const { data } = await axios(options)
			// console.log(data.data)
			setRc(data.data)

		} catch (err) {
			console.log(err?.response?.data || err)
			errorHandler({ err: err?.response?.data || err })
		}
	}

	const fatchScheduleById = async () => {
		try {
			const options = {
				url: `/schedules/${props.scheduleId}`,
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
			setBreakDuration(convertMsToMinute(data.data.breakDuration))
			setSchedule(data.data)
			setDescription(data.data.description)
			setActivityTypeId(data.data.ActivityType.id)
			setClassTypeId(data.data.ClassType.id)
			setLocation(data.data.location)
			setTitleGcal(data.data.gcalSummary)

			data.data.ScheduleAttendees.map((item, idx) => (
				setRows(rows => [...rows, { email: item.email }])
			))

			data.data.Consultants.map((item, idx) => (
				setRowsRc(rowsRc => [
					...rowsRc, {
						name: item?.name,
						ConsultantId: item.ConsultantSchedule.ConsultantId,
						ConsultantTypeId: item.ConsultantSchedule.ConsultantTypeId
					}
				])
			))

			data.data.Consultants.map((item, idx) => (
				setListEmailRc(listEmailRc => [...listEmailRc, { 'email': item.email }])
			))

			setDateFrom(numberToDateTime(data.data.startHours))
			setDateTo(numberToDateTime(data.data.endHours))

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
					modApiName: `schedule-detail`,
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

	const handleUpdate = async () => {

		try {
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

			if (checkAvailibility.data.data.sameSchedules.length > 1) {
				const sameSchedulesSwal = checkAvailibility.data.data.sameSchedules.filter(scheduleFilter => scheduleFilter.ScheduleId != props.scheduleId).map(item => (
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
					return false
				}
			} else if (checkAvailibility.data.data.sameSchedules.length == 1 && checkAvailibility.data.data.sameSchedules[0].ScheduleId != props.scheduleId) {
				console.log(checkAvailibility.data.data.sameSchedules)
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
				sendEmailGcal: sendEmailGcal == 'true' ? true : false,
				gcalSummary: titleGcal,
				ActivityTypeId: activityTypeId,
				startHours: new Date(dateFrom).getTime(),
				endHours: new Date(dateTo).getTime(),
				ClassTypeId: classTypeId,
				location: location,
				description: description,
				attendees: fixGuest,
				breakDuration: convertMinuteToMs(breakDuration),
				consultants: rowsRc
			}

			setLoading(true)
			await axios.put(`/schedules/${props.scheduleId}`, requestBody, config)
			setLoading(false)
			MySwal.fire({
				icon: 'success',
				title: 'Success',
				text: 'Schedule has been updated successfully!',
			})
				.then(() => {
					props.fetch(firstDay.getTime(), lastDay.getTime())
					props.close()
				})
		} catch (err) {
			console.log(err?.response?.data || err)
			errorHandler({ err: err?.response?.data || err })
		}

	}

	useEffect(() => {
		fatchScheduleById()
		// fetchActivities()
		fetchClassTypes()
		fetchRc()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// console.log(schedule)

	return (
		<>
			<div className="mb-3">
				<label className="form-label col-12 col-form-label required">WBS</label>
				<div className="col">
					<AsyncSelect
						cacheOptions
						defaultOptions
						loadOptions={handleSearchWbs}
						onChange={e => setPlotId({
							value: e.value,
							label: e.label
						})}
						value={plotId}
					/>
				</div>
			</div>
			{
				schedule.id === props.scheduleId ?
					<>
						<div className='row mt-3'>
							<label className='form-label required'>Consultants</label>
							{
								rc.length > 0 ?
									<Select
										value={rowsRc.map(item => {
											return {
												label: item.name,
												value: item.ConsultantId,
												type: 9
											}
										})}
										options={rc.map(item => {
											return {
												label: item.name,
												value: item.id,
												type: 9
											}
										})}
										onChange={e => setRowsRc(e.map(item => {
											return {
												name: item.label,
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
						<div className='row'>
							<div className="row form-group">
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
								<div className="col-lg-6 col-12 mb-3">
									<label className="form-label col-12 col-form-label required">Activities</label>
									<div className="col">
										<select className='form-control' onChange={e => setActivityTypeId(e.target.value)} value={activityTypeId}>
											<option selected>- Choose -</option>
											{
												activities.map((item, idx) => (
													<option key={idx} value={item.id}>{item.label}</option>
												))
											}
										</select>
									</div>
								</div>
								<div className="col-lg-6 col-12 mb-3">
									<label className="form-label col-12 col-form-label required">Class Type</label>
									<div className="col">
										<select className='form-control' onChange={e => setClassTypeId(e.target.value)} value={classTypeId}>
											<option selected>- Choose -</option>
											{
												classTypes.map((item, idx) => (
													<option key={idx} value={item.id}>{item.label}</option>
												))
											}
										</select>
									</div>
								</div>
								<div className="col-lg-6 col-12 mb-3">
									<label className="form-label col-12 col-form-label">Break Duration (Minutes)</label>
									<div className="col">
										<input type='text' className='form-control' onChange={e => setBreakDuration(e.target.value)} value={breakDuration} placeholder="90" />
									</div>
								</div>
								<div className="col-lg-6 col-12 mb-3">
									<label className="form-label col-12 col-form-label required">Send Email Notification</label>
									<div className="col">
										<select
											className='form-select'
											onChange={(e) => setSendEmailGcal(e.target.value)}
										>
											<option value="false">No</option>
											<option value="true">Yes</option>
										</select>
									</div>
								</div>
								<div className="col-12 mb-3">
									<label className="form-label col-12 col-form-label">Title Invitation G-Cal</label>
									<div className="col">
										<input value={titleGcal} type='text' className='form-control' onChange={e => setTitleGcal(e.target.value)} />
									</div>
								</div>
								<div className="col-12 mb-3">
									<label className="form-label col-12 col-form-label">Notes</label>
									<div className="col">
										<textarea row="3" value={description} className='form-control' onChange={e => setDescription(e.target.value)}></textarea>
									</div>
								</div>
								<div className="col-12 mb-3">
									<label className="form-label col-12 col-form-label">Location</label>
									<div className="col">
										<input value={location} type='text' className='form-control' onChange={e => setLocation(e.target.value)} />
									</div>
								</div>
							</div>
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
								{
									loading ?
										<div style={{ textAlign: 'center' }}>
											<img
												alt='loading'
												src={loadingImg}
												style={{ width: '50px' }}
											/>
										</div>
										:
										<button onClick={handleUpdate} type="button" className="btn btn-ghost-primary">Submit</button>
								}
							</div>
						</div>
					</>
					:
					''
			}

		</>
	)
}

export default UpdateScheduleComp
