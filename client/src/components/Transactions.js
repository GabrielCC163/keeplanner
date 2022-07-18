import React from 'react';
import Income from './Income';
import Saving from './Saving';
import Expense from './Expense';

export default function Transactions({ incomes, expenses, handleEdition, handleDelete, onSubmit, onDelete }) {
	return (
		<div className="section_transactions">
			<ul>
				<h3>Valores em poupanças</h3>
				{incomes.map(({ id, day, type, category, description, value }, index) => {
					return (
						<Saving
							key={id}
							id={id}
							day={day}
							type={type}
							category={category}
							description={description}
							value={value}
							handleEdition={handleEdition}
							handleDelete={handleDelete}
							onSubmit={onSubmit}
							onDelete={onDelete}
						/>
					);
				})}

				<h3>Receitas</h3>
				{incomes.map(({ id, day, type, category, description, value }, index) => {
					return (
						<Income
							key={id}
							id={id}
							day={day}
							type={type}
							category={category}
							description={description}
							value={value}
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
				{expenses.map(({ id, day, type, category, description, value }, index) => {
					return (
						<Expense
							key={id}
							id={id}
							day={day}
							type={type}
							category={category}
							description={description}
							value={value}
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
