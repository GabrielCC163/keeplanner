import React from 'react';
import Income from './Income';
import Saving from './Saving';
import Expense from './Expense';
import InstallmentCategory from './InstallmentCategory';

export default function Transactions({ 
	token,

	savings, 
	totalSaving, 
	incomes, 
	totalIncome, 
	expenses, 
	totalExpense,

	installmentCategories,

	openSavingModal, 
	onSavingSubmit,
	onSavingDelete, 
	
	openIncomeModal,
	onIncomeSubmit,
	onIncomeDelete,

	openExpenseModal,
	onExpenseSubmit,
	onExpenseDelete,

	openInstallmentCategoryModal,
	onInstallmentCategorySubmit,
	onInstallmentCategoryDelete,
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
							token={token}
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
							token={token}
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
							token={token}
							description={description}
							totalValue={totalValue}
							dueDay={dueDay}
							dueMonth={dueMonth}
							status={status}
							onSubmit={onExpenseSubmit}
							onDelete={onExpenseDelete}
						/>
					);
				})}
				<div className='plus radius' onClick={openExpenseModal}></div>
			</ul>

			<ul>
				<div className='installments_title'>
					<span>Parcelas</span>
				</div>

				{installmentCategories.map(({ id, description, dueDay, dueMonth, installments }, index) => {
					return (
						<InstallmentCategory
							key={id}
							id={id}
							token={token}
							description={description}
							dueDay={dueDay}
							dueMonth={dueMonth}
							installments={installments}
							onSubmit={onInstallmentCategorySubmit}
							onDelete={onInstallmentCategoryDelete}
						/>
					);
				})}
				<div className='plus radius' onClick={openInstallmentCategoryModal}></div>
			</ul>
		</div>
	);
}
