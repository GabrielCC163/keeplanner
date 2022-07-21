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
import Installments from './components/Installments';

const currPeriod = moment().lang('pt-br').format('YYYY-MM');
const currYear = parseInt(moment().format('YYYY'));

const calcResume = (records) => {
	let totalSavingsValue = 0;
	let totalInstallmentsValue = 0;
	let totalAvailableMonthValue = 0;
	if (records?.savings) {
		totalSavingsValue = records.savings.reduce((acc, item) => {
			return item.totalValue + acc;
		}, 0);
	}
	if (records?.installments) {
		totalInstallmentsValue = records.installments.reduce((acc, item) => {
			return item.totalValue + acc;
		}, 0);
	}

	if (records?.incomes) {
		totalAvailableMonthValue = records.incomes.reduce((acc, item) => {
			return item.totalValue + acc;
		}, 0);

		if (records?.expenses) {
			const totalExpenses = records.expenses.reduce((acc, item) => {
				return item.totalValue + acc;
			}, 0);
			totalAvailableMonthValue -= totalExpenses;
		}
	}

	return { totalSavingsValue, totalInstallmentsValue, totalAvailableMonthValue };
};

export default function App() {
	const [ period, setPeriod ] = useState(currPeriod);
	const [ disabledPrev, setDisabledPrev ] = useState(false);
	const [ disabledNext, setDisabledNext ] = useState(false);
	
	const [ totalSaving, setTotalSaving ] = useState(0);
	const [ totalInstallment, setTotalInstallment ] = useState(0);
	const [ totalAvailableMonth, setTotalAvailableMonth ] = useState(0);

	const [ savings, setSavings ] = useState([]);
	const [ incomes, setIncomes ] = useState([]);
	const [ expenses, setExpenses ] = useState([]);
	const [ installmentCategories, setInstallmentCategories ] = useState([]);
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
					Authorization:	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYTFmZDdiMS05NmM1LTRiMjUtYmNkNi1mMjRjMzdkYWYzODIiLCJlbWFpbCI6ImdhYnJpZWxAZ21haWwuY29tIiwiaWF0IjoxNjU4MzU0NzU3LCJleHAiOjE2NTg0NDExNTd9.w_MGBrY9PS00PTXMmbhtir4OHE6ZQBF4qBl_p503S_0'
				}
			});
			let json = result.data;

			const {totalInstallmentsValue, totalSavingsValue, totalAvailableMonthValue} = calcResume(json);
			setTotalSaving(totalSavingsValue);
			setTotalInstallment(totalInstallmentsValue)
			setTotalAvailableMonth(totalAvailableMonthValue);
			setSavings(json.savings);
			setExpenses(json.expenses);
			setIncomes(json.incomes);
			setInstallmentCategories(json.installmentCategories);
			setIsLoaded(true);
		} catch (err) {
			setSavings([]);
			setExpenses([]);
			setIncomes([]);
			setIsLoaded(true);
			setTotalSaving(0);
			setTotalInstallment(0);
			setInstallmentCategories([]);
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

			<Resume totalSaving={totalSaving} totalInstallment={totalInstallment} totalAvailableMonth={totalAvailableMonth} />
			
			<div className="actions">
				<Button text={'+ Novo Lançamento'} handleClick={openModal} />
				<ModalReact isOpen={modalIsOpen} onRequestClose={closeModal} edicao={false} onSubmit={handleSubmit} />
			</div>

			{!isLoaded ? (
				<div className="loading">
					<Loading type="spinningBubbles" color="#26a69a" />
				</div>
			) : (
				<>
					<Transactions 
						savings={savings} 
						incomes={incomes} 
						expenses={expenses} 
						installmentCategories={installmentCategories} 
						onSubmit={handleSubmit} 
						onDelete={handleDelete} 
					/>
					<Installments installmentCategories={installmentCategories} />
				</>
			)}
		</div>
	);
}
