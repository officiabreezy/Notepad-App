const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
      content: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now }
});

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    email : { type: String},
    categories: { type: String, default: 'General'},
    tags: { type: String, default:'[]'},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    sharedLinks: [{
        link: String,
        expired: Date,
        permission : { type: String, enum: ['view','edit','public', 'private'], default: 'view' },
    }],
},
    {
        timestamps: true,
        versionKey: false
    }
)
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;