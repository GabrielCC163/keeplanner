import React, { useState } from 'react';
import InstallmentCategoryModal from './InstallmentCategoryModal';
import moment from 'moment';
import 'moment/locale/pt-br';
import capitalize from '../utils/capitalize';
import InstallmentModal from './InstallmentModal';


export default function InstallmentCategory({ 
	id, 
	token, 
	description, 
	dueDay, 
	dueMonth, 
	
	enableInsert,

	index, 
	onSubmit, 
	onDelete,

	onInstallmentSubmit
}) {
	const [ modalIsOpen, setIsOpen ] = useState(false);
	const [ installmentModalIsOpen, setInstallmentModalIsOpen ] = useState(false);
	dueMonth = capitalize(moment(`2022-${dueMonth}-01`).format('MMMM'));

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	const openInstallmentModal = () => {
		setInstallmentModalIsOpen(true);
	};

	const closeInstallmentModal = () => {
		setInstallmentModalIsOpen(false);
	};

	const handleDelete = (id) => {
		onDelete(id);
	};

	return (
		<>
			<li key={id} style={{ background: '#ffbe87' }}>
				<div style={{height: '35px'}} className="transaction">
					<span className="transaction__info-category">{description}</span>
					{dueDay && (<span style={{textAlign: 'center'}} className="transaction__info-description">Vencimento: {dueDay} de {dueMonth}</span>)}
					{!dueDay && (<span style={{textAlign: 'center'}} className="transaction__info-description">Vencimento: {dueMonth}</span>)}
					{enableInsert ? <div className="transaction__actions">
						<button onClick={openInstallmentModal}>Adicionar Parcela</button>
						<span className="material-icons" onClick={() => openModal()}>
							edit
						</span>
						<span className="material-icons" onClick={() => handleDelete(id)}>
							delete
						</span>
					</div> : <div className="transaction__actions"></div>}
				</div>
				<InstallmentCategoryModal token={token} isOpen={modalIsOpen} onRequestClose={closeModal} id={id} onSubmit={onSubmit} />
				<InstallmentModal token={token} isOpen={installmentModalIsOpen} onRequestClose={closeInstallmentModal} installmentCategoryId={id} onSubmit={onInstallmentSubmit} />
			</li>	
		</>
	);
}
