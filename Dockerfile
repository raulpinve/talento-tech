# Seleccionar la imagen
FROM node:20-alpine

# Espacio de trabajo
WORKDIR /app

# Copiamos el archivo package.json
COPY package*.json ./

# Ejecutamos las instalaciones de las dependencias
RUN npm install 

# Copiamos los demas archivos que estan en el proyecto
COPY . ./

# Ejecutamos el proyecto 
CMD ["npm", "start"]