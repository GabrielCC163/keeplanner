const express = require('express');
const transactionController = require('../controllers/transactionController');

const transactionRouter = express.Router();

transactionRouter.get('/', transactionController.find);
transactionRouter.get('/:id', transactionController.show);
transactionRouter.post('/', transactionController.create);
transactionRouter.put('/:id', transactionController.update);
transactionRouter.delete('/:id', transactionController.remove);
transactionRouter.delete('/', transactionController.removeAll);

module.exports = transactionRouter;
