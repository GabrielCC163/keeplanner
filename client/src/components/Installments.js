import React from 'react';
import InstallmentCategory from './InstallmentCategory';

export default function Installments({ installmentCategories }) {
	return (
        <div className="installment_categories">
            <ul>
                {installmentCategories.map(({ id, description, dueDay, dueMonth }, index) => {
					return (
						<InstallmentCategory
							key={id}
							id={id}
							description={description}
							dueDay={dueDay}
                            dueMonth={dueMonth}
						/>
					);
				})}
            </ul>
        </div>
    )
}