# Use Node.js 20 slim as a base image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Set environment variable for the port
ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Build the React application
RUN npm run build

# Install 'serve' globally to serve the build
RUN npm install -g serve

# Use 'serve' to serve the built React application
CMD ["serve", "-s", "build", "-l", "8080"]
