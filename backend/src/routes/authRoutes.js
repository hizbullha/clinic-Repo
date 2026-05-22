import express from 'express';
import { register, login } from '../controllers/authController.js';
import { AppDataSource } from '../config/data-source.js'; 

const router = express.Router();


router.post('/register', register);
router.post('/login', login);


router.get('/doctors', async (req, res) => {
  try {
    const doctorsList = await AppDataSource.query(
      'SELECT id, name FROM users WHERE role = $1 ORDER BY name ASC',
      ['DOCTOR']
    );
    res.status(200).json(doctorsList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/doctors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await AppDataSource.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name',
      [id]
    );

   
    if (result.length === 0) {
      return res.status(404).json({ message: 'User record not found in system.' });
    }

    res.status(200).json({ 
      message: `Successfully removed ${result[0].name} from database directories.` 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;