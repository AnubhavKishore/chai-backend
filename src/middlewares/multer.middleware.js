import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    // storage: storage,  // as we are using ES6, it is not required to keep both the key value pairs. WE can just keep a single parameter like below
    
    storage
})