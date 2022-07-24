import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

const currYear = parseInt(moment().format('YYYY'));
//const currPeriod = moment().lang('pt-br').format('YYYY-MM');
const years = [ currYear - 1, currYear, currYear + 1 ];

const options = [];
years.forEach((year) => {
	let i = 1;
	while (i <= 12) {
		const monthNum = i < 10 ? `0${i}` : i;
		const month = moment(`${year}-${monthNum}-01`).format('MMMM');
		options.push({ value: `${year}-${monthNum}`, label: `${month}/${year}` });
		i++;
	}
});

export default function PeriodFilter({ value, handleChange, handleClick, disabledPrev, disabledNext }) {
	return (
		<div className="center period-filter">
			<button
				className="waves-effect waves-light btn"
				onClick={() => handleClick('prev')}
				disabled={disabledPrev}
			>
				&lt;
			</button>
			<select className="browser-default" onChange={handleChange} value={value}>
				{options.map((option, index) => {
					return (
						<option key={index} value={option.value}>
							{option.label}
						</option>
					);
				})}
			</select>
			<button
				className="waves-effect waves-light btn"
				onClick={() => handleClick('next')}
				disabled={disabledNext}
			>
				&gt;
			</button>
		</div>
	);
}
