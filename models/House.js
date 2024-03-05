const mongoose = require('mongoose') // Importando la libreria

// Creando el modelo de users
const HouseSchema = new mongoose.Schema({
    code: {
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: function (v) {
                // Expresión regular para validar cuatro letras seguidas de cuatro números
                return /^[A-Za-z]{4}\d{4}$/.test(v);
            },
            message: props => `${props.value} no es un código válido. Debe tener cuatro letras seguidas de cuatro números.`
        }
    }, 
    address: {
        type: String, 
        required: true,
    },
    city: {
        type: String, 
        required: true, 
        validate: {
            validator: async function(city) {
              // Validacion del departamento
              var response = await fetch('https://api-colombia.com/api/v1/City');
              var cities = await response.json()
              return cities.some(object => object.name.toUpperCase().includes(city.toUpperCase()));
            },
            message: props => `${props.value} no es una Ciudad de Colombia!`
        }
    }, 
    state: {
        type: String, 
        required: true, 
        validate: {
            validator: async function(state) {
              // Validacion del departamento
              var response = await fetch('https://api-colombia.com/api/v1/Department');
              var departments = await response.json()
              return departments.some(department => department.name.toUpperCase().includes(state.toUpperCase()));
            },
            message: props => `${props.value} no es un Departamento de Colombia!`
          }
    }, 
    size: {
        type: Number, 
        required: true, 
    }, 
    type: {
        type: String, 
        required: true, 
    },
    zip_code: {
        type: String, 
        required: true, 
    }, 
    rooms: {
        type: Number, 
        required: true, 
    }, 
    bathrooms: {
        type: Number, 
        required: true, 
    }, 
    parking: {
        type: Boolean, 
        required: true, 
    }, 
    price: {
        type: Number, 
        required: true,
    }, 
    image: {
        type: String
    }
})

module.exports = mongoose.model('house', HouseSchema) 
