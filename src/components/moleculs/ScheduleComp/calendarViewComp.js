import React, { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { formatDateCalendar } from '../../../helpers/formatDateCalendar'
import { numberToDateTime } from '../../../helpers/numberToDateTime'
import { titleCalendar } from '../../../helpers/titleCalendar'
import { dateToTime } from '../../../helpers/dateToTime.js'
import { formatTime } from '../../../helpers/formatTime'
import { Table, Modal } from 'react-bootstrap'
import axios from '../../../lib/axios-ss.js'

import loadingImg from '../../../assets/images/loading.gif'
import Loading from '../../../components/moleculs/Loading'

// Components
import UpdateScheduleComp from './update'
import AddScheduleComp from './add'
import DetailScheduleComp from './detail'

// Error Handler
import errorHandler from '../../../helpers/errorHandler.js';

// Hooks
import { useFetchActivities, useFetchClassTypes, useFetchConsultants } from '../../../hooks'

import exampleDataSchedules from '../../../exampleData/schedules.js'

const CalendarViewComp = (props) => {
	// console.log(props)

	const { activities } = useFetchActivities()
	const { classTypes } = useFetchClassTypes()
	const { consultants } = useFetchConsultants()

	const [apmGroup, setApmGroup] = useState('')
	const [classType, setClassType] = useState('')
	const [activity, setActivity] = useState('')
	const [consultant, setConsultant] = useState('')
	const [selectedScheduleUpdate, setSelectedScheduleUpdate] = useState('')
	const [selectedScheduleDetail, setSelectedScheduleDetail] = useState('')
	const [lgShowAdd, setLgShowAdd] = useState(false)
	const [loading, setLoading] = useState(false)

	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
	// console.log(selectedMonth)

	const [calendarData, setCalendarData] = useState([])
	// console.log(calendarData)

	const fetchSchedules = async () => {
		const currentUrl = window.location.pathname.split("/");
		const segment_1 = currentUrl[1];

		// const currentYear = new Date().getFullYear()
		let date = new Date(selectedYear, selectedMonth, 1)
		// date.setMonth(selectedMonth)

		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		// console.log(date, firstDay, lastDay)

		let startDate = new Date(firstDay)
		startDate.setHours(0, 1, 0, 0)
		let endDate = new Date(lastDay)
		endDate.setHours(23, 0, 0, 0)

		try {
			setLoading(true)
			const options = {
				url: `/schedules?calendarView=true&dateFrom=${dateToTime(startDate)}&dateTo=${dateToTime(endDate)}&ClassTypeId=${classType}&ActivityTypeId=${activity}&group=${apmGroup}&ConsultantId=${consultant}`,
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					appApiName: `scheduleSystem`,
					modApiName: `${segment_1}`,
					policy: `read`
				}
			}
			const { data } = await axios(options)
			// let data = exampleDataSchedules
			// console.log(data)
			// console.log(`/schedules?calendarView=true&dateFrom=${dateToTime(startDate)}&dateTo=${dateToTime(endDate)}&ClassTypeId=${classType}&ActivityTypeId=${activity}&group=${apmGroup}&ConsultantId=${consultant}`)

			setCalendarData([
				data.data.map(schedule => {
					const startHours = formatTime(new Date(schedule.startHours))
					const endHours = formatTime(new Date(schedule.endHours))

					return {
						idSchedule: schedule.id,
						title: titleCalendar(schedule.Consultants, schedule.Plot.client, schedule.Plot.topic, schedule.ClassTypeId, `${startHours} - ${endHours}`),
						start: formatDateCalendar(numberToDateTime(schedule.startHours)),
						end: formatDateCalendar(numberToDateTime(schedule.endHours)),
						courseType: schedule.ClassTypeId,
						isSyncGcal: schedule.isSyncGcal
					}
				})
			])
			setLoading(false)
		} catch (err) {
			setLoading(false)
			errorHandler({ err: err?.response?.data || err })
		}
	}

	const locales = {
		"en-US": require("date-fns/locale/en-IN"),
	}

	const localizer = dateFnsLocalizer({
		format,
		parse,
		startOfWeek,
		getDay,
		locales
	})

	useEffect(() => {
		fetchSchedules()
		// eslint-disable-next-line
	}, [selectedMonth, activity, classType, apmGroup, consultant])

	return (
		<>
			<div className="card mb-4">
				{loading && <Loading />}
				<div className="card-body">
					<div className='mb-4'>
						<button
							type="button"
							className='btn btn-primary'
							onClick={() => setLgShowAdd(true)}
						>
							Create New Schedule
						</button>
					</div>
					<div className='row'>
						<div className='col-lg-2 col-12'>
							<div className="form-floating">
								<select className="form-select" id="floatingSelect" autoComplete="off" onChange={e => setConsultant(e.target.value)} value={consultant}>
									<option value="" selected>All</option>
									{
										consultants.map((item, idx) => (
											<option key={idx} value={item.id}>({item.alias}) {item.name}</option>
										))
									}
								</select>
								<label htmlFor="floatingSelect">Consultants</label>
							</div>
						</div>
						<div className='col-lg-2 col-12'>
							<div className="form-floating">
								<select className="form-select" id="floatingSelect" autoComplete="off" onChange={e => setClassType(e.target.value)} value={classType} >
									<option value="" selected>All</option>
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
								<select className="form-select" id="floatingSelect" autoComplete="off" onChange={e => setActivity(e.target.value)} value={activity}>
									<option value="" selected>All</option>
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
									<option value="" selected>All</option>
									<option value="APM P">BPE P</option>
									<option value="APM C1">BPE C1</option>
									<option value="APM C2">BPE C2</option>
									<option value="BPE C3">BPE C3</option>
								</select>
								<label htmlFor="floatingSelect">BPE</label>
							</div>
						</div>
					</div>
				</div>
				<Calendar
					localizer={localizer}
					events={calendarData[0]}
					startAccessor="start"
					endAccessor="end"
					style={{
						height: 800,
						margin: '20px',
						fontSize: '11px',
						fontWeight: '600',
					}}
					eventPropGetter={event => ({
						style: {
							fontStyle: event.isSyncGcal === false ? 'italic' : 'normal',
							backgroundColor: event.courseType === 2
								? "#26D07C" : event.courseType === 3
									? "#0C86D9"
									: "#EB984E",
						}
					})}
					onSelectEvent={data => setSelectedScheduleDetail(data.idSchedule)}
					onNavigate={data => {
						const year = new Date(data).getFullYear()
						setSelectedYear(year)
						const month = new Date(data).getMonth()
						setSelectedMonth(month)
						// alert(`Calendar menampilkan bulan ${month + 1}`)
					}}
				/>
			</div>
			<div className='row'>
				<div className='col-3'>
					<Table striped bordered hover>
						<thead>
							<tr>
								<th style={{ backgroundColor: '#17202A', color: 'white' }} colSpan={3} className='text-center'>Color Information</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className='text-center' style={{ fontWeight: 600, color: 'white', backgroundColor: '#0C86D9' }}>Online</td>
								<td className='text-center' style={{ fontWeight: 600, color: 'white', backgroundColor: '#26D07C' }}>Onsite Cilandak</td>
								<td className='text-center' style={{ fontWeight: 600, color: 'white', backgroundColor: '#EB984E' }}>Onsite</td>
							</tr>
						</tbody>
					</Table>
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
						fetch={fetchSchedules}
					/>

				</Modal.Body>
			</Modal>

			<Modal
				size="lg"
				show={selectedScheduleUpdate === '' ? false : true}
				onHide={() => {
					setSelectedScheduleUpdate('')
				}}
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
						close={() => setSelectedScheduleUpdate('')}
						fetch={fetchSchedules}
						scheduleId={selectedScheduleUpdate}
					/>

				</Modal.Body>
			</Modal>

			<Modal
				size="xl"
				show={selectedScheduleDetail === '' ? false : true}
				onHide={() => setSelectedScheduleDetail('')}
				backdrop="static"
				keyboard={false}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
					<Modal.Title id="example-modal-sizes-title-sm">Detail Schedule</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<DetailScheduleComp
						scheduleId={selectedScheduleDetail}
						setSelectedScheduleDetail={setSelectedScheduleDetail}
						setSelectedScheduleUpdate={setSelectedScheduleUpdate}
					/>

				</Modal.Body>
			</Modal>
		</>
	);
}

export default CalendarViewComp;
