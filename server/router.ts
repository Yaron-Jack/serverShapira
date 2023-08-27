import { Router } from 'express'
import { getAllUsers, deleteAllusers, getUser } from './controllers/users';
import { addCompostStand, getCompostStands } from './controllers/compostStands';

const router = Router();

// USER OPERATIONS
router.get('/users', getAllUsers)
router.post('/user', getUser)


// COMPOST STAND OPERATIONS
router.get('/compostStands', getCompostStands)
router.post('/compostStand', addCompostStand)

// CLEANUP
router.delete('/users', deleteAllusers)

export default router;

