const House = require('../models/House')

// Get all houses
exports.getHouses = async (req, res, next) => {
    try{
        let houses = await House.find(); 
        return res.json(houses)
    }catch(error){
        return res.status(400).json({"status" : "error", "message" :"Error obteniendo la información"})      
    }
}

// Get one house 
exports.getOneHouse = async (req, res, next) => {
    try{
        var id = req.params.id
        let house = await House.findById(id); 
        res.json(house);
    }catch(error){
        return res.status(400).json({"status" : "error", "message" :"Error obteniendo la información"})      
    }
}

// Create a house 
exports.createHouse = async (req, res, next) => {
    // Verifica si existe otra casa con el mismo código
    const houseFoundByCode = await House.findOne({code: req.body.code})
    if(houseFoundByCode){
        return res.status(400).json({"status" : "error", "message" :"El código de la casa ya fue registrado"})      
    }

    const houseFoundByAddress = await House.findOne({address: req.body.address})
    if(houseFoundByAddress){
        return res.status(400).json({"status" : "error", "message" :"La dirección ya fue registrada"})      
    }

    let house = House({
        title: req.body.title, 
        description: req.body.description, 
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
        res.json(result)
    }).catch((err) => {
        if(err.name === "ValidationError"){
            let firstErrorMessage;
            const errores = err.errors

            for (const key in errores) {
                if (errores[key].hasOwnProperty('properties')) {
                    firstErrorMessage = errores[key].properties.message;
                    break; 
                }
            }
            res.status(400).json({"status" : "error", "message" : firstErrorMessage})      
        }else{
            res.status(400).json({"status" : "error", "message" : "Ha ocurrido un error interno. Por favor, inténtalo nuevamente."})      
        }
    })
}

// Edit house
exports.editHouse = async (req, res, next) => {
    //Actualiza un usuario
    var id = req.params.id

    // Verifica si existe otra casa con el mismo código
    const houseFoundByCode = await House.findOne({code: req.body.code})
    if(houseFoundByCode && houseFoundByCode._id != id){
        return res.status(400).json({"status" : "error", "message" :"El código de la casa ya fue registrado"})      
    }

    const houseFoundByAddress = await House.findOne({address: req.body.address})
    if(houseFoundByAddress && houseFoundByAddress._id != id){
        return res.status(400).json({"status" : "error", "message" :"La dirección ya fue registrada"})      
    }
    
    // Cuando viene por el body se usa body
    var updateHouse = {
        code: req.body.code, 
        title: req.body.title, 
        description: req.body.description, 
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

    House.findByIdAndUpdate(id, updateHouse, {new: true, runValidators: true}).then((result) => {
        res.json(result)
    }).catch((err) => {
        if(err.name === "ValidationError"){
            let firstErrorMessage;
            const errores = err.errors

            for (const key in errores) {
                if (errores[key].hasOwnProperty('properties')) {
                    firstErrorMessage = errores[key].properties.message;
                    break; 
                }
            }
            res.status(400).json({"status" : "error", "message" : firstErrorMessage})      
        }else{
            res.status(400).json({"status" : "error", "message" : "Ha ocurrido un error interno. Por favor, inténtalo nuevamente."})      
        }
    })
}

// Delete house
exports.deleteHouse = (req, res, next) => {
    var id = req.params.id

    House.deleteOne({_id: id}).then(() => {
        res.status(400).json({"status": "success", "message": "House deleted successfully"})
    }).catch((error) => {
        res.status(400).json({"status": "error", "message": "Error deleting house"})
    })
}

// Update avatar 
exports.updateImage = (req, res, next) => {
    var id = req.params.id;

    House.findByIdAndUpdate(id,  req.body, {new: true}).then((result) => {
        return res.json({"status": "success", "message": "Archivo subido correctamente."})
    }).catch((error) => {
        console.log(error)
        return res.status(400).json({ "status": "error", "message": "Error al subir la imagen de la casa" })
    })

    var id = req.params.id
}