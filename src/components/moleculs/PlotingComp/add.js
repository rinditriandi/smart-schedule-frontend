import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import { MySwal } from '../../../lib/swal.js'
import axios from '../../../lib/axios-ss.js'
import errorHandler from '../../../helpers/errorHandler.js';
import loadingImg from '../../../assets/images/loading.gif'

import AsyncSelect from 'react-select/async';

// Hooks
import { useFetchOpportunityById, useFetchProgramScheduleById } from '../../../hooks'

import handleSearchOpportunities from '../../../helpers/handleSearchOpportunities.js';
import handleSearchProgramSchedules from '../../../helpers/handleSearchProgramSchedules.js';
import { convertHourToMs } from '../../../helpers/convertHourToMs.js';

const userPermissions = [
	{
		label: 'apm-p@prasmul-eli.co'
	},
	{
		label: 'apm-c1@prasmul-eli.co'
	},
	{
		label: 'apm-c2@prasmul-eli.co'
	},
	{
		label: 'rachmasari.kusumalestari@prasmul-eli.co'
	},
	{
		label: 'marti.yusnida@prasmul-eli.co'
	},
	{
		label: 'firna.wardhani@prasmul-eli.co'
	},
	{
		label: 'ajeng.gusvidyandra@prasmul-eli.co'
	},
]

const AddPlottingComp = (props) => {

	const currentUrl = window.location.pathname.split("/");
	const segment_1 = currentUrl[1];

	const [plotPermissions, setPlotPermissions] = useState([
		{
			email: localStorage.getItem('email'),
			name: localStorage.getItem('fullname')
		}
	])

	// const [opportunities, setOpportunities] = useState([]);
	const [comboOpp, setComboOpp] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [selectedOptionPs, setSelectedOptionPs] = useState(null);
	const { opportunity, loadingFetchOpportunity } = useFetchOpportunityById({ opportunityId: selectedOption })
	const { programSchedule, loadingFetchProgramSchedule } = useFetchProgramScheduleById({ programScheduleId: selectedOptionPs })
	const [name, setName] = useState('')
	const [wbs, setWbs] = useState('')
	const [topic, setTopic] = useState('')
	const [client, setClient] = useState('')
	const [group, setGroup] = useState('')
	const [wbsPeriod, setWbsPeriod] = useState('')
	const [sales, setSales] = useState(0)
	const [planHours, setPlanHours] = useState('')
	const [sapProjectId, setSapProjectId] = useState('')

	const handleAdd = () => {

		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				appApiName: `settingManagement`,
				modApiName: `application`,
				policy: `read`
			}
		}

		const requestBody = {
			OpportunityId: selectedOption || selectedOptionPs,
			odooWbsId: selectedOption || selectedOptionPs,
			name: name,
			wbs: wbs,
			topic: topic,
			client: client,
			group: group,
			sales,
			wbsPeriod: wbsPeriod !== "" ? new Date(wbsPeriod).getTime() : null,
			planHours: planHours ? convertHourToMs(planHours) : null,
			plotPermissions: plotPermissions,
			sapId: sapProjectId
		}

		axios.post(`/plots`, requestBody, config)
			.then(res => {
				// console.log(res)
				if (res.status === 201) {

					MySwal.fire({
						icon: 'success',
						title: 'Success',
						text: 'Plott has been created successfully!',
					})
						.then(() => {
							props.fetch(true)
							props.close()
						})
				}
			})
			.catch(err => {
				console.log(err?.response?.data || err)
				errorHandler({ err: err?.response?.data || err })
			})
	}

	// useEffect(() => {
	// 	if (opportunity) {
	// 		if (opportunity.Program_Schedule__r) {
	// 			setName(opportunity.Program_Schedule__r.Program_Schedule_Name__c)
	// 			setClient(opportunity.Program_Schedule__r.Account__r.Name)
	// 			setWbs(opportunity.Program_Schedule__r.WBS_Elemen_Level_2__c)
	// 			setTopic(opportunity.Program_Schedule__r.Program_Schedule_Name__c)
	// 			setGroup(opportunity.Program_Schedule__r.Owner.Name)
	// 			setSapProjectId(opportunity.Program_Schedule__r.SAP_Project_Id__c)
	// 			setSales(0)
	// 			setWbsPeriod(new Date(opportunity.Program_Schedule__r.WBS_Period__c))
	// 		} else {
	// 			setName(opportunity.Name)
	// 			setClient(opportunity.Account__r.name)
	// 			setWbs(opportunity?.WBS_Element_Level_2__c || '')
	// 			setTopic(opportunity?.Program_Name__c || '')
	// 			setGroup(opportunity?.PIC_of_APM__c?.name || '')
	// 			setSapProjectId(opportunity?.SAP_Project_ID__c || '')
	// 			setSales(opportunity?.Invoice_Created__c || 0)
	// 			if (opportunity?.CloseDate) {
	// 				setWbsPeriod(new Date(opportunity.CloseDate))
	// 			}
	// 		}
	// 	}
	// }, [opportunity])

	useEffect(() => {
		if (programSchedule) {
			console.log(programSchedule)
			setName(programSchedule.Program_Schedule_Name__c)
			setClient(programSchedule?.Account__r?.name || '')
			setWbs(programSchedule.WBS_Elemen_Level_2__c)
			setTopic(programSchedule.Program_Schedule_Name__c)
			setGroup(programSchedule.PIC_of_APM__c.name)
			setSapProjectId(programSchedule.SAP_Project_Id__c)
			setSales(programSchedule.Total_Sales)
			setWbsPeriod(programSchedule?.WBS_Period__c !== "" ? new Date(programSchedule.WBS_Period__c) : "")
		}
	}, [programSchedule])

	return (
		<div className='row'>
			{/* <div className="col-lg-6 col-12 mb-3">
				<label className="form-label col-12 col-form-label">Opportunity</label>
				<div className="col">
					<AsyncSelect
						cacheOptions
						defaultOptions
						loadOptions={handleSearchOpportunities}
						onChange={e => {
							setSelectedOptionPs(null)
							setSelectedOption(e.value)
						}}
					/>
				</div>
			</div> */}
			<div className="col-lg-6 col-12 mb-3">
				<label className="form-label col-12 col-form-label">Odoo Project</label>
				<div className="col">
					<AsyncSelect
						cacheOptions
						defaultOptions
						loadOptions={handleSearchProgramSchedules}
						onChange={e => {
							setSelectedOption(null)
							setSelectedOptionPs(e.value)
						}}
					/>
				</div>
			</div>
			{
				loadingFetchOpportunity ?
					<div style={{ textAlign: 'center' }}>
						<img
							alt='loading'
							src={loadingImg}
							style={{ width: '60px' }}
						/>
					</div>
					:
					null
			}
			<div className='row my-3'>
				<div className='col'>
					<label className='form-label required'>WBS Name</label>
					<input
						type="text"
						className='form-control'
						value={name}
						onChange={e => setName(e.target.value)}
					/>
				</div>
				{/* <div className='col'>
					<label className='form-label'>WBS Element Level 2</label>
					<input
						type="text"
						className='form-control'
						value={wbs}
						onChange={e => setWbs(e.target.value)}
					/>
				</div> */}
			</div>
			<div className='row my-3'>
				<div className='col'>
					<label className='form-label required'>Client</label>
					<input
						type="text"
						className='form-control'
						value={client}
						onChange={e => setClient(e.target.value)}
					/>
				</div>
				<div className='col'>
					<label className='form-label required'>Topic</label>
					<input
						type="text"
						className='form-control'
						value={topic}
						onChange={e => setTopic(e.target.value)}
					/>
				</div>
			</div>
			<div className='row my-3'>
				<div className='col'>
					<label className='form-label required'>WBS Period</label>
					<input
						type="text"
						className='form-control'
						readOnly
						value={wbsPeriod !== "" ? `${new Date(wbsPeriod)}` : ''}
					/>
				</div>
				<div className='col'>
					<label className='form-label required'>Sales</label>
					<input
						type="number"
						className='form-control'
						value={sales}
						readOnly
					/>
				</div>
			</div>
			<div className='row my-3'>
				<div className='col'>
					<label className='form-label required'>APM</label>
					<input
						type="number"
						className='form-control'
						value={group}
						readOnly
					/>
					{/* <select
						type="text"
						className='form-select'
						value={group}
						onChange={e => setGroup(e.target.value)}
					>
						<option value="">=== SELECT BPE ===</option>
						<option value="BPE-P">BPE P</option>
						<option value="BPE-C1">BPE C1</option>
						<option value="BPE-C2">BPE C2</option>
						<option value="BPE-C3">BPE C3</option>
					</select> */}
				</div>
				<div className='col'>
					<label className='form-label'>SAP Project Id</label>
					<input
						type="text"
						className='form-control'
						value={sapProjectId}
						onChange={e => setSapProjectId(e.target.value)}
					/>
				</div>
			</div>
			<div className='row my-3'>
				<div className='col'>
					<label className='form-label'>Plan Hours (Hour)</label>
					<input
						type="number"
						className='form-control'
						value={planHours}
						onChange={e => setPlanHours(e.target.value)}
						placeholder="40"
					/>
				</div>
			</div>
			<div className="row">
				<label className="form-label col-12 col-form-label required">WBS Permissions</label>
				<div className='col'>
					<Select
						value={plotPermissions.map(item => {
							return {
								label: item.email,
								value: item.email
							}
						})}
						options={userPermissions.map(item => {
							return {
								label: item.label,
								value: item.label
							}
						})}
						onChange={e => {
							const findCurrentUser = e.find(item => item.value == localStorage.getItem('email'))

							if (!findCurrentUser) {
								return MySwal.fire({
									icon: 'warning',
									title: 'Oops',
									text: 'you cannot delete yourself on wbs permissions !'
								})
							}

							setPlotPermissions(e.map(item => {
								return {
									email: item.value
								}
							}))
						}}
						isMulti
					/>
				</div>
				{/* <div className="col">
					{
						plotPermissions.map((item, index) => (
							<div key={index}>
								<input
									type="text"
									className='form-control'
									readOnly
									value={item.email}
								/>
							</div>
						))
					}
				</div> */}
			</div>
			<div className="form-footer">
				<button onClick={handleAdd} type="button" className="btn btn-ghost-primary">Save</button>
			</div>
		</div>
	)
}

export default AddPlottingComp
