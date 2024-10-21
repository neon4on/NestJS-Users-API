# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start"]

# Установка nodemon
RUN npm install -g nodemon
