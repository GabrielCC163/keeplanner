import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { base_url } from '../config';

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

export default function InstallmentModal({ token, isOpen, onRequestClose, id, onSubmit, installmentCategoryId }) {
	const [ description, setDescription ] = useState('');
	const [ value, setValue ] = useState('');
	const [ installment, setInstallment ] = useState(1);
	const [ totalInstallments, setTotalInstallments ] = useState('')

	const handleChangeDescription = (event) => {
		setDescription(event.target.value);
	};
	
	const handleChangeValue = (event) => {
		setValue(event.target.value ? +event.target.value : '');
	};

	const handleChangeInstallment = (event) => {
		setInstallment(event.target.value ? +event.target.value : '');
	};

	const handleChangeTotalInstallments = (event) => {
		setTotalInstallments(event.target.value ? +event.target.value : '');
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const payload = {id, description, value, installment, totalInstallments, installmentCategoryId };
	
		onSubmit(payload);
		setDescription('');
		setValue('');
		setInstallment('');
		setTotalInstallments('');
		onRequestClose();
	};

	const afterOpenModal = async () => {
		if (id) {
			const tr = await axios.get(`${base_url}/installments/${id}`, {
				headers: {
					Authorization: token
				}
			});
			const json = tr.data;
			setDescription(json.description);
			setValue(json.value);
			setInstallment(json.installment);
			setTotalInstallments(json.totalInstallments);
		} else {
			setDescription('');
			setValue('');
			setInstallment('');
			setTotalInstallments('');
		}
	};

	const afterCloseModal = () => {
		setDescription('');
		setValue('');
		setInstallment('');
		setTotalInstallments('');
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

						<div className="input-field">
							<input
								type="number"
								id="inputValue"
								min="0"
								step="0.01"
								value={value}
								required
								onChange={handleChangeValue}
							/>
							<label htmlFor="inputValue" className="active">
								Valor da parcela*:
							</label>
						</div>

						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<div style={{ marginRight: '10px', width: '100%' }} className="input-field">
								<input
									type="number"
									id="inputInstallment"
									min="1"
									max="500"
									step="1"
									value={installment}
									onChange={handleChangeInstallment}
								/>
								<label htmlFor="inputInstallment" className="active">
									Parcela*:
								</label>
							</div>

							<div style={{ marginRight: '10px', width: '100%' }} className="input-field">
								<input
									type="number"
									id="inputTotalInstallments"
									min="2"
									max="500"
									step="1"
									value={totalInstallments}
									onChange={handleChangeTotalInstallments}
								/>
								<label htmlFor="inputTotalInstallments" className="active">
									Total de parcelas*:
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
