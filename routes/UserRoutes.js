const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserSchema = require('../models/User');
const multer = require('multer');
const UserController = require('../controllers/UserController');
const userController = new UserController();

router.get('/user',  async (req, res) => {
    //Traer todos los usuarios
    let users = await UserSchema.find(); 
    res.json(users)
})

router.get('/user/:id', async (req, res) => {
    //Traer un usuario especifico pasando el ID
    var id = req.params.id
    let user = await UserSchema.findById(id); 
    res.json(user)

    //Traer un usuario pasandole el email
    // const query = UserSchema.where({ email: email });
    // const user = await query.findOne()
})

router.post('/user', async (req, res) => {
    //Crear un usuario
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    let user = UserSchema({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        id: req.body.id,
        password: hashedPassword
    })

    user.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err);
        if(err.code == 11000){
            res.send({"status" : "error", "message" :"El correo ya fue registrado"})      
        }else{
            res.send({"status" : "error", "message" :"Error almacenando la informacion"})      
        }
    })
})

router.patch('/user/:id', (req, res) => {
    //Actualizar un usuario
    // Cuando viene por la url del servicio web params
    var id = req.params.id
    
    // Cuando viene por el body se usa body
    var updateUser = {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        id: req.body.id
    }

    UserSchema.findByIdAndUpdate(id, updateUser, {new: true}).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log(error)
        res.send("Error actualizando el registro")
    })
})

router.delete('/user/:id', (req, res) => {
    
    var id = req.params.id

    //Puedo establecer cualquier parametro para eliminar
    UserSchema.deleteOne({_id: id}).then(() => {
        res.json({"status": "success", "message": "User deleted successfully"})
    }).catch((error) => {
        console.log(error)
        res.json({"status": "failed", "message": "Error deleting user"})
    })

    //Ejemplo 2
    // var name = req.params.name
    // var email = req.params.email
    // var query;
    // if(email != null){
    //     query = {name: name, email: email}
    // }else{
    //     query = {name: name}
    // }
    // //Puedo establecer cualquier parametro para eliminar
    //     UserSchema.deleteOne(query).then(() => {
    //         res.json({"status": "success", "message": "User deleted successfully"})
    //     }).catch((error) => {
    //         console.log(error)
    //         res.json({"status": "failed", "message": "Error deleting user"})
    //     })
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    userController.login(email, password).then((result) => {
        if(result.status == "error"){
            res.status(401).send(result)
        }else{
            res.send(result)
        }
    })
})


// Configuracione de la libreria multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/user')
    }, 
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true);
    }else{
        cb(new Error('El archivo es una imagen'))
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/upload/:id/user', upload.single('file'), (req, res) => {

    if(!req.file){
        return res.status(400).send({ "status": "error", "message": "No se proporcionó ningun archivo" })
    }

    var id = req.params.id;

    var updateUser = {
        avatar
        : req.file.path, 
    }

    UserSchema.findByIdAndUpdate(id, updateUser, {new: true}).then((result) => {
        return res.send(result)
    }).catch((error) => {
        console.log(error)
        return res.status(400).send({ "status": "error", "message": "Error actualizando el registro" })
    })



    res.send({"status": "success", "message": "Archivo subido correctamente."})
})

module.exports = router