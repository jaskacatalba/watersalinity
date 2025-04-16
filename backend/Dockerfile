# Use the official Node.js image from the Docker registry
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app will run on
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
