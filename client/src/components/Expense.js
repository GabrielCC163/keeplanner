import React, { useState } from 'react';
import ModalReact from './SavingModal';

export default function Expense({ id, description, totalValue, dueDay, dueMonth, status, index, onSubmit, onDelete }) {
	const [ modalIsOpen, setIsOpen ] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	const handleDelete = (id) => {
		onDelete(id);
	};

	return (
		<li style={{ background: '#f1a1a8' }}>
			<div className="transaction">
				<div className="transaction__info">
					<div className="transaction__info-group">
						<span className="transaction__info-category">{description}</span>
						<span className="transaction__info-description">{dueDay} {dueMonth} - {status}</span>
					</div>
					<span className="transaction__info-value">
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
					</span>
				</div>
				<div className="transaction__actions">
					<span className="material-icons" onClick={() => openModal()}>
						edit
					</span>
					<span className="material-icons" onClick={() => handleDelete(id)}>
						delete
					</span>
				</div>
			</div>
			<ModalReact isOpen={modalIsOpen} onRequestClose={closeModal} id={id} onSubmit={onSubmit} />
		</li>
	);
}
