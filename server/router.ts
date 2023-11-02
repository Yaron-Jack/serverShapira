import { Router } from 'express';
import { getAllUsers, deleteAllusers, getUser, saveNewUser } from './controllers/users';
import {
  addMultipleCompostStands,
  addCompostStand,
  deleteAllCompostStands,
  getCompostStands,
  setUsersLocalStand,
} from './controllers/compostStands';
import {
  getAllTransactions,
  saveNewTransaction,
  saveDeposit,
} from './controllers/transactions';

const router = Router();

// USER OPERATIONS
router.get('/users', getAllUsers);
router.post('/user', getUser);
router.post('/register', saveNewUser);

// COMPOST STAND OPERATIONS
router.get('/compostStands', getCompostStands);
router.post('/compostStand', addCompostStand);
router.post('/setUsersLocalStand', setUsersLocalStand);

// TRANSACTIONS
router.get('/transactions', getAllTransactions);
router.post('/saveTransaction', saveNewTransaction);
router.post('/deposit', saveDeposit);

// CLEANUP
router.delete('/users', deleteAllusers);
router.delete('/deleteAllCompostStands', deleteAllCompostStands)
router.post('/addAllCompostStands', addMultipleCompostStands)

export default router;
