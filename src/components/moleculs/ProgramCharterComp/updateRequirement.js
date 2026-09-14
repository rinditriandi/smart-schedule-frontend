import React, { useState } from 'react'
import Badge from 'react-bootstrap/Badge';
import { MySwal } from '../../../lib/swal.js'
import axios from '../../../lib/axios-ss.js'

// Error Handler
import errorHandler from '../../../helpers/errorHandler.js'

const UpdateRequirementComp = (props) => {
	// console.log(props)

	const label = props.req.label
	const isNeed = props.req.isNeed
	const isReady = props.req.isReady
	const reqId = props.req.id
	const [note, setNote] = useState(props.req.note)

	const handleSubmitNote = () => {
		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				appApiName: `settingManagement`,
				modApiName: `application`,
				policy: `read`
			}
		}

		const requestBody = {
			ScheduleId: props.scheduleId,
			RequirementId: reqId,
			isReady: isReady,
			note: note
		}

		axios.put(`/requirements`, requestBody, config)
			.then(res => {
				// console.log(res)
				if (res.status === 200) {
					MySwal.fire({
						icon: 'success',
						title: 'Success',
						text: 'Successfully add notes items!',
					})
						.then(() => {
							props.fetch()
							props.close()
						})
				}
			})
			.catch(err => {
				errorHandler({ err: err?.response?.data || err })
			})
	}

	return (
		<div className='row'>
			<div className="col-lg-4 col-12 mb-3">
				<label className="form-label col-12 col-form-label">Item Requirement</label>
				<div className="col">
					<input type="text" className='form-control' value={label} disabled />
				</div>
			</div>
			<div className="col-lg-4 col-12 mb-3">
				<label className="form-label col-12 col-form-label">Is Request ?</label>
				<div className="col">
					{
						isNeed === true ?
							<Badge bg="success">Yes</Badge>
							:
							<Badge bg="warning">No</Badge>
					}
				</div>
			</div>
			<div className="col-lg-4 col-12 mb-3">
				<label className="form-label col-12 col-form-label">Is Ready ?</label>
				<div className="col">
					{
						isReady === true ?
							<Badge bg="success">Yes</Badge>
							:
							<Badge bg="warning">No</Badge>
					}
				</div>
			</div>
			<div className="col-12 mb-3">
				<label className="form-label col-12 col-form-label">Notes</label>
				<div className="col">
					<textarea onChange={e => setNote(e.target.value)} type="text" className='form-control' value={note} rows="3"></textarea>
				</div>
			</div>
			<div className="col-12 mb-3">
				<button onClick={handleSubmitNote} type='button' className='btn btn-ghost-primary'>Save</button>
			</div>
		</div>
	)
}

export default UpdateRequirementComp
