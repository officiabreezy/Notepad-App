const Note = require('../model/noteModel');

const checkPermission = (action) => {
    return async (req, res, next) => {
      
        try {
        const note = await Note.findById(req.params.id);   
        if(!note){
            return res.status(404).json({ message: 'Note not found' });
        } 
        
        const userId = req.user._id.toString();
        const isOwner = note.owner.toString() === userId;
        const collaborators = note.collaborators.find(c => c.user.toString() === userId);
        const role = collaborator ? collaborator.role: null;

        const hasPermission ={
           view:  isOwner || collaborator,
           edit:  isOwner || (role === "edit");
           comment: isOwner || (role === "edit" || role === "comment"),
        };

        if(!hasPermission[action]){
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }

        next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};

module.exports = checkPermission;