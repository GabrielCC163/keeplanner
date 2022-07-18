import React, { useState, useEffect } from 'react';
import ModalReact from './components/ModalReact';

import { base_url } from './config';

import PeriodFilter from './components/PeriodFilter';
import Resume from './components/Resume';
import Button from './components/Button';
import Transactions from './components/Transactions';

import moment from 'moment';
import axios from 'axios';
import Loading from './tools/Loading';

const currPeriod = moment().lang('pt-br').format('YYYY-MM');
const currYear = parseInt(moment().format('YYYY'));

const calcResume = (records) => {
	const incomeValue = records.filter(({ type }) => type === '+').reduce((acc, item) => {
		return item.value + acc;
	}, 0);
	const expenseValue = records.filter(({ type }) => type === '-').reduce((acc, item) => {
		return item.value + acc;
	}, 0);

	return { incomeValue, expenseValue };
};

export default function App() {
	const [ period, setPeriod ] = useState(currPeriod);
	const [ disabledPrev, setDisabledPrev ] = useState(false);
	const [ disabledNext, setDisabledNext ] = useState(false);
	const [ savings, setSavings ] = useState([]);
	const [ incomes, setIncomes ] = useState([]);
	const [ expenses, setExpenses ] = useState([]);
	const [ isLoaded, setIsLoaded ] = useState(false);
	const [ modalIsOpen, setIsOpen ] = useState(false);
	const [ submited, setSubmited ] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	useEffect(
		() => {
			setIsLoaded(false);
			fetchData();
		},
		[ period, submited ]
	);

	const handleSubmit = async (data) => {
		const { id, accountName, totalValue } = data;
		if (!id) {
			await axios.post(`${base_url}/savings`, {
				accountName,
				totalValue: parseFloat(totalValue),
			});
		} else {
			await axios.put(`${base_url}/savings/${id}`, {
				accountName,
				totalValue: parseFloat(totalValue),
			});
		}
		setIsOpen(false);
		setSubmited(submited ? false : true);
	};

	const handleDelete = async (id) => {
		await axios.delete(`${base_url}/savings/${id}`);
		setSubmited(submited ? false : true);
	};

	const fetchData = async () => {
		const year = period.split('-')[0];
		const month = period.split('-')[1];
		try {
			const result = await axios.get(`${base_url}/control-records?month=${month}&year=${year}`, {
				headers: {
					Authorization:	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NWQ0YTFmYS0yMzM5LTQzNTMtYWY4MS1kOGVkZDQ1MTgyYjciLCJlbWFpbCI6ImdhYnJpZWxAZ21haWwuY29tIiwiaWF0IjoxNjU4MTcxODA5LCJleHAiOjE2NTgyNTgyMDl9.73HpifPlF-OYPBO9Oigy-7-ModVBHsBxmzg4hV-3hlk'
				}
			});
			let json = result.data;

			setSavings(json.savings);
			setExpenses(json.expenses);
			setIncomes(json.incomes);
			setIsLoaded(true);
		} catch (err) {
			setSavings([]);
			setExpenses([]);
			setIncomes([]);
			setIsLoaded(true);
			console.log(err);
		}
	};

	const handleChangePeriod = (event = null, value = null) => {
		const selectedPeriod = value ? value : event.target.value;

		setPeriod(selectedPeriod);

		if (`${selectedPeriod}-01` === `${parseInt(currYear) - 1}-01-01`) {
			setDisabledPrev(true);
		}
		if (`${selectedPeriod}-01` === `${parseInt(currYear) + 1}-12-01`) {
			setDisabledNext(true);
		}
	};

	const handleClickFilter = (action) => {
		let newPeriod = '';

		if (action === 'prev') {
			newPeriod = moment(`${period}-01`).add(-1, 'months').lang('pt-br').format('YYYY-MM');
			setDisabledNext(false);
		} else {
			newPeriod = moment(`${period}-01`).add(1, 'months').lang('pt-br').format('YYYY-MM');
			setDisabledPrev(false);
		}

		handleChangePeriod(null, newPeriod);
	};

	return (
		<div className="container">
			<div className="center">
				<h1>Keeplanner</h1>
			</div>

			<PeriodFilter
				handleChange={handleChangePeriod}
				value={period}
				handleClick={handleClickFilter}
				disabledNext={disabledNext}
				disabledPrev={disabledPrev}
			/>

			<Resume transactions={expenses.length} />
			
			<div className="actions">
				<Button text={'+ Novo Lançamento'} handleClick={openModal} />
				<ModalReact isOpen={modalIsOpen} onRequestClose={closeModal} edicao={false} onSubmit={handleSubmit} />
			</div>

			{!isLoaded ? (
				<div className="loading">
					<Loading type="spinningBubbles" color="#26a69a" />
				</div>
			) : (
				<Transactions savings={savings} incomes={incomes} expenses={expenses} onSubmit={handleSubmit} onDelete={handleDelete} />
			)}
		</div>
	);
}
