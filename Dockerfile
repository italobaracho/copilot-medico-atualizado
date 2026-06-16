# Usar imagem oficial do Node.js
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos do frontend
COPY . .

# Expor a porta que a aplicação Vite roda
EXPOSE 5173

# Rodar em modo dev exposto para conexões externas
CMD ["npm", "run", "dev", "--", "--host"]
