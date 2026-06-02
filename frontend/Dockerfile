# --- Stage 1: Build Stage ---
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Accept the API URL variable from the environment or build process
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Compile the React/Vite code into static files
RUN npm run build

# --- Stage 2: Production Stage ---
FROM nginx:alpine

# Swap the default Nginx config with our SPA router config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled static files from Stage 1 to Nginx's hosting directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
