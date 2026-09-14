import React, { useState, useEffect } from 'react'
import { MySwal } from '../../lib/swal.js'
import axios from '../../lib/axios-ss.js'
import queryParams from '../../helpers/queryParams.js';
import { convertMsToHour } from '../../helpers/convertMsToHour.js';

// React date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Hooks
import { useFetchConsultants, useFetchLearningHoursForApm, useRefreshPlot, useExportExcelLearningHoursForApm, useExportExcelOdooTimeline} from '../../hooks/index.js'

// Components
import { Loading, UpdateScheduleComp } from '../../components/index.js'

// Router
import { useHistory, useLocation } from "react-router-dom"

import { Modal } from 'react-bootstrap'

const LearningHoursForApmCopy = () => {
	const history = useHistory()
	const location = useLocation()
	const page = queryParams({ path: location.search, key: 'page' })

	const { consultants, loadingFetchConsultants } = useFetchConsultants()

	const { executeFetchReports, loadingFetchReports, reports, totalItemsReport, totalPagesReport, currentPageReport, dateFrom, setDateFrom, dateTo, setDateTo, group, setGroup, profitCenter, setProfitCenter, consultant, setConsultant, totalDurationMilliseconds, isSyncSap, setIsSyncSap, isGcalSync, setIsGcalSync } = useFetchLearningHoursForApm()
	console.log(reports)

	const { setExecuteExportExcel, loadingExportExcel } = useExportExcelLearningHoursForApm({ startHours: dateFrom, endHours: dateTo, group, profitCenter, consultantId: consultant, isSyncSap })

	const { setExecuteExportExcelOdooTimeline, loadingExportExcelOdooTimeline } = useExportExcelOdooTimeline({ startHours: dateFrom, endHours: dateTo, group, profitCenter, consultantId: consultant, isSyncSap })

	const { executeRefreshPlot, loadingRefreshPlot } = useRefreshPlot({ fetchPlots: executeFetchReports })

	const [updatedSchedule, setUpdatedSchedule] = useState(null)

	const handleRenderProfitCenter = profitCenter => {
		if (profitCenter === '0000032201') {
			return 'Corporate Program'
		} else if (profitCenter === '0000032204') {
			return 'Assessment Program'
		} else if (profitCenter === '0000032203') {
			return 'Consultation Program'
		} else if (profitCenter === '0000032101') {
			return 'Short Program'
		} else if (profitCenter === '0000032102') {
			return 'Certification Program'
		} else if (profitCenter === '0000032105') {
			return 'In Company Training'
		} else if (profitCenter === '0000032104') {
			return 'In Company Assessment'
		} else {
			return '-'
		}
	}

	useEffect(() => {
		if (!page) {
			history.push(`${location.pathname}?page=1`)
		}
	}, [])

	return (
		<>
			{(loadingFetchConsultants || loadingFetchReports || loadingExportExcel || loadingRefreshPlot) && <Loading />}
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
									Learning Hours (without Assessment)
								</h2>
							</div>
							{/* Page title actions */}
							<div className="col-auto ms-auto d-print-none">
								<div className="btn-list">
									{/* button action list */}
								</div>
							</div>
						</div>
					</div>
					<>
						<div className="row row-deck row-cards mb-3">
							<div className="card card-md">
								<div className="card-body">
									<div className='row mb-3'>
										<h1 style={{ fontWeight: '600' }}>Filter Schedule :</h1>
									</div>
									<div className='row mb-3'>
										<div className='col-lg-2 col-12'>
											<label className='form-label'>Consultant</label>
											<select
												className='form-select'
												value={consultant}
												onChange={e => setConsultant(e.target.value)}
											>
												<option value="">All</option>
												{
													consultants.map(consultantItem => (
														<option key={consultantItem.id} value={`${consultantItem.id}`}>{consultantItem.name}</option>
													))
												}
											</select>
										</div>
										<div className='col-lg-2 col-12'>
											<label className='form-label'>Start Date</label>
											<DatePicker
												className='form-control'
												selected={dateFrom}
												onChange={(date) => setDateFrom(date)}
											/>
										</div>
										<div className='col-lg-2 col-12'>
											<label className='form-label'>End Date</label>
											<DatePicker
												className='form-control'
												selected={dateTo}
												onChange={(date) => setDateTo(date)}
											/>
										</div>
										<div className='col-lg-2 col-12'>
											<label className='form-label'>APM</label>
											<select
												className='form-select'
												value={group}
												onChange={e => setGroup(e.target.value)}
											>
												<option value="">All</option>
												<option value="APM P">APM P</option>
												<option value="APM C1">APM C1</option>
												<option value="APM C2">APM C2</option>
											</select>
										</div>
										<div className='col-lg-2 col-12'>
											<label className='form-label'>Gcal Status</label>
											<select
												className='form-select'
												value={isGcalSync}
												onChange={e => setIsGcalSync(e.target.value)}
											>
												<option value="">All</option>
												<option value="true">Sync</option>
												<option value="false">Not Sync</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row row-deck row-cards">
							<div className="card card-md" style={{ overflowX: 'scroll' }}>
								<div className="card-body">
									<div className='row'>
										<div className='text-end mb-3'>
											<button
												type='button'
												className='btn btn-sm btn-primary me-2'
												onClick={() => setExecuteExportExcel(true)}
											>
												Export to Excel
											</button>
											<button
												type='button'
												className='btn btn-sm btn-primary'
												onClick={() => setExecuteExportExcelOdooTimeline(true)}
											>
												Export Odoo Timeline
											</button>
										</div>
										<table style={{ fontSize: '10px' }} className="table table-bordered table-hover">
											<thead>
												<tr>
													<th>Actions</th>
													<th>Odoo Project Id</th>
													<th>Company</th>
													<th>Program</th>
													<th>Gcal ID</th>
													<th>Teaching Date</th>
													<th>Consultant (Type)</th>
													<th>Time</th>
													<th>Break Duration in Minutes</th>
													<th>APM Group</th>
													<th>Plan Hours</th>
													<th>Minutes</th>
													<th>Session</th>
												</tr>
											</thead>
											<tbody>
												{
													reports.map(reportItem => (
														<tr key={reportItem.id}>
															<td>
																<button
																	type="button"
																	className='btn btn-sm btn-secondary mx-1'
																	onClick={() => executeRefreshPlot(reportItem?.Plot?.id)}
																	disabled={loadingRefreshPlot}
																>
																	Refresh
																</button>
															</td>
															<td>{reportItem?.Plot?.odooWbsId || '-'}</td>
															<td>{reportItem?.Plot?.client || '-'}</td>
															<td>{reportItem?.Plot?.topic || '-'}</td>
															<td>{reportItem?.gcalEventId || '-'}</td>
															<td>{new Intl.DateTimeFormat('id', { dateStyle: 'full', timeZone: 'Asia/Jakarta' }).format(reportItem.startHours)}</td>
															<td>
																{reportItem.ConsultantSchedules.map((consultantItem, index) => (
																	<li key={index}>{`${consultantItem.Consultant.alias} (${consultantItem.Consultant.type})`}</li>
																))}
															</td>
															<td>{`${new Intl.DateTimeFormat('id', { timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(reportItem.startHours)} - ${new Intl.DateTimeFormat('id', { timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(reportItem.endHours)}`}</td>
															<td>{reportItem?.breakDuration ? reportItem.breakDuration / 1000 / 60 : '0'}</td>
															<td>{reportItem?.Plot?.group || '-'}</td>
															<td>{reportItem?.Plot?.planHours ? `${convertMsToHour(reportItem.Plot.planHours)} Hour` : '-'}</td>
															<td>{new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(reportItem.totalMinutes)}</td>
															<td>{new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(reportItem.totalHours)}</td>
														</tr>
													))
												}
											</tbody>
										</table>
									</div>

									<div>
										<button
											className='btn btn-sm btn-secondary mx-2'
											type="button"
											disabled={Number(page) == 1}
											onClick={() => {
												if (Number(page) > 0) {
													history.push(`${location.pathname}?page=${(Number(page) - 1)}`)
												}
											}}
										>
											Previous
										</button>
										<span>{`${page} of ${totalPagesReport}`}</span>
										<button
											className='btn btn-sm btn-secondary mx-2'
											type="button"
											onClick={() => {
												if (Number(page) != totalPagesReport) {
													history.push(`${location.pathname}?page=${(Number(page) + 1)}`)
												}
											}}
											disabled={Number(page == totalPagesReport)}
										>
											Next
										</button>
									</div>
									<div className='mt-2 mx-2'>Total Data: {totalItemsReport}</div>
									<div className='text-end'>Total in Minutes : {`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalDurationMilliseconds / 1000 / 60)} minutes`}</div>
									<div className='text-end'>Total in Hours : {`${new Intl.NumberFormat('id', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalDurationMilliseconds / 1000 / 3600)} hours`}</div>
								</div>
							</div>
						</div>
					</>
				</div>
			</div>

			<Modal
				size="lg"
				show={updatedSchedule}
				onHide={() => setUpdatedSchedule(null)}
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
						close={() => setUpdatedSchedule(null)}
						fetch={(a, b) => executeFetchReports(true)}
						scheduleId={updatedSchedule}
					/>

				</Modal.Body>
			</Modal>
		</>
	)
}

export default LearningHoursForApmCopy
