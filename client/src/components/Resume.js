import React from 'react';

export default function Resume({ transactions, income, expense, balance }) {
	return (
		<div className="resume">
			<span>
				<strong>Lançamentos:</strong> {transactions}
			</span>
			<span>
				<strong>
					Receita:{' '}
					<span style={{ color: '#16a085', fontWeight: 'bold' }}>
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income)}
					</span>
				</strong>
			</span>
			<span>
				<strong>
					Despesas:{' '}
					<span style={{ color: '#c0392b', fontWeight: 'bold' }}>
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense)}
					</span>
				</strong>
			</span>
			<span>
				<strong>
					Saldo:
					<span style={{ color: balance < 0 ? '#c0392b' : '#16a085', fontWeight: 'bold' }}>
						{' '}
						{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
					</span>
				</strong>
			</span>
		</div>
	);
}
