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

export default function InstallmentCategoryModal({ token, isOpen, onRequestClose, id, onSubmit }) {
	const [ description, setDescription ] = useState('');
	const [ dueDay, setDueDay ] = useState(-1);
	const [ dueMonth, setDueMonth ] = useState(+nextMonth);

	const handleChangeDescription = (event) => {
		setDescription(event.target.value);
	};
	
	const handleChangeDueDay = (event) => {
		setDueDay(event.target.value ? +event.target.value : '');
	};

	const handleChangeDueMonth = (event) => {
		setDueMonth(event.target.value ? +event.target.value : '');
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const payload = {id, description, dueDay, dueMonth };
		if (dueDay >= 1) {
			payload['dueDay'] = dueDay
		}

		onSubmit(payload);
		setDescription('');
		setDueDay(-1);
		setDueMonth('');
		onRequestClose();
	};

	const afterOpenModal = async () => {
		if (id) {
			const tr = await axios.get(`${base_url}/installment-categories/${id}`, {
				headers: {
					Authorization: token
				}
			});
			const json = tr.data;
			setDescription(json.description);
			setDueDay(json.dueDay);
			setDueMonth(json.dueMonth);
		} else {
			setDescription('');
			setDueDay(-1);
			setDueMonth(nextMonth);
		}
	};

	const afterCloseModal = () => {
		setDescription('');
		setDueDay(-1);
		setDueMonth('');
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
						{id ? 'Edição de ' : 'Nova'} parcela
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

					</div>
					<input className="waves-effect waves-light btn" type="submit" value="Salvar" disabled={false} />
				</form>
			</div>
		</Modal>
	);
}
