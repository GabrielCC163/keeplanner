import React from 'react';
import Income from './Income';
import Expense from './Expense';
import InstallmentCategory from './InstallmentCategory';
import Installment from './Installment';
import Saving from './Savings/Saving';
import capitalize from '../utils/capitalize';
import moment from 'moment';

export default function Transactions({ 
	token,
	currInstallmentPeriod,

	savings, 
	totalSaving, 
	incomes, 
	totalIncome, 
	expenses, 
	totalExpense,

	installmentCategories,
	installments,

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

	getNextMonthsInstallments,
	getPrevMonthsInstallments,
	enableInstNext,
	enableInstPrev,
	onInstallmentSubmit,
	onInstallmentDelete,
}) {
	return (
		<>
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
					<div className='plus radius saving' onClick={openSavingModal}></div>

					<hr className='hr__styled' />

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
					<div className='plus radius income' onClick={openIncomeModal}></div>
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
					<div className='plus radius expense' onClick={openExpenseModal}></div>
				</ul>
			</div>

			<hr className='hr__styled' />

			<div>
				<ul>
					<div className='installments_title'>
						<span style={{marginBottom: '10px'}}>Parcelas</span>
					</div>
					{installments?.length > 0 && (
						<div className="installments-month-selector">
							{<button id={`inst-btn-prev-${enableInstPrev ? 'enabled' : 'disabled'}`} onClick={enableInstPrev ? getPrevMonthsInstallments : () => {return}} className="waves-effect waves-light btn">
								&lt;
							</button>}

							{<span className='installments-month-selected'>{capitalize(moment(currInstallmentPeriod).format('MMMM/YYYY'))}</span>}

							{<button id={`inst-btn-next-${enableInstNext ? 'enabled' : 'disabled'}`} onClick={enableInstNext ? getNextMonthsInstallments : () => {return}} className="waves-effect waves-light btn">
								&gt;
							</button>}
						</div>
					)}
					{installmentCategories.map(({ id: categoryId, description, dueDay, dueMonth }, index) => {
						return (
							<>
								<InstallmentCategory
									key={categoryId}
									id={categoryId}
									token={token}
									description={description}
									dueDay={dueDay}
									dueMonth={dueMonth}

									enableInsert={!enableInstPrev}
									
									onSubmit={onInstallmentCategorySubmit}
									onDelete={onInstallmentCategoryDelete}

									onInstallmentSubmit={onInstallmentSubmit}
								/>
								<ul className='installments-group'>
									{installments.filter(i => i.installmentCategoryId === categoryId && i.installment >= 1 && i.installment <= i.totalInstallments).map(({id, description, value, installment, totalInstallments }, index) => {
										return (
											<Installment 
												key={id}
												id={id}
												token={token}
												description={description}
												value={value}
												installment={installment}
												totalInstallments={totalInstallments}

												enableInsert={!enableInstPrev}
												
												onSubmit={onInstallmentSubmit}
												onDelete={onInstallmentDelete}
											/>
											)
									})}
								</ul>
							</>
						);	
					})}
					<div className='plus radius installment_category' onClick={openInstallmentCategoryModal}></div>
				</ul>
			</div>
		</>
	);
}
