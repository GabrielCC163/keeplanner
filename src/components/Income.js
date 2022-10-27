import React, { useState } from 'react';
import capitalize from '../utils/capitalize';
import IncomeModal from './IncomeModal';
import moment from 'moment';
import 'moment/locale/pt-br';
import { getMonthRef } from '../utils/months';

export default function Income({ id, token, accountName, totalValue, dayOfReceipt, month, fixed, status, period, index, onSubmit, onDelete }) {
	const [ modalIsOpen, setIsOpen ] = useState(false);

	month = month ? capitalize(moment(`2022-${month}-01`).format('MMMM')) : null;

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
		<li key={id} style={{ background: '#58ebc6' }}>
			<div className="transaction">
				<div className="transaction__info">
					<div className="transaction__info-group">
						<span className="transaction__info-category">{accountName}</span>
						<div>
							{(dayOfReceipt && !month) && (<span className="transaction__info-description">Dia: {dayOfReceipt}</span>)}
							{(dayOfReceipt && month) && (<span className="transaction__info-description">{dayOfReceipt} de {getMonthRef(month)}</span>)}
							{fixed && dayOfReceipt && (<span className="transaction__info-description"> | Fixo</span>)}
							{fixed && !dayOfReceipt && (<span className="transaction__info-description">Fixo</span>)}
						</div>
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
			<IncomeModal token={token} isOpen={modalIsOpen} period={period} onRequestClose={closeModal} id={id} onSubmit={onSubmit} />
		</li>
	);
}
