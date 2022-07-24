import React from 'react';
import Income from './Income';
import Saving from './Saving';
import Expense from './Expense';

export default function Transactions({ 
	savings, 
	totalSaving, 
	incomes, 
	totalIncome, 
	expenses, 
	totalExpense,

	openSavingModal, 
	onSavingSubmit,
	onSavingDelete, 
	
	openIncomeModal,
	onIncomeSubmit,
	onIncomeDelete
}) {
	return (
		<div className="section_transactions">
			<ul>
				<div className='expenses_title'>
					<span>Poupanças</span>
					<span style={{textAlign: 'rigth'}}>Total:{' '}
					{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSaving)}
					</span>
				</div>
				{savings.map(({ id, accountName, totalValue }, index) => {
					return (
						<Saving
							key={id}
							id={id}
							accountName={accountName}
							totalValue={totalValue}
							onSubmit={onSavingSubmit}
							onDelete={onSavingDelete}
						/>
					);
				})}
				<div className='plus radius' onClick={openSavingModal}></div>

				<hr style={{margin: '20px 0'}} />

				<div className='incomes_title'>
					<span>Receitas</span>
					<span style={{textAlign: 'rigth'}}>Total:{' '}
					{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
					</span>
				</div>
				{incomes.map(({ id, accountName, totalValue, dayOfReceipt, fixed }, index) => {
					return (
						<Income
							key={id}
							id={id}
							accountName={accountName}
							totalValue={totalValue}
							dayOfReceipt={dayOfReceipt}
							fixed={fixed}
							onSubmit={onIncomeSubmit}
							onDelete={onIncomeDelete}
						/>
					);
				})}
				<div className='plus radius' onClick={openIncomeModal}></div>
			</ul>

			<ul>
				<div className='expenses_title'>
					<span>Despesas</span>
					<span style={{textAlign: 'rigth'}}>Total:{' '}
					{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}
					</span>
				</div>
				{expenses.map(({ id, description, totalValue, dueDay, dueMonth, status }, index) => {
					return (
						<Expense
							key={id}
							id={id}
							description={description}
							totalValue={totalValue}
							dueDay={dueDay}
							dueMonth={dueMonth}
							status={status}
							onSubmit={onSavingSubmit}
							onDelete={onSavingDelete}
						/>
					);
				})}
				<div className='plus radius'></div>
			</ul>
		</div>
	);
}
