const Note = require('../model/noteModel');
const nodemailer = require('nodemailer');
const  express = require('express');
require('dotenv').config();

expiresIn = new Date(Date.now() + 600000);

const createNote = async (req, res) => {
    const { title, content, categories, tags } = req.body;
    try {
        const note = await Note.findOne({title: title});

        if(note){
            return res.status(400).json({ message: 'Note already exists' });
        };

        const newNote = await Note({title, content, categories, tags});
        await newNote.save();

        res.status(201).json(newNote);  
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
};

const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content, categories, tags } = req.body;
    try {
        const updateNote = await Note.findByIdAndUpdate(id,
         { title, content, categories, tags },
         { new: true}
        );

        if(!updateNote){
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(updateNote);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message:"internal server error" + error.message });
    }
};

const deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteNote = await Note.findById(id);

        if(!deleteNote){
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ message:"Note deleted successfully" + deleteNote});
    } catch (error) {
        return res.status(404).json({message:"Internal server error"});
    }
};

const getAllNotes =  async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }

};

const searchNote = async (req, res) => {
    const { query } = req.query;
    try {

        console.log('Query parameters:', req.query);
        const notes = await Note.find({
            $or: [
                { title: new RegExp(query, 'i') },
                { content: new RegExp(query, 'i') },
                { categories: new RegExp(query, 'i') },
                { tags: new RegExp(query, 'i') }
            ]
        })

        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
};

const setReminder = async (req, res) => {
    const {id} = req.params;
    const {time, notificationType} = req.body;

    try {
        if(!time){
            return res.status(400).json({message: "Please provide a time for the reminder"});
        }
        const note = await Note.findById(id);
        if(!note){
            return res.status(404).json({message: "Note not found"});
        }

        note.reminder = {
            time: time,
            notificationType: notificationType || 'email',
            isSent: false,
        };

        await note.save();
        res.status(200).json({message:"reminder set successfully", note});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal Server Error"});
        }   
};

const shareNoteViaEmail = async (req, res) => {
    const  {email, message} = req.body;
    const {noteId} = req.params;

    try {
        const note = await Note.findById(noteId);
        if(!note){
            return res.status(404).json({ message: 'Note not found' });
        }
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.user_email,
                    pass: process.env.user_password,
                }
            });
          
            await transporter.sendMail({
                from: process.env.user_email,
                to: email,
                subject: `Shared Note: ${note.title}`,
                text: `${message}\n\nView Note: ${process.env.BASE_URL}/notes/${noteId}`,
            });
            res.status(200).json({ message: 'Note shared successfully via email!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sharing note via email.' });
    };	
}

const sharedLink = async (req, res) => {
    const { noteId } = req.params;
    const { permission, expiresIn } = req.body;

    try {
       const note = await Note.findById(noteId);
       if(!note) {
        return res.status(404).json({ message: 'Note not found' });
       }

       const expiration = permission === 'public' ? null: expiresIn;

       const link = `${process.env.BASE_URL}/shared-note/${noteId}/${permission}/${expiresIn || "no-expiry"}`;
       

       note.sharedLinks.push({link, expiresIn: expiration, permission });
       await note.save();


       res.status(200).json({ message: 'Shared note link generated', link });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message:"Error generating shareable link" });
    }
};

const getNoteviaLink = async (req, res) => {
    const {token} = req.params.token;
    console.log( req.url, req.params);

    try {
      const note = await Note.findOne({ sharedLink: token}); 
    if(!note){
        console.log("Note not found in DB for token: ",token);
        return res.status(404).json({ message: 'Invalid or expired link' });
    }

    return res.status(200).json({ content: note.content, permission : note.permission });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message:"Error retrieving shared note" });
    }
};

module.exports = {createNote, updateNote, deleteNote, getAllNotes, searchNote, setReminder, shareNoteViaEmail, sharedLink, getNoteviaLink};