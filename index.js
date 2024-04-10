const express = require('express') //Importo la libreria
const app = express() //Inicializacion de la variable que usara la libreria
const router = express.Router(); // Enrutar los servicios web
const port = process.env.PORT || 3000; // Escuchar la ejecucion del servidor
require('dotenv').config(); // Obtenemos las variables de entorno
const socket = require('socket.io'); // Importamos la libreria socket.io
const http = require('http').Server(app);

// !NOTE: Disabled web socket
// const io = socket(http);
const cors = require('cors')

/** Importamos la libreria server de graphql */
const { createYoga } = require('graphql-yoga')
const schema = require('./graphql/schema')

const DB_URL = process.env.DB_URL || '';
const MessageSchema = require('./models/Message');

const mongoose = require('mongoose'); // Importo la libreria mongoose
mongoose.connect(DB_URL) // Creo la cadena de conexion
// mongoose.set('debug', true);

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Error de conexión a la base de datos:', error);
});
db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});


router.get('/', (req, res) => {
    res.send('Hello world');
})

// !NOTE: Disabled web socket
/** Metodos websocket */
// io.on('connect', (socket) => {
//     // console.log("connected")
//     //Escuchando eventos desde el servidor
//     socket.on('message', (data) => {
//         /** Almacenando el mensaje en la BD */
//         var payload = JSON.parse(data)
//         console.log(payload)
//         /** Lo almaceno en la BD */
//         MessageSchema(payload).save().then((result) => {
//             /** Enviando el mensaje a todos los clientes conectados al websocket */
//             socket.broadcast.emit('message-receipt', result)
//         }).catch((err) => {
//             console.log({"status" : "error", "message" :err.message})
//         })        
//     })

//     socket.on('disconnect', (socket) => {
//         // console.log("disconnect")    
//     })
// })
app.use(cors())
app.use(express.urlencoded({extended: true})) // Acceder a la informacion de las urls
app.use(express.json()) // Analizar informacion en formato JSON

// !NOTE: Disabled web socket
// app.use((req, res, next) => {
//     res.io = io;
//     next();
// })

const userRoutes = require('./routes/UserRoutes');
const houseRoutes = require('./routes/HouseRoutes');
const MessageRoutes = require('./routes/MessageRoutes');

const yoga = new createYoga({ schema })
app.use('/graphql', yoga)

/** Importación de rutas */
app.use(router)
app.use('/uploads', express.static('uploads'))
app.use('/', userRoutes)
app.use('/', houseRoutes)
app.use('/', MessageRoutes)

// Cambiamos http -> app 
app.listen(port, () => {
    console.log('Listen on http://localhost:' + port)
})

module.exports = http