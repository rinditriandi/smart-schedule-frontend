import React, { useState, useEffect } from 'react'
import { numberToDate } from '../../../helpers/numberToDate'
import { numberToTime } from '../../../helpers/numberToTime'
import { convertMsToMinute } from '../../../helpers/convertMsToMinute'
import Badge from 'react-bootstrap/Badge';
import { MySwal } from '../../../lib/swal.js'
import axios from '../../../lib/axios-ss.js'
import { useParams, useHistory } from 'react-router-dom'

import errorHandler from '../../../helpers/errorHandler.js'

const DetailScheduleComp = (props) => {

	const currentUrl = window.location.pathname.split("/");
	const segment_1 = currentUrl[1];

	const params = useParams()
	const history = useHistory()
	const [schedule, setSchedule] = useState('')

	const handleChangePage = path => {
		const currentUrl = path.split("/")
		const segment_1 = currentUrl[1]
		if (segment_1 === "program-charter") {
			window.open(path, '_blank')
		} else {
			history.push(path)
		}
	}

	const fatchScheduleById = async () => {
		try {
			const options = {
				url: `/schedules/${params?.id || props.scheduleId}`,
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
			setSchedule(data.data)

		} catch (err) {
			errorHandler({ err: err?.response?.data || err })
		}
	}

	useEffect(() => {
		fatchScheduleById()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// console.log(schedule)

	return (
		<>
			{
				schedule !== '' ?
					<>
						<div className="row mb-3">
							<div className="col-12">
								<dl className="row">
									<dt className="col-3">Plot Id</dt>
									<dd className="col-9">: {schedule.Plot.id}</dd>

									<dt className="col-3">Odoo Project ID</dt>
									<dd className="col-9">: {schedule.Plot.odooWbsId}</dd>

									<dt className="col-3">WBS</dt>
									<dd className="col-9">: {schedule.Plot.wbs}</dd>

									<dt className="col-3">Opportunity Id</dt>
									<dd className="col-9">: {schedule.Plot.OpportunityId}</dd>

									<dt className="col-3">Client</dt>
									<dd className="col-9">: {schedule.Plot.client}</dd>

									<dt className="col-3">Topic</dt>
									<dd className="col-9">: {schedule.Plot.topic}</dd>

									<dt className="col-3">APM Group</dt>
									<dd className="col-9">: {schedule.Plot.group}</dd>

									<dt className="col-3">Schedule Id</dt>
									<dd className="col-9">: {schedule.id}</dd>

									<dt className="col-3">Activity</dt>
									<dd className="col-9">: {schedule.ActivityType.label}</dd>

									<dt className="col-3">Class Type</dt>
									<dd className="col-9">: {schedule.ClassType.label}</dd>

									<dt className="col-3">Location</dt>
									<dd className="col-9">: {schedule.location}</dd>

									<dt className="col-3">Date & Time</dt>
									<dd className="col-9">: {numberToDate(schedule.date)}&nbsp;|&nbsp;
										{numberToTime(schedule.startHours)} - {numberToTime(schedule.endHours)}</dd>

									<dt className="col-3">Break Duration (Minutes)</dt>
									<dd className="col-9">: {convertMsToMinute(schedule.breakDuration)}</dd>

									<dt className="col-3">Sync Gcal Status</dt>
									<dd className="col-9">: {schedule.gcalEventStatus === "OK" ? <Badge bg="info">{schedule.gcalEventStatus}</Badge> : <Badge bg="danger">PENDING</Badge>} </dd>

									<dt className="col-3">Notes</dt>
									<dd className="col-9">: {schedule.description}</dd>
								</dl>
							</div>
						</div>

						<h3><Badge bg="success" style={{ fontWeight: '600' }}>List of Consultants</Badge></h3>
						<div className="row mb-3">
							<div className="table-responsive">
								<table className="table table-vcenter table-wrap">
									<thead>
										<tr>
											<th>#</th>
											<th>Alias</th>
											<th>Fullname</th>
											<th>Email</th>
										</tr>
									</thead>
									<tbody>
										{
											schedule.Consultants.map((item, idx) => (
												<tr key={idx}>
													<td>{idx + 1}</td>
													<td>{item.alias}</td>
													<td>{item.name}</td>
													<td>{item.email}</td>
												</tr>
											))
										}
									</tbody>
								</table>
							</div>
						</div>

						<h3><Badge bg="danger" style={{ fontWeight: '600' }}>List of G-Cal Guest</Badge></h3>
						<div className="row mb-3">
							<div className="table-responsive">
								<table className="table table-vcenter table-wrap">
									<thead>
										<tr>
											<th>#</th>
											<th>Fullname</th>
											<th>Email</th>
										</tr>
									</thead>
									<tbody>
										{
											schedule.ScheduleAttendees.map((item, idx) => (
												<tr key={idx}>
													<td>{idx + 1}</td>
													<td>{item.name}</td>
													<td>{item.email}</td>
												</tr>
											))
										}
									</tbody>
								</table>
							</div>
						</div>

						<h3><Badge bg="primary" style={{ fontWeight: '600' }}>List of Requirements</Badge></h3>
						<div className="row mb-3">
							<div className="accordion" id="accordion-example">
								{
									schedule.Requirements.map((rq, idx) => (
										<div className="accordion-item" key={idx}>
											<h2 className="accordion-header" id="heading-1">
												<button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${idx}`} aria-expanded="true">
													{rq.label}
												</button>
											</h2>
											<div id={`collapse-${idx}`} className="accordion-collapse collapse" data-bs-parent="#accordion-example">
												<div className="accordion-body pt-0">
													<div className="row">
														<div className="table-responsive">
															<table className="table table-vcenter table-wrap">
																<thead>
																	<tr>
																		<th>#</th>
																		<th>Item</th>
																		<th>Is Request</th>
																		<th>Is Ready</th>
																	</tr>
																</thead>
																<tbody>
																	{
																		rq.items.map((d, i) => (
																			<tr key={idx}>
																				<td>{i + 1}</td>
																				<td>{d.label}</td>
																				<td>
																					{
																						d.isNeed === true ?
																							<Badge bg="success">Yes</Badge>
																							:
																							<Badge bg="warning">No</Badge>
																					}
																				</td>
																				<td>{
																					d.ready === true ?
																						<Badge bg="success">Yes</Badge>
																						:
																						<Badge bg="warning">No</Badge>
																				}</td>
																			</tr>
																		))
																	}
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
										</div>
									))
								}
							</div>

						</div>

						<h3><Badge bg="secondary" style={{ fontWeight: '600' }}>Schedule Histories</Badge></h3>
						<div className="row mb-3">
							<div className="table-responsive">
								<table className="table table-vcenter table-wrap">
									<thead>
										<tr>
											<th>#</th>
											<th>Type</th>
											<th>Created By</th>
											<th>Created At</th>
											<th>Modify At</th>
										</tr>
									</thead>
									<tbody>
										{
											schedule.ScheduleHistories.map((item, idx) => (
												<tr key={idx}>
													<td>{idx + 1}</td>
													<td>{item.type}</td>
													<td>{item.createdBy}</td>
													<td>{numberToDate(item.createdAt)}</td>
													<td>{numberToDate(item.updatedAt)}</td>
												</tr>
											))
										}
									</tbody>
								</table>
							</div>
						</div>
					</>
					:
					''
			}

			<div>
				<button
					className='btn btn-primary mx-2'
					type="button"
					onClick={() => handleChangePage(`/program-charter/${props.scheduleId}`)}
				>
					Program Charter
				</button>
				<button
					className='btn btn-primary mx-2'
					type="button"
					onClick={() => {
						props.setSelectedScheduleDetail('')
						props.setSelectedScheduleUpdate(props.scheduleId)
					}}
				>
					Edit Schedule
				</button>
			</div>

		</>
	)
}

export default DetailScheduleComp
