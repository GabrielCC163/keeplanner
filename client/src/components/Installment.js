import React, { useState } from 'react';
import InstallmentModal from './InstallmentModal';

export default function Installment({ 
	id, 
	token, 
	description, 
	value,
	installment,
	totalInstallments,
	index, 
	onSubmit, 
	onDelete
}) {
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
		<>
			<li style={{ background: '#FFFF', width: '90%' }}>
				<div className="transaction">
					<div className="transaction__info">
						<span className="transaction__info-category">{description}</span>
						<span className="transaction__info-value">{installment} de {totalInstallments}</span>
						<span className="transaction__info-value">
							{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
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
				<InstallmentModal token={token} isOpen={modalIsOpen} onRequestClose={closeModal} id={id} onSubmit={onSubmit} />
			</li>	
		</>
	);
}
