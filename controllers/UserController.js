const User = require('../models/User');
const bcrypt = require('bcrypt');
const authController = require('../controllers/authController');
const auth = new authController();

// Get all user
exports.getAllUsers = async (req, res, next) => {
    //Traer todos los usuarios
    let users = await User.find(); 
    res.json(users)
}

// Get user
exports.getOneUser = async (req, res, next) => {
    //Traer un usuario especifico pasando el ID
    var id = req.params.id
    let user = await User.findById(id); 
    res.json(user)
}

// Create user
exports.createUser = async (req, res, next) => { 
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    // Verifica si existe otra casa con el mismo código
    const userFoundById = await User.findOne({id: req.body.id})
    if(userFoundById){
        return res.status(400).json({"status" : "error", "message" :"La identificación ya fue registrada."})      
    }

    const userFoundByEmail = await User.findOne({email: req.body.email})
    if(userFoundByEmail){
        return res.status(400).json({"status" : "error", "message" :"El e-mail ya fue registrado."})      
    }

    let user = User({
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
}

// Editar usuario
exports.editUser = async (req, res, next) => {
    var id = req.params.id
    
    let hashedPassword; 
    if(req.body.password){
        hashedPassword = await bcrypt.hash(req.body.password, 10)
    }

    // Cuando viene por el body se usa body
    var updateUser = {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword, 
        id: req.body.id
    }

    User.findByIdAndUpdate(id, updateUser, {new: true}).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log(error)
        res.send("Error actualizando el registro")
    })
}

// Delete user
exports.deleteUser = (req, res, next) => {
    var id = req.params.id

    //Puedo establecer cualquier parametro para eliminar
    User.deleteOne({_id: id}).then(() => {
        res.json({"status": "success", "message": "User deleted successfully"})
    }).catch((error) => {
        console.log(error)
        res.json({"status": "failed", "message": "Error deleting user"})
    })
}

// Login user 
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    auth.login(email, password).then((result) => {
        if(result.status == "error"){
            res.status(401).send(result)
        }else{
            res.send(result)
        }
    })
}

// Edit Avatar 
exports.updateAvatar = (req, res, next) => {
    var id = req.params.id

    //Puedo establecer cualquier parametro para eliminar
    User.findByIdAndUpdate(id, req.body, {new: true}).then((result) => {
        return res.send(result)
    }).catch((error) => {
        console.log(error)
        return res.status(400).send({ "status": "error", "message": "Error actualizando el registro" })
    })
}

// Update avatar
// exports.updateAvatar = (req, res, next) => {
//     if(!req.file){
//         return res.status(400).send({ "status": "error", "message": "No se proporcionó ningun archivo" })
//     }

//     var id = req.params.id;

//     var updateUser = {
//         avatar
//         : req.file.path, 
//     }

//     User.findByIdAndUpdate(id, updateUser, {new: true}).then((result) => {
//         return res.send(result)
//     }).catch((error) => {
//         console.log(error)
//         return res.status(400).send({ "status": "error", "message": "Error actualizando el registro" })
//     })
// }