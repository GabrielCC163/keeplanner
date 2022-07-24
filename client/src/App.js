import React, { useState, useEffect } from 'react';
import ModalReact from './components/ModalReact';

import { base_url } from './config';

import PeriodFilter from './components/PeriodFilter';
import Resume from './components/Resume';
import Button from './components/Button';
import Transactions from './components/Transactions';

import moment from 'moment';
import 'moment/locale/pt-br';
import axios from 'axios';
import Loading from './tools/Loading';
import Installments from './components/Installments';

const currPeriod = moment().format('YYYY-MM');
const currYear = parseInt(moment().format('YYYY'));

const calcResume = (records) => {
	let totalSavingsValue = 0;
	let totalInstallmentsValue = 0;
	let totalAvailableMonthValue = 0;
	let totalIncomeValue = 0;
	let totalExpenseValue = 0;
	let balanceValue = 0;

	if (records?.savings) {
		totalSavingsValue = records.savings.reduce((acc, item) => {
			return item.totalValue + acc;
		}, 0);
		balanceValue = totalSavingsValue;
	}
	if (records?.installments) {
		totalInstallmentsValue = records.installments.reduce((acc, item) => {
			return item.totalValue + acc;
		}, 0);
	}

	if (records?.incomes) {
		totalIncomeValue = records.incomes.reduce((acc, item) => {
			return item.totalValue + acc;
		}, 0);
		totalAvailableMonthValue = totalIncomeValue;
	}

	if (records?.expenses) {
		totalExpenseValue = records.expenses.reduce((acc, item) => {
			return item.totalValue + acc;
		}, 0);
		totalAvailableMonthValue -= totalExpenseValue;
	}

	balanceValue += totalAvailableMonthValue;

	return { balanceValue, totalSavingsValue, totalInstallmentsValue, totalAvailableMonthValue, totalIncomeValue, totalExpenseValue };
};

export default function App() {
	const [ period, setPeriod ] = useState(currPeriod);
	const [ disabledPrev, setDisabledPrev ] = useState(false);
	const [ disabledNext, setDisabledNext ] = useState(false);
	const [ enableInsert, setEnableInsert ] = useState(true);
	
	const [ balance, setBalance ] = useState(0);
	const [ totalSaving, setTotalSaving ] = useState(0);
	const [ totalIncome, setTotalIncome ] = useState(0);
	const [ totalExpense, setTotalExpense ] = useState(0);
	const [ totalInstallment, setTotalInstallment ] = useState(0);
	const [ totalAvailableMonth, setTotalAvailableMonth ] = useState(0);

	const [ savings, setSavings ] = useState([]);
	const [ incomes, setIncomes ] = useState([]);
	const [ expenses, setExpenses ] = useState([]);
	const [ installmentCategories, setInstallmentCategories ] = useState([]);
	const [ isLoaded, setIsLoaded ] = useState(false);
	const [ modalIsOpen, setIsOpen ] = useState(false);
	const [ submited, setSubmited ] = useState(false);

	// const openModal = () => {
	// 	setIsOpen(true);
	// };

	// const closeModal = () => {
	// 	setIsOpen(false);
	// };

	useEffect(
		() => {
			setIsLoaded(false);
			setEnableInsert(false);
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

	const createControlRecord = async () => {
		const year = period.split('-')[0];
		const month = period.split('-')[1];
		const userId = '28dcd9e9-4606-46b5-bd7b-428338b370d7';

		await axios.post(`${base_url}/control-records`, {
			year,
			month,
			userId
		}, {
			headers: {
				Authorization:	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGRjZDllOS00NjA2LTQ2YjUtYmQ3Yi00MjgzMzhiMzcwZDciLCJlbWFpbCI6ImdhYnJpZWxAZ21haWwuY29tIiwiaWF0IjoxNjU4NjgyMDg4LCJleHAiOjE2NTg3Njg0ODh9.BAxmZcaKUPWgLTQEZV7z5NatvIFtAqOqhVLQK_l-IDs'
			}
		});

		setEnableInsert(false);
	}

	const fetchData = async () => {
		const year = period.split('-')[0];
		const month = period.split('-')[1];

		try {
			const result = await axios.get(`${base_url}/control-records?month=${month}&year=${year}`, {
				headers: {
					Authorization:	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGRjZDllOS00NjA2LTQ2YjUtYmQ3Yi00MjgzMzhiMzcwZDciLCJlbWFpbCI6ImdhYnJpZWxAZ21haWwuY29tIiwiaWF0IjoxNjU4NjgyMDg4LCJleHAiOjE2NTg3Njg0ODh9.BAxmZcaKUPWgLTQEZV7z5NatvIFtAqOqhVLQK_l-IDs'
				}
			});
			setEnableInsert(false);
			let json = result.data;

			const { balanceValue, totalInstallmentsValue, totalSavingsValue, totalAvailableMonthValue, totalIncomeValue, totalExpenseValue } = calcResume(json);
			setBalance(balanceValue);

			setTotalSaving(totalSavingsValue);
			setTotalInstallment(totalInstallmentsValue);
			setTotalAvailableMonth(totalAvailableMonthValue);
			
			setSavings(json.savings);
			
			setExpenses(json.expenses);
			setTotalExpense(totalExpenseValue);
			
			setIncomes(json.incomes);
			setTotalIncome(totalIncomeValue);
			
			setInstallmentCategories(json.installmentCategories);
			setIsLoaded(true);
		} catch (err) {
			setEnableInsert(true);

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
			newPeriod = moment(`${period}-01`).add(-1, 'months').format('YYYY-MM');
			setDisabledNext(false);
		} else {
			newPeriod = moment(`${period}-01`).add(1, 'months').format('YYYY-MM');
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

			<Resume balance={balance} totalInstallment={totalInstallment} totalAvailableMonth={totalAvailableMonth} />
			
			{enableInsert && (
				<div className="actions">
					<Button text={`Iniciar cadastro de registros para ${moment(`${period}-01`).format('MMMM/YYYY')}`} handleClick={createControlRecord} />
					{/* <ModalReact isOpen={modalIsOpen} onRequestClose={closeModal} edicao={false} onSubmit={handleSubmit} /> */}
				</div>
			)}

			{!enableInsert && !isLoaded && (
				<div className="loading">
					<Loading type="spinningBubbles" color="#26a69a" />
				</div>
			)}	
			
			{!enableInsert && isLoaded && (
				<>
					<Transactions 
						savings={savings}
						totalSaving={totalSaving}
						incomes={incomes} 
						totalIncome={totalIncome} 
						expenses={expenses}
						totalExpense={totalExpense}
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
