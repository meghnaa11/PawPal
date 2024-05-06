import express from "express";
import multer from 'multer';
import { extname } from 'path';
import { journalData } from "../data/index.js";
import { petData } from "../data/index.js";
import xss from 'xss';
import * as helpers from '../helper.js'



const router = express.Router();

const sanitizeMiddleware = (req, res, next) => {
  req.body = sanitizeEverything(req.body)
  req.params = sanitizeEverything(req.params)
  next()
}

const sanitizeEverything = (obj) => {
  console.log('Inside Sanitize Everything!')
  if (!obj || typeof obj !== 'object'){
      return obj
  }

  const sanitized = {}
  for (const [key, val] of Object.entries(obj)){
      sanitized[key] = xss(val)
  }
  return sanitized
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/assets/journal');
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + extname(file.originalname));
    }
  });

const upload = multer({ storage }).single('image');;

router.route('/newentry').post(sanitizeMiddleware, upload, async (req, res) => {
    const journal = req.body;
    const journalImage = req.file;

    console.log(journal)
    console.log(journalImage)

    if (!req.session.user) {
      return res.status(400).json({error: 'User Not Logged In'})
    }

    if (!journal.content && !journalImage) {
        return res.status(400).json({ error: 'Either content or image is required' });
      }

      if(journal.content){
        journal.content = helpers.sanitizeData(journal.content)
      }

    if(!journalImage){
        journal.content = helpers.sanitizeData(journal.content)
        if (journal.content.trim() === ''){
            return res.status(400).json({error: 'Content can\'t be empty!'})
        }
    }


    try{

    const userId = helpers.validators.checkId ( req.session.user._id)
    const petId = helpers.validators.checkId(journal.pet)

    const journalObj = {content: journal.content, pet: petId, image: journalImage, userID: userId}

      const insertId = await journalData.createJournalEntry(journalObj)

      const j = await journalData.getJournalFromId(insertId)

      if (j.hasImage){
        j.image = j.image.path
      }else{
        j.image = ''
      }

      j.content = helpers.sanitizeData(j.content)

      delete j.userID //removing userId to ensure sensitive data is not passed

      return res.status(200).json(j)

    }catch(error){
      return res.status(400).json({error: error})
    }

})

router.route('/delete').post(sanitizeMiddleware, async (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({error: 'User Not Logged In'})
  }

  const id = req.body.id
  const userId = req.session.user._id

  try{

    const deleted = await journalData.deleteJournalEntry(userId, id)
    if(deleted){
      return res.status(200).json({msg: 'done'})
    }else{
      return res.status(400).json({error: 'Could not delete the journal entry'})
    }

  }catch(error){
    return res.status(400).json({error: error})
  }

})

router.route('/timeline').get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
   }
   const userId = req.session.user._id
  //  console.log(userId)
    const pets = await petData.getAllPetsOfUser(userId)
    let hasPets = true
    if (pets.length == 0){
      hasPets = false
    }
    const journalEntries = await journalData.getAllUserJournalEntries(userId)
    res.render('journal/timeline', {pets: pets, journalEntries: journalEntries, hasPets: hasPets})
})

export default router