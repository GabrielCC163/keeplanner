import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { base_url } from '../config';
import capitalize from '../utils/capitalize';
import moment from 'moment';

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
		transform: 'translate(-50%, -50%)',
		width: '400px'
	},
	overlay: {
		zIndex: 10
	}
};

export default function IncomeModal({ token, period, isOpen, onRequestClose, id, onSubmit }) {
	const monthOptions = [];
	const currMonth = {name: capitalize(moment(`${period}-01`).format('MMMM')), number: +moment(`${period}-01`).format('M')};
	const nextMonth = {name: capitalize(moment(`${period}-01`).add(1, 'month').format('MMMM')), number: +moment(`${period}-01`).add(1, 'month').format('M')};
	monthOptions.push(currMonth, nextMonth);

	const [ accountName, setAccountName ] = useState('');
	const [ totalValue, setTotalValue ] = useState('');
	const [ dayOfReceipt, setDayOfReceipt ] = useState(-1);
	const [ month, setMonth ] = useState(currMonth.number);
	const [ fixed, setFixed ] = useState(false);

	const handleChangeAccountName = (event) => {
		setAccountName(event.target.value);
	};
	
	const handleChangeTotalValue = (event) => {
		setTotalValue(event.target.value ? +event.target.value : '');
	};

	const handleChangeDayOfReceipt = (event) => {
		setDayOfReceipt(event.target.value ? +event.target.value : '');
	};

	const handleChangeMonth = (event) => {
		setMonth(event.target.value ? +event.target.value : '');
	};

	const handleChangeFixed = (event) => {
		setFixed(event.target.value === 'true' ? true : false);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const payload = {id, accountName, totalValue, month, fixed};
		if (dayOfReceipt >= 1) {
			payload['dayOfReceipt'] = dayOfReceipt
		}

		onSubmit(payload);
		setAccountName('');
		setTotalValue('');
		setDayOfReceipt(-1);
		setMonth('');
		setFixed(false);
		onRequestClose();
	};

	const afterOpenModal = async () => {
		if (id) {
			const tr = await axios.get(`${base_url}/incomes/${id}`, {
				headers: {
					Authorization: token	
				}
			});
			const json = tr.data;
			setAccountName(json.accountName);
			setTotalValue(json.totalValue);
			setDayOfReceipt(json.dayOfReceipt);
			setMonth(json.month || '');
			setFixed(json.fixed);
		} else {
			setAccountName('');
			setTotalValue('');
			setDayOfReceipt(-1);
			setMonth(currMonth.number);
			setFixed(false);
		}
	};

	const afterCloseModal = () => {
		setAccountName('');
		setTotalValue('');
		setDayOfReceipt(-1);
		setMonth('');
		setFixed(false);
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
					<h3 style={{ marginRight: '10px', fontWeight: 'bold', color: 'black' }}>
						{id ? 'Edição de ' : 'Nova'} receita
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
								id="inputAccoutName"
								value={accountName}
								required
								onChange={handleChangeAccountName}
							/>
							<label htmlFor="inputAccoutName" className="active">
								Nome da Conta Bancária ou Banco*:
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
									id="inputDayOfReceipt"
									min="0"
									max="31"
									step="1"
									value={dayOfReceipt >= 1 ? dayOfReceipt : ''}
									onChange={handleChangeDayOfReceipt}
								/>
								<label htmlFor="inputDayOfReceipt" className="active">
									Dia de recebimento:
								</label>
							</div>

							
							<div style={{width: '100%'}} className="input-field">
								<select id="inputMonth" className="browser-default" onChange={handleChangeMonth} value={month}>
									<option key={0} value={''}>-- selecione --</option>
									{monthOptions.map((op, idx) => {
										return (
											<option key={idx+1} value={op.number}>{op.name}</option>
										)
									})}
								</select>
								<label style={{ marginTop: '-4px' }} htmlFor="inputMonth" className="active">
									Mês:
								</label>
							</div>
						</div>

						<div style={{width: '100%'}} className="input-field">
							<select id="inputFixed" className="browser-default" onChange={handleChangeFixed} value={fixed}>
								<option key={1} value={false}>
									Não
								</option>
								<option key={2} value={true}>
									Sim
								</option>
							</select>
							<label htmlFor="inputFixed" className="active">
								Recebimento fixo*:
							</label>
						</div>
					</div>
					<input className="waves-effect waves-light btn" type="submit" value="Salvar" disabled={false} />
				</form>
			</div>
		</Modal>
	);
}
