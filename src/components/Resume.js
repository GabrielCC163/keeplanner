import React from 'react';

export default function Resume({ balance, totalInstallment, totalAvailableMonth }) {
	return (
		<div className="resume">
			<span className='resume__item resume_balance'>
				<div className='resume_balance_tooltip'>
					<span className='balance_tooltip'>&#xFE56;</span>
					<span className='balance_tooltip_text'>poupanças + receitas - despesas pagas</span>
				</div>
				<strong>Saldo:{' '}
					<span style={{ color: '#16a085', fontWeight: 'bold' }}>
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
					</span>
				</strong>
			</span>

			<span className='resume__item resume_available'>
				<div className='resume_available_tooltip'>
					<span className='available_tooltip'>&#xFE56;</span>
					<span className='available_tooltip_text'>receitas - despesas</span>
				</div>
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
