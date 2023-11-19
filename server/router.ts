import { Router } from 'express';
import { getAllUsers, deleteAllusers, getUser, saveNewUser, deleteUserByPhoneNumber, userStats } from './controllers/users';
import {
  addMultipleCompostStands,
  addCompostStand,
  deleteAllCompostStands,
  getCompostStands,
  setUsersLocalStand,
  compostStandStats,
  monthlyCompostStandStats,
} from './controllers/compostStands';
import {
  getAllTransactions,
  saveNewTransaction,
  saveDeposit,
  transactionStats,
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

// STATS
router.get('/userStats', userStats)
router.get('/transactionStats', transactionStats)
router.get('/compostStandStats', compostStandStats)
router.get('/monthlyCompostStandStats', monthlyCompostStandStats)

// CLEANUP
router.delete('/users', deleteAllusers);
router.delete('/userByPhoneNumber', deleteUserByPhoneNumber);
router.delete('/deleteAllCompostStands', deleteAllCompostStands)
router.post('/addAllCompostStands', addMultipleCompostStands)

export default router;
