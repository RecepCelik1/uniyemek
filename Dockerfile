# Hafif bir Node.js imajı kullan
FROM node:18-alpine

# Çalışma dizinini belirle
WORKDIR /app

# Bağımlılıkları yükle
COPY package.json package-lock.json ./
RUN npm install --production

# Uygulama dosyalarını kopyala
COPY . .

# Portu aç
EXPOSE 8080

# Uygulamayı başlat
CMD ["node", "index.js"]
