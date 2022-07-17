const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

let schema = mongoose.Schema({
	description: String,
	value: Number,
	category: String,
	year: Number,
	month: Number,
	day: Number,
	yearMonth: String,
	yearMonthDay: String,
	type: String
});

//to return id instead of _id
schema.plugin(normalize);

const TransactionModel = mongoose.model('transaction', schema);

module.exports = TransactionModel;
