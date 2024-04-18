import { Router } from 'express';
const router = Router();

import * as institutionData from '../data/institutions.js';
import * as appointmentData from '../data/appointments.js';
import * as petData from '../data/pets.js';


router.route('/ins/:id').get(async (req, res) => {
 try {
  const appointments = await appointmentData.getAllByInsId(req.params.id);

  res.json(appointments);
 } catch (error) {
  return res.status(400).json({ message: error });
 }
});

router.route('/:id').get(async (req, res) => {
 try {
  const appointments = await appointmentData.get(req.params.id);

  res.json(appointments);
 } catch (error) {
  return res.status(400).json({ message: error });
 }
});

router.route('/makeapp/:userid/:insid').post(async (req, res) => {
 try {
  console.log("jinlailema");

  const { category, appointmentTime, desc } = req.body;
  console.log(category, appointmentTime, desc, req.params.insid, req.params.userid);
  const newAppointment = await appointmentData.create(category, appointmentTime, desc, req.params.insid, req.params.userid, 'petID');

  return res.json(newAppointment);
 } catch (error) {
  return res.status(400).json({ message: error });
 }
});

export default router;