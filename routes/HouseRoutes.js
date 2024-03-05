const express = require('express');
const router = express.Router();
const HouseSchema = require('../models/House');
const multer = require('multer');
const UserController = require('../controllers/UserController');
const userController = new UserController();

router.get('/house',  userController.validateToken, async (req, res) => {
    try{
        //Traer todos los usuarios
        let houses = await HouseSchema.find(); 
        res.json(houses)
    }catch(error){
        res.send({"status" : "error", "message" :"Error obteniendo la información"})      
    }
})

router.get('/house/:id', userController.validateToken, async (req, res) => {
    try{
        //Traer un usuario especifico pasando el ID
        var id = req.params.id
        let house = await HouseSchema.findById(id); 
        res.json(house);

    }catch(error){
        res.send({"status" : "error", "message" :"Error obteniendo la información"})      
    }
})

router.post('/house', userController.validateToken, async (req, res) => {

    let house = HouseSchema({
        address: req.body.address,
        city: req.body.city,
        state: req.body.state, 
        size: req.body.size,
        type: req.body.type,
        zip_code: req.body.zip_code,
        rooms: req.body.rooms,
        bathrooms: req.body.bathrooms,
        parking: req.body.parking,
        price: req.body.price,
        code: req.body.code,
        image: req.body.image
    })

    house.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        if(err.code == 11000){
            res.send({"status" : "error", "message" :"El código ya fue registrado"})      
        }else{
            res.send({"status" : "error", "message" :"Error almacenando la informacion"})      
        }
    })
})

router.patch('/house/:id', userController.validateToken, (req, res) => {
    //Actualizar un usuario
    // Cuando viene por la url del servicio web params
    var id = req.params.id
    
    // Cuando viene por el body se usa body
    var updateHouse = {
        code: req.body.code, 
        address: req.body.address,
        city: req.body.city,
        state: req.body.state, 
        size: req.body.size,
        type: req.body.type,
        zip_code: req.body.zip_code,
        rooms: req.body.rooms,
        bathrooms: req.body.bathrooms,
        parking: req.body.parking,
        price: req.body.price,
    }

    HouseSchema.findByIdAndUpdate(id, updateHouse, {new: true, runValidators: true}).then((result) => {
        res.send(result)
    }).catch((error) => {
        res.json({"status": "error", "message": "Error actualizando el registro"})

    })
})

router.delete('/house/:id', userController.validateToken, (req, res) => {
    var id = req.params.id

    //Puedo establecer cualquier parametro para eliminar
    HouseSchema.deleteOne({_id: id}).then(() => {
        res.json({"status": "success", "message": "House deleted successfully"})
    }).catch((error) => {
        res.json({"status": "error", "message": "Error deleting house"})
    })
})

// Configuracione de la libreria multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/house')
    }, 
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true);
    }else{
        cb(new Error('El archivo no es una imagen'))
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload/:id/house',  userController.validateToken, upload.single('file'), (req, res) => {

    if(!req.file){
        return res.status(400).send({ "status": "error", "message": "No se proporcionó ningun archivo" })
    }

    var id = req.params.id;

    var updateHouse = {
        image: req.file.path, 
    }

    HouseSchema.findByIdAndUpdate(id, updateHouse, {new: true}).then((result) => {
        return res.send({"status": "success", "message": "Archivo subido correctamente."})
    }).catch((error) => {
        console.log(error)
        return res.status(400).send({ "status": "error", "message": "Error actualizando el registro" })
    })

})

module.exports = router