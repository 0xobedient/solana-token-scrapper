# Base image
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

# Start the server
CMD ["node", "dist/main"]
