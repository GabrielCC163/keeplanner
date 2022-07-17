//const mongoose = require('mongoose');
//const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');
const TransactionModel = require('../models/TransactionModel');

const validatePeriod = (period) => {
	if (typeof period === 'string' && period.length === 7) {
		const part1 = period.split('-')[0];
		const part2 = period.split('-')[1];
		if (part2) {
			if (part1.length === 4 && part2.length === 2) {
				return true;
			}
		}
	}

	return false;
};

const find = async (req, res) => {
	const { period, filter } = req.query;

	if (!period || !validatePeriod(period)) {
		return res.status(400).send({
			success: false,
			message: 'É necessário informar o parâmetro "period", cujo valor deve estar no formato yyyy-mm'
		});
	}

	const condition = filter
		? { description: { $regex: new RegExp(filter), $options: 'i' }, yearMonth: period }
		: { yearMonth: period };

	try {
		const transactions = await TransactionModel.find(condition).sort({ day: 1, category: 1, description: 1 });

		if (transactions.length === 0) {
			return res
				.status(400)
				.send({ success: false, message: `Nenhuma transação encontrada para o período ${period};` });
		}

		return res.send(transactions);
	} catch (error) {
		return res
			.status(500)
			.send({ message: `Erro ao buscar as transações do período ${period}.`, error: error.message });
	}
};

const show = async (req, res) => {
	const { id } = req.params;

	try {
		const transaction = await TransactionModel.findOne({ _id: id });

		if (!transaction) {
			return res.status(400).send({ success: false, message: 'Transação não encontrada.' });
		}

		return res.send(transaction);
	} catch (error) {
		return res.status(500).send({ message: 'Erro ao buscar a transação: ' + error.message });
	}
};

const create = async (req, res) => {
	const { type, description, category, value, date } = req.body;

	if (!type || !description || !category || !value || !date) {
		return res.status(400).send({
			success: false,
			message:
				'Obrigatório todos os dados: "type" (- ou +), "description", "category", "value" (maior que zero), "date" (yyyy-mm-dd).'
		});
	}

	if (type !== '+' && type !== '-') {
		return res.status(400).send({ success: false, message: 'Dado "type" precisa ser "+" ou "-".' });
	}

	if (parseInt(value) <= 0) {
		return res.status(400).send({ success: false, message: 'Dado "value" precisa ser maior que zero.' });
	}

	if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
		return res.status(400).send({ success: false, message: 'Dado "date" precisa estar no formato "yyyy-mm-dd".' });
	}

	const year = date.split('-')[0];
	const month = date.split('-')[1];
	const day = date.split('-')[2];
	const yearMonth = `${year}-${month}`;

	try {
		const transaction = new TransactionModel({
			type,
			description,
			category,
			value,
			yearMonth,
			yearMonthDay: date,
			year,
			month,
			day
		});

		await transaction.save();

		return res.status(200).send(transaction);
	} catch (error) {
		return res.status(500).send({ message: 'Não foi possível cadastrar a transação.', error: error.message });
	}
};

const update = async (req, res) => {
	const obj = req.body;

	if (!obj) {
		return res.status(400).send({ success: false, message: 'Informe os dados para atualização.' });
	}

	const { id } = req.params;

	if (!id) {
		return res.status(400).send({
			success: false,
			message: 'É obrigatório o parâmetro "id" na URL da requisição. Exemplo /api/transaction/abc123.'
		});
	}

	try {
		const transaction = await TransactionModel.findOneAndUpdate(
			{
				_id: id
			},
			{
				$set: obj
			},
			{ useFindAndModify: false }
		);

		if (!transaction) {
			return res.status(400).send({ success: false, message: 'Transação não encontrada.' });
		}

		return res.send({ success: true, message: 'Transação atualizada com sucesso!' });
	} catch (error) {
		return res
			.status(500)
			.send({ message: `Não foi possível atualizar a transação de ID ${id}.`, error: error.message });
	}
};

const remove = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).send({
			success: false,
			message: 'É obrigatório o parâmetro "id" na URL da requisição. Exemplo /api/transaction/abc123.'
		});
	}

	try {
		const deletedTransaction = await TransactionModel.findOneAndDelete({
			_id: id
		});

		if (!deletedTransaction) {
			return res.status(400).send({ success: false, message: 'Transação não encontrada.' });
		}

		return res.send({ success: true, message: `Transação de ID ${id} removida com sucesso!.` });
	} catch (error) {
		return res
			.status(500)
			.send({ message: `Não foi possível atualizar a transação de ID ${id}.`, error: error.message });
	}
};

const removeAll = async (req, res) => {
	try {
		await TransactionModel.deleteMany({});

		return res.send({ success: true, message: 'Transações removidas com sucesso!' });
	} catch (error) {
		return res.status(500).send({ message: 'Não foi possível remover todas as transações', error: error.message });
	}
};

module.exports = { find, show, create, update, remove, removeAll };
