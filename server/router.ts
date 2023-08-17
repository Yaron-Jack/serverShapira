import { Router } from 'express'

import { compostStandReqObject } from '../types/compostStand';
import { saveNewUser, getAllUsers, deleteAllusers, getUserById } from './controllers/users';

const router = Router();

// USER OPERATIONS
router.get('/users', getAllUsers)
router.post('/user', saveNewUser)
router.post('/userById', getUserById)


// COMPOST STAND OPERATIONS
// router.post('/compostStand', async (req: RequestBody<compostStandReqObject>, res) => {
//   const { CompostStandId, name } = req.body;
//   try {
//     const stand = await prisma.compostStand.create({
//       data: {
//         CompostStandId, name
//       }
//     });
//     res.status(200).send(stand);
//   } catch (e) {
//     res.status(400);
//     console.log(e);
//   }
// })

router.delete('/users', deleteAllusers)

export default router;

