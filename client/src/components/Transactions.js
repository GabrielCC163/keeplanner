import React from 'react';
import Income from './Income';
import Transaction from './Transaction';

export default function Transactions({ incomes, expenses, handleEdition, handleDelete, onSubmit, onDelete }) {
	return (
		<div className="section_transactions">
			<ul>
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
				{expenses.map(({ id, day, type, category, description, value }, index) => {
					return (
						<Transaction
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
