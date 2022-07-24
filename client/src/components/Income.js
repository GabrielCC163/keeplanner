import React, { useState } from 'react';
import ModalReact from './SavingModal';

export default function Income({ id, accountName, totalValue, dayOfReceipt, fixed, index, onSubmit, onDelete }) {
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
		<li style={{ background: '#a1f0dc' }}>
			<div className="transaction">
				<div className="transaction__info">
					<div className="transaction__info-group">
						<span className="transaction__info-category">{accountName}</span>
						<span className="transaction__info-description">Dia de recebimento: {dayOfReceipt} * {fixed ? 'fixa' : ''}</span>
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
