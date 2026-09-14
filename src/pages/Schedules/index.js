import React, { useState, useEffect } from 'react'
import { MySwal } from '../../lib/swal.js'
import axios from '../../lib/axios-ss.js'
import { dateToTime } from '../../helpers/dateToTime.js'
import {
	DataTableSchedule,
	AddScheduleComp,
	DuplicateComp,
	UpdateScheduleComp,
	CalendarViewComp,
	PlottingViewComp
} from '../../components';
import { Modal, Table } from 'react-bootstrap'
import { formatDate } from '../../helpers/formatDate.js';
import loadingImg from '../../assets/images/loading.gif'

// Error Handler
import errorHandler from '../../helpers/errorHandler.js';

const defaultDateFilter = dateInput => {
	let fulldate = new Date(dateInput)
	fulldate.setHours(0, 1, 0, 0)

	let date = fulldate.getDate()
	let month = fulldate.getMonth() + 1
	let fullyear = fulldate.getFullYear()

	if (month < 10) {
		month = `0${month}`
	} else {
		month = `${month}`
	}

	if (date < 10) {
		date = `0${date}`
	} else {
		date = `${date}`
	}

	return `${fullyear}-${month}-${date}`
}

const Schedules = () => {

	const date = new Date();
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	const currentUrl = window.location.pathname.split("/");
	const segment_1 = currentUrl[1];

	const [consultant, setConsultant] = useState('')
	const [dateFrom, setDateFrom] = useState(defaultDateFilter(firstDay))
	const [dateTo, setDateTo] = useState(defaultDateFilter(lastDay))
	const [apmGroup, setApmGroup] = useState('')
	const [classType, setClassType] = useState('')
	const [activity, setActivity] = useState('')
	const [schedules, setSchedules] = useState([])
	const [loading, setLoading] = useState(false)
	const [schedulesForPlotting, setSchedulesForPlotting] = useState([])
	const [scheduleId, setScheduleId] = useState('')
	const [rc, setRc] = useState([])
	const [activities, setActivities] = useState([])
	const [classTypes, setClassTypes] = useState([])

	const [lgShowAdd, setLgShowAdd] = useState(false)
	const [lgShowDuplicate, setLgShowDuplicate] = useState(null)
	const [lgShowUpdate, setLgShowUpdate] = useState(false)
	const [calendarView, setCalendarView] = useState(true)
	const [plottingView, setPlottingView] = useState(false)

	const bindStartDate = dateFrom !== "" ? dateFrom : firstDay.toLocaleDateString('id-IN');
	const bindLastDate = dateTo !== "" ? dateTo : lastDay.toLocaleDateString('id-IN');

	const handleDefaultView = () => {
		setCalendarView(false)
		setPlottingView(false)
		fetchData()
	}

	const handleCalendarView = () => {
		setCalendarView(true)
		setPlottingView(false)
	}

	const handlePlottingView = () => {
		setCalendarView(false)
		setPlottingView(true)
		fetchDataForPlotting()
	}

	const fetchDataForPlotting = async () => {
		// console.log(consultant, dateToTime(dateFrom), dateToTime(dateTo), classType, activities)
		let startDate = new Date(dateFrom)
		startDate.setHours(0, 0, 0, 0)
		let endDate = new Date(dateTo)
		endDate.setHours(23, 0, 0, 0)

		try {
			const options = {
				url: `/schedules?calendarView=false&ConsultantId=${consultant}&dateFrom=${dateToTime(startDate)}&dateTo=${dateToTime(endDate)}&ClassTypeId=${classType}&ActivityTypeId=${activity}&group=${apmGroup}`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `scheduleSystem`,
					modApiName: `${segment_1}`,
					policy: `read`
				}
			}
			const { data } = await axios(options)
			// console.log(data.data.length)
			setSchedulesForPlotting(data.data)

		} catch (err) {
			errorHandler({ err: err?.response?.data || err })
		}
	}

	const fetchData = async () => {
		// console.log(consultant, dateToTime(dateFrom), dateToTime(dateTo), classType, activities)
		// const startDate = dateFrom.length > 0 ? dateFrom : firstDay
		// const endDate = dateTo.length > 0 ? dateTo : lastDay

		let startDate = new Date(dateFrom)
		startDate.setHours(0, 0, 0, 0)
		let endDate = new Date(dateTo)
		endDate.setHours(23, 0, 0, 0)

		try {
			setLoading(true)
			const options = {
				url: `/schedules?calendarView=true&ConsultantId=${consultant}&dateFrom=${dateToTime(startDate)}&dateTo=${dateToTime(endDate)}&ClassTypeId=${classType}&ActivityTypeId=${activity}&group=${apmGroup}`,
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
			setSchedules(data.data)
			setLoading(false)

		} catch (err) {
			setLoading(false)
			errorHandler({ err: err?.response?.data || err })
		}
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
			errorHandler({ err: err?.response?.data || err })
		}
	}

	const handleSearch = () => {
		if (dateFrom.length === 0 || dateTo.length === 0) {
			MySwal.fire({
				icon: 'error',
				title: 'Ooops, Error!',
				text: 'Please enter Date from & Date to.',
			})
		} else {
			fetchData()
		}
	}

	const clearForm = () => {
		window.location.reload()
	}

	const handleSyncGcal = (scheduleId) => {
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				appApiName: `settingManagement`,
				modApiName: `application`,
				policy: `read`
			}
		}
		const requestBody = {
			sendEmailGcal: true,
		}

		if (
			scheduleId !== ""
		) {
			axios.post(`/schedules/syncWithGcal/${scheduleId}`, requestBody, config)
				.then(res => {
					// console.log(res)
					if (res.status === 200) {
						MySwal.fire({
							icon: 'success',
							title: 'Success',
							text: 'Schedule has been SYNC to Google Calendar!',
						})
							.then(() => {
								fetchData(firstDay.getTime(), lastDay.getTime())
							})
					}
				})
				.catch(err => {
					errorHandler({ err: err?.response?.data || err })
				})
		} else {
			MySwal.fire({
				icon: 'error',
				title: 'Ooops, Error!',
				text: 'Failed SYNC to Google Calendar.',
			})
		}

	}

	const handleUnsyncGcal = (scheduleId) => {
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				appApiName: `settingManagement`,
				modApiName: `application`,
				policy: `read`
			}
		}
		const requestBody = {
			sendEmailGcal: false,
		}

		if (
			scheduleId !== ""
		) {
			axios.post(`/schedules/unsyncWithGcal/${scheduleId}`, requestBody, config)
				.then(res => {
					// console.log(res)
					if (res.status === 200) {
						MySwal.fire({
							icon: 'success',
							title: 'Success',
							text: 'Schedule has been UNSYNC to Google Calendar!',
						})
							.then(() => {
								fetchData(firstDay.getTime(), lastDay.getTime())
							})
					}
				})
				.catch(err => {
					errorHandler({ err: err?.response?.data || err })
				})
		} else {
			MySwal.fire({
				icon: 'error',
				title: 'Ooops, Error!',
				text: 'Failed UNSYNC to Google Calendar.',
			})
		}

	}

	const handleDelete = (scheduleId) => {
		MySwal.fire({
			title: 'Anda Yakin ?',
			text: "Ingin menghapus schedule ini!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Ya, Lakukan!'
		}).then((result) => {
			if (result.isConfirmed) {
				const config = {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						appApiName: `settingManagement`,
						modApiName: `application`,
						policy: `read`
					}
				}
				if (
					scheduleId !== ""
				) {
					axios.delete(`/schedules/${scheduleId}`, config)
						.then(res => {
							// console.log(res)
							if (res.status === 200) {
								MySwal.fire({
									icon: 'success',
									title: 'Success',
									text: 'Schedule has been delete successfully!',
								})
									.then(() => {
										fetchData(firstDay.getTime(), lastDay.getTime())
									})
							}
						})
						.catch(err => {
							errorHandler({ err: err?.response?.data || err })
						})
				} else {
					MySwal.fire({
						icon: 'error',
						title: 'Ooops, Error!',
						text: 'Failed delete schedule.',
					})
				}
			}
		})
	}

	const handleModalUpdate = (scheduleId) => {
		setScheduleId(scheduleId)
		setLgShowUpdate(true)
	}

	useEffect(() => {
		fetchData()
		fetchDataForPlotting()
		fetchRc()
		fetchClassTypes()
		fetchActivities()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// console.log(lastDay)

	return (
		<>
			<div className="content">
				<div className="container-xl">
					{/* Page title */}
					<div className="page-header d-print-none">
						<div className="row align-items-center">
							<div className="col">
								{/* Page pre-title */}
								<div className="page-pretitle">
									Overview
								</div>
								<h2 className="page-title">
									Schedules
								</h2>
							</div>
							{/* Page title actions */}
							<div className="col-auto ms-auto d-print-none">
								<div className="btn-list">
									{/* button action list */}
									{
										calendarView === false && plottingView === false ?
											<button style={{ fontWeight: '550' }} onClick={() => setLgShowAdd(true)} className="btn btn-success">
												Create schedule
											</button>
											:
											''
									}
									<button onClick={() => handlePlottingView()} style={{ fontWeight: '550', backgroundColor: '#4D77FF', color: 'white' }} className="btn btn-light">
										Plotting View
									</button>
									<button style={{ fontWeight: '550', backgroundColor: '#F2F7A1' }} onClick={() => handleDefaultView()} className="btn btn-light">
										List schedules
									</button>
									<button style={{ fontWeight: '550', backgroundColor: '#2B3467', color: 'white' }} onClick={() => handleCalendarView()} className="btn btn-light">
										Calendar view
									</button>
								</div>
							</div>
						</div>
					</div>
					{
						calendarView === true ?
							<CalendarViewComp
								schedules={schedules}
							/>
							: plottingView === true ?
								<PlottingViewComp
									schedules={schedulesForPlotting}
								/>
								:
								<>
									<div className="row row-deck row-cards mb-3">
										<div className="card card-md">
											<div className="card-body">
												<div className='row mb-3'>
													<h1 style={{ fontWeight: '600' }}>Filter Schedules :</h1>
												</div>
												<div className='row mb-3'>
													<div className='col-lg-3 col-12'>
														<div className="form-floating">
															<select className="form-select" id="floatingSelect" autoComplete="off" onChange={e => setConsultant(e.target.value)}>
																<option value="" selected>- Choose -</option>
																{
																	rc.map((item, idx) => (
																		<option key={idx} value={item.id}>({item.alias}) {item.name}</option>
																	))
																}
															</select>
															<label htmlFor="floatingSelect">Consultants</label>
														</div>
													</div>
													<div className='col-lg-3 col-12'>
														<div className="form-floating">
															<input
																type="date"
																className="form-control"
																id="floating-input"
																autoComplete="off"
																onChange={e => {
																	setDateFrom(e.target.value)
																}}
																value={dateFrom}
															/>
															<label htmlFor="floating-input">Date from <span style={{ color: 'red', fontSize: '19px' }}>*</span></label>
														</div>
													</div>
													<div className='col-lg-3 col-12'>
														<div className="form-floating">
															<input type="date" className="form-control" id="floating-input" autoComplete="off" onChange={e => setDateTo(e.target.value)} value={dateTo} />
															<label htmlFor="floating-input">Date to <span style={{ color: 'red', fontSize: '19px' }}>*</span></label>
														</div>
													</div>
												</div>
												<div className='row'>
													<div className='col-lg-2 col-12'>
														<div className="form-floating">
															<select className="form-select" id="floatingSelect" autoComplete="off" onChange={e => setClassType(e.target.value)} >
																<option value="" selected>- Choose -</option>
																{
																	classTypes.map((item, idx) => (
																		<option key={idx} value={item.id}>{item.label}</option>
																	))
																}
															</select>
															<label htmlFor="floatingSelect">Class Type</label>
														</div>
													</div>
													<div className='col-lg-2 col-12'>
														<div className="form-floating">
															<select className="form-select" id="floatingSelect" autoComplete="off" onChange={e => setActivity(e.target.value)}>
																<option value="" selected>- Choose -</option>
																{
																	activities.map((item, idx) => (
																		<option key={idx} value={item.id}>{item.label}</option>
																	))
																}
															</select>
															<label htmlFor="floatingSelect">Activities</label>
														</div>
													</div>
													<div className='col-lg-2 col-12'>
														<div className="form-floating">
															<select className="form-select" id="floatingSelect" autoComplete="off" onChange={e => setApmGroup(e.target.value)} value={apmGroup}>
																<option value="" selected>- Choose -</option>
																<option value="APM P">BPE P</option>
																<option value="APM C1">BPE C1</option>
																<option value="APM C2">BPE C2</option>
																<option value="BPE C3">BPE C3</option>
															</select>
															<label htmlFor="floatingSelect">BPE</label>
														</div>
													</div>
													<div className='col-lg-4 col-12'>
														<button onClick={handleSearch} className="btn btn-lg btn-ghost-success mr-3">
															Search
														</button>
														<button onClick={fetchData} className="btn btn-lg btn-ghost-primary">
															Refresh
														</button>
														<button onClick={clearForm} className="btn btn-lg btn-ghost-warning">
															Reset
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>

									{
										loading ?
											<div style={{ textAlign: 'center' }}>
												<img
													alt='loading'
													src={loadingImg}
													style={{ width: '150px' }}
												/>
											</div>
											:
											null
									}

									<div className="row row-deck row-cards mb-3">
										<div className="card card-md">
											<div className="card-body">
												<div className='row'>
													{
														dateFrom.length > 0 && dateTo.length > 0 ?
															<h2 className='mb-3 text-center' style={{ fontWeight: 'bold', color: '#E74C3C' }}>* List Schedule from {formatDate(dateFrom)} to {formatDate(dateTo)} *</h2>
															:
															<h2 className='mb-3 text-center' style={{ fontWeight: 'bold', color: '#E74C3C' }}>* List Schedule from {bindStartDate} to {bindLastDate} *</h2>
													}
													<DataTableSchedule
														schedules={schedules}
														handleSyncGcal={handleSyncGcal}
														handleUnsyncGcal={handleUnsyncGcal}
														handleDelete={handleDelete}
														handleModalUpdate={handleModalUpdate}
														setLgShowDuplicate={setLgShowDuplicate}
													/>
												</div>
											</div>
										</div>
									</div>

									<div className='row mb-3'>
										<div className='col-2'>
											<Table striped bordered hover>
												<thead>
													<tr>
														<th style={{ backgroundColor: '#17202A', color: 'white' }} colSpan={2} className='text-center'>Color Information</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td className='text-center' style={{ backgroundColor: '#BDC3C7' }}>Jadwal Bentrok</td>
													</tr>
												</tbody>
											</Table>
										</div>
									</div>
								</>
					}
				</div>
			</div>

			<Modal
				size="lg"
				show={lgShowAdd}
				onHide={() => setLgShowAdd(false)}
				backdrop="static"
				keyboard={false}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-sm">Create Schedule</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* konten detail */}
					<AddScheduleComp
						close={() => setLgShowAdd(false)}
						fetch={fetchData}
					/>

				</Modal.Body>
			</Modal>

			<Modal
				size="lg"
				show={lgShowDuplicate}
				onHide={() => setLgShowDuplicate(false)}
				backdrop="static"
				keyboard={false}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-sm">Duplicate Schedule</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* konten detail */}
					<DuplicateComp
						close={() => setLgShowDuplicate(false)}
						fetch={fetchData}
						lgShowDuplicate={lgShowDuplicate}
					/>

				</Modal.Body>
			</Modal>

			<Modal
				size="lg"
				show={lgShowUpdate}
				onHide={() => setLgShowUpdate(false)}
				backdrop="static"
				keyboard={false}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-sm">Update Schedule</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* konten detail */}
					<UpdateScheduleComp
						close={() => setLgShowUpdate(false)}
						fetch={fetchData}
						scheduleId={scheduleId}
					/>

				</Modal.Body>
			</Modal>
		</>
	)
}

export default Schedules
