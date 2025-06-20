const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');
const userController = require("../controllers/userController")
const auth = new authController();

const configMulterUserAvatar = {
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'uploads/house')
        }, 
        filename: function(req, file, cb){
            cb(null, Date.now() + '-' + file.originalname);
        }
    }), 
    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith('image/')){
            cb(null, true);
        }else{
            cb(new Error('El archivo no es una imagen'))
        }
    }
}
const upload = multer(configMulterUserAvatar)

const userController = require('../controllers/userController')

// Get all the users
router.get('/user', auth.validateToken, userController.getAllUsers)

// Get user
router.get('/user/:id', auth.validateToken, userController.getOneUser)

// Create user
router.post('/user', userController.createUser)

// Edit user
router.patch('/user/:id', auth.validateToken, userController.editUser)

// Delete user
router.delete('/user/:id', auth.validateToken, userController.deleteUser)

// Login
router.post('/login', userController.login)

// Subir avatar 
router.post('/upload/:id/user', userController.updateAvatar)

module.exports = router