import React from 'react'
import DataTable from 'react-data-table-component'
import { Dropdown } from 'react-bootstrap'
import { numberToTime } from '../../../helpers/numberToTime'
import { numberToDate } from '../../../helpers/numberToDate'
import { useHistory } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom'

const DataTableSchedule = (props) => {
	// console.log(props)

	const listSchedules = props.schedules.length > 0 ? props.schedules : []
	// console.log(listSchedules[0].Plot)
	const history = useHistory()
	const handleChangePage = path => {
		const currentUrl = path.split("/")
		const segment_1 = currentUrl[1]
		if (segment_1 === "program-charter") {
			window.open(path, '_blank')
		} else {
			history.push(path)
		}
	}

	const conditionalRowStyles = [
		{
			when: row => row.SameSchedules.length > 0,
			style: {
				backgroundColor: '#BDC3C7',
				color: 'black',
				'&:hover': {
					cursor: 'pointer',
				},
			},
		}
	];

	const columns = [
		{
			name: 'Actions',
			width: '100px',
			cell: (row) => <>
				{
					<Dropdown drop="end">
						<Dropdown.Toggle variant="info btn-sm" id="dropdown-basic">
							Choose
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item onClick={() => handleChangePage(`/schedule-detail/${row.id}`)}>Detail</Dropdown.Item>

							{
								row.gcalEventStatus !== "OK" ?
									<Dropdown.Item onClick={() => props.handleSyncGcal(row.id)}>Sync Gcal</Dropdown.Item>
									:
									''
							}

							{
								row.gcalEventStatus === "OK" ?
									<Dropdown.Item onClick={() => props.handleUnsyncGcal(row.id)}>Unsync Gcal</Dropdown.Item>
									:
									''
							}

							<Dropdown.Item onClick={() => props.handleModalUpdate(row.id)}>Edit Schedule</Dropdown.Item>
							<Dropdown.Item onClick={() => props.setLgShowDuplicate(row.id)}>Duplicate Schedule</Dropdown.Item>
							<Dropdown.Item onClick={() => props.handleDelete(row.id)}>Delete Schedule</Dropdown.Item>
							<Dropdown.Item onClick={() => handleChangePage(`/program-charter/${row.id}`)}>Program Charter</Dropdown.Item>
							{/* <Dropdown.Item>
								<Link
									to={`/program-charter/${row.id}`}
								>
									Program Charter
								</Link>
							</Dropdown.Item> */}

						</Dropdown.Menu>
					</Dropdown>
				}

			</>,
		},
		{
			name: "Class Type",
			selector: (row) => row.ClassType.label,
		},
		{
			name: "Activity",
			selector: (row) => row.ActivityType.label,
		},
		{
			name: "Client",
			selector: (row) => row.Plot.client,
		},
		{
			name: "Topic",
			selector: (row) => row.Plot.topic,
		},
		{
			name: "Consultants",
			cell: (row) => <>
				<ul>
					{
						row.Consultants.map((rc, i) =>
							<li key={i} className="dropdown-item">
								{rc.alias}
							</li>
						)
					}
				</ul>
			</>,
		},
		{
			name: "Time",
			cell: (row) => <>
				{numberToDate(row.date)}
				&nbsp;|&nbsp;
				{numberToTime(row.startHours)} - {numberToTime(row.endHours)}
			</>,
		},
		{
			name: "Sync Gcal Status",
			cell: (row) => <>
				{
					row.gcalEventStatus === "OK" ?
						<Badge bg="info">{row.gcalEventStatus}</Badge> :
						<Badge bg="danger">PENDING</Badge>
				}
			</>,
		},
		{
			name: "Charter Status",
			cell: (row) => <>
				{
					row.notReadyRequirementCount > 0 ?
						<Badge bg="danger">NOT OK</Badge> :
						<Badge bg="success">OK</Badge>
				}
			</>,
		},
		{
			name: "WBS Lv 2",
			selector: (row) => row.Plot.wbs,
		}
	]

	return <DataTable
		columns={columns}
		data={listSchedules}
		pagination
		fixedHeader
		highlightOnHover
		subHeaderAlign="center"
		conditionalRowStyles={conditionalRowStyles}
	/>
}

export default DataTableSchedule
