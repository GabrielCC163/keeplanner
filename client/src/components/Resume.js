import React from 'react';

export default function Resume({ totalSaving, totalInstallment, totalAvailableMonth }) {
	return (
		<div className="resume">
			<span className='resume__item'>
				<strong>Valor poupado:{' '}
					<span style={{ color: '#16a085', fontWeight: 'bold' }}>
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSaving)}
					</span>
				</strong>
			</span>

			<span className='resume__item'>
				<strong>
					Total disponível para o mês:{' '}
					<span style={{ color: '#0645b7', fontWeight: 'bold' }}>
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAvailableMonth)}
					</span>
				</strong>
			</span>

			<span className='resume__item'>
				<strong>
					Valor total em parcelas:{' '}
					<span style={{ color: '#f1a1a8', fontWeight: 'bold' }}>
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInstallment)}
					</span>
				</strong>
			</span>
		</div>
	);
}
