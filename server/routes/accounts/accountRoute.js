const express = require('express');
const { createAccountsCtrl, allAccountsCtrl, singleAccountsCtrl, deleteAccountsCtrl, updateAccountsCtrl } = require('../../controllers/accounts/accountsCtrl');
const { updateUserCtrl } = require('../../controllers/users/usersCtrl');
const isLogin = require('../../middlewares/isLogin');


const accountRoute = express.Router();
createAccountsCtrl

//POST/api/v1/accounts
accountRoute.post('/',isLogin,createAccountsCtrl)

//GET/api/v1/accounts
// accountRoute.get('/', async(req,res)=>{
//     try {
//         res.json({msg:'All account route'})
//     } catch (error) {
//         res.json(error)
//     }
// })
accountRoute.get('/',allAccountsCtrl)

//GET/api/v1/accounts/:id
accountRoute.get('/:id',singleAccountsCtrl)

//DELETE/api/v1/accounts/:id
accountRoute.delete('/:id',deleteAccountsCtrl)

//PUT/api/v1/accounts/:id
accountRoute.put('/:id',updateAccountsCtrl)

module.exports = accountRoute;