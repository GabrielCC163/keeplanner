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

	const [ currInstallmentPeriod, setCurrInstallmentPeriod ] = useState(currPeriod);
	const [ enableInstPrev, setEnableInstPrev ] = useState(false);
	const [ enableInstNext, setEnableInstNext ] = useState(false);

	const [ disabledPrev, setDisabledPrev ] = useState(false);
	const [ disabledNext, setDisabledNext ] = useState(false);
	const [ enableInsert, setEnableInsert ] = useState(true);
	const [ enableLoadPreviousMonth, setEnableLoadPreviousMonth ] = useState(false);
	
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

	const checkInstPrevNext = (inst, nextMonth) => {
		const prev = new Date(period) < new Date(nextMonth);
		setEnableInstPrev(prev);

		const next = inst.some(i => i.installment < i.totalInstallments)
		setEnableInstNext(next);
	}

	const setData = (records) => {
		setSavings(records.savings);
		setIncomes(records.incomes);
		setExpenses(records.expenses);
		setInstallmentCategories(records.installmentCategories);
		const recordInstallments = records.installmentCategories.map(cat => cat.installments).flat();
		checkInstPrevNext(recordInstallments, currInstallmentPeriod);
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

	const handleSavingSubmit = async (data, newRecord = false) => {
		const { id, accountName, totalValue } = data;
		const currentControlRecordId = data.controlRecordId || controlRecordId;
		if (!id || newRecord) {
			await axios.post(`${base_url}/savings`, {
				accountName,
				totalValue: +totalValue,
				controlRecordId: currentControlRecordId,
			}, { headers: { Authorization: token }});
		} else {
			await axios.patch(`${base_url}/savings/${id}`, {
				accountName,
				totalValue: +totalValue,
			}, { headers: { Authorization: token }});
		}

	 	if (!newRecord) await fetchSavings(currentControlRecordId);
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

	const handleIncomeSubmit = async (data, newRecord = false) => {
		const { id, accountName, totalValue, dayOfReceipt, fixed } = data;
		const currentControlRecordId = data.controlRecordId || controlRecordId;

		if (!id || newRecord) {
			await axios.post(`${base_url}/incomes`, {
				accountName,
				totalValue: +totalValue,
				dayOfReceipt: dayOfReceipt ? +dayOfReceipt : null,
				fixed,
				controlRecordId: currentControlRecordId
			}, { headers: { Authorization: token }});
		} else {
			await axios.patch(`${base_url}/incomes/${id}`, {
				accountName,
				totalValue: +totalValue,
				dayOfReceipt: dayOfReceipt ? dayOfReceipt : null,
				fixed
			}, { headers: { Authorization: token }});
		}

		if (!newRecord) await fetchIncomes(currentControlRecordId);
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

	const handleExpenseSubmit = async (data, newRecord = false) => {
		const { id, description, totalValue, dueDay, dueMonth, status } = data;
		const currentControlRecordId = data.controlRecordId || controlRecordId;
		
		if (!id || newRecord) {
			await axios.post(`${base_url}/expenses`, {
				description,
				totalValue: +totalValue,
				dueDay: dueDay ? +dueDay : '',
				dueMonth: +dueMonth,
				status,
				controlRecordId: currentControlRecordId,
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

		if(!newRecord) await fetchExpenses(currentControlRecordId);
	};

	const handleExpenseDelete = async (id) => {
		await axios.delete(`${base_url}/expenses/${id}`, { headers: { Authorization: token }});
		await fetchExpenses(controlRecordId);
	};

	const handleExpenseStatusChange = async (id, status) => {
		await axios.patch(`${base_url}/expenses/${id}`, { status }, { headers: { Authorization: token }});
		await fetchExpenses(controlRecordId);
	}

	// INSTALLMENT CATEGORIES
	const fetchInstallmentCategories = async (controlRecordId) => {
		const res = await axios.get(`${base_url}/installment-categories?controlRecordId=${controlRecordId}`, { headers: { Authorization: token }});
		setInstallmentCategories(res.data);
	}

	const handleInstallmentCategorySubmit = async (data, newRecord = false) => {
		const { id, description, dueDay, dueMonth } = data;
		const currentControlRecordId = data.controlRecordId || controlRecordId;
		
		let resultId = '';
		if (!id || newRecord) {
			const result = await axios.post(`${base_url}/installment-categories`, {
				description,
				dueDay: dueDay ? +dueDay : '',
				dueMonth: +dueMonth,
				controlRecordId: currentControlRecordId,
			}, { headers: { Authorization: token }});

			resultId = result.data.id;
		} else {
			const result = await axios.patch(`${base_url}/installment-categories/${id}`, {
				description,
				dueDay: dueDay ? +dueDay : null,
				dueMonth: +dueMonth,
			}, { headers: { Authorization: token }});
			
			resultId = result.data.id;
		}

		if (!newRecord) await fetchInstallmentCategories(currentControlRecordId);
		return resultId;
	};

	const handleInstallmentCategoryDelete = async (id) => {
		await axios.delete(`${base_url}/installment-categories/${id}`, { headers: { Authorization: token }});
		await fetchInstallmentCategories(controlRecordId);
		await fetchInstallments(controlRecordId);
	};

	// INSTALLMENTS
	const getNextMonthsInstallments = () => {
		const updatedInstCat = installmentCategories.map(cat => {
			const instCatDueDay = cat.dueDay || 10;
			const instCatDueMonth = cat.dueMonth;
			const nextInstCatDueDate = moment(`2022-${instCatDueMonth}-${instCatDueDay}`).add(1, 'months').format('DD-MM');
			cat.dueDay = cat.dueDay ? +nextInstCatDueDate.split('-')[0] : null;
			cat.dueMonth = +nextInstCatDueDate.split('-')[1];
			return cat;
		})
		const updatedInst = installments.map(ins => {
			ins.installment++;
			return ins;
		});

		const nextMonth = moment(`${currInstallmentPeriod}-01`).add(1, 'months').format('YYYY-MM');
		setCurrInstallmentPeriod(nextMonth);
		
		checkInstPrevNext(updatedInst, nextMonth);
		setInstallmentCategories(updatedInstCat);
		setInstallments(updatedInst);
	}

	const getPrevMonthsInstallments = () => {
		const updatedInstCat = installmentCategories.map(cat => {
			const instCatDueDay = cat.dueDay || 10;
			const instCatDueMonth = cat.dueMonth;
			const nextInstCatDueDate = moment(`2022-${instCatDueMonth}-${instCatDueDay}`).add(-1, 'months').format('DD-MM');
			cat.dueDay = cat.dueDay ? +nextInstCatDueDate.split('-')[0] : null;
			cat.dueMonth = +nextInstCatDueDate.split('-')[1];
			return cat;
		})

		const updated = installments.map(ins => {
			ins.installment--;
			return ins;
		});

		const prevMonth = moment(`${currInstallmentPeriod}-01`).add(-1, 'months').format('YYYY-MM');
		setCurrInstallmentPeriod(prevMonth);

		checkInstPrevNext(updated, prevMonth);
		setInstallmentCategories(updatedInstCat);
		setInstallments(updated);
	}

	const fetchInstallments = async (controlRecordId) => {
		const res = await axios.get(`${base_url}/installments?controlRecordId=${controlRecordId}`, { headers: { Authorization: token }});
		setInstallments(res.data);
		checkInstPrevNext(res.data, period);
		setResume(savings, res.data, incomes, expenses);
	}

	const handleInstallmentSubmit = async (data, newRecord = false) => {
		const { id, description, value, installment, totalInstallments, installmentCategoryId } = data;
		const currentControlRecordId = data.controlRecordId || controlRecordId;
		
		if (!id || newRecord) {
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
		
		if (!newRecord) await fetchInstallments(currentControlRecordId);
	};

	const handleInstallmentDelete = async (id) => {
		await axios.delete(`${base_url}/installments/${id}`, { headers: { Authorization: token }});
		await fetchInstallments(controlRecordId);
	};

	const createControlRecord = async (loadPrevious = false) => {
		const year = period.split('-')[0];
		const month = period.split('-')[1];
		
		const newControlRecord = await axios.post(`${base_url}/control-records`, {
			year,
			month,
		}, {
			headers: { Authorization: token }
		});

		const jsonControlRecord = newControlRecord.data;

		if (loadPrevious) {
			const prevMonth = await fetchPreviousMonth();
			setEnableInsert(false);
			let json = prevMonth.data;
			setControlRecordId(jsonControlRecord.id);

			// setData(json);
			for await (const saving of json.savings) {
				await handleSavingSubmit({...saving, controlRecordId: jsonControlRecord.id}, true);
			}
			for await (const income of json.incomes) {
				if (income.fixed) {
					await handleIncomeSubmit({...income, controlRecordId: jsonControlRecord.id}, true)
				}
			}
			for await (const expense of json.expenses) {
				const expenseDueDay = expense.dueDay || 10;
				const expenseDueMonth = expense.dueMonth;
				const nextExpenseDueDate = moment(`2022-${expenseDueMonth}-${expenseDueDay}`).add(1, 'months').format('DD-MM');
				expense.dueDay = expense.dueDay ? +nextExpenseDueDate.split('-')[0] : null;
				expense.dueMonth = +nextExpenseDueDate.split('-')[1];
				expense.status = 'AP';
				await handleExpenseSubmit({...expense, controlRecordId: jsonControlRecord.id}, true);
			}

			for await (const installmentCategory of json.installmentCategories) {
				if (installmentCategory.installments?.length > 0) {
					const checkInsertCategory = installmentCategory.installments.some(inst => inst.installment < inst.totalInstallments);
	
					if (checkInsertCategory) {
						const instCatDueDay = installmentCategory.dueDay || 10;
						const instCatDueMonth = installmentCategory.dueMonth;
						const nextInstCatDueDate = moment(`2022-${instCatDueMonth}-${instCatDueDay}`).add(1, 'months').format('DD-MM');
						installmentCategory.dueDay = installmentCategory.dueDay ? +nextInstCatDueDate.split('-')[0] : null;
						installmentCategory.dueMonth = +nextInstCatDueDate.split('-')[1];
		
						const instCatId = await handleInstallmentCategorySubmit({...installmentCategory, controlRecordId: jsonControlRecord.id}, true);
						if (installmentCategory.installments?.length > 0) {
							for await (const installment of installmentCategory.installments) {
								if (installment.installment < installment.totalInstallments) {
									installment.installment++;
									await handleInstallmentSubmit({...installment, installmentCategoryId: instCatId, controlRecordId: jsonControlRecord.id}, true);
								}
							}
						}
					}
				}
			}
		}
		
		setIsLoaded(true);
		setSubmited(submited ? false : true);
		setEnableInsert(false);
	}

	const fetchPreviousMonth = async () => {
		const prevPeriod = moment(`${period}-01`).add(-1, 'months').format('YYYY-MM');
		const year = prevPeriod.split('-')[0];
		const month = prevPeriod.split('-')[1];
		
		try {
			const result = await axios.get(`${base_url}/control-records?month=${month}&year=${year}`, {
				headers: { Authorization: token }
			});
	
			setEnableLoadPreviousMonth(true);
			return result;
		} catch (error) {
			setEnableLoadPreviousMonth(false);
		}
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
			fetchPreviousMonth()
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
		setCurrInstallmentPeriod(selectedPeriod);

		if (`${selectedPeriod}-01` === `${parseInt(currYear) - 1}-01-01`) {
			setDisabledPrev(true);
			setDisabledNext(false);
		}
		if (`${selectedPeriod}-01` === `${parseInt(currYear) + 1}-12-01`) {
			setDisabledNext(true);
			setDisabledPrev(false);
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

			{!enableInsert && <Resume balance={balance} totalInstallment={totalInstallment} totalAvailableMonth={totalAvailableMonth} />}

			<SavingModal token={token} isOpen={savingModalIsOpen} onRequestClose={closeSavingModal} edicao={false} onSubmit={handleSavingSubmit} />
			<IncomeModal token={token} isOpen={incomeModalIsOpen} onRequestClose={closeIncomeModal} edicao={false} onSubmit={handleIncomeSubmit} />
			<ExpenseModal token={token} isOpen={expenseModalIsOpen} onRequestClose={closeExpenseModal} edicao={false} onSubmit={handleExpenseSubmit} />
			<InstallmentCategoryModal token={token} isOpen={installmentCategoryModalIsOpen} onRequestClose={closeInstallmentCategoryModal} edicao={false} onSubmit={handleInstallmentCategorySubmit} />
			
			{enableInsert && (
				<div className="actions">
					<Button text={`Iniciar cadastro de registros para ${moment(`${period}-01`).format('MMMM/YYYY')}`} handleClick={() => createControlRecord(false)} />
					{enableLoadPreviousMonth && (
						<>
							<span style={{margin: '0 15px'}}>ou</span>
							<Button handleClick={ () => createControlRecord(true)} text={'Carregar dados do mês anterior'} />
						</>
					)}
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
						currInstallmentPeriod={currInstallmentPeriod}
						
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
						handleExpenseStatusChange={handleExpenseStatusChange}

						openInstallmentCategoryModal={openInstallmentCategoryModal}
						onInstallmentCategorySubmit={handleInstallmentCategorySubmit}
						onInstallmentCategoryDelete={handleInstallmentCategoryDelete}

						getNextMonthsInstallments={getNextMonthsInstallments}
						getPrevMonthsInstallments={getPrevMonthsInstallments}
						enableInstNext={enableInstNext}
						enableInstPrev={enableInstPrev}
						onInstallmentSubmit={handleInstallmentSubmit}
						onInstallmentDelete={handleInstallmentDelete}
					/>
				</>
			)}
		</div>
	);
}
