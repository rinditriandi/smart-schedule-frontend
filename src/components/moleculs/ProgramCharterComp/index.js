import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { numberToDate } from '../../../helpers/numberToDate'
import { numberToTime } from '../../../helpers/numberToTime'
import { convertMsToHour } from '../../../helpers/convertMsToHour'
import { MySwal } from '../../../lib/swal.js'
import axios from '../../../lib/axios-ss.js'
import {
	UpdateRequirementComp
} from '../../../components';
import { Modal, Badge } from 'react-bootstrap'
import { IconMessage2 } from '@tabler/icons';

// Error Handler
import errorHandler from '../../../helpers/errorHandler'

// Hooks
import { useFetchContactRoles } from '../../../hooks'


const ProgramCharterComp = (props) => {
	// console.log(props)
	const params = useParams()

	const [lgShowUpdate, setLgShowUpdate] = useState(false)
	const [schedule, setSchedule] = useState('')
	const [paramReq, setParamReq] = useState('')
	const [requirements, setRequirements] = useState([])

	const { contactRoles, loadingFetchContactRoles } = useFetchContactRoles({ opportunityId: schedule?.Plot?.OpportunityId || null })

	const fetchScheduleById = async () => {
		try {
			const options = {
				url: `/schedules/${params.scheduleId}`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `settingManagement`,
					modApiName: `application`,
					policy: `read`
				}
			}
			const { data } = await axios(options)
			console.log(data.data)
			setSchedule(data.data)

		} catch (err) {
			errorHandler({ err: err?.response?.data || err })
		}
	}

	useEffect(() => {
		fetchScheduleById()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleCheckboxItem = (requirementId, scheduleId, bool) => {
		// console.log(requirementId, scheduleId, bool)

		if (bool === true) {
			handleDeleteCheckBox(scheduleId, requirementId)
		} else {
			const check = requirements.some(r => requirementId === r.requirementId)
			if (check === true) {
				setRequirements(requirements.filter(r => r.requirementId !== requirementId))

				handleDeleteCheckBox(scheduleId, requirementId)

			} else {
				const obj = {
					requirementId: requirementId
				}
				setRequirements([...requirements, obj])

				const config = {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						appApiName: `settingManagement`,
						modApiName: `application`,
						policy: `read`
					}
				}
				const requestBody = {
					ScheduleId: scheduleId,
					RequirementId: requirementId
				}

				axios.post(`/requirements`, requestBody, config)
					.then(res => {
						// console.log(res)
						if (res.status === 201) {
							fetchScheduleById()
						}
					})
					.catch(err => {
						errorHandler({ err: err?.response?.data || err })
					})
			}
		}

	}

	const handleDeleteCheckBox = async (scheduleId, requirementId) => {
		try {
			await axios({
				url: `/requirements`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `settingManagement`,
					modApiName: `application`,
					policy: `read`
				},
				data: {
					ScheduleId: scheduleId,
					RequirementId: requirementId
				},
				method: 'DELETE'
			})
			fetchScheduleById()
		} catch (err) {
			errorHandler({ err: err?.response?.data || err })
		}
	}

	const handleCheckboxItemReady = (requirementId, scheduleId, bool, note) => {
		// console.log(requirementId, scheduleId, bool)

		if (bool === true) {
			const config = {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `settingManagement`,
					modApiName: `application`,
					policy: `read`
				}
			}

			const requestBody = {
				ScheduleId: scheduleId,
				RequirementId: requirementId,
				isReady: false,
				note: note
			}

			axios.put(`/requirements`, requestBody, config)
				.then(res => {
					// console.log(res)
					if (res.status === 200) {
						MySwal.fire({
							icon: 'success',
							title: 'Success',
							text: 'Successfully update status items!',
						})
							.then(() => {
								fetchScheduleById()
							})
					}
				})
				.catch(err => {
					errorHandler({ err: err?.response?.data || err })
				})
		} else {
			const config = {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `settingManagement`,
					modApiName: `application`,
					policy: `read`
				}
			}

			const requestBody = {
				ScheduleId: scheduleId,
				RequirementId: requirementId,
				isReady: true,
				note: note
			}

			axios.put(`/requirements`, requestBody, config)
				.then(res => {
					// console.log(res)
					if (res.status === 200) {
						MySwal.fire({
							icon: 'success',
							title: 'Success',
							text: 'Successfully update status items!',
						})
							.then(() => {
								fetchScheduleById()
							})
					}
				})
				.catch(err => {
					errorHandler({ err: err?.response?.data || err })
				})
		}

	}

	const handleNote = (req) => {
		setLgShowUpdate(true)
		setParamReq(req)
	}

	const showNote = (label, note) => {
		MySwal.fire({
			title: label,
			text: note,
		})
	}

	// console.log(schedule.Requirements)

	return (
		<>
			{
				schedule !== '' ?
					<div className='row'>
						<div className='col-lg-7 col-12' style={{ marginRight: '3%' }}>
							<div className="row row-deck row-cards">
								<div className="card card-md">
									<div className="card-body">
										<div className='row'>
											<div className="col-6">
												<p>Plot Id : <b>{schedule.Plot.id}</b></p>
												<p>WBS : <b>{schedule.Plot.wbs}</b></p>
												<p>Opportunity Id : <b>{schedule.Plot.OpportunityId}</b></p>
												<p>Client : <b>{schedule.Plot.client}</b></p>
												<p>Topic : <b>{schedule.Plot.topic}</b></p>
												<p>APM Group : <b>{schedule.Plot.group}</b></p>
												<p>Schedule Id : <b>{schedule.id}</b></p>
											</div>
											<div className="col-6">
												<p>Activity : <b>{schedule.ActivityType.label}</b></p>
												<p>Class Type : <b>{schedule.ClassType.label}</b></p>
												<p>Location : <b>{schedule.location}</b></p>
												<p>Date & Time : <b>{numberToDate(schedule.date)}&nbsp;|&nbsp;
													{numberToTime(schedule.startHours)} - {numberToTime(schedule.endHours)}</b></p>
												<p>Break Duration (Hour) : <b>{convertMsToHour(schedule.breakDuration)}</b></p>
												<p>Sync Gcal Status : <b>{schedule.gcalEventStatus === "OK" ? <Badge bg="info">{schedule.gcalEventStatus}</Badge> : <Badge bg="danger">PENDING</Badge>}</b></p>
												<p>Notes : <b>{schedule.description}</b></p>
											</div>
										</div>

										<hr />

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

										<h3><Badge bg="success" style={{ fontWeight: '600' }}>List of G-Cal Guests</Badge></h3>
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

										<h3><Badge bg="success" style={{ fontWeight: '600' }}>Contact Roles</Badge></h3>
										<div className="row mb-3">
											<div className="table-responsive">
												<table className="table table-vcenter table-wrap">
													<thead>
														<tr>
															<th>#</th>
															<th>Fullname</th>
															<th>Email</th>
															<th>Role</th>
														</tr>
													</thead>
													<tbody>
														{
															contactRoles.map((item, idx) => (
																<tr key={idx}>
																	<td>{idx + 1}</td>
																	<td>{item?.Contact?.Full_Name__c || '-'}</td>
																	<td>{item?.Contact?.Email || '-'}</td>
																	<td>{item.Role}</td>
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
						</div>
						<div className='col-lg-4 col-12'>
							<div className="row row-deck row-cards">
								<div className="card card-md">
									<div className="card-body">
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
															<div id={`collapse-${idx}`} className="accordion-collapse collapse show" data-bs-parent="#accordion-example">
																<div className="accordion-body pt-0">
																	<div className="table-responsive">
																		<table className="table table-vcenter table-wrap">
																			<thead>
																				<tr>
																					<th>#</th>
																					<th>Item</th>
																					<th>Is Request</th>
																					<th>Is Ready</th>
																					<th>Note</th>
																				</tr>
																			</thead>
																			<tbody>
																				{
																					rq.items.map((d, i) => (
																						<tr key={idx}>
																							<td>{i + 1}</td>
																							{
																								d.note ?
																									<td>{d.label} &nbsp; <IconMessage2 style={{ color: 'red', fontWeight: '600' }} onMouseOver={() => showNote(d.label, d.note)} /></td>
																									:
																									<td>{d.label}</td>
																							}

																							<td>
																								{
																									d.isNeed === true ?
																										<input type="checkbox" onClick={() => handleCheckboxItem(d.id, schedule.id, true)} defaultChecked="true" />
																										:
																										<input type="checkbox" onClick={() => handleCheckboxItem(d.id, schedule.id, false)} />
																								}
																							</td>
																							{
																								d.isNeed === true ?
																									<td>
																										{
																											d.isReady === true ?
																												<input type="checkbox" onClick={() => handleCheckboxItemReady(d.id, schedule.id, true, d.note)} defaultChecked="true" />
																												:
																												<input type="checkbox" onClick={() => handleCheckboxItemReady(d.id, schedule.id, false, d.note)} />
																										}
																									</td>
																									:
																									<td>
																										<input type="checkbox" disabled />
																									</td>
																							}
																							<td>
																								{
																									d.isNeed === true ?
																										<td>
																											<button onClick={() => handleNote(d)} type="button" className='btn btn-sm btn-info'>Edit</button>
																										</td>
																										:
																										<td>
																											<button type="button" className='btn btn-sm btn-secondary' disabled>Edit</button>
																										</td>
																								}

																							</td>
																						</tr>
																					))
																				}
																			</tbody>
																		</table>
																	</div>
																</div>
															</div>
														</div>
													))
												}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					:
					''
			}

			<Modal
				size="lg"
				show={lgShowUpdate}
				onHide={() => setLgShowUpdate(false)}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-sm">Update Note of Requirement</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* konten detail */}
					<UpdateRequirementComp
						scheduleId={schedule.id}
						req={paramReq}
						close={() => setLgShowUpdate(false)}
						fetch={() => fetchScheduleById()}
					/>

				</Modal.Body>
			</Modal>

		</>
	)
}

export default ProgramCharterComp
