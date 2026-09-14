import React from 'react'
import DataTable from 'react-data-table-component'
import { Dropdown } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const DataTablePloting = (props) => {

	const history = useHistory()
	const handleChangePage = path => {
		history.push(path)
	}

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
							<Dropdown.Item onClick={() => handleChangePage(`/plotting-detail/${row.id}`)}>Detail</Dropdown.Item>
							<Dropdown.Item onClick={() => props.handleModalUpdate(row.id)}>Edit</Dropdown.Item>
							<Dropdown.Item onClick={() => props.handleRefreshPlot(row.id)}>Refresh</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				}

			</>,
		},
		{
			name: "Plott ID",
			selector: (row) => row.id,
		},
		{
			name: "Topic",
			selector: (row) => row.topic,
		},
		{
			name: "Client",
			selector: (row) => row.client,
		},
		{
			name: "WBS",
			selector: (row) => row.wbs,
		},
		{
			name: "Opportunity ID",
			selector: (row) => row.OpportunityId,
		},
		{
			name: "Group",
			selector: (row) => row.group,
		},
		{
			name: "Profit Center",
			selector: (row) => row.profitCenter,
		},
		{
			name: "Program Category",
			selector: (row) => row.programCategory,
		},
	]

	return <DataTable
		columns={columns}
		data={props.plots}
		pagination
		fixedHeader
		highlightOnHover
		subHeaderAlign="center"
		subHeader
		subHeaderComponent={
			<input
				type="text"
				placeholder="Search by Topic, Client or APM Group"
				className='w-50 form-control m-3'
				values={props.search}
				onChange={(e) => props.handleChangeSearch(e.target.value)}
			/>
		}
	/>
}

export default DataTablePloting
