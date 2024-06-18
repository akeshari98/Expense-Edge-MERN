const express = require("express");
const { createTransactionCtrl,allTransactionsCtrl,singleTransactionsCtrl,deleteTransactionCtrl,updateTransactionCtrl } = require("../../controllers/transactions/transactionsCtrl");
const isLogin = require("../../middlewares/isLogin");

const transactionsRoute = express.Router();


//POST/api/v1/transactions
transactionsRoute.post('/',isLogin,createTransactionCtrl)

//GET/api/v1/transactions
transactionsRoute.get('/',allTransactionsCtrl)

//GET/api/v1/transactions/:id
transactionsRoute.get('/:id',singleTransactionsCtrl)

//DELETE/api/v1/transactions/:id
transactionsRoute.delete('/:id',deleteTransactionCtrl)

//PUT/api/v1/transactions
transactionsRoute.put('/',updateTransactionCtrl)


module.exports = transactionsRoute;