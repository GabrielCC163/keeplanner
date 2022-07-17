import React, { useState } from 'react';
import ModalReact from './ModalReact';

export default function Transaction({ id, day, type, category, description, value, index, onSubmit, onDelete }) {
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
		<li style={{ background: type === '+' ? '#a1f0dc' : '#f1a1a8' }}>
			<div className="transaction">
				<span className="transaction__day">{day < 10 ? `0${day}` : day}</span>
				<div className="transaction__info">
					<div className="transaction__info-group">
						<span className="transaction__info-category">{category}</span>
						<span className="transaction__info-description">{description}</span>
					</div>
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
			<ModalReact isOpen={modalIsOpen} onRequestClose={closeModal} id={id} onSubmit={onSubmit} />
		</li>
	);
}
