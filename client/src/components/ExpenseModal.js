import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { base_url } from '../config';
import moment from 'moment';
import 'moment/locale/pt-br';

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

const nextMonth = moment().add(1, 'month').format('M');

export default function ExpenseModal({ isOpen, onRequestClose, id, onSubmit }) {
	const [ description, setDescription ] = useState('');
	const [ totalValue, setTotalValue ] = useState('');
	const [ dueDay, setDueDay ] = useState(-1);
	const [ dueMonth, setDueMonth ] = useState(+nextMonth);
	const [ status, setStatus ] = useState('AP');

	const handleChangeDescription = (event) => {
		setDescription(event.target.value);
	};
	
	const handleChangeTotalValue = (event) => {
		setTotalValue(+event.target.value);
	};

	const handleChangeDueDay = (event) => {
		setDueDay(event.target.value ? +event.target.value : '');
	};

	const handleChangeDueMonth = (event) => {
		setDueMonth(+event.target.value);
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
	};

	const afterOpenModal = async () => {
		if (id) {
			const tr = await axios.get(`${base_url}/expenses/${id}`, {
				headers: {
					Authorization:	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YmRlOWExMy00MjIzLTQ1ZDMtOTdmMC00OTIxMTE5OTlhMTEiLCJlbWFpbCI6ImdhYnJpZWxAZ21haWwuY29tIiwiaWF0IjoxNjU5MDQ2NTc1LCJleHAiOjE2NTkxMzI5NzV9.Qgp-h62ShCg7-XueHcy1V3TcaIpAcymPiNK_6YOACbI'
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
			setDueMonth(nextMonth);
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
						{id ? 'Edição' : 'Inclusão'} de registro de despesa
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

							<div style={{ marginRight: '10px', width: '100%' }} className="input-field">
								<input
									type="number"
									id="inputDueMonth"
									min="1"
									max="12"
									step="1"
									value={dueMonth}
									onChange={handleChangeDueMonth}
								/>
								<label htmlFor="inputDueMonth" className="active">
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
