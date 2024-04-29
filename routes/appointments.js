import { Router } from 'express';
const router = Router();
import { userData } from '../data/index.js';

import * as appointmentData from '../data/appointments.js';



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

router.route('/makeapp/:insid').post(async (req, res) => {
 try {
  const userid = req.session.user._id;
  const insid = req.params.insid;
  const user = await userData.getUserById(userid);

  const { category, appointmentTime, desc, petid } = req.body;
  console.log(category, appointmentTime, desc, userid, petid);
  const newAppointment = await appointmentData.create(category, appointmentTime, desc, insid, userid, petid);
  appointmentData.sendEmail(user.email, user.firstName, new Date(appointmentTime).toLocaleDateString(), new Date(appointmentTime).toLocaleTimeString(), category);

  return res.json(newAppointment);
 } catch (error) {
  return res.status(400).json({ message: error });
 }
});

export default router;