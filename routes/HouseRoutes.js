const express = require('express')
const router = express.Router()
const multer = require('multer')
const houseController = require('../controllers/houseController')
const authController = require('../controllers/authController')
const auth = new authController();

const configMulterHouseImage = {
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
const upload = multer(configMulterHouseImage)

// Get all houses
router.get('/house', auth.validateToken, houseController.getHouses)

// Get house
router.get('/house/:id', auth.validateToken, houseController.getOneHouse)

// Create house 
router.post('/house', auth.validateToken, houseController.createHouse)

// Edit house 
router.patch('/house/:id', auth.validateToken, houseController.editHouse)

// Delete house 
router.delete('/house/:id', auth.validateToken, houseController.deleteHouse)

// Update avatar
router.post('/upload/:id/house', auth.validateToken, houseController.updateImage)

module.exports = router