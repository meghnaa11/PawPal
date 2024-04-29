import { Router } from 'express';

const router = Router();


import { institutionData, petData, userData } from "../data/index.js";
import * as reviewData from '../data/reviews.js';










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

router.route('/:id').get(async (req, res) => {
 if (!req.session.user) {
  return res.redirect("/");
 }
 const userid = req.session.user._id;

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
  console.log(reviews);




  const institution = await institutionData.getInstitutionById(req.params.id);
  res.render('institution/insdesc', { institution: institution, pet: pets, userid: userid, reviews: reviews });
 } catch (error) {
  return res.status(400).json({ message: error });
 }
});

router.route('/makereview/:insid').post(async (req, res) => {
 const { review, rating } = req.body;
 const userID = req.session.user._id;
 console.log(review, rating, req.params.insid, userID);
 try {
  await reviewData.create(rating, review, userID, req.params.insid);
  return res.redirect(`/institutionapp/${req.params.insid}`);
 } catch (error) {
  return res.status(400).json({ message: error });
 }
});



export default router;