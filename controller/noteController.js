const Note = require('../model/noteModel');

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

module.exports = {createNote, updateNote, deleteNote, getAllNotes, searchNote, setReminder};