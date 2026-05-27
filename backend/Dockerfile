FROM node:20-slim
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate || true
EXPOSE 4000
CMD ["npm", "run", "dev"]
