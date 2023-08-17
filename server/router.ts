import { Router } from 'express'
import { saveNewUser, getAllUsers, deleteAllusers, getUserById } from './controllers/users';
import { addCompostStand, getCompostStands } from './controllers/compostStands';

const router = Router();

// USER OPERATIONS
router.get('/users', getAllUsers)
router.post('/user', saveNewUser)
router.post('/userById', getUserById)


// COMPOST STAND OPERATIONS
router.get('/compostStands', getCompostStands)
router.post('/compostStand', addCompostStand)

// CLEANUP
router.delete('/users', deleteAllusers)

export default router;

