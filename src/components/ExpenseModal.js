import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { base_url } from '../config';
import moment from 'moment';
import 'moment/locale/pt-br';
import capitalize from '../utils/capitalize';

const customStyles = {
	content: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		border: '1px solid rgb(204, 204, 204)',
		background: 'rgb(255, 255, 255)',
		overflow: 'auto',
		borderRadius: '4px',
		outline: 'none',
		padding: '20px',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)'
	},
	overlay: {
		zIndex: 10
	}
};

export default function ExpenseModal({ token, period, isOpen, onRequestClose, id, onSubmit }) {
	const dueMonthOptions = [];
	const currMonth = {name: capitalize(moment(`${period}-01`).format('MMMM')), number: +moment(`${period}-01`).format('M')};
	const nextMonth = {name: capitalize(moment(`${period}-01`).add(1, 'month').format('MMMM')), number: +moment(`${period}-01`).add(1, 'month').format('M')};
	dueMonthOptions.push(currMonth, nextMonth);
	
	const [ description, setDescription ] = useState('');
	const [ totalValue, setTotalValue ] = useState('');
	const [ dueDay, setDueDay ] = useState(-1);
	const [ dueMonth, setDueMonth ] = useState(currMonth.number);
	const [ status, setStatus ] = useState('AP');

	const handleChangeDescription = (event) => {
		setDescription(event.target.value);
	};
	
	const handleChangeTotalValue = (event) => {
		setTotalValue(event.target.value ? +event.target.value : '');
	};

	const handleChangeDueDay = (event) => {
		setDueDay(event.target.value ? +event.target.value : '');
	};

	const handleChangeDueMonth = (event) => {
		setDueMonth(event.target.value ? +event.target.value : '');
	};

	const handleChangeStatus = (event) => {
		setStatus(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const payload = {id, description, totalValue, dueDay, dueMonth, status};
		if (dueDay >= 1) {
			payload['dueDay'] = dueDay
		}

		onSubmit(payload);
		setDescription('');
		setTotalValue('');
		setDueDay(-1);
		setDueMonth('');
		setStatus('AP');
		onRequestClose();
	};

	const afterOpenModal = async () => {
		if (id) {
			const tr = await axios.get(`${base_url}/expenses/${id}`, {
				headers: {
					Authorization: token
				}
			});
			const json = tr.data;
			setDescription(json.description);
			setTotalValue(json.totalValue);
			setDueDay(json.dueDay);
			setDueMonth(json.dueMonth);
			setStatus(json.status);
		} else {
			setDescription('');
			setTotalValue('');
			setDueDay(-1);
			setDueMonth(currMonth.number);
			setStatus('AP');
		}
	};

	const afterCloseModal = () => {
		setDescription('');
		setTotalValue('');
		setDueDay(-1);
		setDueMonth('');
		setStatus('AP');
		onRequestClose();
	}

	return (
		<Modal
			onAfterOpen={afterOpenModal}
			ariaHideApp={false}
			isOpen={isOpen}
			onRequestClose={afterCloseModal}
			style={customStyles}
			contentLabel=""
		>
			<div>
				<div
					style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
					className="modal_container"
				>
					<h3 style={{ marginRight: '10px', fontWeight: 'bold' }}>
						{id ? 'Edição de ' : 'Nova'} despesa
					</h3>
					<button className="waves-effect waves-light btn red darken-4" onClick={onRequestClose}>
						X
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div
						style={{
							border: '1px solid lightgrey',
							borderRadius: '4px',
							padding: '10px',
							marginBottom: '10px'
						}}
					>
						
						<div className="input-field">
							<input
								type="text"
								id="inputDescription"
								value={description}
								required
								onChange={handleChangeDescription}
							/>
							<label htmlFor="inputDescription" className="active">
								Descrição*:
							</label>
						</div>
						<div className="input-field">
							<input
								type="number"
								id="inputValue"
								min="0"
								step="0.01"
								value={totalValue}
								required
								onChange={handleChangeTotalValue}
							/>
							<label htmlFor="inputValue" className="active">
								Valor Total*:
							</label>
						</div>

						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<div style={{ marginRight: '10px', width: '100%' }} className="input-field">
								<input
									type="number"
									id="inputDueDay"
									min="0"
									max="31"
									step="1"
									value={dueDay >= 1 ? dueDay : ''}
									onChange={handleChangeDueDay}
								/>
								<label htmlFor="inputDueDay" className="active">
									Dia de vencimento:
								</label>
							</div>

							<div style={{width: '100%'}} className="input-field">
								<select id="inputDueMonth" className="browser-default" onChange={handleChangeDueMonth} value={dueMonth}>
									{dueMonthOptions.map((op, idx) => {
										return (
											<option key={idx} value={op.number}>{op.name}</option>
										)
									})}
								</select>
								<label style={{ marginTop: '-4px' }} htmlFor="inputDueMonth" className="active">
									Mês de vencimento*:
								</label>
							</div>
						</div>

						<div style={{width: '100%'}} className="input-field">
							<select id="inputStatus" className="browser-default" onChange={handleChangeStatus} value={status}>
								<option key={1} value={'AP'}>
									Aguardando Pagamento (AP)
								</option>
								<option key={2} value={'PA'}>
									Pago (PA)
								</option>
							</select>
							<label style={{ marginTop: '-4px' }} htmlFor="inputStatus" className="active">
								Status*:
							</label>
						</div>

					</div>
					<input className="waves-effect waves-light btn" type="submit" value="Salvar" disabled={false} />
				</form>
			</div>
		</Modal>
	);
}
