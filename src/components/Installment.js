import React, { useState } from 'react';
import InstallmentModal from './InstallmentModal';

export default function Installment({ 
	id, 
	token, 
	description, 
	value,
	installment,
	totalInstallments,

	enableInsert,
	
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
					
					<span style={{flex: 3.5}} className="transaction__info-category">{description}</span>
					<span style={{flex: 2, textAlign: 'left'}} className="transaction__info-value">{installment} de {totalInstallments}</span>
					<span className="transaction__info-value">
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
					</span>
				
					{enableInsert ? <div className="transaction__actions">
						<span className="material-icons" onClick={() => openModal()}>
							edit
						</span>
						<span className="material-icons" onClick={() => handleDelete(id)}>
							delete
						</span>
					</div> : <div className="transaction__actions"></div>}
				</div>
				<InstallmentModal token={token} isOpen={modalIsOpen} onRequestClose={closeModal} id={id} onSubmit={onSubmit} />
			</li>	
		</>
	);
}
