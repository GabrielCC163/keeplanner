/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import axios from 'axios';
import Loading from '../tools/Loading';

import { base_url } from '../config';

import IncomeModal from './IncomeModal';
import ExpenseModal from './ExpenseModal';
import InstallmentCategoryModal from './InstallmentCategoryModal';

import PeriodFilter from './PeriodFilter';
import Resume from './Resume';
import Button from './Button';
import Transactions from './Transactions';
import calcResume from '../functions/calcResume';
import SavingModal from './Savings/SavingModal';

const currPeriod = moment().format('YYYY-MM');
const currYear = parseInt(moment().format('YYYY'));

export default function ControlRecords({userToken: token}) {
	const [ period, setPeriod ] = useState(currPeriod);
	const [ disabledPrev, setDisabledPrev ] = useState(false);
	const [ disabledNext, setDisabledNext ] = useState(false);
	const [ enableInsert, setEnableInsert ] = useState(true);
	
	const [ controlRecordId, setControlRecordId ] = useState('');

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
	const [ installments, setInstallments ] = useState([]);
	
	const [ savingModalIsOpen, setSavingModalIsOpen ] = useState(false);
	const [ incomeModalIsOpen, setIncomeModalIsOpen ] = useState(false);
	const [ expenseModalIsOpen, setExpenseModalIsOpen ] = useState(false);
	const [ installmentCategoryModalIsOpen, setInstallmentCategoryModalIsOpen ] = useState(false);
	
	const [ isLoaded, setIsLoaded ] = useState(false);
	const [ submited, setSubmited ] = useState(false);

	const setData = (records) => {
		setSavings(records.savings);
		setIncomes(records.incomes);
		setExpenses(records.expenses);
		setInstallmentCategories(records.installmentCategories);
		const recordInstallments = records.installmentCategories.map(cat => cat.installments).flat();
		setInstallments(recordInstallments);

		setResume(records.savings, recordInstallments, records.incomes, records.expenses);
	}
	
	const setResume = (sav, inst, inc, exp) => {
		const { balanceValue, totalInstallmentsValue, totalSavingsValue, totalAvailableMonthValue, totalIncomeValue, totalExpenseValue } = calcResume(sav, inst, inc, exp);
		
		setBalance(balanceValue);
		setTotalInstallment(totalInstallmentsValue);
		setTotalSaving(totalSavingsValue);
		setTotalAvailableMonth(totalAvailableMonthValue);
		setTotalIncome(totalIncomeValue);
		setTotalExpense(totalExpenseValue);
	}

	const openSavingModal = () => {
		setSavingModalIsOpen(true);
	};

	const closeSavingModal = () => {
		setSavingModalIsOpen(false);
	};

	const openIncomeModal = () => {
		setIncomeModalIsOpen(true);
	};

	const closeIncomeModal = () => {
		setIncomeModalIsOpen(false);
	};

	const openExpenseModal = () => {
		setExpenseModalIsOpen(true);
	};

	const closeExpenseModal = () => {
		setExpenseModalIsOpen(false);
	};

	const openInstallmentCategoryModal = () => {
		setInstallmentCategoryModalIsOpen(true);
	};

	const closeInstallmentCategoryModal = () => {
		setInstallmentCategoryModalIsOpen(false);
	};

	useEffect(
		() => {
			setIsLoaded(false);
			setEnableInsert(false);
			fetchData();
		},
		[ period, submited ]
	);

	// SAVINGS 
	const fetchSavings = async (controlRecordId) => {
		const res = await axios.get(`${base_url}/savings?controlRecordId=${controlRecordId}`, { headers: { Authorization: token }});
		setSavings(res.data);
		setResume(res.data, installments, incomes, expenses);
	}

	const handleSavingSubmit = async (data) => {
		const { id, accountName, totalValue } = data;
		if (!id) {
			await axios.post(`${base_url}/savings`, {
				accountName,
				totalValue: +totalValue,
				controlRecordId,
			}, { headers: { Authorization: token }});
		} else {
			await axios.patch(`${base_url}/savings/${id}`, {
				accountName,
				totalValue: +totalValue,
			}, { headers: { Authorization: token }});
		}
		await fetchSavings(controlRecordId);
	};

	const handleSavingDelete = async (id) => {
		await axios.delete(`${base_url}/savings/${id}`, { headers: { Authorization: token }});
		await fetchSavings(controlRecordId);
	};

	// INCOMES
	const fetchIncomes = async (controlRecordId) => {
		const res = await axios.get(`${base_url}/incomes?controlRecordId=${controlRecordId}`, { headers: { Authorization: token }});
		setIncomes(res.data);
		setResume(savings, installments, res.data, expenses);
	}

	const handleIncomeSubmit = async (data) => {
		const { id, accountName, totalValue, dayOfReceipt, fixed } = data;
		if (!id) {
			await axios.post(`${base_url}/incomes`, {
				accountName,
				totalValue: +totalValue,
				dayOfReceipt: dayOfReceipt ? +dayOfReceipt : null,
				fixed,
				controlRecordId,
			}, { headers: { Authorization: token }});
		} else {
			await axios.patch(`${base_url}/incomes/${id}`, {
				accountName,
				totalValue: +totalValue,
				dayOfReceipt: dayOfReceipt ? dayOfReceipt : null,
				fixed
			}, { headers: { Authorization: token }});
		}
		await fetchIncomes(controlRecordId);
	};

	const handleIncomeDelete = async (id) => {
		await axios.delete(`${base_url}/incomes/${id}`, { headers: { Authorization: token }});
		await fetchIncomes(controlRecordId);
	};

	// EXPENSES
	const fetchExpenses = async (controlRecordId) => {
		const res = await axios.get(`${base_url}/expenses?controlRecordId=${controlRecordId}`, { headers: { Authorization: token }});
		setExpenses(res.data);
		setResume(savings, installments, incomes, res.data);
	}

	const handleExpenseSubmit = async (data) => {
		const { id, description, totalValue, dueDay, dueMonth, status } = data;
		if (!id) {
			await axios.post(`${base_url}/expenses`, {
				description,
				totalValue: +totalValue,
				dueDay: dueDay ? +dueDay : '',
				dueMonth: +dueMonth,
				status,
				controlRecordId,
			}, { headers: { Authorization: token }});
		} else {
			await axios.patch(`${base_url}/expenses/${id}`, {
				description,
				totalValue: +totalValue,
				dueDay: dueDay ? +dueDay : null,
				dueMonth: +dueMonth,
				status
			}, { headers: { Authorization: token }});
		}
		await fetchExpenses(controlRecordId);
	};

	const handleExpenseDelete = async (id) => {
		await axios.delete(`${base_url}/expenses/${id}`, { headers: { Authorization: token }});
		await fetchExpenses(controlRecordId);
	};

	// INSTALLMENT CATEGORIES
	const fetchInstallmentCategories = async (controlRecordId) => {
		const res = await axios.get(`${base_url}/installment-categories?controlRecordId=${controlRecordId}`, { headers: { Authorization: token }});
		setInstallmentCategories(res.data);
	}

	const handleInstallmentCategorySubmit = async (data) => {
		const { id, description, dueDay, dueMonth } = data;
		if (!id) {
			await axios.post(`${base_url}/installment-categories`, {
				description,
				dueDay: dueDay ? +dueDay : '',
				dueMonth: +dueMonth,
				controlRecordId,
			}, { headers: { Authorization: token }});
		} else {
			await axios.patch(`${base_url}/installment-categories/${id}`, {
				description,
				dueDay: dueDay ? +dueDay : null,
				dueMonth: +dueMonth,
			}, { headers: { Authorization: token }});
		}
		await fetchInstallmentCategories(controlRecordId);
	};

	const handleInstallmentCategoryDelete = async (id) => {
		await axios.delete(`${base_url}/installment-categories/${id}`, { headers: { Authorization: token }});
		await fetchInstallmentCategories(controlRecordId);
	};

	// INSTALLMENTS
	const fetchInstallments = async (controlRecordId) => {
		const res = await axios.get(`${base_url}/installments?controlRecordId=${controlRecordId}`, { headers: { Authorization: token }});
		setInstallments(res.data);
		setResume(savings, res.data, incomes, expenses);
	}

	const handleInstallmentSubmit = async (data) => {
		const { id, description, value, installment, totalInstallments, installmentCategoryId } = data;
		if (!id) {
			await axios.post(`${base_url}/installments`, {
				description,
				value,
				installment,
				totalInstallments,
				installmentCategoryId
			}, { headers: { Authorization: token }});
		} else {
			await axios.patch(`${base_url}/installments/${id}`, {
				description,
				value,
				installment,
				totalInstallments
			}, { headers: { Authorization: token }});
		}
		await fetchInstallments(controlRecordId);
	};

	const handleInstallmentDelete = async (id) => {
		await axios.delete(`${base_url}/installments/${id}`, { headers: { Authorization: token }});
		await fetchInstallments(controlRecordId);
	};

	const createControlRecord = async () => {
		const year = period.split('-')[0];
		const month = period.split('-')[1];
		
		await axios.post(`${base_url}/control-records`, {
			year,
			month,
		}, {
			headers: {
				Authorization: token
			}
		});

		setSubmited(submited ? false : true);
		setEnableInsert(false);
	}

	const fetchData = async () => {
		const year = period.split('-')[0];
		const month = period.split('-')[1];

		try {
			const result = await axios.get(`${base_url}/control-records?month=${month}&year=${year}`, {
				headers: {
					Authorization: token
				}
			});
			setEnableInsert(false);
			let json = result.data;
			setControlRecordId(json.id);

			setData(json);
			setIsLoaded(true);
		} catch (err) {
			setEnableInsert(true);

			// setSavings([]);
			// setExpenses([]);
			// setIncomes([]);

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

			<SavingModal token={token} isOpen={savingModalIsOpen} onRequestClose={closeSavingModal} edicao={false} onSubmit={handleSavingSubmit} />
			<IncomeModal token={token} isOpen={incomeModalIsOpen} onRequestClose={closeIncomeModal} edicao={false} onSubmit={handleIncomeSubmit} />
			<ExpenseModal token={token} isOpen={expenseModalIsOpen} onRequestClose={closeExpenseModal} edicao={false} onSubmit={handleExpenseSubmit} />
			<InstallmentCategoryModal token={token} isOpen={installmentCategoryModalIsOpen} onRequestClose={closeInstallmentCategoryModal} edicao={false} onSubmit={handleInstallmentCategorySubmit} />
			
			{enableInsert && (
				<div className="actions">
					<Button text={`Iniciar cadastro de registros para ${moment(`${period}-01`).format('MMMM/YYYY')}`} handleClick={createControlRecord} />
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
						token={token}
						
						savings={savings}
						totalSaving={totalSaving}
						incomes={incomes} 
						totalIncome={totalIncome} 
						expenses={expenses}
						totalExpense={totalExpense}
						installmentCategories={installmentCategories}
						installments={installments}
						
						openSavingModal={openSavingModal}
						onSavingSubmit={handleSavingSubmit}
						onSavingDelete={handleSavingDelete} 

						openIncomeModal={openIncomeModal}
						onIncomeSubmit={handleIncomeSubmit}
						onIncomeDelete={handleIncomeDelete} 

						openExpenseModal={openExpenseModal}
						onExpenseSubmit={handleExpenseSubmit}
						onExpenseDelete={handleExpenseDelete}

						openInstallmentCategoryModal={openInstallmentCategoryModal}
						onInstallmentCategorySubmit={handleInstallmentCategorySubmit}
						onInstallmentCategoryDelete={handleInstallmentCategoryDelete}

						onInstallmentSubmit={handleInstallmentSubmit}
						onInstallmentDelete={handleInstallmentDelete}
					/>
				</>
			)}
		</div>
	);
}
