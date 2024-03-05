const request = require('supertest'); // Libreria para probar APIs
const app = require('../index.js'); // importando todas las rutas
const mongoose = require('mongoose')

const objectToTest = {
    code: "ABCD1555",
    address: "123 Main Street",
    city: "Bogotá",
    state: "Cundinamarca",
    size: 200,
    type: "Casa",
    zip_code: "110111",
    rooms: 4,
    bathrooms: 3,
    parking: true,
    price: 200000000,
    image: "https://example.com/house.jpg"
};

let houseId;
let userToken; 
let userId;

/** Crea un nuevo usuario para obtener un nuevo token de sesión para poder acceder a las rutas protegidas */
describe('POST /login', () => {
    const userData = {
        "id": 78454544555,
        "name": "Frank",
        "lastname": "Underwood",
        "email": "frank_underwood@correo.com",
        "password": "Funderwood"
    }
    // Crea un usuario  en la BD
    it('create a new user in the DB and response with the data', async () => {
        const response = await request(app).post('/user').send(userData)

        userId = response.body._id
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('_id')
        expect(response.body.name).toBe(userData.name)
        expect(response.body.lastname).toBe(userData.lastname)
        expect(response.body.email).toBe(userData.email)
    })
    // Hace un login en la BD para obtener un token de autenticación
    it('Success login with email and password', async () => {        
        const response = await request(app).post('/login').send(userData)
        userToken = response.body.token;
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('token')
        expect(response.body.status).toBe("success")
    })
})

describe('POST /house', () => {
    // Crea una casa en la BD
    it('Create a new house in the DB and response with the data', async () => {
        const response = await request(app).post('/house')
            .send(objectToTest)
            .set('Authorization', 'Bearer ' + userToken)

        houseId = response.body._id;

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('_id')
        expect(response.body.code).toBe(objectToTest.code);
        expect(response.body.address).toBe(objectToTest.address);
        expect(response.body.city).toBe(objectToTest.city);
        expect(response.body.state).toBe(objectToTest.state);
        expect(response.body.size).toBe(objectToTest.size);
        expect(response.body.type).toBe(objectToTest.type);
        expect(response.body.zip_code).toBe(objectToTest.zip_code);
        expect(response.body.rooms).toBe(objectToTest.rooms);
        expect(response.body.bathrooms).toBe(objectToTest.bathrooms);
        expect(response.body.parking).toBe(objectToTest.parking);
        expect(response.body.price).toBe(objectToTest.price);
        expect(response.body.image).toBe(objectToTest.image);
    })

    // Intenta crear una casa con información incorrecta
    it('fails when attempting to create a new house in the database with incorrect data', async () => {
        const incorrectData = {
            ...objectToTest, 
            code: 'fgfgffgfgfgf', 
            city: 'barcelona', 
        }
        const response = await request(app).post('/house')
        .send(incorrectData)
        .set('Authorization', 'Bearer ' + userToken)

        expect(response.body.status).toBe("error")
    })
})

describe('GET /house/:id', () => {
    // Obtiene una casa por su ID 
    it('Responds with an Object that contains an specific house', async () => {
        const response = await request(app)
            .get('/house/'+ houseId)
            .set('Authorization', 'Bearer ' + userToken)

        expect(response.status).toBe(200);
        expect(typeof response.body === "object").toBe(true);
        expect(response.body).toHaveProperty('_id')
        expect(response.body.code).toBe(objectToTest.code);
        expect(response.body.address).toBe(objectToTest.address);
        expect(response.body.city).toBe(objectToTest.city);
        expect(response.body.state).toBe(objectToTest.state);
        expect(response.body.size).toBe(objectToTest.size);
        expect(response.body.type).toBe(objectToTest.type);
        expect(response.body.zip_code).toBe(objectToTest.zip_code);
        expect(response.body.rooms).toBe(objectToTest.rooms);
        expect(response.body.bathrooms).toBe(objectToTest.bathrooms);
        expect(response.body.parking).toBe(objectToTest.parking);
        expect(response.body.price).toBe(objectToTest.price);
        expect(response.body.image).toBe(objectToTest.image);
    })

    // Falla al obtener una casa con información incorrecta
    it('fails when attempting to get an specific house', async () => {
        const response = await request(app)
            .get('/house/********dfdfdf')
            .set('Authorization', 'Bearer ' + userToken)
        
        expect(response.body.status).toBe("error")
    })
})

describe('PATCH /house/:id', () => {
    // Edita una casa 
    it('Update a house', async () => {
        const dataToUpdate = {
            ...objectToTest, 
            code: 'EFGH1555', 
            parking: false, 
            type: 'Apartamento', 
        }

        const response = await request(app)
        .patch('/house/'+ houseId)
        .set('Authorization', 'Bearer ' + userToken)
        .send(dataToUpdate)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('_id')
        expect(response.body.code).toBe(dataToUpdate.code);
        expect(response.body.address).toBe(dataToUpdate.address);
        expect(response.body.city).toBe(dataToUpdate.city);
        expect(response.body.state).toBe(dataToUpdate.state);
        expect(response.body.size).toBe(dataToUpdate.size);
        expect(response.body.type).toBe(dataToUpdate.type);
        expect(response.body.zip_code).toBe(dataToUpdate.zip_code);
        expect(response.body.rooms).toBe(dataToUpdate.rooms);
        expect(response.body.bathrooms).toBe(dataToUpdate.bathrooms);
        expect(response.body.parking).toBe(dataToUpdate.parking);
        expect(response.body.price).toBe(dataToUpdate.price);
        expect(response.body.image).toBe(dataToUpdate.image);
    })

    // Falla cuando se pasa información incorrecta al actualizar una casa
    it('fails whem attempting to update a house with an incorrect data ', async() => {
        const incorrectData = {
            ...objectToTest, 
            code: 'fgfgffgfgfgfgghh', 
        }
        const response = await request(app).patch('/house/' + houseId)
        .send(incorrectData)
        .set('Authorization', 'Bearer ' + userToken)
        console.log(response.body);
        expect(response.body.status).toBe("error")
    })
})


describe('DELETE /house/:id', () => {
    // Elimina una casa por su id
    it('Delete a house with _id', async () => {       
        const response = await request(app)
            .delete('/house/'+ houseId)
            .set('Authorization', 'Bearer ' + userToken)
            
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
    })

    // Falla al eliminar una casa por ID incorrecto
    it('fails when attempting to delete a house with an incorrect_id', async () => {       
        const response = await request(app)
            .delete('/house/*dfdfdfdf8dfdfdfdfdf')
            .set('Authorization', 'Bearer ' + userToken)
            
        expect(response.body.status).toBe("error")
    })
})

/** Elimina el usuario creado */
describe('DELETE /user/:id', () => {
    it('Success delete with _id', async () => {        
        const response = await request(app).delete('/user/'+ userId)
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
    })
})
