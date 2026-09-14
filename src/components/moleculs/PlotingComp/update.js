import React, { useState, useEffect } from 'react'
import Select from 'react-select';
import { MySwal } from '../../../lib/swal.js'
import axios from '../../../lib/axios-ss.js'
import AsyncSelect from 'react-select/async';
import errorHandler from '../../../helpers/errorHandler.js';
import loadingImg from '../../../assets/images/loading.gif'

// Hooks
import { useFetchOpportunityById } from '../../../hooks'

import handleSearchOpportunities from '../../../helpers/handleSearchOpportunities.js';
import { convertHourToMs } from '../../../helpers/convertHourToMs.js';
import { convertMsToHour } from '../../../helpers/convertMsToHour.js';

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

const UpdatePlottingComp = (props) => {

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
	const { opportunity, loadingFetchOpportunity } = useFetchOpportunityById({ opportunityId: selectedOption })
	const [keyword, setKeyword] = useState('');
	const [plot, setPlot] = useState('');
	const [name, setName] = useState('')
	const [wbs, setWbs] = useState('')
	const [topic, setTopic] = useState('')
	const [client, setClient] = useState('')
	const [group, setGroup] = useState('')
	const [wbsPeriod, setWbsPeriod] = useState('')
	const [sales, setSales] = useState(0)
	const [planHours, setPlanHours] = useState('')
	const [sapProjectId, setSapProjectId] = useState('')

	const fetchPlotById = async () => {
		// alert(params.id)
		try {
			const options = {
				url: `/plots/${props.plottId}`,
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
			setPlot(data.data)
			setSelectedOption(data.data.OpportunityId)

		} catch (err) {
			errorHandler({ err: err?.response?.data || err })
		}
	}

	const handleUpdate = () => {

		const config = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				appApiName: `settingManagement`,
				modApiName: `application`,
				policy: `read`
			}
		}

		const requestBody = {
			OpportunityId: selectedOption,
			plotPermissions: plotPermissions,
			name: name,
			wbs: wbs,
			topic: topic,
			client: client,
			sales,
			wbsPeriod: wbsPeriod ? new Date(wbsPeriod).getTime() : null,
			group: group,
			planHours: planHours ? convertHourToMs(planHours) : null,
			sapId: sapProjectId
		}

		axios.put(`/plots/${plot.id}`, requestBody, config)
			.then(res => {
				// console.log(res)
				if (res.status === 200) {

					MySwal.fire({
						icon: 'success',
						title: 'Success',
						text: 'Plott has been updated successfully!',
					})
						.then(() => {
							props.fetch(true)
							props.close()
						})
				}
			})
			.catch(err => {
				console.log(err?.response?.data)
				errorHandler({ err: err?.response?.data || err })
			})

	}

	useEffect(() => {
		fetchPlotById()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (plot) {
			setName(plot.name || '')
			setTopic(plot.topic || '')
			setClient(plot.client || '')
			setGroup(plot.group || '')
			setWbs(plot.wbs || '')
			setSapProjectId(plot.sapId || '')
			setSales(plot.sales || 0)
			setWbsPeriod(plot.wbsPeriod ? new Date(plot.wbsPeriod) : '')
			setPlotPermissions(plot.PlotPermissions.map(item => {
				return {
					email: item.email
				}
			}))
			setPlanHours(plot.planHours ? convertMsToHour(plot.planHours) : '')
		}
	}, [plot])

	// console.log(plot)

	return (
		<>
			<div className='row'>
				<div className="col-lg-8 col-12 mb-3">
					<label className='form-label'>Opportunity</label>
					{
						plot ?
							<AsyncSelect
								cacheOptions
								defaultOptions
								isDisabled
								loadOptions={handleSearchOpportunities}
								onChange={e => setSelectedOption(e.value)}
								defaultValue={{
									label: plot.name,
									value: plot.OpportunityId
								}}
							/>
							:
							null
					}
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
			<div className='row'>
				<div className="col-lg-4 col-12 mb-3">
					<label className="form-label col-12 col-form-label">WBS</label>
					<div className="col">
						<input
							type="text"
							className='form-control'
							value={wbs}
							readOnly
						/>
					</div>
				</div>
				<div className="col-lg-8 col-12 mb-3">
					<label className="form-label col-12 col-form-label required">Topic</label>
					<div className="col">
						<input
							type="text"
							className='form-control'
							value={topic}
							readOnly
						/>
					</div>
				</div>
				<div className="col-lg-4 col-12 mb-3">
					<label className="form-label col-12 col-form-label required">APM</label>
					<div className="col">
						<select
							className='form-select'
							value={group}
							disabled
						>
							<option value="">=== Select APM ===</option>
							<option value="APM P">APM P</option>
							<option value="APM C1">APM C1</option>
							<option value="APM C2">APM C2</option>
						</select>
					</div>
				</div>
				<div className='col-lg-4 col-12 mb-3'>
					<label className='form-label'>SAP Project Id</label>
					<input
						type="text"
						className='form-control'
						value={sapProjectId}
						readOnly
					/>
				</div>
				<div className='col-lg-4 col-12 mb-3'>
					<label className='form-label'>Plan Hours (Hour)</label>
					<input
						type="number"
						className='form-control'
						value={planHours}
						onChange={e => setPlanHours(e.target.value)}
						placeholder="40"
					/>
				</div>
				<div className="col-lg-8 col-12 mb-3">
					<label className="form-label col-12 col-form-label required">Client</label>
					<div className="col">
						<input
							type="text"
							className='form-control'
							value={client}
							readOnly
						/>
					</div>
				</div>
			</div>
			<div className='row'>
				<label className='form-label required'>Plot Permissions</label>
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
			<div className='row'>
				<div className="form-footer">
					<button onClick={handleUpdate} type="button" className="btn btn-ghost-primary">Save</button>
				</div>
			</div>
		</>
	)
}

export default UpdatePlottingComp
