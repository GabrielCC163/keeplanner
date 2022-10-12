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
	if (enableInstPrev) {
		installmentCategories = installmentCategories.filter(cat => {
			const qtdInst = installments.filter(i => i.installmentCategoryId === cat.id && i.installment >= 1 && i.installment <= i.totalInstallments);
			return qtdInst.length > 0;
		})
	}

	if (installments?.length > 0) {
		installments = installments.filter(i => i.installment >= 1 && i.installment <= i.totalInstallments)
	}
	return (
		<>
			<div className="section_transactions">
				<ul>
					<div key={'savings'} className='savings_title'>
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
					<div key={'savings_btn'} className='plus radius saving' onClick={openSavingModal}></div>

					<hr key={'divisor_1'} className='hr__styled' />

					<div key={'incomes'} className='incomes_title'>
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
					<div key={'incomes_btn'} className='plus radius income' onClick={openIncomeModal}></div>
				</ul>

				<ul>
					<div key={'expenses'} className='expenses_title'>
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
					<div key={'expenses_btn'} className='plus radius expense' onClick={openExpenseModal}></div>
				</ul>
			</div>

			<hr key={'divisor_2'} className='hr__styled' />

			<div>
				<ul>
					<div key={'installments'} className='installments_title'>
						<span style={{marginBottom: '10px'}}>Parcelas</span>
					</div>
					{installments?.length > 0 && (
						<div key={'installments_month_selector'} className="installments-month-selector">
							{<button id={`inst-btn-prev-${enableInstPrev ? 'enabled' : 'disabled'}`} onClick={enableInstPrev ? getPrevMonthsInstallments : () => {return}} className="waves-effect waves-light btn">
								&lt;
							</button>}

							{<span className='installments-month-selected'>{capitalize(moment(currInstallmentPeriod).format('MMMM/YYYY'))}</span>}

							{<button id={`inst-btn-next-${enableInstNext ? 'enabled' : 'disabled'}`} onClick={enableInstNext ? getNextMonthsInstallments : () => {return}} className="waves-effect waves-light btn">
								&gt;
							</button>}
						</div>
					)}
					{installments?.length > 0 && enableInstPrev && <div key={'previa'} style={{textAlign: 'center', fontSize: '17px', marginBottom: '12px'}}>Prévia do valor total em parcelas:  
						{' '}
						<span style={{color: '#f1a1a8', fontWeight: 500}}>
							{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(installments.reduce((acc, item) => item.value + acc, 0))}
						</span>
					</div>}
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
									{installments.filter(i => i.installmentCategoryId === categoryId).map(({id, description, value, installment, totalInstallments }, index) => {
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
					<div key={'installment_cat_btn'} style={{marginBottom: '100px'}} className='plus radius installment_category' onClick={openInstallmentCategoryModal}></div>
				</ul>
			</div>
		</>
	);
}
