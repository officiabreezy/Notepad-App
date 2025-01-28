const express = require('express');
const {createNote, updateNote, deleteNote, getAllNotes, searchNote, setReminder, shareNoteViaEmail, sharedLink, getNoteviaLink
}= require('../controller/noteController');

const router = express.Router();

router.post('/createNote', createNote);
router.put('/updateNote/:id', updateNote);
router.delete('/deleteNote/:id', deleteNote);
router.get('/allNotes', getAllNotes);
router.get('/searchNote', searchNote);
router.put('/setReminder/:id', setReminder);
router.post('/shareNote/:noteId', shareNoteViaEmail);
router.post('/sharelink/:noteId', sharedLink);
router.get('/sharelink/:token', getNoteviaLink);


module.exports = router;