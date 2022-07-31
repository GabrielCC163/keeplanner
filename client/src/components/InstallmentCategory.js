import React, { useState } from 'react';
import InstallmentCategoryModal from './InstallmentCategoryModal';

export default function InstallmentCategory({ id, token, description, dueDay, dueMonth, installments, index, onSubmit, onDelete }) {
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
						<div>
							<span className="transaction__info-description">Vencimento: </span>
							{dueDay && (<span className="transaction__info-description">{dueDay} de {dueMonth}</span>)}
							{!dueDay && (<span className="transaction__info-description">{dueMonth}</span>)}
						</div>
					</div>
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
			<InstallmentCategoryModal token={token} isOpen={modalIsOpen} onRequestClose={closeModal} id={id} onSubmit={onSubmit} />
		</li>
	);
}
