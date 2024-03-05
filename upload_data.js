const xlsx = require('xlsx') // Importamos la libreria para leer excel
require('dotenv').config(); // Obtenemos las variables de entorno
const DB_URL = process.env.DB_URL || ''; 
const mongoose = require('mongoose'); // Importo la libreria mongoose
mongoose.connect(DB_URL) // Creo la cadena de conexion
const bcrypt = require("bcrypt")

const UserSchema = require('./models/User')  

const wordbook = xlsx.readFile('datos.xlsx') // Leer el archivo
const sheet_list = wordbook.SheetNames // Obtenemos la lista de hojas del excel
const data = xlsx.utils.sheet_to_json(wordbook.Sheets[sheet_list[0]]) // convertimos la información

// Hashemos la contraseña de cada usuario del excel
// for (let user of data){
//     user.email = user.email.trim().toLoweCase()
//     user.password = bcrypt.hashSync(user.password, 10)
// }

// // Subimos la información a la base de datos pasandole el array
// UserSchema.insertMany(data)
// .then(() => {
//     console.log("Información subida exitosamente.")
// })
// .catch(err => {
//     console.log("Error subiendo la información", err)
// })

/* Forma considerando los errores: */ 
for (let user of data){
    user.email = user.email.trim().toLoweCase()
    user.password = bcrypt.hashSync(user.password, 10)

    UserSchema({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        id: user.id,
        password: hashedPassword
    }).save().then((result) => {
        console.log("Usuario subido:", user.name)
    }).catch((err) => {
        console.log("Error subiendo el usuario", user.name)
    })
}