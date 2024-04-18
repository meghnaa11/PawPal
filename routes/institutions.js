import { Router } from 'express';
const router = Router();

import * as appointmentData from '../data/appointments.js';
import * as institutionData from '../data/institutions.js';
import * as petData from '../data/pets.js';
import moment from 'moment';









router.route('/')
 .get(async (req, res) => {


  try {
   const institutions = await institutionData.getAll();
   res.render('institution/index', { institutions: institutions });
  } catch (error) {
   return res.status(400).json({ message: error });
  }



 });

router.route('/:id').get(async (req, res) => {
 try {
  let petNames = ['cat', 'dog'];
  const institution = await institutionData.get(req.params.id);
  res.render('institution/insdesc', { institution: institution, petNames: petNames });
 } catch (error) {
  return res.status(400).json({ message: error });
 }
});



export default router;