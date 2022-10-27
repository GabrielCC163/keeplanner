import React, { useState } from 'react';
import ExpenseModal from './ExpenseModal';
import moment from 'moment';
import 'moment/locale/pt-br';
import capitalize from '../utils/capitalize';
import Switch from "react-switch";
import { getMonthRef } from '../utils/months';

export default function Expense({ id, token, description, totalValue, dueDay, dueMonth, status, period, index, onSubmit, onDelete, handleExpenseStatusChange }) {
	const [ modalIsOpen, setIsOpen ] = useState(false);

	dueMonth = capitalize(moment(`2022-${dueMonth}-01`).format('MMMM'));

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
		<li key={id} style={{ background: '#f1a1a8' }}>
			<div className="transaction">
				<div className="transaction__info">
					<div className="transaction__info-group">
						<span className="transaction__info-category">{description}</span>
						<div>
							<span className="transaction__info-description">Vence: </span>
							{dueDay && (<span className="transaction__info-description">{dueDay} de {getMonthRef(dueMonth)}</span>)}
							{!dueDay && (<span className="transaction__info-description">{getMonthRef(dueMonth)}</span>)}
							<span className="transaction__info-description">{status === 'PA' ? ' | Pago' : ''}</span>
						</div>
					</div>
					<span className="transaction__info-value">
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
					</span>
				</div>
				<div className="transaction__actions">
					<Switch height={24} id='normal-switch' onChange={() => handleExpenseStatusChange(id, status === 'PA' ? 'AP' : 'PA')} checked={status === 'PA' ? true : false} />
					<span style={{marginLeft: '10px'}} className="material-icons" onClick={() => openModal()}>
						edit
					</span>
					<span className="material-icons" onClick={() => handleDelete(id)}>
						delete
					</span>
				</div>
			</div>
			<ExpenseModal token={token} isOpen={modalIsOpen} period={period} onRequestClose={closeModal} id={id} onSubmit={onSubmit} />
		</li>
	);
}
