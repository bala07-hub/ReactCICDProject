# --------------------------------------------------------------------------------
# Stage 1: Build Stage (Handles Dependencies and React Compilation)
# --------------------------------------------------------------------------------
    FROM node:20-alpine AS builder

    # Set the working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json
    COPY package*.json ./
    
    # Install dependencies. This installs all devDependencies required for the build.
    RUN npm install
    
    # *** FIX: Explicitly install autoprefixer to resolve the missing module error ***
    RUN npm install autoprefixer
    
    # Copy the rest of the application source code
    COPY . .
    
    # CRITICAL: Build the React application into static files.
    # For Vite, this creates a 'dist' folder by default.
    RUN npm run build
    
    # --------------------------------------------------------------------------------
    # Stage 2: Production Stage (Minimal Server and Built Assets)
    # --------------------------------------------------------------------------------
    FROM node:20-alpine AS final
    
    # Install 'serve' globally to act as the lightweight web server
    RUN npm install -g serve
    
    # Set the working directory
    WORKDIR /app
    
    # *** FIX APPLIED HERE: Changed 'build' to 'dist' ***
    # Copy the built application from the 'builder' stage's /app/dist directory
    COPY --from=builder /app/dist ./dist
    
    # Expose the port the server will run on
    EXPOSE 3000
    
    # *** FIX APPLIED HERE: Changed 'build' to 'dist' ***
    # Run the 'serve' command to host the built application from the 'dist' folder.
    CMD ["serve", "-s", "dist", "-l", "3000"]