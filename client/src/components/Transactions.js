import React from 'react';
import Income from './Income';
import Saving from './Saving';
import Expense from './Expense';

export default function Transactions({ savings, incomes, expenses, handleEdition, handleDelete, onSubmit, onDelete }) {
	return (
		<div className="section_transactions">
			<ul>
				<h3>Valores em poupanças</h3>
				{savings.map(({ id, accountName, totalValue }, index) => {
					return (
						<Saving
							key={id}
							id={id}
							accountName={accountName}
							totalValue={totalValue}
							handleEdition={handleEdition}
							handleDelete={handleDelete}
							onSubmit={onSubmit}
							onDelete={onDelete}
						/>
					);
				})}

				<h3>Receitas</h3>
				{incomes.map(({ id, accountName, totalValue, dayOfReceipt, fixed }, index) => {
					return (
						<Income
							key={id}
							id={id}
							accountName={accountName}
							totalValue={totalValue}
							dayOfReceipt={dayOfReceipt}
							fixed={fixed}
							handleEdition={handleEdition}
							handleDelete={handleDelete}
							onSubmit={onSubmit}
							onDelete={onDelete}
						/>
					);
				})}
			</ul>
			<ul>
				<h3 style={{textAlign: 'right'}}>Despesas</h3>
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
							handleEdition={handleEdition}
							handleDelete={handleDelete}
							onSubmit={onSubmit}
							onDelete={onDelete}
						/>
					);
				})}
			</ul>
		</div>
	);
}
