const mongoose = require('mongoose');

noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    categories: { type: String, default: 'General'},
    tags: { type: String, default:'[]'},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // reminder:{
    //      time: {type: Date},
    //      notificationType: {type: String, enum:['app','email','sms'], default: 'email'},
    //      isSent: {type: Boolean, default: false}
    //     }
    },
    {
        timestamps: true,
        versionKey: false
    }
)
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;