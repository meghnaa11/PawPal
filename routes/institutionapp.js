import { Router } from 'express';

const router = Router();
import xss from 'xss';


import { institutionData, petData, userData } from "../data/index.js";
import * as reviewData from '../data/reviews.js';
import * as appointmentData from '../data/appointments.js';
import moment from 'moment';









router.route('/')
 .get(async (req, res) => {
  if (!req.session.user) {
   return res.redirect("/");
  }


  try {
   const institutions = await institutionData.getAll();


   res.render('institution/index', { institutions: institutions });

  } catch (error) {
   return res.status(400).json({ message: error });
  }



 });

router.route('/myapp').get(async (req, res) => {
 if (!req.session.user) {
  return res.redirect("/");
 }
 try {
  const appointments = await appointmentData.getAllByUserId(req.session.user._id);
  let newapp = [];
  let reviews = [];

  const reviewsarr = await reviewData.getAllByUserId(req.session.user._id);

  for (let i = 0; i < reviewsarr.length; i++) {
   const ins = await institutionData.getInstitutionById(reviewsarr[i].institutionID);
   reviews.push({ review: reviewsarr[i].content, rating: reviewsarr[i].rating, name: ins.name });
  }

  for (let i = 0; i < appointments.length; i++) {
   if (appointments[i].appointment_time < new Date()) {
    continue;
   }
   const institution = await institutionData.getInstitutionById(appointments[i].institutionID);
   const petname = await petData.getPetDetails(appointments[i].petID);

   newapp.push({
    id: appointments[i]._id,
    category: appointments[i].category,
    appointment_time: moment(appointments[i].appointment_time).format('MMMM D, YYYY, h:mm A'),
    description: appointments[i].description,
    institution: institution,
    pet: petname.name,
   });
  }
  res.render('institution/myapp', { appointments: newapp, reviews: reviews });

 } catch (error) {
  return res.status(400).json({ message: error });
 }
});




router.route('/:id').get(async (req, res) => {
 if (!req.session.user) {
  return res.redirect("/");
 }
 const userid = req.session.user._id;
 const insid = req.params.id;
 const isReview = await reviewData.getReviewByuseridinsid(userid, insid);

 try {
  let pets = [];
  const user = await userData.getUserById(userid);
  const petsarr = user.pets;

  for (let i = 0; i < petsarr.length; i++) {
   const pet = await petData.getPetDetails(petsarr[i]);
   pets.push({ name: pet.name, id: petsarr[i] });
  }
  let reviews = [];

  const reviewsarr = await reviewData.getAllByInsId(req.params.id);

  for (let i = 0; i < reviewsarr.length; i++) {
   const user = await userData.getUserById(reviewsarr[i].userID);
   reviews.push({ review: reviewsarr[i].content, rating: reviewsarr[i].rating, name: user.firstName });
  }




  const institution = await institutionData.getInstitutionById(req.params.id);
  res.render('institution/insdesc', { institution: institution, pet: pets, userid: userid, reviews: reviews, isReview: !isReview.found });
 } catch (error) {
  return res.status(400).json({ message: error });
 }
});

router.route('/makereview/:insid').post(async (req, res) => {
 let { review, rating } = req.body;
 review = xss(review);
 const userID = req.session.user._id;
 try {
  await reviewData.create(rating, review, userID, req.params.insid);
  return res.redirect(`/institutionapp/${req.params.insid}`);
 } catch (error) {
  return res.status(400).json({ message: error });
 }
});





export default router;