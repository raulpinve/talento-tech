const mongoose = require('mongoose') // Importando la libreria

// Creando el modelo de users
const HouseSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, "Debe escribir un título"], 
        minlength: [3, "El título debe tener al menos 3 caracteres"], // Valor mínimo
        maxlength: [80, "El título no puede tener más de 80 caracteres"] // Valor máximo
    }, 
    description: {
        type: String, 
        required: [true, "Debe escribir una descripción"], 
        minlength: [30, "La descripción debe tener al menos 30 caracteres"], // Valor mínimo
        maxlength: [250, "La descripción debe no puede tener más de 250 caracteres"] // Valor máximo
    },
    code: {
        type: String, 
        required: [true, "Debe ingresar un código correcto para la casa."], 
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
        unique: true,
        required: [true, "Debe escribir una dirección"], 
        minlength: [8, "La dirección debe tener al menos 8 caracteres"], // Valor mínimo
        maxlength: [50, "La dirección no puede tener más de 50 caracteres"] // Valor máximo
    },
    state: {
        type: String, 
        required: [true, "Debe seleccionar un departamento."], 
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
    city: {
        type: String, 
        required: [true, "Debe seleccionar una ciudad"], 
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
    size: {
        type: Number, 
        required: [true, "Dígite un tamaño correcto."], 
    }, 
    type: {
        type: String, 
        enum: ['apartamento', 'casa'], // Valores permitidos
        validate: {
            validator: function(value) {
                return ['apartamento', 'casa'].includes(value);
            },
            message: () => `Seleccione un tipo de casa válido`
        }
    },
    zip_code: {
        type: String, 
        required: [true, "Ingrese un código postal válido."], 
    }, 
    rooms: {
        type: Number, 
        required: [true, "Ingrese un número de habitaciiones válido."], 
    }, 
    bathrooms: {
        type: Number, 
        required: [true, "Ingrese un número de baños válido."], 
    }, 
    parking: {
        type: Boolean, 
        required: [true, "Ingrese un valor válido para parqueadero"], 
    }, 
    price: {
        type: Number, 
        required: [true, "Ingrese un valor válido para precio."], 
    }, 
    image: {
        type: String, 
        default: "https://5xhestapzxosdhkf.public.blob.vercel-storage.com/default/image-default-VstYKDNdxDzi1FY1brXHVKT7R2mD6R.jpg"        
    }
})

module.exports = mongoose.model('house', HouseSchema) 
